"use client";

import { useIsEmbedded } from "../hooks/useIsEmbedded";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import EmbedLink from "./EmbedLink";

const brandLinks = [
  { id: "toyota", href: "/brand/toyota", label: "Toyota" },
  { id: "lexus", href: "/brand/lexus", label: "Lexus" },
  { id: "bmw", href: "/brand/bmw", label: "BMW" },
  { id: "mercedes", href: "/brand/mercedes", label: "Mercedes-Benz" },
  { id: "chery", href: "/brand/chery", label: "Chery" },
  { id: "changan", href: "/brand/changan", label: "Changan" },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-bold text-white text-sm mb-3">{title}</h4>
      {children}
    </div>
  );
}

export default function Footer() {
  const isEmbedded = useIsEmbedded();
  const { t, ln } = useLanguage();
  if (isEmbedded) return null;

  const bodyTypeLinks = [
    { key: "sedan", href: "/browse?body=sedan", label: t.bodyTypes.Sedan },
    { key: "suv", href: "/browse?body=suv", label: t.bodyTypes.SUV },
    { key: "hatchback", href: "/browse?body=hatchback", label: t.bodyTypes.Hatchback },
    { key: "coupe", href: "/browse?body=coupe", label: t.bodyTypes.Coupe },
    { key: "pickup", href: "/browse?body=pickup", label: t.bodyTypes.Pickup },
    { key: "convertible", href: "/browse?body=convertible", label: t.bodyTypes.Convertible },
  ];

  const quickLinks = [
    { key: "compare", href: "/compare", label: t.footer.compareCars },
    { key: "about", href: "/about", label: t.footer.about },
    { key: "contact", href: "/contact", label: t.footer.contactUs },
    { key: "privacy", href: "/privacy", label: t.footer.privacy },
    { key: "terms", href: "/terms", label: t.footer.terms },
  ];

  const contactInfo = [
    { label: t.footer.email, value: "newcars@4sale.com.kw" },
    { label: t.footer.phone, value: "+965 1234 5678" },
    { label: t.footer.location, value: t.footer.locationValue },
  ];

  return (
    <footer className="bg-[#0F1B2D] text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Branding */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-white font-bold text-xl tracking-tight">
              {t.nav.brand} <span className="text-[#60A5FA]">{t.nav.brandAccent}</span>
            </span>
            <p className="text-sm mt-2 max-w-md">{t.footer.tagline}</p>
          </div>
          <LanguageSwitcher variant="footer" />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn title={t.footer.brands}>
            <ul className="space-y-2">
              {brandLinks.map((link) => (
                <li key={link.id}>
                  <EmbedLink
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {ln.brand(link.label)}
                  </EmbedLink>
                </li>
              ))}
              <li>
                <EmbedLink
                  href="/browse?view=brands"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t.footer.viewAllBrands}
                </EmbedLink>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn title={t.footer.bodyTypes}>
            <ul className="space-y-2">
              {bodyTypeLinks.map((link) => (
                <li key={link.key}>
                  <EmbedLink
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </EmbedLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t.footer.quickLinks}>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <EmbedLink
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </EmbedLink>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={t.footer.contact}>
            <ul className="space-y-2">
              {contactInfo.map((item) => (
                <li key={item.label} className="text-sm">
                  <span className="text-white/60">{item.label}:</span>{" "}
                  {item.value}
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-[#64748B] text-center">
          {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
