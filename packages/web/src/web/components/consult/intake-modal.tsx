import { useEffect, useState } from "react";
import { X, MessageCircle, Phone, ShieldCheck, Bell, Gift } from "lucide-react";
import { TOPICS, type Astrologer } from "../landing/data";
import type { Mode } from "./consult-card";

type Step = "form" | "connecting" | "notify";

const TITLES = ["Dr.", "Pt.", "Acharya", "Swami"];
const shortName = (n: string) => n.split(" ").filter((w) => !TITLES.includes(w))[0] ?? n;

const inputCls =
  "h-11 w-full rounded-xl border border-ink/12 bg-white px-3.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-saffron";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-ink/65">{label}</span>
      {children}
    </label>
  );
}

export function IntakeModal({ a, mode, onClose }: { a: Astrologer; mode: Mode; onClose: () => void }) {
  const [step, setStep] = useState<Step>(a.status === "offline" ? "notify" : "form");
  const [unknownTime, setUnknownTime] = useState(false);
  const [notified, setNotified] = useState(false);
  const [error, setError] = useState("");
  const [secs, setSecs] = useState(a.status === "busy" ? (a.wait ?? 5) * 60 : 60);

  const Icon = mode === "chat" ? MessageCircle : Phone;
  const noun = mode === "chat" ? "chat" : "call";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (step !== "connecting") return;
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const dob = String(fd.get("dob") || "");
    const pob = String(fd.get("pob") || "").trim();
    const phone = String(fd.get("phone") || "").replace(/\D/g, "");
    if (!name || !dob || !pob) return setError("Please fill in your name, date and place of birth.");
    if (mode === "call" && phone.length !== 10) return setError("Enter a valid 10-digit mobile number.");
    setError("");
    setStep("connecting");
  };

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="rise relative max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-[28px] bg-ivory sm:rounded-[28px]">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-ink/[.07] bg-ivory px-5 py-4">
          <img src={a.img} alt="" className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold text-ink">{a.name}</div>
            <div className="text-[12px] text-mutedtext">
              ₹{a.price}/min · {a.skills.slice(0, 2).join(", ")}
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-1.5 text-ink/60 hover:bg-ink/5 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "form" && (
          <form onSubmit={submit} className="px-5 pb-6 pt-5">
            <div className="flex items-center gap-2.5 rounded-2xl bg-saffron/10 px-4 py-3 text-[13px] text-ink">
              <Gift className="h-5 w-5 shrink-0 text-saffron" />
              <span>
                Your <b>first {noun} is free</b> for up to 5 minutes. No payment needed.
              </span>
            </div>

            <h3 className="font-display mt-5 text-[24px] font-semibold leading-tight text-ink">Birth details</h3>
            <p className="mt-1 text-[13px] text-mutedtext">{shortName(a.name)} needs these to prepare your kundli before the {noun}.</p>

            <div className="mt-5 grid gap-4">
              <Field label="Full name">
                <input name="name" aria-label="Full name" className={inputCls} placeholder="e.g. Priya Sharma" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gender">
                  <select name="gender" aria-label="Gender" className={inputCls} defaultValue="Female">
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Date of birth">
                  <input name="dob" aria-label="Date of birth" type="date" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Time of birth">
                  <input name="tob" aria-label="Time of birth" type="time" disabled={unknownTime} className={`${inputCls} disabled:opacity-40`} />
                </Field>
                <Field label="Place of birth">
                  <input name="pob" aria-label="Place of birth" className={inputCls} placeholder="City, State" />
                </Field>
              </div>
              <label className="-mt-1 flex items-center gap-2 text-[12.5px] text-ink/70">
                <input type="checkbox" aria-label="Unknown birth time" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} className="accent-saffron" />
                I don't know my exact time of birth
              </label>
              <Field label="What would you like to ask about?">
                <select name="topic" aria-label="Topic" className={inputCls} defaultValue={a.topics[0]}>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              {mode === "call" && (
                <Field label="Mobile number for the call">
                  <div className="flex">
                    <span className="flex h-11 items-center rounded-l-xl border border-r-0 border-ink/12 bg-sand px-3 text-[14px] text-ink/70">
                      +91
                    </span>
                    <input name="phone" aria-label="Mobile number" inputMode="numeric" className={`${inputCls} rounded-l-none`} placeholder="98765 43210" />
                  </div>
                </Field>
              )}
            </div>

            {error && <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] text-red-700">{error}</p>}

            <button
              type="submit"
              className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-saffron text-[15px] font-semibold text-white transition-colors hover:bg-saffron-deep"
            >
              <Icon className="h-[18px] w-[18px]" />
              {a.status === "busy" ? `Join waitlist for ${noun}` : `Start free ${noun} with ${shortName(a.name)}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-mutedtext">
              <ShieldCheck className="h-3.5 w-3.5" /> Your details are 100% private and never shared.
            </p>
          </form>
        )}

        {step === "connecting" && (
          <div className="px-6 pb-8 pt-10 text-center">
            <div className="relative mx-auto h-32 w-32">
              <span className="absolute inset-0 animate-ping rounded-full bg-saffron/30" />
              <span className="absolute -inset-3 rounded-full border border-saffron/30" />
              <img src={a.img} alt="" className="relative h-32 w-32 rounded-full object-cover ring-4 ring-white" />
              <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-saffron text-white ring-4 ring-ivory">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <h3 className="font-display mt-8 text-[24px] font-semibold text-ink">
              {a.status === "busy" ? "You're on the waitlist" : `Connecting your ${noun}…`}
            </h3>
            <p className="mx-auto mt-2 max-w-[340px] text-[14px] leading-relaxed text-mutedtext">
              {a.status === "busy"
                ? `${a.name} is in another session. We'll connect you automatically when they're free.`
                : mode === "chat"
                  ? `Waiting for ${a.name} to accept your chat request.`
                  : `${a.name} will call you on your number shortly. Keep your phone nearby.`}
            </p>
            <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-sand px-4 py-2 text-[13px] text-ink">
              Estimated wait <b className="tabular-nums">{mm}:{ss}</b>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mx-auto mt-8 block h-11 rounded-full border border-ink/15 px-6 text-[13.5px] font-semibold text-ink hover:border-ink/40"
            >
              Cancel request
            </button>
          </div>
        )}

        {step === "notify" && (
          <div className="px-6 pb-8 pt-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-saffron/10">
              <Bell className="h-7 w-7 text-saffron" />
            </div>
            <h3 className="font-display mt-6 text-[24px] font-semibold text-ink">{a.name} is offline</h3>
            <p className="mx-auto mt-2 max-w-[340px] text-[14px] leading-relaxed text-mutedtext">
              We'll send you a notification as soon as they're back online, usually around 7 PM.
            </p>
            <button
              type="button"
              disabled={notified}
              onClick={() => setNotified(true)}
              className="mx-auto mt-7 flex h-11 items-center gap-2 rounded-full bg-saffron px-6 text-[14px] font-semibold text-white hover:bg-saffron-deep disabled:bg-green-600"
            >
              <Bell className="h-4 w-4" /> {notified ? "We'll notify you" : "Notify me"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
