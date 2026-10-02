import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Sunrise,
  Sunset,
  MoonStar,
  Moon,
  Search,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Compass,
  Loader2,
} from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { CityPicker } from "../components/panchang/city-picker";
import { NorthChart } from "../components/kundli/charts";
import { CITIES, cityLabel, type City } from "../lib/cities";
import { CHOG_NATURE, computePanchang, fmtDuration, fmtIST, shiftDate, todayIST, type ChoghadiyaName, type Segment, type Span } from "../lib/panchang";
import { fmtDeg, SIGNS } from "../lib/kundli";

const DEFAULT_CITY = CITIES[0];

const longDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function readQuery(): { date: string; city: City } {
  const p = new URLSearchParams(window.location.search);
  const d = p.get("date");
  const c = p.get("city");
  return {
    date: d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : todayIST(),
    city: CITIES.find((x) => x.name.toLowerCase() === c?.toLowerCase()) ?? DEFAULT_CITY,
  };
}

function writeQuery(date: string, city: City) {
  const qs = new URLSearchParams({ date, city: city.name });
  window.history.replaceState(null, "", `${window.location.pathname}?${qs}`);
}

/* ---------- small building blocks ---------- */

function Card({ title, sub, children, className = "", tone = "white" }: { title: string; sub?: string; children: React.ReactNode; className?: string; tone?: "white" | "red" | "green" }) {
  const bg = tone === "red" ? "bg-[#FFF4F1] ring-[#F2C9BE]" : tone === "green" ? "bg-[#F3F8EE] ring-[#CFE0BE]" : "bg-white ring-ink/[.06]";
  return (
    <section className={`rounded-[24px] p-6 ring-1 md:p-7 ${bg} ${className}`}>
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
          <span className="h-2 w-2 rotate-45 bg-saffron" />
          {title}
        </h2>
        {sub && <p className="mt-1 pl-4 text-[12.5px] text-mutedtext">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function SegValue({ segs, date }: { segs: Segment[]; date: string }) {
  return (
    <span className="flex flex-col items-end gap-0.5">
      {segs.map((s, i) => (
        <span key={`${s.name}-${i}`} className={i === 0 ? "font-semibold text-ink" : "text-[13px] text-mutedtext"}>
          {i > 0 && <span className="mr-1 text-ink/30">then</span>}
          {s.name}
          {s.end && <span className={`ml-1 font-normal ${i === 0 ? "text-mutedtext" : ""}`}>upto {fmtIST(s.end, date)}</span>}
        </span>
      ))}
    </span>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink/[.06] py-3 text-[14px] last:border-0">
      <span className="shrink-0 text-mutedtext">{k}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}

function TimeSpanList({ spans, date, now }: { spans: Span[]; date: string; now: number }) {
  return (
    <ul className="space-y-2">
      {spans.map((s, i) => {
        const live = now >= s.start.getTime() && now < s.end.getTime();
        return (
          <li key={`${s.name}-${i}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-ink/[.05]">
            <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              {s.name}
              {live && <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Now</span>}
            </span>
            <span className="text-right text-[13.5px] tabular-nums text-ink/80">
              {fmtIST(s.start, date)} – {fmtIST(s.end, date)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const CHOG_STYLE = {
  good: "bg-[#E7F3DD] text-[#3D6B1F]",
  neutral: "bg-[#FFF1DC] text-[#9A5B00]",
  bad: "bg-[#FBE3DD] text-[#A23B22]",
};

function ChogList({ spans, date, now, label }: { spans: Span[]; date: string; now: number; label: string }) {
  return (
    <div>
      <div className="mb-3 text-[12px] font-semibold uppercase tracking-[.16em] text-mutedtext">{label}</div>
      <ul className="divide-y divide-ink/[.06] rounded-2xl ring-1 ring-ink/[.06]">
        {spans.map((s, i) => {
          const nature = CHOG_NATURE[s.name as ChoghadiyaName];
          const live = now >= s.start.getTime() && now < s.end.getTime();
          return (
            <li key={i} className={`flex items-center justify-between gap-3 px-4 py-2.5 ${live ? "bg-sand" : ""}`}>
              <span className="flex items-center gap-2">
                <span className={`w-[68px] rounded-full px-2.5 py-1 text-center text-[12px] font-semibold ${CHOG_STYLE[nature]}`}>{s.name}</span>
                {live && <span className="text-[10.5px] font-semibold uppercase tracking-wide text-saffron">Now</span>}
              </span>
              <span className="text-[13px] tabular-nums text-ink/75">
                {fmtIST(s.start, date)} – {fmtIST(s.end, date)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- page ---------- */

export default function PanchangPage() {
  const initial = useMemo(readQuery, []);
  const [applied, setApplied] = useState(initial);
  const [draftDate, setDraftDate] = useState(initial.date);
  const [draftCity, setDraftCity] = useState<City | null>(initial.city);
  const [pickerKey, setPickerKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const today = todayIST();
  const isToday = applied.date === today;

  useEffect(() => {
    document.title = `${isToday ? "Today Panchang" : `Panchang ${applied.date}`} · ${applied.city.name} — Astroj Chat`;
  }, [applied, isToday]);

  const p = useMemo(() => computePanchang(applied.date, applied.city.lat, applied.city.lon, cityLabel(applied.city)), [applied]);

  const dirty = draftDate !== applied.date || draftCity?.name !== applied.city.name;

  const apply = (date: string, city: City) => {
    setLoading(true);
    // brief beat so the refresh is perceptible; the maths itself is instant
    setTimeout(() => {
      setApplied({ date, city });
      writeQuery(date, city);
      setLoading(false);
    }, 280);
  };

  const onGet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftDate) return setError("Please choose a date.");
    if (!draftCity) return setError("Please pick a location from the list.");
    setError(null);
    apply(draftDate, draftCity);
  };

  const jump = (date: string) => {
    setDraftDate(date);
    setDraftCity(applied.city);
    setPickerKey((k) => k + 1);
    setError(null);
    apply(date, applied.city);
  };

  const dayLen = p.sunset.getTime() - p.sunrise.getTime();
  const timings = [
    { icon: Sunrise, label: "Sunrise", v: fmtIST(p.sunrise), sub: `Day length ${fmtDuration(dayLen)}` },
    { icon: Sunset, label: "Sunset", v: fmtIST(p.sunset), sub: `Night ${fmtDuration(p.nextSunrise.getTime() - p.sunset.getTime())}` },
    { icon: MoonStar, label: "Moonrise", v: p.moonrise ? fmtIST(p.moonrise) : "No moonrise", sub: p.moonrise ? "Local time (IST)" : "Rises after midnight" },
    { icon: Moon, label: "Moonset", v: p.moonset ? fmtIST(p.moonset) : "No moonset", sub: p.moonset ? "Local time (IST)" : "Sets after midnight" },
  ];

  const planetRows = [
    { name: "Ascendant", sign: p.sky.ascendant.sign, deg: p.sky.ascendant.degInSign, nak: p.sky.ascendant.nakshatra, pada: p.sky.ascendant.pada, retro: false },
    ...p.sky.planets.map((x) => ({ name: x.name, sign: x.sign, deg: x.degInSign, nak: x.nakshatra, pada: x.pada, retro: x.retro && x.key !== "rahu" && x.key !== "ketu" })),
  ];

  const inputCls = "h-[52px] rounded-full border border-ink/12 bg-white text-[14.5px] text-ink outline-none placeholder:text-ink/40 focus:border-saffron";

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      {/* Hero + controls */}
      <section className="grain relative bg-cocoa pb-24 pt-[72px] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        </div>
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">Panchang</span>
          </nav>
          <h1 className="rise font-display mt-5 text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[1.03]">
            {isToday ? (
              <>
                Today <em className="font-medium italic text-saffron">Panchang</em>
              </>
            ) : (
              <>
                <em className="font-medium italic text-saffron">Panchang</em> for {new Date(`${applied.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              </>
            )}
          </h1>
          <p className="rise mt-4 max-w-[620px] text-[15.5px] leading-relaxed text-white/65" style={{ animationDelay: "90ms" }}>
            Tithi, Nakshatra, Yoga, Karana and Vaar with sunrise-based timings, Rahu Kaal, Choghadiya and auspicious muhurats — for
            any date and city in India.
          </p>

          <form
            onSubmit={onGet}
            className="rise relative z-20 mt-8 grid gap-3 rounded-[28px] bg-white/[.08] p-3 ring-1 ring-white/15 backdrop-blur md:grid-cols-[220px_1fr_auto]"
            style={{ animationDelay: "160ms" }}
          >
            <label className="relative block">
              <span className="sr-only">Date</span>
              <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron" />
              <input
                type="date"
                aria-label="Date"
                value={draftDate}
                min="1900-01-01"
                max="2100-12-31"
                onChange={(e) => setDraftDate(e.target.value)}
                className={`${inputCls} w-full pl-11 pr-4`}
              />
            </label>
            <CityPicker key={pickerKey} value={draftCity} onChange={setDraftCity} inputClassName={inputCls} />
            <button
              type="submit"
              disabled={loading}
              className={`flex h-[52px] items-center justify-center gap-2 rounded-full bg-saffron px-7 text-[15px] font-semibold text-white transition-colors hover:bg-saffron-deep disabled:opacity-80 ${
                dirty && !loading ? "ring-4 ring-saffron/30" : ""
              }`}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Get Panchang
            </button>
          </form>
          <div className="mt-3 min-h-[20px] px-2 text-[12.5px]">
            {error ? (
              <span className="text-[#FFB59E]">{error}</span>
            ) : dirty ? (
              <span className="text-gold">Press “Get Panchang” to update the details below.</span>
            ) : (
              <span className="text-white/45">
                Showing {cityLabel(applied.city)} · {applied.city.lat.toFixed(2)}°N {applied.city.lon.toFixed(2)}°E · IST
              </span>
            )}
          </div>
        </div>
      </section>

      <main className={`relative z-10 mx-auto -mt-14 max-w-[1240px] px-5 pb-20 transition-opacity duration-200 md:px-8 ${loading ? "opacity-40" : ""}`}>
        {/* Date header */}
        <div key={`${applied.date}-${applied.city.name}`} className="rise flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-[0_30px_60px_-30px_rgba(23,18,14,.35)] ring-1 ring-ink/[.06] md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[.16em] text-saffron">
              {p.paksha} {p.tithi[0].name} · {p.amanta} {p.adhik ? "(Adhik)" : ""}
            </div>
            <div className="font-display mt-1 text-[24px] font-semibold leading-tight text-ink md:text-[28px]">{longDate(applied.date)}</div>
            <div className="mt-1 text-[13.5px] text-mutedtext">{cityLabel(applied.city)}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => jump(shiftDate(applied.date, -1))}
              className="flex h-10 items-center gap-1 rounded-full px-3.5 text-[13px] font-semibold text-ink ring-1 ring-ink/12 hover:bg-sand"
            >
              <ChevronLeft className="h-4 w-4" /> Prev<span className="hidden sm:inline">ious day</span>
            </button>
            {!isToday && (
              <button type="button" onClick={() => jump(today)} className="h-10 rounded-full px-4 text-[13px] font-semibold text-ink ring-1 ring-ink/12 hover:bg-sand">
                Today
              </button>
            )}
            <button
              type="button"
              onClick={() => jump(shiftDate(applied.date, 1))}
              className="flex h-10 items-center gap-1 rounded-full bg-ink px-3.5 text-[13px] font-semibold text-white hover:bg-saffron"
            >
              {applied.date === today ? "Tomorrow" : <>Next<span className="hidden sm:inline"> day</span></>} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sun & moon */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {timings.map((t) => (
            <div key={t.label} className="rounded-[22px] bg-sand p-5 md:p-6">
              <t.icon className="h-6 w-6 text-saffron" />
              <div className="mt-4 text-[12px] font-semibold uppercase tracking-[.14em] text-mutedtext">{t.label}</div>
              <div className="font-display mt-0.5 text-[22px] font-semibold leading-tight text-ink md:text-[26px]">{t.v}</div>
              <div className="mt-1 text-[12px] text-mutedtext">{t.sub}</div>
            </div>
          ))}
        </div>

        {/* Five limbs + calendar */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card title="Panchang details" sub="Values at sunrise, with change times until next sunrise">
            <Row k="Tithi">
              <SegValue segs={p.tithi} date={applied.date} />
            </Row>
            <Row k="Nakshatra">
              <SegValue segs={p.nakshatra} date={applied.date} />
            </Row>
            <Row k="Yoga">
              <SegValue segs={p.yoga} date={applied.date} />
            </Row>
            <Row k="Karana">
              <SegValue segs={p.karana} date={applied.date} />
            </Row>
            <Row k="Paksha">
              <span className="font-semibold text-ink">{p.paksha}</span>
            </Row>
            <Row k="Weekday (Vaar)">
              <span className="font-semibold text-ink">{p.weekday}</span>
            </Row>
          </Card>
          <Card title="Hindu calendar" sub="Lunar month, samvat and season">
            <Row k="Shaka Samvat">
              <span className="font-semibold text-ink">
                {p.shaka} <span className="font-normal text-mutedtext">{p.samvatsara}</span>
              </span>
            </Row>
            <Row k="Vikram Samvat">
              <span className="font-semibold text-ink">{p.vikram}</span>
            </Row>
            <Row k="Month (Amanta)">
              <span className="font-semibold text-ink">
                {p.adhik ? "Adhik " : ""}
                {p.amanta}
              </span>
            </Row>
            <Row k="Month (Purnimanta)">
              <span className="font-semibold text-ink">
                {p.adhik ? "Adhik " : ""}
                {p.purnimanta}
              </span>
            </Row>
            <Row k="Moon sign">
              <SegValue segs={p.moonSign} date={applied.date} />
            </Row>
            <Row k="Sun sign">
              <span className="font-semibold text-ink">{p.sunSign}</span>
            </Row>
            <Row k="Ritu · Ayana">
              <span className="font-semibold text-ink">
                {p.ritu} · {p.ayana}
              </span>
            </Row>
            <Row k="Dishashool">
              <span className="flex items-center gap-1.5 font-semibold text-ink">
                <Compass className="h-4 w-4 text-saffron" /> {p.dishashool}
              </span>
            </Row>
          </Card>
        </div>

        {/* Muhurats */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card tone="red" title="Inauspicious timings (Ashubha Muhurat)" sub="Avoid starting new work in these windows">
            <TimeSpanList spans={p.inauspicious} date={applied.date} now={now} />
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#8A4B3C]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Rahu Kaal, Yamaganda and Gulika are each one-eighth of the day from sunrise to sunset.
            </p>
          </Card>
          <Card tone="green" title="Auspicious timings (Shubh Muhurat)" sub="Favourable windows for prayer and new beginnings">
            <TimeSpanList spans={p.auspicious} date={applied.date} now={now} />
            <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#46632F]">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {p.weekday === "Wednesday" ? "Abhijit Muhurat is not observed on Wednesdays." : "Abhijit Muhurat is the 8th of 15 muhurtas of the day — ideal for important work."}
            </p>
          </Card>
        </div>

        {/* Choghadiya */}
        <Card title="Choghadiya" sub="Eight day and eight night periods, ruled by the weekday" className="mt-5">
          <div className="grid gap-6 md:grid-cols-2">
            <ChogList label="Day" spans={p.choghadiya.day} date={applied.date} now={now} />
            <ChogList label="Night" spans={p.choghadiya.night} date={applied.date} now={now} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-[12px]">
            <span className={`rounded-full px-3 py-1 font-semibold ${CHOG_STYLE.good}`}>Amrit · Shubh · Labh — good</span>
            <span className={`rounded-full px-3 py-1 font-semibold ${CHOG_STYLE.neutral}`}>Char — neutral</span>
            <span className={`rounded-full px-3 py-1 font-semibold ${CHOG_STYLE.bad}`}>Udveg · Kaal · Rog — avoid</span>
          </div>
        </Card>

        {/* Balam */}
        <Card title="Chandrabalam & Tarabalam" sub="Favourable for people born with these Moon signs and Nakshatras (at sunrise)" className="mt-5">
          <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[.16em] text-mutedtext">Chandrabalam · Moon signs</div>
              <div className="flex flex-wrap gap-2">
                {p.chandrabalam.map((s) => (
                  <span key={s} className="rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium text-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[.16em] text-mutedtext">Tarabalam · Nakshatras</div>
              <div className="flex flex-wrap gap-2">
                {p.tarabalam.map((s) => (
                  <span key={s} className="rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium text-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Planets + chart */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <Card title="Planetary positions" sub={`At sunrise, ${fmtIST(p.sunrise)} · Lahiri ayanamsa`} className="min-w-0 !px-0 !pb-2 [&>div:first-child]:px-6 md:[&>div:first-child]:px-7">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[14px]">
                <thead>
                  <tr className="border-b border-ink/[.07] text-[11.5px] uppercase tracking-[.12em] text-mutedtext">
                    {["Planet", "Rashi", "Longitude", "Nakshatra", "Pada"].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold first:pl-7">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {planetRows.map((r) => (
                    <tr key={r.name} className="border-b border-ink/[.05] last:border-0 even:bg-ivory/60">
                      <td className="px-4 py-3 pl-7 font-semibold text-ink">
                        {r.name}
                        {r.retro && <span className="ml-1.5 text-[11px] font-semibold text-saffron">(R)</span>}
                      </td>
                      <td className="px-4 py-3 text-ink">{SIGNS[r.sign]}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-ink">{fmtDeg(r.deg)}</td>
                      <td className="px-4 py-3 text-ink">{r.nak}</td>
                      <td className="px-4 py-3 text-mutedtext">{r.pada}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Lagna chart" sub="Sky at sunrise, North Indian style" className="min-w-0">
            <div className="mx-auto max-w-[380px]">
              <NorthChart
                lagnaSign={p.sky.ascendant.sign}
                planets={p.sky.planets.map((x) => ({ short: x.short, sign: x.sign, retro: x.retro && x.key !== "rahu" && x.key !== "ketu", deg: x.degInSign }))}
                title="Lagna chart at sunrise"
              />
            </div>
          </Card>
        </div>

        {/* About + CTA */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.18em] text-saffron">
              <span className="h-2 w-2 rotate-45 bg-saffron" /> What is Panchang
            </div>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.08] text-ink">Five limbs of the Vedic day</h2>
            <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-mutedtext">
              Panchang comes from <em>panch</em> (five) and <em>ang</em> (limb). Tithi, Vaar, Nakshatra, Yoga and Karana together describe the
              quality of each day, and are used to pick muhurats for marriage, griha pravesh, travel, naming ceremonies and fasts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Tithi", "Lunar day — 12° of Moon–Sun distance"],
              ["Vaar", "Weekday, ruled by a planet"],
              ["Nakshatra", "Moon’s lunar mansion, 1 of 27"],
              ["Yoga", "Sum of Sun & Moon longitudes"],
              ["Karana", "Half of a tithi, 1 of 11"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-[18px] bg-sand p-4">
                <div className="text-[14.5px] font-semibold text-ink">{t}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-mutedtext">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-ink p-7 text-white md:flex-row md:items-center md:p-9">
          <div>
            <h3 className="font-display text-[26px] font-semibold leading-tight">Planning something important?</h3>
            <p className="mt-1.5 text-[14px] text-white/60">Get a personal muhurat from a verified astrologer — first chat is free.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/chat-with-astrologer" className="flex h-12 items-center gap-2 rounded-full bg-saffron px-6 text-[14px] font-semibold text-white hover:bg-saffron-deep">
              Chat with astrologer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/free-kundli" className="flex h-12 items-center rounded-full px-5 text-[14px] font-semibold text-white ring-1 ring-white/20 hover:bg-white/10">
              Free Kundli
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-[12px] text-mutedtext">
          Calculated on your device with Lahiri ayanamsa for the selected city, in Indian Standard Time. Sunrise and sunset use the
          upper limb with standard refraction.
        </p>
      </main>

      <Footer />
    </div>
  );
}
