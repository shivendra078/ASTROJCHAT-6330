import { BadgeCheck, MessageCircle, Phone, Star, Clock, Languages, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { fmtOrders, type Astrologer } from "../landing/data";

export type Mode = "chat" | "call";

export function ConsultCard({ a, mode, onStart }: { a: Astrologer; mode: Mode; onStart: (a: Astrologer) => void }) {
  const Icon = mode === "chat" ? MessageCircle : Phone;
  const verb = mode === "chat" ? "Chat" : "Call";
  const discount = a.oldPrice ? Math.round(((a.oldPrice - a.price) / a.oldPrice) * 100) : 0;

  return (
    <article className="group relative flex flex-col rounded-[22px] bg-white p-4 ring-1 ring-ink/[.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-28px_rgba(23,18,14,.45)]">
      {a.tag && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
          {a.tag}
        </span>
      )}

      <div className="flex gap-4">
        <div className="relative shrink-0">
          <Link
            href={`/astrologer/${a.id}`}
            aria-label={`View ${a.name}'s profile`}
            className={`block h-[92px] w-[92px] overflow-hidden rounded-full p-[3px] ${
              a.status === "online" ? "bg-green-500" : a.status === "busy" ? "bg-red-500" : "bg-ink/15"
            }`}
          >
            <img src={a.img} alt={a.name} className="h-full w-full rounded-full object-cover" />
          </Link>
          <div className="mt-2 flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.round(a.rating) ? "fill-gold text-gold" : "text-ink/15"}`} />
            ))}
          </div>
          <div className="text-center text-[11px] text-mutedtext">{fmtOrders(a.orders)} orders</div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1 text-[16px] font-semibold text-ink">
            <Link href={`/astrologer/${a.id}`} className="truncate hover:text-saffron">
              {a.name}
            </Link>
            <BadgeCheck className="h-4 w-4 shrink-0 fill-saffron text-white" />
          </h3>
          <p className="mt-1 truncate text-[12.5px] text-ink/75">{a.skills.join(", ")}</p>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] text-mutedtext">
            <Languages className="h-3.5 w-3.5 shrink-0" /> {a.langs.join(", ")}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-mutedtext">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" /> Exp: {a.exp} years
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            {a.oldPrice && <span className="text-[12.5px] text-mutedtext line-through">₹{a.oldPrice}</span>}
            <span className="text-[16px] font-semibold text-ink">
              ₹{a.price}
              <span className="text-[12px] font-normal text-mutedtext">/min</span>
            </span>
            {discount > 0 && <span className="text-[11.5px] font-semibold text-green-700">{discount}% off</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/[.06] pt-3">
        <div className="text-[12px]">
          {a.status === "online" && <span className="font-medium text-green-700">● Available now</span>}
          {a.status === "busy" && (
            <span className="flex items-center gap-1 font-medium text-red-600">
              <Clock className="h-3.5 w-3.5" /> Wait ~{a.wait} min
            </span>
          )}
          {a.status === "offline" && <span className="text-mutedtext">Offline · back at 7 PM</span>}
        </div>

        {a.status === "online" && (
          <button
            type="button"
            onClick={() => onStart(a)}
            className="flex h-10 items-center gap-1.5 rounded-full bg-saffron px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-saffron-deep"
          >
            <Icon className="h-4 w-4" /> {verb}
          </button>
        )}
        {a.status === "busy" && (
          <button
            type="button"
            onClick={() => onStart(a)}
            className="flex h-10 items-center gap-1.5 rounded-full border border-red-500 px-4 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <Icon className="h-4 w-4" /> Join waitlist
          </button>
        )}
        {a.status === "offline" && (
          <button
            type="button"
            onClick={() => onStart(a)}
            className="flex h-10 items-center gap-1.5 rounded-full border border-ink/15 px-4 text-[13px] font-semibold text-ink/60 transition-colors hover:border-ink/40"
          >
            Notify me
          </button>
        )}
      </div>
    </article>
  );
}
