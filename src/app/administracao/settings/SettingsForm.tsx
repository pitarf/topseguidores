"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Eye, EyeOff } from "lucide-react";

export function SettingsForm({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  const toggleShowToken = (field: string) => {
    setShowTokens(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { id, updatedAt, ...payload } = data;
      
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) toast.success("Configurações salvas com sucesso!");
      else toast.error("Erro ao salvar.");
    } catch(e) {
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Branding & SEO */}
      <div className="bg-[#0b111e] border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-6">
        <h2 className="text-xl font-black text-white tracking-tight uppercase">Branding & SEO</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Título do Site</label>
            <input 
              type="text" 
              value={data.siteTitle} 
              onChange={e => setData({...data, siteTitle: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-primary/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Descrição (SEO)</label>
            <textarea 
              value={data.siteDescription} 
              onChange={e => setData({...data, siteDescription: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-primary/50 outline-none h-24 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Palavras-chave</label>
            <input 
              type="text" 
              value={data.siteKeywords} 
              onChange={e => setData({...data, siteKeywords: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-primary/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Favicon URL</label>
            <input 
              type="text" 
              placeholder="https://exemplo.com/favicon.png"
              value={data.faviconUrl || ""} 
              onChange={e => setData({...data, faviconUrl: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-primary/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Logo / OG Image URL</label>
            <input 
              type="text" 
              placeholder="https://exemplo.com/og-image.png"
              value={data.logoUrl || ""} 
              onChange={e => setData({...data, logoUrl: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-primary/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Número do WhatsApp (Suporte)</label>
            <input 
              type="text" 
              placeholder="Ex: 5511999999999"
              value={data.whatsappNumber || ""} 
              onChange={e => setData({...data, whatsappNumber: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-green-500/50 outline-none"
            />
            <p className="text-[10px] text-zinc-500 mt-2 font-bold uppercase tracking-tighter">📌 Use o formato: código do país + DDD + número (ex: 5511988887777)</p>
          </div>

          <div className="pt-4 border-t border-white/5">
             <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={data.showNotifications}
                    onChange={e => setData({...data, showNotifications: e.target.checked})}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${data.showNotifications ? 'bg-primary' : 'bg-zinc-800'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.showNotifications ? 'translate-x-6' : ''}`} />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest">Mostrar Notificações de Venda (Prova Social)</span>
             </label>
          </div>
        </div>
      </div>

      {/* Facebook Tracking */}
      <div className="bg-[#0b111e] border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-6">
        <h2 className="text-xl font-black text-[#1877F2] tracking-tight uppercase mb-6 flex items-center gap-2">
          Facebook Tracking
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Pixel ID</label>
            <input 
              type="text" 
              placeholder="Ex: 1234567890"
              value={data.fbPixelId || ""} 
              onChange={e => setData({...data, fbPixelId: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-[#1877F2]/50 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Conversions API Token (CAPI)</label>
            <textarea 
              placeholder="Ex: EAAB..."
              value={data.fbApiToken || ""} 
              onChange={e => setData({...data, fbApiToken: e.target.value})}
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-[#1877F2]/50 outline-none h-24 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Integrações de API */}
      <div className="bg-[#0b111e] border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-6">
        <h2 className="text-xl font-black text-primary tracking-tight uppercase">Chaves de API</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">X-RapidAPI-Key (TikTok/Insta)</label>
            <div className="relative">
              <input 
                type={showTokens.rapidApiKey ? "text" : "password"} 
                value={data.rapidApiKey || ""} 
                onChange={e => setData({...data, rapidApiKey: e.target.value})}
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 pr-11 text-white text-sm font-medium focus:border-primary/50 outline-none"
              />
              <button
                type="button"
                onClick={() => toggleShowToken("rapidApiKey")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                title={showTokens.rapidApiKey ? "Ocultar" : "Visualizar"}
              >
                {showTokens.rapidApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">PushinPay Token</label>
              <div className="relative">
                <input 
                  type={showTokens.pushinpayToken ? "text" : "password"} 
                  value={data.pushinpayToken || ""} 
                  onChange={e => setData({...data, pushinpayToken: e.target.value})}
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 pr-11 text-white text-sm font-medium focus:border-emerald-500/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken("pushinpayToken")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                  title={showTokens.pushinpayToken ? "Ocultar" : "Visualizar"}
                >
                  {showTokens.pushinpayToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Webhook Token</label>
              <div className="relative">
                <input 
                  type={showTokens.pushinpayWebhookToken ? "text" : "password"} 
                  value={data.pushinpayWebhookToken || ""} 
                  onChange={e => setData({...data, pushinpayWebhookToken: e.target.value})}
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 pr-11 text-white text-sm font-medium focus:border-emerald-500/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken("pushinpayWebhookToken")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                  title={showTokens.pushinpayWebhookToken ? "Ocultar" : "Visualizar"}
                >
                  {showTokens.pushinpayWebhookToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">PerfectPanel URL</label>
              <input 
                type="text" 
                value={data.perfectPanelUrl || ""} 
                onChange={e => setData({...data, perfectPanelUrl: e.target.value})}
                className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-purple-500/50 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">PerfectPanel Key</label>
              <div className="relative">
                <input 
                  type={showTokens.perfectPanelKey ? "text" : "password"} 
                  value={data.perfectPanelKey || ""} 
                  onChange={e => setData({...data, perfectPanelKey: e.target.value})}
                  className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 pr-11 text-white text-sm font-medium focus:border-purple-500/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken("perfectPanelKey")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
                  title={showTokens.perfectPanelKey ? "Ocultar" : "Visualizar"}
                >
                  {showTokens.perfectPanelKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-8 py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-xl hover:brightness-125 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,0,0,0.2)]"
        >
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}
