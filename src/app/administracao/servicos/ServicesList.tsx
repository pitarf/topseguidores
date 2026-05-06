"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Instagram, 
  Music2, 
  Search, 
  Save, 
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react";

export function ServicesList({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [loading, setLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");

  const handleUpdatePlan = async (id: string, updatedFields: any) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      });

      if (res.ok) {
        toast.success("Serviço atualizado!");
        setPlans(plans.map(p => p.id === id ? { ...p, ...updatedFields } : p));
      } else {
        toast.error("Falha ao salvar.");
      }
    } catch (e) {
      toast.error("Erro inesperado.");
    } finally {
      setLoading(null);
    }
  };

  const filteredPlans = plans.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === "all" || p.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Atualização em Massa de IDs */}
      <div className="bg-[#0b111e] p-8 rounded-[2rem] border border-purple-500/20 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Atualização em Massa (IDs Duke)</h2>
            <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Altere o ID de todos os pacotes de uma categoria de uma só vez</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Plataforma</label>
            <select 
              id="bulk-platform"
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-primary/50"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tipo</label>
            <select 
              id="bulk-type"
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-primary/50"
            >
              <option value="seguidores">Seguidores</option>
              <option value="curtidas">Curtidas</option>
              <option value="visualizacoes">Visualizações</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Origem</label>
            <select 
              id="bulk-package"
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-primary/50"
            >
              <option value="brasileiros">Brasileiros</option>
              <option value="mundiais">Mundiais</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Novo ID Duke</label>
            <input 
              id="bulk-id"
              type="text" 
              placeholder="Ex: 405"
              className="w-full bg-[#050810] border border-white/5 rounded-xl px-4 py-3 text-purple-400 text-sm font-black outline-none focus:border-purple-500/50"
            />
          </div>
          
          <button 
            onClick={async () => {
              const platform = (document.getElementById('bulk-platform') as HTMLSelectElement).value;
              const type = (document.getElementById('bulk-type') as HTMLSelectElement).value;
              const packageType = (document.getElementById('bulk-package') as HTMLSelectElement).value;
              const newId = (document.getElementById('bulk-id') as HTMLInputElement).value;

              if (!newId) return toast.error("Insira o novo ID");
              
              const plansToUpdate = plans.filter(p => p.platform === platform && p.type === type && p.packageType === packageType);
              
              if (plansToUpdate.length === 0) return toast.error("Nenhum plano encontrado nesta categoria");

              setLoading("bulk");
              try {
                let successCount = 0;
                for (const plan of plansToUpdate) {
                  const res = await fetch(`/api/admin/plans/${plan.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ providerServiceId: newId })
                  });
                  if (res.ok) successCount++;
                }
                
                if (successCount > 0) {
                  toast.success(`${successCount} pacotes atualizados com sucesso!`);
                  setPlans(plans.map(p => 
                    (p.platform === platform && p.type === type && p.packageType === packageType) 
                    ? { ...p, providerServiceId: newId } 
                    : p
                  ));
                }
              } catch (e) {
                toast.error("Erro na atualização em massa");
              } finally {
                setLoading(null);
              }
            }}
            disabled={loading === "bulk"}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-all disabled:opacity-50 uppercase text-xs tracking-widest shadow-lg shadow-purple-500/20"
          >
            {loading === "bulk" ? "..." : "Atualizar"}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#0b111e] p-6 rounded-[2rem] border border-white/5 shadow-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#050810] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:border-primary/50 outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setPlatformFilter("all")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${platformFilter === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setPlatformFilter("instagram")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${platformFilter === 'instagram' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
          >
            <Instagram className="w-4 h-4" /> Instagram
          </button>
          <button 
            onClick={() => setPlatformFilter("tiktok")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${platformFilter === 'tiktok' ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
          >
            <Music2 className="w-4 h-4" /> TikTok
          </button>
        </div>
      </div>

      {/* Tabela de Serviços */}
      <div className="bg-[#0b111e] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Serviço</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Quantidade</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Preço (R$)</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Original (R$)</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Service ID (SMM)</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.platform === 'instagram' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/20 text-white'}`}>
                        {plan.platform === 'instagram' ? <Instagram className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{plan.name}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{plan.type} • {plan.packageType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <input 
                      type="number"
                      value={plan.viewsAmount}
                      onChange={e => handleUpdatePlan(plan.id, { viewsAmount: parseInt(e.target.value) })}
                      className="w-24 bg-[#050810] border border-white/5 rounded-lg px-3 py-2 text-white text-xs font-bold outline-none focus:border-primary/50"
                    />
                  </td>
                  <td className="p-6">
                    <input 
                      type="number"
                      step="0.01"
                      value={plan.price}
                      onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, price: e.target.value} : p))}
                      onBlur={e => handleUpdatePlan(plan.id, { price: parseFloat(e.target.value) })}
                      className="w-24 bg-[#050810] border border-white/5 rounded-lg px-3 py-2 text-emerald-400 text-xs font-bold outline-none focus:border-emerald-500/50"
                    />
                  </td>
                  <td className="p-6">
                    <input 
                      type="number"
                      step="0.01"
                      value={plan.originalPrice || ""}
                      onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, originalPrice: e.target.value} : p))}
                      onBlur={e => handleUpdatePlan(plan.id, { originalPrice: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-24 bg-[#050810] border border-white/5 rounded-lg px-3 py-2 text-zinc-500 text-xs font-bold outline-none focus:border-white/20"
                    />
                  </td>
                  <td className="p-6">
                    <input 
                      type="text"
                      value={plan.providerServiceId || ""}
                      onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, providerServiceId: e.target.value} : p))}
                      onBlur={e => handleUpdatePlan(plan.id, { providerServiceId: e.target.value })}
                      placeholder="Ex: 379"
                      className="w-20 bg-[#050810] border border-white/5 rounded-lg px-3 py-2 text-purple-400 text-xs font-bold outline-none focus:border-purple-500/50"
                    />
                  </td>
                  <td className="p-6">
                    {loading === plan.id ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPlans.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Nenhum serviço encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
