import { useMemo, useRef, useState } from "react";
import type { ChartPlanet } from "./charts";
import { Card, Chart, StyleToggle, Table, type ChartStyle } from "./ui";
import { SIGNS, type Kundli } from "../../lib/kundli";
import { houseOf, placidusCusps, VARGAS, vargaSign } from "../../lib/kundli-extra";

type Built = { lagna: number; planets: ChartPlanet[] };

function build(id: string, k: Kundli, cusps: number[]): Built {
  const retro = (key: string, r: boolean) => r && key !== "rahu" && key !== "ketu";
  if (id === "chalit")
    return {
      lagna: k.ascendant.sign,
      planets: k.planets.map((p) => ({ short: p.short, sign: (k.ascendant.sign + houseOf(p.lon, cusps) - 1) % 12, retro: retro(p.key, p.retro) })),
    };
  if (id === "sun" || id === "moon")
    return { lagna: id === "sun" ? k.sunSign : k.moonSign, planets: k.planets.map((p) => ({ short: p.short, sign: p.sign, retro: retro(p.key, p.retro) })) };
  const n = Number(id.slice(1));
  return {
    lagna: vargaSign(k.ascendant.lon, n),
    planets: k.planets.map((p) => ({ short: p.short, sign: vargaSign(p.lon, n), retro: retro(p.key, p.retro) })),
  };
}

export function ChartsTab({ k, style, setStyle }: { k: Kundli; style: ChartStyle; setStyle: (s: ChartStyle) => void }) {
  const cusps = useMemo(() => placidusCusps(k.input), [k.input]);
  const all = useMemo(() => VARGAS.map((v) => ({ v, b: build(v.id, k, cusps) })), [k, cusps]);
  const [sel, setSel] = useState("d9");
  const top = useRef<HTMLDivElement>(null);
  const cur = all.find((x) => x.v.id === sel)!;

  const pick = (id: string) => {
    setSel(id);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StyleToggle value={style} onChange={setStyle} />
        <p className="text-[12.5px] text-mutedtext">{VARGAS.length} divisional charts (Shodashvarga + Chalit, Sun and Moon charts)</p>
      </div>

      <div ref={top} className="scroll-mt-[150px]">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {VARGAS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={sel === v.id}
              onClick={() => setSel(v.id)}
              className={`h-9 shrink-0 rounded-full px-3.5 text-[12.5px] font-semibold transition-colors ${
                sel === v.id ? "bg-ink text-white" : "bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink hover:ring-ink/30"
              }`}
            >
              {v.name}
              {v.id.startsWith("d") && <span className={`ml-1 ${sel === v.id ? "text-gold" : "text-mutedtext"}`}>{v.short.split(" ")[0]}</span>}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          <div className="mx-auto w-full max-w-[420px]">
            <Chart style={style} lagnaSign={cur.b.lagna} planets={cur.b.planets} title={cur.v.name} />
          </div>
          <div>
            <div className="text-[11.5px] font-semibold uppercase tracking-[.16em] text-saffron">{cur.v.short}</div>
            <h3 className="font-display mt-1 text-[30px] font-semibold leading-tight text-ink">{cur.v.name} chart</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-mutedtext">{cur.v.about}.</p>
            <div className="mt-5 rounded-2xl bg-ivory px-4 py-3 text-[13.5px]">
              <span className="text-mutedtext">{cur.v.id === "sun" || cur.v.id === "moon" ? "Reference sign" : "Lagna in this chart"}</span>{" "}
              <b className="font-semibold text-ink">{SIGNS[cur.b.lagna]}</b>
            </div>
            <div className="mt-4">
              <Table
                minW={320}
                head={["Planet", "Sign", "House"]}
                rows={k.planets.map((p, i) => {
                  const s = cur.b.planets[i].sign;
                  return [p.name, SIGNS[s], String(((s - cur.b.lagna + 12) % 12) + 1)];
                })}
              />
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-[16px] font-semibold text-ink">
          <span className="h-2 w-2 rotate-45 bg-saffron" /> All charts
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {all.map(({ v, b }) => (
            <button
              key={v.id}
              type="button"
              onClick={() => pick(v.id)}
              className={`rounded-[20px] bg-white p-3 text-left ring-1 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-24px_rgba(23,18,14,.45)] ${
                sel === v.id ? "ring-2 ring-saffron" : "ring-ink/[.06]"
              }`}
            >
              <Chart style={style} lagnaSign={b.lagna} planets={b.planets} title={v.name} />
              <span className="mt-2.5 block truncate px-1 text-[13px] font-semibold text-ink">{v.name}</span>
              <span className="block truncate px-1 text-[11.5px] text-mutedtext">{v.short}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
