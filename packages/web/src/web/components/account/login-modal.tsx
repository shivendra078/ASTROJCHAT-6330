import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { X, Phone, ShieldCheck, ArrowLeft, Info } from "lucide-react";
import { useLoginOpen, closeLogin, login, takeRedirect, DEMO_OTP } from "../../lib/account";

export function LoginModal() {
  const open = useLoginOpen();
  if (!open) return null;
  return <LoginSheet />;
}

function LoginSheet() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [timer, setTimer] = useState(0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const isNew = typeof window !== "undefined" && !localStorage.getItem(`astroj.profile.${phone}`);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeLogin();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (step === "phone") phoneRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErr("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setErr("");
    setStep("otp");
    setOtp(["", "", "", ""]);
    setTimer(30);
    setTimeout(() => boxes.current[0]?.focus(), 50);
  };

  const verify = () => {
    const code = otp.join("");
    if (code.length < 4) return setErr("Enter the 4-digit OTP");
    if (code !== DEMO_OTP) return setErr("Incorrect OTP. For this demo, use 1234.");
    login(phone, name);
    closeLogin();
    const r = takeRedirect();
    if (r) navigate(r);
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "");
    if (d.length > 1) {
      // pasted full code
      const arr = d.slice(0, 4).split("");
      setOtp([0, 1, 2, 3].map((k) => arr[k] ?? ""));
      boxes.current[Math.min(arr.length, 3)]?.focus();
      return;
    }
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    setErr("");
    if (d && i < 3) boxes.current[i + 1]?.focus();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close login" className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" onClick={closeLogin} />
      <div className="rise relative w-full max-w-[440px] overflow-hidden rounded-t-[28px] bg-ivory shadow-2xl sm:rounded-[28px]">
        <div className="grain relative overflow-hidden bg-cocoa px-7 pb-7 pt-6 text-white">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-saffron/35 blur-[60px]" />
          <div className="relative flex items-center justify-between">
            {step === "otp" ? (
              <button type="button" aria-label="Back" onClick={() => setStep("phone")} className="-ml-2 rounded-full p-2 text-white/70 hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <img src="/images/mark-solid.png" alt="" className="h-9 w-9" />
            )}
            <button type="button" aria-label="Close" onClick={closeLogin} className="-mr-2 rounded-full p-2 text-white/70 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="font-display relative mt-4 text-[28px] font-semibold leading-tight">
            {step === "phone" ? (
              <>
                Continue with <em className="font-medium italic text-saffron">phone</em>
              </>
            ) : (
              <>
                Verify <em className="font-medium italic text-saffron">OTP</em>
              </>
            )}
          </h2>
          <p className="relative mt-1.5 text-[13.5px] text-white/60">
            {step === "phone" ? "Login or sign up to chat, call and manage your wallet." : `Sent to +91 ${phone.slice(0, 5)} ${phone.slice(5)}`}
          </p>
        </div>

        <div className="px-7 pb-7 pt-6">
          {step === "phone" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp();
              }}
            >
              <label className="block text-[12.5px] font-semibold text-ink">
                Mobile number
                <div className={`mt-2 flex h-[52px] items-center rounded-2xl border bg-white px-4 ${err ? "border-red-500" : "border-ink/12 focus-within:border-saffron"}`}>
                  <Phone className="h-4 w-4 text-ink/40" />
                  <span className="ml-3 border-r border-ink/10 pr-3 text-[15px] font-semibold text-ink">+91</span>
                  <input
                    ref={phoneRef}
                    aria-label="Mobile number"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setErr("");
                    }}
                    placeholder="98765 43210"
                    className="ml-3 h-full flex-1 bg-transparent text-[15.5px] font-medium tracking-wide text-ink outline-none placeholder:font-normal placeholder:text-ink/30"
                  />
                </div>
              </label>
              {err && <p className="mt-2 text-[12.5px] text-red-600">{err}</p>}
              <button type="submit" className="mt-5 h-12 w-full rounded-full bg-saffron text-[14.5px] font-semibold text-white hover:bg-saffron-deep">
                Get OTP
              </button>
              <p className="mt-4 text-center text-[11.5px] leading-relaxed text-mutedtext">By continuing you agree to our Terms of Use and Privacy Policy.</p>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verify();
              }}
            >
              <fieldset>
                <legend className="text-[12.5px] font-semibold text-ink">Enter 4-digit OTP</legend>
                <div className="mt-2 flex gap-3">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        boxes.current[i] = el;
                      }}
                      aria-label={`OTP digit ${i + 1}`}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) boxes.current[i - 1]?.focus();
                      }}
                      className={`h-14 w-full rounded-2xl border bg-white text-center text-[22px] font-semibold text-ink outline-none ${
                        err ? "border-red-500" : "border-ink/12 focus:border-saffron"
                      }`}
                    />
                  ))}
                </div>
              </fieldset>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-saffron/10 px-3 py-2 text-[12px] text-saffron-deep">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>
                  Demo mode — no SMS is sent. Use OTP <b>{DEMO_OTP}</b>.
                </span>
              </div>
              {isNew && (
                <label className="mt-4 block text-[12.5px] font-semibold text-ink">
                  Your name <span className="font-normal text-mutedtext">(optional)</span>
                  <input
                    aria-label="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 40))}
                    placeholder="e.g. Priya Sharma"
                    className="mt-2 h-12 w-full rounded-2xl border border-ink/12 bg-white px-4 text-[15px] text-ink outline-none focus:border-saffron"
                  />
                </label>
              )}
              {err && <p className="mt-2 text-[12.5px] text-red-600">{err}</p>}
              <button type="submit" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-saffron text-[14.5px] font-semibold text-white hover:bg-saffron-deep">
                <ShieldCheck className="h-4 w-4" /> Verify & continue
              </button>
              <div className="mt-4 text-center text-[12.5px] text-mutedtext">
                {timer > 0 ? (
                  <>Resend OTP in 0:{String(timer).padStart(2, "0")}</>
                ) : (
                  <button type="button" onClick={() => setTimer(30)} className="font-semibold text-saffron hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
