import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: {default:"عبيد ستور | تسوّق بثقة",template:"%s | عبيد ستور"}, description:"متجر عبيد ستور — منتجات مختارة وتجربة تسوق عربية سهلة داخل سوريا.", applicationName:"Obaid Store" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ar" dir="rtl"><body>{children}</body></html>; }
