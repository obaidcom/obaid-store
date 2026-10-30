import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata = { title: "إنشاء حساب | عبيد ستور" };

export default function RegisterPage() {
  return (
    <main dir="rtl" className="container-store py-16">
      <Link href="/profile" className="text-sm font-bold text-blue-700">← العودة إلى حسابي</Link>
      <section className="mx-auto mt-8 max-w-md rounded-3xl border border-blue-100 bg-white p-7 text-center shadow-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-700"><UserPlus size={25}/></div>
        <h1 className="mt-5 text-2xl font-black">إنشاء حساب جديد</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">واجهة التسجيل أصبحت منفصلة عن الملف الشخصي. تفعيل إنشاء الحساب فعلياً يتطلب إكمال إعداد مزوّد المصادقة وقاعدة بيانات المتجر.</p>
        <Link href="/account/login" className="mt-6 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white">لديك حساب؟ تسجيل الدخول</Link>
      </section>
    </main>
  );
}
