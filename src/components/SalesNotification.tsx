"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";

const names = ["Gabriel", "Felipe", "Diego", "Ana", "Lucas", "Rodrigo", "Julia", "Matheus", "Beatriz", "Ricardo"];
const services = ["1.000 Curtidas", "500 Seguidores", "10.000 Visualizações", "2.500 Seguidores", "5.000 Curtidas"];

export function SalesNotification() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "", service: "" });

  useEffect(() => {
    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      setData({ name, service });
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    const interval = setInterval(() => {
      showNotification();
    }, 12000);

    const timeout = setTimeout(showNotification, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 left-6 z-[100] flex items-center gap-4 bg-[#0a0f1e]/95 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-2xl min-w-[320px] pointer-events-none"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
            <Instagram className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Instagram</span>
               <span className="text-[10px] font-bold text-zinc-600">1h</span>
            </div>
            <p className="text-[12px] font-medium text-zinc-400 leading-snug">
               <span className="font-black text-white">{data.name} V.</span> Comprou <span className="font-black text-white">{data.service}</span> para seu Instagram
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
