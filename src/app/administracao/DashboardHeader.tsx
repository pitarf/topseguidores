"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export function DashboardHeader({ availableMonths }: { availableMonths: { label: string, month: number, year: number }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMonth = searchParams.get("month");
  const currentYear = searchParams.get("year");
  const isAllTime = !currentMonth || !currentYear;

  const handleFilterChange = (month: number | null, year: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (month && year) {
      params.set("month", month.toString());
      params.set("year", year.toString());
    } else {
      params.delete("month");
      params.delete("year");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col space-y-6 mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase">Insights & Faturamento</h1>
          <p className="text-zinc-400 font-medium text-sm mt-1">Acompanhe as métricas de conversão e receita em tempo real.</p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-[#0b111e] border border-white/5 rounded-2xl">
          <button
            onClick={() => handleFilterChange(null, null)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              isAllTime 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(255,0,62,0.3)]" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Todo Período
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
            <Calendar className="w-4 h-4 text-primary" />
            <select
              value={!isAllTime ? `${currentMonth}-${currentYear}` : ""}
              onChange={(e) => {
                if (e.target.value === "") {
                  handleFilterChange(null, null);
                } else {
                  const [m, y] = e.target.value.split("-");
                  handleFilterChange(parseInt(m), parseInt(y));
                }
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0b111e]">Selecionar Mês</option>
              {availableMonths.map((item, idx) => (
                <option key={idx} value={`${item.month}-${item.year}`} className="bg-[#0b111e]">
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <button 
          onClick={() => router.push('/administracao')}
          className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10"
        >
          Dashboard
        </button>
        <button 
          onClick={() => router.push('/administracao/servicos')}
          className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10"
        >
          Serviços
        </button>
        <button 
          onClick={() => router.push('/administracao/settings')}
          className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10"
        >
          Configurações
        </button>
      </div>
    </div>
  );
}
