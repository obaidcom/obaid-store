"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from "react";
import {
  ArrowRight, UserRound, Package, MapPin, Heart, FileText, ShieldCheck,
  Headphones, Settings, Camera, ChevronLeft, Pencil, ShoppingBag, Clock3,
  Truck, CheckCircle2, LockKeyhole, Mail, Phone, Plus, CircleHelp, WalletCards,
  Save, LogOut, Trash2, Home, Briefcase, KeyRound
} from "lucide-react";
import { getSupabase, hasSupabaseConfig } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Tab = "overview" | "personal" | "orders" | "addresses" | "wishlist" | "invoices" | "security" | "support";
type Profile = { full_name: string; phone: string; governorate: string; default_address: string; avatar_url: string; theme: string };
type Order = { order_number: string | null; tracking_code: string | null; status: string; payment_method: string | null; payment_status: string | null; total: number; created_at: string };
type Address = { id: string; label: string; governorate: string; city: string; details: string; phone: string };

const regions = ["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","دير الزور","الحسكة","الرقة","درعا","السويداء","القنيطرة"];
const emptyProfile: Profile = { full_name: "", phone: "", governorate: "دمشق", default_address: "", avatar_url: "", theme: "blue" };
const nav: { id: Tab; label: string; detail: string; icon: typeof UserRound }[] = [
  { id: "overview", label: "نظرة عامة", detail: "ملخص حسابك", icon: UserRound },
  { id: "personal", label: "المعلومات الشخصية", detail: "بياناتك وطرق التواصل", icon: Settings },
  { id: "orders", label: "طلباتي", detail: "الطلبات وتتبع الشحن", icon: Package },
  { id: "addresses", label: "دفتر العناوين", detail: "المنزل والعمل والتوصيل", icon: MapPin },
  { id: "wishlist", label: "قائمة أمنياتي", detail: "المنتجات المحفوظة", icon: Heart },
  { id: "invoices", label: "الفواتير", detail: "سجل فواتير الشراء", icon: FileText },
  { id: "security", label: "الأمان والخصوصية", detail: "حماية حسابك", icon: ShieldCheck },
  { id: "support", label: "المساعدة والدعم", detail: "نحن هنا لمساعدتك", icon: Headphones },
];

