"use client";

import { useHowItWorks } from "@/hooks/useHowItWorks";
import { HowItWorksModal } from "./HowItWorksModal";

export function HowItWorksWrapper() {
  const { isOpen, closeModal } = useHowItWorks();
  
  return <HowItWorksModal isOpen={isOpen} onClose={closeModal} />;
}
