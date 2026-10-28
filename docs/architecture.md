# بنية مشروع عبيد ستور

## الهدف

تطوير المتجر الحالي تدريجياً مع الحفاظ على الواجهة الموجودة، وفصل تجربة العميل عن لوحة الإدارة، وتأجيل أي تغييرات على قاعدة البيانات إلى ما بعد التحقق من مشروع Supabase الفعلي.

## التقنية

- Next.js App Router وTypeScript.
- Tailwind CSS v4 ومكوّنات Radix UI.
- Lucide React وFramer Motion للحركات الخفيفة.
- Supabase Auth وPostgres وStorage بعد تأكيد المشروع الصحيح.
- Vercel لتشغيل Next.js بكامل قدراته الخادمية.

## التقسيم المقترح للصفحات

```text
app/
  (store)/
    page.tsx
    products/
    categories/
    cart/
    checkout/
    favorites/
    account/
    orders/
  admin/
    layout.tsx
    login/
    products/
    categories/
    orders/
    customers/
    banners/
    coupons/
  auth/
  layout.tsx
  globals.css
components/
  storefront/
  product/
  cart/
  account/
  admin/
  ui/
lib/
  supabase/
  auth/
  validations/
supabase/
  schema.sql
  migrations/
docs/
  architecture.md
```

هذا تنظيم مستهدف، وليس وصفاً كاملاً لكل الملفات الموجودة حالياً. تُنقل المكونات إلى هذا التقسيم عند تنفيذ مراحل الواجهة والوظائف، مع تجنب إعادة كتابة غير ضرورية.

## نموذج البيانات المقترح

- `profiles`: ملف العميل ودوره المرتبط بمستخدم Supabase Auth.
- `categories`: الأقسام وصورها وترتيبها.
- `products`: بيانات المنتج والسعر والمخزون والصور.
- `orders` و`order_items`: الطلبات وعناصرها وحالات التوصيل.
- `addresses`: عناوين العملاء.
- `wishlists`: المنتجات المفضلة.
- `reviews`: التقييمات المعتمدة.
- `coupons`: أكواد الخصم وشروطها.
- `store_banners`: البانرات والسلايدرات.
- `inventory_movements`: سجل حركة المخزون.
- `store_settings`: إعدادات العرض والتوصيل والتواصل.

المخطط أعلاه مقترح، ويجب مراجعته ومقارنته بالمخطط الفعلي قبل أي ترحيل.

## حدود الأمان

- صفحات الإدارة وحدها لا تكفي لحماية العمليات؛ يجب التحقق من الجلسة والصلاحية في الخادم.
- تفعيل RLS على الجداول المكشوفة، مع سياسات ملكية الصفوف حسب المستخدم والدور.
- التحقق من بيانات الطلب والسعر والمخزون والخصم على الخادم.
- عدم إرسال مفاتيح الخدمة السرية إلى المتصفح.
- تخزين الصور بسياسات تميّز بين القراءة العامة وعمليات الرفع والإدارة.

## ملاحظة تدقيق Supabase بتاريخ 2026-10-28

المشروع المتصل باسم `obaid-store` يحتوي حالياً على `users` و`orders` و`invoices` و`settings` بتصميم يبدو خاصاً بتطبيق خدمات/صيانة. لم تُجر أي كتابة أو تعديل عليه. يلزم تأكيد أنه مخصص حصرياً للمتجر قبل ربط التطبيق أو تشغيل أي SQL.
