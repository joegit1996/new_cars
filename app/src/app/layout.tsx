import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import EmbeddedFloatingButtons from "@/components/EmbeddedFloatingButtons";
import ScrollToTop from "@/components/ScrollToTop";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "4Sale New Cars - Browse, Compare & Configure New Cars in Kuwait",
  description:
    "The most trusted new-car discovery platform in Kuwait. Browse, compare, and configure new cars across every brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="auto" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <head>
        {/* Default is embedded mode; opt into standalone with ?standalone=true */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(new URLSearchParams(location.search).get('standalone')==='true'){document.documentElement.classList.add('is-standalone')}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollToTop />
        {children}
        <EmbeddedFloatingButtons />
      </body>
    </html>
  );
}
