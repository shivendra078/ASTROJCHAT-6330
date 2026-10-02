/**
 * Extra Vedic calculations layered on top of computeKundli():
 * KP (Placidus cusps, star/sub lords), divisional charts, planet dignity,
 * Yogini dasha, Sade Sati transits, Kaal Sarp, gemstones and report text.
 * Accuracy is "good for a free tool" (mean nodes, approximate Lahiri ayanamsa).
 */
import * as Astronomy from "astronomy-engine";
import { birthDateUTC, computeKundli, lahiri, norm, SIGNS, SIGN_LORDS, tropicalLon, type BirthInput, type Kundli, type PlanetPos } from "./kundli";

export const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const DASHA_YEARS: Record<string, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
export const YEAR_MS = 365.2425 * 86400 * 1000;
const NAK_SPAN = 360 / 27;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/* ---------------- sample ---------------- */
export const SAMPLE_INPUT: BirthInput = {
  name: "Aarav Sharma",
  gender: "Male",
  dob: "1995-08-15",
  tob: "10:30",
  place: "New Delhi, Delhi",
  lat: 28.6139,
  lon: 77.209,
};

/* ---------------- formatting ---------------- */
export const fmtIST = (d: Date | null | undefined) =>
  d ? d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).toUpperCase() : "—";
export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).replace("Sept", "Sep");
export const fmtDMS = (d: number) => {
  const D = Math.floor(d);
  const M = Math.floor((d - D) * 60);
  const S = Math.floor(((d - D) * 60 - M) * 60);
  return `${D}°${String(M).padStart(2, "0")}′${String(S).padStart(2, "0")}″`;
};

/* ---------------- KP lords ---------------- */
function subdivide(offset: number, width: number, startIdx: number) {
  let off = offset;
  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const w = (width * DASHA_YEARS[DASHA_ORDER[idx]]) / 120;
    if (off < w || i === 8) return { idx, offset: off, width: w };
    off -= w;
  }
  return { idx: startIdx, offset: 0, width };
}

export function kpLords(lon: number) {
  const n = Math.floor(lon / NAK_SPAN);
  const starIdx = n % 9;
  const sub = subdivide(lon - n * NAK_SPAN, NAK_SPAN, starIdx);
  const subsub = subdivide(sub.offset, sub.width, sub.idx);
  return {
    signLord: SIGN_LORDS[Math.floor(lon / 30)],
    star: DASHA_ORDER[starIdx],
    sub: DASHA_ORDER[sub.idx],
    subsub: DASHA_ORDER[subsub.idx],
  };
}
export const nakLord = (lon: number) => DASHA_ORDER[Math.floor(lon / NAK_SPAN) % 9];

/* ---------------- Placidus cusps (sidereal) ---------------- */
export function placidusCusps(input: BirthInput): number[] {
  const t = Astronomy.MakeTime(birthDateUTC(input.dob, input.tob));
  const ay = lahiri(t.ut + 2451545.0);
  const e = rad(Astronomy.e_tilt(t).tobl);
  const ramc = norm(Astronomy.SiderealTime(t) * 15 + input.lon);
  const phi = rad(input.lat);
  const raToLon = (ra: number) => norm(deg(Math.atan2(Math.sin(rad(ra)), Math.cos(rad(ra)) * Math.cos(e))));

  const cusp = (f: number, above: boolean) => {
    let ra = above ? ramc + f * 90 : ramc + 180 - f * 90;
    for (let i = 0; i < 40; i++) {
      const lon = raToLon(ra);
      const decl = Math.asin(Math.sin(e) * Math.sin(rad(lon)));
      const ad = deg(Math.asin(Math.max(-1, Math.min(1, Math.tan(phi) * Math.tan(decl)))));
      ra = above ? ramc + f * (90 + ad) : ramc + 180 - f * (90 - ad);
    }
    return raToLon(ra);
  };

  const trop: number[] = Array.from({ length: 12 }, () => 0);
  trop[9] = raToLon(ramc); // 10th (MC)
  trop[10] = cusp(1 / 3, true);
  trop[11] = cusp(2 / 3, true);
  trop[0] = cusp(1, true);
  trop[1] = cusp(2 / 3, false);
  trop[2] = cusp(1 / 3, false);
  for (let i = 3; i < 9; i++) trop[i] = norm(trop[(i + 6) % 12] + 180);
  return trop.map((x) => norm(x - ay));
}

