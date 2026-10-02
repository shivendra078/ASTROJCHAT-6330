import { Star, Quote, ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { reviews } from "./data";
import { POSTS, fmtPostDate, readMins } from "../../lib/blog";
import { SectionHead } from "./astrologers";

function ReviewCard({ r }: { r: (typeof reviews)[number] }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col justify-between rounded-[24px] bg-white p-6 ring-1 ring-ink/[.06] md:w-[380px]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-ink/15"}`} />
            ))}
          </div>
          <span className="rounded-full bg-saffron/10 px-2.5 py-1 text-[11px] font-semibold text-saffron">{r.topic}</span>
        </div>
        <blockquote className="mt-4 text-[14.5px] leading-relaxed text-ink/80">"{r.text}"</blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/5 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-gold">
          {r.name[0]}
        </div>
        <div>
          <div className="text-[14px] font-semibold text-ink">{r.name}</div>
          <div className="text-[12px] text-mutedtext">{r.city}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const loop = [...reviews, ...reviews];
  return (
    <section className="overflow-hidden bg-sand py-24 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <SectionHead
          eyebrow="Reviews"
          title={
            <>
              Loved by <em className="font-medium italic text-saffron">3 crore+</em> seekers
            </>
          }
          right={
            <div className="flex items-center gap-5 rounded-[22px] bg-white px-6 py-4 ring-1 ring-ink/[.06]">
              <Quote className="h-8 w-8 fill-saffron text-saffron" />
              <div>
                <div className="font-display text-[34px] font-semibold leading-none text-ink">4.8/5</div>
                <div className="mt-1 text-[12px] text-mutedtext">from 9.2 lakh app reviews</div>
              </div>
            </div>
          }
        />
      </div>
      <div className="group mt-12 flex">
        <div className="marquee flex gap-5 pr-5 group-hover:[animation-play-state:paused]">
          {loop.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Blogs() {
  const latest = [...POSTS].filter((p) => p.featured).sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = latest.slice(0, 3);
  return (
    <section id="blog" className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead
          eyebrow="Astro Journal"
          title={
            <>
              Latest from our <em className="font-medium italic text-saffron">blog</em>
            </>
          }
          right={
            <Link href="/blog" className="group flex items-center gap-2 text-[14px] font-semibold text-ink hover:text-saffron">
              Read all articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Link href={`/blog/${lead.slug}`} aria-label={lead.title} className="group relative block min-h-[420px] overflow-hidden rounded-[28px]">
            <img src={lead.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
              <span className="rounded-full bg-saffron px-3 py-1 text-[11.5px] font-semibold">{lead.category}</span>
              <h3 className="font-display mt-4 max-w-[520px] text-[28px] font-semibold leading-[1.12] md:text-[34px]">{lead.title}</h3>
              <div className="mt-4 flex items-center gap-3 text-[12.5px] text-white/65">
                {fmtPostDate(lead.date)} <span className="h-1 w-1 rounded-full bg-white/40" />
                <Clock className="h-3.5 w-3.5" /> {readMins(lead)} min read
              </div>
            </div>
          </Link>

          <div className="grid gap-5">
            {rest.map((b) => (
              <Link
                key={b.slug}
                href={`/blog/${b.slug}`}
                aria-label={b.title}
                className="group grid grid-cols-[150px_1fr] gap-5 overflow-hidden rounded-[24px] bg-white p-3 ring-1 ring-ink/[.06] transition-shadow hover:shadow-[0_20px_40px_-26px_rgba(23,18,14,.4)] md:grid-cols-[190px_1fr]"
              >
                <div className="overflow-hidden rounded-[18px]">
                  <img src={b.img} alt="" className="h-full min-h-[170px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center py-2 pr-3">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wider text-saffron">{b.category}</span>
                  <h3 className="mt-2 text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-saffron">
                    {b.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-mutedtext">
                    {fmtPostDate(b.date)} · {readMins(b)} min read
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
