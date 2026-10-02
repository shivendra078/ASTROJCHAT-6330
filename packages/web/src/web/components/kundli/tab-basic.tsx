import { useMemo } from "react";
import { ShieldAlert, ShieldCheck, Sunrise, Moon } from "lucide-react";
import { Card, KV } from "./ui";
import { fmtDeg, SIGNS, SIGNS_HI, SIGN_LORDS, ASC_TRAITS, MOON_TRAITS, type Kundli } from "../../lib/kundli";
import { avakhadaExtra, fmtDob, fmtIST, fmtTime, sunTimes } from "../../lib/kundli-extra";

export function BasicTab({ k }: { k: Kundli }) {
  const mars = k.planets.find((p) => p.key === "mars")!;
  const sun = useMemo(() => sunTimes(k.input), [k.input]);
  const ex = avakhadaExtra(k);
  const tithi = `${k.paksha} ${k.tithi}`;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <Card title="Basic details">
          <KV
            rows={[
              ["Name", k.input.name],
              ["Gender", k.input.gender],
              ["Date", fmtDob(k.input.dob)],
              ["Time", fmtTime(k.input.tob)],
              ["Place", k.input.place],
              ["Latitude", `${Math.abs(k.input.lat).toFixed(2)}° ${k.input.lat >= 0 ? "N" : "S"}`],
              ["Longitude", `${Math.abs(k.input.lon).toFixed(2)}° ${k.input.lon >= 0 ? "E" : "W"}`],
              ["Timezone", "GMT +5:30 (IST)"],
              ["Sunrise", fmtIST(sun.rise)],
              ["Sunset", fmtIST(sun.set)],
              ["Ayanamsha (Lahiri)", fmtDeg(k.ayanamsa)],
            ]}
          />
        </Card>
        <Card title="Panchang details">
          <KV
            rows={[
              ["Weekday", k.weekday],
              ["Tithi", tithi],
              ["Karan", k.karana],
              ["Yog", k.yoga],
              ["Nakshatra", k.nakshatra],
            ]}
          />
        </Card>
      </div>

      <div className="flex flex-col gap-5">
        <Card title="Avakhada details">
          <KV
            rows={[
              ["Varna", k.avakhada.varna],
              ["Vashya", k.avakhada.vashya],
              ["Yoni", k.avakhada.yoni],
              ["Gan", k.avakhada.gana],
              ["Nadi", k.avakhada.nadi],
              ["Sign", `${SIGNS[k.moonSign]} · ${SIGNS_HI[k.moonSign]}`],
              ["Sign lord", k.avakhada.signLord],
              ["Nakshatra-Charan", `${k.nakshatra} – ${k.pada}`],
              ["Yog", k.yoga],
              ["Karan", k.karana],
              ["Tithi", tithi],
              ["Yunja", ex.yunja],
              ["Tatva", ex.tatva],
              ["Name alphabet", ex.syllable],
              ["Paya", ex.paya],
            ]}
          />
        </Card>
        <div className={`rounded-[24px] p-6 md:p-7 ${k.manglik ? "bg-saffron text-white" : "bg-ink text-white"}`}>
          <div className="flex items-center gap-3">
            {k.manglik ? <ShieldAlert className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7 text-gold" />}
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[.16em] opacity-70">Manglik analysis</div>
              <div className="font-display text-[24px] font-semibold leading-tight">{k.manglik ? "Manglik Dosha present" : "Not Manglik"}</div>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed opacity-80">
            Mars is in house {mars.house} ({SIGNS[mars.sign]}) from your Lagna.{" "}
            {k.manglik
              ? "Mars in the 1st, 2nd, 4th, 7th, 8th or 12th house forms Mangal Dosha. Cancellations exist — see the Free Report tab or ask an astrologer."
              : "Mars is outside the 1st, 2nd, 4th, 7th, 8th and 12th houses, so Mangal Dosha is not formed from the Lagna."}
          </p>
        </div>
      </div>

      <Card className="lg:col-span-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Sunrise className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
            <div>
              <div className="text-[14px] font-semibold text-ink">
                {SIGNS[k.ascendant.sign]} Lagna · lord {SIGN_LORDS[k.ascendant.sign]}
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-mutedtext">{ASC_TRAITS[k.ascendant.sign]}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t border-ink/[.06] pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <Moon className="mt-0.5 h-5 w-5 shrink-0 text-saffron" />
            <div>
              <div className="text-[14px] font-semibold text-ink">
                {SIGNS[k.moonSign]} Moon · {k.nakshatra} nakshatra
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-mutedtext">{MOON_TRAITS[k.moonSign]}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
