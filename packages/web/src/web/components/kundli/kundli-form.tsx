import { useState } from "react";
import { MapPin, Sparkles, Check } from "lucide-react";
import { searchCities, cityLabel, type City } from "../../lib/cities";
import type { BirthInput } from "../../lib/kundli";

const inputCls =
  "h-12 w-full rounded-xl border border-ink/12 bg-white px-3.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-saffron disabled:opacity-40";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-[12.5px] font-semibold text-ink/65">{children}</span>;
}

export function KundliForm({ onSubmit }: { onSubmit: (b: BirthInput) => void }) {
  const [gender, setGender] = useState<BirthInput["gender"]>("Male");
  const [placeQ, setPlaceQ] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [showSug, setShowSug] = useState(false);
  const [unknownTime, setUnknownTime] = useState(false);
  const [error, setError] = useState("");

  const sugg = searchCities(placeQ);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const dob = String(fd.get("dob") || "");
    const tob = unknownTime ? "12:00" : String(fd.get("tob") || "");
    if (!name) return setError("Please enter a name.");
    if (!dob) return setError("Please select a date of birth.");
    if (!unknownTime && !tob) return setError("Please enter a time of birth, or tick “I don't know”.");
    if (!city) return setError("Please choose a birth place from the suggestions.");
    const y = Number(dob.slice(0, 4));
    if (y < 1900 || y > 2026) return setError("Date of birth must be between 1900 and today.");
    setError("");
    onSubmit({ name, gender, dob, tob, place: cityLabel(city), lat: city.lat, lon: city.lon });
  };

  return (
    <form onSubmit={submit} className="grid gap-4" autoComplete="off">
      <label className="block">
        <Label>Name</Label>
        <input name="name" aria-label="Name" className={inputCls} placeholder="Enter name" maxLength={60} />
      </label>

      <div>
        <Label>Gender</Label>
        <div className="grid grid-cols-3 gap-2">
          {(["Male", "Female", "Other"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`h-12 rounded-xl border text-[14px] font-medium transition-colors ${
                gender === g ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink/75 hover:border-ink/30"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Label>Date of birth</Label>
          <input name="dob" aria-label="Date of birth" type="date" min="1900-01-01" max="2026-10-02" className={inputCls} />
        </label>
        <label className="block">
          <Label>Time of birth</Label>
          <input name="tob" aria-label="Time of birth" type="time" disabled={unknownTime} className={inputCls} />
        </label>
      </div>
      <label className="-mt-1 flex items-center gap-2 text-[13px] text-ink/70">
        <input
          type="checkbox"
          aria-label="Unknown birth time"
          checked={unknownTime}
          onChange={(e) => setUnknownTime(e.target.checked)}
          className="h-4 w-4 accent-saffron"
        />
        I don't know my exact time of birth <span className="text-mutedtext">(we'll use 12:00 PM)</span>
      </label>

      <div className="relative">
        <Label>Birth place</Label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            aria-label="Birth place"
            value={placeQ}
            onChange={(e) => {
              setPlaceQ(e.target.value);
              setCity(null);
              setShowSug(true);
            }}
            onFocus={() => setShowSug(true)}
            onBlur={() => setTimeout(() => setShowSug(false), 150)}
            className={`${inputCls} pl-10 pr-10`}
            placeholder="Start typing a city, e.g. Varanasi"
          />
          {city && <Check className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" />}
        </div>
        {showSug && !city && placeQ && (
          <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_-20px_rgba(23,18,14,.4)] ring-1 ring-ink/10">
            {sugg.length === 0 && <li className="px-4 py-3 text-[13px] text-mutedtext">No matching city in our list yet</li>}
            {sugg.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setCity(c);
                    setPlaceQ(cityLabel(c));
                    setShowSug(false);
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
        {city && (
          <p className="mt-1.5 text-[11.5px] text-mutedtext">
            Lat {city.lat.toFixed(2)}°N · Long {city.lon.toFixed(2)}°E · IST (UTC+5:30)
          </p>
        )}
      </div>

      {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">{error}</p>}

      <button
        type="submit"
        className="mt-1 flex h-[54px] items-center justify-center gap-2 rounded-full bg-saffron text-[15px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(249,122,0,.8)] transition-colors hover:bg-saffron-deep"
      >
        <Sparkles className="h-[18px] w-[18px]" /> Generate Kundli
      </button>
    </form>
  );
}
