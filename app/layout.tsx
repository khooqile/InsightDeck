import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "InsightDeck",
  description: "Go from a 50-page transcript to a 1-minute insight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        This combines the sans-serif font for general text
        and makes the mono font available as a CSS variable
        if you need it later.
      */}
      <body className={`${GeistSans.className} ${GeistMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}