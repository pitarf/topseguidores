"use client";

import { useState, useEffect } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 55,
    seconds: 50
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Simulação de cronômetro que reseta a cada 24h ou algo fixo para o efeito visual de escassez
      const h = 23 - (now.getHours() % 24);
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      
      setTimeLeft({ hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUnit = (unit: number) => unit.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
          <div className="w-3 h-0.5 bg-primary relative -rotate-45" />
          <div className="w-2.5 h-0.5 bg-primary absolute" />
        </div>
        <h2 className="text-primary font-black text-lg tracking-[0.2em] uppercase">
          Oferta Especial Termina Em:
        </h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-8">
        <TimeUnit value={formatUnit(timeLeft.hours)} label="HORAS" />
        <span className="text-primary text-4xl font-black">:</span>
        <TimeUnit value={formatUnit(timeLeft.minutes)} label="MINUTOS" />
        <span className="text-primary text-4xl font-black">:</span>
        <TimeUnit value={formatUnit(timeLeft.seconds)} label="SEGUNDOS" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#0b111e] border-2 border-[#20283c] rounded-2xl flex items-center justify-center">
        <span className="text-4xl sm:text-6xl font-black text-white">{value}</span>
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-zinc-500 tracking-widest">
        {label}
      </span>
    </div>
  );
}
