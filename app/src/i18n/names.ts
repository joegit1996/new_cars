// Arabic translations / transliterations for brand, model, trim, and branch names.
// Numeric trim/model codes like "C 200", "GT 63" stay alphanumeric — only words are
// transliterated. If a name is not in the map we fall back to the original English.

const BRAND_NAMES_AR: Record<string, string> = {
  "Mercedes-Benz": "مرسيدس-بنز",
  "Porsche": "بورشه",
  "Mitsubishi": "ميتسوبيشي",
  "SouEast": "ساوث إيست",
  "Toyota": "تويوتا",
  "Lexus": "لكزس",
  "BMW": "بي إم دبليو",
  "Chery": "شيري",
  "Changan": "شانجان",
  "Haval": "هافال",
  "MG": "إم جي",
};

const MODEL_NAMES_AR: Record<string, string> = {
  // Mercedes
  "A 200": "إيه 200",
  "C 200": "سي 200",
  "C 300": "سي 300",
  "AMG C 43": "إيه إم جي سي 43",
  "E 200": "إي 200",
  "E 300": "إي 300",
  "S 500": "إس 500",
  "CLE 200": "سي إل إي 200",
  "GLA 200": "جي إل إيه 200",
  "GLC 200": "جي إل سي 200",
  "GLC 300": "جي إل سي 300",
  "GLE 450": "جي إل إي 450",
  "AMG GLE 53": "إيه إم جي جي إل إي 53",
  "GLS 450": "جي إل إس 450",
  "G 500": "جي 500",
  "AMG GT 63": "إيه إم جي جي تي 63",
  "EQE 350+": "إي كيو إي 350+",

  // Porsche
  "718 Boxster": "718 بوكستر",
  "718 Boxster S": "718 بوكستر إس",
  "718 Boxster GTS 4.0": "718 بوكستر جي تي إس 4.0",
  "718 Cayman": "718 كايمن",
  "718 Cayman S": "718 كايمن إس",
  "718 Cayman GTS 4.0": "718 كايمن جي تي إس 4.0",
  "911 Carrera": "911 كاريرا",
  "911 GT3": "911 جي تي 3",
  "911 Turbo S": "911 تيربو إس",
  "Carrera": "كاريرا",
  "Carrera S": "كاريرا إس",
  "Carrera GTS": "كاريرا جي تي إس",
  "GT": "جي تي",
  "GT3": "جي تي 3",
  "GT3 RS": "جي تي 3 آر إس",
  "Turbo S": "تيربو إس",
  "Turbo E-Hybrid": "تيربو إي-هايبرد",
  "Macan": "ماكان",
  "Macan S": "ماكان إس",
  "Macan GTS": "ماكان جي تي إس",
  "Macan Electric": "ماكان كهربائية",
  "Macan Turbo Electric": "ماكان تيربو كهربائية",
  "Cayenne": "كايين",
  "Cayenne S": "كايين إس",
  "Cayenne E-Hybrid": "كايين إي-هايبرد",
  "Cayenne Electric": "كايين كهربائية",
  "Cayenne S Electric": "كايين إس كهربائية",
  "Panamera": "باناميرا",
  "Panamera GTS": "باناميرا جي تي إس",
  "Taycan": "تايكان",
  "Taycan 4S": "تايكان 4 إس",
  "Taycan Turbo S": "تايكان تيربو إس",

  // Mitsubishi
  "Attrage": "أتراج",
  "Mirage": "ميراج",
  "Xpander": "إكسباندر",
  "Xpander Cross": "إكسباندر كروس",
  "Xforce": "إكسفورس",
  "Eclipse Cross": "إكليبس كروس",
  "Outlander": "أوتلاندر",
  "Montero Sport": "مونتيرو سبورت",
  "ASX": "إيه إس إكس",
  "Destinator": "ديستينيتور",
  "L200": "إل 200",

  // SouEast
  "S06": "إس 06",
  "S07": "إس 07",
  "S09": "إس 09",
  "GLS": "جي إل إس",
  "GLX": "جي إل إكس",
};

