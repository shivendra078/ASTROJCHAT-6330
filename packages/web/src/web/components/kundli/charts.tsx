import { SIGNS } from "../../lib/kundli";

export type ChartPlanet = { short: string; sign: number; retro?: boolean; deg?: number };

/** North Indian chart: houses fixed, signs rotate with lagna */
export function NorthChart({ lagnaSign, planets, title }: { lagnaSign: number; planets: ChartPlanet[]; title?: string }) {
  const S = 400;
  // house label anchor (sign number) & planet block center
  const H: { num: [number, number]; body: [number, number] }[] = [
    { num: [200, 182], body: [200, 105] }, // 1
    { num: [100, 82], body: [100, 38] }, // 2
    { num: [82, 100], body: [38, 100] }, // 3
    { num: [182, 200], body: [105, 200] }, // 4
    { num: [82, 300], body: [38, 300] }, // 5
    { num: [100, 318], body: [100, 362] }, // 6
    { num: [200, 218], body: [200, 295] }, // 7
    { num: [300, 318], body: [300, 362] }, // 8
    { num: [318, 300], body: [362, 300] }, // 9
    { num: [218, 200], body: [295, 200] }, // 10
    { num: [318, 100], body: [362, 100] }, // 11
    { num: [300, 82], body: [300, 38] }, // 12
  ];

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-auto w-full" aria-label={title ?? "North Indian chart"}>
      <title>{title ?? "North Indian chart"}</title>
      <rect x="1" y="1" width={S - 2} height={S - 2} rx="6" fill="#FFFBF4" stroke="#D96200" strokeWidth="2" />
      <g stroke="#D96200" strokeWidth="1.5" fill="none">
        <line x1="0" y1="0" x2={S} y2={S} />
        <line x1={S} y1="0" x2="0" y2={S} />
        <polygon points={`${S / 2},0 ${S},${S / 2} ${S / 2},${S} 0,${S / 2}`} />
      </g>
      {H.map((h, i) => {
        const sign = (lagnaSign + i) % 12;
        const inHouse = planets.filter((p) => p.sign === sign);
        const lineH = 15;
        const startY = h.body[1] - ((inHouse.length - 1) * lineH) / 2;
        return (
          <g key={i}>
            <text x={h.num[0]} y={h.num[1]} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#9A8B7D" fontWeight="600">
              {sign + 1}
            </text>
            {i === 0 && (
              <text x={200} y={140} textAnchor="middle" fontSize="10.5" fill="#D96200" fontWeight="700" letterSpacing="1">
                ASC
              </text>
            )}
            {inHouse.map((p, j) => (
              <text
                key={p.short}
                x={h.body[0]}
                y={startY + j * lineH}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="600"
                fill="#17120E"
              >
                {p.short}
                {p.retro && p.short !== "Ra" && p.short !== "Ke" ? "(R)" : ""}
                {p.deg !== undefined && <tspan fontSize="9.5" fill="#6E6258" fontWeight="400">{` ${Math.floor(p.deg)}°`}</tspan>}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** South Indian chart: signs fixed, lagna marked */
export function SouthChart({ lagnaSign, planets, title }: { lagnaSign: number; planets: ChartPlanet[]; title?: string }) {
  const C = 100;
  // sign -> [col,row]
  const pos: [number, number][] = [
    [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0],
  ];
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full" aria-label={title ?? "South Indian chart"}>
      <title>{title ?? "South Indian chart"}</title>
      <rect x="1" y="1" width="398" height="398" rx="6" fill="#FFFBF4" stroke="#D96200" strokeWidth="2" />
      {pos.map(([c, r], sign) => {
        const x = c * C;
        const y = r * C;
        const inSign = planets.filter((p) => p.sign === sign);
        const isLagna = sign === lagnaSign;
        return (
          <g key={sign}>
            <rect x={x} y={y} width={C} height={C} fill={isLagna ? "#FDEBD6" : "transparent"} stroke="#D96200" strokeWidth="1.2" />
            {isLagna && <line x1={x} y1={y + 22} x2={x + 22} y2={y} stroke="#D96200" strokeWidth="1.5" />}
            <text x={x + C - 6} y={y + 14} textAnchor="end" fontSize="10" fill="#9A8B7D" fontWeight="600">
              {SIGNS[sign].slice(0, 3)}
            </text>
            {isLagna && (
              <text x={x + 6} y={y + C - 8} fontSize="9.5" fill="#D96200" fontWeight="700" letterSpacing="1">
                ASC
              </text>
            )}
            {inSign.map((p, j) => (
              <text
                key={p.short}
                x={x + C / 2}
                y={y + 38 + j * 15 - Math.max(0, inSign.length - 3) * 6}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#17120E"
              >
                {p.short}
                {p.retro && p.short !== "Ra" && p.short !== "Ke" ? "(R)" : ""}
              </text>
            ))}
          </g>
        );
      })}
      <rect x={C} y={C} width={C * 2} height={C * 2} fill="#FBF6EE" stroke="#D96200" strokeWidth="1.2" />
      <image href="/images/mark-solid.png" x={175} y={160} width={50} height={50} opacity="0.9" />
      <text x={200} y={232} textAnchor="middle" fontSize="12" fill="#17120E" fontWeight="600">
        {title ?? "Rasi"}
      </text>
    </svg>
  );
}
