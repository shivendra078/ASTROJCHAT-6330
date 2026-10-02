import * as Astronomy from "astronomy-engine";
import { computeKundli, KARANAS, lahiri, NAKSHATRAS, norm, SIGNS, TITHIS, tropicalLon, WEEKDAYS, YOGAS, type Kundli } from "./kundli";

/** All civil times are IST (UTC+5:30). */
const IST = 5.5 * 3600 * 1000;
const HOUR = 3600 * 1000;
const NAK_SPAN = 360 / 27;

export const MONTHS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna",
];
const RITUS = ["Vasant", "Grishma", "Varsha", "Sharad", "Hemant", "Shishir"];
const SAMVATSARAS = [
  "Prabhava", "Vibhava", "Shukla", "Pramoda", "Prajapati", "Angirasa", "Shrimukha", "Bhava", "Yuva", "Dhatu",
  "Ishvara", "Bahudhanya", "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Svabhanu", "Tarana", "Parthiva", "Vyaya",
  "Sarvajit", "Sarvadhari", "Virodhi", "Vikriti", "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
  "Hevilambi", "Vilambi", "Vikari", "Sharvari", "Plava", "Shubhakrit", "Shobhakrit", "Krodhi", "Vishvavasu", "Parabhava",
  "Plavanga", "Kilaka", "Saumya", "Sadharana", "Virodhikrit", "Paridhavi", "Pramadi", "Ananda", "Rakshasa", "Nala",
  "Pingala", "Kalayukti", "Siddharthi", "Raudra", "Durmati", "Dundubhi", "Rudhirodgari", "Raktakshi", "Krodhana", "Akshaya",
];
const DISHASHOOL = ["West", "East", "North", "North", "South", "West", "East"];

// 1-indexed eighth-of-day segment, Sunday..Saturday
const RAHU_SEG = [8, 2, 7, 5, 6, 4, 3];
const YAMA_SEG = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEG = [7, 6, 5, 4, 3, 2, 1];
// 1-indexed day muhurtas (of 15) for Dur Muhurat
const DUR_MUHURAT = [[14], [9, 12], [4], [8], [6, 12], [4, 9], [1, 2]];

const CHOG = ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"] as const;
const CHOG_DAY_START = [0, 3, 6, 2, 5, 1, 4];
export type ChoghadiyaName = (typeof CHOG)[number];
export const CHOG_NATURE: Record<ChoghadiyaName, "good" | "neutral" | "bad"> = {
  Amrit: "good", Shubh: "good", Labh: "good", Char: "neutral", Udveg: "bad", Kaal: "bad", Rog: "bad",
};

export type Span = { name: string; start: Date; end: Date };
export type Segment = { name: string; end: Date | null }; // end null → continues past next sunrise
export type Panchang = {
  date: string;
  weekday: string;
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  moonrise: Date | null;
  moonset: Date | null;
  tithi: Segment[];
  paksha: string;
  nakshatra: Segment[];
  yoga: Segment[];
  karana: Segment[];
  moonSign: Segment[];
  sunSign: string;
  amanta: string;
  purnimanta: string;
  adhik: boolean;
  shaka: number;
  vikram: number;
  samvatsara: string;
  ritu: string;
  ayana: string;
  dishashool: string;
  inauspicious: Span[];
  auspicious: Span[];
  choghadiya: { day: Span[]; night: Span[] };
  tarabalam: string[];
  chandrabalam: string[];
  sky: Kundli; // planetary positions + lagna at sunrise
};

const sid = (body: Astronomy.Body, d: Date) => {
  const t = Astronomy.MakeTime(d);
  return norm(tropicalLon(body, t) - lahiri(t.ut + 2451545.0));
};
const sunL = (d: Date) => sid(Astronomy.Body.Sun, d);
const moonL = (d: Date) => sid(Astronomy.Body.Moon, d);

const tithiIdx = (d: Date) => Math.floor(norm(moonL(d) - sunL(d)) / 12);
const nakIdx = (d: Date) => Math.floor(moonL(d) / NAK_SPAN) % 27;
const yogaIdx = (d: Date) => Math.floor(norm(moonL(d) + sunL(d)) / NAK_SPAN) % 27;
const karanaIdx = (d: Date) => Math.floor(norm(moonL(d) - sunL(d)) / 6) % 60;
const moonSignIdx = (d: Date) => Math.floor(moonL(d) / 30) % 12;

