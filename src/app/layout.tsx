import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { ComparisonProvider } from "@/context/ComparisonContext";

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
      <body>
        <Header />
        <ComparisonProvider>
          <main style={{ paddingTop: 0 }}>{children}</main>
        </ComparisonProvider>
      </body>
    </html>
  );
}
