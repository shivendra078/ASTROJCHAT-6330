import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ChevronRight, Smartphone, CreditCard, Landmark, Wallet as WalletIcon, ShieldCheck, Loader2, CheckCircle2, XCircle, Info, X, Sparkles } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { LoginGate } from "../components/account/login-gate";
import { useAccount, RECHARGE_PACKS, MIN_RECHARGE, MAX_RECHARGE, bill, inr, recordPayment, type PayLog, type PayStatus } from "../lib/account";

const METHODS = [
  { id: "UPI", label: "UPI", sub: "GPay, PhonePe, Paytm, BHIM", icon: Smartphone },
  { id: "Card", label: "Credit / Debit card", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "Net Banking", label: "Net banking", sub: "All major Indian banks", icon: Landmark },
  { id: "Paytm Wallet", label: "Wallets", sub: "Paytm, Amazon Pay, Mobikwik", icon: WalletIcon },
] as const;

const FAIL_REASONS = ["Payment declined by bank", "UPI request timed out", "Insufficient funds in account"];

type Phase = { k: "idle" } | { k: "gateway" } | { k: "processing"; outcome: PayStatus } | { k: "done"; log: PayLog };

export default function WalletRechargePage() {
  const { user, wallet } = useAccount();
  const search = useSearch();
  const [, navigate] = useLocation();
  const initial = Number(new URLSearchParams(search).get("amount"));
  const [amount, setAmount] = useState<number>(initial >= MIN_RECHARGE && initial <= MAX_RECHARGE ? initial : 500);
  const [custom, setCustom] = useState(RECHARGE_PACKS.some((p) => p.amount === initial) || !initial ? "" : String(initial));
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("UPI");
  const [phase, setPhase] = useState<Phase>({ k: "idle" });

  useEffect(() => {
    document.title = "Recharge Wallet — Astroj Chat";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (phase.k !== "processing") return;
    const t = setTimeout(() => {
      const reason = phase.outcome === "Failed" ? FAIL_REASONS[Math.floor(Math.random() * FAIL_REASONS.length)] : phase.outcome === "Cancelled" ? "Cancelled by user" : undefined;
      const log = recordPayment(amount, method, phase.outcome, reason);
      setPhase({ k: "done", log });
    }, phase.outcome === "Cancelled" ? 400 : 1600);
    return () => clearTimeout(t);
  }, [phase, amount, method]);

  const valid = amount >= MIN_RECHARGE && amount <= MAX_RECHARGE;
  const b = bill(valid ? amount : 0);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      <section className="grain relative overflow-hidden bg-cocoa pb-28 pt-[72px] text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/my-wallet" className="hover:text-saffron">
              My Wallet
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">Recharge</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <h1 className="rise font-display text-[clamp(2.2rem,4.6vw,3.4rem)] font-semibold leading-[1.05]">
              Add money to <em className="font-medium italic text-saffron">wallet</em>
            </h1>
            {user && (
              <div className="rise rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15" style={{ animationDelay: "80ms" }}>
                <div className="text-[11px] uppercase tracking-[.14em] text-white/55">Available balance</div>
                <div className="text-[22px] font-semibold">{inr(wallet.balance)}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="relative mx-auto -mt-20 max-w-[1240px] px-5 pb-36 md:px-8 lg:pb-20">
        {!user ? (
          <LoginGate title="Login to recharge" text="Add money to your Astroj wallet to chat or call with astrologers." redirect={`/wallet-recharge${search ? `?${search}` : ""}`} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rise min-w-0 rounded-[28px] bg-white p-5 shadow-[0_30px_60px_-36px_rgba(23,18,14,.5)] ring-1 ring-ink/[.06] md:p-7">
              <h2 className="text-[16px] font-semibold text-ink">Choose an amount</h2>
              <p className="mt-1 text-[13px] text-mutedtext">Bigger recharges earn extra bonus cash in your wallet.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {RECHARGE_PACKS.map((p) => {
                  const on = amount === p.amount && !custom;
                  return (
                    <button
                      key={p.amount}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setAmount(p.amount);
                        setCustom("");
                      }}
                      className={`relative flex h-[76px] flex-col items-center justify-center rounded-2xl border-2 transition-colors ${
                        on ? "border-saffron bg-saffron/[.06]" : "border-ink/[.08] hover:border-saffron/50"
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 rounded-full bg-ink px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-gold">Popular</span>
                      )}
                      <span className="text-[18px] font-semibold text-ink">{inr(p.amount)}</span>
                      {p.extra > 0 ? (
                        <span className="mt-0.5 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">+{p.extra}% extra</span>
                      ) : (
                        <span className="mt-0.5 text-[11px] text-mutedtext">no bonus</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <label className="mt-6 block text-[13px] font-semibold text-ink">
                Or enter a custom amount
                <div className={`mt-2 flex h-[52px] items-center rounded-2xl border bg-white px-4 ${custom && !valid ? "border-red-500" : "border-ink/12 focus-within:border-saffron"}`}>
                  <span className="text-[17px] font-semibold text-ink/50">₹</span>
                  <input
                    aria-label="Custom recharge amount"
                    inputMode="numeric"
                    value={custom}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setCustom(v);
                      setAmount(Number(v) || 0);
                    }}
                    placeholder={`${MIN_RECHARGE} – ${MAX_RECHARGE.toLocaleString("en-IN")}`}
                    className="ml-2 h-full flex-1 bg-transparent text-[16px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink/30"
                  />
                </div>
              </label>
              {custom && !valid && (
                <p className="mt-2 text-[12.5px] text-red-600">
                  Enter an amount between {inr(MIN_RECHARGE)} and {inr(MAX_RECHARGE)}.
                </p>
              )}

              <h2 className="mt-8 text-[16px] font-semibold text-ink">Payment method</h2>
              <fieldset className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
                <legend className="sr-only">Payment method</legend>
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={method === m.id}
                    aria-label={`${m.label} — ${m.sub}`}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                      method === m.id ? "border-saffron bg-saffron/[.05]" : "border-ink/[.08] hover:border-saffron/40"
                    }`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${method === m.id ? "bg-saffron text-white" : "bg-sand text-ink/70"}`}>
                      <m.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-ink">{m.label}</span>
                      <span className="block truncate text-[12px] text-mutedtext">{m.sub}</span>
                    </span>
                  </button>
                ))}
              </fieldset>
            </div>

            {/* summary */}
            <aside className="lg:sticky lg:top-[96px] lg:self-start">
              <div className="rise overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/[.06]" style={{ animationDelay: "80ms" }}>
                <div className="grain relative overflow-hidden bg-cocoa px-6 py-5 text-white">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-saffron/35 blur-[50px]" />
                  <div className="relative text-[12px] font-semibold uppercase tracking-[.16em] text-white/55">Payment summary</div>
                  <div className="relative mt-1 text-[30px] font-semibold">{inr(b.total, 2)}</div>
                  <div className="relative text-[12.5px] text-white/55">Total payable</div>
                </div>
                <dl className="space-y-3 px-6 py-5 text-[14px]">
                  <div className="flex justify-between">
                    <dt className="text-ink/70">Recharge amount</dt>
                    <dd className="font-semibold text-ink">{inr(b.amount, 2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/70">GST @ 18%</dt>
                    <dd className="font-semibold text-ink">{inr(b.gst, 2)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-ink/15 pt-3">
                    <dt className="font-semibold text-ink">Total payable</dt>
                    <dd className="font-semibold text-ink">{inr(b.total, 2)}</dd>
                  </div>
                  {b.extra > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2.5 text-green-800">
                      <dt className="flex items-center gap-1.5 text-[13px] font-semibold">
                        <Sparkles className="h-4 w-4" /> Bonus cash
                      </dt>
                      <dd className="font-semibold">+{inr(b.extra)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-[13px]">
                    <dt className="text-ink/70">You get in wallet</dt>
                    <dd className="font-semibold text-saffron-deep">{inr(b.amount + b.extra)}</dd>
                  </div>
                </dl>
                <div className="px-6 pb-6">
                  <button
                    type="button"
                    disabled={!valid}
                    onClick={() => setPhase({ k: "gateway" })}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-saffron text-[14.5px] font-semibold text-white hover:bg-saffron-deep disabled:cursor-not-allowed disabled:bg-ink/20"
                  >
                    <ShieldCheck className="h-4 w-4" /> Proceed to pay {valid ? inr(b.total, 2) : ""}
                  </button>
                  <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-mutedtext">
                    <Info className="mt-px h-3.5 w-3.5 shrink-0" /> Demo checkout — no real money is charged. Wallet balance is non-refundable and usable for consultations only.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />

      {user && phase.k === "idle" && (
        <div className="fixed inset-x-4 bottom-[68px] z-40 flex items-center justify-between gap-4 rounded-[22px] bg-ink py-2.5 pl-5 pr-2.5 text-white shadow-[0_20px_40px_-12px_rgba(23,18,14,.6)] lg:hidden">
          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-white/55">Total payable</div>
            <div className="text-[17px] font-semibold">{inr(b.total, 2)}</div>
          </div>
          <button
            type="button"
            disabled={!valid}
            onClick={() => setPhase({ k: "gateway" })}
            className="h-11 rounded-full bg-saffron px-6 text-[14px] font-semibold text-white disabled:bg-ink/20"
          >
            Proceed to pay
          </button>
        </div>
      )}

      {phase.k !== "idle" && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" />
          <div className="rise relative w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-ivory shadow-2xl sm:rounded-[28px]">
            {phase.k === "gateway" && (
              <div className="p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-saffron/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-saffron-deep">Demo payment gateway</span>
                  <button type="button" aria-label="Close" onClick={() => setPhase({ k: "processing", outcome: "Cancelled" })} className="-mr-2 rounded-full p-2 text-ink/50 hover:bg-sand">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-5 text-[13px] text-mutedtext">Paying Astroj Chat via {method}</div>
                <div className="font-display mt-1 text-[38px] font-semibold text-ink">{inr(b.total, 2)}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-mutedtext">This is a simulated checkout. Pick an outcome to see how each one is recorded in your payment logs.</p>
                <div className="mt-6 grid gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPhase({ k: "processing", outcome: "Success" })}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-saffron text-[14.5px] font-semibold text-white hover:bg-saffron-deep"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Pay successfully
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase({ k: "processing", outcome: "Failed" })}
                    className="h-12 rounded-full border border-ink/15 text-[14px] font-semibold text-ink hover:border-red-400 hover:text-red-600"
                  >
                    Simulate a failed payment
                  </button>
                  <button type="button" onClick={() => setPhase({ k: "processing", outcome: "Cancelled" })} className="h-10 text-[13px] font-semibold text-ink/50 hover:text-ink">
                    Cancel payment
                  </button>
                </div>
              </div>
            )}
            {phase.k === "processing" && (
              <div className="flex flex-col items-center px-7 py-14 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-saffron" />
                <p className="mt-4 text-[15px] font-semibold text-ink">{phase.outcome === "Cancelled" ? "Cancelling…" : "Processing payment…"}</p>
                <p className="mt-1 text-[12.5px] text-mutedtext">Please don’t close this window.</p>
              </div>
            )}
            {phase.k === "done" && (
              <div className="flex flex-col items-center px-7 py-10 text-center">
                {phase.log.status === "Success" ? (
                  <CheckCircle2 className="h-14 w-14 text-green-600" />
                ) : (
                  <XCircle className={`h-14 w-14 ${phase.log.status === "Failed" ? "text-red-500" : "text-ink/40"}`} />
                )}
                <h3 className="font-display mt-4 text-[26px] font-semibold text-ink">
                  {phase.log.status === "Success" ? "Recharge successful" : phase.log.status === "Failed" ? "Payment failed" : "Payment cancelled"}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mutedtext">
                  {phase.log.status === "Success"
                    ? `${inr(phase.log.amount + phase.log.extra)} added to your wallet${phase.log.extra ? ` (incl. ${inr(phase.log.extra)} bonus)` : ""}.`
                    : phase.log.status === "Failed"
                      ? `${phase.log.reason}. If any amount was debited it will be refunded in 5–7 working days.`
                      : "No money was deducted."}
                </p>
                <div className="mt-3 font-mono text-[12px] text-ink/50">Order {phase.log.id}</div>
                {phase.log.status === "Success" && <div className="mt-4 rounded-2xl bg-white px-5 py-3 text-[13px] text-ink ring-1 ring-ink/[.06]">New balance: <b>{inr(wallet.balance)}</b></div>}
                <div className="mt-6 grid w-full gap-2.5">
                  {phase.log.status === "Success" ? (
                    <>
                      <Link href="/chat-with-astrologer" className="flex h-12 items-center justify-center rounded-full bg-saffron text-[14.5px] font-semibold text-white hover:bg-saffron-deep">
                        Chat with an astrologer
                      </Link>
                      <button type="button" onClick={() => navigate("/my-wallet")} className="h-11 rounded-full border border-ink/15 text-[14px] font-semibold text-ink hover:border-ink/40">
                        View wallet
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => setPhase({ k: "gateway" })} className="h-12 rounded-full bg-saffron text-[14.5px] font-semibold text-white hover:bg-saffron-deep">
                        Try again
                      </button>
                      <button type="button" onClick={() => navigate("/my-wallet?tab=payments")} className="h-11 rounded-full border border-ink/15 text-[14px] font-semibold text-ink hover:border-ink/40">
                        View payment logs
                      </button>
                    </>
                  )}
                  <button type="button" onClick={() => setPhase({ k: "idle" })} className="h-9 text-[12.5px] font-semibold text-ink/50 hover:text-ink">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
