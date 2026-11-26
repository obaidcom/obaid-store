"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { LoaderCircle, LogOut, Mail, UserRound, ShieldCheck } from "lucide-react";

const governorates = ["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","درعا","السويداء","القنيطرة","دير الزور","الرقة","الحسكة"];

export function AccountPanel() {
  const supabase = useMemo<SupabaseClient | null>(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createClient(url, key) : null;
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [step, setStep] = useState<"details" | "code" | "profile">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => { if (mounted && data.user) { setUser(data.user); setStep("profile"); } });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) setStep("profile");
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [supabase]);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (!supabase) { setError("أضف إعدادات Supabase إلى متغيرات البيئة أولاً."); return; }
    if (mode === "signup" && (!name.trim() || !phone.trim() || !governorate)) { setError("أكمل الاسم ورقم الهاتف والمحافظة."); return; }
    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: mode === "signup", data: mode === "signup" ? { full_name: name.trim(), phone: phone.trim(), governorate } : undefined }
      });
      if (authError) throw authError;
      setStep("code");
      setMessage("أرسلنا رمز التحقق إلى بريدك الإلكتروني. أدخل الرمز المكوّن من 6 أرقام.");
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر إرسال رمز التحقق."); }
    finally { setBusy(false); }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    if (!supabase) return;
    if (!/^\d{6}$/.test(code)) { setError("أدخل رمز التحقق المكوّن من 6 أرقام."); return; }
    setBusy(true);
    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({ email: email.trim(), token: code, type: "email" });
      if (authError) throw authError;
      setUser(data.user);
      setStep("profile");
      setMessage("تم تسجيل الدخول بنجاح.");
    } catch (e) { setError(e instanceof Error ? e.message : "الرمز غير صحيح أو منتهي الصلاحية."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null); setStep("details"); setCode(""); setMessage("تم تسجيل الخروج.");
  }

  if (!supabase) return <div className="m-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900"><b className="block">إعداد الربط مطلوب</b>أضف <code>NEXT_PUBLIC_SUPABASE_URL</code> و<code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> إلى إعدادات المشروع، ثم أعد تشغيل التطبيق لتفعيل الحسابات.</div>;

  if (user && step === "profile") return <section className="space-y-4 p-5">
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white"><UserRound /></div>
      <b className="block text-base">{user.user_metadata?.full_name || "مرحباً بك في متجر عبيد"}</b>
      <span className="mt-1 block text-xs text-slate-600">{user.email}</span>
      <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700"><ShieldCheck size={14}/> حساب موثّق بالبريد الإلكتروني</span>
    </div>
    <div className="rounded-xl border border-blue-100 p-4 text-xs leading-6 text-slate-600">تم تفعيل جلسة حسابك. ستظهر الطلبات والعناوين والمفضلة بعد استكمال ربط وحدات المتجر بقاعدة البيانات.</div>
    <button onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"><LogOut size={16}/> تسجيل الخروج</button>
    <a href="/support" className="block rounded-xl border border-blue-100 p-4 text-sm">الدعم وخدمة العملاء</a>
    <a href="/privacy" className="block rounded-xl border border-blue-100 p-4 text-sm">سياسة الخصوصية</a>
  </section>;

  return <section className="space-y-4 p-5">
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/10 text-blue-700"><UserRound/></div>
      <b className="text-base">أهلاً بك في متجر عبيد</b>
      <p className="mt-2 text-xs leading-6 text-slate-600">أنشئ حسابك أو سجّل الدخول باستخدام رمز تحقق يصل إلى بريدك الإلكتروني.</p>
    </div>
    {step === "details" ? <form onSubmit={sendCode} className="space-y-3">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-blue-50 p-1">
        <button type="button" onClick={()=>setMode("signup")} className={`rounded-lg py-2 text-xs font-bold ${mode==="signup"?"bg-white text-blue-700 shadow-sm":"text-slate-600"}`}>إنشاء حساب</button>
        <button type="button" onClick={()=>setMode("login")} className={`rounded-lg py-2 text-xs font-bold ${mode==="login"?"bg-white text-blue-700 shadow-sm":"text-slate-600"}`}>تسجيل الدخول</button>
      </div>
      {mode === "signup" && <>
        <label className="block text-xs font-semibold text-slate-700">الاسم الكامل<input value={name} onChange={e=>setName(e.target.value)} required className="mt-2 w-full rounded-xl border border-blue-100 bg-white p-3 outline-none focus:border-blue-400"/></label>
        <label className="block text-xs font-semibold text-slate-700">رقم الهاتف<input value={phone} onChange={e=>setPhone(e.target.value)} required type="tel" className="mt-2 w-full rounded-xl border border-blue-100 bg-white p-3 outline-none focus:border-blue-400"/></label>
        <label className="block text-xs font-semibold text-slate-700">المحافظة<select value={governorate} onChange={e=>setGovernorate(e.target.value)} required className="mt-2 w-full rounded-xl border border-blue-100 bg-white p-3 outline-none focus:border-blue-400"><option value="">اختر المحافظة</option>{governorates.map(g=><option key={g} value={g}>{g}</option>)}</select></label>
      </>}
      <label className="block text-xs font-semibold text-slate-700">البريد الإلكتروني<div className="relative mt-2"><Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} required type="email" autoComplete="email" className="w-full rounded-xl border border-blue-100 bg-white p-3 pe-10 outline-none focus:border-blue-400" placeholder="name@example.com"/></div></label>
      <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60">{busy&&<LoaderCircle className="animate-spin" size={16}/>}إرسال رمز التحقق</button>
    </form> : <form onSubmit={verifyCode} className="space-y-3">
      <label className="block text-xs font-semibold text-slate-700">رمز التحقق (6 أرقام)<input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} required inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="mt-2 w-full rounded-xl border border-blue-100 bg-white p-4 text-center text-2xl font-black tracking-[.45em] outline-none focus:border-blue-400" placeholder="••••••"/></label>
      <button disabled={busy || code.length!==6} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-black text-white disabled:opacity-60">{busy&&<LoaderCircle className="animate-spin" size={16}/>}تأكيد الرمز</button>
      <button type="button" onClick={()=>{setStep("details");setCode("");setError("");}} className="w-full py-2 text-xs font-bold text-blue-700">تغيير البريد أو الرجوع</button>
    </form>}
    {message&&<p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs leading-6 text-emerald-800">{message}</p>}
    {error&&<p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs leading-6 text-rose-700">{error}</p>}
  </section>;
}
