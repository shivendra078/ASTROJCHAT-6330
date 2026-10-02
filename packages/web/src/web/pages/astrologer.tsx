import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ChevronRight,
  BadgeCheck,
  Star,
  MessageCircle,
  Phone,
  Languages,
  Sparkles,
  Briefcase,
  MessagesSquare,
  Repeat,
  Heart,
  Share2,
  Check,
  ShieldCheck,
  Zap,
  Wallet,
  Gift,
  ChevronDown,
  GraduationCap,
  CalendarClock,
  ThumbsUp,
  PenLine,
  Trash2,
  Clock,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { IntakeModal } from "../components/consult/intake-modal";
import type { Mode } from "../components/consult/consult-card";
import { fmtOrders, type Astrologer } from "../components/landing/data";
import { PostCard } from "../components/blog/post-card";
import { POSTS } from "../lib/blog";
import { useAccount, openLogin, inr } from "../lib/account";
import {
  getAstrologer,
  getProfile,
  similarTo,
  useMyReviews,
  addReview,
  deleteReview,
  useFollowing,
  toggleFollow,
  fmtReviewDate,
  fmtCount,
  type Review,
} from "../lib/astro-profile";

const statusRing = (a: Astrologer) => (a.status === "online" ? "bg-green-500" : a.status === "busy" ? "bg-red-500" : "bg-ink/15");
const firstName = (n: string) => n.replace(/^(Acharya|Pt\.|Swami|Dr\.)\s+/, "").split(" ")[0];

