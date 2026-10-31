"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { ProfileDashboard } from "@/components/profile-dashboard";
import { ShoppingBag, UserRound, Mail, LockKeyhole, Phone, MapPin, CalendarDays, ArrowRight, ShieldCheck, LoaderCircle, Eye, EyeOff } from "lucide-react";

const governorates = ["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","درعا","السويداء","القنيطرة","دير الزور","الرقة","الحسكة"];

export function AccountPortal() {
  const router = useRouter();
  const [sessionReady,setSessionReady] = useState(false);
  const [signedIn,setSignedIn] = useState(false);
  const [view,setView] = useState<"welcome"|"signup"|"login"|"verify">("welcome");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [governorate,setGovernorate] = useState("دمشق");
  const [birthDate,setBirthDate] = useState("");
  const [password,setPassword] = useState("");
  const [otp,setOtp] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [notice,setNotice] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setSessionReady(true); return; }
    supabase.auth.getSession().then(({data}) => { setSignedIn(!!data.session); setSessionReady(true); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,session) => setSignedIn(!!session));
    return () => subscription.unsubscribe();
  },[]);

  const clearMessages = () => { setError(""); setNotice(""); };

  const register = async (e:FormEvent) => {
    e.preventDefault(); clearMessages(); setBusy(true);
    const supabase = getSupabase();
    if (!supabase) { setError("إعدادات الاتصال بالمتجر غير مكتملة."); setBusy(false); return; }
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const {error:signUpError} = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { first_name:firstName.trim(), last_name:lastName.trim(), full_name:(firstName+" "+lastName).trim(), phone:phone.trim(), governorate, birth_date:birthDate } }
      });
      if (signUpError) throw signUpError;
      setEmail(normalizedEmail);
      setView("verify");
      setNotice("أرسلنا رمز التحقق إلى بريدك الإلكتروني. أدخل الرمز المكوّن من 6 أرقام لإكمال إنشاء الحساب.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "تعذر إنشاء الحساب.";
      setError(message.toLowerCase().includes("already registered") ? "هذا البريد مسجل مسبقاً. اختر تسجيل الدخول." : message);
    } finally { setBusy(false); }
  };

  const verify = async (e:FormEvent) => {
    e.preventDefault(); clearMessages();
    if (!/^\d{6}$/.test(otp)) { setError("أدخل رمزاً صحيحاً مكوّناً من 6 أرقام."); return; }
    setBusy(true);
    const supabase = getSupabase();
    if (!supabase) { setError("تعذر الاتصال بالمتجر."); setBusy(false); return; }
    try {
      const {data,error:verifyError} = await supabase.auth.verifyOtp({email:email.trim().toLowerCase(),token:otp,type:"signup"});
      if (verifyError) throw verifyError;
      if (!data.user) throw new Error("لم نتمكن من تأكيد الحساب. حاول إرسال الرمز مجدداً.");
      const fullName = (firstName+" "+lastName).trim();
      const {error:profileError} = await supabase.from("profiles").upsert({
        id:data.user.id, first_name:firstName.trim(), last_name:lastName.trim(), full_name:fullName,
        phone:phone.trim(), governorate, birth_date:birthDate || null, default_address:""
      },{onConflict:"id"});
      if (profileError) throw profileError;
      setSignedIn(true); router.replace("/profile"); router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "رمز التحقق غير صحيح أو انتهت صلاحيته.");
    } finally { setBusy(false); }
  };

  const login = async (e:FormEvent) => {
    e.preventDefault(); clearMessages(); setBusy(true);
    const supabase = getSupabase();
    if (!supabase) { setError("إعدادات الاتصال بالمتجر غير مكتملة."); setBusy(false); return; }
    try {
      const {error:loginError} = await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
      if (loginError) throw loginError;
      router.replace("/profile"); router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "تعذر تسجيل الدخول.";
      setError(message.includes("Invalid login") ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : message);
    } finally { setBusy(false); }
  };

  if (!sessionReady) return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#eef3fb]"><LoaderCircle className="animate-spin text-blue-700" size={30}/></main>;
  if (signedIn) return <ProfileDashboard/>;

  const field = "w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pe-11 ps-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white";
  const icon = "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400";
  return <main dir="rtl" className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_#eef3fb_42%,_#f8fafc)] px-4 py-8 text-slate-800 sm:py-12">
    <div className="mx-auto flex min-h-[min(780px,calc(100vh-4rem))] max-w-5xl items-center justify-center">
      <section className="w-full max-w-2xl overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_25px_80px_rgba(16,42,86,.14)]">
        <div className="bg-gradient-to-l from-[#102345] via-[#174b93] to-[#2876d8] px-6 py-8 text-center text-white sm:px-12 sm:py-10">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/10 shadow-lg"><ShoppingBag size={34}/></div>
          <p className="text-xs font-bold tracking-[.24em] text-blue-100">OBEID STORE</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">{view==="welcome"?"مرحباً بك في متجر عبيد":view==="signup"?"أنشئ حسابك الآن":view==="verify"?"تأكيد البريد الإلكتروني":"مرحباً بعودتك"}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-blue-100">{view==="welcome"?"يسعدنا وجودك معنا. سجّل حسابك لتتابع مشترياتك وتدير كل تفاصيل التسوق من مكان واحد.":view==="signup"?"أدخل بياناتك مرة واحدة لتحصل على حسابك الشخصي وتجربة تسوق أسهل.":view==="verify"?"أدخل الرمز الذي وصل إلى بريدك الإلكتروني لتفعيل حسابك بأمان.":"سجّل الدخول للوصول إلى طلباتك ومفضلاتك وبياناتك."}</p>
        </div>
        <div className="px-5 py-7 sm:px-10 sm:py-9">
          {view==="welcome" && <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={()=>{clearMessages();setView("signup");}} className="flex items-center justify-center gap-3 rounded-2xl bg-blue-700 px-5 py-4 font-extrabold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800"><UserRound size={19}/> إنشاء حساب جديد</button>
            <button onClick={()=>{clearMessages();setView("login");}} className="flex items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 font-extrabold text-blue-800 transition hover:bg-blue-100"><LockKeyhole size={19}/> تسجيل الدخول</button>
            <a href="/" className="mt-3 text-center text-sm font-bold text-slate-500 hover:text-blue-700">العودة إلى التسوق</a>
          </div>}
          {view==="signup" && <form onSubmit={register} className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">الاسم الأول<div className="relative"><UserRound className={icon} size={18}/><input className={field} required value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="الاسم الأول" autoComplete="given-name"/></div></label>
            <label className="grid gap-2 text-sm font-bold">الكنية<div className="relative"><UserRound className={icon} size={18}/><input className={field} required value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="الكنية" autoComplete="family-name"/></div></label>
            <label className="grid gap-2 text-sm font-bold sm:col-span-2">البريد الإلكتروني<div className="relative"><Mail className={icon} size={18}/><input className={field} type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email"/></div></label>
            <label className="grid gap-2 text-sm font-bold">رقم الهاتف<div className="relative"><Phone className={icon} size={18}/><input className={field} type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="رقم الهاتف" autoComplete="tel"/></div></label>
            <label className="grid gap-2 text-sm font-bold">المحافظة<div className="relative"><MapPin className={icon} size={18}/><select className={field} value={governorate} onChange={e=>setGovernorate(e.target.value)}>{governorates.map(g=><option key={g}>{g}</option>)}</select></div></label>
            <label className="grid gap-2 text-sm font-bold">تاريخ الميلاد<div className="relative"><CalendarDays className={icon} size={18}/><input className={field} type="date" required value={birthDate} onChange={e=>setBirthDate(e.target.value)} max={new Date().toISOString().slice(0,10)}/></div></label>
            <label className="grid gap-2 text-sm font-bold">كلمة المرور<div className="relative"><LockKeyhole className={icon} size={18}/><input className={field+" ps-12"} minLength={8} required type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="8 أحرف على الأقل"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
            <button disabled={busy} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-extrabold text-white disabled:opacity-60 sm:col-span-2">{busy?<LoaderCircle className="animate-spin" size={18}/>:null}إنشاء الحساب وإرسال الرمز <ArrowRight size={17}/></button>
            <p className="text-center text-sm text-slate-500 sm:col-span-2">لديك حساب؟ <button type="button" onClick={()=>{clearMessages();setView("login");}} className="font-extrabold text-blue-700">تسجيل الدخول</button></p>
          </form>}
          {view==="verify" && <form onSubmit={verify} className="grid gap-4">
            <div className="rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-800"><Mail className="mx-auto mb-2" size={22}/><b>{email}</b><p className="mt-1 text-xs">أدخل رمز التحقق المكوّن من ستة أرقام.</p></div>
            <label className="grid gap-2 text-sm font-bold">رمز التحقق<input dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-black tracking-[.55em] outline-none focus:border-blue-500"/></label>
            <button disabled={busy||otp.length!==6} className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-extrabold text-white disabled:opacity-60">{busy?<LoaderCircle className="animate-spin" size={18}/>:<ShieldCheck size={18}/>} تأكيد الحساب</button>
            <button type="button" onClick={()=>{clearMessages();setView("signup");}} className="text-sm font-bold text-slate-500">تعديل بيانات التسجيل</button>
          </form>}
          {view==="login" && <form onSubmit={login} className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold">البريد الإلكتروني<div className="relative"><Mail className={icon} size={18}/><input className={field} type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email"/></div></label>
            <label className="grid gap-2 text-sm font-bold">كلمة المرور<div className="relative"><LockKeyhole className={icon} size={18}/><input className={field+" ps-12"} required type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة المرور"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
            <button disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-extrabold text-white disabled:opacity-60">{busy?<LoaderCircle className="animate-spin" size={18}/>:null}تسجيل الدخول</button>
            <p className="text-center text-sm text-slate-500">ليس لديك حساب؟ <button type="button" onClick={()=>{clearMessages();setView("signup");}} className="font-extrabold text-blue-700">إنشاء حساب</button></p>
          </form>}
          {error&&<p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-700">{error}</p>}
          {notice&&<p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">{notice}</p>}
          {view!=="welcome"&&<button onClick={()=>{clearMessages();setView("welcome");}} className="mt-6 flex w-full items-center justify-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-slate-500"><ArrowRight size={16}/> الرجوع</button>}
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] leading-6 text-slate-400"><ShieldCheck size={14}/> نحمي بياناتك ونحفظها ضمن حسابك الشخصي.</p>
        </div>
      </section>
    </div>
  </main>;
}
