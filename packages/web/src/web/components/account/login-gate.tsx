import { Lock } from "lucide-react";
import { openLogin } from "../../lib/account";

export function LoginGate({ title, text, redirect }: { title: string; text: string; redirect: string }) {
  return (
    <div className="mx-auto flex max-w-[520px] flex-col items-center rounded-[28px] bg-white px-6 py-14 text-center ring-1 ring-ink/[.06]">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron/10">
        <Lock className="h-6 w-6 text-saffron" />
      </span>
      <h2 className="font-display mt-5 text-[26px] font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-[360px] text-[14px] leading-relaxed text-mutedtext">{text}</p>
      <button
        type="button"
        onClick={() => openLogin(redirect)}
        className="mt-6 h-12 rounded-full bg-saffron px-8 text-[14.5px] font-semibold text-white hover:bg-saffron-deep"
      >
        Login to continue
      </button>
    </div>
  );
}
