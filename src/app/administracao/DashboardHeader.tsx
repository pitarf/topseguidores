"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";

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
    <div className="flex flex-col space-y-4 sm:space-y-6 mb-6 md:mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-[1000] text-white tracking-tighter uppercase">Insights & Faturamento</h1>
          <p className="text-zinc-400 font-medium text-xs sm:text-sm mt-1">Acompanhe as métricas de conversão e receita em tempo real.</p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <NotificationCenter />
          <div className="flex flex-1 sm:flex-none items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-[#0b111e] border border-white/5 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => handleFilterChange(null, null)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition-all whitespace-nowrap text-center ${
                isAllTime 
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(255,0,62,0.3)]" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Todo Período
            </button>
            
            <div className="flex flex-1 sm:flex-none items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 bg-white/5 rounded-xl border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
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
                className="bg-transparent text-[11px] sm:text-xs font-bold text-white outline-none cursor-pointer w-full sm:w-auto"
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
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => router.push('/administracao')}
          className="px-4 sm:px-6 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10 shrink-0"
        >
          Dashboard
        </button>
        <button 
          onClick={() => router.push('/administracao/servicos')}
          className="px-4 sm:px-6 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10 shrink-0"
        >
          Serviços
        </button>
        <button 
          onClick={() => router.push('/administracao/settings')}
          className="px-4 sm:px-6 py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest bg-white/5 text-zinc-400 hover:text-white transition-all hover:bg-white/10 shrink-0"
        >
          Configurações
        </button>
      </div>
    </div>
  );
}
