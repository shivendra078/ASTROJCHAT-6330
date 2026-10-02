import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import { Card, Chart, StyleToggle, Table, type ChartStyle } from "./ui";
import { SIGNS, type Kundli } from "../../lib/kundli";
import { fmtDMS, houseOf, kpLords, placidusCusps, rulingPlanets } from "../../lib/kundli-extra";

export function KpTab({ k, style, setStyle }: { k: Kundli; style: ChartStyle; setStyle: (s: ChartStyle) => void }) {
  const cusps = useMemo(() => placidusCusps(k.input), [k.input]);
  const rp = useMemo(() => rulingPlanets(k.input), [k.input]);

  const planets = k.planets.map((p) => ({ p, house: houseOf(p.lon, cusps), l: kpLords(p.lon) }));
  const cuspRows = cusps.map((c, i) => ({ i: i + 1, lon: c, sign: Math.floor(c / 30), l: kpLords(c) }));
  const owned = (name: string) => cuspRows.filter((c) => c.l.signLord === name).map((c) => c.i);
  const occupied = (name: string) => planets.find((x) => x.p.name === name)?.house;

  const chalit = planets.map(({ p, house }) => ({ short: p.short, sign: (k.ascendant.sign + house - 1) % 12, retro: p.retro && p.key !== "rahu" && p.key !== "ketu" }));
  const join = (a: (number | undefined)[]) => a.filter((x): x is number => !!x).join(", ") || "—";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StyleToggle value={style} onChange={setStyle} />
        <p className="text-[12.5px] text-mutedtext">Krishnamurti Paddhati · Placidus cusps · KP sub-lords</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Bhav Chalit chart" sub="Planets placed by Placidus house cusps">
          <div className="mx-auto max-w-[420px]">
            <Chart style={style} lagnaSign={k.ascendant.sign} planets={chalit} title="Chalit" />
          </div>
        </Card>
        <div className="flex min-w-0 flex-col gap-5">
          <div className="grain relative overflow-hidden rounded-[24px] bg-cocoa p-6 text-white md:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron/30 blur-[70px]" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[16px] font-semibold">
                  <span className="h-2 w-2 rotate-45 bg-saffron" /> Ruling planets
                </h3>
                <span className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <Clock3 className="h-3.5 w-3.5" />
                  {rp.at.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                </span>
              </div>
              <p className="mt-1 pl-4 text-[12.5px] text-white/55">For this moment at {k.input.place.split(",")[0]} — used in KP horary and timing</p>
              <div className="mt-5 overflow-x-auto rounded-2xl ring-1 ring-white/10">
                <table className="w-full min-w-[340px] text-left text-[13px] md:text-[13.5px]">
                  <thead>
                    <tr className="bg-white/[.06] text-[11px] uppercase tracking-[.12em] text-gold">
                      {["", "Sign lord", "Star lord", "Sub lord"].map((h) => (
                        <th key={h} className="px-3 py-2.5 font-semibold md:px-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rp.rows.map((r) => (
                      <tr key={r.l} className="border-t border-white/10">
                        <td className="px-3 py-3 font-semibold md:px-4">{r.l}</td>
                        <td className="px-3 py-3 text-white/80 md:px-4">{r.sign}</td>
                        <td className="px-3 py-3 text-white/80 md:px-4">{r.star}</td>
                        <td className="px-3 py-3 text-white/80 md:px-4">{r.sub}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[.06] px-4 py-3 text-[13.5px] ring-1 ring-white/10">
                <span className="text-white/60">Day lord</span>
                <span className="font-semibold">{rp.day}</span>
              </div>
            </div>
          </div>
          <Card title="Planet significators" sub="A: star lord's house · B: own house · C: star lord owns · D: planet owns">
            <Table
              minW={420}
              head={["Planet", "A", "B", "C", "D"]}
              rows={planets.map(({ p, house, l }) => [p.name, join([occupied(l.star)]), String(house), join(owned(l.star)), join(owned(p.name))])}
            />
          </Card>
        </div>
      </div>

      <Card title="Planets" sub="Sign, star (nakshatra) and sub lords for each planet">
        <Table
          minW={760}
          head={["Planet", "Cusp", "Sign", "Degree", "Sign lord", "Star lord", "Sub lord", "Sub-sub lord"]}
          rows={planets.map(({ p, house, l }) => [
            p.name,
            String(house),
            SIGNS[p.sign],
            <span key="d" className="font-mono text-[12.5px]">{fmtDMS(p.degInSign)}</span>,
            l.signLord,
            l.star,
            <b key="s" className="font-semibold text-saffron-deep">{l.sub}</b>,
            l.subsub,
          ])}
        />
      </Card>

      <Card title="Cusps" sub="Placidus house cusps (sidereal)">
        <Table
          minW={680}
          head={["Cusp", "Degree", "Sign", "Sign lord", "Star lord", "Sub lord"]}
          rows={cuspRows.map((c) => [
            String(c.i),
            <span key="d" className="font-mono text-[12.5px]">{fmtDMS(c.lon - c.sign * 30)}</span>,
            SIGNS[c.sign],
            c.l.signLord,
            c.l.star,
            <b key="s" className="font-semibold text-saffron-deep">{c.l.sub}</b>,
          ])}
        />
      </Card>
    </div>
  );
}
