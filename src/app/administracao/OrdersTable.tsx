"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCcw, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

type Order = any; // Simplificando tipagem para agilidade

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [filter, setFilter] = useState("Tudo");
  const [search, setSearch] = useState("");
  const [smmData, setSmmData] = useState<Record<string, any>>({});
  const [loadingSmm, setLoadingSmm] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = async (id: string) => {
    setRetrying(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}/retry`, { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Pedido reenviado com sucesso!");
        // O useEffect de fetchStatuses vai atualizar o status automaticamente em alguns segundos
        // mas podemos forçar um reload da página ou do estado se necessário.
        window.location.reload(); 
      } else {
        toast.error(data.error || "Erro ao reenviar pedido.");
      }
    } catch (e) {
      toast.error("Erro de conexão.");
    } finally {
      setRetrying(null);
    }
  };

  // Busca os status em tempo real no SMM Panel quando o componente monta
  useEffect(() => {
    const fetchStatuses = async () => {
      const panelIds = initialOrders.filter(o => o.panelOrderId).map(o => o.panelOrderId);
      if (panelIds.length > 0) {
        try {
          const res = await fetch("/api/admin/smm-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderIds: panelIds })
          });
          const data = await res.json();
          if (data && !data.error) {
            setSmmData(data);
          }
        } catch (e) {
          console.error("Failed to fetch SMM statuses");
        }
      }
      setLoadingSmm(false);
    };

    fetchStatuses();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchStatuses, 30000);
    return () => clearInterval(interval);
  }, [initialOrders]);

  const tabs = ["Tudo", "Pendente", "Em progresso", "Concluído", "Parcial", "Processando", "Cancelado"];

  // Mescla os dados do nosso DB com os dados ao vivo do SMM
  const mergedOrders = initialOrders.map(order => {
    let finalStatus = "Aguardando PIX"; // Status interno
    let startCount = "-";
    let remains = "-";

    if (order.status === "FAILED") finalStatus = "Cancelado";
    if (order.status === "CANCELED") finalStatus = "Cancelado";
    
    if (order.status === "SUCCESS") {
      if (!order.panelOrderId) {
        finalStatus = "Erro SMM";
      } else {
        const smm = smmData[order.panelOrderId];
        if (smm) {
           // Traduzindo os status padrão do PerfectPanel para os botões do DukeFornecedor
           const s = smm.status?.toLowerCase() || "";
           if (s === "pending") finalStatus = "Pendente";
           else if (s === "in progress") finalStatus = "Em progresso";
           else if (s === "completed") finalStatus = "Concluído";
           else if (s === "partial") finalStatus = "Parcial";
           else if (s === "processing") finalStatus = "Processando";
           else if (s === "canceled") finalStatus = "Cancelado";
           else finalStatus = smm.status;

           startCount = smm.start_count ? smm.start_count.toString() : "-";
           remains = smm.remains ? smm.remains.toString() : "-";
        } else {
           finalStatus = loadingSmm ? "Carregando..." : "Sincronizando"; 
        }
      }
    }

    return { ...order, finalStatus, startCount, remains };
  });

  const filteredOrders = mergedOrders.filter(o => {
    if (filter !== "Tudo") {
       // Se o filtro for Pendente, ele pode mostrar tanto "Pendente" do SMM quanto "Aguardando PIX" do nosso sistema
       if (filter === "Pendente" && o.finalStatus === "Aguardando PIX") return true;
       if (o.finalStatus !== filter) return false;
    }
    if (search) {
       const term = search.toLowerCase();
       return o.id.toLowerCase().includes(term) || 
              o.instagramUrl.toLowerCase().includes(term) ||
              (o.panelOrderId && o.panelOrderId.includes(term));
    }
    return true;
  });

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="bg-[#0b111e] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Abas de Filtro Estilo PerfectPanel */}
      <div className="p-6 border-b border-white/5 bg-[#0e1525]">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                filter === t 
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]" 
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Barra de Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Procurar por ID, Link ou ID SMM..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#050810] border border-white/5 rounded-xl pl-11 pr-4 py-4 text-white text-sm font-medium placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
      
      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#0b111e] border-b border-white/5 text-zinc-400 text-[10px] uppercase tracking-widest font-black">
              <th className="p-6">ID Local</th>
              <th className="p-6">Data</th>
              <th className="p-6">Link</th>
              <th className="p-6">Valor</th>
              <th className="p-6 text-center">Contagem Inicial</th>
              <th className="p-6 text-center">Quantidade</th>
              <th className="p-6">Plano</th>
              <th className="p-6 text-center">Status SMM</th>
              <th className="p-6 text-center">Restam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-zinc-500 font-bold">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 text-xs text-zinc-500 font-bold">
                    {order.id.slice(-6).toUpperCase()}
                    {order.panelOrderId && (
                      <div className="text-primary mt-1 text-[10px]">SMM: {order.panelOrderId}</div>
                    )}
                  </td>
                  <td className="p-6 text-xs text-zinc-300 font-bold">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    <div className="text-zinc-500 font-normal">{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="p-6">
                    <a 
                      href={order.instagramUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs font-bold hover:underline truncate max-w-[150px] block"
                      title={order.instagramUrl}
                    >
                      {order.instagramUrl.replace("https://www.instagram.com/", "").replace("https://instagram.com/", "").split("?")[0]}
                    </a>
                  </td>
                  <td className="p-6 text-sm font-black text-emerald-400">
                    {formatMoney(Number(order.price))}
                  </td>
                  <td className="p-6 text-center text-xs font-black text-white">
                    {order.startCount}
                  </td>
                  <td className="p-6 text-center text-xs font-black text-white">
                    {order.amount.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-6 text-xs font-bold text-zinc-300">
                    {order.plan?.name || "Avulso"}
                  </td>
                  <td className="p-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      order.finalStatus === 'Concluído' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      order.finalStatus === 'Cancelado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      order.finalStatus === 'Aguardando PIX' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                      order.finalStatus === 'Processando' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      order.finalStatus === 'Parcial' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-orange-500/10 text-orange-500 border-orange-500/20' // Em progresso / Pendente
                    }`}>
                      {order.finalStatus}
                    </span>
                    
                    {order.finalStatus === 'Erro SMM' && (
                      <div className="flex items-center gap-1 mt-1">
                        <button 
                          onClick={() => handleRetry(order.id)}
                          disabled={retrying === order.id}
                          className="p-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-all group/btn"
                          title="Tentar reenviar para o painel SMM"
                        >
                          {retrying === order.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCcw className="w-3 h-3 group-hover/btn:rotate-180 transition-transform duration-500" />
                          )}
                        </button>
                        
                        {order.smmError && (
                          <div className="group/error relative">
                            <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors cursor-help" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[9px] text-zinc-300 font-medium leading-tight opacity-0 group-hover/error:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                              <span className="text-red-400 font-black block mb-1">ERRO DO FORNECEDOR:</span>
                              {order.smmError}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-6 text-center text-xs font-black text-zinc-400">
                    {order.remains}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
