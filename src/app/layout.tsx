import type { Metadata } from "next";
import { Instrument_Sans, Syne, DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import FloatingMenu from "@/components/ui/FloatingMenu";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Prathamesh's Portfolio",
  description: "A seamless fusion of fluid dynamics and immersive spatial depth.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" async></script>
      </head>
      <body
        className={`${instrumentSans.variable} ${syne.variable} ${dmSans.variable} ${inter.variable} font-sans text-slate-100 min-h-screen antialiased selection:bg-white/20 tracking-[-0.05em]`}
      >
        {children}
        <FloatingMenu />
      </body>
    </html>
  );
}
