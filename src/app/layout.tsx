import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VK Home Solutions CRM",
  description: "Lead and deal tracking for VK Home Solutions",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
