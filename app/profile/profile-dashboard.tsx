"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight, UserRound, Package, MapPin, Heart, FileText, ShieldCheck,
  Headphones, Settings, Camera, ChevronLeft, Pencil, ShoppingBag, Clock3,
  Truck, CheckCircle2, LockKeyhole, Mail, Phone, Plus, CircleHelp, Gift,
  WalletCards
} from "lucide-react";

type ProfileUser = { name: string; email: string; image: string; signedIn: boolean };
type Tab = "overview" | "personal" | "orders" | "addresses" | "wishlist" | "invoices" | "security" | "support";

const menu: { id: Tab; label: string; icon: typeof UserRound; detail: string }[] = [
  { id: "overview", label: "نظرة عامة", icon: UserRound, detail: "ملخص حسابك" },
  { id: "personal", label: "المعلومات الشخصية", icon: Settings, detail: "الاسم وبيانات التواصل" },
  { id: "orders", label: "طلباتي", icon: Package, detail: "تتبع وإدارة مشترياتك" },
  { id: "addresses", label: "دفتر العناوين", icon: MapPin, detail: "عناوين التوصيل" },
  { id: "wishlist", label: "قائمة أمنياتي", icon: Heart, detail: "المنتجات المحفوظة" },
  { id: "invoices", label: "الفواتير", icon: FileText, detail: "فواتير مشترياتك" },
  { id: "security", label: "الأمان والخصوصية", icon: ShieldCheck, detail: "حماية حسابك" },
  { id: "support", label: "المساعدة والدعم", icon: Headphones, detail: "نحن هنا لمساعدتك" },
];

const Empty = ({ icon: Icon, title, desc }: { icon: typeof Package; title: string; desc: string }) => (
  <div className="flex flex-col items-center rounded-3xl border border-dashed border-blue-200 bg-gradient-to-b from-blue-50/70 to-white px-5 py-12 text-center">
    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"><Icon size={28}/></span>
    <h3 className="mt-5 text-base font-black text-slate-800">{title}</h3>
    <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">{desc}</p>
    <Link href="/#products" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100">ابدأ التسوق <ArrowRight size={16}/></Link>
  </div>
);