export function houseOf(lon: number, cusps: number[]) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i];
    const b = cusps[(i + 1) % 12];
    const span = norm(b - a);
    if (norm(lon - a) < span) return i + 1;
  }
  return 1;
}

/* ---------------- dignity, avastha, combustion ---------------- */
const EXALT: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 };
const OWN: Record<string, number[]> = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10], Rahu: [10], Ketu: [7] };
const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
  Rahu: ["Venus", "Saturn", "Mercury"],
  Ketu: ["Mars", "Jupiter"],
};
const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
  Rahu: ["Sun", "Moon"],
  Ketu: ["Venus", "Saturn"],
};

export type Dignity = "Exalted" | "Debilitated" | "Own sign" | "Friendly" | "Neutral" | "Enemy";
export function dignity(planet: string, sign: number): Dignity {
  if (EXALT[planet] === sign) return "Exalted";
  if ((EXALT[planet] + 6) % 12 === sign) return "Debilitated";
  if (OWN[planet]?.includes(sign)) return "Own sign";
  const lord = SIGN_LORDS[sign];
  if (FRIENDS[planet]?.includes(lord)) return "Friendly";
  if (ENEMIES[planet]?.includes(lord)) return "Enemy";
  return "Neutral";
}

const AVASTHA = ["Bala", "Kumara", "Yuva", "Vriddha", "Mrita"];
export function avastha(sign: number, degInSign: number) {
  const i = Math.min(4, Math.floor(degInSign / 6));
  return sign % 2 === 0 ? AVASTHA[i] : AVASTHA[4 - i];
}

export function isCombust(p: PlanetPos, sunLon: number) {
  const orb: Record<string, number> = { moon: 12, mars: 17, mercury: p.retro ? 12 : 14, jupiter: 11, venus: p.retro ? 8 : 10, saturn: 15 };
  if (!(p.key in orb)) return false;
  const d = Math.abs(norm(p.lon - sunLon + 180) - 180);
  return d < orb[p.key];
}

/* ---------------- divisional charts ---------------- */
export type Varga = { id: string; name: string; short: string; about: string };
export const VARGAS: Varga[] = [
  { id: "chalit", name: "Chalit", short: "Bhav Chalit", about: "Planets placed by actual house cusps" },
  { id: "sun", name: "Sun", short: "Surya", about: "Chart read from the Sun — soul, father, authority" },
  { id: "moon", name: "Moon", short: "Chandra", about: "Chart read from the Moon — mind and emotions" },
  { id: "d1", name: "Birth", short: "D1 · Lagna", about: "Body, personality and the whole of life" },
  { id: "d2", name: "Hora", short: "D2", about: "Wealth, savings and family resources" },
  { id: "d3", name: "Drekkana", short: "D3", about: "Siblings, courage and initiative" },
  { id: "d4", name: "Chaturthamsa", short: "D4", about: "Property, home and fortune" },
  { id: "d7", name: "Saptamsa", short: "D7", about: "Children and progeny" },
  { id: "d9", name: "Navamsa", short: "D9", about: "Spouse, marriage and planet strength" },
  { id: "d10", name: "Dasamsa", short: "D10", about: "Career, status and achievements" },
  { id: "d12", name: "Dwadasamsa", short: "D12", about: "Parents and ancestry" },
  { id: "d16", name: "Shodasamsa", short: "D16", about: "Vehicles, comforts and happiness" },
  { id: "d20", name: "Vimsamsa", short: "D20", about: "Spiritual progress and worship" },
  { id: "d24", name: "Chaturvimsamsa", short: "D24", about: "Education and learning" },
  { id: "d27", name: "Bhamsa", short: "D27", about: "Physical strength and stamina" },
  { id: "d30", name: "Trimsamsa", short: "D30", about: "Misfortunes and hidden troubles" },
  { id: "d40", name: "Khavedamsa", short: "D40", about: "Auspicious and inauspicious effects" },
  { id: "d45", name: "Akshavedamsa", short: "D45", about: "Character and general conduct" },
  { id: "d60", name: "Shashtiamsa", short: "D60", about: "Past-life karma — the finest division" },
];

