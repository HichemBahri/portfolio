"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoLoadingAnimation } from "./LogoLoadingAnimation";

// Once hydrated, never cover the page longer than this, even if `load` never fires
const MAX_SPLASH_MS = 5000;

const SplashContext = createContext(false);

/** True while the splash covers the page (e.g. to hold intro animations) */
export const useSplashVisible = () => useContext(SplashContext);

// The page renders underneath from the first byte; the splash only covers it
// while the document is still loading. It fades in after a short CSS delay
// (`.splash-cover` in global.css), so fast loads never show it at all.
export function SplashScreenProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    if (document.readyState === "complete") {
      hide();
      return;
    }
    window.addEventListener("load", hide, { once: true });
    const timer = setTimeout(hide, MAX_SPLASH_MS);
    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(timer);
    };
  }, []);

  return (
    <SplashContext.Provider value={visible}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="splash"
            aria-hidden
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="splash-cover bg-background fixed inset-0 z-[100] flex items-center justify-center"
          >
            <LogoLoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Without JS nothing would remove the cover */}
      <noscript>
        <style>{".splash-cover{display:none}"}</style>
      </noscript>
    </SplashContext.Provider>
  );
}