function Stars({ n, size = "h-4 w-4" }: { n: number; size?: string }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} ${i < Math.round(n) ? "fill-gold text-gold" : "fill-ink/10 text-ink/10"}`} />
      ))}
    </span>
  );
}

function Section({ title, children, right, id }: { title: React.ReactNode; children: React.ReactNode; right?: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-[96px] rounded-[26px] bg-white p-6 ring-1 ring-ink/[.06] md:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display flex items-center gap-2.5 text-[22px] font-semibold text-ink md:text-[24px]">
          <span className="h-2 w-2 rotate-45 bg-saffron" />
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function ActionButtons({ a, onStart, size = "md" }: { a: Astrologer; onStart: (m: Mode) => void; size?: "md" | "lg" }) {
  const h = size === "lg" ? "h-12 text-[14.5px]" : "h-11 text-[14px]";
  if (a.status === "offline")
    return (
      <div className="grid gap-2.5">
        <button type="button" onClick={() => onStart("chat")} className={`flex ${h} items-center justify-center gap-2 rounded-full bg-ink px-6 font-semibold text-white hover:bg-saffron`}>
          <Bell className="h-4 w-4" /> Notify me when online
        </button>
      </div>
    );
  const busy = a.status === "busy";
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={() => onStart("chat")}
        className={`flex ${h} items-center justify-center gap-2 rounded-full px-4 font-semibold transition-colors ${
          busy ? "border border-red-500 text-red-600 hover:bg-red-50" : "bg-saffron text-white hover:bg-saffron-deep"
        }`}
      >
        <MessageCircle className="h-4 w-4" /> {busy ? "Wait to chat" : "Chat now"}
      </button>
      <button
        type="button"
        onClick={() => onStart("call")}
        className={`flex ${h} items-center justify-center gap-2 rounded-full border px-4 font-semibold transition-colors ${
          busy ? "border-red-500 text-red-600 hover:bg-red-50" : "border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white"
        }`}
      >
        <Phone className="h-4 w-4" /> {busy ? "Wait to call" : "Call now"}
      </button>
    </div>
  );
}

function StatusLine({ a }: { a: Astrologer }) {
  if (a.status === "online") return <span className="font-semibold text-green-700">● Online now</span>;
  if (a.status === "busy")
    return (
      <span className="flex items-center gap-1 font-semibold text-red-600">
        <Clock className="h-3.5 w-3.5" /> Busy · wait ~{a.wait} min
      </span>
    );
  return <span className="text-mutedtext">Offline · usually back by 7 PM</span>;
}

function ReviewItem({ r, astroName, onDelete }: { r: Review; astroName: string; onDelete?: () => void }) {
  const [voted, setVoted] = useState(false);
  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${r.mine ? "bg-saffron text-white" : "bg-sand text-ink/70"}`}>
          {r.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div className="text-[14px] font-semibold text-ink">
              {r.name}
              {r.mine && <span className="ml-2 rounded-full bg-saffron/10 px-2 py-0.5 text-[10.5px] font-semibold text-saffron-deep">Your review</span>}
              {r.city && <span className="ml-1.5 font-normal text-mutedtext">· {r.city}</span>}
            </div>
            <span className="text-[12px] text-mutedtext">{fmtReviewDate(r.date)}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Stars n={r.rating} size="h-3.5 w-3.5" />
            {r.topic && <span className="rounded-full bg-ivory px-2 py-0.5 text-[11px] font-medium text-ink/60 ring-1 ring-ink/[.07]">{r.topic}</span>}
          </div>
          {r.text && <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{r.text}</p>}
          {r.reply && (
            <div className="mt-3 rounded-2xl bg-ivory px-4 py-3 text-[13px] leading-relaxed text-ink/75">
              <span className="font-semibold text-ink">Reply from {astroName}:</span> {r.reply}
            </div>
          )}
          <div className="mt-2.5 flex items-center gap-4">
            {r.mine ? (
              <button type="button" onClick={onDelete} className="flex items-center gap-1.5 text-[12px] font-semibold text-ink/50 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            ) : (
              <button
                type="button"
                aria-pressed={voted}
                onClick={() => setVoted((v) => !v)}
                className={`flex items-center gap-1.5 text-[12px] font-semibold ${voted ? "text-saffron" : "text-ink/50 hover:text-ink"}`}
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${voted ? "fill-saffron" : ""}`} /> Helpful · {r.helpful + (voted ? 1 : 0)}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function ReviewForm({ a, onDone }: { a: Astrologer; onDone: () => void }) {
  const { user } = useAccount();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [topic, setTopic] = useState(a.topics[0]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  if (!user) return null;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!rating) return setErr("Tap a star to rate your consultation.");
        if (text.trim().length < 10) return setErr("Write at least 10 characters.");
        addReview(a.id, { name: user.name, rating, text: text.trim(), topic });
        onDone();
      }}
      className="mb-6 rounded-[22px] bg-ivory p-5 ring-1 ring-ink/[.07]"
    >
      <fieldset>
        <legend className="text-[13px] font-semibold text-ink">Rate your consultation with {firstName(a.name)}</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => {
                setRating(n);
                setErr("");
              }}
              className="p-0.5"
            >
              <Star className={`h-7 w-7 transition-colors ${n <= (hover || rating) ? "fill-gold text-gold" : "fill-ink/10 text-ink/15"}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr]">
        <select
          aria-label="Consultation topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-11 rounded-xl border border-ink/12 bg-white px-3 text-[13.5px] text-ink outline-none focus:border-saffron"
        >
          {a.topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <textarea
          aria-label="Your review"
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, 400));
            setErr("");
          }}
          rows={3}
          placeholder="How was your experience? What helped?"
          className="min-h-[44px] rounded-xl border border-ink/12 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink/35 focus:border-saffron"
        />
      </div>
      {err && <p className="mt-2 text-[12.5px] text-red-600">{err}</p>}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[11.5px] text-mutedtext">{text.length}/400 · posting as {user.name}</span>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="h-10 rounded-full px-4 text-[13px] font-semibold text-ink/60 hover:text-ink">
            Cancel
          </button>
          <button type="submit" className="h-10 rounded-full bg-saffron px-5 text-[13px] font-semibold text-white hover:bg-saffron-deep">
            Post review
          </button>
        </div>
      </div>
    </form>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />
      <main className="mx-auto flex max-w-[640px] flex-col items-center px-5 pb-24 pt-[160px] text-center">
        <span className="h-4 w-4 rotate-45 bg-saffron" />
        <h1 className="font-display mt-6 text-[36px] font-semibold text-ink">Astrologer not found</h1>
        <p className="mt-3 text-[15px] text-mutedtext">This profile may have been removed or the link is mistyped.</p>
        <Link href="/chat-with-astrologer" className="mt-7 flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white hover:bg-saffron">
          <ArrowLeft className="h-4 w-4" /> Browse astrologers
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default function AstrologerPage() {
  const { id } = useParams<{ id: string }>();
  const a = getAstrologer(id ?? "");
  if (!a) return <NotFound />;
  return <Profile key={a.id} a={a} />;
}

