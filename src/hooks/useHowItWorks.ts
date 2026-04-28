import { create } from "zustand";

interface HowItWorksStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useHowItWorks = create<HowItWorksStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
