import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { Search, SlidersHorizontal, ChevronRight, MessageCircle, Phone, Wallet, X, Gift, ArrowUpDown } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { astrologers, type Astrologer } from "../components/landing/data";
import { ConsultCard, type Mode } from "../components/consult/consult-card";
import { FilterPanel, emptyFilters, countActive, PRICE_MAX, type Filters } from "../components/consult/filters";
import { IntakeModal } from "../components/consult/intake-modal";
import { useAccount, openLogin, inr } from "../lib/account";

const SORTS = {
  popular: "Popularity",
  "exp-desc": "Experience: High to Low",
  "exp-asc": "Experience: Low to High",
  "orders-desc": "Total orders: High to Low",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Rating: High to Low",
} as const;
type SortKey = keyof typeof SORTS;

const statusRank = { online: 0, busy: 1, offline: 2 } as const;

function sortList(list: Astrologer[], key: SortKey) {
  const l = [...list];
  switch (key) {
    case "exp-desc":
      return l.sort((a, b) => b.exp - a.exp);
    case "exp-asc":
      return l.sort((a, b) => a.exp - b.exp);
    case "orders-desc":
      return l.sort((a, b) => b.orders - a.orders);
    case "price-asc":
      return l.sort((a, b) => a.price - b.price);
    case "price-desc":
      return l.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return l.sort((a, b) => b.rating - a.rating || b.orders - a.orders);
    default:
      return l.sort((a, b) => statusRank[a.status] - statusRank[b.status] || b.orders - a.orders);
  }
}

function applyFilters(list: Astrologer[], f: Filters, q: string) {
  const query = q.trim().toLowerCase();
  return list.filter((a) => {
    if (query && ![a.name, ...a.skills, ...a.langs].some((s) => s.toLowerCase().includes(query))) return false;
    if (f.skills.length && !f.skills.some((s) => a.skills.includes(s))) return false;
    if (f.langs.length && !f.langs.some((s) => a.langs.includes(s))) return false;
    if (f.topics.length && !f.topics.some((s) => a.topics.includes(s))) return false;
    if (f.gender.length && !f.gender.includes(a.gender)) return false;
    if (f.status.length && !f.status.map((s) => s.toLowerCase()).includes(a.status)) return false;
    if (a.price > f.maxPrice) return false;
    if (a.exp < f.minExp) return false;
    if (f.offersOnly && !a.oldPrice) return false;
    return true;
  });
}

function activeChips(f: Filters): { label: string; clear: (f: Filters) => Filters }[] {
  const chips: { label: string; clear: (f: Filters) => Filters }[] = [];
  (["status", "skills", "topics", "langs", "gender"] as const).forEach((k) =>
    f[k].forEach((v) => chips.push({ label: v, clear: (x) => ({ ...x, [k]: x[k].filter((y) => y !== v) }) })),
  );
  if (f.maxPrice < PRICE_MAX) chips.push({ label: `≤ ₹${f.maxPrice}/min`, clear: (x) => ({ ...x, maxPrice: PRICE_MAX }) });
  if (f.minExp > 0) chips.push({ label: `${f.minExp}+ yrs exp`, clear: (x) => ({ ...x, minExp: 0 }) });
  if (f.offersOnly) chips.push({ label: "Offers", clear: (x) => ({ ...x, offersOnly: false }) });
  return chips;
}

