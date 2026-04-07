import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4Sale - New Cars Showroom",
  description: "Browse and compare new cars on 4Sale",
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