export function vargaSign(lon: number, n: number): number {
  const s = Math.floor(lon / 30);
  const d = lon - s * 30;
  const odd = s % 2 === 0; // Aries (0) is an odd sign
  const mod = s % 3; // 0 movable, 1 fixed, 2 dual
  const p = (w: number) => Math.floor(d / w);
  switch (n) {
    case 1:
      return s;
    case 2:
      return odd ? (d < 15 ? 4 : 3) : d < 15 ? 3 : 4;
    case 3:
      return (s + 4 * p(10)) % 12;
    case 4:
      return (s + 3 * p(7.5)) % 12;
    case 7:
      return (s + (odd ? 0 : 6) + p(30 / 7)) % 12;
    case 9:
      return Math.floor(lon / (30 / 9)) % 12;
    case 10:
      return (s + (odd ? 0 : 8) + p(3)) % 12;
    case 12:
      return (s + p(2.5)) % 12;
    case 16:
      return ([0, 4, 8][mod] + p(30 / 16)) % 12;
    case 20:
      return ([0, 8, 4][mod] + p(1.5)) % 12;
    case 24:
      return ((odd ? 4 : 3) + p(1.25)) % 12;
    case 27:
      return ((s % 4) * 3 + p(30 / 27)) % 12;
    case 30:
      if (odd) return d < 5 ? 0 : d < 10 ? 10 : d < 18 ? 8 : d < 25 ? 2 : 6;
      return d < 5 ? 1 : d < 12 ? 5 : d < 20 ? 11 : d < 25 ? 9 : 7;
    case 40:
      return ((odd ? 0 : 6) + p(0.75)) % 12;
    case 45:
      return ([0, 4, 8][mod] + p(30 / 45)) % 12;
    case 60:
      return (s + p(0.5)) % 12;
    default:
      return s;
  }
}

/* ---------------- birth-day sunrise / sunset ---------------- */
export function sunTimes(input: BirthInput) {
  const obs = new Astronomy.Observer(input.lat, input.lon, 0);
  const [y, m, d] = input.dob.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, -5, -30));
  const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, +1, start, 1);
  const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, obs, -1, start, 1);
  return { rise: rise?.date ?? null, set: set?.date ?? null };
}

/* ---------------- Avakhada extras ---------------- */
const SYLLABLES = [
  "Chu Che Cho La", "Li Lu Le Lo", "A I U E", "O Va Vi Vu", "Ve Vo Ka Ki", "Ku Gha Ng Chha", "Ke Ko Ha Hi", "Hu He Ho Da", "Di Du De Do",
  "Ma Mi Mu Me", "Mo Ta Ti Tu", "Te To Pa Pi", "Pu Sha Na Tha", "Pe Po Ra Ri", "Ru Re Ro Ta", "Ti Tu Te To", "Na Ni Nu Ne", "No Ya Yi Yu",
  "Ye Yo Bha Bhi", "Bhu Dha Pha Dha", "Be Bo Ja Ji", "Ju Je Jo Gha", "Ga Gi Gu Ge", "Go Sa Si Su", "Se So Da Di", "Du Tha Jha Na", "De Do Cha Chi",
].map((s) => s.split(" "));
export const ELEMENTS = ["Fire", "Earth", "Air", "Water"] as const;
export const tatva = (sign: number) => ELEMENTS[sign % 4];

export function avakhadaExtra(k: Kundli) {
  const moon = k.planets[1];
  const nakIdx = Math.floor(moon.lon / NAK_SPAN);
  const paya = [1, 6, 11].includes(moon.house) ? "Gold (Swarna)" : [2, 5, 9].includes(moon.house) ? "Silver (Rajat)" : [3, 7, 10].includes(moon.house) ? "Copper (Tamra)" : "Iron (Loha)";
  return {
    syllable: SYLLABLES[nakIdx][k.pada - 1],
    yunja: nakIdx < 9 ? "Purva (Adya)" : nakIdx < 18 ? "Madhya" : "Antya",
    tatva: tatva(k.moonSign),
    paya,
    nakLord: DASHA_ORDER[nakIdx % 9],
  };
}

