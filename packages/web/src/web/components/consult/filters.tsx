import { X, RotateCcw } from "lucide-react";
import { SKILLS, LANGS, TOPICS } from "../landing/data";

export type Filters = {
  skills: string[];
  langs: string[];
  topics: string[];
  gender: string[];
  status: string[];
  maxPrice: number;
  minExp: number;
  offersOnly: boolean;
};

export const PRICE_MAX = 60;

export const emptyFilters: Filters = {
  skills: [],
  langs: [],
  topics: [],
  gender: [],
  status: [],
  maxPrice: PRICE_MAX,
  minExp: 0,
  offersOnly: false,
};

export const countActive = (f: Filters) =>
  f.skills.length +
  f.langs.length +
  f.topics.length +
  f.gender.length +
  f.status.length +
  (f.maxPrice < PRICE_MAX ? 1 : 0) +
  (f.minExp > 0 ? 1 : 0) +
  (f.offersOnly ? 1 : 0);

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-ink/[.07] py-5 last:border-0">
      <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-[.14em] text-ink/55">{title}</h4>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(toggle(value, o))}
            className={`h-8 rounded-full px-3 text-[12.5px] font-medium transition-colors ${
              on ? "bg-ink text-white" : "bg-sand text-ink/75 hover:bg-ink/10"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPanel({
  value,
  onChange,
  onClose,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  onClose?: () => void;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...value, [k]: v });
  const active = countActive(value);

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-[16px] font-semibold text-ink">
          Filters {active > 0 && <span className="ml-1 rounded-full bg-saffron px-2 py-0.5 text-[11px] text-white">{active}</span>}
        </h3>
        <div className="flex items-center gap-3">
          {active > 0 && (
            <button
              type="button"
              onClick={() => onChange(emptyFilters)}
              className="flex items-center gap-1 text-[12.5px] font-semibold text-saffron hover:text-saffron-deep"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
          {onClose && (
            <button type="button" aria-label="Close filters" onClick={onClose} className="text-ink/60 hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <Group title="Availability">
        <Chips options={["Online", "Busy"]} value={value.status} onChange={(v) => set("status", v)} />
      </Group>

      <Group title="Expertise">
        <Chips options={SKILLS} value={value.skills} onChange={(v) => set("skills", v)} />
      </Group>

      <Group title="Consult for">
        <Chips options={TOPICS} value={value.topics} onChange={(v) => set("topics", v)} />
      </Group>

      <Group title="Language">
        <Chips options={LANGS} value={value.langs} onChange={(v) => set("langs", v)} />
      </Group>

      <Group title="Gender">
        <Chips options={["Male", "Female"]} value={value.gender} onChange={(v) => set("gender", v)} />
      </Group>

      <Group title="Price per minute">
        <div className="flex items-center justify-between text-[13px] text-ink/70">
          <span>₹10</span>
          <span className="font-semibold text-ink">Up to ₹{value.maxPrice}</span>
        </div>
        <input
          type="range"
          aria-label="Maximum price per minute"
          min={10}
          max={PRICE_MAX}
          step={5}
          value={value.maxPrice}
          onChange={(e) => set("maxPrice", Number(e.target.value))}
          className="mt-2 w-full accent-saffron"
        />
      </Group>

      <Group title="Experience">
        <Chips
          options={["Any", "5+ yrs", "10+ yrs", "20+ yrs"]}
          value={[value.minExp === 0 ? "Any" : `${value.minExp}+ yrs`]}
          onChange={(v) => {
            const last = v.filter((x) => x !== (value.minExp === 0 ? "Any" : `${value.minExp}+ yrs`))[0];
            if (!last) return;
            set("minExp", last === "Any" ? 0 : Number.parseInt(last, 10));
          }}
        />
      </Group>

      <Group title="Offers">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-[13.5px] text-ink/80">Show discounted astrologers only</span>
          <input
            type="checkbox"
            aria-label="Offers only"
            checked={value.offersOnly}
            onChange={(e) => set("offersOnly", e.target.checked)}
            className="h-4 w-4 accent-saffron"
          />
        </label>
      </Group>
    </div>
  );
}
