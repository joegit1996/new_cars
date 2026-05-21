"use client";

// Side-view silhouette icons, each shaped to make the body type
// unmistakable at a glance (cabin profile + roof + bed/cargo cues).
const bodyTypeIcons: Record<string, React.ReactNode> = {
  Sedan: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 26h74M6 26c0-2 1-4 2-6l2-4c1-2 3-4 6-5l8-2c3-1 8-1 12-1h6c5 0 9 1 14 4l8 5c3 2 6 5 8 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M22 11c2-4 5-5 9-5h10c5 0 10 1 14 5l4 4H22z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M40 6v9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="27" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="27" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  SUV: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 28h74M6 28V18c0-2 2-4 4-5l8-3c3-1 7-2 12-2h22c4 0 8 2 11 4l8 5c3 2 5 6 5 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="14" y="8" width="46" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M37 8v10" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="29" r="5.5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="29" r="5.5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Hatchback: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 26h74M6 26c0-3 1-6 3-9l3-4c2-2 5-3 8-3h6c5 0 12 0 18 3l16 8c4 2 8 3 12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M18 10c2-2 5-3 8-3h6c6 0 14 1 20 5l4 3H18z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M35 7v8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="27" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="58" cy="27" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Coupe: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 28h74M5 28c0-2 1-4 2-7l3-5c1-2 4-3 7-3l4-1c4-1 9-2 14-2h6c5 0 10 2 14 5l10 6c3 2 7 4 11 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M26 11c4-2 9-3 14-3h6c5 0 9 1 13 4l3 3H26z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="22" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Pickup: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 28h74M6 28V20c0-2 2-4 4-5l4-2c2-1 5-2 8-2h6c3 0 5 1 6 4l1 3h35v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="13" y="10" width="22" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M24 10v9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Van: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 28h74M6 28V10c0-2 2-3 4-3h44c3 0 6 1 9 4l8 8c2 2 4 5 4 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="14" y="11" width="36" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M28 11v9M40 11v9" stroke="currentColor" strokeWidth="1.2" />
      <path d="M54 13l8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Convertible: (
    <svg viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M3 28h74M6 28c0-2 1-5 3-7l2-4c2-3 5-5 8-6l6-1c4-1 9-1 14-1h6c5 0 9 1 14 4l8 5c3 2 6 5 8 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M24 13c4-3 10-5 16-5h8c4 0 7 1 10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" fill="none" />
      <path d="M16 14h44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="29" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
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
