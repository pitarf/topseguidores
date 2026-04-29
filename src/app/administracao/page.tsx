import { prisma } from "@/lib/prisma";
import { RevenueChart } from "./RevenueChart";
import { OrdersTable } from "./OrdersTable";
import { DashboardHeader } from "./DashboardHeader";
import { 
  DollarSign, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp,
  CreditCard,
  Target
} from "lucide-react";

// Forçamos a renderização dinâmica desta página (não usar cache estático)
export const dynamic = "force-dynamic";

export default async function AdministracaoPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const selectedMonth = searchParams.month ? parseInt(searchParams.month) : null;
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : null;

  // Buscar todos os pedidos para gerar a lista de meses disponíveis
  const allOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: true }
  });

  // Gerar lista de meses disponíveis (Únicos)
  const availableMonthsMap = new Map();
  allOrders.forEach(order => {
    const d = new Date(order.createdAt);
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const key = `${d.getMonth() + 1}-${d.getFullYear()}`;
    if (!availableMonthsMap.has(key)) {
      availableMonthsMap.set(key, { 
        label: label.charAt(0).toUpperCase() + label.slice(1), 
        month: d.getMonth() + 1, 
        year: d.getFullYear() 
      });
    }
  });
  const availableMonthsList = Array.from(availableMonthsMap.values());

  // Filtrar ordens baseadas na seleção
  const orders = allOrders.filter(order => {
    if (selectedMonth !== null && selectedYear !== null) {
      const d = new Date(order.createdAt);
      return (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
    }
    return true;
  });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Variáveis de Faturamento
  let filteredRevenue = 0;
  let revToday = 0;
  let revWeek = 0;
  let revMonth = 0;
  let revYear = 0;
  
  // Variáveis de Status
  let totalSuccess = 0;
  let totalPending = 0;
  let totalFailed = 0;
  
  // Quantidade de views vendidas
  let totalViewsDelivered = 0;

  // Preparar dados para o gráfico (últimos 7 dias se for "Todo Período", ou dias do mês se for filtrado)
  const isFiltered = selectedMonth !== null;
  
  // Se estiver filtrado, o gráfico mostra os dias do mês selecionado
  // Caso contrário, mostra os últimos 7 dias como antes
  const chartData = isFiltered 
    ? Array.from({ length: new Date(selectedYear!, selectedMonth!, 0).getDate() }).map((_, i) => ({
        date: `${i + 1}/${selectedMonth?.toString().padStart(2, '0')}`,
        revenue: 0
      }))
    : Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          revenue: 0
        };
      });

  orders.forEach(order => {
    const val = Number(order.price);
    
    if (order.status === "SUCCESS") {
      totalSuccess++;
      totalViewsDelivered += order.amount;
      filteredRevenue += val;
      
      // Apenas para métricas globais se não estiver filtrado
      if (order.createdAt >= startOfDay) revToday += val;
      if (order.createdAt >= startOfWeek) revWeek += val;
      if (order.createdAt >= startOfMonth) revMonth += val;
      if (order.createdAt >= startOfYear) revYear += val;

      // Popula dados do Gráfico
      const d = new Date(order.createdAt);
      const orderDateStr = isFiltered 
        ? `${d.getDate()}/${selectedMonth?.toString().padStart(2, '0')}`
        : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
      const dayData = chartData.find(cd => cd.date === orderDateStr);
      if (dayData) {
        dayData.revenue += val;
      }
    } else if (order.status === "PENDING") {
      totalPending++;
    } else {
      totalFailed++;
    }
  });

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-10">
      <DashboardHeader availableMonths={availableMonthsList} />

      {/* Cards de Faturamento (Power BI Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title={isFiltered ? "Faturamento Filtrado" : "Faturamento Hoje"} 
          value={formatMoney(isFiltered ? filteredRevenue : revToday)} 
          icon={<DollarSign className="w-6 h-6 text-emerald-400" />} 
          trend={isFiltered ? "No Período" : "Hoje"}
          color="emerald"
        />
        <MetricCard 
          title="Faturamento Semana" 
          value={formatMoney(revWeek)} 
          icon={<Activity className="w-6 h-6 text-primary" />} 
          trend="Esta semana"
          color="primary"
        />
        <MetricCard 
          title="Faturamento Mês" 
          value={formatMoney(revMonth)} 
          icon={<Calendar className="w-6 h-6 text-blue-400" />} 
          trend="Este mês"
          color="blue"
        />
        <MetricCard 
          title="Faturamento Ano" 
          value={formatMoney(revYear)} 
          icon={<TrendingUp className="w-6 h-6 text-purple-400" />} 
          trend="Este ano"
          color="purple"
        />
      </div>

      {/* Gráfico de Desempenho e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Ocupando 2 Colunas */}
        <div className="lg:col-span-2 bg-[#0b111e] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-xl font-black text-white tracking-tight mb-6">
            Receita ({isFiltered ? `Dias do Mês ${selectedMonth}` : "Últimos 7 Dias"})
          </h2>
          <RevenueChart data={chartData} />
        </div>

        {/* Estatísticas Secundárias */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0b111e] border border-white/5 p-6 rounded-[2rem] flex-1 flex flex-col justify-center shadow-xl">
            <div className="w-12 h-12 mb-4 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-1">Pedidos Pagos</p>
            <p className="text-3xl font-black text-white">{totalSuccess}</p>
          </div>
          
          <div className="bg-[#0b111e] border border-white/5 p-6 rounded-[2rem] flex-1 flex flex-col justify-center shadow-xl">
            <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-1">Views Entregues</p>
            <p className="text-3xl font-black text-white">{(totalViewsDelivered).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Tabela Interativa de Pedidos com Sincronização SMM */}
      <OrdersTable initialOrders={orders} />
    </div>
  );
}

// Sub-componente para os cards de faturamento
function MetricCard({ title, value, icon, trend, color }: { title: string, value: string, icon: any, trend: string, color: 'emerald' | 'primary' | 'blue' | 'purple' }) {
  
  const colorStyles = {
    emerald: {
      bgBlur: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      iconBox: "bg-emerald-500/10 border-emerald-500/20"
    },
    primary: {
      bgBlur: "bg-primary/10 group-hover:bg-primary/20",
      iconBox: "bg-primary/10 border-primary/20"
    },
    blue: {
      bgBlur: "bg-blue-500/10 group-hover:bg-blue-500/20",
      iconBox: "bg-blue-500/10 border-blue-500/20"
    },
    purple: {
      bgBlur: "bg-purple-500/10 group-hover:bg-purple-500/20",
      iconBox: "bg-purple-500/10 border-purple-500/20"
    }
  };

  const style = colorStyles[color];

  return (
    <div className="bg-[#0b111e] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group shadow-xl">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all ${style.bgBlur}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl border ${style.iconBox}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{trend}</span>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-[1000] text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
