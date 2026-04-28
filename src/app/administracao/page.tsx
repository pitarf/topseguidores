import { prisma } from "@/lib/prisma";
import { RevenueChart } from "./RevenueChart";
import { OrdersTable } from "./OrdersTable";
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

export default async function AdministracaoPage() {
  // Buscar todos os pedidos
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: true }
  });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Variáveis de Faturamento
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

  // Preparar dados para o gráfico (últimos 7 dias)
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
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
      
      if (order.createdAt >= startOfDay) revToday += val;
      if (order.createdAt >= startOfWeek) revWeek += val;
      if (order.createdAt >= startOfMonth) revMonth += val;
      if (order.createdAt >= startOfYear) revYear += val;

      // Popula dados do Gráfico
      const orderDateStr = new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const dayData = last7DaysData.find(d => d.date === orderDateStr);
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
      <div>
        <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase">Insights & Faturamento</h1>
        <p className="text-zinc-400 font-medium text-sm mt-1">Acompanhe as métricas de conversão e receita em tempo real.</p>
      </div>

      {/* Cards de Faturamento (Power BI Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Faturamento Hoje" 
          value={formatMoney(revToday)} 
          icon={<DollarSign className="w-6 h-6 text-emerald-400" />} 
          trend="Hoje"
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
          <h2 className="text-xl font-black text-white tracking-tight mb-6">Receita (Últimos 7 Dias)</h2>
          <RevenueChart data={last7DaysData} />
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