const TRIM_NAMES_AR: Record<string, string> = {
  "Standard": "ستاندرد",
  "Premium": "بريميوم",
  "Comfort": "كومفورت",
  "Sport": "سبورت",
  "Luxury": "لاكشري",
  "Base": "أساسي",
  "Touring": "تورينج",
  "Limited": "ليمتد",
  "Executive": "إكزكيوتيف",
  "Signature": "سيجنتشر",
  "GT": "جي تي",
  "GTS": "جي تي إس",
  "GT3": "جي تي 3",
  "Turbo S": "تيربو إس",
  "Electric": "كهربائية",
  "E-Hybrid": "إي-هايبرد",
  "Hybrid": "هايبرد",
  "1.5T Comfort": "1.5T كومفورت",
  "1.6T Comfort": "1.6T كومفورت",
  "1.6T Premium": "1.6T بريميوم",
  "2.0T Premium": "2.0T بريميوم",
};

const BRANCH_NAMES_AR: Record<string, string> = {
  "4Sale New Cars - Ahmadi": "فورسيل سيارات جديدة - الأحمدي",
  "4Sale New Cars - Fahaheel": "فورسيل سيارات جديدة - الفحيحيل",
  "4Sale New Cars - Shuwaikh": "فورسيل سيارات جديدة - الشويخ",
  "4Sale New Cars - The Avenues": "فورسيل سيارات جديدة - الأفنيوز",
};

const LOCATIONS_AR: Record<string, string> = {
  "Shuwaikh Industrial, Block 1, Kuwait City": "الشويخ الصناعية، قطعة 1، مدينة الكويت",
  "Ahmadi, Main Street, Kuwait": "الأحمدي، الشارع الرئيسي، الكويت",
  "Fahaheel, Mecca Street, Kuwait": "الفحيحيل، شارع مكة، الكويت",
  "The Avenues Mall, Al Rai, Kuwait": "مجمع الأفنيوز، الري، الكويت",
};

const TAGLINES_AR: Record<string, string> = {
  "The best or nothing": "الأفضل أو لا شيء",
  "There is no substitute": "لا بديل عنها",
  "Drive your ambition": "قُد طموحك",
  "Drive beyond expectations": "قُد إلى ما يفوق التوقعات",
};

const FUEL_TYPE_AR: Record<string, string> = {
  Petrol: "بنزين",
  Diesel: "ديزل",
  Hybrid: "هايبرد",
  PHEV: "هايبرد قابل للشحن",
  Electric: "كهربائي",
};

const DRIVE_TYPE_AR: Record<string, string> = {
  FWD: "دفع أمامي",
  RWD: "دفع خلفي",
  AWD: "دفع رباعي",
  "4WD": "دفع رباعي",
  "AWD/4WD": "دفع رباعي",
};

const TRANSMISSION_AR: Record<string, string> = {
  Automatic: "أوتوماتيك",
  Manual: "عادي",
  CVT: "CVT",
};

const BODY_TYPE_AR: Record<string, string> = {
  Sedan: "سيدان",
  SUV: "دفع رباعي",
  Hatchback: "هاتشباك",
  Coupe: "كوبيه",
  Pickup: "بيك أب",
  Van: "فان",
  Convertible: "مكشوفة",
};

const COLLECTION_TITLES_AR: Record<string, string> = {
  performance: "الأداء والرياضة",
  "family-suv": "سيارات الـSUV العائلية",
  "luxury-daily": "سيارات الفخامة اليومية",
  "budget-friendly": "بأسعار مناسبة (أقل من 8,000 د.ك)",
  "electric-hybrid": "كهربائية وهايبرد",
};

const COLLECTION_DESCRIPTIONS_AR: Record<string, string> = {
  performance: "لمن يعيش الحياة على المسار السريع.",
  "family-suv": "واسعة وآمنة ومليئة بالمزايا لكامل العائلة.",
  "luxury-daily": "تنقّل بأناقة كل يوم.",
  "budget-friendly": "قيمة ممتازة وسيارات تناسب أي ميزانية.",
  "electric-hybrid": "مستقبل القيادة، متاح اليوم.",
};

