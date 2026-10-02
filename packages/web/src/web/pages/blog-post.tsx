import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, Clock, Eye, CalendarDays, Link2, Check, MessageCircle, Sparkles, ArrowLeft, Lightbulb, Quote, Star } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { PostCard } from "../components/blog/post-card";
import { getPost, authorOf, fmtPostDate, fmtViews, readMins, related, type Block } from "../lib/blog";

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        const k = `${b.t}-${i}`;
        switch (b.t) {
          case "p":
            return (
              <p key={k} className="text-[16.5px] leading-[1.8] text-ink/85 first-of-type:text-[18px] first-of-type:leading-[1.75] first-of-type:text-ink">
                {b.text}
              </p>
            );
          case "h2":
            return (
              <h2 key={k} className="font-display flex items-center gap-3 pt-4 text-[26px] font-semibold leading-tight text-ink md:text-[30px]">
                <span className="h-2.5 w-2.5 shrink-0 rotate-45 bg-saffron" />
                {b.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={k} className="space-y-3 rounded-[22px] bg-white p-6 ring-1 ring-ink/[.06]">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[15.5px] leading-relaxed text-ink/85">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron" />
                    {it}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={k} className="relative border-l-[3px] border-saffron py-2 pl-6 md:pl-8">
                <Quote className="absolute -left-[3px] -top-6 h-5 w-5 text-saffron/50" />
                <p className="font-display text-[22px] font-medium italic leading-snug text-ink md:text-[25px]">{b.text}</p>
              </blockquote>
            );
          case "tip":
            return (
              <aside key={k} className="grain relative overflow-hidden rounded-[22px] bg-cocoa p-6 text-white md:p-7">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-saffron/30 blur-[50px]" />
                <div className="relative flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.16em] text-saffron">
                  <Lightbulb className="h-4 w-4" /> {b.title}
                </div>
                <p className="relative mt-3 text-[15.5px] leading-relaxed text-white/85">{b.text}</p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function CopyLink() {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* clipboard may be blocked inside iframes */
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-semibold text-white ring-1 ring-white/15 hover:bg-white/20"
    >
      {done ? <Check className="h-4 w-4 text-green-400" /> : <Link2 className="h-4 w-4" />}
      {done ? "Link copied" : "Copy link"}
    </button>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />
      <main className="mx-auto flex max-w-[640px] flex-col items-center px-5 pb-24 pt-[160px] text-center">
        <span className="h-4 w-4 rotate-45 bg-saffron" />
        <h1 className="font-display mt-6 text-[36px] font-semibold text-ink">Article not found</h1>
        <p className="mt-3 text-[15px] text-mutedtext">This article may have moved or the link is mistyped.</p>
        <Link href="/blog" className="mt-7 flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white hover:bg-saffron">
          <ArrowLeft className="h-4 w-4" /> Back to the blog
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? "");

  useEffect(() => {
    document.title = post ? `${post.title} — Astroj Chat` : "Article not found — Astroj Chat";
    window.scrollTo(0, 0);
  }, [slug, post]);

  if (!post) return <NotFound />;

  const a = authorOf(post);
  const more = related(post, 3);
  const hindi = post.lang === "Hindi";

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      <section className="grain relative overflow-hidden bg-cocoa pb-[140px] pt-[72px] text-white md:pb-[180px]">
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        <div className="relative mx-auto max-w-[880px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-saffron">
              Blog
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-saffron">
              {post.category}
            </Link>
          </nav>

          <div className="rise mt-6 flex flex-wrap items-center gap-2">
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="rounded-full bg-saffron px-3 py-1 text-[12px] font-semibold text-white">
              {post.category}
            </Link>
            {hindi && <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">हिंदी</span>}
          </div>
          <h1
            lang={hindi ? "hi" : "en"}
            className="rise font-display mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.08]"
            style={{ animationDelay: "80ms" }}
          >
            {post.title}
          </h1>
          <p lang={hindi ? "hi" : "en"} className="rise mt-5 max-w-[700px] text-[16.5px] leading-relaxed text-white/70" style={{ animationDelay: "140ms" }}>
            {post.excerpt}
          </p>

          <div className="rise mt-8 flex flex-wrap items-center justify-between gap-5" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3">
              <img src={a.img} alt={a.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-saffron/60" />
              <div>
                <div className="text-[14.5px] font-semibold">{a.name}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-white/60">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> {fmtPostDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {readMins(post)} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {fmtViews(post.views)} reads
                  </span>
                </div>
              </div>
            </div>
            <CopyLink />
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-[110px] max-w-[1040px] px-5 md:-mt-[150px] md:px-8">
        <div className="overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgba(23,18,14,.6)]">
          <img src={post.img} alt="" className="aspect-[16/9] w-full object-cover md:aspect-[2/1]" />
        </div>
      </div>

      <main className="mx-auto grid max-w-[1040px] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[1fr_260px]">
        <article lang={hindi ? "hi" : "en"} className="min-w-0 max-w-[680px]">
          <Body blocks={post.body} />

          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink/[.08] pt-6">
            <span className="mr-1 text-[12.5px] font-semibold uppercase tracking-[.14em] text-mutedtext">Topics</span>
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tags=${encodeURIComponent(t)}`}
                className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink/80 ring-1 ring-ink/10 hover:text-saffron hover:ring-saffron/50"
              >
                #{t}
              </Link>
            ))}
          </div>

          {/* author box */}
          <div className="mt-8 flex flex-col gap-5 rounded-[24px] bg-white p-6 ring-1 ring-ink/[.06] sm:flex-row sm:items-center">
            <Link href={`/astrologer/${a.id}`} aria-label={`View ${a.name}'s profile`} className="shrink-0">
              <img src={a.img} alt={a.name} className="h-20 w-20 rounded-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] font-semibold uppercase tracking-[.14em] text-saffron">Written by</div>
              <Link href={`/astrologer/${a.id}`} className="mt-1 block text-[18px] font-semibold text-ink hover:text-saffron">
                {a.name}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[12.5px] text-mutedtext">
                <span>{a.skills.join(" · ")}</span>
                <span>{a.exp} yrs exp</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {a.rating}
                </span>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">{a.bio}</p>
            </div>
            <Link
              href={`/chat-with-astrologer?with=${a.id}`}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-saffron px-5 text-[13.5px] font-semibold text-white hover:bg-saffron-deep"
            >
              <MessageCircle className="h-4 w-4" /> Chat with {a.name.replace(/^(Acharya|Pt\.|Swami|Dr\.)\s+/, "").split(" ")[0]}
            </Link>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-[96px] space-y-4">
            <div className="grain relative overflow-hidden rounded-[22px] bg-cocoa p-6 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saffron/30 blur-[60px]" />
              <h3 className="font-display relative text-[21px] font-semibold leading-tight">How does this apply to your chart?</h3>
              <p className="relative mt-2 text-[13px] leading-relaxed text-white/65">Ask {a.name} directly. Your first chat is free.</p>
              <Link
                href={`/chat-with-astrologer?with=${a.id}`}
                className="relative mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-saffron text-[13.5px] font-semibold text-white hover:bg-saffron-deep"
              >
                <MessageCircle className="h-4 w-4" /> Start free chat
              </Link>
            </div>
            <Link href="/free-kundli" className="group block rounded-[22px] bg-white p-5 ring-1 ring-ink/[.06] hover:ring-saffron/40">
              <Sparkles className="h-5 w-5 text-saffron" />
              <div className="mt-3 text-[15px] font-semibold text-ink group-hover:text-saffron">Get your free Kundli</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-mutedtext">Lagna, planets, dasha and charts in under a minute.</p>
            </Link>
            <Link href="/panchang" className="group block rounded-[22px] bg-white p-5 ring-1 ring-ink/[.06] hover:ring-saffron/40">
              <CalendarDays className="h-5 w-5 text-saffron" />
              <div className="mt-3 text-[15px] font-semibold text-ink group-hover:text-saffron">Today’s Panchang</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-mutedtext">Tithi, nakshatra, Rahu Kaal and muhurat.</p>
            </Link>
          </div>
        </aside>
      </main>

      {more.length > 0 && (
        <section className="border-t border-ink/[.06] bg-sand/50 py-14 md:py-16">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[30px] font-semibold text-ink md:text-[36px]">
                Keep <em className="font-medium italic text-saffron">reading</em>
              </h2>
              <Link href="/blog" className="text-[14px] font-semibold text-ink underline-offset-4 hover:text-saffron hover:underline">
                All articles →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
