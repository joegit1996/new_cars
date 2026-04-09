"use client";

import { useIsEmbedded } from "../hooks/useIsEmbedded";

const brandLinks = [
  { label: "Toyota", href: "/brand/toyota" },
  { label: "Lexus", href: "/brand/lexus" },
  { label: "BMW", href: "/brand/bmw" },
  { label: "Mercedes-Benz", href: "/brand/mercedes" },
  { label: "Chery", href: "/brand/chery" },
  { label: "Changan", href: "/brand/changan" },
  { label: "View All Brands", href: "/brands" },
];

const bodyTypeLinks = [
  { label: "Sedan", href: "/browse?body=sedan" },
  { label: "SUV", href: "/browse?body=suv" },
  { label: "Hatchback", href: "/browse?body=hatchback" },
  { label: "Coupe", href: "/browse?body=coupe" },
  { label: "Pickup", href: "/browse?body=pickup" },
  { label: "Convertible", href: "/browse?body=convertible" },
];

const quickLinks = [
  { label: "Compare Cars", href: "/compare" },
  { label: "About 4Sale New Cars", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const contactInfo = [
  { label: "Email", value: "newcars@4sale.com.kw" },
  { label: "Phone", value: "+965 1234 5678" },
  { label: "Location", value: "Kuwait City, Kuwait" },
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
  if (isEmbedded) return null;

  return (
    <footer className="bg-[#0F1B2D] text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Branding */}
        <div className="mb-8">
          <span className="text-white font-bold text-xl tracking-tight">
            4Sale <span className="text-[#60A5FA]">New Cars</span>
          </span>
          <p className="text-sm mt-2 max-w-md">
            Browse, compare, and configure new cars from every brand available in Kuwait.
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn title="Brands">
            <ul className="space-y-2">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Body Types">
            <ul className="space-y-2">
              {bodyTypeLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Quick Links">
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Contact">
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
          2026 4Sale New Cars. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
