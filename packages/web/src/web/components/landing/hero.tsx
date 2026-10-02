import { Link } from "wouter";
import { MessageCircle, Phone, Sparkles, ScrollText, ShieldCheck, Star, ArrowRight } from "lucide-react";

const glyphs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

function ZodiacRing() {
  return (
    <svg viewBox="0 0 400 400" className="spin-slow h-full w-full" aria-hidden>
      <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(233,182,92,.35)" strokeWidth="1" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(233,182,92,.25)" strokeWidth="1" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(233,182,92,.15)" strokeWidth="1" strokeDasharray="2 6" />
      {Array.from({ length: 72 }).map((_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const r1 = i % 6 === 0 ? 160 : 186;
        return (
          <line
            key={i}
            x1={200 + Math.cos(a) * r1}
            y1={200 + Math.sin(a) * r1}
            x2={200 + Math.cos(a) * 196}
            y2={200 + Math.sin(a) * 196}
            stroke="rgba(233,182,92,.35)"
            strokeWidth="1"
          />
        );
      })}
      {glyphs.map((g, i) => {
        const a = ((i * 30 + 15 - 90) * Math.PI) / 180;
        return (
          <text
            key={g}
            x={200 + Math.cos(a) * 174}
            y={200 + Math.sin(a) * 174}
            fill="rgba(233,182,92,.75)"
            fontSize="15"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {g + "︎"}
          </text>
        );
      })}
    </svg>
  );
}

export function Hero() {
  return (
    <section className="grain relative overflow-hidden bg-cocoa pb-40 pt-[72px] text-white md:pb-44">
      {/* glow layers */}
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-saffron/25 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[.5]"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, #fff8 50%, transparent 51%), radial-gradient(1px 1px at 70% 15%, #fff6 50%, transparent 51%), radial-gradient(1.5px 1.5px at 40% 80%, #fff5 50%, transparent 51%), radial-gradient(1px 1px at 85% 60%, #fff7 50%, transparent 51%), radial-gradient(1px 1px at 10% 70%, #fff5 50%, transparent 51%), radial-gradient(1px 1px at 55% 45%, #fff4 50%, transparent 51%)",
          backgroundSize: "380px 380px",
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 pt-10 md:px-8 md:pt-16 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div
            className="rise inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-medium text-gold"
            style={{ animationDelay: "0ms" }}
          >
            <ShieldCheck className="h-3.5 w-3.5" /> 2,000+ verified astrologers · 100% private
          </div>

          <h1
            className="rise font-display mt-6 text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.02]"
            style={{ animationDelay: "90ms" }}
          >
            India's most trusted <em className="font-medium italic text-saffron">astrology</em> platform
          </h1>

          <p
            className="rise mt-6 max-w-[520px] text-[16.5px] leading-relaxed text-white/70"
            style={{ animationDelay: "180ms" }}
          >
            Talk to experienced Vedic astrologers, tarot readers and numerologists in your language — on chat or call,
            any hour of the day. Your first consultation is on us.
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "270ms" }}>
            <Link
              href="/chat-with-astrologer"
              className="group flex h-[52px] items-center gap-2 rounded-full bg-saffron px-7 text-[15px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(249,122,0,.8)] transition-all hover:-translate-y-0.5 hover:bg-saffron-deep"
            >
              <MessageCircle className="h-[18px] w-[18px]" /> Chat with Astrologer
            </Link>
            <Link
              href="/talk-to-astrologer"
              className="flex h-[52px] items-center gap-2 rounded-full border border-white/25 px-7 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/5"
            >
              <Phone className="h-[18px] w-[18px]" /> Call Now
            </Link>
          </div>

          <div
            className="rise mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t md:gap-x-10 border-white/10 pt-8"
            style={{ animationDelay: "360ms" }}
          >
            {[
              ["3 Cr+", "Consultations"],
              ["4.8", "Avg. rating"],
              ["12", "Languages"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display flex items-center gap-1.5 text-[26px] font-semibold leading-none md:text-[30px]">
                  {n}
                  {l === "Avg. rating" && <Star className="h-5 w-5 fill-gold text-gold" />}
                </div>
                <div className="mt-1.5 text-[11px] uppercase tracking-[.12em] text-white/50 md:text-[12.5px]">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* visual */}
        <div className="rise relative mx-auto w-full max-w-[460px]" style={{ animationDelay: "200ms" }}>
          <div className="absolute -inset-[18%] opacity-90">
            <ZodiacRing />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[200px_200px_28px_28px] border border-gold/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
            <img src="/images/hero.jpg" alt="Astrologer reading a kundli" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-transparent to-transparent" />
          </div>

          <div className="floaty absolute -left-6 top-[18%] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink shadow-xl md:-left-14">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <div>
              <div className="text-[13px] font-semibold leading-tight">846 astrologers online</div>
              <div className="text-[11.5px] text-mutedtext">Avg. wait under 1 min</div>
            </div>
          </div>

          <div
            className="floaty absolute -right-4 bottom-[14%] w-[210px] rounded-2xl bg-ink/90 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur md:-right-10"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-2 text-[12.5px] leading-snug text-white/85">
              "Felt like talking to someone in the family. Accurate and kind."
            </p>
            <div className="mt-2 text-[11px] text-white/45">— Kavya, Bengaluru</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const actions = [
  { icon: MessageCircle, title: "Chat with Astrologer", desc: "First chat free", cta: "Start chat", href: "/chat-with-astrologer" },
  { icon: Phone, title: "Talk to Astrologer", desc: "Instant call, any hour", cta: "Call now", href: "/talk-to-astrologer" },
  { icon: Sparkles, title: "Daily Horoscope", desc: "Your sign, every morning", cta: "Read today", href: "/#actions" },
  { icon: ScrollText, title: "Free Kundli", desc: "Detailed Vedic birth chart", cta: "Generate", href: "/free-kundli" },
];

export function QuickActions() {
  return (
    <section id="actions" className="relative z-10 -mt-28 px-5 md:px-8">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {actions.map((a, i) => (
          <Link
            key={a.title}
            href={a.href}
            className="rise group relative overflow-hidden rounded-[22px] bg-white p-5 shadow-[0_20px_50px_-24px_rgba(23,18,14,.35)] ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:bg-saffron md:p-7"
            style={{ animationDelay: `${420 + i * 80}ms` }}
          >
            <div className="flex h-12 w-12 rotate-45 items-center justify-center rounded-[10px] bg-saffron/10 transition-colors group-hover:bg-white/20">
              <a.icon className="h-5 w-5 -rotate-45 text-saffron transition-colors group-hover:text-white" />
            </div>
            <h3 className="mt-6 text-[15px] font-semibold leading-tight text-ink transition-colors group-hover:text-white md:text-[17px]">
              {a.title}
            </h3>
            <p className="mt-1 text-[12.5px] text-mutedtext transition-colors group-hover:text-white/80 md:text-[13.5px]">
              {a.desc}
            </p>
            <div className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-saffron transition-colors group-hover:text-white">
              {a.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
