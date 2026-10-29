"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowRight, Camera, CircleUserRound, LockKeyhole, Mail, UserRound, Phone, MapPin, Settings2, PackageSearch, Palette, ShieldCheck, ImagePlus, Save, UserCog } from "lucide-react";

const governorates = ["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","دير الزور","الحسكة","الرقة","درعا","السويداء","القنيطرة"];
const themes = [
  { name: "أزرق عبيد", value: "blue", swatch: "#2563eb" },
  { name: "بنفسجي", value: "violet", swatch: "#7c3aed" },
  { name: "أخضر", value: "green", swatch: "#059669" },
  { name: "خمري", value: "rose", swatch: "#e11d48" },
];

type View = "login" | "signup" | "profile" | "settings" | "tracking";

export function AuthPage() {
  const [view, setView] = useState<View>("login");
  // Connect this gate to the real auth session when authentication is enabled.
  const isAuthenticated = false;
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("دمشق");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [theme, setTheme] = useState("blue");
  const [trackingCode, setTrackingCode] = useState("");
  const [savedNotice, setSavedNotice] = useState("");

  const activeTheme = themes.find((item) => item.value === theme) ?? themes[0];

  const saveAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("يرجى اختيار ملف صورة صالح.");
      event.target.value = "";
      return;
    }
    if (file.size > 3_000_000) {
      setNotice("حجم الصورة كبير؛ الحد الأقصى 3 ميغابايت.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setSavedNotice("تم تحديث معاينة الصورة في هذه الصفحة فقط؛ لم تُرفع إلى خادم.");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("النموذج جاهز للربط، لكن المصادقة غير مفعّلة بعد. لم يتم إنشاء حساب أو تسجيل دخول، ولم تُحفظ كلمة المرور.");
  };

  const submitTracking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("تتبع الطلبات غير متصل بقاعدة البيانات حتى الآن؛ لم يتم إجراء بحث فعلي عن هذا الرقم.");
  };

  const showView = (next: View) => {
    setView(next);
    setNotice("");
    setSavedNotice("");
  };

  const navItems: { id: View; label: string; icon: typeof LockKeyhole }[] = [
    { id: "login", label: "تسجيل الدخول", icon: LockKeyhole },
    { id: "tracking", label: "تتبع الطلب", icon: PackageSearch },
    { id: "settings", label: "تغيير الألوان", icon: Palette },
    { id: "signup", label: "إنشاء حساب", icon: UserRound },
    { id: "profile", label: "ملفي الشخصي", icon: UserCog },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 px-3 py-6 text-slate-100 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white">
          <ArrowRight size={18} /> العودة إلى عبيد ستور
        </Link>

        <section className="overflow-hidden rounded-[28px] border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/30">
          <div className="px-5 py-7 text-white sm:px-8" style={{ background: `linear-gradient(115deg, ${activeTheme.swatch}, #0f172a 125%)` }}>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10">
                {view === "profile" ? <UserCog size={27} /> : view === "settings" ? <Settings2 size={27} /> : view === "tracking" ? <PackageSearch size={27} /> : view === "signup" ? <UserRound size={27} /> : <LockKeyhole size={27} />}
              </div>
              <div>
                <h1 className="text-xl font-black sm:text-2xl">{navItems.find((item) => item.id === view)?.label === "دخول" ? "تسجيل الدخول" : navItems.find((item) => item.id === view)?.label}</h1>
                <p className="mt-1 text-sm leading-6 text-white/80">أنشئ حسابك أو سجّل الدخول للوصول إلى ملفك الشخصي وإعداداتك وطلباتك.</p>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-700 bg-slate-900 px-4 py-4 sm:px-6">
            {isAuthenticated ? (
              <nav aria-label="خيارات الحساب" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {navItems.filter((item) => ["profile", "tracking", "settings"].includes(item.id)).map((item) => {
                  const Icon = item.icon;
                  return <button key={item.id} type="button" onClick={() => showView(item.id)} aria-current={view === item.id ? "page" : undefined} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${view === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><Icon size={17} />{item.label}</button>;
                })}
              </nav>
            ) : (
              <>
                <p className="mb-3 text-center text-sm font-bold text-slate-300">أهلاً بك في عبيد ستور</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => showView("login")} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-extrabold transition ${view === "login" ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "border border-slate-700 bg-slate-950/60 text-slate-200 hover:border-blue-500"}`}><LockKeyhole size={17}/> تسجيل الدخول</button>
                  <button type="button" onClick={() => showView("signup")} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-extrabold transition ${view === "signup" ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "border border-slate-700 bg-slate-950/60 text-slate-200 hover:border-blue-500"}`}><UserRound size={17}/> إنشاء حساب جديد</button>
                </div>
              </>
            )}
          </div>

          <div className="p-4 sm:p-7">
            {(view === "login" || view === "signup") && (
              <>
                <div className="mb-5 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">
                  <div className="flex items-center gap-2 font-extrabold"><ShieldCheck size={17} /> توضيح مهم قبل المتابعة</div>
                  هذه واجهة الحساب قيد الربط. لا تدخل كلمة مرور حقيقية الآن؛ تسجيل الدخول وإنشاء الحساب لن يعملا فعليًا حتى تفعيل المصادقة الآمنة.
                </div>
                <div className="mb-5 flex rounded-xl border border-slate-700 bg-slate-950 p-1">
                  <button type="button" onClick={() => showView("login")} className={`flex-1 rounded-lg px-3 py-3 text-sm font-extrabold ${view === "login" ? "bg-blue-600 text-white" : "text-slate-400"}`}>تسجيل الدخول</button>
                  <button type="button" onClick={() => showView("signup")} className={`flex-1 rounded-lg px-3 py-3 text-sm font-extrabold ${view === "signup" ? "bg-blue-600 text-white" : "text-slate-400"}`}>إنشاء حساب جديد</button>
                </div>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitAuth}>
                  {view === "signup" && (
                    <>
                      <label className="grid gap-2 text-sm font-bold">الاسم الكامل<input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="اكتب اسمك الكامل" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" /></label>
                    </>
                  )}
                  <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Mail size={16} className="text-blue-400" /> البريد الإلكتروني</span><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" /></label>
                  {view === "signup" && (
                    <>
                      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Phone size={16} className="text-blue-400" /> رقم الهاتف</span><input required type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف للتواصل والتوصيل" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" /></label>
                      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> المحافظة</span><select required value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500">{governorates.map((g) => <option key={g} value={g}>{g}</option>)}</select></label>
                      <label className="grid gap-2 text-sm font-bold sm:col-span-2">عنوان التوصيل<input autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="الحي والشارع وأقرب نقطة دالة" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" /></label>
                    </>
                  )}
                  <label className="grid gap-2 text-sm font-bold sm:col-span-2"><span className="flex items-center gap-2"><LockKeyhole size={16} className="text-blue-400" /> كلمة المرور</span><input required minLength={8} type="password" autoComplete={view === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" /></label>
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-extrabold text-white transition hover:bg-blue-500 sm:col-span-2">{view === "signup" ? "متابعة إعداد الحساب" : "متابعة تسجيل الدخول"} <ArrowRight size={17} /></button>
                </form>
                {notice && <p role="status" className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">{notice}</p>}
              </>
            )}

            {view === "profile" && (
              <div className="grid gap-5">
                <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/60">
                  <div className="h-24 bg-gradient-to-l from-blue-700 via-blue-600 to-sky-400 sm:h-32" />
                  <div className="-mt-12 flex flex-col items-center px-5 pb-6 sm:-mt-14">
                    <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800 text-blue-300 shadow-xl sm:h-28 sm:w-28">
                      {avatar ? <img src={avatar} alt="الصورة الشخصية" className="h-full w-full object-cover" /> : <CircleUserRound size={58} />}
                    </div>
                    <h2 className="mt-3 text-xl font-black text-white">{name.trim() || "ملفي الشخصي"}</h2>
                    <p className="mt-1 text-sm text-slate-400">{email.trim() || "أضف بريدك الإلكتروني لإكمال بياناتك"}</p>
                    <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500">
                      <ImagePlus size={17} /> إضافة أو تغيير الصورة الشخصية
                      <input type="file" accept="image/*" className="hidden" onChange={saveAvatar} />
                    </label>
                    <p className="mt-2 text-center text-xs leading-5 text-slate-500">صورة JPG أو PNG، بحد أقصى 3 ميغابايت. الحفظ الدائم يتطلب تفعيل التخزين.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3 border-b border-slate-700 pb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><UserCog size={20}/></span>
                    <div><h3 className="font-extrabold text-white">البيانات الشخصية</h3><p className="mt-1 text-xs text-slate-400">حدّث معلوماتك لتسهيل التواصل والتوصيل.</p></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-bold text-slate-200">الاسم الكامل<input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الذي سيظهر في ملفك" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                    <label className="grid gap-2 text-sm font-bold text-slate-200">البريد الإلكتروني<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="البريد الإلكتروني" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                    <label className="grid gap-2 text-sm font-bold text-slate-200">رقم الهاتف<input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="رقم الهاتف" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                    <label className="grid gap-2 text-sm font-bold text-slate-200">المحافظة<select value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15">{governorates.map((g) => <option key={g} value={g}>{g}</option>)}</select></label>
                    <label className="grid gap-2 text-sm font-bold text-slate-200 sm:col-span-2">عنوان التوصيل<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="الحي والشارع وأقرب نقطة دالة" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /></label>
                  </div>
                  <button type="button" onClick={() => setSavedNotice("تم تحديث المعاينة داخل الصفحة فقط. الحفظ الدائم يتطلب ربط قاعدة البيانات.")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-blue-700 to-blue-500 py-3.5 font-extrabold text-white shadow-lg shadow-blue-950/20 transition hover:from-blue-600 hover:to-sky-500"><Save size={17} /> حفظ التعديلات</button>
                  {savedNotice && <p role="status" className="mt-3 rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">{savedNotice}</p>}
                </div>
              </div>
            )}

            {view === "settings" && (
              <div className="grid gap-5">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-2 font-extrabold"><Palette size={19} className="text-blue-400" /> ألوان واجهة حسابك</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">اختر اللون وشاهد المعاينة مباشرة. الاختيار لا يُحفظ بعد مغادرة الصفحة قبل ربط قاعدة البيانات.</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {themes.map((item) => <button type="button" key={item.value} onClick={() => setTheme(item.value)} className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-bold ${theme === item.value ? "border-white/60 bg-white/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}><span className="h-5 w-5 rounded-full ring-2 ring-white/10" style={{ backgroundColor: item.swatch }} />{item.name}</button>)}
                  </div>
                  <div className="mt-4 rounded-xl p-4 text-white" style={{ background: `linear-gradient(115deg, ${activeTheme.swatch}, #0f172a 125%)` }}><b>معاينة اللون المختار</b><p className="mt-1 text-sm text-white/80">عبيد ستور — ملفك الشخصي بإعداداتك المفضلة</p></div>
                </div>
                <div className="rounded-2xl border border-slate-700 p-4">
                  <h3 className="font-extrabold">الخصوصية ومعرّف الحساب</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">سيُنشأ لكل حساب معرّف مستخدم فريد من قاعدة البيانات عند ربط المصادقة. لا نعرض عنوان IP كمعرّف للمستخدم لأنه قد يتغير أو يكون مشتركًا بين عدة أشخاص.</p>
                </div>
                <p className="text-xs leading-6 text-slate-500">إعدادات الألوان حاليًا معاينة داخل الصفحة فقط. الحفظ بين الزيارات يتطلب تخزين تفضيلات المستخدم في قاعدة البيانات.</p>
              </div>
            )}

            {view === "tracking" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white"><PackageSearch size={23} /></span><div><h2 className="font-extrabold">تتبع الطلب</h2><p className="mt-1 text-sm text-slate-400">أدخل رقم الطلب عند توفر نظام الطلبات.</p></div></div>
                </div>
                <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={submitTracking}>
                  <input value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} placeholder="رقم الطلب" className="min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500" />
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-extrabold text-white hover:bg-blue-500">التحقق من الحالة <ArrowRight size={16} /></button>
                </form>
                {notice && <p role="status" className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-sm leading-6 text-amber-100">{notice}</p>}
                <p className="text-sm leading-7 text-slate-400">حالة الطلب الفعلية ستظهر بعد ربط قاعدة البيانات ونظام تحديث مراحل التجهيز والشحن. لن نعرض حالات طلب وهمية.</p>
              </div>
            )}
          </div>
        </section>
        <p className="mt-4 text-center text-xs leading-6 text-slate-500">تسجيل الدخول وإنشاء الحساب غير متصلين بخدمة مصادقة حتى الآن؛ لذلك تبقى إعدادات الحساب وتتبع الطلب مخفية عن الزائر إلى حين تفعيل تسجيل الدخول الفعلي.</p>
      </div>
    </main>
  );
}
