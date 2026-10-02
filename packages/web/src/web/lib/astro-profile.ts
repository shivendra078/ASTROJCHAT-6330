/**
 * Extended (placeholder) profile data for astrologers. Generated deterministically
 * from the astrologer id so every visit shows the same reviews and stats.
 * User-written reviews are stored in localStorage.
 */
import { useSyncExternalStore } from "react";
import { astrologers, type Astrologer } from "../components/landing/data";

export type Review = {
  id: string;
  name: string;
  city?: string;
  rating: number;
  text: string;
  date: string; // YYYY-MM-DD
  helpful: number;
  topic?: string;
  reply?: string;
  mine?: boolean;
};

export type Profile = {
  about: string[];
  expertise: string[];
  focus: { topic: string; pct: number }[];
  education: { title: string; sub: string }[];
  schedule: { day: string; slots: string }[];
  reviewCount: number;
  dist: [number, number, number, number, number]; // % for 5★..1★
  reviews: Review[];
  avgConnect: number; // seconds
  repeatPct: number;
  followers: number;
};

/* --- tiny seeded RNG --- */
function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)];

const SKILL_BLURB: Record<string, string> = {
  Vedic: "classical Parashari Jyotish — reading the lagna, planetary strengths and Vimshottari dasha to time events",
  Tarot: "intuitive Tarot spreads that bring hidden emotions, patterns and possible directions to the surface",
  Numerology: "Chaldean and Pythagorean numerology for names, dates and life-path insights",
  "KP System": "the Krishnamurti Paddhati sub-lord method for precise yes/no answers and event timing",
  Vastu: "practical Vastu Shastra corrections for homes, shops and offices without demolition",
  Prashna: "Prashna (horary) charts cast for the exact moment a question is asked",
  "Lal Kitab": "simple, low-cost Lal Kitab remedies rooted in everyday actions",
  Palmistry: "hand and palm-line reading for temperament, health tendencies and life phases",
  "Face Reading": "Samudrika Shastra face reading to understand nature and timing",
  Nadi: "Nadi astrology techniques that read planetary links for life-event patterns",
  Psychic: "energy and angel-card guidance focused on emotional clarity",
};

const EDU: Record<string, { title: string; sub: string }> = {
  Vedic: { title: "Jyotish Visharad", sub: "Bharatiya Vidya Bhavan" },
  Tarot: { title: "Certified Tarot Practitioner", sub: "Tarot Guild of India" },
  Numerology: { title: "Advanced Numerology Diploma", sub: "Institute of Vedic Numerology" },
  "KP System": { title: "KP Jyotish Acharya", sub: "KP Astrology Research Centre" },
  Vastu: { title: "Vastu Shastra Consultant", sub: "Vastu Vidya Kendra" },
  Prashna: { title: "Prashna Shastra Course", sub: "Sampurnanand Sanskrit University" },
  "Lal Kitab": { title: "Lal Kitab Expert Course", sub: "All India Federation of Astrologers" },
  Palmistry: { title: "Hast Rekha Vigyan", sub: "Indian Council of Astrological Sciences" },
  "Face Reading": { title: "Samudrika Shastra", sub: "Indian Council of Astrological Sciences" },
  Nadi: { title: "Nadi Jyotish Training", sub: "Vaitheeswaran Koil lineage" },
  Psychic: { title: "Reiki Level II & Angel Cards", sub: "Independent certification" },
};

