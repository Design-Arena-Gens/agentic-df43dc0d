import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Content Automation - AI Multi-Platform Publisher",
  description: "Automate viral content creation and posting to Instagram, YouTube, Facebook, Threads, and Pinterest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