export default function ProfileDashboard({ user }: { user: ProfileUser }) {
  const [active, setActive] = useState<Tab>("overview");
  const [avatar, setAvatar] = useState(user.image);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = (name || user.email || "ع").trim().slice(0, 1).toUpperCase();

  const heading = menu.find(item => item.id === active);
  const selectTab = (id: Tab) => { setActive(id); setSaved(false); };

  return (
    <main className="min-h-screen bg-[#f4f7fc] pb-14">
      <div className="bg-[#0b1834] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-100 hover:text-white"><ArrowRight size={17}/> العودة إلى المتجر</Link>
          <span className="text-xs text-blue-200">مركز حسابك الشخصي</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10">
        <div className="mb-7">
          <p className="text-xs font-black text-blue-600">OBAID STORE / MY ACCOUNT</p>
          <h1 className="mt-2 text-2xl font-black text-[#10213e] sm:text-3xl">حسابي الشخصي</h1>
          <p className="mt-2 text-sm text-slate-500">كل ما يخص حسابك وطلباتك وعناوين التوصيل في مكان واحد.</p>
        </div>

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-[#0b1834] via-[#123a78] to-[#2874e8] p-5 text-white shadow-xl shadow-blue-100 sm:p-8">
          <div className="absolute -left-10 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5"/>
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <button type="button" onClick={() => fileRef.current?.click()} className="group relative grid h-20 w-20 place-items-center overflow-hidden rounded-[25px] border-2 border-white/40 bg-white/15 text-3xl font-black shadow-xl sm:h-24 sm:w-24" aria-label="تغيير الصورة الشخصية">
                  {avatar ? <span aria-label="الصورة الشخصية" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${avatar}")` }}/> : initials}
                  <span className="absolute inset-0 grid place-items-center bg-slate-950/45 opacity-0 transition group-hover:opacity-100"><Camera size={23}/></span>
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} className="absolute -bottom-2 -left-2 grid h-8 w-8 place-items-center rounded-xl border-2 border-[#17458d] bg-white text-blue-700 shadow" aria-label="رفع صورة"><Camera size={15}/></button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) setAvatar(URL.createObjectURL(f)); }} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-black sm:text-2xl">{name || "مرحباً بك في عبيد ستور"}</h2>
                  {user.signedIn && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-300/15 px-2.5 py-1 text-[10px] font-bold text-emerald-100"><CheckCircle2 size={12}/> حساب مسجل</span>}
                </div>
                <p className="mt-1 max-w-[230px] truncate text-sm text-blue-100 sm:max-w-none">{user.email || "سجّل الدخول للوصول إلى تفاصيل حسابك"}</p>
                <button onClick={() => selectTab("personal")} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white"><Pencil size={13}/> تعديل الملف الشخصي</button>
              </div>
            </div>
            {!user.signedIn ? (
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 sm:max-w-xs">
                <p className="text-sm font-bold">أهلاً بك في حسابك</p>
                <p className="mt-1 text-xs leading-6 text-blue-100">سجّل الدخول لعرض طلباتك وإدارة بياناتك ومتابعة مشترياتك.</p>
                <Link href="/account/login" className="mt-3 inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-black text-blue-800">تسجيل الدخول</Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-blue-100"><ShieldCheck size={17}/> بياناتك محفوظة بأمان</div>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm">
            <div className="px-3 pb-3 pt-2">
              <p className="text-[10px] font-black tracking-wider text-slate-400">إدارة الحساب</p>
              <p className="mt-1 text-sm font-black text-slate-800">القائمة الشخصية</p>
            </div>
            <nav className="grid grid-cols-2 gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {menu.map(item => {
                const Icon = item.icon;
                return <button key={item.id} onClick={() => selectTab(item.id)} className={`flex min-w-0 items-center gap-2.5 rounded-2xl px-3 py-3 text-right transition ${active===item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active===item.id ? "bg-white/15" : "bg-slate-100"}`}><Icon size={17}/></span>
                  <span className="min-w-0"><b className="block truncate text-xs">{item.label}</b><small className={`mt-0.5 hidden text-[10px] sm:block ${active===item.id ? "text-blue-100" : "text-slate-400"}`}>{item.detail}</small></span>
                  <ChevronLeft className="mr-auto hidden shrink-0 opacity-60 lg:block" size={15}/>
                </button>;
              })}
            </nav>
            <div className="mt-3 rounded-2xl bg-[#f3f7ff] p-3">
              <div className="flex items-center gap-2 text-blue-700"><CircleHelp size={17}/><b className="text-xs">تحتاج إلى مساعدة؟</b></div>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">فريق خدمة العملاء جاهز لمساعدتك.</p>
              <Link href="/support" className="mt-2 inline-flex text-xs font-black text-blue-700">تواصل معنا <ChevronLeft size={14}/></Link>
            </div>
          </aside>

          <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div><p className="text-[10px] font-black text-blue-600">حسابي / {heading?.label}</p><h2 className="mt-1 text-xl font-black text-[#10213e]">{heading?.label}</h2><p className="mt-1 text-xs text-slate-500">{heading?.detail}</p></div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">{heading && <heading.icon size={21}/>}</span>
            </div>

            {active === "overview" && <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {icon:Package,label:"إجمالي الطلبات",value:"—",note:"تظهر بعد ربط الطلبات"},
                  {icon:Clock3,label:"طلبات قيد التنفيذ",value:"—",note:"تحديث حالة الطلب"},
                  {icon:Heart,label:"المفضلة",value:"—",note:"منتجاتك المحفوظة"},
                  {icon:WalletCards,label:"الفواتير",value:"—",note:"فواتير مشترياتك"},
                ].map(card=>{const Icon=card.icon;return <div key={card.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><Icon size={17}/></span><p className="mt-3 text-xs font-bold text-slate-500">{card.label}</p><b className="mt-1 block text-2xl font-black text-[#10213e]">{card.value}</b><small className="mt-1 block text-[10px] text-slate-400">{card.note}</small></div>})}
              </div>
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <button onClick={()=>selectTab("orders")} className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-right hover:bg-blue-50"><span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-700"><Truck/></span><span><b className="block text-sm">تتبع طلباتك</b><small className="mt-1 block text-xs text-slate-500">تابع حالة كل طلب من التأكيد حتى التسليم</small></span></span><ChevronLeft className="text-blue-600"/></button>
                <button onClick={()=>selectTab("addresses")} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-right hover:bg-slate-50"><span className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><MapPin/></span><span><b className="block text-sm">عناوين التوصيل</b><small className="mt-1 block text-xs text-slate-500">أضف عنوان المنزل أو العمل</small></span></span><ChevronLeft className="text-slate-400"/></button>
              </div>
              <div className="mt-6"><Empty icon={ShoppingBag} title="لا توجد مشتريات معروضة بعد" desc="عندما تبدأ التسوق وتُسجّل طلباتك، ستجد هنا ملخص مشترياتك وآخر تحديثاتها."/></div>
            </>}

            {active === "personal" && <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-blue-800"><UserRound size={21}/><p className="text-xs leading-6">أكمل بياناتك لتسهيل التواصل وتجهيز طلبات التوصيل. التغييرات هنا معاينة واجهة إلى حين تفعيل حفظ الملف الشخصي في الخادم.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">الاسم الكامل<input value={name} onChange={e=>setName(e.target.value)} placeholder="اكتب اسمك الكامل" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/></label>
                <label className="text-xs font-bold text-slate-700">البريد الإلكتروني<input value={user.email} readOnly placeholder="البريد المرتبط بالحساب" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"/></label>
                <label className="text-xs font-bold text-slate-700">رقم الهاتف<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+963 xxx xxx xxx" dir="ltr" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-left text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/></label>
                <label className="text-xs font-bold text-slate-700">المحافظة<select value={governorate} onChange={e=>setGovernorate(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"><option value="">اختر المحافظة</option>{["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","درعا","السويداء","القنيطرة","دير الزور","الرقة","الحسكة"].map(x=><option key={x}>{x}</option>)}</select></label>
                <label className="text-xs font-bold text-slate-700 sm:col-span-2">المدينة / المنطقة<input value={city} onChange={e=>setCity(e.target.value)} placeholder="المدينة أو المنطقة" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/></label>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3"><button onClick={()=>setSaved(true)} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-100">معاينة حفظ التغييرات</button>{saved&&<span className="text-xs font-bold text-amber-700">تم تحديث المعاينة محلياً فقط؛ الحفظ الدائم يحتاج ربط قاعدة البيانات.</span>}</div>
            </div>}

            {active === "orders" && <Empty icon={Package} title="لا توجد طلبات حتى الآن" desc="ستظهر هنا جميع طلباتك مع رقم الطلب، المنتجات، المبلغ، طريقة الدفع، وحالة الشحن خطوة بخطوة."/>}
            {active === "addresses" && <><div className="mb-4 flex justify-end"><button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white"><Plus size={15}/> إضافة عنوان جديد</button></div><Empty icon={MapPin} title="دفتر العناوين فارغ" desc="احفظ عناوين المنزل والعمل لتختار عنوان التوصيل بسرعة عند إتمام الشراء."/></>}
            {active === "wishlist" && <Empty icon={Heart} title="قائمة أمنياتك فارغة" desc="اضغط على رمز القلب في أي منتج لإضافته إلى قائمتك والعودة إليه لاحقاً."/>}
            {active === "invoices" && <Empty icon={FileText} title="لا توجد فواتير بعد" desc="ستُحفظ فواتير الطلبات المكتملة هنا، مع رقم الفاتورة والتاريخ والإجمالي وإمكانية عرضها أو تنزيلها عند تفعيل نظام الفواتير."/>}
            {active === "security" && <div className="space-y-3">
              {[{icon:LockKeyhole,title:"كلمة المرور",desc:"إدارة كلمة المرور وتحديثها",action:"تغيير كلمة المرور"},{icon:Mail,title:"البريد الإلكتروني",desc:user.email||"لم يتم ربط بريد إلكتروني",action:"إدارة البريد"},{icon:Phone,title:"رقم الهاتف",desc:"إضافة رقم هاتف موثّق",action:"إضافة رقم"}].map(x=>{const Icon=x.icon;return <div key={x.title} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={18}/></span><span><b className="block text-sm">{x.title}</b><small className="mt-1 block text-xs text-slate-500">{x.desc}</small></span></span><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">{x.action}</button></div>})}
              <p className="rounded-xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">خيارات الأمان ظاهرة ضمن تصميم الحساب، وسيتم تفعيل إجراءات تغيير كلمة المرور والتحقق عند اكتمال مزود تسجيل الدخول.</p>
            </div>}
            {active === "support" && <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/support" className="rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/50"><Headphones className="text-blue-600"/><b className="mt-3 block text-sm">تواصل مع الدعم</b><p className="mt-1 text-xs leading-6 text-slate-500">أرسل استفسارك أو اطلب المساعدة.</p></Link>
              <Link href="/terms" className="rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/50"><FileText className="text-blue-600"/><b className="mt-3 block text-sm">الشروط والأحكام</b><p className="mt-1 text-xs leading-6 text-slate-500">اطلع على سياسة استخدام المتجر.</p></Link>
              <Link href="/privacy" className="rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:bg-blue-50/50"><ShieldCheck className="text-blue-600"/><b className="mt-3 block text-sm">الخصوصية</b><p className="mt-1 text-xs leading-6 text-slate-500">تعرف على كيفية التعامل مع بياناتك.</p></Link>
              <div className="rounded-2xl border border-slate-100 p-5"><Gift className="text-blue-600"/><b className="mt-3 block text-sm">العروض والمكافآت</b><p className="mt-1 text-xs leading-6 text-slate-500">سيظهر هنا رصيد النقاط والعروض عند إطلاق البرنامج.</p></div>
            </div>}
          </section>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-400"><span className="inline-flex items-center gap-1"><ShieldCheck size={13}/> حماية وخصوصية</span><span>عبيد ستور © {new Date().getFullYear()}</span><Link href="/privacy" className="hover:text-blue-600">سياسة الخصوصية</Link><Link href="/support" className="hover:text-blue-600">الدعم الفني</Link></div>
      </div>
    </main>
  );
}