const NAMES = ["Saswati", "Abhilash", "Bhuvana", "Krishnan", "Avanthika", "Mohit", "Jabbar", "Sathish", "Sunny", "Divya", "Neha", "Rahul", "Pooja", "Arvind", "Kiran", "Meenakshi", "Harpreet", "Farhan", "Ishita", "Gaurav", "Tanvi", "Suresh", "Ritika", "Deepak"];
const CITIES = ["Delhi", "Mumbai", "Chennai", "Bengaluru", "Kolkata", "Pune", "Hyderabad", "Jaipur", "Lucknow", "Ahmedabad", "Indore", "Kochi", "Patna", "Surat"];
const TEXT5 = [
  "Amazing prediction. Everything about my job change matched the timeline.",
  "Very calm and patient. Explained my dasha in simple words and didn't rush me.",
  "Really nice experience. The remedies were simple and practical, no fear-mongering.",
  "Spot on about my relationship situation. Felt heard and much lighter after the chat.",
  "Third consultation and still accurate. Highly recommend for career questions.",
  "Gave clear yes/no answers instead of vague talk. Thank you so much!",
  "Very very good. Will definitely consult again before the property registration.",
  "Accurate reading of my nature without me telling much. Impressed.",
  "Thanks a lot. Guidance on marriage timing gave our family real clarity.",
  "Explained Saturn's transit without scaring me. Practical steps, not just predictions.",
  "Connected within seconds and the reading felt personal, not copy-paste.",
  "My mother and I both consulted. Same kind patience with both of us.",
  "Suggested a simple daily mantra instead of expensive gemstones. Respect.",
  "Precise about the month my visa would come through — it did.",
];
const TEXT4 = [
  "Good reading, a little slow to reply but the insights were helpful.",
  "Helpful guidance on business. Would have liked a bit more detail on remedies.",
  "Nice and polite. Most points matched, a couple I'll wait and see.",
  "Good insights on my exam results. Chat felt a bit short for the price.",
  "Solid reading. Network lag on my side, but they were patient about it.",
];
const TEXT3 = ["Okay experience. Call dropped once but they called back.", "Average — some points were generic, but overall polite."];
const REPLIES = ["Thank you for your kind words. Stay blessed!", "Glad I could help. Do follow the remedy for 21 days.", "Thank you! Wishing you success ahead."];

const cache = new Map<string, Profile>();

