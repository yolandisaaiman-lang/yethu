import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YETHU — Africa. Live. Connected.",
  description: "An African-first social platform combining 120-second live streams, 48-hour temporary moments, and real-time multilingual AI translation across 50+ African languages.",
  keywords: ["Yethu", "African Live Streaming", "2-minute live", "48-hour content", "African AI translation", "isiXhosa", "isiZulu", "Swahili", "Yoruba", "LiveKit", "InsForge"],
  openGraph: {
    title: "YETHU — Africa. Live. Connected.",
    description: "The continent's immediate, social, and temporary communication platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#090a0c] text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
