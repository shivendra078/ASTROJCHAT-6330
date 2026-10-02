import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, Search, Trash2, ScrollText, FolderOpen, ArrowRight, Orbit, Clock3, HeartHandshake, Gem, ShieldCheck } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { KundliForm } from "../components/kundli/kundli-form";
import { saveKundli, useSavedKundlis } from "../lib/saved-kundli";

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

function SavedPanel() {
  const { list, remove } = useSavedKundlis();
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const filtered = list.filter((k) => `${k.name} ${k.place}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="flex h-full flex-col rounded-[28px] bg-white p-6 ring-1 ring-ink/[.06] md:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink">
          <FolderOpen className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 className="text-[19px] font-semibold text-ink">Open saved Kundli</h2>
          <p className="text-[13px] text-mutedtext">
            {list.length ? `${list.length} saved on this device` : "Charts you generate are saved here"}
          </p>
        </div>
      </div>

      {list.length > 0 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            aria-label="Search saved kundlis"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or place"
            className="h-11 w-full rounded-full border border-ink/12 bg-ivory pl-10 pr-4 text-[14px] text-ink outline-none placeholder:text-ink/40 focus:border-saffron"
          />
        </div>
      )}

      <div className="mt-4 flex-1">
        {list.length === 0 ? (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-[20px] border border-dashed border-ink/15 bg-ivory px-6 py-10 text-center">
            <ScrollText className="h-9 w-9 text-saffron/70" />
            <p className="mt-4 text-[15px] font-semibold text-ink">No saved kundlis yet</p>
            <p className="mt-1 max-w-[260px] text-[13px] leading-relaxed text-mutedtext">
              Generate a kundli for yourself or a loved one and it will appear here for quick access.
            </p>
            <Link
              href="/freekundli/basic-detail"
              className="mt-5 flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-semibold text-white hover:bg-cocoa"
            >
              View a sample kundli <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="max-h-[440px] space-y-2.5 overflow-y-auto pr-1">
            {filtered.map((k) => (
              <li key={k.id} className="group flex items-center gap-3 rounded-2xl border border-ink/[.07] bg-ivory p-3 transition-colors hover:border-saffron/40">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-saffron text-[16px] font-semibold text-white">
                  {k.name[0]?.toUpperCase()}
                </div>
                <Link href={`/free-kundli/${k.id}`} className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-semibold text-ink">{k.name}</div>
                  <div className="truncate text-[12px] text-mutedtext">
                    {fmtDate(k.dob)} · {fmtTime(k.tob)} · {k.place.split(",")[0]}
                  </div>
                </Link>
                {confirm === k.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        remove(k.id);
                        setConfirm(null);
                      }}
                      className="h-8 rounded-full bg-red-600 px-3 text-[12px] font-semibold text-white"
                    >
                      Delete
                    </button>
                    <button type="button" onClick={() => setConfirm(null)} className="h-8 px-2 text-[12px] font-semibold text-ink/60">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label={`Delete ${k.name}`}
                      onClick={() => setConfirm(k.id)}
                      className="rounded-full p-2 text-ink/35 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/free-kundli/${k.id}`}
                      className="flex h-9 items-center gap-1 rounded-full bg-ink px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-saffron"
                    >
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}
              </li>
            ))}
            {filtered.length === 0 && <li className="py-8 text-center text-[13px] text-mutedtext">No saved kundli matches “{q}”</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

const features = [
  { icon: Orbit, title: "Lagna & Navamsa charts", desc: "North and South Indian style D1 and D9 charts." },
  { icon: Clock3, title: "Vimshottari Dasha", desc: "Mahadasha periods with your current running dasha." },
  { icon: HeartHandshake, title: "Manglik check", desc: "Instant Mangal Dosha analysis from your Lagna." },
  { icon: Gem, title: "Panchang & Avakhada", desc: "Tithi, nakshatra, yoga, gana, yoni, nadi and more." },
];

export default function FreeKundliPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Kundli Online — Astroj Chat";
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      <section className="grain relative overflow-hidden bg-cocoa pb-36 pt-[72px] text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">Free Kundli</span>
          </nav>
          <h1 className="rise font-display mt-5 max-w-[760px] text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[1.03]">
            Free <em className="font-medium italic text-saffron">Kundli</em> online — your complete birth chart
          </h1>
          <p className="rise mt-4 max-w-[600px] text-[15.5px] leading-relaxed text-white/65" style={{ animationDelay: "100ms" }}>
            Enter birth details to generate an accurate Vedic Janam Kundli with Lahiri ayanamsa — planets, houses, dashas and
            doshas, in seconds.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-24 px-5 md:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rise rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(23,18,14,.35)] ring-1 ring-ink/[.06] md:p-8" style={{ animationDelay: "150ms" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 rotate-45 items-center justify-center rounded-[10px] bg-saffron">
                <ScrollText className="h-5 w-5 -rotate-45 text-white" />
              </div>
              <div className="ml-1">
                <h2 className="text-[19px] font-semibold text-ink">Generate new Kundli</h2>
                <p className="text-[13px] text-mutedtext">Takes less than a minute</p>
              </div>
            </div>
            <KundliForm
              onSubmit={(b) => {
                const saved = saveKundli(b);
                navigate(`/free-kundli/${saved.id}`);
              }}
            />
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-mutedtext">
              <ShieldCheck className="h-3.5 w-3.5" /> Birth details stay on your device.
              <span className="text-ink/20">·</span>
              <Link href="/freekundli/basic-detail" className="font-semibold text-saffron-deep hover:underline">
                See a sample
              </Link>
            </p>
          </div>
          <div className="rise" style={{ animationDelay: "230ms" }}>
            <SavedPanel />
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.18em] text-saffron">
            <span className="h-2 w-2 rotate-45 bg-saffron" /> What you get
          </div>
          <h2 className="font-display mt-4 max-w-[640px] text-[clamp(1.9rem,3.6vw,2.8rem)] font-semibold leading-[1.08] text-ink">
            Everything in a professional Janam Kundli, free
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-[22px] bg-sand p-6">
                <f.icon className="h-6 w-6 text-saffron" />
                <h3 className="mt-5 text-[16px] font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mutedtext">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[24px] bg-ink p-7 text-white md:flex-row md:items-center md:p-9">
            <div>
              <h3 className="font-display text-[26px] font-semibold leading-tight">Need help reading your chart?</h3>
              <p className="mt-1.5 text-[14px] text-white/60">Share your kundli with a verified astrologer — first chat is free.</p>
            </div>
            <Link
              href="/chat-with-astrologer"
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-saffron px-6 text-[14px] font-semibold text-white hover:bg-saffron-deep"
            >
              Chat with astrologer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
