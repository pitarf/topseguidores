"use client";

import { useState } from "react";
import { updateSettings } from "./actions";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  id: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  faviconUrl: string | null;
  rapidApiKey: string | null;
  pushinpayToken: string | null;
  pushinpayWebhookToken: string | null;
  perfectPanelUrl: string | null;
  perfectPanelKey: string | null;
}

export default function AdminSettingsPage({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateSettings(settings);
    
    if (result.success) {
      toast.success("Configurações atualizadas com sucesso!");
    } else {
      toast.error(result.error || "Ocorreu um erro ao salvar.");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-zinc-400">Gerencie SEO, Branding e chaves de API das integrações.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* SEO & Branding */}
        <section className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold border-b border-white/5 pb-4">SEO & Branding</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Título do Site</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Favicon URL</label>
              <input
                type="text"
                value={settings.faviconUrl || ""}
                onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
                placeholder="https://exemplo.com/favicon.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Palavras-chave (Keywords)</label>
            <input
              type="text"
              value={settings.siteKeywords}
              onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Descrição do Site (Meta Description)</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all resize-none"
            />
          </div>
        </section>

        {/* RapidAPI - Scrapers */}
        <section className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold border-b border-white/5 pb-4 text-blue-400">RapidAPI (Busca de Perfis)</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">X-RapidAPI-Key</label>
            <input
              type="password"
              value={settings.rapidApiKey || ""}
              onChange={(e) => setSettings({ ...settings, rapidApiKey: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
              placeholder="Sua chave alfanumérica longa"
            />
            <p className="text-[10px] text-zinc-500">Utilizada para Instagram Scraper 21 e TikTok API Mediacrawlers.</p>
          </div>
        </section>

        {/* PushinPay - Pagamentos */}
        <section className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold border-b border-white/5 pb-4 text-emerald-400">PushinPay (PIX)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">PushinPay Token</label>
              <input
                type="password"
                value={settings.pushinpayToken || ""}
                onChange={(e) => setSettings({ ...settings, pushinpayToken: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Webhook Token</label>
              <input
                type="password"
                value={settings.pushinpayWebhookToken || ""}
                onChange={(e) => setSettings({ ...settings, pushinpayWebhookToken: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* PerfectPanel - Fornecedor SMM */}
        <section className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold border-b border-white/5 pb-4 text-purple-400">PerfectPanel (Entrega SMM)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">URL da API</label>
              <input
                type="text"
                value={settings.perfectPanelUrl || ""}
                onChange={(e) => setSettings({ ...settings, perfectPanelUrl: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
                placeholder="https://painel.com/api/v2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Chave de API (Key)</label>
              <input
                type="password"
                value={settings.perfectPanelKey || ""}
                onChange={(e) => setSettings({ ...settings, perfectPanelKey: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 active:scale-95"
          >
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Todas as Configurações"}
          </button>
        </div>
      </form>
    </div>
  );
}
