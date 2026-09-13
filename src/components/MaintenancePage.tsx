import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Clock3, LockKeyhole, Mail, MessageCircle, RefreshCw, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MaintenanceConfig = {
  enabled?: boolean;
  title?: string;
  message?: string;
  eta?: string;
  contact_email?: string;
  contact_whatsapp?: string;
};

function useCountdown(target?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  if (!target) return null;
  const targetTime = new Date(target).getTime();
  if (!Number.isFinite(targetTime)) return null;
  const difference = Math.max(0, targetTime - now);
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
    seconds: Math.floor((difference % 60_000) / 1000),
    done: difference === 0,
  };
}

export function MaintenancePage({ config, embedded = false }: { config: MaintenanceConfig; embedded?: boolean }) {
  const countdown = useCountdown(config.eta);
  const title = config.title || "Website Sedang Diperbarui";
  const message = config.message || "Kami sedang meningkatkan sistem agar layanan dapat digunakan dengan lebih nyaman dan optimal. Silakan kembali beberapa saat lagi.";
  const whatsapp = config.contact_whatsapp?.replace(/\D/g, "");

  const page = <div
    data-maintenance-page="true"
    data-maintenance-embedded={embedded ? "true" : undefined}
    style={!embedded ? { width: "100vw", minWidth: "100vw", maxWidth: "none", transform: "none" } : undefined}
    className={cn(
      "overflow-y-auto bg-[#f8f7fc] text-indigo-950",
      embedded ? "relative min-h-[700px] w-full" : "fixed inset-0 z-[999999] min-h-screen w-screen",
    )}
  >
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,.11),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,.08),transparent_34%)]" />
    <main style={{ width: "100%" }} className={cn("relative mx-auto flex w-full max-w-[1000px] items-center px-4 py-6 sm:px-6 sm:py-10", embedded ? "min-h-[700px]" : "min-h-screen")}>
      <section className="w-full min-w-0 overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-[0_28px_80px_rgba(76,29,149,.12)]">
        <header className="flex flex-col gap-4 border-b border-violet-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"><Sparkles className="h-5 w-5" /></span>
            <div className="min-w-0"><p className="truncate text-base font-black tracking-tight">Kejar Prestasi</p><p className="text-[9px] font-bold uppercase tracking-[.16em] text-violet-600 sm:text-[10px]">Program Beasiswa Pendidikan</p></div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[9px] font-black uppercase tracking-[.13em] text-amber-700 sm:text-[10px]"><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-amber-500 opacity-40" /><span className="relative h-2 w-2 rounded-full bg-amber-500" /></span>Sedang pemeliharaan</span>
        </header>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-600 shadow-sm"><Wrench className="h-7 w-7" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">Informasi layanan</p>
              <h1 className="mt-3 break-words text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[44px]">{title}</h1>
              <p className="mt-4 max-w-2xl break-words text-sm leading-7 text-slate-600 sm:text-base">{message}</p>
            </div>
          </div>

          {countdown && !countdown.done && <section className="mt-7 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] text-violet-700"><Clock3 className="h-4 w-4" />Estimasi kembali online</div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">{[
              { value: countdown.days, label: "Hari" }, { value: countdown.hours, label: "Jam" },
              { value: countdown.minutes, label: "Menit" }, { value: countdown.seconds, label: "Detik" },
            ].map((item) => <div key={item.label} className="min-w-0 rounded-xl border border-violet-100 bg-white px-2 py-3 text-center shadow-sm sm:py-4"><p className="text-2xl font-black tabular-nums text-violet-700">{String(item.value).padStart(2, "0")}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p></div>)}</div>
          </section>}
          {countdown?.done && <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Estimasi pemeliharaan telah selesai. Silakan periksa kembali website.</div>}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" onClick={() => window.location.reload()} className="min-h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 font-extrabold shadow-lg shadow-violet-200 hover:from-violet-700 hover:to-indigo-700"><RefreshCw className="mr-2 h-4 w-4" />Periksa Kembali</Button>
            {whatsapp && <Button asChild size="lg" variant="outline" className="min-h-12 rounded-xl border-violet-200 px-5 text-violet-700 hover:bg-violet-50"><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" />Hubungi WhatsApp</a></Button>}
            {config.contact_email && <Button asChild size="lg" variant="outline" className="min-h-12 rounded-xl border-violet-200 px-5 text-violet-700 hover:bg-violet-50"><a href={`mailto:${config.contact_email}`}><Mail className="mr-2 h-4 w-4" />Hubungi Email</a></Button>}
          </div>

          <div className="mt-8 grid gap-3 border-t border-violet-100 pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-start gap-2 text-[11px] leading-5 text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>Data peserta tetap aman selama proses pemeliharaan berlangsung.</span></div>
            <a href="/login" className="inline-flex w-fit items-center gap-2 text-[11px] font-bold text-violet-600 transition hover:text-violet-800"><LockKeyhole className="h-3.5 w-3.5" />Akses Administrator</a>
          </div>
        </div>
      </section>
    </main>
  </div>;

  if (embedded || typeof document === "undefined") return page;
  return createPortal(page, document.body);
}
