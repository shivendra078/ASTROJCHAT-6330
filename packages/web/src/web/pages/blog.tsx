import { useEffect, useMemo, useState } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { ChevronRight, Search, X, SlidersHorizontal, ArrowUpDown, Flame, ArrowRight, MessageCircle, Send, Check, Languages, Tag, LayoutGrid } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { Meta, PostCard } from "../components/blog/post-card";
import { POSTS, CATEGORIES, LANGUAGES, ALL_TAGS, authorOf, fmtViews, type Post } from "../lib/blog";

type Sort = "latest" | "popular" | "oldest";
const SORTS: Record<Sort, string> = { latest: "Latest first", popular: "Most read", oldest: "Oldest first" };
const PAGE = 6;

type F = { q: string; cat: string; lang: string; tags: string[]; sort: Sort };

function parse(search: string): F {
  const p = new URLSearchParams(search);
  const s = p.get("sort") as Sort;
  return {
    q: p.get("q") ?? "",
    cat: CATEGORIES.includes(p.get("category") as never) ? (p.get("category") as string) : "",
    lang: LANGUAGES.includes(p.get("lang") as never) ? (p.get("lang") as string) : "",
    tags: (p.get("tags") ?? "").split(",").filter((t) => ALL_TAGS.includes(t)),
    sort: s in SORTS ? s : "latest",
  };
}

function toSearch(f: F) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.cat) p.set("category", f.cat);
  if (f.lang) p.set("lang", f.lang);
  if (f.tags.length) p.set("tags", f.tags.join(","));
  if (f.sort !== "latest") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

const countBy = (pred: (p: Post) => boolean) => POSTS.filter(pred).length;

/* ---------------- cards ---------------- */

