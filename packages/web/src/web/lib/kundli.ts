import * as Astronomy from "astronomy-engine";

export type BirthInput = {
  name: string;
  gender: "Male" | "Female" | "Other";
  dob: string; // YYYY-MM-DD
  tob: string; // HH:mm (local IST)
  place: string;
  lat: number;
  lon: number;
};

export type PlanetPos = {
  key: string;
  name: string;
  short: string;
  lon: number; // sidereal 0-360
  sign: number; // 0-11
  degInSign: number;
  house: number; // 1-12 (whole sign from lagna)
  nakshatra: string;
  pada: number;
  retro: boolean;
};

export type Kundli = {
  input: BirthInput;
  ascendant: { lon: number; sign: number; degInSign: number; nakshatra: string; pada: number };
  planets: PlanetPos[];
  ayanamsa: number;
  moonSign: number;
  sunSign: number;
  nakshatra: string;
  pada: number;
  tithi: string;
  paksha: string;
  yoga: string;
  karana: string;
  weekday: string;
  manglik: boolean;
  dashas: { lord: string; start: Date; end: Date }[];
  avakhada: { varna: string; vashya: string; yoni: string; gana: string; nadi: string; signLord: string };
};

export const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
export const SIGNS_HI = ["Mesh", "Vrishabh", "Mithun", "Kark", "Simha", "Kanya", "Tula", "Vrishchik", "Dhanu", "Makar", "Kumbh", "Meen"];
export const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
];
export const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti",
];
export const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"];
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const GANA = ["Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"];
const YONI = ["Horse", "Elephant", "Goat", "Serpent", "Serpent", "Dog", "Cat", "Goat", "Cat", "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer", "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"];
const NADI = ["Adi", "Madhya", "Antya"];
const VARNA_BY_SIGN = ["Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Brahmin"];
const VASHYA_BY_SIGN = ["Chatushpada", "Chatushpada", "Manava", "Jalachara", "Vanachara", "Manava", "Manava", "Keeta", "Manava", "Jalachara", "Manava", "Jalachara"];

export const norm = (d: number) => ((d % 360) + 360) % 360;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Lahiri ayanamsa (approx., good to ~1 arc-minute for 1900–2100) */
export function lahiri(jdUT: number) {
  const t = (jdUT - 2451545.0) / 36525;
  return 23.85305 + 1.39697 * t + 0.000308 * t * t;
}

function nakOf(lon: number) {
  const span = 360 / 27;
  const idx = Math.floor(lon / span);
  const pada = Math.floor((lon - idx * span) / (span / 4)) + 1;
  return { idx, name: NAKSHATRAS[idx], pada };
}

export function tropicalLon(body: Astronomy.Body, t: Astronomy.AstroTime) {
  if (body === Astronomy.Body.Moon) return Astronomy.EclipticGeoMoon(t).lon;
  const v = Astronomy.GeoVector(body, t, true);
  return Astronomy.Ecliptic(v).elon;
}

/** Mean lunar node (Rahu) longitude, tropical */
function meanRahu(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  return norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T);
}

export function birthDateUTC(dob: string, tob: string) {
  const [y, m, d] = dob.split("-").map(Number);
  const [hh, mm] = (tob || "12:00").split(":").map(Number);
  // IST = UTC+5:30
  return new Date(Date.UTC(y, m - 1, d, hh - 5, mm - 30));
}