export default function ProfileDashboard() {
  const configured = hasSupabaseConfig();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [orders, setOrders] = useState<Order[]>([]);
  const [active, setActive] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [newAddress, setNewAddress] = useState({ label: "المنزل", governorate: "دمشق", city: "", details: "", phone: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    const supabase = getSupabase();
    let alive = true;
    const load = async (u: User) => {
      const [{ data: row, error: profileError }, { data: orderRows, error: orderError }] = await Promise.all([
        supabase.from("profiles").select("full_name,phone,governorate,default_address,avatar_url,theme").eq("id", u.id).maybeSingle(),
        supabase.from("orders").select("order_number,tracking_code,status,payment_method,payment_status,total,created_at").eq("user_id", u.id).order("created_at", { ascending: false }).limit(30),
      ]);
      if (profileError) throw profileError;
      if (orderError) throw orderError;
      if (!alive) return;
      setUser(u);
      setProfile({ ...emptyProfile, ...(row || {}), full_name: row?.full_name || String(u.user_metadata?.full_name || "") });
      setOrders((orderRows || []) as Order[]);
    };
    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!alive) return;
      if (sessionError) setError(sessionError.message);
      if (data.session?.user) {
        try { await load(data.session.user); } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحميل بيانات الحساب"); }
      }
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      if (!session?.user) { setUser(null); setProfile(emptyProfile); setOrders([]); }
      else { void load(session.user).catch(e => setError(e instanceof Error ? e.message : "تعذر تحديث الحساب")); }
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, [configured]);

  useEffect(() => {
    try {
      const savedAddresses = localStorage.getItem("obaid-store-addresses");
      const savedFavorites = localStorage.getItem("obaid-store-favorites");
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch { /* ignore invalid local cache */ }
  }, []);

  const current = nav.find(item => item.id === active)!;
  const initials = (profile.full_name || user?.email || "ع").trim().slice(0, 1).toUpperCase();
  const invoiceCount = useMemo(() => 0, []);

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: saveError } = await getSupabase().from("profiles").upsert({
        id: user.id, full_name: profile.full_name.trim(), phone: profile.phone.trim(),
        governorate: profile.governorate, default_address: profile.default_address.trim(), theme: profile.theme,
      }, { onConflict: "id" });
      if (saveError) throw saveError;
      setNotice("تم حفظ بيانات الملف الشخصي في قاعدة البيانات.");
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر حفظ البيانات"); }
    finally { setBusy(false); }
  };

  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !user) return;
    if (!file.type.startsWith("image/") || file.size > 3_000_000) { setError("اختر صورة بصيغة صورة وبحجم لا يتجاوز 3 ميغابايت."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = getSupabase();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = user.id + "/" + Date.now() + "-" + safeName;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: true });
      if (uploadError) throw uploadError;
      const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      const { error: saveError } = await supabase.from("profiles").upsert({ id: user.id, avatar_url: url }, { onConflict: "id" });
      if (saveError) throw saveError;
      setProfile(p => ({ ...p, avatar_url: url }));
      setNotice("تم رفع الصورة الشخصية وحفظها.");
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر رفع الصورة. تحقق من إعدادات مساحة avatars."); }
    finally { setBusy(false); }
  };

  const addAddress = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const item: Address = { ...newAddress, id: String(Date.now()) };
    const next = [item, ...addresses];
    setAddresses(next);
    try { localStorage.setItem("obaid-store-addresses", JSON.stringify(next)); } catch { setError("تعذر حفظ العنوان على هذا الجهاز."); return; }
    setNewAddress({ label: "المنزل", governorate: profile.governorate || "دمشق", city: "", details: "", phone: profile.phone || "" });
    setNotice("تم حفظ العنوان على هذا الجهاز.");
  };

  const removeAddress = (id: string) => {
    const next = addresses.filter(a => a.id !== id);
    setAddresses(next);
    try { localStorage.setItem("obaid-store-addresses", JSON.stringify(next)); } catch { setError("تعذر تحديث دفتر العناوين."); }
  };

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) { setError("كلمة المرور يجب أن تتكون من 8 أحرف على الأقل."); return; }
    if (password !== confirmPassword) { setError("تأكيد كلمة المرور غير مطابق."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: updateError } = await getSupabase().auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword(""); setConfirmPassword(""); setNotice("تم تحديث كلمة المرور بنجاح.");
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر تحديث كلمة المرور"); }
    finally { setBusy(false); }
  };

  const signOut = async () => { await getSupabase().auth.signOut(); window.location.href = "/"; };

  if (loading) return <main dir="rtl" className="min-h-screen bg-[#f3f6fc] p-8 text-center text-slate-600">جارٍ تحميل حسابك...</main>;

  if (!configured || !user) return (
    <main dir="rtl" className="min-h-[65vh] bg-[#f3f6fc] px-4 py-12">
      <section className="mx-auto flex w-full max-w-md flex-col items-center rounded-[28px] border border-blue-100 bg-white p-7 text-center shadow-[0_18px_60px_rgba(15,55,110,.10)] sm:p-9">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-700"><UserRound size={30}/></span>
        <p className="mt-5 text-xs font-black tracking-wide text-blue-600">OBAID STORE</p>
        <h1 className="mt-2 text-2xl font-black text-[#10213e]">مرحباً بك في عبيد ستور</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">سجّل الدخول أو أنشئ حساباً للوصول إلى ملفك الشخصي وطلباتك.</p>
        <div className="mt-7 grid w-full gap-3">
          <Link href="/account" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700">تسجيل الدخول <ChevronLeft size={17}/></Link>
          <Link href="/account?mode=signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-800 transition hover:bg-blue-100">إنشاء حساب جديد <UserRound size={17}/></Link>
        </div>
        {!configured && <p className="mt-4 text-xs text-amber-700">تسجيل الدخول غير متاح حالياً بسبب إعدادات الاتصال.</p>}
        <Link href="/" className="mt-6 text-xs font-bold text-slate-400 transition hover:text-blue-700">العودة إلى المتجر</Link>
      </section>
    </main>
  );

  return (
    <main dir="rtl" className="min-h-screen bg-[#f3f6fc] pb-12 text-slate-800">
      <div className="bg-[#0c1d3a] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-100 hover:text-white"><ArrowRight size={17}/> العودة إلى المتجر</Link>
          <span className="text-xs text-blue-200">مركز حسابك الشخصي</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:pt-9">
        <div className="mb-6"><p className="text-xs font-black text-blue-600">OBAID STORE / MY ACCOUNT</p><h1 className="mt-2 text-2xl font-black text-[#10213e] sm:text-3xl">حسابي الشخصي</h1><p className="mt-2 text-sm text-slate-500">بياناتك وطلباتك وعناوينك وخدمات الحساب في مكان واحد.</p></div>
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-[#0b1834] via-[#123a78] to-[#2874e8] p-5 text-white shadow-xl shadow-blue-100 sm:p-8">
          <div className="absolute -left-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5"/>
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-[25px] border-2 border-white/40 bg-white/15 text-3xl font-black sm:h-24 sm:w-24">{profile.avatar_url ? <img src={profile.avatar_url} alt="الصورة الشخصية" className="h-full w-full object-cover"/> : initials}</div>
                <label className="absolute -bottom-2 -left-2 grid h-8 w-8 cursor-pointer place-items-center rounded-xl border-2 border-[#17458d] bg-white text-blue-700 shadow" title="تغيير الصورة"><Camera size={15}/><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadAvatar} disabled={busy}/></label>
              </div>
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-xl font-black sm:text-2xl">{profile.full_name || "مرحباً بك"}</h2><span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/15 px-2.5 py-1 text-[10px] font-bold text-emerald-100"><CheckCircle2 size={12}/> حساب مسجل</span></div><p className="mt-1 max-w-[260px] truncate text-sm text-blue-100 sm:max-w-none">{user.email}</p><button onClick={() => setActive("personal")} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white/90"><Pencil size={13}/> تعديل الملف الشخصي</button></div>
            </div>
            <button onClick={signOut} className="inline-flex items-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 sm:self-auto"><LogOut size={15}/> تسجيل الخروج</button>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="px-3 pb-3 pt-2"><p className="text-[10px] font-black tracking-wider text-slate-400">إدارة الحساب</p><p className="mt-1 text-sm font-black text-slate-800">القائمة الشخصية</p></div>
            <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
              {nav.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => { setActive(item.id); setNotice(""); setError(""); }} className={`flex min-w-0 items-center gap-2.5 rounded-2xl px-3 py-3 text-right transition ${active === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active === item.id ? "bg-white/15" : "bg-slate-100"}`}><Icon size={17}/></span><span className="min-w-0"><b className="block truncate text-xs">{item.label}</b><small className={`mt-0.5 hidden text-[10px] sm:block ${active === item.id ? "text-blue-100" : "text-slate-400"}`}>{item.detail}</small></span><ChevronLeft className="mr-auto hidden shrink-0 opacity-60 lg:block" size={15}/></button>; })}
            </nav>
            <div className="mt-3 rounded-2xl bg-[#f3f7ff] p-3"><div className="flex items-center gap-2 text-blue-700"><CircleHelp size={17}/><b className="text-xs">تحتاج إلى مساعدة؟</b></div><p className="mt-1 text-[11px] leading-5 text-slate-500">انتقل إلى قسم الدعم أو اكتب استفسارك عبر قنوات التواصل المتاحة.</p></div>
          </aside>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-100 pb-5"><div><p className="text-[10px] font-black text-blue-600">حسابي / {current.label}</p><h2 className="mt-1 text-xl font-black text-[#10213e]">{current.label}</h2><p className="mt-1 text-xs text-slate-500">{current.detail}</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">{(() => { const Icon = current.icon; return <Icon size={21}/>; })()}</span></div>

            {active === "overview" && <><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{icon:Package,label:"إجمالي الطلبات",value:String(orders.length)},{icon:Clock3,label:"قيد المتابعة",value:String(orders.filter(o => !["delivered","cancelled"].includes(o.status)).length)},{icon:Heart,label:"المفضلة",value:String(favorites.length)},{icon:WalletCards,label:"الفواتير",value:String(invoiceCount)}].map(card => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><Icon size={17}/></span><p className="mt-3 text-xs font-bold text-slate-500">{card.label}</p><b className="mt-1 block text-2xl font-black text-[#10213e]">{card.value}</b></div>; })}</div><div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => setActive("orders")} className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-right"><span className="flex items-center gap-3"><Truck className="text-blue-700"/><span><b className="block text-sm">تتبع طلباتك</b><small className="mt-1 block text-xs text-slate-500">تابع حالة الطلب حتى التسليم</small></span></span><ChevronLeft className="text-blue-600"/></button><button onClick={() => setActive("addresses")} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-right"><span className="flex items-center gap-3"><MapPin className="text-blue-700"/><span><b className="block text-sm">عناوين التوصيل</b><small className="mt-1 block text-xs text-slate-500">إدارة عناوينك المحفوظة</small></span></span><ChevronLeft className="text-slate-400"/></button></div><div className="mt-6 rounded-2xl border border-slate-100 p-4"><b className="text-sm">أحدث الطلبات</b>{orders.slice(0,3).length ? orders.slice(0,3).map(o => <div key={o.tracking_code || o.order_number} className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs"><span><b className="block">{o.order_number || o.tracking_code || "طلب"}</b><small className="mt-1 block text-slate-400">{new Date(o.created_at).toLocaleDateString("ar-SY")}</small></span><span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">{o.status}</span></div>) : <p className="mt-3 text-xs text-slate-500">لا توجد طلبات مسجلة في هذا الحساب بعد.</p>}</div></>}

            {active === "personal" && <form onSubmit={saveProfile} className="grid max-w-2xl gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold sm:col-span-2">الاسم الكامل<input required value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"/></label><label className="grid gap-2 text-xs font-bold">البريد الإلكتروني<input value={user.email || ""} readOnly className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500"/></label><label className="grid gap-2 text-xs font-bold">رقم الهاتف<input required value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} dir="ltr" className="h-12 rounded-xl border border-slate-200 px-4 text-left text-sm outline-none focus:border-blue-500"/></label><label className="grid gap-2 text-xs font-bold">المحافظة<select value={profile.governorate} onChange={e => setProfile(p => ({ ...p, governorate: e.target.value }))} className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm">{regions.map(r => <option key={r}>{r}</option>)}</select></label><label className="grid gap-2 text-xs font-bold sm:col-span-2">عنوان التوصيل الافتراضي<input value={profile.default_address} onChange={e => setProfile(p => ({ ...p, default_address: e.target.value }))} className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"/></label><button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50 sm:col-span-2"><Save size={16}/> {busy ? "جار الحفظ..." : "حفظ البيانات"}</button></form>}

            {active === "orders" && <div className="space-y-3">{orders.length ? orders.map(o => <article key={o.tracking_code || o.order_number} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold text-slate-400">رقم الطلب</p><b className="mt-1 block text-sm text-slate-900">{o.order_number || o.tracking_code || "—"}</b><small className="mt-1 block text-xs text-slate-400">{new Date(o.created_at).toLocaleString("ar-SY")}</small></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{o.status}</span></div><div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 text-xs sm:grid-cols-3"><span>الإجمالي: <b>{new Intl.NumberFormat("ar-SY").format(Number(o.total) || 0)} ل.س</b></span><span>الدفع: <b>{o.payment_method || "غير محدد"}</b></span><span>حالة الدفع: <b>{o.payment_status || "غير محددة"}</b></span></div>{o.tracking_code && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">رمز التتبع: <b dir="ltr">{o.tracking_code}</b></p>}</article>) : <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-10 text-center"><Package size={30} className="mx-auto text-blue-600"/><b className="mt-3 block">لا توجد طلبات حتى الآن</b><p className="mt-2 text-xs text-slate-500">ستظهر مشترياتك هنا عند تسجيل الطلبات باستخدام هذا الحساب.</p><Link href="/#products" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">ابدأ التسوق</Link></div>}</div>}

            {active === "addresses" && <div className="space-y-4"><form onSubmit={addAddress} className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:grid-cols-2"><label className="grid gap-1 text-xs font-bold">نوع العنوان<select value={newAddress.label} onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-white px-3"><option>المنزل</option><option>العمل</option><option>عنوان آخر</option></select></label><label className="grid gap-1 text-xs font-bold">المحافظة<select value={newAddress.governorate} onChange={e => setNewAddress(a => ({ ...a, governorate: e.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-white px-3">{regions.map(r => <option key={r}>{r}</option>)}</select></label><label className="grid gap-1 text-xs font-bold">المدينة / المنطقة<input required value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-white px-3"/></label><label className="grid gap-1 text-xs font-bold">رقم الهاتف<input value={newAddress.phone} onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))} dir="ltr" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-left"/></label><label className="grid gap-1 text-xs font-bold sm:col-span-2">العنوان بالتفصيل<input required value={newAddress.details} onChange={e => setNewAddress(a => ({ ...a, details: e.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-white px-3"/></label><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-black text-white sm:col-span-2"><Plus size={15}/> إضافة العنوان</button></form><div className="grid gap-3 sm:grid-cols-2">{addresses.map(a => <article key={a.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 font-black text-slate-800">{a.label === "العمل" ? <Briefcase size={17}/> : <Home size={17}/>} {a.label}</span><button onClick={() => removeAddress(a.id)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" aria-label="حذف العنوان"><Trash2 size={16}/></button></div><p className="mt-2 text-xs leading-6 text-slate-600">{a.governorate} - {a.city}<br/>{a.details}</p>{a.phone && <p className="mt-2 text-xs text-slate-500" dir="ltr">{a.phone}</p>}</article>)}</div>{!addresses.length && <p className="text-center text-xs text-slate-500">أضف عنوان المنزل أو العمل أو عنواناً آخر لتسهيل التوصيل. دفتر العناوين الإضافي محفوظ محلياً على هذا الجهاز.</p>}</div>}

            {active === "wishlist" && <div className="rounded-2xl border border-slate-100 p-6 text-center"><Heart size={30} className="mx-auto text-rose-500"/><b className="mt-3 block">قائمة أمنياتك</b><p className="mt-2 text-sm text-slate-500">لديك {favorites.length} منتجاً محفوظاً على هذا الجهاز.</p><Link href="/#products" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">عرض المنتجات في المتجر</Link><p className="mt-3 text-[11px] text-slate-400">قائمة المفضلة الحالية مرتبطة بمتصفح هذا الجهاز وليست متزامنة بعد بين الأجهزة.</p></div>}

            {active === "invoices" && <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-10 text-center"><FileText size={30} className="mx-auto text-blue-600"/><b className="mt-3 block">الفواتير</b><p className="mt-2 text-xs leading-6 text-slate-500">لا توجد فواتير إلكترونية متاحة للعرض حالياً. ستظهر الفاتورة هنا بعد تفعيل إصدار الفواتير وربطها بالطلبات.</p></div>}

            {active === "security" && <div className="max-w-xl space-y-4"><div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-blue-800"><LockKeyhole size={21}/><p className="text-xs leading-6">استخدم كلمة مرور قوية ولا تشارك رمز التحقق مع أي شخص.</p></div><form onSubmit={changePassword} className="grid gap-3"><label className="grid gap-1 text-xs font-bold">كلمة المرور الجديدة<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl border border-slate-200 px-4 text-sm"/></label><label className="grid gap-1 text-xs font-bold">تأكيد كلمة المرور<input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-12 rounded-xl border border-slate-200 px-4 text-sm"/></label><button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><KeyRound size={16}/> تحديث كلمة المرور</button></form><p className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">تغيير البريد الإلكتروني وإعدادات التحقق الإضافية تتم من مزود تسجيل الدخول. لا نعرض كلمة المرور الحالية أو رموز الأمان.</p></div>}

            {active === "support" && <div className="grid gap-3 sm:grid-cols-2"><Link href="/account" className="rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/50"><Headphones className="text-blue-600"/><b className="mt-3 block text-sm">المساعدة بخصوص الحساب</b><p className="mt-1 text-xs leading-6 text-slate-500">افتح صفحة الحساب لتسجيل الدخول أو متابعة مشاكل الوصول.</p></Link><Link href="/#footer" className="rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/50"><Mail className="text-blue-600"/><b className="mt-3 block text-sm">قنوات التواصل</b><p className="mt-1 text-xs leading-6 text-slate-500">انتقل إلى أسفل المتجر لعرض وسائل التواصل المتاحة.</p></Link></div>}
          </section>
        </div>
        {(notice || error) && <div className="mx-auto mt-5 max-w-7xl space-y-2">{notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}{error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}</div>}
      </div>
    </main>
  );
}
