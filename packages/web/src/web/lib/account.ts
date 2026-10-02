/**
 * Demo account + wallet store. Everything lives in localStorage — there is no
 * backend, no real OTP and no real payment. Swap these functions for API calls
 * when a real auth/payment backend is added.
 */
import { useSyncExternalStore } from "react";

export type User = { phone: string; name: string; joined: string };

export type Txn = {
  id: string;
  at: string; // ISO
  kind: "credit" | "debit";
  amount: number;
  desc: string;
  ref?: string; // order id
  balance: number; // closing balance
};

export type PayStatus = "Success" | "Failed" | "Cancelled";
export type PayLog = {
  id: string; // order id
  at: string;
  amount: number; // wallet amount chosen
  gst: number;
  total: number; // amount + gst
  extra: number; // bonus credited
  method: string;
  status: PayStatus;
  reason?: string;
};

type Wallet = { balance: number; txns: Txn[]; logs: PayLog[] };
type State = { user: User | null; wallet: Wallet };

const USER_KEY = "astroj.user";
const walletKey = (phone: string) => `astroj.wallet.${phone}`;
const EMPTY: Wallet = { balance: 0, txns: [], logs: [] };

function read<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function load(): State {
  if (typeof window === "undefined") return { user: null, wallet: EMPTY };
  const user = read<User | null>(USER_KEY, null);
  return { user, wallet: user ? read<Wallet>(walletKey(user.phone), EMPTY) : EMPTY };
}

let state: State = load();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function commit(next: State) {
  state = next;
  if (next.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(next.user));
    localStorage.setItem(walletKey(next.user.phone), JSON.stringify(next.wallet));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === USER_KEY || e.key?.startsWith("astroj.wallet.")) {
      state = load();
      emit();
    }
  });
}

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

export function useAccount() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

/* ---------------- auth ---------------- */

export const DEMO_OTP = "1234";

export function login(phone: string, name: string) {
  const prev = read<Wallet | null>(walletKey(phone), null);
  const existing = read<User | null>(`astroj.profile.${phone}`, null);
  const user: User = existing ?? { phone, name: name.trim() || "Astro Seeker", joined: new Date().toISOString() };
  if (name.trim() && existing) user.name = name.trim();
  localStorage.setItem(`astroj.profile.${phone}`, JSON.stringify(user));
  commit({ user, wallet: prev ?? EMPTY });
}

export function logout() {
  commit({ user: null, wallet: EMPTY });
}

/* ---------------- login modal bus ---------------- */

let loginOpen = false;
let afterLogin: string | null = null;
const loginSubs = new Set<() => void>();
export function openLogin(redirect?: string) {
  loginOpen = true;
  afterLogin = redirect ?? null;
  loginSubs.forEach((f) => f());
}
export function closeLogin() {
  loginOpen = false;
  loginSubs.forEach((f) => f());
}
export const takeRedirect = () => {
  const r = afterLogin;
  afterLogin = null;
  return r;
};
export function useLoginOpen() {
  return useSyncExternalStore(
    (f) => {
      loginSubs.add(f);
      return () => loginSubs.delete(f);
    },
    () => loginOpen,
    () => false,
  );
}

/* ---------------- wallet ---------------- */

export const GST = 0.18;

export const RECHARGE_PACKS: { amount: number; extra: number; popular?: boolean }[] = [
  { amount: 25, extra: 0 },
  { amount: 50, extra: 0 },
  { amount: 100, extra: 0 },
  { amount: 200, extra: 0 },
  { amount: 500, extra: 5, popular: true },
  { amount: 1000, extra: 5 },
  { amount: 2000, extra: 10 },
  { amount: 3000, extra: 10 },
  { amount: 4000, extra: 12 },
  { amount: 8000, extra: 12 },
  { amount: 15000, extra: 15 },
  { amount: 20000, extra: 15 },
  { amount: 50000, extra: 20 },
  { amount: 100000, extra: 20 },
];

export const MIN_RECHARGE = 25;
export const MAX_RECHARGE = 100000;

export const extraFor = (amount: number) => {
  const pack = [...RECHARGE_PACKS].reverse().find((p) => amount >= p.amount);
  return pack ? Math.round((amount * pack.extra) / 100) : 0;
};

export const bill = (amount: number) => {
  const gst = Math.round(amount * GST * 100) / 100;
  return { amount, gst, total: Math.round((amount + gst) * 100) / 100, extra: extraFor(amount) };
};

const rid = (p: string) => `${p}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

/** Records a (demo) payment attempt. Credits the wallet on success. Returns the log entry. */
export function recordPayment(amount: number, method: string, outcome: PayStatus, reason?: string): PayLog {
  if (!state.user) throw new Error("Not logged in");
  const b = bill(amount);
  const at = new Date().toISOString();
  const log: PayLog = { id: rid("ORD"), at, ...b, method, status: outcome, reason };
  const w = state.wallet;
  let balance = w.balance;
  const txns: Txn[] = [];
  if (outcome === "Success") {
    balance += b.amount;
    txns.push({ id: rid("TXN"), at, kind: "credit", amount: b.amount, desc: `Wallet recharge via ${method}`, ref: log.id, balance });
    if (b.extra > 0) {
      balance += b.extra;
      txns.push({ id: rid("TXN"), at, kind: "credit", amount: b.extra, desc: "Recharge bonus (extra cash)", ref: log.id, balance });
    }
  }
  commit({ ...state, wallet: { balance, txns: [...txns.reverse(), ...w.txns], logs: [log, ...w.logs] } });
  return log;
}

export const inr = (n: number, dp = 0) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp === 0 ? 2 : dp })}`;

export const fmtWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