export function computeKundli(input: BirthInput): Kundli {
  const date = birthDateUTC(input.dob, input.tob);
  const t = Astronomy.MakeTime(date);
  const jd = t.ut + 2451545.0;
  const ay = lahiri(jd);
  const eps = Astronomy.e_tilt(t).tobl;

  // Ascendant
  const gst = Astronomy.SiderealTime(t); // hours
  const ramc = rad(norm(gst * 15 + input.lon));
  const e = rad(eps);
  const phi = rad(input.lat);
  const ascTrop = norm(deg(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(e) + Math.tan(phi) * Math.sin(e)))));
  const ascLon = norm(ascTrop - ay);
  const ascSign = Math.floor(ascLon / 30);

  const bodies: { key: string; name: string; short: string; body?: Astronomy.Body }[] = [
    { key: "sun", name: "Sun", short: "Su", body: Astronomy.Body.Sun },
    { key: "moon", name: "Moon", short: "Mo", body: Astronomy.Body.Moon },
    { key: "mars", name: "Mars", short: "Ma", body: Astronomy.Body.Mars },
    { key: "mercury", name: "Mercury", short: "Me", body: Astronomy.Body.Mercury },
    { key: "jupiter", name: "Jupiter", short: "Ju", body: Astronomy.Body.Jupiter },
    { key: "venus", name: "Venus", short: "Ve", body: Astronomy.Body.Venus },
    { key: "saturn", name: "Saturn", short: "Sa", body: Astronomy.Body.Saturn },
    { key: "rahu", name: "Rahu", short: "Ra" },
    { key: "ketu", name: "Ketu", short: "Ke" },
  ];

  const tPrev = t.AddDays(-0.5);
  const tNext = t.AddDays(0.5);

  const planets: PlanetPos[] = bodies.map((b) => {
    let trop: number;
    let retro = false;
    if (b.key === "rahu") {
      trop = meanRahu(jd);
      retro = true;
    } else if (b.key === "ketu") {
      trop = norm(meanRahu(jd) + 180);
      retro = true;
    } else {
      trop = tropicalLon(b.body!, t);
      if (b.key !== "sun" && b.key !== "moon") {
        const d = norm(tropicalLon(b.body!, tNext) - tropicalLon(b.body!, tPrev) + 180) - 180;
        retro = d < 0;
      }
    }
    const lon = norm(trop - ay);
    const sign = Math.floor(lon / 30);
    const nk = nakOf(lon);
    return {
      key: b.key,
      name: b.name,
      short: b.short,
      lon,
      sign,
      degInSign: lon - sign * 30,
      house: ((sign - ascSign + 12) % 12) + 1,
      nakshatra: nk.name,
      pada: nk.pada,
      retro,
    };
  });

  const sun = planets[0];
  const moon = planets[1];
  const mars = planets[2];
  const moonNak = nakOf(moon.lon);

  // Panchang
  const elong = norm(moon.lon - sun.lon);
  const tithiNum = Math.floor(elong / 12); // 0-29
  const paksha = tithiNum < 15 ? "Shukla" : "Krishna";
  const tIdx = tithiNum % 15;
  const tithi = tIdx === 14 ? (paksha === "Shukla" ? "Purnima" : "Amavasya") : TITHIS[tIdx];
  const yoga = YOGAS[Math.floor(norm(sun.lon + moon.lon) / (360 / 27))];
  const kIdx = Math.floor(elong / 6);
  const karana = kIdx === 0 ? "Kimstughna" : kIdx >= 57 ? ["Shakuni", "Chatushpada", "Naga"][kIdx - 57] : KARANAS[(kIdx - 1) % 7];
  const localDate = new Date(date.getTime() + 5.5 * 3600 * 1000);
  const weekday = WEEKDAYS[localDate.getUTCDay()];

  // Manglik: Mars in 1,2,4,7,8,12 from Lagna
  const manglik = [1, 2, 4, 7, 8, 12].includes(mars.house);

  // Vimshottari Mahadasha
  const span = 360 / 27;
  const lordIdx = moonNak.idx % 9;
  const fracLeft = 1 - (moon.lon - moonNak.idx * span) / span;
  const dashas: { lord: string; start: Date; end: Date }[] = [];
  const YEAR_MS = 365.2425 * 86400 * 1000;
  let cursor = date.getTime();
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(lordIdx + i) % 9];
    const yrs = i === 0 ? DASHA_YEARS[lord] * fracLeft : DASHA_YEARS[lord];
    const start = new Date(cursor);
    cursor += yrs * YEAR_MS;
    dashas.push({ lord, start, end: new Date(cursor) });
  }

  const ascNak = nakOf(ascLon);

  return {
    input,
    ascendant: { lon: ascLon, sign: ascSign, degInSign: ascLon - ascSign * 30, nakshatra: ascNak.name, pada: ascNak.pada },
    planets,
    ayanamsa: ay,
    moonSign: moon.sign,
    sunSign: sun.sign,
    nakshatra: moonNak.name,
    pada: moonNak.pada,
    tithi,
    paksha,
    yoga,
    karana,
    weekday,
    manglik,
    dashas,
    avakhada: {
      varna: VARNA_BY_SIGN[moon.sign],
      vashya: VASHYA_BY_SIGN[moon.sign],
      yoni: YONI[moonNak.idx],
      gana: GANA[moonNak.idx],
      nadi: NADI[[0, 1, 2, 2, 1, 0][moonNak.idx % 6] ?? 0],
      signLord: SIGN_LORDS[moon.sign],
    },
  };
}

export const fmtDeg = (d: number) => {
  const D = Math.floor(d);
  const M = Math.floor((d - D) * 60);
  const S = Math.floor(((d - D) * 60 - M) * 60);
  return `${D}° ${String(M).padStart(2, "0")}′ ${String(S).padStart(2, "0")}″`;
};

/** D9 Navamsa sign for a sidereal longitude */
export const navamsaSign = (lon: number) => Math.floor(lon / (30 / 9)) % 12;

export const ASC_TRAITS = [
  "Bold, pioneering and quick to act. You lead from the front and thrive on challenge.",
  "Steady, patient and grounded. You value comfort, loyalty and things built to last.",
  "Curious, witty and adaptable. Communication and learning keep you energised.",
  "Caring, intuitive and protective. Home and family sit at the heart of your choices.",
  "Warm, confident and generous. You naturally draw attention and inspire others.",
  "Analytical, precise and service-minded. You notice details others miss.",
  "Charming, fair and diplomatic. Partnerships and harmony shape your path.",
  "Intense, private and determined. You transform through depth and resilience.",
  "Optimistic, philosophical and free-spirited. You seek meaning and adventure.",
  "Disciplined, ambitious and practical. You climb steadily towards long-term goals.",
  "Original, humanitarian and independent. You think ahead of your time.",
  "Compassionate, imaginative and spiritual. You feel deeply and heal others.",
];

export const MOON_TRAITS = [
  "Emotionally direct and quick to recover; you need action to feel settled.",
  "Emotionally stable; security, good food and beauty soothe your mind.",
  "Restless mind that needs conversation and variety to feel at ease.",
  "Deeply sensitive and nurturing; your moods follow those you love.",
  "Proud heart that needs appreciation and creative self-expression.",
  "Practical emotions; you calm down by organising and helping.",
  "You seek balance and companionship; discord unsettles you quickly.",
  "Powerful, private feelings; trust is earned slowly but held forever.",
  "Cheerful and hopeful; freedom and faith lift your spirits.",
  "Reserved and responsible; you show love through commitment.",
  "Detached yet kind; friendships and ideals feed your soul.",
  "Dreamy and empathetic; solitude and spirituality restore you.",
];
