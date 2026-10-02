import { useMemo, useState } from "react";
import { Gem, HeartPulse, Briefcase, Heart, User, Sparkles, ShieldAlert, ShieldCheck, Flame, CircleDot } from "lucide-react";
import { Card, Pill, Table, Toggle } from "./ui";
import { birthDateUTC, SIGNS, ASC_TRAITS, MOON_TRAITS, type Kundli } from "../../lib/kundli";
import {
  CAREER,
  DASHA_TEXT,
  dignity,
  fmtDate,
  GEMS,
  HEALTH,
  HOUSE_THEMES,
  houseLord,
  kaalSarp,
  LOVE,
  MANTRAS,
  PHYSICAL,
  PLANET_NATURE,
  RUDRAKSHA,
  runningAt,
  sadeSati,
  tatva,
} from "../../lib/kundli-extra";

type Sub = "general" | "planets" | "remedies" | "dosha";
const ord = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

function Para({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-ink/[.06] py-5 first:pt-0 last:border-0 last:pb-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-saffron/10 text-saffron">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h4 className="text-[15px] font-semibold text-ink">{title}</h4>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">{children}</p>
      </div>
    </div>
  );
}

function General({ k }: { k: Kundli }) {
  const asc = k.ascendant.sign;
  const el = tatva(asc);
  const tenth = (asc + 9) % 12;
  const seventh = (asc + 6) % 12;
  return (
    <Card title="General report" sub={`${SIGNS[asc]} ascendant · ${SIGNS[k.moonSign]} Moon · ${k.nakshatra} nakshatra`}>
      <Para icon={Sparkles} title="Description">
        You were born with {SIGNS[asc]} rising, ruled by {houseLord(k, 1)}. {ASC_TRAITS[asc]}
      </Para>
      <Para icon={User} title="Personality">
        Your Moon sits in {SIGNS[k.moonSign]} in the {ord(k.planets[1].house)} house. {MOON_TRAITS[k.moonSign]} Born under {k.nakshatra}, with {k.avakhada.gana} gana, you carry its
        instincts in the way you react before you think.
      </Para>
      <Para icon={CircleDot} title="Physical">
        {PHYSICAL[el]}
      </Para>
      <Para icon={HeartPulse} title="Health">
        {HEALTH[el]}
      </Para>
      <Para icon={Briefcase} title="Career">
        {CAREER[tatva(tenth)]} The 10th lord is {houseLord(k, 10)}.
      </Para>
      <Para icon={Heart} title="Love & marriage">
        {LOVE[tatva(seventh)]} The 7th lord is {houseLord(k, 7)}.
      </Para>
    </Card>
  );
}

