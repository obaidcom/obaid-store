"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowRight, Camera, CheckCircle2, CircleUserRound, LockKeyhole, Mail, UserRound } from "lucide-react";

type AuthPageProps = { mode: "login" | "signup" };

export function AuthPage({ mode }: AuthPageProps) {
  const [activeMode, setActiveMode] = useState<"login" | "signup">("login");
  const [created, setCreated] = useState(false);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const saveAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("اختر ملف صورة صالحاً.");
      return;
    }
    if (file.size > 1500000) {
      setNotice("حجم الصورة كبير؛ اختر صورة أقل من 1.5 ميغابايت.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      try {
        localStorage.setItem("obaid-store-avatar", reader.result);
        setAvatar(reader.result);
        setNotice("تم حفظ الصورة الشخصية على هذا الجهاز.");
      } catch {
        setNotice("تعذر حفظ الصورة؛ جرّب صورة أصغر.");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    if (activeMode === "signup") {
      try {
        localStorage.setItem("obaid-store-profile", JSON.stringify({
          name, email, phone, governorate: "دمشق", address: ""
        }));
        localStorage.setItem("obaid-store-demo-account", JSON.stringify({ email, password }));
        setCreated(true);
        setNotice("تم إنشاء ملف حساب تجريبي محلياً. أضف صورتك الشخصية أدناه.");
      } catch {
        setNotice("تعذر حفظ البيانات على هذا الجهاز.");
      }
      return;
    }
    try {
      const account = localStorage.getItem("obaid-store-demo-account");
      const saved = account ? JSON.parse(account) as { email: string; password: string } : null;
      if (saved && saved.email === email && saved.password === password) {
        setNotice("تم تسجيل الدخول إلى الحساب التجريبي على هذا الجهاز.");
      } else {
        setNotice("لم نعثر على حساب تجريبي مطابق على هذا الجهاز. أنشئ حساباً أولاً.");
      }
    } catch {
      setNotice("تعذر قراءة بيانات الحساب على هذا الجهاز.");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#101a2d] px-4 py-8 text-[#e7edf8] sm:py-14">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-white">
          <ArrowRight size={18} /> العودة إلى عبيد ستور
        </Link>
        <section className="overflow-hidden rounded-[28px] border border-[#2b3e5d] bg-[#17253d] shadow-2xl shadow-black/20">
          <div className="bg-gradient-to-l from-blue-800 via-blue-700 to-sky-600 px-6 py-7 text-center text-white">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10">
              {activeMode === "signup" ? <UserRound size={28} /> : <LockKeyhole size={27} />}
            </span>
            <h1 className="mt-4 text-2xl font-black">{activeMode === "signup" ? (created ? "أضف صورتك الشخصية" : "إنشاء حساب جديد") : "تسجيل الدخول"}</h1>
            <p className="mt-2 text-sm leading-6 text-blue-100">{activeMode === "signup" ? (created ? "خطوة اختيارية لتخصيص ملفك الشخصي" : "أنشئ ملفك للعودة إلى بياناتك بسهولة") : "أدخل بيانات الحساب التجريبي المحفوظ على هذا الجهاز"}</p>
          </div>
          <div className="p-5 sm:p-7">
            {activeMode === "signup" && created ? (
              <div className="grid gap-5 text-center">
                <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-blue-400/30 bg-blue-500/10 text-blue-300">
                  {avatar ? <img src={avatar} alt="صورتك الشخصية" className="h-full w-full object-cover" /> : <CircleUserRound size={64} />}
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 font-bold text-blue-200 transition hover:bg-blue-500/20">
                  <Camera size={18} /> {avatar ? "تغيير الصورة الشخصية" : "اختيار صورة من الهاتف"}
                  <input type="file" accept="image/*" className="hidden" onChange={saveAvatar} />
                </label>
                <p className="text-xs leading-6 text-slate-400">الصورة اختيارية، والحد الأقصى 1.5 ميغابايت. تحفظ محلياً على هذا الجهاز في النسخة التجريبية.</p>
                {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-200">{notice}</p>}
                <Link href="/" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-extrabold text-white hover:bg-blue-500"><CheckCircle2 size={18} /> متابعة إلى المتجر</Link>
                <button type="button" onClick={() => { setActiveMode("login"); setCreated(false); setNotice(""); }} className="text-sm font-bold text-blue-300 hover:text-white">الانتقال إلى تسجيل الدخول</button>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={submit}>
                {activeMode === "signup" && <label className="grid gap-2 text-sm font-bold">الاسم الكامل<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="اكتب اسمك الكامل" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>}
                <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Mail size={16} className="text-blue-400" /> البريد الإلكتروني</span><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                {activeMode === "signup" && <label className="grid gap-2 text-sm font-bold">رقم الهاتف (اختياري)<input type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الهاتف" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>}
                <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><LockKeyhole size={16} className="text-blue-400" /> كلمة المرور</span><input required minLength={8} type="password" autoComplete={activeMode === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                {activeMode === "signup" && <label className="flex items-start gap-2 text-xs leading-6 text-slate-400"><input required type="checkbox" className="mt-1 accent-blue-500" /> أوافق على شروط الاستخدام وسياسة الخصوصية التجريبية.</label>}
                <button type="submit" className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-extrabold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500">{activeMode === "signup" ? "إنشاء الحساب والمتابعة" : "تسجيل الدخول"} <ArrowRight size={17} /></button>
                {notice && <p role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-6 text-amber-200">{notice}</p>}
              </form>
            )}
            {!created && <div className="mt-6 border-t border-[#344b70] pt-5 text-center text-sm text-slate-400">{activeMode === "signup" ? "لديك حساب بالفعل؟ " : "ليس لديك حساب؟ "}<button type="button" className="font-extrabold text-blue-300 hover:text-white" onClick={() => { setActiveMode(activeMode === "signup" ? "login" : "signup"); setNotice(""); }}>{activeMode === "signup" ? "تسجيل الدخول" : "إنشاء حساب جديد"}</button></div>}
            <p className="mt-5 text-center text-[11px] leading-6 text-slate-500">نسخة تجريبية: لا يوجد خادم مصادقة متصل. لا تستخدم كلمة مرورك الحقيقية؛ البيانات محفوظة محلياً على هذا الجهاز فقط.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