export const tithiName = (i: number) => {
  const p = i < 15 ? "Shukla" : "Krishna";
  const n = i % 15 === 14 ? (i < 15 ? "Purnima" : "Amavasya") : TITHIS[i % 15];
  return { paksha: p, name: n };
};
const karanaName = (k: number) => (k === 0 ? "Kimstughna" : k >= 57 ? ["Shakuni", "Chatushpada", "Naga"][k - 57] : KARANAS[(k - 1) % 7]);

/** Walk from `from` to `until`, recording each value change of `f` (found by bisection to ~15s). */
function segments(f: (d: Date) => number, label: (i: number) => string, from: Date, until: Date, step = HOUR): Segment[] {
  const out: Segment[] = [];
  let cur = f(from);
  let t = from.getTime();
  const end = until.getTime();
  while (t < end) {
    const nt = Math.min(t + step, end);
    const v = f(new Date(nt));
    if (v !== cur) {
      let lo = t;
      let hi = nt;
      while (hi - lo > 15000) {
        const mid = (lo + hi) / 2;
        if (f(new Date(mid)) === cur) lo = mid;
        else hi = mid;
      }
      out.push({ name: label(cur), end: new Date(hi) });
      cur = f(new Date(hi + 1000));
      t = hi + 1000;
    } else t = nt;
  }
  out.push({ name: label(cur), end: null });
  return out;
}

export const istMidnight = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - IST);
};

export const todayIST = () => {
  const n = new Date(Date.now() + IST);
  return n.toISOString().slice(0, 10);
};

export const shiftDate = (date: string, days: number) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

const istHHmm = (d: Date) => new Date(d.getTime() + IST).toISOString().slice(11, 16);

function riseSet(body: Astronomy.Body, obs: Astronomy.Observer, dir: 1 | -1, from: Date, days = 1) {
  const r = Astronomy.SearchRiseSet(body, obs, dir, Astronomy.MakeTime(from), days);
  return r ? r.date : null;
}

const span = (name: string, start: number, end: number): Span => ({ name, start: new Date(start), end: new Date(end) });