const CLASS_NAMES_AR: Record<string, string> = {
  "A-Class": "الفئة إيه",
  "C-Class": "الفئة سي",
  "E-Class": "الفئة إي",
  "S-Class": "الفئة إس",
  "G-Class": "الفئة جي",
  "GLA-Class": "الفئة جي إل إيه",
  "GLC-Class": "الفئة جي إل سي",
  "GLE-Class": "الفئة جي إل إي",
  "GLS-Class": "الفئة جي إل إس",
  "CLE-Class": "الفئة سي إل إي",
  "EQE-Class": "الفئة إي كيو إي",
  "AMG GT": "إيه إم جي جي تي",
  "Compact": "كومباكت",
  "Mid-size": "متوسطة",
  "Full-size": "كاملة",
  "Sports": "رياضية",
  "Luxury": "فاخرة",
};

// Translation maps grouped for export. Each function returns the original name
// when language is "en" (or any locale other than "ar") and the Arabic translation
// when one is available; otherwise it falls back to the original English string.

export type LocalizableLang = "en" | "ar";

export function locBrand(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return BRAND_NAMES_AR[name] ?? name;
}

export function locModel(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return MODEL_NAMES_AR[name] ?? name;
}

export function locTrim(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return TRIM_NAMES_AR[name] ?? name;
}

export function locBranch(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return BRANCH_NAMES_AR[name] ?? name;
}

export function locLocation(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return LOCATIONS_AR[name] ?? name;
}

export function locTagline(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return TAGLINES_AR[name] ?? name;
}

export function locFuel(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return FUEL_TYPE_AR[name] ?? name;
}

export function locDrive(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return DRIVE_TYPE_AR[name] ?? name;
}

export function locTransmission(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return TRANSMISSION_AR[name] ?? name;
}

export function locBody(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return BODY_TYPE_AR[name] ?? name;
}

export function locClass(name: string, lang: LocalizableLang): string {
  if (lang !== "ar") return name;
  return CLASS_NAMES_AR[name] ?? name;
}

export function locCollectionTitle(id: string, fallback: string, lang: LocalizableLang): string {
  if (lang !== "ar") return fallback;
  return COLLECTION_TITLES_AR[id] ?? fallback;
}

export function locCollectionDescription(id: string, fallback: string, lang: LocalizableLang): string {
  if (lang !== "ar") return fallback;
  return COLLECTION_DESCRIPTIONS_AR[id] ?? fallback;
}

/**
 * Translate compound model-family strings like "C-Class Sedan" or "Mercedes-Benz C 200"
 * by replacing each known token with its Arabic equivalent. Best-effort:
 * unknown tokens (numbers, dashes) pass through unchanged.
 */
export function locCompound(text: string, lang: LocalizableLang): string {
  if (lang !== "ar" || !text) return text;
  let out = text;
  for (const [en, ar] of Object.entries(BRAND_NAMES_AR)) out = out.replaceAll(en, ar);
  for (const [en, ar] of Object.entries(MODEL_NAMES_AR)) out = out.replaceAll(en, ar);
  for (const [en, ar] of Object.entries(CLASS_NAMES_AR)) out = out.replaceAll(en, ar);
  for (const [en, ar] of Object.entries(BODY_TYPE_AR)) out = out.replaceAll(en, ar);
  return out;
}

/**
 * Translate an engine summary like "1.5L 4-cyl Turbo, 204 hp" to Arabic.
 * Numbers and units stay, descriptive words become Arabic.
 */
export function locEngineSummary(text: string, lang: LocalizableLang): string {
  if (lang !== "ar" || !text) return text;
  return text
    .replace(/Inline-(\d+) Turbo/g, "ستة أسطوانات على التوالي تيربو ($1)")
    .replace(/Inline-(\d+)/g, "$1 أسطوانات على التوالي")
    .replace(/(\d+)-cyl Turbo/g, "$1 أسطوانات تيربو")
    .replace(/(\d+)-cyl/g, "$1 أسطوانات")
    .replace(/Turbo/g, "تيربو")
    .replace(/Hybrid/g, "هايبرد")
    .replace(/Electric/g, "كهربائي")
    .replace(/Diesel/g, "ديزل")
    .replace(/Petrol/g, "بنزين")
    .replace(/\bhp\b/g, "حصان");
}
