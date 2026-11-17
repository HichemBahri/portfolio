"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";

export const ACHIEVEMENTS = {
  vim: { title: "Vim motions detected", body: "You moved with j and k." },
  collector: {
    title: "Screenshot collector",
    body: "You flipped through every screenshot of a project.",
  },
  completionist: {
    title: "Completionist",
    body: "You opened every project on the board.",
  },
  snack: { title: "Snack attack", body: "You scored 5 in snake." },
  debugger: {
    title: "Zero bugs in production",
    body: "You squashed every bug on the page.",
  },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

// Achievements whose feature isn't on the page yet; they don't count toward
// the total. Remove "debugger" once PixelBugs is placed in a section.
const DISABLED = new Set<AchievementId>(["debugger"]);

const AchievementsContext = createContext<(id: AchievementId) => void>(
  () => undefined,
);

export const useUnlock = () => useContext(AchievementsContext);

// Holds unlocked achievements for the visit and shows the toast
export function AchievementsProvider({ children }: { children: ReactNode }) {
  const unlocked = useRef(new Set<AchievementId>());
  const [current, setCurrent] = useState<AchievementId | null>(null);

  const unlock = useCallback((id: AchievementId) => {
    if (unlocked.current.has(id)) return;
    unlocked.current.add(id);
    setCurrent(id);
  }, []);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), 4000);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <AchievementsContext.Provider value={unlock}>
      {children}
      <AchievementToast id={current} unlockedCount={unlocked.current.size} />
    </AchievementsContext.Provider>
  );
}

function AchievementToast({
  id,
  unlockedCount,
}: {
  id: AchievementId | null;
  unlockedCount: number;
}) {
  const reduce = useReducedMotion();
  const total = (Object.keys(ACHIEVEMENTS) as AchievementId[]).filter(
    (key) => !DISABLED.has(key),
  ).length;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-16 z-50 md:right-6"
    >
      <AnimatePresence>
        {id && (
          <motion.div
            key={id}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex max-w-xs items-start gap-3 rounded-lg border border-cyan-400/30 bg-[#101822]/95 p-3 pr-4 font-mono md:shadow-2xl md:shadow-cyan-500/15 md:backdrop-blur"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30">
              <Trophy className="size-4" aria-hidden />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-xs text-cyan-400/80">
                {`// achievement unlocked ${unlockedCount}/${total}`}
              </span>
              <span className="text-sm font-bold text-cyan-300">
                {ACHIEVEMENTS[id].title}
              </span>
              <span className="text-xs text-slate-400">
                {ACHIEVEMENTS[id].body}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
