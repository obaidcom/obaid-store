export default function LoginPage() {
  return (
    <main dir="rtl" className="container-store py-16">
      <a href="/" className="text-sm font-bold text-blue-700">← العودة إلى المتجر</a>
      <section className="mx-auto mt-8 max-w-md rounded-3xl border border-blue-100 bg-white p-7 shadow-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl font-black text-blue-700">ع</div>
        <h1 className="mt-5 text-center text-2xl font-black">مرحباً بعودتك</h1>
        <p className="mt-3 text-center text-sm leading-7 text-slate-500">تسجيل الدخول غير مفعّل في هذه المرحلة. سنفعّله بعد إعداد مزوّد المصادقة وقاعدة بيانات مستقلة للمتجر، دون استخدام بيانات تطبيق الصيانة.</p>
        <a href="/" className="mt-6 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white">متابعة التصفح</a>
      </section>
    </main>
  );
}
