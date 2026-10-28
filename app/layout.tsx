import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "عبيد ستور | تسوّق بذكاء",
  description: "واجهة جديدة لمتجر عبيد ستور، بتجربة تسوّق عربية عصرية ومتجاوبة.",
  applicationName: "عبيد ستور",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "عبيد ستور",
    title: "عبيد ستور | تسوّق بذكاء",
    description: "اكتشف منتجات مختارة وتجربة تسوّق عربية عصرية.",
  },
};

export const viewport: Viewport = { themeColor: "#1646a8", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body className={cairo.className}>{children}</body></html>;
}
