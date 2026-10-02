import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Wallet, ShoppingBag, ChevronDown, ReceiptText, LogOut, Plus } from "lucide-react";
import { useAccount, openLogin, logout, inr } from "../../lib/account";

const STORE_URL = "https://store.jastro.in/";

const links = [
  { label: "Chat", href: "/chat-with-astrologer" },
  { label: "Call", href: "/talk-to-astrologer" },
  { label: "Panchang", href: "/panchang" },
  { label: "Free Kundli", href: "/free-kundli" },
  { label: "Blog", href: "/blog" },
];

export function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, wallet } = useAccount();
  const [menu, setMenu] = useState(false);
  const solid = alwaysSolid || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = (href: string) => {
    const active = location === href || (href !== "/" && !href.startsWith("/#") && location.startsWith(href + "/"));
    if (active) return "text-saffron";
    return solid ? "text-ink/80" : "text-white/80";
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-ivory/95 shadow-[0_1px_0_rgba(23,18,14,.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/images/mark-solid.png" alt="" className="h-8 w-8" />
          <span className={`whitespace-nowrap text-[19px] font-semibold tracking-tight ${solid ? "text-ink" : "text-white"}`}>
            Astroj<span className="text-saffron"> Chat</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
          {links.map((l) =>
            l.href.startsWith("/#") ? (
              <a key={l.label} href={l.href} className={`whitespace-nowrap text-[14px] font-medium transition-colors hover:text-saffron ${linkCls(l.href)}`}>
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className={`whitespace-nowrap text-[14px] font-medium transition-colors hover:text-saffron ${linkCls(l.href)}`}>
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex xl:gap-3">
          <a
            href={STORE_URL}
            className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
              solid ? "border-saffron/40 text-saffron hover:bg-saffron hover:text-white" : "border-white/25 text-white hover:border-saffron hover:bg-saffron"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Store
          </a>
          <Link
            href="/chat-with-astrologer"
            className="group flex h-10 items-center gap-2 rounded-full bg-ink pl-1.5 pr-4 text-[13px] font-semibold text-white ring-1 ring-white/15 transition-colors hover:bg-saffron-deep"
          >
            <span className="whitespace-nowrap rounded-full bg-saffron px-2.5 py-1 text-[11px] uppercase tracking-wide group-hover:bg-white group-hover:text-saffron">
              Talk Now
            </span>
            <span className="hidden text-white/50 xl:inline">|</span>
            <span className="hidden whitespace-nowrap xl:inline">First chat free</span>
          </Link>
          <Link
            href="/my-wallet"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                openLogin("/my-wallet");
              }
            }}
            aria-label="My wallet"
            className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[13px] font-medium transition-colors ${
              solid ? "border-ink/15 text-ink hover:border-ink/40" : "border-white/20 text-white hover:border-white/50"
            } ${location === "/my-wallet" ? "!border-saffron !text-saffron" : ""}`}
          >
            <Wallet className="h-4 w-4" /> {inr(user ? wallet.balance : 0)}
          </Link>
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={menu}
                onClick={() => setMenu((m) => !m)}
                className={`flex h-10 items-center gap-1.5 rounded-full pl-1 pr-2.5 transition-colors ${solid ? "hover:bg-sand" : "hover:bg-white/10"}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron text-[13px] font-semibold text-white">{user.name.charAt(0).toUpperCase()}</span>
                <ChevronDown className={`h-4 w-4 ${solid ? "text-ink/60" : "text-white/70"}`} />
              </button>
              {menu && (
                <>
                  <button type="button" aria-label="Close menu" className="fixed inset-0 cursor-default" onClick={() => setMenu(false)} />
                  <div className="rise absolute right-0 top-12 w-[250px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(23,18,14,.45)] ring-1 ring-ink/[.07]">
                    <div className="border-b border-ink/[.06] px-4 py-3.5">
                      <div className="truncate text-[14px] font-semibold text-ink">{user.name}</div>
                      <div className="text-[12px] text-mutedtext">+91 {user.phone}</div>
                    </div>
                    {[
                      { icon: Wallet, label: "My Wallet", href: "/my-wallet" },
                      { icon: ReceiptText, label: "Payment logs", href: "/my-wallet?tab=payments" },
                      { icon: Plus, label: "Recharge wallet", href: "/wallet-recharge" },
                    ].map((m) => (
                      <Link key={m.label} href={m.href} onClick={() => setMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-ink hover:bg-ivory">
                        <m.icon className="h-4 w-4 text-saffron" /> {m.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setMenu(false);
                        logout();
                        if (location.startsWith("/my-wallet") || location.startsWith("/wallet-recharge")) navigate("/");
                      }}
                      className="flex w-full items-center gap-3 border-t border-ink/[.06] px-4 py-3 text-left text-[13.5px] text-ink hover:bg-ivory"
                    >
                      <LogOut className="h-4 w-4 text-ink/50" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openLogin()}
              className="h-10 rounded-full bg-saffron px-5 text-[13px] font-semibold text-white transition-colors hover:bg-saffron-deep"
            >
              Login
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {user && (
            <Link
              href="/my-wallet"
              aria-label="My wallet"
              className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold ${
                solid ? "border-ink/15 text-ink" : "border-white/25 text-white"
              }`}
            >
              <Wallet className="h-3.5 w-3.5" /> {inr(wallet.balance)}
            </Link>
          )}
          <button type="button" aria-label="Menu" onClick={() => setOpen((o) => !o)} className={solid ? "text-ink" : "text-white"}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-ivory px-5 pb-6 pt-2 lg:hidden">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-ink/5 py-3 text-[15px] font-medium text-ink"
            >
              {l.label}
            </a>
          ))}
          <a href={STORE_URL} className="block border-b border-ink/5 py-3 text-[15px] font-semibold uppercase tracking-wide text-saffron">
            <ShoppingBag className="mr-2 inline h-4 w-4 -translate-y-px" />
            Store
          </a>
          <Link
            href="/chat-with-astrologer"
            onClick={() => setOpen(false)}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-semibold text-white"
          >
            <span className="text-saffron">Talk Now</span> <span className="text-white/40">|</span> First chat free
          </Link>
          {user ? (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link
                href="/my-wallet"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-saffron text-[14px] font-semibold text-white"
              >
                <Wallet className="h-4 w-4" /> {inr(wallet.balance)}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                  if (location.startsWith("/my-wallet") || location.startsWith("/wallet-recharge")) navigate("/");
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-ink/15 text-[14px] font-semibold text-ink"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openLogin();
              }}
              className="mt-3 h-11 w-full rounded-full bg-saffron text-[14px] font-semibold text-white"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
