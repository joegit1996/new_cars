import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q84Sale - New Cars",
  description: "Browse new cars in Kuwait",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
