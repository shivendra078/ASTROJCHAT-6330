import type { ChartPlanet } from "./charts";
import { Card, Chart, Pill, StyleToggle, Table, type ChartStyle } from "./ui";
import { fmtDeg, navamsaSign, SIGNS, SIGN_LORDS, type Kundli } from "../../lib/kundli";
import { avastha, dignity, isCombust, nakLord } from "../../lib/kundli-extra";

export const d1Planets = (k: Kundli, withDeg = false): ChartPlanet[] =>
  k.planets.map((p) => ({ short: p.short, sign: p.sign, retro: p.retro && p.key !== "rahu" && p.key !== "ketu", deg: withDeg ? p.degInSign : undefined }));

export function KundliTab({ k, style, setStyle }: { k: Kundli; style: ChartStyle; setStyle: (s: ChartStyle) => void }) {
  const d9: ChartPlanet[] = k.planets.map((p) => ({ short: p.short, sign: navamsaSign(p.lon), retro: p.retro && p.key !== "rahu" && p.key !== "ketu" }));
  const sun = k.planets[0];
  const node = (key: string) => key === "rahu" || key === "ketu";

  const rows = [
    [
      "Ascendant",
      SIGNS[k.ascendant.sign],
      SIGN_LORDS[k.ascendant.sign],
      `${k.ascendant.nakshatra} (${k.ascendant.pada})`,
      nakLord(k.ascendant.lon),
      <span key="d" className="font-mono text-[12.5px]">{fmtDeg(k.ascendant.degInSign)}</span>,
      "—",
      "—",
      "—",
      "1",
      "—",
    ],
    ...k.planets.map((p) => {
      const dig = dignity(p.name, p.sign);
      return [
        p.name,
        SIGNS[p.sign],
        SIGN_LORDS[p.sign],
        `${p.nakshatra} (${p.pada})`,
        nakLord(p.lon),
        <span key="d" className="font-mono text-[12.5px]">{fmtDeg(p.degInSign)}</span>,
        p.retro ? <span key="r" className={node(p.key) ? "text-mutedtext" : "font-semibold text-saffron-deep"}>Retro</span> : "Direct",
        isCombust(p, sun.lon) ? <span key="c" className="font-semibold text-red-600">Yes</span> : "No",
        node(p.key) ? "—" : avastha(p.sign, p.degInSign),
        String(p.house),
        <Pill key="s" tone={dig}>
          {dig}
        </Pill>,
      ];
    }),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StyleToggle value={style} onChange={setStyle} />
        <p className="text-[12.5px] text-mutedtext">Numbers in the chart are signs (1 = Aries). (R) = retrograde.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card title="Lagna / Ascendant chart" sub="D1 — body, personality and the whole of life">
          <div className="mx-auto max-w-[420px]">
            <Chart style={style} lagnaSign={k.ascendant.sign} planets={d1Planets(k, true)} title="Lagna" />
          </div>
        </Card>
        <Card title="Navamsa chart" sub="D9 — marriage, dharma and the real strength of planets">
          <div className="mx-auto max-w-[420px]">
            <Chart style={style} lagnaSign={navamsaSign(k.ascendant.lon)} planets={d9} title="Navamsa" />
          </div>
        </Card>
      </div>
      <Card title="Planets" sub="Sidereal positions with Lahiri ayanamsa · whole-sign houses">
        <Table minW={1060} head={["Planet", "Sign", "Sign lord", "Nakshatra", "Naksh lord", "Degree", "Retro", "Combust", "Avastha", "House", "Status"]} rows={rows} />
      </Card>
    </div>
  );
}
