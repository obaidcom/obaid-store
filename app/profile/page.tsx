import Link from "next/link";
import { auth } from "@/auth";
import ProfileDashboard from "./profile-dashboard";
import { LogIn, UserPlus, UserRound } from "lucide-react";

export const metadata = { title: "حسابي | عبيد ستور" };

function GuestAccount() {
  return (
    <main dir="rtl" className="grid min-h-[72vh] place-items-center bg-[#f4f7fc] px-4 py-12">
      <section className="w-full max-w-md rounded-[28px] border border-blue-100 bg-white p-7 text-center shadow-[0_18px_60px_rgba(15,55,110,.10)] sm:p-9">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <UserRound size={30} />
        </span>
        <p className="mt-5 text-xs font-black tracking-wide text-blue-600">OBAID STORE</p>
        <h1 className="mt-2 text-2xl font-black text-[#10213e]">مرحباً بك في عبيد ستور</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          سجّل الدخول إلى حسابك أو أنشئ حساباً جديداً للوصول إلى ملفك الشخصي وطلباتك.
        </p>
        <div className="mt-7 grid gap-3">
          <Link href="/account/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700">
            <LogIn size={17} /> تسجيل الدخول
          </Link>
          <Link href="/account/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-800 transition hover:bg-blue-100">
            <UserPlus size={17} /> إنشاء حساب جديد
          </Link>
        </div>
        <Link href="/" className="mt-6 inline-block text-xs font-bold text-slate-400 transition hover:text-blue-700">العودة إلى المتجر</Link>
      </section>
    </main>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (!user) return <GuestAccount />;

  return (
    <ProfileDashboard
      user={{
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
        signedIn: true,
      }}
    />
  );
}