export function ConsultPage({ mode }: { mode: Mode }) {
  const search = useSearch();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState<Astrologer | null>(null);

  const { user, wallet } = useAccount();
  const isChat = mode === "chat";
  const title = isChat ? "Chat with Astrologer" : "Talk to Astrologer";
  const Icon = isChat ? MessageCircle : Phone;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} — Astroj Chat`;
  }, [title]);

  useEffect(() => {
    const id = new URLSearchParams(search).get("with");
    const a = id ? astrologers.find((x) => x.id === id) : null;
    if (a) setSelected(a);
  }, [search]);

  const list = useMemo(() => sortList(applyFilters(astrologers, filters, q), sort), [filters, q, sort]);
  const onlineCount = astrologers.filter((a) => a.status === "online").length;
  const chips = activeChips(filters);
  const nActive = countActive(filters);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      {/* page head */}
      <section className="relative overflow-hidden border-b border-ink/[.07] pt-[72px]">
        <div className="pointer-events-none absolute -right-32 -top-20 h-[360px] w-[360px] rounded-full bg-saffron/15 blur-[110px]" />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-mutedtext">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink">{title}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.04] text-ink">
                {isChat ? (
                  <>
                    Chat with <em className="font-medium italic text-saffron">astrologer</em>
                  </>
                ) : (
                  <>
                    Talk to <em className="font-medium italic text-saffron">astrologer</em>
                  </>
                )}
              </h1>
              <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-mutedtext">
                {isChat
                  ? "Pick an astrologer and start a private chat in seconds. Share your birth details once, get answers in real time."
                  : "Pick an astrologer and get a private call back in seconds. Your number stays hidden from the astrologer."}
              </p>
              <div className="mt-5 inline-flex rounded-full bg-sand p-1">
                <Link
                  href="/chat-with-astrologer"
                  className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                    isChat ? "bg-ink text-white" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" /> Chat
                </Link>
                <Link
                  href="/talk-to-astrologer"
                  className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                    !isChat ? "bg-ink text-white" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  <Phone className="h-4 w-4" /> Call
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink/[.07]">
                <Wallet className="h-5 w-5 text-saffron" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-mutedtext">Available balance</div>
                  <div className="text-[16px] font-semibold text-ink">{inr(user ? wallet.balance : 0)}</div>
                </div>
                <Link
                  href="/wallet-recharge"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      openLogin("/wallet-recharge");
                    }
                  }}
                  className="ml-2 flex h-9 items-center rounded-full border border-saffron px-4 text-[12.5px] font-semibold text-saffron transition-colors hover:bg-saffron hover:text-white"
                >
                  Recharge
                </Link>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white">
                <Gift className="h-5 w-5 text-gold" />
                <div className="text-[13px] leading-tight">
                  <b>First {isChat ? "chat" : "call"} free</b>
                  <div className="text-[11.5px] text-white/60">for new users · up to 5 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* toolbar */}
      <div className="sticky top-[72px] z-30 border-b border-ink/[.07] bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-2.5 px-5 py-3 md:px-8 sm:flex-nowrap">
          <div className="relative min-w-0 basis-full sm:flex-1 sm:basis-auto lg:max-w-[420px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search astrologers"
              placeholder="Search name, skill or language"
              className="h-11 w-full rounded-full border border-ink/12 bg-white pl-10 pr-9 text-[14px] text-ink outline-none placeholder:text-ink/40 focus:border-saffron"
            />
            {q && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="relative flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-ink/12 bg-white px-4 text-[13.5px] font-semibold text-ink sm:flex-none lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
            {nActive > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1 text-[11px] text-white">{nActive}</span>
            )}
          </button>

          <label className="relative flex h-11 flex-1 items-center rounded-full sm:flex-none border border-ink/12 bg-white pl-3.5 pr-2 text-[13.5px] font-semibold text-ink">
            <ArrowUpDown className="h-4 w-4 text-ink/60" />
            <span className="ml-2 hidden text-ink/50 md:inline">Sort:</span>
            <select
              aria-label="Sort astrologers"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pl-1.5 pr-2 outline-none sm:w-auto"
            >
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <div className="ml-auto hidden items-center gap-2 text-[13px] text-mutedtext lg:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" /> {onlineCount} online now
          </div>
        </div>
      </div>

      {/* body */}
      <section className="mx-auto grid max-w-[1240px] gap-8 px-5 pb-24 pt-6 md:px-8 lg:grid-cols-[270px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[160px] max-h-[calc(100vh-180px)] overflow-y-auto rounded-[22px] bg-white px-5 pb-2 pt-5 ring-1 ring-ink/[.06]">
            <FilterPanel value={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[13.5px] text-ink">
              <b>{list.length}</b> <span className="text-mutedtext">astrologers{nActive || q ? " match" : ""}</span>
            </span>
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setFilters(c.clear(filters))}
                className="flex h-8 items-center gap-1.5 rounded-full bg-saffron/10 pl-3 pr-2 text-[12.5px] font-medium text-saffron-deep hover:bg-saffron/20"
              >
                {c.label} <X className="h-3.5 w-3.5" />
              </button>
            ))}
            {chips.length > 1 && (
              <button
                type="button"
                onClick={() => setFilters(emptyFilters)}
                className="text-[12.5px] font-semibold text-ink/60 underline-offset-2 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {list.map((a) => (
              <ConsultCard key={a.id} a={a} mode={mode} onStart={setSelected} />
            ))}
          </div>

          {list.length === 0 && (
            <div className="mt-5 rounded-[22px] bg-white px-6 py-16 text-center ring-1 ring-ink/[.06]">
              <Icon className="mx-auto h-8 w-8 text-saffron" />
              <h3 className="mt-4 text-[17px] font-semibold text-ink">No astrologers match these filters</h3>
              <p className="mt-1 text-[14px] text-mutedtext">Try removing a filter or widening the price range.</p>
              <button
                type="button"
                onClick={() => {
                  setFilters(emptyFilters);
                  setQ("");
                }}
                className="mt-5 h-10 rounded-full bg-ink px-5 text-[13px] font-semibold text-white hover:bg-saffron"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-ink/50" onClick={() => setDrawer(false)} />
          <div className="rise absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-ivory">
            <div className="overflow-y-auto px-5 pt-5">
              <FilterPanel value={filters} onChange={setFilters} onClose={() => setDrawer(false)} />
            </div>
            <div className="border-t border-ink/[.07] p-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="h-12 w-full rounded-full bg-saffron text-[14.5px] font-semibold text-white"
              >
                Show {list.length} astrologers
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && <IntakeModal key={selected.id + mode} a={selected} mode={mode} onClose={() => setSelected(null)} />}
    </div>
  );
}

export function ChatPage() {
  return <ConsultPage mode="chat" />;
}

export function CallPage() {
  return <ConsultPage mode="call" />;
}
