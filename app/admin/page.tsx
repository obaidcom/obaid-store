import { BarChart3, ClipboardList, Package, ShieldCheck, Users } from "lucide-react";

const cards = [
  { title: "المنتجات", value: "—", icon: Package, note: "بانتظار ربط قاعدة بيانات المتجر" },
  { title: "الطلبات", value: "—", icon: ClipboardList, note: "لا توجد طلبات حقيقية في هذه المرحلة" },
  { title: "العملاء", value: "—", icon: Users, note: "سيظهر العدد بعد تفعيل الحسابات" },
];

export default function AdminPage() {
  return (
    <main dir="rtl" className="container-store py-10">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-700"><ShieldCheck /></span>
        <div><p className="text-xs font-bold text-blue-700">إدارة المتجر</p><h1 className="mt-1 text-2xl font-black">لوحة تحكم عبيد ستور</h1></div>
      </div>
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
        لوحة الإدارة غير متاحة للتشغيل التجاري بعد. يجب إضافة تحقق صلاحيات من جهة الخادم قبل عرض أي بيانات أو السماح بتعديل المنتجات والطلبات. لم يتم ربط هذه الصفحة بأي قاعدة بيانات.
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({title,value,icon:Icon,note}) => <section key={title} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-600">{title}</span><Icon className="text-blue-700" size={20}/></div>
          <p className="mt-4 text-3xl font-black">{value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
        </section>)}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600"><BarChart3 className="shrink-0 text-blue-700" /> ستُضاف التقارير والمبيعات بعد تجهيز قاعدة بيانات مستقلة واختبار الصلاحيات.</div>
      <a href="/" className="mt-6 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">العودة إلى واجهة المتجر</a>
    </main>
  );
}