/* ---------------- Vimshottari levels ---------------- */
export type Period = { lord: string; start: Date; end: Date };
export function subPeriods(parent: Period, fullYearsOfParent?: number): Period[] {
  // Sub-periods span the full (un-truncated) parent length; for the birth dasha the first ones fall before birth.
  const total = (fullYearsOfParent ?? (parent.end.getTime() - parent.start.getTime()) / YEAR_MS) * YEAR_MS;
  let cursor = parent.end.getTime() - total;
  const start = DASHA_ORDER.indexOf(parent.lord);
  return Array.from({ length: 9 }, (_, i) => {
    const lord = DASHA_ORDER[(start + i) % 9];
    const s = new Date(cursor);
    cursor += (total * DASHA_YEARS[lord]) / 120;
    return { lord, start: s, end: new Date(cursor) };
  });
}
export const runningAt = (list: Period[], t: Date) => list.find((p) => p.start <= t && t < p.end) ?? null;

/* ---------------- Yogini dasha ---------------- */
const YOGINI = [
  { name: "Mangala", lord: "Moon", years: 1 },
  { name: "Pingala", lord: "Sun", years: 2 },
  { name: "Dhanya", lord: "Jupiter", years: 3 },
  { name: "Bhramari", lord: "Mars", years: 4 },
  { name: "Bhadrika", lord: "Mercury", years: 5 },
  { name: "Ulka", lord: "Saturn", years: 6 },
  { name: "Siddha", lord: "Venus", years: 7 },
  { name: "Sankata", lord: "Rahu", years: 8 },
];
export function yoginiDasha(k: Kundli, birth: Date) {
  const moon = k.planets[1];
  const n = Math.floor(moon.lon / NAK_SPAN);
  const first = (((n + 1 + 3) % 8) + 7) % 8; // remainder 1 = Mangala
  const frac = 1 - (moon.lon - n * NAK_SPAN) / NAK_SPAN;
  const out: { name: string; lord: string; start: Date; end: Date }[] = [];
  let cursor = birth.getTime();
  const limit = birth.getTime() + 100 * YEAR_MS;
  for (let i = 0; cursor < limit; i++) {
    const y = YOGINI[(first + i) % 8];
    const yrs = i === 0 ? y.years * frac : y.years;
    const s = new Date(cursor);
    cursor += yrs * YEAR_MS;
    out.push({ name: y.name, lord: y.lord, start: s, end: new Date(cursor) });
  }
  return out;
}

/* ---------------- Sade Sati ---------------- */
export type SatiPhase = { kind: "Sade Sati" | "Dhaiya"; phase: string; sign: number; start: Date; end: Date };
function saturnSign(d: Date) {
  const t = Astronomy.MakeTime(d);
  return Math.floor(norm(tropicalLon(Astronomy.Body.Saturn, t) - lahiri(t.ut + 2451545.0)) / 30);
}
export function sadeSati(moonSign: number, birth: Date): SatiPhase[] {
  const label = (rel: number) =>
    rel === 11 ? { kind: "Sade Sati" as const, phase: "Rising" } : rel === 0 ? { kind: "Sade Sati" as const, phase: "Peak" } : rel === 1 ? { kind: "Sade Sati" as const, phase: "Setting" } : rel === 3 ? { kind: "Dhaiya" as const, phase: "Kantak (4th)" } : rel === 7 ? { kind: "Dhaiya" as const, phase: "Ashtam (8th)" } : null;
  const out: SatiPhase[] = [];
  const step = 7 * 86400 * 1000;
  const end = birth.getTime() + 100 * YEAR_MS;
  let cur: SatiPhase | null = null;
  for (let t = birth.getTime(); t < end; t += step) {
    const d = new Date(t);
    const sign = saturnSign(d);
    const l = label((sign - moonSign + 12) % 12);
    if (cur && (!l || cur.sign !== sign)) {
      cur.end = d;
      out.push(cur);
      cur = null;
    }
    if (l && !cur) cur = { ...l, sign, start: d, end: d };
  }
  if (cur) {
    cur.end = new Date(end);
    out.push(cur);
  }
  return out;
}

/* ---------------- Kaal Sarp ---------------- */
const KAAL_SARP = ["Anant", "Kulik", "Vasuki", "Shankhpal", "Padma", "Mahapadma", "Takshak", "Karkotak", "Shankhachud", "Ghatak", "Vishdhar", "Sheshnag"];
export function kaalSarp(k: Kundli) {
  const rahu = k.planets.find((p) => p.key === "rahu")!;
  const seven = k.planets.filter((p) => p.key !== "rahu" && p.key !== "ketu");
  const rel = seven.map((p) => norm(p.lon - rahu.lon));
  const one = rel.every((r) => r < 180) || rel.every((r) => r > 180);
  return { present: one, type: one ? `${KAAL_SARP[rahu.house - 1]} Kaal Sarp` : null, rahuHouse: rahu.house };
}