export function computePanchang(date: string, lat: number, lon: number, place = ""): Panchang {
  const obs = new Astronomy.Observer(lat, lon, 0);
  const midnight = istMidnight(date);
  const sunrise = riseSet(Astronomy.Body.Sun, obs, 1, midnight)!;
  const sunset = riseSet(Astronomy.Body.Sun, obs, -1, sunrise)!;
  const nextSunrise = riseSet(Astronomy.Body.Sun, obs, 1, new Date(sunset.getTime() + HOUR))!;
  const prevSunset = riseSet(Astronomy.Body.Sun, obs, -1, new Date(midnight.getTime() - 24 * HOUR))!;
  const moonrise = riseSet(Astronomy.Body.Moon, obs, 1, midnight);
  const moonset = riseSet(Astronomy.Body.Moon, obs, -1, midnight);
  const nextMid = midnight.getTime() + 24 * HOUR;

  const wd = new Date(midnight.getTime() + IST + 12 * HOUR).getUTCDay();

  const tithi = segments(tithiIdx, (i) => tithiName(i).name, sunrise, nextSunrise);
  const paksha = tithiName(tithiIdx(sunrise)).paksha;
  const nakshatra = segments(nakIdx, (i) => NAKSHATRAS[i], sunrise, nextSunrise);
  const yoga = segments(yogaIdx, (i) => YOGAS[i], sunrise, nextSunrise);
  const karana = segments(karanaIdx, karanaName, sunrise, nextSunrise, HOUR);
  const moonSign = segments(moonSignIdx, (i) => SIGNS[i], sunrise, nextSunrise);
  const sunSignIdx = Math.floor(sunL(sunrise) / 30);

  // Lunar month (amanta: new moon → new moon, named by the sun's sign at the opening new moon)
  const tRise = Astronomy.MakeTime(sunrise);
  const prevNM = Astronomy.SearchMoonPhase(0, tRise, -35)!.date;
  const nextNM = Astronomy.SearchMoonPhase(0, tRise, 35)!.date;
  const s1 = Math.floor(sunL(prevNM) / 30);
  const s2 = Math.floor(sunL(nextNM) / 30);
  const adhik = s1 === s2;
  const amIdx = (s1 + 1) % 12;
  const krishna = tithiIdx(sunrise) >= 15;
  const puIdx = krishna && !adhik ? (amIdx + 1) % 12 : amIdx;

  const [Y, M] = date.split("-").map(Number);
  const shaka = M <= 4 && amIdx >= 8 ? Y - 79 : Y - 78;

  // Day / night divisions
  const r = sunrise.getTime();
  const s = sunset.getTime();
  const nr = nextSunrise.getTime();
  const day = s - r;
  const night = nr - s;
  const eighth = day / 8;
  const dayMuhurta = day / 15;
  const prevNightMuhurta = (r - prevSunset.getTime()) / 15;
  const seg = (n: number) => [r + (n - 1) * eighth, r + n * eighth] as const;

  const inauspicious: Span[] = [
    span("Rahu Kaal", ...seg(RAHU_SEG[wd])),
    span("Yamaganda", ...seg(YAMA_SEG[wd])),
    span("Gulika Kaal", ...seg(GULIKA_SEG[wd])),
    ...DUR_MUHURAT[wd].map((n) => span("Dur Muhurat", r + (n - 1) * dayMuhurta, r + n * dayMuhurta)),
  ];
  if (wd === 2) inauspicious.push(span("Dur Muhurat", s + 6 * (night / 15), s + 7 * (night / 15)));
  inauspicious.sort((a, b) => a.start.getTime() - b.start.getTime());

  const auspicious: Span[] = [
    span("Brahma Muhurat", r - 2 * prevNightMuhurta, r - prevNightMuhurta),
    ...(wd === 3 ? [] : [span("Abhijit Muhurat", r + 7 * dayMuhurta, r + 8 * dayMuhurta)]),
    span("Vijaya Muhurat", r + 10 * dayMuhurta, r + 11 * dayMuhurta),
    span("Godhuli Muhurat", s - 12 * 60000, s + 12 * 60000),
    span("Nishita Muhurat", s + 7 * (night / 15), s + 8 * (night / 15)),
  ];

  const chogDay = Array.from({ length: 8 }, (_, i) => span(CHOG[(CHOG_DAY_START[wd] + i) % 7], r + i * eighth, r + (i + 1) * eighth));
  const nStart = CHOG_DAY_START[(wd + 4) % 7];
  const chogNight = Array.from({ length: 8 }, (_, i) =>
    span(CHOG[(((nStart - 2 * i) % 7) + 7) % 7], s + (i * night) / 8, s + ((i + 1) * night) / 8),
  );

  // Tarabalam: birth nakshatras for which today's nakshatra is a favourable tara (2,4,6,8,9)
  const dn = nakIdx(sunrise);
  const tarabalam = NAKSHATRAS.filter((_, b) => [2, 4, 6, 8, 0].includes((((dn - b + 27) % 27) + 1) % 9));
  // Chandrabalam: birth rashis for which the transiting moon is in house 1,3,6,7,10,11
  const ms = moonSignIdx(sunrise);
  const chandrabalam = SIGNS.filter((_, b) => [1, 3, 6, 7, 10, 11].includes(((ms - b + 12) % 12) + 1));

  const sky = computeKundli({ name: "Sky", gender: "Other", dob: date, tob: istHHmm(sunrise), place, lat, lon });

  return {
    date,
    weekday: WEEKDAYS[wd],
    sunrise,
    sunset,
    nextSunrise,
    moonrise: moonrise && moonrise.getTime() < nextMid ? moonrise : null,
    moonset: moonset && moonset.getTime() < nextMid ? moonset : null,
    tithi,
    paksha,
    nakshatra,
    yoga,
    karana,
    moonSign,
    sunSign: SIGNS[sunSignIdx],
    amanta: MONTHS[amIdx],
    purnimanta: MONTHS[puIdx],
    adhik,
    shaka,
    vikram: shaka + 135,
    samvatsara: SAMVATSARAS[(shaka + 11) % 60],
    ritu: RITUS[Math.floor(((sunSignIdx + 1) % 12) / 2)],
    ayana: sunSignIdx >= 9 || sunSignIdx <= 2 ? "Uttarayana" : "Dakshinayana",
    dishashool: DISHASHOOL[wd],
    inauspicious,
    auspicious,
    choghadiya: { day: chogDay, night: chogNight },
    tarabalam,
    chandrabalam,
    sky,
  };
}

/** "06:14 AM" in IST; appends ", 3 Oct" when the moment falls on a different IST date than `base`. */
export function fmtIST(d: Date, base?: string, seconds = false) {
  const l = new Date(d.getTime() + IST);
  const h = l.getUTCHours();
  const m = l.getUTCMinutes();
  const sec = l.getUTCSeconds();
  let s = `${String(((h + 11) % 12) + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}${seconds ? `:${String(sec).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
  if (base && l.toISOString().slice(0, 10) !== base) {
    s += `, ${l.getUTCDate()} ${l.toLocaleString("en-IN", { month: "short", timeZone: "UTC" })}`;
  }
  return s;
}

export const fmtDuration = (ms: number) => {
  const m = Math.round(ms / 60000);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};