function Featured() {
  const feat = [...POSTS].filter((p) => p.featured).sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = feat;
  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
      <Link href={`/blog/${lead.slug}`} className="group relative block min-h-[400px] overflow-hidden rounded-[28px] md:min-h-[460px]">
        <img src={lead.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-saffron px-3 py-1 text-[11.5px] font-semibold">Editor’s pick</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-semibold backdrop-blur">{lead.category}</span>
          </div>
          <h2 className="font-display mt-4 max-w-[560px] text-[28px] font-semibold leading-[1.1] md:text-[36px]">{lead.title}</h2>
          <p className="mt-3 line-clamp-2 max-w-[540px] text-[14px] leading-relaxed text-white/70">{lead.excerpt}</p>
          <div className="mt-4">
            <Meta p={lead} light />
          </div>
        </div>
      </Link>
      <div className="grid gap-4">
        {rest.slice(0, 3).map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group grid grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-[22px] bg-white p-3 ring-1 ring-ink/[.06] transition-shadow hover:shadow-[0_20px_40px_-26px_rgba(23,18,14,.4)] sm:grid-cols-[160px_1fr]"
          >
            <div className="overflow-hidden rounded-[16px]">
              <img src={p.img} alt="" className="h-full min-h-[120px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex min-w-0 flex-col justify-center py-1 pr-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron">{p.category}</span>
              <h3 className="mt-1.5 line-clamp-3 text-[15.5px] font-semibold leading-snug text-ink group-hover:text-saffron">{p.title}</h3>
              <div className="mt-2">
                <Meta p={p} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------------- sidebar ---------------- */

function SideBlock({ title, icon: Icon, children }: { title: string; icon: typeof Tag; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] bg-white p-5 ring-1 ring-ink/[.06]">
      <h3 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.14em] text-ink">
        <Icon className="h-4 w-4 text-saffron" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Sidebar({ f, set, inDrawer = false }: { f: F; set: (p: Partial<F>) => void; inDrawer?: boolean }) {
  const trending = [...POSTS].sort((a, b) => b.views - a.views).slice(0, 5);
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  return (
    <div className="space-y-4">
      <SideBlock title="Categories" icon={LayoutGrid}>
        <ul className="space-y-0.5">
          {["", ...CATEGORIES].map((c) => {
            const active = f.cat === c;
            const n = c ? countBy((p) => p.category === c) : POSTS.length;
            return (
              <li key={c || "all"}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => set({ cat: c })}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] transition-colors ${
                    active ? "bg-ink font-semibold text-white" : "text-ink/80 hover:bg-sand"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rotate-45 ${active ? "bg-saffron" : "bg-ink/20"}`} />
                    {c || "All articles"}
                  </span>
                  <span className={`text-[12px] ${active ? "text-white/60" : "text-mutedtext"}`}>{n}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </SideBlock>

      <SideBlock title="Language" icon={Languages}>
        <div className="flex gap-2">
          {["", ...LANGUAGES].map((l) => (
            <button
              key={l || "all"}
              type="button"
              aria-pressed={f.lang === l}
              onClick={() => set({ lang: l })}
              className={`h-9 flex-1 rounded-full text-[13px] font-semibold transition-colors ${
                f.lang === l ? "bg-saffron text-white" : "bg-sand text-ink/70 hover:text-ink"
              }`}
            >
              {l === "Hindi" ? "हिंदी" : l || "All"}
            </button>
          ))}
        </div>
      </SideBlock>

      <SideBlock title="Topics" icon={Tag}>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => {
            const on = f.tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => set({ tags: on ? f.tags.filter((x) => x !== t) : [...f.tags, t] })}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  on ? "bg-ink text-white" : "bg-ivory text-ink/75 ring-1 ring-ink/10 hover:ring-saffron/50"
                }`}
              >
                {on && <Check className="-ml-0.5 mr-1 inline h-3 w-3" />}
                {t}
              </button>
            );
          })}
        </div>
      </SideBlock>

      {!inDrawer && (
        <>
          <SideBlock title="Trending now" icon={Flame}>
            <ol className="space-y-4">
              {trending.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group flex gap-3">
                    <span className="font-display w-6 shrink-0 text-[22px] font-semibold leading-none text-saffron/70">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink group-hover:text-saffron">{p.title}</span>
                      <span className="mt-1 block text-[11.5px] text-mutedtext">{fmtViews(p.views)} reads</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </SideBlock>

          <div className="grain relative overflow-hidden rounded-[22px] bg-cocoa p-6 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saffron/30 blur-[60px]" />
            <h3 className="font-display relative text-[22px] font-semibold leading-tight">Have a question the blog can’t answer?</h3>
            <p className="relative mt-2 text-[13px] leading-relaxed text-white/65">Talk to a verified astrologer about your own chart. First chat is free.</p>
            <Link
              href="/chat-with-astrologer"
              className="relative mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-saffron text-[13.5px] font-semibold text-white hover:bg-saffron-deep"
            >
              <MessageCircle className="h-4 w-4" /> Chat with astrologer
            </Link>
          </div>

          <SideBlock title="Weekly newsletter" icon={Send}>
            {subbed ? (
              <p className="flex items-center gap-2 text-[13.5px] text-ink">
                <Check className="h-4 w-4 text-green-600" /> You’re subscribed. See you on Sunday!
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (/\S+@\S+\.\S+/.test(email)) setSubbed(true);
                }}
              >
                <p className="mb-3 text-[13px] leading-relaxed text-mutedtext">Transits, festivals and one practical remedy — every Sunday.</p>
                <input
                  type="email"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-full border border-ink/12 bg-ivory px-4 text-[14px] outline-none focus:border-saffron"
                />
                <button type="submit" className="mt-2.5 h-11 w-full rounded-full bg-ink text-[13.5px] font-semibold text-white hover:bg-saffron">
                  Subscribe
                </button>
              </form>
            )}
          </SideBlock>
        </>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function BlogPage() {
  const search = useSearch();
  const [location, navigate] = useLocation();
  const f = useMemo(() => parse(search), [search]);
  const [qDraft, setQDraft] = useState(f.q);
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  const set = (patch: Partial<F>) => {
    navigate(`${location}${toSearch({ ...f, ...patch })}`, { replace: true });
    setShown(PAGE);
  };

  useEffect(() => {
    document.title = "Astrology Blog — Astroj Chat";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => setQDraft(f.q), [f.q]);

  // debounce search typing into the URL
  useEffect(() => {
    if (qDraft === f.q) return;
    const t = setTimeout(() => set({ q: qDraft.trim() ? qDraft : "" }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDraft]);

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const r = POSTS.filter(
      (p) =>
        (!f.cat || p.category === f.cat) &&
        (!f.lang || p.lang === f.lang) &&
        (!f.tags.length || f.tags.some((t) => p.tags.includes(t))) &&
        (!q || `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.category} ${authorOf(p).name}`.toLowerCase().includes(q)),
    );
    return r.sort((a, b) => (f.sort === "popular" ? b.views - a.views : f.sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [f]);

  const nActive = (f.cat ? 1 : 0) + (f.lang ? 1 : 0) + f.tags.length;
  const filtering = nActive > 0 || !!f.q;

  const chips: { label: string; clear: () => void }[] = [
    ...(f.q ? [{ label: `“${f.q}”`, clear: () => set({ q: "" }) }] : []),
    ...(f.cat ? [{ label: f.cat, clear: () => set({ cat: "" }) }] : []),
    ...(f.lang ? [{ label: f.lang, clear: () => set({ lang: "" }) }] : []),
    ...f.tags.map((t) => ({ label: `#${t}`, clear: () => set({ tags: f.tags.filter((x) => x !== t) }) })),
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      <section className="grain relative overflow-hidden bg-cocoa pb-14 pt-[72px] text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">Blog</span>
          </nav>
          <div className="mt-5 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h1 className="rise font-display text-[clamp(2.3rem,5vw,3.8rem)] font-semibold leading-[1.03]">
                The Astro <em className="font-medium italic text-saffron">Journal</em>
              </h1>
              <p className="rise mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-white/65" style={{ animationDelay: "90ms" }}>
                Transits, festivals, kundli basics and practical remedies — written by the astrologers you can chat with on Astroj.
              </p>
            </div>
            <div className="rise relative w-full lg:max-w-[420px]" style={{ animationDelay: "160ms" }}>
              <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                aria-label="Search articles"
                value={qDraft}
                onChange={(e) => setQDraft(e.target.value)}
                placeholder="Search Saturn, Navratri, gemstones…"
                className="h-[54px] w-full rounded-full bg-white pl-12 pr-12 text-[15px] text-ink outline-none placeholder:text-ink/40 focus:ring-4 focus:ring-saffron/30"
              />
              {qDraft && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQDraft("");
                    set({ q: "" });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="rise -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" style={{ animationDelay: "220ms" }}>
            {["", ...CATEGORIES].map((c) => (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={f.cat === c}
                onClick={() => set({ cat: c })}
                className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                  f.cat === c ? "bg-saffron text-white" : "bg-white/[.08] text-white/75 ring-1 ring-white/15 hover:bg-white/15"
                }`}
              >
                {c || "All"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-12">
        {!filtering && (
          <div className="mb-12">
            <Featured />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display mr-auto text-[26px] font-semibold text-ink">{f.cat || (filtering ? "Results" : "All articles")}</h2>
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="relative flex h-11 items-center gap-2 rounded-full border border-ink/12 bg-white px-4 text-[13.5px] font-semibold text-ink lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filter
                {nActive > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1 text-[11px] text-white">{nActive}</span>}
              </button>
              <label className="flex h-11 items-center rounded-full border border-ink/12 bg-white pl-3.5 pr-2 text-[13.5px] font-semibold text-ink">
                <ArrowUpDown className="h-4 w-4 text-ink/60" />
                <select
                  aria-label="Sort articles"
                  value={f.sort}
                  onChange={(e) => set({ sort: e.target.value as Sort })}
                  className="cursor-pointer appearance-none bg-transparent pl-2 pr-2 outline-none"
                >
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-mutedtext">
              <span>
                {list.length} article{list.length === 1 ? "" : "s"}
              </span>
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={c.clear}
                  className="flex items-center gap-1 rounded-full bg-saffron/10 px-3 py-1 text-[12.5px] font-semibold text-saffron-deep hover:bg-saffron/20"
                >
                  {c.label} <X className="h-3 w-3" />
                </button>
              ))}
              {chips.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setQDraft("");
                    navigate(location, { replace: true });
                  }}
                  className="text-[12.5px] font-semibold text-ink underline-offset-2 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {list.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-[24px] border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
                <Search className="h-8 w-8 text-saffron/70" />
                <p className="mt-4 text-[16px] font-semibold text-ink">No articles match these filters</p>
                <p className="mt-1 text-[13.5px] text-mutedtext">Try another topic, or clear the filters to see everything.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQDraft("");
                    navigate(location, { replace: true });
                  }}
                  className="mt-5 h-10 rounded-full bg-ink px-5 text-[13px] font-semibold text-white hover:bg-saffron"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {list.slice(0, shown).map((p) => (
                    <PostCard key={p.slug} p={p} />
                  ))}
                </div>
                {shown < list.length && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShown((s) => s + PAGE)}
                      className="flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[14px] font-semibold text-white hover:bg-saffron"
                    >
                      Load more articles <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[96px]">
              <Sidebar f={f} set={set} />
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} />
          <div className="rise absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-ivory">
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <h2 className="text-[18px] font-semibold text-ink">Filter articles</h2>
              <button type="button" aria-label="Close" onClick={() => setDrawer(false)} className="rounded-full p-2 text-ink/60 hover:bg-sand">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-4">
              <Sidebar f={f} set={set} inDrawer />
            </div>
            <div className="border-t border-ink/[.07] p-4">
              <button type="button" onClick={() => setDrawer(false)} className="h-12 w-full rounded-full bg-saffron text-[14.5px] font-semibold text-white">
                Show {list.length} article{list.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
