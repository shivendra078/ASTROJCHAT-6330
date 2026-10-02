import type { ReactNode } from "react";
import { NorthChart, SouthChart, type ChartPlanet } from "./charts";

export type ChartStyle = "north" | "south";

export function Card({ title, sub, right, children, className = "" }: { title?: string; sub?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] bg-white p-5 ring-1 ring-ink/[.06] md:p-7 ${className}`}>
      {(title || right) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="flex items-center gap-2 text-[16px] font-semibold text-ink">
                <span className="h-2 w-2 shrink-0 rotate-45 bg-saffron" />
                {title}
              </h3>
            )}
            {sub && <p className="mt-1 pl-4 text-[12.5px] text-mutedtext">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function KV({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-ink/[.06]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-4 py-2.5 text-[14px]">
          <dt className="shrink-0 text-mutedtext">{k}</dt>
          <dd className="text-right font-medium text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Toggle<T extends string>({ value, options, onChange, label, dark = false }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string; dark?: boolean }) {
  return (
    <fieldset aria-label={label} className={`inline-flex rounded-full border-0 p-1 ${dark ? "bg-white/10" : "bg-sand"}`}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={`h-9 rounded-full px-4 text-[13px] font-semibold transition-colors ${
            value === o.v ? (dark ? "bg-white text-ink" : "bg-ink text-white") : dark ? "text-white/70 hover:text-white" : "text-ink/60 hover:text-ink"
          }`}
        >
          {o.l}
        </button>
      ))}
    </fieldset>
  );
}

export function StyleToggle({ value, onChange }: { value: ChartStyle; onChange: (v: ChartStyle) => void }) {
  return (
    <Toggle
      label="Chart style"
      value={value}
      onChange={onChange}
      options={[
        { v: "north", l: "North Indian" },
        { v: "south", l: "South Indian" },
      ]}
    />
  );
}

export function Chart({ style, lagnaSign, planets, title }: { style: ChartStyle; lagnaSign: number; planets: ChartPlanet[]; title?: string }) {
  return style === "north" ? <NorthChart lagnaSign={lagnaSign} planets={planets} title={title} /> : <SouthChart lagnaSign={lagnaSign} planets={planets} title={title} />;
}

export function Table({ head, rows, minW = 640, highlight }: { head: string[]; rows: ReactNode[][]; minW?: number; highlight?: (i: number) => boolean }) {
  return (
    <div className="-mx-5 overflow-x-auto md:-mx-7">
      <table className="w-full text-left text-[13.5px]" style={{ minWidth: minW }}>
        <thead>
          <tr className="border-b border-ink/[.07] text-[11.5px] uppercase tracking-[.12em] text-mutedtext">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-3 font-semibold first:pl-5 last:pr-5 md:first:pl-7 md:last:pr-7">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-b border-ink/[.05] last:border-0 ${highlight?.(i) ? "bg-saffron/[.07]" : "even:bg-ivory/60"}`}>
              {r.map((c, j) => (
                <td key={j} className={`whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 md:first:pl-7 md:last:pr-7 ${j === 0 ? "font-semibold text-ink" : "text-ink/80"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const DIG_STYLE: Record<string, string> = {
  Exalted: "bg-green-100 text-green-800",
  "Own sign": "bg-gold/25 text-cocoa",
  Friendly: "bg-sand text-ink/80",
  Neutral: "bg-ink/[.05] text-ink/60",
  Enemy: "bg-red-50 text-red-700",
  Debilitated: "bg-red-100 text-red-800",
};
export function Pill({ children, tone }: { children: ReactNode; tone?: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${DIG_STYLE[tone ?? ""] ?? "bg-sand text-ink/80"}`}>{children}</span>;
}
