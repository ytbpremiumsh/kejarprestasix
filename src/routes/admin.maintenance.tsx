import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock3, Eye, Info, Loader2, Mail, MessageCircle, Save, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { MaintenancePage, type MaintenanceConfig } from "@/components/MaintenancePage";
import { AdminPageHeader, adminPanelClass } from "@/components/admin/AdminWorkspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/maintenance")({ component: AdminMaintenance });

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function AdminMaintenance() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [cfg, setCfg] = useState<MaintenanceConfig & { etaLocal?: string }>({
    enabled: false,
    title: "Website Sedang Diperbarui",
    message: "Kami sedang meningkatkan sistem agar layanan dapat digunakan dengan lebih nyaman dan optimal. Silakan kembali beberapa saat lagi.",
    contact_email: "",
    contact_whatsapp: "",
    etaLocal: "",
  });

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "maintenance").maybeSingle();
      if (error) toast.error("Pengaturan maintenance gagal dimuat");
      const value = (data?.value as MaintenanceConfig) || {};
      setCfg({
        enabled: !!value.enabled,
        title: value.title || "Website Sedang Diperbarui",
        message: value.message || "Kami sedang meningkatkan sistem agar layanan dapat digunakan dengan lebih nyaman dan optimal. Silakan kembali beberapa saat lagi.",
        contact_email: value.contact_email || "",
        contact_whatsapp: value.contact_whatsapp || "",
        eta: value.eta,
        etaLocal: toLocalInput(value.eta),
      });
      setLoading(false);
    })();
  }, []);

  const previewConfig: MaintenanceConfig = {
    ...cfg,
    eta: cfg.etaLocal ? new Date(cfg.etaLocal).toISOString() : undefined,
  };

  const save = async () => {
    if (!cfg.title?.trim() || !cfg.message?.trim()) return toast.error("Judul dan pesan maintenance wajib diisi");
    setSaving(true);
    try {
      const payload: MaintenanceConfig = {
        enabled: !!cfg.enabled,
        title: cfg.title.trim(),
        message: cfg.message.trim(),
        contact_email: cfg.contact_email?.trim(),
        contact_whatsapp: cfg.contact_whatsapp?.trim(),
        eta: cfg.etaLocal ? new Date(cfg.etaLocal).toISOString() : undefined,
      };
      const { error } = await supabase.from("site_settings").upsert({ key: "maintenance", value: payload }, { onConflict: "key" });
      if (error) throw error;
      toast.success(payload.enabled ? "Mode maintenance berhasil diaktifkan" : "Website kembali dalam mode normal");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pengaturan gagal disimpan");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="grid min-h-[55vh] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-violet-600" /></div>;

  return <div className="space-y-5">
    <AdminPageHeader eyebrow="Sistem · Kontrol Akses" title="Mode Maintenance" description="Atur halaman pemeliharaan untuk pengunjung. Administrator yang sudah login tetap dapat mengakses dan mengelola website." icon={Wrench} actions={<><Button variant="outline" onClick={() => setPreview(true)} className="border-violet-200 text-violet-700 hover:bg-violet-50"><Eye className="mr-2 h-4 w-4" />Preview</Button><Button onClick={save} disabled={saving} className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-200 hover:from-violet-700 hover:to-indigo-700">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Simpan Perubahan</Button></>} />

    <section className={cn(adminPanelClass, "overflow-hidden")}>
      <div className={cn("flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6", cfg.enabled ? "bg-gradient-to-r from-amber-50 to-orange-50" : "bg-gradient-to-r from-emerald-50 to-teal-50")}>
        <div className="flex items-start gap-4">
          <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl border bg-white shadow-sm", cfg.enabled ? "border-amber-200 text-amber-600" : "border-emerald-200 text-emerald-600")}><Wrench className="h-5 w-5" /></span>
          <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-indigo-950">Status Website</h2><span className={cn("rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider", cfg.enabled ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>{cfg.enabled ? "Maintenance aktif" : "Website online"}</span></div><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{cfg.enabled ? "Pengunjung umum akan melihat halaman maintenance setelah pengaturan disimpan." : "Seluruh halaman publik dapat diakses seperti biasa."}</p></div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm sm:min-w-52"><div><p className="text-sm font-bold text-indigo-950">Aktifkan Maintenance</p><p className="text-[10px] text-slate-400">Berlaku untuk pengunjung</p></div><Switch checked={!!cfg.enabled} onCheckedChange={(enabled) => setCfg({ ...cfg, enabled })} /></div>
      </div>
    </section>

    <div className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
      <section className={cn(adminPanelClass, "p-5 sm:p-6")}>
        <div className="mb-6"><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-600">Konten halaman</p><h2 className="mt-1 text-lg font-black text-indigo-950">Informasi untuk Pengunjung</h2><p className="mt-1 text-xs leading-5 text-slate-500">Gunakan pesan yang singkat dan informatif agar pengunjung memahami kondisi website.</p></div>
        <div className="space-y-5">
          <div className="space-y-2"><Label htmlFor="maintenance-title" className="font-bold text-indigo-950">Judul utama</Label><Input id="maintenance-title" value={cfg.title || ""} onChange={(event) => setCfg({ ...cfg, title: event.target.value })} placeholder="Website Sedang Diperbarui" className="h-12 rounded-xl border-violet-100 focus-visible:ring-violet-400" /><p className="text-[11px] text-slate-400">Tampil sebagai informasi utama pada halaman maintenance.</p></div>
          <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="maintenance-message" className="font-bold text-indigo-950">Pesan penjelasan</Label><span className="text-[10px] font-semibold text-slate-400">{cfg.message?.length || 0} karakter</span></div><Textarea id="maintenance-message" rows={5} value={cfg.message || ""} onChange={(event) => setCfg({ ...cfg, message: event.target.value })} placeholder="Jelaskan pembaruan yang sedang dilakukan..." className="resize-none rounded-xl border-violet-100 leading-6 focus-visible:ring-violet-400" /></div>
          <div className="space-y-2"><Label htmlFor="maintenance-eta" className="flex items-center gap-2 font-bold text-indigo-950"><Clock3 className="h-4 w-4 text-violet-600" />Estimasi kembali online <span className="font-normal text-slate-400">(opsional)</span></Label><Input id="maintenance-eta" type="datetime-local" value={cfg.etaLocal || ""} onChange={(event) => setCfg({ ...cfg, etaLocal: event.target.value })} className="h-12 rounded-xl border-violet-100 focus-visible:ring-violet-400" /><p className="text-[11px] text-slate-400">Jika diisi, countdown otomatis ditampilkan kepada pengunjung.</p></div>
        </div>
      </section>

      <aside className="space-y-5">
        <section className={cn(adminPanelClass, "p-5 sm:p-6")}><div className="mb-5"><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-600">Kontak bantuan</p><h2 className="mt-1 text-lg font-black text-indigo-950">Saluran Informasi</h2></div><div className="space-y-4"><div className="space-y-2"><Label htmlFor="maintenance-whatsapp" className="flex items-center gap-2 text-sm font-bold text-indigo-950"><MessageCircle className="h-4 w-4 text-emerald-600" />WhatsApp</Label><Input id="maintenance-whatsapp" placeholder="0878 7834 4426" value={cfg.contact_whatsapp || ""} onChange={(event) => setCfg({ ...cfg, contact_whatsapp: event.target.value })} className="h-11 rounded-xl border-violet-100" /></div><div className="space-y-2"><Label htmlFor="maintenance-email" className="flex items-center gap-2 text-sm font-bold text-indigo-950"><Mail className="h-4 w-4 text-violet-600" />Email</Label><Input id="maintenance-email" type="email" placeholder="info@kejarprestasi.id" value={cfg.contact_email || ""} onChange={(event) => setCfg({ ...cfg, contact_email: event.target.value })} className="h-11 rounded-xl border-violet-100" /></div></div></section>
        <section className="rounded-[24px] border border-violet-100 bg-violet-50/60 p-5"><div className="flex gap-3"><Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" /><div><p className="text-sm font-black text-indigo-950">Akses admin tetap aman</p><p className="mt-1 text-xs leading-5 text-slate-500">Admin yang sudah login tetap dapat membuka seluruh halaman. Pengunjung umum akan diarahkan ke tampilan maintenance.</p></div></div><div className="mt-4 flex items-center gap-2 border-t border-violet-100 pt-4 text-[11px] font-bold text-emerald-700"><ShieldCheck className="h-4 w-4" />Bypass khusus akun admin</div></section>
      </aside>
    </div>

    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-h-[94vh] max-w-[min(96vw,1200px)] overflow-y-auto rounded-[28px] border-violet-100 p-0"><DialogHeader className="sticky top-0 z-10 border-b border-violet-100 bg-white/95 px-5 py-4 text-left backdrop-blur"><DialogTitle className="flex items-center gap-2 text-indigo-950"><Eye className="h-4 w-4 text-violet-600" />Preview Halaman Maintenance</DialogTitle></DialogHeader><MaintenancePage config={previewConfig} embedded /></DialogContent></Dialog>
  </div>;
}
