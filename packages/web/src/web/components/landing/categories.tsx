import { Heart, HeartPulse, Gem, Briefcase, TrendingUp, Users, ArrowUpRight } from "lucide-react";

const cats = [
  { icon: Heart, name: "Love", q: "Will they come back? Is this the one?", count: "420+ experts" },
  { icon: HeartPulse, name: "Health", q: "Planetary periods & wellbeing remedies", count: "180+ experts" },
  { icon: Gem, name: "Marriage", q: "Kundli matching, delays, muhurat", count: "560+ experts" },
  { icon: Briefcase, name: "Career", q: "Job change, promotion, govt. exams", count: "390+ experts" },
  { icon: TrendingUp, name: "Business", q: "Partnerships, launch dates, growth", count: "240+ experts" },
  { icon: Users, name: "Family", q: "Children, property, harmony at home", count: "310+ experts" },
];

export function Categories() {
  return (
    <section className="grain relative overflow-hidden bg-ink px-5 py-24 text-white md:px-8 md:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-saffron/20 blur-[140px]" />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.18em] text-saffron">
            <span className="h-2 w-2 rotate-45 bg-saffron" /> Categories
          </div>
          <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.06]">
            Find the right <em className="font-medium italic text-gold">category</em> for you
          </h2>
          <p className="mt-5 max-w-[420px] text-[15.5px] leading-relaxed text-white/60">
            Whatever is on your mind, we'll match you with an astrologer who specialises in exactly that question.
          </p>
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
            <img src="/images/mark-solid.png" alt="" className="h-10 w-10" />
            <p className="text-[13.5px] leading-snug text-white/70">
              Not sure where to start? <span className="font-semibold text-white">Ask a free question</span> and we'll route
              it to the best expert.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {cats.map((c, i) => (
            <a
              key={c.name}
              href="#astrologers"
              className={`group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-white/[.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-saffron hover:bg-saffron md:min-h-[230px] md:p-6 ${
                i % 3 === 1 ? "md:translate-y-8 md:hover:translate-y-7" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron/15 transition-colors group-hover:bg-white/20">
                  <c.icon className="h-5 w-5 text-saffron transition-colors group-hover:text-white" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-white/30 transition-all group-hover:rotate-45 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-display text-[26px] font-semibold leading-none md:text-[30px]">{c.name}</h3>
                <p className="mt-2 text-[12.5px] leading-snug text-white/55 transition-colors group-hover:text-white/85">{c.q}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gold transition-colors group-hover:text-white">
                  {c.count}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
