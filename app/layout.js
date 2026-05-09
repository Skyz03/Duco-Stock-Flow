import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dual Company Inventory Management",
  description: "Duco Cups and Packmandu inventory management with Supabase-powered data storage.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--app-bg)] text-[var(--app-text)]">{children}</body>
    </html>
  );
}