function Planets({ k }: { k: Kundli }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {k.planets.map((p) => {
        const dig = dignity(p.name, p.sign);
        return (
          <div key={p.key} className="rounded-[22px] bg-white p-5 ring-1 ring-ink/[.06]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 rotate-45 items-center justify-center rounded-[9px] bg-ink">
                  <span className="-rotate-45 text-[12px] font-bold text-gold">{p.short}</span>
                </span>
                <div className="ml-1">
                  <div className="text-[15px] font-semibold text-ink">{p.name}</div>
                  <div className="text-[12.5px] text-mutedtext">
                    {SIGNS[p.sign]} · {ord(p.house)} house
                  </div>
                </div>
              </div>
              <Pill tone={dig}>{dig}</Pill>
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink/70">
              {p.name} {PLANET_NATURE[p.name]} — here it works through {HOUSE_THEMES[p.house - 1]}.{" "}
              {dig === "Exalted" || dig === "Own sign"
                ? "It is strong in this sign and gives clear, reliable results."
                : dig === "Debilitated" || dig === "Enemy"
                  ? "It is uncomfortable in this sign, so results come with effort — remedies help."
                  : "It is reasonably placed and gives mixed but workable results."}
              {p.retro && p.key !== "rahu" && p.key !== "ketu" ? " Being retrograde, its lessons repeat until they are learned." : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Remedies({ k }: { k: Kundli }) {
  const now = new Date();
  const maha = runningAt(k.dashas, now);
  const stones = [
    { l: "Life stone", why: `Lord of the Lagna (1st house)`, p: houseLord(k, 1) },
    { l: "Lucky stone", why: `Lord of the 5th house of fortune & intellect`, p: houseLord(k, 5) },
    { l: "Fortune stone", why: `Lord of the 9th house of luck`, p: houseLord(k, 9) },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stones.map((s) => {
          const g = GEMS[s.p];
          return (
            <div key={s.l} className="flex flex-col rounded-[22px] bg-white p-5 ring-1 ring-ink/[.06]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron text-white">
                  <Gem className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[11.5px] font-semibold uppercase tracking-[.14em] text-saffron">{s.l}</div>
                  <div className="font-display text-[22px] font-semibold leading-tight text-ink">{g.gem}</div>
                </div>
              </div>
              <p className="mt-3 text-[12.5px] text-mutedtext">
                {s.why} — {s.p}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-ink/[.06] pt-4 text-[12.5px]">
                {[
                  ["Substitute", g.alt],
                  ["Finger", g.finger],
                  ["Day", g.day],
                  ["Metal", g.metal],
                  ["Weight", g.weight],
                  ["Deity", g.deity],
                ].map(([a, b]) => (
                  <div key={a}>
                    <dt className="text-mutedtext">{a}</dt>
                    <dd className="font-medium text-ink">{b}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card title="Rudraksha suggestion">
          <div className="font-display text-[28px] font-semibold text-ink">{RUDRAKSHA[houseLord(k, 1)]} Rudraksha</div>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
            Linked to {houseLord(k, 1)}, your ascendant lord. Wear it on a Monday after energising it with “Om Namah Shivaya” 108 times, in a red or black thread or set
            in silver.
          </p>
        </Card>
        {maha && (
          <Card title={`Mantra for ${maha.lord} Mahadasha`}>
            <p className="font-display text-[20px] font-medium italic leading-snug text-saffron-deep">“{MANTRAS[maha.lord]}”</p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
              Chant 108 times daily during your running {maha.lord} period (till {fmtDate(maha.end)}). {DASHA_TEXT[maha.lord]}
            </p>
          </Card>
        )}
      </div>
      <p className="text-[12.5px] text-mutedtext">Gemstones are powerful — confirm with an astrologer before wearing one, especially Blue Sapphire.</p>
    </div>
  );
}

function Dosha({ k }: { k: Kundli }) {
  const birth = useMemo(() => birthDateUTC(k.input.dob, k.input.tob), [k.input]);
  const sati = useMemo(() => sadeSati(k.moonSign, birth), [k.moonSign, birth]);
  const ks = kaalSarp(k);
  const mars = k.planets[2];
  const marsStrong = ["Exalted", "Own sign"].includes(dignity("Mars", mars.sign));
  const now = new Date();
  const curSati = sati.find((s) => s.start <= now && now < s.end);
  const nextSati = sati.find((s) => s.kind === "Sade Sati" && s.start > now);
  const [all, setAll] = useState(false);
  const from = Math.max(0, sati.findIndex((s) => s.end > now) - 2);
  const shown = all ? sati : sati.slice(from, from + 10);

  const Status = ({ on, yes, no }: { on: boolean; yes: string; no: string }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-semibold ${on ? "bg-saffron text-white" : "bg-green-100 text-green-800"}`}>
      {on ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />} {on ? yes : no}
    </span>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card title="Manglik dosha" right={<Status on={k.manglik} yes="Present" no="Not present" />}>
          <p className="text-[14px] leading-relaxed text-ink/70">
            Mars is in the {ord(mars.house)} house in {SIGNS[mars.sign]}.{" "}
            {k.manglik
              ? marsStrong
                ? "Dosha is formed, but Mars in its own or exalted sign largely cancels it."
                : "Dosha is formed. Marrying another Manglik, or Mangal Shanti puja and Hanuman Chalisa on Tuesdays, are the usual remedies."
              : "Mangal Dosha is not formed from the Lagna, so no remedy is needed for marriage matching."}
          </p>
        </Card>
        <Card title="Kaal Sarp dosha" right={<Status on={ks.present} yes={ks.type ?? "Present"} no="Not present" />}>
          <p className="text-[14px] leading-relaxed text-ink/70">
            {ks.present
              ? `All seven planets fall on one side of the Rahu–Ketu axis, with Rahu in the ${ord(ks.rahuHouse)} house. Results vary widely; Kaal Sarp puja at Trimbakeshwar and Rahu mantra are traditional remedies.`
              : `Planets are spread on both sides of the Rahu–Ketu axis (Rahu in the ${ord(ks.rahuHouse)} house), so Kaal Sarp dosha is not formed.`}
          </p>
        </Card>
      </div>

      <Card
        title="Sade Sati"
        sub={`Saturn's 7½-year transit over the 12th, 1st and 2nd from your ${SIGNS[k.moonSign]} Moon`}
        right={<Status on={curSati?.kind === "Sade Sati"} yes={`Running · ${curSati?.phase ?? ""}`} no={curSati ? `Dhaiya · ${curSati.phase}` : "Not running"} />}
      >
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-ivory p-4 text-[13.5px] leading-relaxed text-ink/75">
          <Flame className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
          <span>
            {curSati
              ? `${curSati.kind} (${curSati.phase}) is active now, with Saturn in ${SIGNS[curSati.sign]} until ${fmtDate(curSati.end)}. Expect responsibility and slow results; Hanuman Chalisa and Saturday charity help.`
              : nextSati
                ? `No Sade Sati right now. The next phase begins ${fmtDate(nextSati.start)}.`
                : "No Sade Sati in the coming years."}
          </span>
        </div>
        <Table
          minW={560}
          head={["Type", "Phase", "Saturn in", "Start", "End"]}
          highlight={(i) => shown[i] === curSati}
          rows={shown.map((s) => [s.kind, s.phase, SIGNS[s.sign], fmtDate(s.start), fmtDate(s.end)])}
        />
        {sati.length > 10 && (
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            className="mt-4 h-10 rounded-full bg-sand px-5 text-[13px] font-semibold text-ink hover:bg-ink hover:text-white"
          >
            {all ? "Show fewer periods" : `Show all ${sati.length} periods (lifetime)`}
          </button>
        )}
      </Card>
    </div>
  );
}

export function ReportTab({ k }: { k: Kundli }) {
  const [sub, setSub] = useState<Sub>("general");
  return (
    <div className="space-y-5">
      <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <Toggle
          label="Report section"
          value={sub}
          onChange={setSub}
          options={[
            { v: "general", l: "General" },
            { v: "planets", l: "Planetary" },
            { v: "remedies", l: "Remedies" },
            { v: "dosha", l: "Dosha" },
          ]}
        />
      </div>
      {sub === "general" && <General k={k} />}
      {sub === "planets" && <Planets k={k} />}
      {sub === "remedies" && <Remedies k={k} />}
      {sub === "dosha" && <Dosha k={k} />}
    </div>
  );
}
