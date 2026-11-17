"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// 7 x 4 pixel arrow pointing down
const ARROW = ["ooooooo", ".ooooo.", "..ooo..", "...o..."];

// A terminal pager prompt ("-- more --") that invites the first scroll,
// then fades away once the page moves
export function ScrollPager({ targetId }: { targetId: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [1, 0]);
  const pointerEvents = useTransform(scrollY, (y) =>
    y > 100 ? "none" : "auto",
  );
  // Fully gone once faded, so the bobbing arrow stops costing anything
  const visibility = useTransform(scrollY, (y) =>
    y > 120 ? "hidden" : "visible",
  );

  const goNext = () =>
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  return (
    <motion.button
      type="button"
      onClick={goNext}
      style={{ opacity, pointerEvents, visibility }}
      aria-label="Show more: jump to my projects"
      className="group absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded-sm px-3 py-1 font-mono text-xs text-slate-400 transition-colors hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
    >
      <span>-- more --</span>
      {/* The bob runs in CSS on its own compositor layer (.pager-bob in
          global.css); animating the SVG itself repainted the page every frame */}
      <span aria-hidden className="pager-bob block">
        <svg
          width={14}
          height={8}
          viewBox="0 0 7 4"
          shapeRendering="crispEdges"
          className="text-cyan-400/70 group-hover:text-cyan-300"
        >
          {ARROW.flatMap((row, y) =>
            [...row].map((c, x) =>
              c === "o" ? (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width={1}
                  height={1}
                  fill="currentColor"
                />
              ) : null,
            ),
          )}
        </svg>
      </span>
    </motion.button>
  );
}
