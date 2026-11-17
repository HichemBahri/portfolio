"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUnlock } from "./achievements";

// 8 x 7 beetle. o = outline, b = shell, e = eyes
const BUG = [
  ".o....o.",
  "..oooo..",
  ".obeebo.",
  "obbbbbbo",
  "obbbbbbo",
  ".obbbbo.",
  "o.oooo.o",
];
const SPLAT = [
  "b..b..b.",
  ".b.bb...",
  "..bbbb.b",
  "bbbbbbb.",
  ".bbbbb..",
  "b..bb.b.",
  "...b...b",
];
const COLORS: Record<string, string> = {
  o: "#4c1d24",
  b: "#ffa1ad", // --sh-string
  e: "#0f172b",
};

const PX = 4;
const COUNT = 6;

function Sprite({ map }: { map: string[] }) {
  return (
    <svg
      width={8 * PX}
      height={7 * PX}
      viewBox="0 0 8 7"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {map.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={COLORS[c]}
            />
          ),
        ),
      )}
    </svg>
  );
}

type Bug = { id: number; x: number; y: number; angle: number; dead: boolean };

// Positions are percentages of the hero, kept away from the edges
const randomSpot = () => ({
  x: 6 + Math.random() * 88,
  y: 12 + Math.random() * 76,
});

function spawn(): Bug[] {
  return Array.from({ length: COUNT }, (_, id) => ({
    id,
    ...randomSpot(),
    angle: Math.random() * 360,
    dead: false,
  }));
}

// A handful of pixel bugs crawl around the hero; click one to squash it
export function PixelBugs() {
  const reduce = useReducedMotion();
  const unlock = useUnlock();
  const [bugs, setBugs] = useState<Bug[]>([]);

  // Spawn on the client only, so server and client markup match
  useEffect(() => setBugs(spawn()), []);

  // Each living bug picks a new spot every few seconds
  useEffect(() => {
    if (reduce || bugs.length === 0) return;
    const t = setInterval(() => {
      setBugs((prev) =>
        prev.map((bug) => {
          if (bug.dead || Math.random() < 0.4) return bug;
          const next = randomSpot();
          const angle =
            (Math.atan2(next.y - bug.y, next.x - bug.x) * 180) / Math.PI + 90;
          return { ...bug, ...next, angle };
        }),
      );
    }, 2200);
    return () => clearInterval(t);
  }, [reduce, bugs.length]);

  const left = bugs.filter((b) => !b.dead).length;

  useEffect(() => {
    if (bugs.length > 0 && left === 0) unlock("debugger");
  }, [left, bugs.length, unlock]);

  const squash = (id: number) =>
    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, dead: true } : b)),
    );

  if (bugs.length === 0) return null;

  return (
    <>
      <div className="absolute inset-0 z-[5]">
        {bugs.map((bug) => (
          <motion.div
            key={bug.id}
            className="absolute"
            initial={false}
            animate={{ left: `${bug.x}%`, top: `${bug.y}%` }}
            transition={{ duration: reduce ? 0 : 2, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {bug.dead ? (
                <motion.div
                  key="splat"
                  initial={{ scale: 0.4, opacity: 1 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <Sprite map={SPLAT} />
                </motion.div>
              ) : (
                <motion.button
                  key="bug"
                  type="button"
                  aria-label="Squash bug"
                  onClick={() => squash(bug.id)}
                  animate={{ rotate: bug.angle }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className="pointer-events-auto block cursor-pointer rounded-sm p-1 focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:outline-none"
                >
                  <Sprite map={BUG} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <p className="absolute bottom-16 left-4 z-10 font-mono text-xs sm:left-6 lg:left-8">
        <span className="text-syntax-string">❯</span>{" "}
        <span className="text-muted-foreground">
          {left === 0
            ? "0 bugs left. ship it."
            : `${left} bug${left === 1 ? "" : "s"} left. click to squash`}
        </span>
      </p>
    </>
  );
}
