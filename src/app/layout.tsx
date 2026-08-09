import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GermanGearsIndia - Premium Car Accessories & Memberships",
  description: "The ultimate club for car enthusiasts. Get exclusive accessories and memberships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#0a0a0a] text-zinc-100 min-h-screen selection:bg-red-500/30 selection:text-red-200`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Cart />
      </body>
    </html>
  );
}