export function getProfile(a: Astrologer): Profile {
  const hit = cache.get(a.id);
  if (hit) return hit;
  const r = seed(a.id);
  const first = a.name.replace(/^(Acharya|Pt\.|Swami|Dr\.)\s+/, "").split(" ")[0];

  const about = [
    `${a.name} is a ${a.exp > 20 ? "senior" : a.exp > 10 ? "highly experienced" : "warm and intuitive"} ${a.skills[0]} practitioner with ${a.exp} years of experience. ${a.bio}`,
    `${first}'s approach combines ${SKILL_BLURB[a.skills[0]] ?? a.skills[0]}${a.skills[1] ? ` with ${SKILL_BLURB[a.skills[1]] ?? a.skills[1]}` : ""}. Clients most often come with questions about ${a.topics.slice(0, 3).join(", ").toLowerCase()}.`,
    `Every consultation is private and unhurried. ${first} explains the reasoning behind each prediction and suggests only simple, affordable remedies — never anything fear-based. Consultations are available in ${a.langs.join(", ")}.`,
  ];

  const expertise = Array.from(new Set([...a.skills, ...a.topics.map((t) => `${t} guidance`), "Remedies", "Predictions"]));

  let left = 100;
  const focus = a.topics.slice(0, 4).map((topic, i, arr) => {
    const pct = i === arr.length - 1 ? left : Math.max(8, Math.round(left * (0.42 + r() * 0.2)));
    left -= pct;
    return { topic, pct };
  });

  const education = a.skills.slice(0, 3).map((s) => EDU[s] ?? { title: s, sub: "Certified" });

  const start = pick(r, ["7 AM", "8 AM", "9 AM", "10 AM"]);
  const end = pick(r, ["6 PM", "8 PM", "10 PM", "11 PM"]);
  const off = Math.floor(r() * 7);
  const schedule = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    slots: i === off && a.exp > 5 ? "Unavailable" : i >= 5 ? `${start} – 2 PM, 5 PM – ${end}` : `${start} – ${end}`,
  }));

  const five = Math.round(a.rating >= 4.9 ? 88 + r() * 6 : a.rating >= 4.8 ? 80 + r() * 6 : 70 + r() * 8);
  const four = Math.round((100 - five) * 0.6);
  const three = Math.round((100 - five - four) * 0.55);
  const two = Math.round((100 - five - four - three) * 0.5);
  const dist: Profile["dist"] = [five, four, three, two, 100 - five - four - three - two];

  const today = new Date("2026-10-02T12:00:00");
  // shuffle each text pool once so reviews on one profile don't repeat back-to-back
  const shuffle = <T>(arr: readonly T[]) => [...arr].map((v) => [r(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
  const pools = { 5: shuffle(TEXT5), 4: shuffle(TEXT4), 3: shuffle(TEXT3) };
  const used = { 5: 0, 4: 0, 3: 0 };
  const names = shuffle(NAMES);
  const reviews: Review[] = Array.from({ length: 14 }).map((_, i) => {
    const roll = r();
    const rating = roll < 0.78 ? 5 : roll < 0.94 ? 4 : 3;
    const d = new Date(today);
    d.setDate(d.getDate() - Math.floor(i * 4 + r() * 6));
    return {
      id: `${a.id}-${i}`,
      name: names[i % names.length],
      city: pick(r, CITIES),
      rating,
      text: (() => {
        const k = rating as 5 | 4 | 3;
        return pools[k][used[k]++ % pools[k].length];
      })(),
      date: d.toISOString().slice(0, 10),
      helpful: Math.floor(r() * (rating === 5 ? 140 : 30)),
      topic: pick(r, a.topics),
      reply: r() < 0.35 ? pick(r, REPLIES) : undefined,
    };
  });

  const p: Profile = {
    about,
    expertise,
    focus,
    education,
    schedule,
    reviewCount: Math.round(a.orders * (0.18 + r() * 0.1)),
    dist,
    reviews,
    avgConnect: 8 + Math.floor(r() * 18),
    repeatPct: 55 + Math.floor(r() * 30),
    followers: Math.round(a.orders * (0.3 + r() * 0.4)),
  };
  cache.set(a.id, p);
  return p;
}

export const getAstrologer = (id: string) => astrologers.find((a) => a.id === id) ?? null;

export function similarTo(a: Astrologer, n = 4) {
  return astrologers
    .filter((x) => x.id !== a.id)
    .map((x) => ({ x, s: x.skills.filter((k) => a.skills.includes(k)).length * 2 + x.topics.filter((t) => a.topics.includes(t)).length + (x.status === "online" ? 1 : 0) }))
    .sort((p, q) => q.s - p.s || q.x.rating - p.x.rating)
    .slice(0, n)
    .map((p) => p.x);
}

/* --- user reviews + follows (localStorage) --- */

const RKEY = "astroj.reviews";
const FKEY = "astroj.follows";
let mine: Record<string, Review[]> = {};
let follows: string[] = [];
if (typeof window !== "undefined") {
  try {
    mine = JSON.parse(localStorage.getItem(RKEY) || "{}");
    follows = JSON.parse(localStorage.getItem(FKEY) || "[]");
  } catch {
    /* ignore */
  }
}
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const sub = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

export function useMyReviews(id: string) {
  return useSyncExternalStore(
    sub,
    () => mine[id] ?? EMPTY,
    () => EMPTY,
  );
}
const EMPTY: Review[] = [];

export function addReview(id: string, rv: Omit<Review, "id" | "date" | "helpful" | "mine">) {
  const r: Review = { ...rv, id: `mine-${Date.now()}`, date: new Date().toISOString().slice(0, 10), helpful: 0, mine: true };
  mine = { ...mine, [id]: [r, ...(mine[id] ?? [])] };
  localStorage.setItem(RKEY, JSON.stringify(mine));
  emit();
}

export function deleteReview(id: string, rid: string) {
  mine = { ...mine, [id]: (mine[id] ?? []).filter((r) => r.id !== rid) };
  localStorage.setItem(RKEY, JSON.stringify(mine));
  emit();
}

export function useFollowing(id: string) {
  return useSyncExternalStore(
    sub,
    () => follows.includes(id),
    () => false,
  );
}
export function toggleFollow(id: string) {
  follows = follows.includes(id) ? follows.filter((x) => x !== id) : [...follows, id];
  localStorage.setItem(FKEY, JSON.stringify(follows));
  emit();
}

export const fmtReviewDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const fmtCount = (n: number) => (n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);
