import { create } from "zustand";

interface Plan {
  id: string;
  name: string;
  views: string;
  price: string;
  originalPrice?: string;
  quantity: number;
  popular?: boolean;
  badge?: string;
  viewers?: number;
  platform?: string;
  type?: string;
  packageType?: string;
}

interface CheckoutStore {
  isOpen: boolean;
  platform: "instagram" | "tiktok";
  service: "seguidores" | "curtidas" | "visualizacoes" | null;
  selectedPlan: Plan | null;
  openCheckout: (platform?: "instagram" | "tiktok", plan?: Plan) => void;
  closeCheckout: () => void;
  setService: (service: "seguidores" | "curtidas" | "visualizacoes") => void;
  setSelectedPlan: (plan: Plan) => void;
}

export const useCheckout = create<CheckoutStore>((set) => ({
  isOpen: false,
  platform: "instagram",
  service: null,
  selectedPlan: null,
  openCheckout: (platform = "instagram", plan) => set({ 
    isOpen: true, 
    platform, 
    selectedPlan: plan || null,
    service: plan ? "seguidores" : null // Assume seguidores se vier de um plano por enquanto
  }),
  closeCheckout: () => set({ isOpen: false, selectedPlan: null, service: null }),
  setService: (service) => set({ service }),
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));
