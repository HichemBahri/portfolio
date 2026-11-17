"use client";
import { motion } from "framer-motion";
import { LogoLoadingAnimation } from "./LogoLoadingAnimation";

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background fixed inset-0 z-[9999] flex items-center justify-center"
    >
      <LogoLoadingAnimation onComplete={onComplete} />
    </motion.div>
  );
}
