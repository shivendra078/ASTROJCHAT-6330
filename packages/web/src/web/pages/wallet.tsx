import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ChevronRight, Plus, ArrowDownLeft, ArrowUpRight, Gift, ReceiptText, Wallet as WalletIcon, CheckCircle2, XCircle, Ban, Copy, Check, Download, Sparkles } from "lucide-react";
import { Navbar } from "../components/landing/navbar";
import { Footer } from "../components/landing/app-footer";
import { LoginGate } from "../components/account/login-gate";
import { useAccount, inr, fmtWhen, type PayLog, type PayStatus, type Txn } from "../lib/account";

type Tab = "transactions" | "payments";

function CopyId({ id }: { id: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${id}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(id);
        } catch {
          /* ignore */
        }
        setOk(true);
        setTimeout(() => setOk(false), 1400);
      }}
      className="inline-flex items-center gap-1 font-mono text-[12px] text-ink/60 hover:text-saffron"
    >
      {id} {ok ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

const STATUS: Record<PayStatus, { cls: string; icon: typeof CheckCircle2 }> = {
  Success: { cls: "bg-green-50 text-green-700 ring-green-600/20", icon: CheckCircle2 },
  Failed: { cls: "bg-red-50 text-red-700 ring-red-600/20", icon: XCircle },
  Cancelled: { cls: "bg-ink/[.05] text-ink/60 ring-ink/10", icon: Ban },
};

function StatusPill({ s }: { s: PayStatus }) {
  const { cls, icon: I } = STATUS[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ring-1 ${cls}`}>
      <I className="h-3.5 w-3.5" /> {s}
    </span>
  );
}

function Empty({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron/10">
        {tab === "transactions" ? <WalletIcon className="h-6 w-6 text-saffron" /> : <ReceiptText className="h-6 w-6 text-saffron" />}
      </span>
      <p className="mt-4 text-[16px] font-semibold text-ink">{tab === "transactions" ? "No wallet transactions yet" : "No payments yet"}</p>
      <p className="mt-1 max-w-[340px] text-[13.5px] text-mutedtext">
        {tab === "transactions"
          ? "Recharges, bonuses and consultation charges will appear here."
          : "Every recharge attempt — successful, failed or cancelled — is logged here."}
      </p>
      <Link href="/wallet-recharge" className="mt-5 flex h-11 items-center gap-2 rounded-full bg-saffron px-6 text-[13.5px] font-semibold text-white hover:bg-saffron-deep">
        <Plus className="h-4 w-4" /> Recharge now
      </Link>
    </div>
  );
}

function TxnList({ txns }: { txns: Txn[] }) {
  return (
    <>
      {/* desktop table */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-ink/[.07] text-[11.5px] uppercase tracking-[.12em] text-mutedtext">
            <th className="px-6 py-3 font-semibold">Description</th>
            <th className="px-4 py-3 font-semibold">Date & time</th>
            <th className="px-4 py-3 font-semibold">Transaction ID</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            <th className="px-6 py-3 text-right font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((t) => (
            <tr key={t.id} className="border-b border-ink/[.05] last:border-0 hover:bg-ivory/70">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 text-[14px] font-medium text-ink">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.kind === "credit" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {t.desc.includes("bonus") ? <Gift className="h-4 w-4" /> : t.kind === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  {t.desc}
                </div>
              </td>
              <td className="px-4 py-4 text-[13px] text-ink/70">{fmtWhen(t.at)}</td>
              <td className="px-4 py-4">
                <CopyId id={t.id} />
              </td>
              <td className={`px-4 py-4 text-right text-[14.5px] font-semibold ${t.kind === "credit" ? "text-green-700" : "text-red-600"}`}>
                {t.kind === "credit" ? "+" : "−"}
                {inr(t.amount)}
              </td>
              <td className="px-6 py-4 text-right text-[13.5px] text-ink/70">{inr(t.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* mobile list */}
      <ul className="divide-y divide-ink/[.06] md:hidden">
        {txns.map((t) => (
          <li key={t.id} className="flex items-start gap-3 px-4 py-4">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.kind === "credit" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {t.desc.includes("bonus") ? <Gift className="h-4 w-4" /> : t.kind === "credit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[14px] font-medium leading-snug text-ink">{t.desc}</span>
                <span className={`shrink-0 text-[14.5px] font-semibold ${t.kind === "credit" ? "text-green-700" : "text-red-600"}`}>
                  {t.kind === "credit" ? "+" : "−"}
                  {inr(t.amount)}
                </span>
              </div>
              <div className="mt-1 text-[12px] text-mutedtext">{fmtWhen(t.at)}</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <CopyId id={t.id} />
                <span className="text-[12px] text-mutedtext">Bal {inr(t.balance)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function downloadReceipt(l: PayLog, name: string, phone: string) {
  const lines = [
    "ASTROJ CHAT — PAYMENT RECEIPT (DEMO)",
    "",
    `Order ID      : ${l.id}`,
    `Date          : ${fmtWhen(l.at)}`,
    `Customer      : ${name} (+91 ${phone})`,
    `Method        : ${l.method}`,
    `Status        : ${l.status}`,
    "",
    `Recharge      : ${inr(l.amount, 2)}`,
    `GST @18%      : ${inr(l.gst, 2)}`,
    `Total paid    : ${inr(l.total, 2)}`,
    `Bonus credit  : ${inr(l.extra, 2)}`,
    "",
    "This is a demo receipt. No real payment was made.",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `astroj-receipt-${l.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function LogList({ logs, name, phone }: { logs: PayLog[]; name: string; phone: string }) {
  return (
    <>
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-ink/[.07] text-[11.5px] uppercase tracking-[.12em] text-mutedtext">
            <th className="px-6 py-3 font-semibold">Order ID</th>
            <th className="px-4 py-3 font-semibold">Date & time</th>
            <th className="px-4 py-3 font-semibold">Method</th>
            <th className="px-4 py-3 text-right font-semibold">Recharge</th>
            <th className="px-4 py-3 text-right font-semibold">GST</th>
            <th className="px-4 py-3 text-right font-semibold">Total</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-6 py-3">
              <span className="sr-only">Receipt</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-b border-ink/[.05] last:border-0 hover:bg-ivory/70">
              <td className="px-6 py-4">
                <CopyId id={l.id} />
              </td>
              <td className="px-4 py-4 text-[13px] text-ink/70">{fmtWhen(l.at)}</td>
              <td className="px-4 py-4 text-[13.5px] text-ink">{l.method}</td>
              <td className="px-4 py-4 text-right text-[13.5px] text-ink">{inr(l.amount)}</td>
              <td className="px-4 py-4 text-right text-[13px] text-ink/60">{inr(l.gst, 2)}</td>
              <td className="px-4 py-4 text-right text-[14px] font-semibold text-ink">{inr(l.total, 2)}</td>
              <td className="px-4 py-4">
                <StatusPill s={l.status} />
                {l.reason && <div className="mt-1 max-w-[180px] text-[11.5px] leading-snug text-mutedtext">{l.reason}</div>}
              </td>
              <td className="px-6 py-4 text-right">
                {l.status === "Success" ? (
                  <button
                    type="button"
                    aria-label={`Download receipt ${l.id}`}
                    onClick={() => downloadReceipt(l, name, phone)}
                    className="rounded-full p-2 text-ink/50 hover:bg-sand hover:text-saffron"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                ) : (
                  <Link href={`/wallet-recharge?amount=${l.amount}`} className="text-[12.5px] font-semibold text-saffron hover:underline">
                    Retry
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="divide-y divide-ink/[.06] md:hidden">
        {logs.map((l) => (
          <li key={l.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold text-ink">{inr(l.total, 2)}</div>
                <div className="text-[12px] text-mutedtext">
                  {inr(l.amount)} + {inr(l.gst, 2)} GST · {l.method}
                </div>
              </div>
              <StatusPill s={l.status} />
            </div>
            {l.reason && <div className="mt-1.5 text-[12px] text-mutedtext">{l.reason}</div>}
            <div className="mt-2 flex items-center justify-between gap-2">
              <CopyId id={l.id} />
              <span className="text-[12px] text-mutedtext">{fmtWhen(l.at)}</span>
            </div>
            <div className="mt-2">
              {l.status === "Success" ? (
                <button type="button" onClick={() => downloadReceipt(l, name, phone)} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-saffron">
                  <Download className="h-3.5 w-3.5" /> Receipt
                </button>
              ) : (
                <Link href={`/wallet-recharge?amount=${l.amount}`} className="text-[12.5px] font-semibold text-saffron">
                  Retry payment →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function WalletPage() {
  const { user, wallet } = useAccount();
  const search = useSearch();
  const [location, navigate] = useLocation();
  const tab: Tab = new URLSearchParams(search).get("tab") === "payments" ? "payments" : "transactions";
  const [txnFilter, setTxnFilter] = useState<"all" | "credit" | "debit">("all");
  const [logFilter, setLogFilter] = useState<"all" | PayStatus>("all");

  useEffect(() => {
    document.title = "My Wallet — Astroj Chat";
    window.scrollTo(0, 0);
  }, []);

  const stats = useMemo(() => {
    const ok = wallet.logs.filter((l) => l.status === "Success");
    return {
      recharged: ok.reduce((s, l) => s + l.amount, 0),
      bonus: ok.reduce((s, l) => s + l.extra, 0),
      spent: wallet.txns.filter((t) => t.kind === "debit").reduce((s, t) => s + t.amount, 0),
    };
  }, [wallet]);

  const txns = wallet.txns.filter((t) => txnFilter === "all" || t.kind === txnFilter);
  const logs = wallet.logs.filter((l) => logFilter === "all" || l.status === logFilter);
  const setTab = (t: Tab) => navigate(`${location}${t === "payments" ? "?tab=payments" : ""}`, { replace: true });

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar alwaysSolid />

      <section className="grain relative overflow-hidden bg-cocoa pb-28 pt-[72px] text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-saffron/25 blur-[130px]" />
        <div className="relative mx-auto max-w-[1240px] px-5 pt-8 md:px-8 md:pt-10">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/50">
            <Link href="/" className="hover:text-saffron">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/85">My Wallet</span>
          </nav>
          <h1 className="rise font-display mt-5 text-[clamp(2.2rem,4.6vw,3.4rem)] font-semibold leading-[1.05]">
            My <em className="font-medium italic text-saffron">Wallet</em>
          </h1>
          {user && (
            <p className="rise mt-2 text-[14.5px] text-white/60" style={{ animationDelay: "80ms" }}>
              {user.name} · +91 {user.phone}
            </p>
          )}
        </div>
      </section>

      <main className="relative mx-auto -mt-20 max-w-[1240px] px-5 pb-20 md:px-8">
        {!user ? (
          <LoginGate title="Login to view your wallet" text="See your balance, recharge history and every payment you have made." redirect="/my-wallet" />
        ) : (
          <>
            {/* balance card */}
            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <div className="rise relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-36px_rgba(23,18,14,.55)] ring-1 ring-ink/[.06] md:p-8">
                <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rotate-45 rounded-[22px] bg-saffron/10" />
                <div className="pointer-events-none absolute right-10 top-16 h-6 w-6 rotate-45 bg-saffron/20" />
                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.16em] text-mutedtext">
                  <WalletIcon className="h-4 w-4 text-saffron" /> Available balance
                </div>
                <div data-testid="balance" className="font-display mt-3 text-[48px] font-semibold leading-none text-ink md:text-[60px]">
                  {inr(wallet.balance)}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href="/wallet-recharge" className="flex h-12 items-center gap-2 rounded-full bg-saffron px-7 text-[14.5px] font-semibold text-white hover:bg-saffron-deep">
                    <Plus className="h-4 w-4" /> Recharge
                  </Link>
                  {[100, 500, 1000].map((a) => (
                    <Link
                      key={a}
                      href={`/wallet-recharge?amount=${a}`}
                      className="flex h-10 items-center rounded-full border border-ink/12 px-4 text-[13px] font-semibold text-ink hover:border-saffron hover:text-saffron"
                    >
                      +{inr(a)}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="rise grid grid-cols-3 gap-3 lg:grid-cols-1" style={{ animationDelay: "80ms" }}>
                {[
                  { k: "Total recharged", v: stats.recharged, icon: ArrowDownLeft },
                  { k: "Bonus earned", v: stats.bonus, icon: Sparkles },
                  { k: "Spent on consultations", v: stats.spent, icon: ArrowUpRight },
                ].map((s) => (
                  <div key={s.k} className="flex flex-col justify-between gap-2 rounded-[22px] bg-white p-4 ring-1 ring-ink/[.06] lg:flex-row lg:items-center lg:p-5">
                    <div className="flex items-center gap-2 text-[11.5px] font-medium leading-tight text-mutedtext lg:text-[13px]">
                      <s.icon className="hidden h-4 w-4 text-saffron lg:block" /> {s.k}
                    </div>
                    <div className="text-[17px] font-semibold text-ink lg:text-[20px]">{inr(s.v)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* tabs */}
            <div className="mt-8 overflow-hidden rounded-[26px] bg-white ring-1 ring-ink/[.06]">
              <div className="flex flex-col gap-3 border-b border-ink/[.07] px-4 pt-4 md:flex-row md:items-end md:justify-between md:px-6">
                <div className="flex gap-1" role="tablist" aria-label="Wallet history">
                  {(
                    [
                      ["transactions", "Wallet Transactions", wallet.txns.length],
                      ["payments", "Payment Logs", wallet.logs.length],
                    ] as const
                  ).map(([k, label, n]) => (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={tab === k}
                      onClick={() => setTab(k)}
                      className={`relative -mb-px flex flex-1 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-2 pb-3.5 pt-1 text-[13.5px] font-semibold transition-colors md:flex-none md:px-4 md:text-[14px] ${
                        tab === k ? "border-saffron text-ink" : "border-transparent text-ink/50 hover:text-ink"
                      }`}
                    >
                      <span className="sm:hidden">{label.replace("Wallet ", "")}</span>
                      <span className="hidden sm:inline">{label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === k ? "bg-saffron text-white" : "bg-ink/[.06] text-ink/60"}`}>{n}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-3">
                  {tab === "transactions"
                    ? (["all", "credit", "debit"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          aria-pressed={txnFilter === f}
                          onClick={() => setTxnFilter(f)}
                          className={`h-8 shrink-0 rounded-full px-3.5 text-[12.5px] font-semibold capitalize ${
                            txnFilter === f ? "bg-ink text-white" : "bg-ivory text-ink/70 ring-1 ring-ink/10 hover:text-ink"
                          }`}
                        >
                          {f}
                        </button>
                      ))
                    : (["all", "Success", "Failed", "Cancelled"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          aria-pressed={logFilter === f}
                          onClick={() => setLogFilter(f)}
                          className={`h-8 shrink-0 rounded-full px-3.5 text-[12.5px] font-semibold capitalize ${
                            logFilter === f ? "bg-ink text-white" : "bg-ivory text-ink/70 ring-1 ring-ink/10 hover:text-ink"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                </div>
              </div>

              <div role="tabpanel">
                {tab === "transactions" ? (
                  wallet.txns.length === 0 ? (
                    <Empty tab="transactions" />
                  ) : txns.length === 0 ? (
                    <p className="px-6 py-12 text-center text-[13.5px] text-mutedtext">No {txnFilter} transactions.</p>
                  ) : (
                    <TxnList txns={txns} />
                  )
                ) : wallet.logs.length === 0 ? (
                  <Empty tab="payments" />
                ) : logs.length === 0 ? (
                  <p className="px-6 py-12 text-center text-[13.5px] text-mutedtext">No {logFilter.toLowerCase()} payments.</p>
                ) : (
                  <LogList logs={logs} name={user.name} phone={user.phone} />
                )}
              </div>
            </div>
            <p className="mt-4 text-center text-[12px] text-mutedtext">Demo wallet — balances and payments are stored only in this browser. No real money is involved.</p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