/* ---------------- KP ruling planets (now) ---------------- */
const DAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
export function rulingPlanets(input: BirthInput, now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const dob = ist.toISOString().slice(0, 10);
  const tob = ist.toISOString().slice(11, 16);
  const k = computeKundli({ ...input, dob, tob });
  const asc = kpLords(k.ascendant.lon);
  const moon = kpLords(k.planets[1].lon);
  return {
    at: now,
    day: DAY_LORDS[ist.getUTCDay()],
    rows: [
      { l: "Ascendant", sign: asc.signLord, star: asc.star, sub: asc.sub },
      { l: "Moon", sign: moon.signLord, star: moon.star, sub: moon.sub },
    ],
  };
}

/* ---------------- gemstones / rudraksha ---------------- */
export const GEMS: Record<string, { gem: string; alt: string; finger: string; day: string; metal: string; deity: string; weight: string }> = {
  Sun: { gem: "Ruby", alt: "Red Garnet", finger: "Ring finger", day: "Sunday", metal: "Gold", deity: "Surya", weight: "3–6 carats" },
  Moon: { gem: "Pearl", alt: "Moonstone", finger: "Little finger", day: "Monday", metal: "Silver", deity: "Chandra", weight: "4–7 carats" },
  Mars: { gem: "Red Coral", alt: "Carnelian", finger: "Ring finger", day: "Tuesday", metal: "Gold or copper", deity: "Hanuman", weight: "6–9 carats" },
  Mercury: { gem: "Emerald", alt: "Peridot", finger: "Little finger", day: "Wednesday", metal: "Gold", deity: "Vishnu", weight: "3–6 carats" },
  Jupiter: { gem: "Yellow Sapphire", alt: "Citrine", finger: "Index finger", day: "Thursday", metal: "Gold", deity: "Brihaspati", weight: "3–5 carats" },
  Venus: { gem: "Diamond", alt: "White Sapphire", finger: "Middle finger", day: "Friday", metal: "Platinum or silver", deity: "Lakshmi", weight: "0.5–1 carat" },
  Saturn: { gem: "Blue Sapphire", alt: "Amethyst", finger: "Middle finger", day: "Saturday", metal: "Silver or panchdhatu", deity: "Shani Dev", weight: "3–5 carats" },
};
export const RUDRAKSHA: Record<string, string> = { Sun: "1 Mukhi", Moon: "2 Mukhi", Mars: "3 Mukhi", Mercury: "4 Mukhi", Jupiter: "5 Mukhi", Venus: "6 Mukhi", Saturn: "7 Mukhi", Rahu: "8 Mukhi", Ketu: "9 Mukhi" };
export const MANTRAS: Record<string, string> = {
  Sun: "Om Hraam Hreem Hraum Sah Suryaya Namah",
  Moon: "Om Shraam Shreem Shraum Sah Chandraya Namah",
  Mars: "Om Kraam Kreem Kraum Sah Bhaumaya Namah",
  Mercury: "Om Braam Breem Braum Sah Budhaya Namah",
  Jupiter: "Om Graam Greem Graum Sah Gurave Namah",
  Venus: "Om Draam Dreem Draum Sah Shukraya Namah",
  Saturn: "Om Praam Preem Praum Sah Shanaischaraya Namah",
  Rahu: "Om Bhraam Bhreem Bhraum Sah Rahave Namah",
  Ketu: "Om Sraam Sreem Sraum Sah Ketave Namah",
};
export const houseLord = (k: Kundli, house: number) => SIGN_LORDS[(k.ascendant.sign + house - 1) % 12];

