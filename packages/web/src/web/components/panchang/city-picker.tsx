import { useState } from "react";
import { MapPin, Check, X } from "lucide-react";
import { cityLabel, searchCities, type City } from "../../lib/cities";

export function CityPicker({
  value,
  onChange,
  className = "",
  inputClassName = "",
}: {
  value: City | null;
  onChange: (c: City | null) => void;
  className?: string;
  inputClassName?: string;
}) {
  const [q, setQ] = useState(value ? cityLabel(value) : "");
  const [open, setOpen] = useState(false);
  const sugg = searchCities(q, 7);

  return (
    <div className={`relative ${className}`}>
      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-saffron" />
      <input
        aria-label="Location"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onChange(null);
          setOpen(true);
        }}
        onFocus={(e) => {
          e.target.select();
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search city, e.g. Varanasi"
        className={`w-full pl-11 pr-10 ${inputClassName}`}
      />
      {value ? (
        <Check className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />
      ) : (
        q && (
          <button
            type="button"
            aria-label="Clear location"
            onClick={() => {
              setQ("");
              setOpen(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )
      )}
      {open && !value && (
        <ul className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-[300px] overflow-y-auto rounded-2xl bg-white py-1 shadow-[0_24px_48px_-20px_rgba(23,18,14,.45)] ring-1 ring-ink/10">
          {sugg.length === 0 && <li className="px-4 py-3 text-[13px] text-mutedtext">No matching city in our list yet</li>}
          {sugg.map((c) => (
            <li key={c.name}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(c);
                  setQ(cityLabel(c));
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-sand"
              >
                <MapPin className="h-4 w-4 shrink-0 text-saffron" />
                <span className="text-[14px] text-ink">
                  {c.name}
                  <span className="text-mutedtext">, {c.state}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
