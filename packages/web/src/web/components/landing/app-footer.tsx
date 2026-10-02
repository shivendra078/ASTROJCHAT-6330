import { FaApple, FaGooglePlay, FaInstagram, FaYoutube, FaFacebookF, FaXTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { Check, Send, Mail, Phone as PhoneIcon } from "lucide-react";
import { useState } from "react";

const LINK_MAP: Record<string, string> = {
  "Free Kundli": "/free-kundli",
  "Kundli Matching": "/free-kundli",
  Panchang: "/panchang",
  "Chat with Astrologer": "/chat-with-astrologer",
  "Talk to Astrologer": "/talk-to-astrologer",
  Blog: "/blog",
};

function PhoneMock() {
  return (
    <div className="relative mx-auto h-[520px] w-[262px] rounded-[44px] bg-ink p-[10px] shadow-[0_50px_80px_-30px_rgba(23,18,14,.7)] ring-1 ring-black/20">
      <div className="absolute left-1/2 top-[18px] z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex h-full flex-col overflow-hidden rounded-[34px] bg-ivory">
        <div className="flex items-center gap-2.5 bg-cocoa px-4 pb-3 pt-12 text-white">
          <img src="/images/astro-2.jpg" alt="" className="h-9 w-9 rounded-full object-cover" />
          <div className="flex-1">
            <div className="text-[12.5px] font-semibold leading-tight">Meera Iyer</div>
            <div className="text-[10px] text-green-400">● Online · Tarot</div>
          </div>
          <div className="rounded-full bg-white/10 px-2 py-1 text-[10px]">04:32</div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 px-3 py-4 text-[11.5px] leading-snug">
          <div className="max-w-[80%] self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-ink shadow-sm">
            Namaste! Please share your date, time and place of birth.
          </div>
          <div className="max-w-[80%] self-end rounded-2xl rounded-tr-sm bg-saffron px-3 py-2 text-white">
            14 Aug 1996, 6:20 AM, Indore
          </div>
          <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-ink shadow-sm">
            Your Leo ascendant with Jupiter in the 10th looks strong for a career move after March.
          </div>
          <div className="max-w-[70%] self-end rounded-2xl rounded-tr-sm bg-saffron px-3 py-2 text-white">
            That's exactly what I was thinking about!
          </div>
          <div className="flex gap-1 self-start rounded-2xl bg-white px-3 py-3 shadow-sm">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:.3s]" />
          </div>
        </div>
        <div className="m-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-ink/10">
          <span className="flex-1 text-[11px] text-mutedtext">Type your question…</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron">
            <Send className="h-3 w-3 text-white" />
          </span>
        </div>
      </div>
    </div>
  );
}

function StoreButton({ icon: Icon, top, bottom }: { icon: typeof FaApple; top: string; bottom: string }) {
  return (
    <a
      href="#download"
      className="flex h-[56px] items-center gap-3 rounded-2xl bg-ink px-5 text-white transition-transform hover:-translate-y-0.5"
    >
      <Icon className="h-6 w-6" />
      <div className="leading-tight">
        <div className="text-[10.5px] text-white/60">{top}</div>
        <div className="text-[15px] font-semibold">{bottom}</div>
      </div>
    </a>
  );
}

