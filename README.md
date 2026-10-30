# عبيد ستور — إعادة بناء مستقلة

متجر عربي RTL مبني على Next.js 14 وTypeScript وTailwind CSS، مع Prisma/PostgreSQL وNextAuth كبنية مستقبلية.

## حدود السلامة
- التعديلات على الفرع `rebuild/store-from-scratch` داخل مستودع `obaidcom/obaid-store` فقط.
- لم يتم تعديل أو حذف أي قاعدة بيانات، ولم يتم تشغيل SQL أو migrations أو seed.
- لم يتم لمس مستودع `obaid-app2` أو إعداداته.
- المنتجات والأسعار في الواجهة تجريبية، ولا تستقبل النسخة الحالية طلبات حقيقية.
- ملفات Prisma إعداد مقترح فقط؛ لا تستخدم قاعدة بيانات الصيانة.

## التشغيل
1. استخدم Node.js 20 أو أحدث.
2. نفّذ `npm install`.
3. انسخ `.env.example` إلى `.env` واستخدم قاعدة PostgreSQL جديدة مخصصة للمتجر فقط.
4. `npm run dev`

لا تشغّل `npm run db:push` أو `npm run db:seed` قبل إنشاء قاعدة مستقلة للمتجر ومراجعة الإعدادات.