/* ---------------- report text ---------------- */
export const PHYSICAL: Record<(typeof ELEMENTS)[number], string> = {
  Fire: "An energetic frame with a quick gait and bright, expressive eyes. You tend to run warm, recover fast and carry yourself with natural confidence.",
  Earth: "A sturdy, well-proportioned build with a calm face and steady movements. Stamina is your strength — you last longer than most when work gets heavy.",
  Air: "A lean, agile frame with animated hands and an expressive face. You look younger than your age and are rarely still for long.",
  Water: "Soft features, a gentle voice and deep, reflective eyes. Your body responds strongly to mood — rest and calm visibly restore you.",
};
export const HEALTH: Record<(typeof ELEMENTS)[number], string> = {
  Fire: "Watch for acidity, headaches and burnout from doing too much at once. Cooling foods, regular sleep and short breaks keep your fire balanced.",
  Earth: "Digestion and weight are the areas to watch, along with stiffness from long hours of sitting. Daily walks and lighter dinners suit you well.",
  Air: "Your nervous system is sensitive — stress shows up as poor sleep, dry skin or restlessness. Routine, warm meals and breathing practice help most.",
  Water: "Fluid balance, chest and immunity need care, especially in changing seasons. Emotional stress affects your body quickly, so protect your peace.",
};
export const CAREER: Record<(typeof ELEMENTS)[number], string> = {
  Fire: "Your 10th house sits in a fire sign: you do best where you can lead, compete and show results — management, defence, sport, entrepreneurship or public roles.",
  Earth: "Your 10th house sits in an earth sign: stable, structured fields reward you — finance, engineering, real estate, administration and anything built step by step.",
  Air: "Your 10th house sits in an air sign: ideas and people are your currency — media, technology, law, teaching, sales and consulting suit you.",
  Water: "Your 10th house sits in a water sign: work that serves or heals fulfils you — healthcare, hospitality, psychology, the arts or research.",
};
export const LOVE: Record<(typeof ELEMENTS)[number], string> = {
  Fire: "Your 7th house is a fire sign: you are drawn to bold, lively partners. Passion is strong — keep patience and give your partner room to lead sometimes.",
  Earth: "Your 7th house is an earth sign: you seek a dependable, practical partner. Love grows slowly but lasts; show affection in words, not only actions.",
  Air: "Your 7th house is an air sign: friendship and conversation are the base of your relationships. A partner who shares your interests keeps the spark alive.",
  Water: "Your 7th house is a water sign: you want deep emotional bonding and loyalty. Trust your intuition about people, and voice needs instead of hinting.",
};
export const HOUSE_THEMES = [
  "self, health and personality",
  "wealth, speech and family",
  "courage, siblings and short travel",
  "home, mother and inner peace",
  "intelligence, romance and children",
  "work, health routines and competition",
  "marriage and partnerships",
  "longevity, secrets and transformation",
  "luck, dharma and higher learning",
  "career, status and reputation",
  "gains, friends and ambitions",
  "expenses, foreign lands and spirituality",
];
export const PLANET_NATURE: Record<string, string> = {
  Sun: "brings authority, visibility and a need to be respected",
  Moon: "colours the emotions, comfort and public connection",
  Mars: "adds drive, courage and occasional impatience",
  Mercury: "sharpens intellect, communication and trade",
  Jupiter: "expands wisdom, luck and protection",
  Venus: "brings comfort, beauty, love and refinement",
  Saturn: "demands discipline and rewards slow, steady effort",
  Rahu: "creates hunger for more, unconventional paths and sudden shifts",
  Ketu: "brings detachment, intuition and past-life skill",
};
export const DASHA_TEXT: Record<string, string> = {
  Sun: "A period of recognition, leadership and dealings with government or seniors. Ego clashes are the main thing to avoid.",
  Moon: "Emotional growth, family focus and public popularity. Travel and changes of residence are common.",
  Mars: "High energy and quick action — property, sport, technical work and bold decisions. Control anger and drive carefully.",
  Rahu: "Ambition, foreign links and unconventional opportunities. Sudden ups and downs; stay grounded and avoid shortcuts.",
  Jupiter: "Growth in knowledge, wealth, marriage and children. Mentors and blessings come easily — a generally auspicious time.",
  Saturn: "Hard work, responsibility and slow but lasting results. Discipline now builds the foundation for the next decades.",
  Mercury: "Learning, business, writing and networking flourish. Good for study, trade and communication-based careers.",
  Ketu: "Inner search, spiritual interest and letting go. Sudden insights; material matters may feel less important.",
  Venus: "Comforts, relationships, vehicles, art and luxury. Often the period of marriage and enjoying life's pleasures.",
};
export { SIGNS };

export const fmtDob = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
export const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
