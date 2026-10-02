import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearch } from "wouter";
import { ChevronRight, Printer, Plus, FolderOpen, ArrowRight, CalendarDays, Clock3, MapPin, User, ScrollText, Sparkles } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { getSaved } from "../lib/saved-kundli";
import { computeKundli, SIGNS, type BirthInput } from "../lib/kundli";
import { fmtDate, fmtDob, fmtTime, runningAt, SAMPLE_INPUT } from "../lib/kundli-extra";
import type { ChartStyle } from "../components/kundli/ui";
import { BasicTab } from "../components/kundli/tab-basic";
import { KundliTab } from "../components/kundli/tab-kundli";
import { KpTab } from "../components/kundli/tab-kp";
import { ChartsTab } from "../components/kundli/tab-charts";
import { DashaTab } from "../components/kundli/tab-dasha";
import { ReportTab } from "../components/kundli/tab-report";

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "kundli", label: "Kundli" },
  { id: "kp", label: "KP" },
  { id: "charts", label: "Charts" },
  { id: "dasha", label: "Dasha" },
  { id: "report", label: "Free Report" },
] as const;
type Tab = (typeof TABS)[number]["id"];
const isTab = (t: string | null): t is Tab => TABS.some((x) => x.id === t);

function NotFound() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />
      <div className="mx-auto flex max-w-[520px] flex-col items-center px-5 pb-24 pt-40 text-center">
        <ScrollText className="h-10 w-10 text-saffron" />
        <h1 className="font-display mt-5 text-[32px] font-semibold text-ink">Kundli not found</h1>
        <p className="mt-2 text-[15px] text-mutedtext">This chart isn’t saved on this device. It may have been deleted, or saved in another browser.</p>
        <Link href="/free-kundli" className="mt-7 flex h-12 items-center gap-2 rounded-full bg-saffron px-6 text-[14px] font-semibold text-white hover:bg-saffron-deep">
          Generate a new Kundli <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export function SampleKundliPage() {
  return <KundliView input={SAMPLE_INPUT} sample />;
}

export default function KundliResultPage() {
  const { id } = useParams<{ id: string }>();
  const saved = useMemo(() => (id === "sample" ? null : getSaved(id)), [id]);
  if (id === "sample") return <KundliView input={SAMPLE_INPUT} sample />;
  if (!saved) return <NotFound />;
  return <KundliView input={saved} />;
}

