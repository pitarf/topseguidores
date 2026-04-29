"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              {/* O Primary color no Tailwind estava mapeado para o vermelho/laranja */}
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#ffffff40" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0b111e", borderColor: "#ffffff10", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
            itemStyle={{ color: "#ef4444", fontWeight: "900" }}
            formatter={(value: any) => [`R$ ${Number(value || 0).toFixed(2)}`, "Faturamento"]}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px", color: "#a1a1aa" }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#ef4444" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            activeDot={{ r: 6, fill: "#ef4444", stroke: "#0b111e", strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
