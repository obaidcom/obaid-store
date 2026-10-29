"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowRight, Camera, CheckCircle2, CircleUserRound, LockKeyhole, Mail, UserRound, Phone, MapPin } from "lucide-react";

const governorates = ["دمشق","ريف دمشق","حلب","حمص","حماة","اللاذقية","طرطوس","إدلب","دير الزور","الحسكة","الرقة","درعا","السويداء","القنيطرة"];

export function AuthPage() {
  const [activeMode, setActiveMode] = useState<"login" | "signup">("login");
  const [created, setCreated] = useState(false);
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("دمشق");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const saveAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("اختر ملف صورة صالحاً.");
      event.target.value = "";
      return;
    }
    if (file.size > 1500000) {
      setNotice("حجم الصورة كبير؛ اختر صورة أقل من 1.5 ميغابايت.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setAvatar(reader.result);
      setNotice("تم اختيار الصورة الشخصية.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    try {
      if (activeMode === "signup") {
        const profile = { name, email, phone, governorate, address };
        localStorage.setItem("obaid-store-profile", JSON.stringify(profile));
        localStorage.setItem("obaid-store-demo-account", JSON.stringify({ email, password }));
        if (avatar) localStorage.setItem("obaid-store-avatar", avatar);
        setCreated(true);
        setNotice("تم إنشاء الحساب التجريبي وحفظ بياناتك على هذا الجهاز.");
        return;
      }
      const account = localStorage.getItem("obaid-store-demo-account");
      const saved = account ? JSON.parse(account) as { email: string; password: string } : null;
      if (saved && saved.email === email && saved.password === password) {
        setNotice("تم تسجيل الدخول إلى الحساب التجريبي على هذا الجهاز.");
      } else {
        setNotice("لم نعثر على حساب تجريبي مطابق على هذا الجهاز. يمكنك إنشاء حساب من الرابط أدناه.");
      }
    } catch {
      setNotice("تعذر حفظ بيانات الحساب على هذا الجهاز.");
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
              {created ? <CheckCircle2 size={28} /> : activeMode === "signup" ? <UserRound size={28} /> : <LockKeyhole size={27} />}
            </span>
            <h1 className="mt-4 text-2xl font-black">{created ? "تم إنشاء حسابك" : "تسجيل الدخول أو إنشاء حساب"}</h1>
            <p className="mt-2 text-sm leading-6 text-blue-100">{created ? "تم حفظ بياناتك التجريبية على هذا الجهاز." : activeMode === "signup" ? "أدخل بياناتك وصورتك الشخصية مرة واحدة في النموذج نفسه." : "سجّل الدخول أو أنشئ حساباً جديداً من الصفحة نفسها."}</p>
          </div>
          <div className="p-5 sm:p-7">
            {created ? (
              <div className="grid gap-5 text-center">
                <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-blue-400/30 bg-blue-500/10 text-blue-300">
                  {avatar ? <img src={avatar} alt="الصورة الشخصية" className="h-full w-full object-cover" /> : <CircleUserRound size={64} />}
                </div>
                <p className="text-sm leading-7 text-slate-300">اسم الحساب: <b>{name}</b><br />المحافظة: <b>{governorate}</b><br />رقم الهاتف: <b>{phone || "لم تتم إضافته"}</b></p>
                {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-200">{notice}</p>}
                <Link href="/" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-extrabold text-white hover:bg-blue-500"><CheckCircle2 size={18} /> متابعة إلى المتجر</Link>
                <button type="button" onClick={() => { setCreated(false); setActiveMode("login"); setNotice(""); }} className="text-sm font-bold text-blue-300 hover:text-white">الانتقال إلى تسجيل الدخول</button>
              </div>
            ) : (
              <>
                <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-[#344b70] bg-[#101a2d] p-1">
                  <button type="button" onClick={() => { setActiveMode("login"); setNotice(""); }} className={"rounded-lg px-3 py-2.5 text-sm font-extrabold transition " + (activeMode === "login" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}>تسجيل الدخول</button>
                  <button type="button" onClick={() => { setActiveMode("signup"); setNotice(""); }} className={"rounded-lg px-3 py-2.5 text-sm font-extrabold transition " + (activeMode === "signup" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}>إنشاء حساب جديد</button>
                </div>
                <form className="grid gap-4" onSubmit={submit}>
                  {activeMode === "signup" && (
                    <>
                      <div className="flex flex-col items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-4">
                        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-blue-400/30 bg-blue-500/10 text-blue-300">
                          {avatar ? <img src={avatar} alt="معاينة الصورة الشخصية" className="h-full w-full object-cover" /> : <CircleUserRound size={52} />}
                        </div>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/20">
                          <Camera size={17} /> {avatar ? "تغيير الصورة الشخصية" : "إضافة صورة شخصية (اختياري)"}
                          <input type="file" accept="image/*" className="hidden" onChange={saveAvatar} />
                        </label>
                        <span className="text-center text-[11px] text-slate-400">صورة حتى 1.5 ميغابايت، ويمكن تخطيها.</span>
                      </div>
                      <label className="grid gap-2 text-sm font-bold">الاسم الكامل<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="اكتب اسمك الكامل" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                    </>
                  )}
                  <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Mail size={16} className="text-blue-400" /> البريد الإلكتروني</span><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                  {activeMode === "signup" && (
                    <>
                      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><Phone size={16} className="text-blue-400" /> رقم الهاتف</span><input required type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الهاتف للتواصل والتوصيل" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                      <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> المحافظة</span><select required value={governorate} onChange={e => setGovernorate(e.target.value)} className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500">{governorates.map(g => <option key={g} value={g}>{g}</option>)}</select></label>
                      <label className="grid gap-2 text-sm font-bold">عنوان التوصيل (اختياري)<input autoComplete="street-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="الحي والشارع وأقرب نقطة دالة" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                    </>
                  )}
                  <label className="grid gap-2 text-sm font-bold"><span className="flex items-center gap-2"><LockKeyhole size={16} className="text-blue-400" /> كلمة المرور</span><input required minLength={8} type="password" autoComplete={activeMode === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" className="rounded-xl border border-[#344b70] bg-[#101a2d] px-4 py-3 outline-none focus:border-blue-500" /></label>
                  {activeMode === "signup" && <label className="flex items-start gap-2 text-xs leading-6 text-slate-400"><input required type="checkbox" className="mt-1 accent-blue-500" /> أوافق على شروط الاستخدام وسياسة الخصوصية التجريبية.</label>}
                  <button type="submit" className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-extrabold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500">{activeMode === "signup" ? "إنشاء الحساب" : "تسجيل الدخول"} <ArrowRight size={17} /></button>
                  {notice && <p role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm leading-6 text-amber-200">{notice}</p>}
                </form>
              </>
            )}
            <p className="mt-5 text-center text-[11px] leading-6 text-slate-500">نسخة تجريبية: لا يوجد خادم مصادقة متصل. لا تستخدم كلمة مرورك الحقيقية؛ البيانات محفوظة محلياً على هذا الجهاز فقط.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