function KundliView({ input, sample = false }: { input: BirthInput; sample?: boolean }) {
  const k = useMemo(() => computeKundli(input), [input]);
  const search = useSearch();
  const [location, navigate] = useLocation();
  const q = new URLSearchParams(search).get("tab");
  const tab: Tab = isTab(q) ? q : "basic";
  const setTab = (t: Tab) => navigate(`${location}${t === "basic" ? "" : `?tab=${t}`}`, { replace: true });
  const [style, setStyle] = useState<ChartStyle>("north");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${input.name}'s Kundli — Astroj Chat`;
  }, [input]);

  const meta = [
    { icon: User, v: input.gender },
    { icon: CalendarDays, v: fmtDob(input.dob) },
    { icon: Clock3, v: fmtTime(input.tob) },
    { icon: MapPin, v: input.place },
  ];
  const summary = [
    { l: "Lagna", v: SIGNS[k.ascendant.sign] },
    { l: "Rashi", v: SIGNS[k.moonSign] },
    { l: "Nakshatra", v: k.nakshatra },
    { l: "Manglik", v: k.manglik ? "Yes" : "No" },
  ];
  const running = runningAt(k.dashas, new Date());

  const panel = (t: Tab) => {
    switch (t) {
      case "basic":
        return <BasicTab k={k} />;
      case "kundli":
        return <KundliTab k={k} style={style} setStyle={setStyle} />;
      case "kp":
        return <KpTab k={k} style={style} setStyle={setStyle} />;
      case "charts":
        return <ChartsTab k={k} style={style} setStyle={setStyle} />;
      case "dasha":
        return <DashaTab k={k} />;
      case "report":
        return <ReportTab k={k} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="print:hidden">
        <Navbar alwaysSolid />
      </div>

      <section className="grain relative overflow-hidden bg-cocoa pb-10 pt-[72px] text-white print:bg-white print:pt-0 print:text-ink">
        <div className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-saffron/25 blur-[130px] print:hidden" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50 print:hidden">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/free-kundli" className="hover:text-saffron">
              Free Kundli
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-white/85">{input.name}</span>
          </nav>

          {sample && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12.5px] text-white/80 ring-1 ring-white/15 print:hidden">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Sample kundli —{" "}
              <Link href="/free-kundli" className="font-semibold text-saffron hover:underline">
                make yours
              </Link>
            </div>
          )}

          <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="min-w-0">
              <h1 className="rise font-display text-[clamp(2.1rem,4.6vw,3.4rem)] font-semibold leading-[1.05]">
                {input.name}’s <em className="font-medium italic text-saffron">Kundli</em>
              </h1>
              <div className="rise mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-white/70 print:text-ink/70" style={{ animationDelay: "90ms" }}>
                {meta.map((m) => (
                  <span key={m.v} className="flex items-center gap-1.5">
                    <m.icon className="h-4 w-4 text-saffron" /> {m.v}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-[13px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 md:h-11 md:gap-2 md:px-4 md:text-[13.5px]"
              >
                <Printer className="h-4 w-4" /> Print<span className="hidden sm:inline"> / PDF</span>
              </button>
              <Link href="/free-kundli" className="flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-[13px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/15 md:h-11 md:gap-2 md:px-4 md:text-[13.5px]">
                <FolderOpen className="h-4 w-4" /> Saved
              </Link>
              <Link href="/free-kundli" className="flex h-10 items-center gap-1.5 rounded-full bg-saffron px-3.5 text-[13px] font-semibold text-white hover:bg-saffron-deep md:h-11 md:gap-2 md:px-4 md:text-[13.5px]">
                <Plus className="h-4 w-4" /> New Kundli
              </Link>
            </div>
          </div>

          <div className="rise mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" style={{ animationDelay: "160ms" }}>
            {summary.map((s) => (
              <div key={s.l} className="rounded-[18px] bg-white/[.07] px-5 py-4 ring-1 ring-white/10 print:bg-sand print:ring-0">
                <div className="text-[11.5px] font-semibold uppercase tracking-[.16em] text-gold">{s.l}</div>
                <div className="font-display mt-1 text-[22px] font-semibold leading-tight">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-20 border-b border-ink/[.07] bg-ivory/95 backdrop-blur print:hidden">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <div role="tablist" aria-label="Kundli sections" className="no-scrollbar -mb-px flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`h-14 shrink-0 border-b-2 px-4 text-[14px] font-semibold transition-colors ${
                  tab === t.id ? "border-saffron text-ink" : "border-transparent text-ink/50 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1240px] px-5 py-8 md:px-8 md:py-10">
        <div key={tab} className="rise print:hidden">
          {panel(tab)}
        </div>
        <div className="hidden space-y-10 print:block">
          {TABS.map((t) => (
            <section key={t.id} className="break-before-page first:break-before-auto">
              <h2 className="font-display mb-5 text-[26px] font-semibold text-ink">{t.label}</h2>
              {panel(t.id)}
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-ink p-7 text-white md:flex-row md:items-center md:p-9 print:hidden">
          <div>
            <h3 className="font-display text-[26px] font-semibold leading-tight">Get your Kundli read by an expert</h3>
            <p className="mt-1.5 text-[14px] text-white/60">
              {running ? `You're running ${running.lord} Mahadasha until ${fmtDate(running.end)}` : "Your dasha periods shape every phase of life"} — ask a verified
              astrologer what it means for you. First chat is free.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/chat-with-astrologer" className="flex h-12 items-center gap-2 rounded-full bg-saffron px-6 text-[14px] font-semibold text-white hover:bg-saffron-deep">
              Chat with astrologer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/talk-to-astrologer" className="flex h-12 items-center rounded-full px-5 text-[14px] font-semibold text-white ring-1 ring-white/20 hover:bg-white/10">
              Call instead
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-[12px] text-mutedtext">
          Calculated with Lahiri ayanamsa and mean nodes for Indian Standard Time. Whole-sign houses for Lagna charts, Placidus cusps for KP.
        </p>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
