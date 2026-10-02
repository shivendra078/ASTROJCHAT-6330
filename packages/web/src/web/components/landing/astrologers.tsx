import { Star, MessageCircle, Phone, ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { astrologers, fmtOrders } from "./data";

const filters = ["All", "Vedic", "Tarot", "Numerology", "Vastu", "Palmistry"];

export function SectionHead({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-[640px]">
        <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.18em] text-saffron">
          <span className="h-2 w-2 rotate-45 bg-saffron" /> {eyebrow}
        </div>
        <h2 className="font-display mt-4 text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.06] text-ink">{title}</h2>
        {sub && <p className="mt-4 text-[15.5px] leading-relaxed text-mutedtext">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Astrologers() {
  const [active, setActive] = useState("All");
  const list = astrologers.filter((a) => active === "All" || a.skills.includes(active)).slice(0, 6);

  return (
    <section id="astrologers" className="px-5 pb-24 pt-24 md:px-8 md:pt-32">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          eyebrow="Top rated"
          title={
            <>
              Talk to India's <em className="font-medium italic text-saffron">most rated</em> astrologers
            </>
          }
          sub="Every astrologer is interviewed, tested and reviewed by our panel before they ever take a consultation."
          right={
            <Link
              href="/chat-with-astrologer"
              className="group hidden h-12 shrink-0 items-center gap-2 rounded-full border border-ink/15 px-6 text-[14px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white md:flex"
            >
              View all astrologers <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`h-10 shrink-0 rounded-full px-5 text-[13.5px] font-medium transition-colors ${
                active === f ? "bg-ink text-white" : "bg-sand text-ink/75 hover:bg-ink/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <article
              key={a.name}
              className="group relative flex gap-4 rounded-[24px] bg-white p-4 ring-1 ring-ink/[.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(23,18,14,.4)] md:p-5"
            >
              <div className="relative shrink-0">
                <Link href={`/astrologer/${a.id}`} aria-label={`View ${a.name}'s profile`} className="block h-[108px] w-[108px] overflow-hidden rounded-[20px] bg-sand">
                  <img src={a.img} alt={a.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-2 ring-white ${
                    a.status === "online" ? "bg-green-600 text-white" : a.status === "busy" ? "bg-red-600 text-white" : "bg-ink/60 text-white"
                  }`}
                >
                  {a.status === "online" ? "● Online" : a.status === "busy" ? `Busy · ${a.wait}m` : "Offline"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex min-w-0 items-center gap-1 text-[16px] font-semibold text-ink">
                    <Link href={`/astrologer/${a.id}`} className="truncate hover:text-saffron">
                      {a.name}
                    </Link>{" "}
                    <BadgeCheck className="h-4 w-4 shrink-0 fill-saffron text-white" />
                  </h3>
                </div>
                <p className="mt-0.5 truncate text-[12.5px] text-mutedtext">{a.skills.join(", ")}</p>
                <p className="truncate text-[12.5px] text-mutedtext">{a.langs.join(", ")}</p>
                <div className="mt-2 flex items-center gap-3 text-[12px] text-ink/70">
                  <span className="flex items-center gap-1 font-semibold text-ink">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {a.rating}
                  </span>
                  <span>{fmtOrders(a.orders)} orders</span>
                  <span>{a.exp} yrs</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[14px] font-semibold text-ink">
                    ₹{a.price}
                    <span className="text-[11.5px] font-normal text-mutedtext">/min</span>
                    {a.oldPrice && <span className="ml-1.5 text-[11.5px] font-normal text-mutedtext line-through">₹{a.oldPrice}</span>}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Link
                      href={`/talk-to-astrologer?with=${a.id}`}
                      aria-label={`Call ${a.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/chat-with-astrologer?with=${a.id}`}
                      className="flex h-9 items-center gap-1.5 rounded-full bg-saffron px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-saffron-deep"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Chat
                    </Link>
                  </div>
                </div>
              </div>

              {a.tag && (
                <span className="absolute -top-2.5 right-5 rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-gold">
                  {a.tag}
                </span>
              )}
            </article>
          ))}
          {list.length === 0 && (
            <p className="col-span-full rounded-2xl bg-sand p-8 text-center text-mutedtext">
              No {active} experts free right now — check back in a few minutes.
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/chat-with-astrologer"
            className="group flex h-[52px] items-center gap-2 rounded-full bg-ink px-8 text-[14.5px] font-semibold text-white transition-colors hover:bg-saffron"
          >
            View all astrologers <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