export function AppDownload() {
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <section id="download" className="px-5 pb-24 md:px-8">
      <div className="grain relative mx-auto grid max-w-[1240px] items-center gap-10 overflow-hidden rounded-[36px] bg-saffron px-6 pt-14 md:px-14 grid-cols-1 lg:grid-cols-[1.1fr_.9fr] lg:pt-0">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.35) 0 1px, transparent 1px 28px), repeating-linear-gradient(-45deg, rgba(255,255,255,.35) 0 1px, transparent 1px 28px)",
          }}
        />
        <div className="relative min-w-0 py-4 text-white lg:py-16">
          <div className="text-[12px] font-semibold uppercase tracking-[.18em] text-white/80">Astroj Chat App</div>
          <h2 className="font-display mt-4 text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] text-ink">
            Your astrologer, <em className="font-medium italic text-white">in your pocket</em>
          </h2>
          <ul className="mt-7 space-y-3 text-[15px] text-white">
            {["First consultation free for new users", "Daily horoscope & Panchang alerts", "Free Kundli, matching & reports"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <StoreButton icon={FaGooglePlay} top="GET IT ON" bottom="Google Play" />
            <StoreButton icon={FaApple} top="Download on the" bottom="App Store" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.replace(/\D/g, "").length >= 10) setSent(true);
            }}
            className="mt-6 flex max-w-[420px] items-center gap-2 rounded-full bg-white/95 p-1.5 pl-4"
          >
            <span className="text-[14px] font-medium text-ink/60">+91</span>
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSent(false);
              }}
              inputMode="numeric"
              aria-label="Mobile number"
              placeholder="Get the download link via SMS"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink/40"
            />
            <button type="submit" className="h-10 shrink-0 rounded-full bg-ink px-5 text-[13px] font-semibold text-white">
              {sent ? "Sent ✓" : "Send link"}
            </button>
          </form>
        </div>

        <div className="relative self-end lg:pt-14">
          <div className="translate-y-24 md:translate-y-20">
            <PhoneMock />
          </div>
        </div>
      </div>
    </section>
  );
}

const cols = [
  { title: "Consult", links: ["Chat with Astrologer", "Talk to Astrologer", "Live Sessions", "Book a Pooja", "Astro Mall"] },
  { title: "Free Services", links: ["Free Kundli", "Kundli Matching", "Today's Horoscope", "Panchang", "Numerology Calculator"] },
  { title: "Company", links: ["About Us", "Careers", "Astrologer Registration", "Blog", "Contact Us"] },
  { title: "Legal", links: ["Privacy Policy", "Terms & Conditions", "Refund Policy", "Disclaimer"] },
];

const socials = [
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { icon: FaXTwitter, label: "X", href: "https://x.com" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://whatsapp.com" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-white">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <a href="/" className="flex items-center gap-3">
              <img src="/images/mark-solid.png" alt="" className="h-10 w-10" />
              <span className="text-[22px] font-semibold tracking-tight">
                Astroj<span className="text-saffron"> Chat</span>
              </span>
            </a>
            <p className="mt-5 max-w-[340px] text-[14px] leading-relaxed text-white/55">
              India's most trusted astrology platform. Verified astrologers, honest guidance and complete privacy — 24×7.
            </p>
            <div className="mt-6 space-y-2 text-[13.5px] text-white/70">
              <a href="mailto:support@astrojchat.com" className="flex items-center gap-2 hover:text-saffron">
                <Mail className="h-4 w-4" /> support@astrojchat.com
              </a>
              <a href="tel:+918000000000" className="flex items-center gap-2 hover:text-saffron">
                <PhoneIcon className="h-4 w-4" /> +91 80000 00000
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-saffron hover:bg-saffron hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="text-[12px] font-semibold uppercase tracking-[.16em] text-gold">{c.title}</h4>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href={LINK_MAP[l] ?? "#top"} className="text-[14px] text-white/65 transition-colors hover:text-white">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-white/10 py-6 text-[12.5px] text-white/50">
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron" /> 100% Private & Confidential</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron" /> Verified Astrologers</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron" /> Secure Payments</span>
          <span className="flex items-center gap-2"><Check className="h-4 w-4 text-saffron" /> 24×7 Support</span>
        </div>

        <div className="flex flex-col gap-2 py-7 text-[12.5px] text-white/40 md:flex-row md:justify-between">
          <span>© 2026 Astroj Chat. All rights reserved.</span>
          <span>Astrology guidance is for informational purposes and not a substitute for professional advice.</span>
        </div>
      </div>

      <div
        aria-hidden
        className="font-display pointer-events-none select-none whitespace-nowrap text-center -mb-[3vw] text-[20vw] font-semibold leading-[1] text-white/[.035]"
      >
        Astroj
      </div>
    </footer>
  );
}