function Profile({ a }: { a: Astrologer }) {
  const p = getProfile(a);
  const { user, wallet } = useAccount();
  const mine = useMyReviews(a.id);
  const following = useFollowing(a.id);
  const [mode, setMode] = useState<Mode | null>(null);
  const [more, setMore] = useState(false);
  const [sort, setSort] = useState<"helpful" | "recent">("helpful");
  const [starF, setStarF] = useState(0);
  const [shown, setShown] = useState(5);
  const [writing, setWriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const first = firstName(a.name);
  const discount = a.oldPrice ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0;
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon = 0
  const articles = POSTS.filter((x) => x.author === a.id).slice(0, 2);
  const similar = similarTo(a, 4);

  useEffect(() => {
    document.title = `${a.name} — ${a.skills[0]} Astrologer | Astroj Chat`;
    window.scrollTo(0, 0);
  }, [a]);

  const reviews = useMemo(() => {
    const all = [...mine, ...p.reviews].filter((r) => !starF || r.rating === starF);
    return all.sort((x, y) => (x.mine !== y.mine ? (x.mine ? -1 : 1) : sort === "recent" ? y.date.localeCompare(x.date) : y.helpful - x.helpful));
  }, [mine, p.reviews, sort, starF]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: a.name, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      /* dismissed */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const stats = [
    { icon: Briefcase, v: `${a.exp} yrs`, k: "Experience" },
    { icon: MessagesSquare, v: `${fmtOrders(a.orders)}+`, k: "Consultations" },
    { icon: Star, v: a.rating.toFixed(1), k: "Rating" },
    { icon: Repeat, v: `${p.repeatPct}%`, k: "Repeat clients" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      <section className="grain relative overflow-hidden bg-cocoa pb-[150px] pt-[72px] text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/chat-with-astrologer" className="hover:text-saffron">
              Astrologers
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">{a.name}</span>
          </nav>
        </div>
      </section>

      <div className="relative mx-auto -mt-[118px] max-w-[1240px] px-5 md:px-8">
        {/* profile card */}
        <div className="rise relative rounded-[30px] bg-white p-5 shadow-[0_40px_80px_-44px_rgba(23,18,14,.6)] ring-1 ring-ink/[.06] md:p-8">
          <div className="pointer-events-none absolute right-8 top-8 hidden h-16 w-16 rotate-45 rounded-[14px] bg-saffron/[.07] md:block" />
          <div className="absolute right-4 top-4 flex gap-2 md:right-6 md:top-6">
            <button
              type="button"
              aria-pressed={following}
              aria-label={following ? `Unfollow ${a.name}` : `Follow ${a.name}`}
              onClick={() => (user ? toggleFollow(a.id) : openLogin())}
              className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                following ? "bg-saffron/10 text-saffron-deep" : "border border-ink/12 text-ink hover:border-saffron hover:text-saffron"
              }`}
            >
              <Heart className={`h-4 w-4 ${following ? "fill-saffron text-saffron" : ""}`} />
              <span className="hidden sm:inline">{following ? "Following" : "Follow"}</span>
            </button>
            <button type="button" aria-label="Share profile" onClick={share} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink hover:border-saffron hover:text-saffron">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="relative w-fit shrink-0">
              <div className={`h-[132px] w-[132px] rounded-full p-[4px] md:h-[156px] md:w-[156px] ${statusRing(a)}`}>
                <img src={a.img} alt={a.name} className="h-full w-full rounded-full border-4 border-white object-cover" />
              </div>
              <span
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white ring-2 ring-white ${
                  a.status === "online" ? "bg-green-600" : a.status === "busy" ? "bg-red-600" : "bg-ink/60"
                }`}
              >
                {a.status === "online" ? "● Online" : a.status === "busy" ? `Busy · ${a.wait}m` : "Offline"}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              {a.tag && <span className="mb-2 inline-block rounded-full bg-ink px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-gold">{a.tag}</span>}
              <h1 className="font-display text-[32px] font-semibold leading-tight text-ink md:pr-28 md:text-[40px]">
                {a.name}
                <BadgeCheck className="ml-2 inline-block h-7 w-7 -translate-y-0.5 fill-saffron align-middle text-white" aria-label="Verified" />
              </h1>
              <dl className="mt-3 space-y-2 text-[14px]">
                <div className="flex gap-3">
                  <dt className="flex w-[92px] shrink-0 items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[.12em] text-mutedtext">
                    <Sparkles className="h-3.5 w-3.5 text-saffron" /> Expertise
                  </dt>
                  <dd className="text-ink">{a.skills.join(" · ")}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="flex w-[92px] shrink-0 items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[.12em] text-mutedtext">
                    <Languages className="h-3.5 w-3.5 text-saffron" /> Speaks
                  </dt>
                  <dd className="text-ink">{a.langs.join(", ")}</dd>
                </div>
              </dl>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px]">
                <StatusLine a={a} />
                <span className="text-mutedtext">· {fmtCount(p.followers)} followers</span>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-2">
                  {a.oldPrice && <span className="text-[14px] text-mutedtext line-through">₹{a.oldPrice}</span>}
                  <span className="text-[28px] font-semibold text-ink">₹{a.price}</span>
                  <span className="text-[13px] text-mutedtext">/min</span>
                  {discount > 0 && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11.5px] font-semibold text-green-700">{discount}% off</span>}
                </div>
                <div className="w-full sm:w-[340px]">
                  <ActionButtons a={a} onStart={setMode} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-y-5 border-t border-dashed border-ink/15 pt-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.k} className={`flex flex-col items-center text-center ${i % 2 === 1 ? "border-l border-ink/[.07]" : ""} ${i === 2 ? "md:border-l" : ""}`}>
                <s.icon className="h-5 w-5 text-saffron" />
                <div className="mt-2 text-[22px] font-semibold text-ink">{s.v}</div>
                <div className="text-[12.5px] text-mutedtext">{s.k}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-6">
            <Section title={`About ${first}`}>
              <div className={`relative space-y-3 overflow-hidden text-[15px] leading-[1.75] text-ink/80 ${more ? "" : "max-h-[110px]"}`}>
                {p.about.map((t) => (
                  <p key={t.slice(0, 20)}>{t}</p>
                ))}
                {!more && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />}
              </div>
              <button type="button" aria-expanded={more} onClick={() => setMore((m) => !m)} className="mt-2 flex items-center gap-1 text-[13.5px] font-semibold text-saffron hover:underline">
                {more ? "Read less" : "Read more"} <ChevronDown className={`h-4 w-4 transition-transform ${more ? "rotate-180" : ""}`} />
              </button>
            </Section>

            <Section title="Areas of expertise">
              <div className="flex flex-wrap gap-2">
                {p.expertise.map((e) => (
                  <span key={e} className="flex items-center gap-1.5 rounded-full bg-ivory px-3.5 py-2 text-[13px] font-medium text-ink ring-1 ring-ink/[.08]">
                    <span className="h-1.5 w-1.5 rotate-45 bg-saffron" />
                    {e}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <div className="text-[12px] font-semibold uppercase tracking-[.14em] text-mutedtext">What clients ask {first} about</div>
                <div className="mt-3 space-y-3">
                  {p.focus.map((f) => (
                    <div key={f.topic} className="grid grid-cols-[90px_1fr_40px] items-center gap-3 text-[13.5px]">
                      <span className="font-medium text-ink">{f.topic}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-sand">
                        <span className="block h-full rounded-full bg-gradient-to-r from-saffron to-gold" style={{ width: `${f.pct}%` }} />
                      </span>
                      <span className="text-right text-mutedtext">{f.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <div className="grid gap-6 md:grid-cols-2">
              <Section title="Training">
                <ul className="space-y-4">
                  {p.education.map((e) => (
                    <li key={e.title} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saffron/10">
                        <GraduationCap className="h-5 w-5 text-saffron" />
                      </span>
                      <div>
                        <div className="text-[14px] font-semibold text-ink">{e.title}</div>
                        <div className="text-[12.5px] text-mutedtext">{e.sub}</div>
                      </div>
                    </li>
                  ))}
                  <li className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                      <ShieldCheck className="h-5 w-5 text-green-700" />
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-ink">Verified by Astroj</div>
                      <div className="text-[12.5px] text-mutedtext">ID, credentials & 3-round interview</div>
                    </div>
                  </li>
                </ul>
              </Section>
              <Section title="Availability">
                <ul className="space-y-1">
                  {p.schedule.map((s, i) => (
                    <li
                      key={s.day}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13.5px] ${i === todayIdx ? "bg-saffron/10 font-semibold text-ink" : "text-ink/75"}`}
                    >
                      <span className="flex items-center gap-2">
                        {i === todayIdx && <CalendarClock className="h-4 w-4 text-saffron" />}
                        {s.day}
                        {i === todayIdx && <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron">Today</span>}
                      </span>
                      <span className={s.slots === "Unavailable" ? "text-mutedtext" : ""}>{s.slots}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11.5px] text-mutedtext">All times IST.</p>
              </Section>
            </div>

            <Section
              id="reviews"
              title="Reviews"
              right={
                <button
                  type="button"
                  onClick={() => (user ? setWriting(true) : openLogin())}
                  className="flex h-10 items-center gap-2 rounded-full border border-ink/12 px-4 text-[13px] font-semibold text-ink hover:border-saffron hover:text-saffron"
                >
                  <PenLine className="h-4 w-4" /> Write a review
                </button>
              }
            >
              <div className="grid gap-6 rounded-[22px] bg-ivory p-5 sm:grid-cols-[170px_1fr] sm:items-center">
                <div className="text-center sm:border-r sm:border-ink/[.08] sm:pr-6">
                  <div className="font-display text-[52px] font-semibold leading-none text-ink">{a.rating.toFixed(1)}</div>
                  <div className="mt-2 flex justify-center">
                    <Stars n={a.rating} />
                  </div>
                  <div className="mt-1.5 text-[12.5px] text-mutedtext">{fmtCount(p.reviewCount + mine.length)} reviews</div>
                </div>
                <div className="space-y-1.5">
                  {p.dist.map((pct, i) => {
                    const star = 5 - i;
                    const on = starF === star;
                    return (
                      <button
                        key={star}
                        type="button"
                        aria-pressed={on}
                        aria-label={`Show ${star}-star reviews`}
                        onClick={() => {
                          setStarF(on ? 0 : star);
                          setShown(5);
                        }}
                        className={`grid w-full grid-cols-[34px_1fr_40px] items-center gap-3 rounded-lg px-1.5 py-1 text-[12.5px] ${on ? "bg-white ring-1 ring-saffron/40" : "hover:bg-white/70"}`}
                      >
                        <span className="flex items-center gap-0.5 font-semibold text-ink">
                          {star} <Star className="h-3 w-3 fill-gold text-gold" />
                        </span>
                        <span className="h-2 overflow-hidden rounded-full bg-ink/[.07]">
                          <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="text-right text-mutedtext">{pct}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-5 mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[13px] text-mutedtext">
                  {starF ? `Showing ${starF}-star reviews` : sort === "recent" ? "Newest first" : "Most helpful first"}
                  {starF > 0 && (
                    <button type="button" onClick={() => setStarF(0)} className="ml-2 font-semibold text-saffron hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex rounded-full bg-ivory p-1 ring-1 ring-ink/[.07]">
                  {(
                    [
                      ["helpful", "Most helpful"],
                      ["recent", "Recent"],
                    ] as const
                  ).map(([k, l]) => (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={sort === k}
                      onClick={() => setSort(k)}
                      className={`h-8 rounded-full px-3.5 text-[12.5px] font-semibold ${sort === k ? "bg-ink text-white" : "text-ink/60 hover:text-ink"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {writing && <ReviewForm a={a} onDone={() => setWriting(false)} />}

              {reviews.length === 0 ? (
                <p className="py-8 text-center text-[13.5px] text-mutedtext">No {starF}-star reviews yet.</p>
              ) : (
                <ul className="divide-y divide-ink/[.06]">
                  {reviews.slice(0, shown).map((r) => (
                    <ReviewItem key={r.id} r={r} astroName={first} onDelete={r.mine ? () => deleteReview(a.id, r.id) : undefined} />
                  ))}
                </ul>
              )}
              {shown < reviews.length && (
                <div className="mt-6 flex justify-center">
                  <button type="button" onClick={() => setShown((s) => s + 5)} className="h-11 rounded-full border border-ink/15 px-6 text-[13.5px] font-semibold text-ink hover:border-ink">
                    View more reviews
                  </button>
                </div>
              )}
            </Section>

            {articles.length > 0 && (
              <Section
                title={`Articles by ${first}`}
                right={
                  <Link href="/blog" className="text-[13px] font-semibold text-saffron hover:underline">
                    All articles →
                  </Link>
                }
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {articles.map((x) => (
                    <PostCard key={x.slug} p={x} />
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* sticky consult panel */}
          <aside className="hidden lg:block">
            <div className="sticky top-[96px] space-y-4">
              <div className="overflow-hidden rounded-[26px] bg-white ring-1 ring-ink/[.06]">
                <div className="grain relative overflow-hidden bg-cocoa px-6 py-5 text-center text-white">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-saffron/35 blur-[50px]" />
                  <div className="relative text-[12px] font-semibold uppercase tracking-[.16em] text-white/55">Consult {first}</div>
                  <div className="relative mt-1 flex items-baseline justify-center gap-1.5">
                    {a.oldPrice && <span className="text-[13px] text-white/45 line-through">₹{a.oldPrice}</span>}
                    <span className="text-[30px] font-semibold">₹{a.price}</span>
                    <span className="text-[13px] text-white/55">/min</span>
                  </div>
                  <div className="relative mt-1 text-[12.5px]">
                    {a.status === "online" ? <span className="text-green-400">● Online now</span> : a.status === "busy" ? <span className="text-red-300">Busy · wait ~{a.wait} min</span> : <span className="text-white/55">Offline</span>}
                  </div>
                </div>
                <div className="p-5">
                  <ActionButtons a={a} onStart={setMode} size="lg" />
                  <ul className="mt-5 space-y-2.5 text-[13px] text-ink/75">
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-green-700" /> Verified astrologer
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap className="h-4 w-4 text-saffron" /> Avg. connect under {p.avgConnect}s
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Gift className="h-4 w-4 text-saffron" /> First chat free for new users
                    </li>
                  </ul>
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-ivory px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Wallet className="h-4 w-4 text-saffron" />
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-mutedtext">Wallet balance</div>
                        <div className="text-[14.5px] font-semibold text-ink">{inr(user ? wallet.balance : 0)}</div>
                      </div>
                    </div>
                    <Link
                      href="/wallet-recharge"
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          openLogin("/wallet-recharge");
                        }
                      }}
                      className="text-[12.5px] font-semibold text-saffron hover:underline"
                    >
                      Recharge
                    </Link>
                  </div>
                  {user && wallet.balance > 0 && (
                    <p className="mt-2 text-center text-[11.5px] text-mutedtext">≈ {Math.floor(wallet.balance / a.price)} min with {first}</p>
                  )}
                </div>
              </div>
              <a href="#reviews" className="flex items-center justify-between rounded-[22px] bg-white px-5 py-4 ring-1 ring-ink/[.06] hover:ring-saffron/40">
                <span className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                  <Star className="h-4 w-4 fill-gold text-gold" /> {a.rating.toFixed(1)} · {fmtCount(p.reviewCount + mine.length)} reviews
                </span>
                <ChevronRight className="h-4 w-4 text-ink/40" />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* similar */}
      <section className="border-t border-ink/[.06] bg-sand/50 py-14">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[30px] font-semibold text-ink md:text-[34px]">
              Similar <em className="font-medium italic text-saffron">astrologers</em>
            </h2>
            <Link href="/chat-with-astrologer" className="text-[14px] font-semibold text-ink underline-offset-4 hover:text-saffron hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((s) => (
              <Link
                key={s.id}
                href={`/astrologer/${s.id}`}
                className="group flex flex-col items-center rounded-[24px] bg-white p-5 text-center ring-1 ring-ink/[.06] transition-shadow hover:shadow-[0_22px_44px_-28px_rgba(23,18,14,.45)]"
              >
                <div className={`h-[84px] w-[84px] rounded-full p-[3px] ${statusRing(s)}`}>
                  <img src={s.img} alt="" className="h-full w-full rounded-full border-2 border-white object-cover" />
                </div>
                <div className="mt-3 flex items-center gap-1 text-[14.5px] font-semibold text-ink group-hover:text-saffron">
                  <span className="line-clamp-1">{s.name}</span>
                  <BadgeCheck className="h-4 w-4 shrink-0 fill-saffron text-white" />
                </div>
                <div className="mt-0.5 line-clamp-1 text-[12px] text-mutedtext">{s.skills.join(", ")}</div>
                <div className="mt-2 flex items-center gap-2 text-[12.5px]">
                  <span className="flex items-center gap-0.5 font-semibold text-ink">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {s.rating}
                  </span>
                  <span className="text-mutedtext">·</span>
                  <span className="font-semibold text-ink">₹{s.price}/min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* mobile sticky bar — sits above the Runable badge */}
      <div className="fixed inset-x-4 bottom-[68px] z-40 flex items-center justify-between gap-3 rounded-[22px] bg-ink py-2.5 pl-4 pr-2.5 text-white shadow-[0_20px_40px_-12px_rgba(23,18,14,.6)] lg:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={a.img} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/15" />
          <div className="min-w-0">
            <div className="text-[15px] font-semibold leading-none">
              ₹{a.price}
              <span className="text-[11px] font-normal text-white/60">/min</span>
            </div>
            <div className={`mt-1 truncate text-[11px] font-medium ${a.status === "online" ? "text-green-400" : a.status === "busy" ? "text-red-300" : "text-white/60"}`}>
              {a.status === "online" ? "● Online now" : a.status === "busy" ? `Busy · ~${a.wait} min wait` : "Offline"}
            </div>
          </div>
        </div>
        {a.status === "offline" ? (
          <button type="button" onClick={() => setMode("chat")} className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-saffron px-4 text-[13px] font-semibold text-white">
            <Bell className="h-4 w-4" /> Notify me
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={`Call ${a.name}`}
              onClick={() => setMode("call")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setMode("chat")} className="flex h-10 items-center gap-1.5 rounded-full bg-saffron px-4 text-[13px] font-semibold text-white">
              <MessageCircle className="h-4 w-4" /> {a.status === "busy" ? "Join wait" : "Chat now"}
            </button>
          </div>
        )}
      </div>
      <div className="h-[130px] lg:hidden" />

      {mode && <IntakeModal key={a.id + mode} a={a} mode={mode} onClose={() => setMode(null)} />}
    </div>
  );
}
