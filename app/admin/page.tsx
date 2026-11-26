"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, hasSupabaseConfig } from "@/lib/supabase/client";
import { ShieldCheck, LayoutDashboard, Package, ShoppingCart, Users, LogOut, Store, LoaderCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type AccessState = "checking" | "allowed" | "denied" | "error";

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<AccessState>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setState("error");
      setMessage("إعدادات الاتصال بقاعدة البيانات غير مكتملة.");
      return;
    }

    let active = true;
    const supabase = getSupabase();

    const verify = async () => {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        if (!active) return;
        setState("denied");
        setMessage("سجّل الدخول بحساب المدير للمتابعة.");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (!active) return;
      if (adminError) {
        setState("error");
        setMessage("تعذر التحقق من صلاحيات الإدارة. حاول لاحقاً.");
        return;
      }
      if (!admin || admin.role !== "admin") {
        setState("denied");
        setMessage("هذا الحساب لا يملك صلاحية الدخول إلى لوحة الإدارة.");
        return;
      }

      setUser(currentUser);
      setState("allowed");
    };

    void verify();
    return () => { active = false; };
  }, []);

  const signOut = async () => {
    await getSupabase().auth.signOut();
    router.replace("/login");
  };

  if (state === "checking") {
    return <main dir="rtl" className="min-h-screen grid place-items-center bg-slate-950 text-white"><div className="flex items-center gap-3"><LoaderCircle className="animate-spin" /> جارٍ التحقق من صلاحيات المدير...</div></main>;
  }

  if (state !== "allowed") {
    return (
      <main dir="rtl" className="min-h-screen grid place-items-center bg-slate-950 px-4 text-white">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
          <ShieldCheck className="mx-auto mb-4 h-14 w-14 text-amber-400" />
          <h1 className="mb-3 text-2xl font-bold">بوابة إدارة عبيد ستور</h1>
          <p className="mb-6 text-sm leading-7 text-slate-300">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">تسجيل الدخول</Link>
            <Link href="/" className="rounded-xl border border-white/15 px-5 py-3 text-slate-200 hover:bg-white/5">العودة إلى المتجر</Link>
          </div>
        </section>
      </main>
    );
  }

  const sections = [
    { title: "المنتجات", detail: "إدارة المنتجات والأسعار والمخزون", icon: Package },
    { title: "الطلبات", detail: "متابعة الطلبات وحالات الشحن", icon: ShoppingCart },
    { title: "العملاء", detail: "عرض حسابات العملاء", icon: Users },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2"><ShieldCheck className="h-6 w-6" /></div>
            <div><p className="font-bold">عبيد ستور</p><p className="text-xs text-slate-400">لوحة الإدارة المستقلة</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-300 sm:block">{user?.email}</span>
            <button onClick={signOut} className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/5"><LogOut className="h-4 w-4" /> خروج</button>
            <Link href="/" aria-label="المتجر" className="rounded-xl border border-white/15 p-2 hover:bg-white/5"><Store className="h-5 w-5" /></Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-blue-400" />
          <div><h1 className="text-3xl font-bold">لوحة التحكم</h1><p className="mt-1 text-sm text-slate-400">مرحباً بك. تم التحقق من صلاحية حساب المدير.</p></div>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ title, detail, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-blue-500/15 p-3 text-blue-300"><Icon className="h-6 w-6" /></div>
              <h2 className="mb-2 text-lg font-bold">{title}</h2>
              <p className="text-sm leading-6 text-slate-400">{detail}</p>
              <p className="mt-4 text-xs text-slate-500">قسم الإدارة — سيتم ربط أدواته ضمن التحديثات التالية</p>
            </article>
          ))}
        </section>
        <p className="mt-8 text-xs text-slate-500">هذه الصفحة مستقلة عن واجهة المتجر. لا يتم عرضها إلا بعد التحقق من جلسة المستخدم وصلاحية admin من قاعدة البيانات.</p>
      </div>
    </main>
  );
}
