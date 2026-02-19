import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeetCode Visualizer | AI Algorithm Tutor",
  description: "Visualize and understand algorithms with AI-generated flowcharts and step-by-step animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable} dark`}>
      <body className="antialiased bg-slate-950 text-slate-50 min-h-screen selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
