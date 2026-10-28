import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "عبيد ستور | تسوّق بذكاء واكتشف منتجات مميزة",
  description:
    "تسوّق من عبيد ستور واكتشف منتجات مختارة بتجربة عربية عصرية ومتوافقة مع الهاتف.",
  applicationName: "عبيد ستور",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "عبيد ستور",
    title: "عبيد ستور | تسوّق بذكاء",
    description: "اكتشف منتجات مختارة وتجربة تسوق عربية عصرية من عبيد ستور.",
    url: siteUrl,
    images: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عبيد ستور | تسوّق بذكاء",
    description: "تجربة تسوق عربية عصرية لمنتجات مختارة.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2457e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
