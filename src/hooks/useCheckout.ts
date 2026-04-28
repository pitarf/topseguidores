import { create } from "zustand";

interface Plan {
  id: string;
  name: string;
  views: string;
  price: string;
  originalPrice?: string;
}

interface CheckoutStore {
  isOpen: boolean;
  selectedPlan: Plan | null;
  openCheckout: (plan: Plan) => void;
  closeCheckout: () => void;
}

export const useCheckout = create<CheckoutStore>((set) => ({
  isOpen: false,
  selectedPlan: null,
  openCheckout: (plan) => set({ isOpen: true, selectedPlan: plan }),
  closeCheckout: () => set({ isOpen: false, selectedPlan: null }),
}));
