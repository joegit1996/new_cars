import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import EmbeddedFloatingButtons from "@/components/EmbeddedFloatingButtons";
import ScrollToTop from "@/components/ScrollToTop";
import { AppDataProvider } from "@/context/AppDataContext";
import { LanguageProvider } from "@/context/LanguageContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "4Sale New Cars - Browse, Compare & Configure New Cars in Kuwait",
  description:
    "The most trusted new-car discovery platform in Kuwait. Browse, compare, and configure new cars across every brand.",
};

// Inline boot script: read ?lang= from URL and set html dir/lang BEFORE React hydrates
// to avoid a layout-direction flash on Arabic.
const bootScript = `(function(){try{
  var p=new URLSearchParams(location.search);
  var lang=p.get('lang');
  if(lang!=='en'&&lang!=='ar') lang='en';
  var dir=lang==='ar'?'rtl':'ltr';
  document.documentElement.setAttribute('lang',lang);
  document.documentElement.setAttribute('dir',dir);
  if(p.get('standalone')==='true'){document.documentElement.classList.add('is-standalone')}
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <LanguageProvider>
            <AppDataProvider>
              <ScrollToTop />
              {children}
              <EmbeddedFloatingButtons />
            </AppDataProvider>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
