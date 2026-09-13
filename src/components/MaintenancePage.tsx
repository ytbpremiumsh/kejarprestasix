import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, LockKeyhole, Mail, MessageCircle, RefreshCw, ShieldCheck, Sparkles, Wrench } from "lucide-react";
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
  const diff = Math.max(0, targetTime - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    done: diff === 0,
  };
}

export function MaintenancePage({ config, embedded = false }: { config: MaintenanceConfig; embedded?: boolean }) {
  const countdown = useCountdown(config.eta);
  const title = config.title || "Website Sedang Diperbarui";
  const message = config.message || "Kami sedang meningkatkan sistem agar layanan dapat digunakan dengan lebih nyaman dan optimal. Silakan kembali beberapa saat lagi.";
  const whatsapp = config.contact_whatsapp?.replace(/\D/g, "");

  return <div data-maintenance-page="true" className={cn("relative overflow-hidden bg-[#f8f7fc] text-indigo-950", embedded ? "min-h-[720px]" : "min-h-screen")}>
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(124,58,237,.10),transparent_28%),radial-gradient(circle_at_88%_82%,rgba(79,70,229,.08),transparent_30%)]" />
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(124,58,237,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,.045)_1px,transparent_1px)] [background-size:44px_44px]" />

    <main className={cn("relative mx-auto flex w-full max-w-6xl items-center px-4 py-6 sm:px-7 sm:py-10", embedded ? "min-h-[720px]" : "min-h-screen")}>
      <section className="w-full overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-[0_30px_90px_rgba(76,29,149,.10)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"><Sparkles className="h-4.5 w-4.5" /></span>
            <div><p className="text-sm font-black tracking-tight">Kejar Prestasi</p><p className="text-[9px] font-bold uppercase tracking-[.18em] text-violet-600">Program Beasiswa Pendidikan</p></div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-amber-700"><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-amber-500 opacity-40" /><span className="relative h-2 w-2 rounded-full bg-amber-500" /></span>Sedang pemeliharaan</span>
        </header>

        <div className="grid lg:grid-cols-[.82fr_1.18fr]">
          <aside className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 sm:p-9 lg:border-b-0 lg:border-r">
            <div aria-hidden className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full border-[30px] border-violet-100/60" />
            <div className="relative flex h-full min-h-[270px] flex-col justify-between gap-8">
              <div>
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-violet-200 bg-white text-violet-600 shadow-[0_15px_35px_rgba(109,40,217,.13)]"><Wrench className="h-7 w-7" /></span>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-violet-600">Peningkatan layanan</p>
                <h2 className="mt-2 max-w-sm text-2xl font-black leading-tight tracking-tight sm:text-3xl">Kami sedang menyiapkan pengalaman yang lebih baik.</h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">Pembaruan dilakukan untuk meningkatkan stabilitas, keamanan, dan kenyamanan layanan.</p>
              </div>
              <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-xs leading-5 text-emerald-800"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><span><strong className="block">Data tetap aman</strong>Seluruh data peserta tetap terlindungi selama pemeliharaan.</span></div>
            </div>
          </aside>

          <div className="p-6 sm:p-9 lg:p-11">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600">Informasi layanan</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[44px]">{title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{message}</p>

            {countdown && !countdown.done && <section className="mt-7 rounded-2xl border border-violet-100 bg-violet-50/45 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.15em] text-violet-700"><Clock3 className="h-4 w-4" />Estimasi kembali online</div>
              <div className="grid grid-cols-4 gap-2">{[
                { value: countdown.days, label: "Hari" }, { value: countdown.hours, label: "Jam" },
                { value: countdown.minutes, label: "Menit" }, { value: countdown.seconds, label: "Detik" },
              ].map((item) => <div key={item.label} className="rounded-xl border border-violet-100 bg-white px-1 py-3 text-center shadow-sm sm:py-4"><p className="text-xl font-black tabular-nums text-violet-700 sm:text-2xl">{String(item.value).padStart(2, "0")}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-slate-400 sm:text-[9px]">{item.label}</p></div>)}</div>
            </section>}
            {countdown?.done && <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">Estimasi pemeliharaan telah selesai. Silakan periksa kembali website.</div>}

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Button size="lg" onClick={() => window.location.reload()} className="min-h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 font-extrabold shadow-lg shadow-violet-200 hover:from-violet-700 hover:to-indigo-700"><RefreshCw className="mr-2 h-4 w-4" />Periksa Kembali</Button>
              {whatsapp && <Button asChild size="lg" variant="outline" className="min-h-12 rounded-xl border-violet-200 px-5 text-violet-700 hover:bg-violet-50"><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp<ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>}
              {config.contact_email && <Button asChild size="lg" variant="outline" className="min-h-12 rounded-xl border-violet-200 px-5 text-violet-700 hover:bg-violet-50"><a href={`mailto:${config.contact_email}`}><Mail className="mr-2 h-4 w-4" />Email</a></Button>}
            </div>

            <footer className="mt-8 flex flex-col gap-3 border-t border-violet-100 pt-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Beasiswa Kejar Prestasi</span><a href="/login" className="inline-flex w-fit items-center gap-2 font-bold text-violet-600 transition hover:text-violet-800"><LockKeyhole className="h-3.5 w-3.5" />Akses Administrator</a></footer>
          </div>
        </div>
      </section>
    </main>
  </div>;
}
