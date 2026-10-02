import { useMemo, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Card, Toggle } from "./ui";
import type { Kundli } from "../../lib/kundli";
import { birthDateUTC } from "../../lib/kundli";
import { DASHA_TEXT, DASHA_YEARS, fmtDate, runningAt, subPeriods, yoginiDasha, type Period } from "../../lib/kundli-extra";

const LEVELS = ["Mahadasha", "Antardasha", "Pratyantar dasha"];

function PeriodList({ items, birth, now, onOpen, prefix, canOpen }: { items: Period[]; birth: Date; now: Date; onOpen?: (p: Period) => void; prefix: string; canOpen: boolean }) {
  const visible = items.filter((p) => p.end > birth);
  return (
    <ul className="space-y-2">
      {visible.map((d) => {
        const isCur = d.start <= now && now < d.end;
        const start = d.start < birth ? birth : d.start;
        const body = (
          <>
            <span className={`flex h-9 w-9 shrink-0 rotate-45 items-center justify-center rounded-[8px] ${isCur ? "bg-saffron text-white" : "bg-white ring-1 ring-ink/10"}`}>
              <span className="-rotate-45 text-[11px] font-bold">{d.lord.slice(0, 2)}</span>
            </span>
            <span className="ml-1 min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2 text-[14.5px] font-semibold text-ink">
                {prefix}
                {d.lord}
                {isCur && <span className="rounded-full bg-saffron px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-white">Running</span>}
              </span>
              <span className="block text-[12.5px] text-mutedtext">
                {fmtDate(start)} – {fmtDate(d.end)}
              </span>
            </span>
            {canOpen && <ChevronRight className="h-4 w-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-saffron" />}
          </>
        );
        return (
          <li key={d.lord + d.start.getTime()}>
            {canOpen && onOpen ? (
              <button
                type="button"
                onClick={() => onOpen(d)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${isCur ? "bg-saffron/[.08] ring-1 ring-saffron/30" : "bg-ivory hover:bg-sand"}`}
              >
                {body}
              </button>
            ) : (
              <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${isCur ? "bg-saffron/[.08] ring-1 ring-saffron/30" : "bg-ivory"}`}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DashaTab({ k }: { k: Kundli }) {
  const [sys, setSys] = useState<"vim" | "yog">("vim");
  const [path, setPath] = useState<Period[]>([]);
  const birth = useMemo(() => birthDateUTC(k.input.dob, k.input.tob), [k.input]);
  const now = useMemo(() => new Date(), []);

  // full-length mahadashas (the first one is a balance at birth; antardashas need its full span)
  const mahas = k.dashas;
  const full = (p: Period, level: number) => (level === 0 ? DASHA_YEARS[p.lord] : undefined);
  const lists: Period[][] = [mahas];
  path.forEach((p, i) => lists.push(subPeriods(p, full(p, i))));
  const level = path.length;

  const runMaha = runningAt(mahas, now);
  const runAntar = runMaha ? runningAt(subPeriods(runMaha, DASHA_YEARS[runMaha.lord]), now) : null;
  const runPrat = runAntar ? runningAt(subPeriods(runAntar), now) : null;

  const yog = useMemo(() => yoginiDasha(k, birth), [k, birth]);
  const runYog = yog.find((y) => y.start <= now && now < y.end);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Toggle
          label="Dasha system"
          value={sys}
          onChange={setSys}
          options={[
            { v: "vim", l: "Vimshottari" },
            { v: "yog", l: "Yogini" },
          ]}
        />
        <p className="text-[12.5px] text-mutedtext">Based on the Moon in {k.nakshatra} at birth</p>
      </div>

      {sys === "vim" && runMaha && (
        <div className="grain relative overflow-hidden rounded-[24px] bg-cocoa p-6 text-white md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-saffron/30 blur-[90px]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.16em] text-gold">
                <Sparkles className="h-4 w-4" /> Running now
              </div>
              <div className="font-display mt-2 text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-tight">
                {runMaha.lord}
                {runAntar && <span className="text-white/50"> › </span>}
                {runAntar?.lord}
                {runPrat && <span className="text-white/50"> › </span>}
                <span className="text-saffron">{runPrat?.lord}</span>
              </div>
              <p className="mt-3 max-w-[460px] text-[14px] leading-relaxed text-white/65">{DASHA_TEXT[runMaha.lord]}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {[
                { l: "Mahadasha", p: runMaha },
                { l: "Antardasha", p: runAntar },
                { l: "Pratyantar", p: runPrat },
              ].map(
                (x) =>
                  x.p && (
                    <div key={x.l} className="rounded-2xl bg-white/[.07] p-4 ring-1 ring-white/10">
                      <div className="text-[11px] font-semibold uppercase tracking-[.14em] text-white/50">{x.l}</div>
                      <div className="mt-1 text-[17px] font-semibold">{x.p.lord}</div>
                      <div className="mt-1 text-[11.5px] text-white/55">till {fmtDate(x.p.end)}</div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      {sys === "vim" ? (
        <Card
          title={LEVELS[level]}
          sub={level === 0 ? "Tap a period to see its sub-periods" : level === 1 ? "Tap again for pratyantar dasha" : "Third level of the Vimshottari cycle"}
          right={
            level > 0 && (
              <button type="button" onClick={() => setPath(path.slice(0, -1))} className="h-9 rounded-full px-4 text-[13px] font-semibold text-ink ring-1 ring-ink/15 hover:bg-ink hover:text-white">
                ← Back
              </button>
            )
          }
        >
          <nav aria-label="Dasha level" className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px]">
            <button type="button" onClick={() => setPath([])} className={`font-semibold ${level === 0 ? "text-ink" : "text-saffron hover:underline"}`}>
              Mahadasha
            </button>
            {path.map((p, i) => (
              <span key={p.lord + i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
                <button type="button" onClick={() => setPath(path.slice(0, i + 1))} className={`font-semibold ${i === level - 1 ? "text-ink" : "text-saffron hover:underline"}`}>
                  {p.lord}
                </button>
              </span>
            ))}
          </nav>
          <PeriodList
            items={lists[level]}
            birth={birth}
            now={now}
            prefix={path.map((p) => `${p.lord.slice(0, 2)}–`).join("")}
            canOpen={level < 2}
            onOpen={(p) => setPath([...path, p])}
          />
          <p className="mt-4 text-[12.5px] leading-relaxed text-mutedtext">
            Vimshottari is a 120-year cycle. The first Mahadasha is the balance left at birth; periods before birth are hidden.
          </p>
        </Card>
      ) : (
        <Card title="Yogini dasha" sub="36-year cycle of eight Yoginis, shown for 100 years from birth">
          {runYog && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-saffron/[.08] px-4 py-3 ring-1 ring-saffron/25">
              <span className="text-[13.5px] text-ink">
                Running: <b className="font-semibold">{runYog.name}</b> ({runYog.lord})
              </span>
              <span className="text-[12.5px] text-mutedtext">till {fmtDate(runYog.end)}</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {yog.map((y) => {
              const isCur = y === runYog;
              const past = y.end < now;
              return (
                <div key={y.start.getTime()} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${isCur ? "bg-ink text-white" : past ? "bg-ivory/60 opacity-70" : "bg-ivory"}`}>
                  <span className={`flex h-9 w-9 shrink-0 rotate-45 items-center justify-center rounded-[8px] ${isCur ? "bg-saffron" : "bg-white ring-1 ring-ink/10"}`}>
                    <span className={`-rotate-45 text-[11px] font-bold ${isCur ? "text-white" : "text-ink"}`}>{y.lord.slice(0, 2)}</span>
                  </span>
                  <span className="ml-1 min-w-0">
                    <span className="block text-[14px] font-semibold">
                      {y.name} <span className={`font-normal ${isCur ? "text-white/60" : "text-mutedtext"}`}>· {y.lord}</span>
                    </span>
                    <span className={`block text-[12px] ${isCur ? "text-white/60" : "text-mutedtext"}`}>
                      {fmtDate(y.start)} – {fmtDate(y.end)}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
