"use client";

const bodyTypeIcons: Record<string, React.ReactNode> = {
  Sedan: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 28h64M5 28c0-3 2-8 6-12s10-8 18-8h22c8 0 14 4 18 8s6 9 6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M25 12h30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  SUV: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 30h64M5 30c0-4 1-10 4-14s8-8 16-8h30c6 0 10 3 13 7s5 10 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="30" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="30" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M22 10h36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 10v20M62 10v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Hatchback: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 28h64M5 28c0-3 2-8 6-12s10-6 18-6h14c10 0 18 2 22 8s8 7 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Coupe: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 28h64M5 28c0-3 3-10 8-14s12-6 20-6h10c10 0 16 4 20 8s8 9 8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Pickup: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 30h64M5 30c0-3 1-8 4-12s8-6 14-6h6c4 0 6 2 8 6h30c2 0 4 2 5 5s2 5 2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="30" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="30" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M37 18h30v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Van: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 30h64M5 30V12c0-2 2-4 4-4h40c4 0 10 2 14 6s8 10 10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="30" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="30" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Convertible: (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M8 28h64M5 28c0-3 3-8 7-12s10-6 16-6h24c8 0 14 4 18 8s6 7 6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="28" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M20 12c8-2 20-2 28 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
    </svg>
  ),
};

export function BodyTypeIcon({ type, className }: { type: string; className?: string }) {
  return (
    <div className={className || "w-16 h-8 text-secondary"}>
      {bodyTypeIcons[type] || bodyTypeIcons.Sedan}
    </div>
  );
}
