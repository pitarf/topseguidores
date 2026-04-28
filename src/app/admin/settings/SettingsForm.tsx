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
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Configurações de SEO & Branding</h1>
        <p className="text-zinc-400">Gerencie como seu site aparece no Google e redes sociais.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
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
            rows={4}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none transition-all resize-none"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
