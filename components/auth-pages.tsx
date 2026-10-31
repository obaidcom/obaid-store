"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, Phone, ShieldCheck, LoaderCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Props = { mode: "login" | "signup" };

export function AuthPage({ mode }: Props) {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  const isSignup = mode === "signup";

  useEffect(() => {
    let alive = true;
    const client = getSupabase();
    if (!client) return;
    client.auth.getSession().then(({data}) => {
      if (alive && data.session) router.replace("/profile");
    });
    return () => { alive = false; };
  },[router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    const supabase = getSupabase();
    if (!supabase) { setError("إعدادات الاتصال بقاعدة بيانات المتجر غير مكتملة."); setLoading(false); return; }
    try {
      if (isSignup) {
        const {data,error:authError} = await supabase.auth.signUp({
          email: email.trim().toLowerCase(), password,
          options: { data: { full_name: name.trim(), phone: phone.trim() }, emailRedirectTo: `${window.location.origin}/profile` }
        });
        if (authError) throw authError;
        if (data.user && data.session) {
          await supabase.from("profiles").upsert({id:data.user.id,full_name:name.trim(),phone:phone.trim()},{onConflict:"id"});
          router.replace("/profile"); router.refresh(); return;
        }
        setNotice("تم إنشاء الحساب. تحقق من بريدك الإلكتروني واضغط رابط التأكيد، ثم سجّل الدخول.");
      } else {
        const {error:authError} = await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
        if (authError) throw authError;
        router.replace("/profile"); router.refresh(); return;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "تعذر إتمام العملية.";
      setError(message.includes("Invalid login") ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." :
        message.includes("already registered") ? "هذا البريد مسجل بالفعل. سجّل الدخول." :
        message.includes("Password should") ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل." : message);
    } finally { setLoading(false); }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#eef3fb] px-4 py-8 text-slate-800 sm:py-12">
      <div className="mx-auto grid min-h-[620px] max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-[0_25px_80px_rgba(16,42,86,.14)] lg:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[#101d36] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full border-[38px] border-blue-400/10"/>
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border-[45px] border-sky-400/10"/>
          <div className="relative"><div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-2xl font-black">ع</div><div className="text-2xl font-black">متجر عبيد</div><div className="mt-1 text-xs tracking-[.25em] text-blue-300">OBEID STORE</div></div>
          <div className="relative"><ShieldCheck size={38} className="mb-5 text-blue-300"/><h2 className="text-3xl font-black leading-relaxed">تسوّقك أسهل، وحسابك في مكان واحد</h2><p className="mt-4 max-w-sm text-sm leading-8 text-slate-300">تابع طلباتك، احفظ عناوينك المفضلة، واحتفظ بتفاصيل مشترياتك بأمان.</p></div>
          <div className="relative text-xs text-slate-400">تجربة تسوّق عربية من متجر عبيد</div>
        </aside>
        <section className="flex flex-col justify-center px-5 py-8 sm:px-10 lg:px-14">
          <Link href="/" className="mb-9 inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"><ArrowRight size={17}/> العودة إلى المتجر</Link>
          <div className="mb-7">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><UserRound size={25}/></div>
            <h1 className="text-3xl font-black text-[#14233e]">{isSignup ? "إنشاء حساب جديد" : "مرحباً بعودتك"}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">{isSignup ? "أنشئ حسابك لتستمتع بتجربة تسوّق متكاملة." : "سجّل الدخول للوصول إلى ملفك الشخصي وطلباتك."}</p>
          </div>
          <form onSubmit={submit} className="grid gap-4">
            {isSignup && <label className="grid gap-2 text-sm font-bold">الاسم الكامل<div className="relative"><UserRound className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="اكتب اسمك الكامل" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pe-12 ps-4 outline-none transition focus:border-blue-500 focus:bg-white"/></div></label>}
            <label className="grid gap-2 text-sm font-bold">البريد الإلكتروني<div className="relative"><Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="name@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pe-12 ps-4 outline-none transition focus:border-blue-500 focus:bg-white"/></div></label>
            {isSignup && <label className="grid gap-2 text-sm font-bold">رقم الهاتف (اختياري)<div className="relative"><Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel" placeholder="رقم الهاتف" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pe-12 ps-4 outline-none transition focus:border-blue-500 focus:bg-white"/></div></label>}
            <label className="grid gap-2 text-sm font-bold">كلمة المرور<div className="relative"><LockKeyhole className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input required minLength={8} type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={isSignup?"new-password":"current-password"} placeholder="8 أحرف على الأقل" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pe-12 ps-12 outline-none transition focus:border-blue-500 focus:bg-white"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label="إظهار كلمة المرور" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
            <button disabled={loading} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-700 py-4 font-extrabold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800 disabled:opacity-60">{loading?<LoaderCircle className="animate-spin" size={18}/>:null}{isSignup?"إنشاء الحساب":"تسجيل الدخول"} <ArrowRight size={17}/></button>
          </form>
          {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-700">{error}</p>}
          {notice && <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">{notice}</p>}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">{isSignup?"لديك حساب بالفعل؟":"ليس لديك حساب؟"} <Link className="font-extrabold text-blue-700 hover:text-blue-900" href={isSignup?"/login":"/signup"}>{isSignup?"تسجيل الدخول":"إنشاء حساب جديد"}</Link></div>
          <p className="mt-6 text-center text-xs leading-6 text-slate-400">بيانات حسابك تُدار بأمان عبر خدمة المصادقة في Supabase.</p>
        </section>
      </div>
    </main>
  );
}
