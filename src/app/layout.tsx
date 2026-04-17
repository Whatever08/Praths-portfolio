import type { Metadata } from "next";
import { Instrument_Sans, Syne } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
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
        className={`${instrumentSans.variable} ${syne.variable} font-sans text-slate-100 min-h-screen antialiased selection:bg-white/20 tracking-[-0.05em]`}
      >
        {children}
      </body>
    </html>
  );
}
