import { Link } from "wouter";
import { Clock, Eye } from "lucide-react";
import { authorOf, fmtPostDate, fmtViews, readMins, type Post } from "../../lib/blog";

export function Meta({ p, light = false }: { p: Post; light?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] ${light ? "text-white/65" : "text-mutedtext"}`}>
      <span>{fmtPostDate(p.date)}</span>
      <span className={`h-1 w-1 rounded-full ${light ? "bg-white/40" : "bg-ink/25"}`} />
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" /> {readMins(p)} min
      </span>
      <span className="flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" /> {fmtViews(p.views)}
      </span>
    </div>
  );
}

export function PostCard({ p }: { p: Post }) {
  const a = authorOf(p);
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-ink/[.06] transition-shadow hover:shadow-[0_24px_48px_-28px_rgba(23,18,14,.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11.5px] font-semibold text-ink">{p.category}</span>
        {p.lang === "Hindi" && <span className="absolute right-4 top-4 rounded-full bg-saffron px-2.5 py-1 text-[11px] font-semibold text-white">हिंदी</span>}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-[17.5px] font-semibold leading-snug text-ink transition-colors group-hover:text-saffron">{p.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-mutedtext">{p.excerpt}</p>
        <div className="mt-auto flex items-center gap-2.5 pt-5">
          <img src={a.img} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-semibold text-ink">{a.name}</div>
            <Meta p={p} />
          </div>
        </div>
      </div>
    </Link>
  );
}

