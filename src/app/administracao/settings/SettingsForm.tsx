"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function SettingsForm({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { id, updatedAt, ...payload } = data; // removemos id e data de autoupdate para evitar erro no prisma
      
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
        </div>
      </div>

      {/* Facebook Tracking */}
      <div className="bg-[#0b111e] border border-white/5 p-8 rounded-[2rem] shadow-2xl space-y-6 flex flex-col justify-between">
        <div>
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
            <div className="bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-xl p-4 mt-4">
              <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest leading-relaxed">
                📌 O evento de <span className="text-[#1877F2]">InitiateCheckout</span> é disparado automaticamente via script no navegador.<br/><br/>
                📌 O evento de <span className="text-[#1877F2]">Purchase (Compra)</span> é disparado pelo Backend (CAPI) quando o webhook do PIX confirma o pagamento, garantindo 100% de rastreamento.
              </p>
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
