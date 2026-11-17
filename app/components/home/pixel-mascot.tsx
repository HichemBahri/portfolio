"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";

// 14 x 12 bitmap. o = outline, b = body, h = highlight, w = eye white
const SPRITE = [
  "....oooooo....",
  "..oobbbbbboo..",
  ".obhhbbbbbbbo.",
  ".obhbbbbbbbbo.",
  "obwwwbbbbwwwbo",
  "obwwwbbbbwwwbo",
  "obwwwbbbbwwwbo",
  "obbbbbbbbbbbbo",
  "obbbbboobbbbbo",
  ".obbbbbbbbbbo.",
  "..obbo..obbo..",
  "...oo....oo...",
];

const COLORS: Record<string, string> = {
  o: "#0b3b40",
  b: "rgb(33, 219, 219)",
  h: "#a5f3fc",
  w: "#f8fafc",
};

// Eye sockets are 3x3; the pupil sits at the centre plus an offset of -1..1
const EYES = [
  { x: 3, y: 5 },
  { x: 10, y: 5 },
];

const PX = 6;
const W = SPRITE[0]!.length;
const H = SPRITE.length;

export const LEADERBOARD_TIPS = [
  "psst. j and k move the cursor",
  "h and l flip the screenshots",
  "click a row to open it",
  "the snake up top bites back",
  "1st place was earned, not given",
];

export type MascotMood = "idle" | "dead";

interface PixelMascotProps {
  tips: string[];
  /** Positions the mascot; it is absolutely placed by the caller */
  className?: string;
  mood?: MascotMood;
  /** Change this number to make the mascot hop once */
  hop?: number;
  /** Forces a one-off line, e.g. reacting to a game over */
  say?: string | null;
  /** Which side of the mascot the speech bubble sits on */
  bubbleSide?: "left" | "right" | "top" | "bottom";
  /** Sprite pixel size in px at the default 16px root (default 6) */
  pixelSize?: number;
  /** Gives the mascot a waving arm; change the number to wave again */
  wave?: number;
}

// Arm frames for the wave, drawn to the right of the body (columns 14-16)
const ARM_FRAMES = [
  [
    [14, 5],
    [15, 4],
    [16, 3],
    [16, 2],
  ],
  [
    [14, 5],
    [15, 4],
    [15, 3],
    [15, 2],
  ],
];

type Offset = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

const step = (d: number, dead: number): -1 | 0 | 1 =>
  d > dead ? 1 : d < -dead ? -1 : 0;

export function PixelMascot({
  tips,
  className,
  mood = "idle",
  hop = 0,
  say = null,
  bubbleSide = "left",
  wave,
  pixelSize = PX,
}: PixelMascotProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState<Offset>({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const tipCount = useRef(0);
  const [armFrame, setArmFrame] = useState<0 | 1 | null>(null);
  const canWave = wave !== undefined;

  // Wave: flip between the two arm frames a few times, then lower the arm
  useEffect(() => {
    if (!wave || reduce) return;
    let frame = 0;
    setArmFrame(0);
    const t = setInterval(() => {
      frame += 1;
      if (frame >= 7) {
        clearInterval(t);
        setArmFrame(null);
        return;
      }
      setArmFrame((frame % 2) as 0 | 1);
    }, 200);
    return () => clearInterval(t);
  }, [wave, reduce]);

  // Eyes follow the pointer, in whole-pixel steps
  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height * 0.4);
        const dead = pixelSize * 4;
        const next = { x: step(dx, dead), y: step(dy, dead) };
        setLook((prev) =>
          prev.x === next.x && prev.y === next.y ? prev : next,
        );
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [pixelSize]);

  // Occasional blink
  useEffect(() => {
    if (reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          setBlink(true);
          timer = setTimeout(() => {
            setBlink(false);
            schedule();
          }, 140);
        },
        2500 + Math.random() * 3500,
      );
    };
    schedule();
    return () => clearTimeout(timer);
  }, [reduce]);

  useEffect(() => {
    if (say) setTip(say);
  }, [say]);

  // Hide the tip after a few seconds
  useEffect(() => {
    if (tip === null) return;
    const t = setTimeout(() => setTip(null), 3500);
    return () => clearTimeout(t);
  }, [tip]);

  const showTip = () => {
    setTip(tips[tipCount.current % tips.length] ?? null);
    tipCount.current += 1;
  };

  const pixels: React.ReactNode[] = [];
  SPRITE.forEach((row, y) => {
    [...row].forEach((c, x) => {
      if (c === ".") return;
      let color = COLORS[c];
      // Closed eyes: sockets become body with a single outline line
      if (blink && mood === "idle" && c === "w")
        color = y === 5 ? COLORS.o : COLORS.b;
      pixels.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1}
          height={1}
          fill={color}
        />,
      );
    });
  });

  return (
    <div
      className={cn("pointer-events-none relative w-fit shrink-0", className)}
    >
      {/* The bubble lives in a zero-size anchor that only positions it, and the
          motion element inside only animates it. Keeping placement and animation on
          separate elements means framer-motion's inline transform can't override the
          placement, and the bubble never takes part in the mascot's layout, however
          many lines the tip wraps to. */}
      <div
        aria-live="polite"
        className={cn(
          "absolute z-10 h-0 w-0",
          bubbleSide === "left" && "bottom-0 left-0",
          bubbleSide === "right" && "right-0 bottom-0",
          bubbleSide === "top" && "top-0 left-1/2",
          bubbleSide === "bottom" && "bottom-0 left-0",
        )}
      >
        <AnimatePresence>
          {tip !== null && (
            <div
              key={tip}
              className={cn(
                "absolute w-max max-w-[14rem]",
                bubbleSide === "left" && "right-0 bottom-0 mr-3 mb-10",
                bubbleSide === "right" && "bottom-0 left-0 mb-10 ml-3",
                bubbleSide === "top" && "bottom-0 left-0 mb-3 -translate-x-1/2",
                bubbleSide === "bottom" && "top-0 left-0 mt-3",
              )}
            >
              <motion.p
                role="status"
                initial={reduce ? false : { opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative rounded-md border border-cyan-400/30 bg-[#101822] px-3 py-2 text-left font-mono text-xs leading-relaxed break-words whitespace-normal text-cyan-300 shadow-lg shadow-cyan-500/10"
              >
                {tip}
                <span
                  aria-hidden
                  className={cn(
                    "absolute size-2 rotate-45 bg-[#101822]",
                    bubbleSide === "left" &&
                      "-right-[5px] bottom-3 border-t border-r border-cyan-400/30",
                    bubbleSide === "right" &&
                      "bottom-3 -left-[5px] border-b border-l border-cyan-400/30",
                    bubbleSide === "top" &&
                      "-bottom-[5px] left-1/2 -translate-x-1/2 border-r border-b border-cyan-400/30",
                    bubbleSide === "bottom" &&
                      "-top-[5px] left-3 border-t border-l border-cyan-400/30",
                  )}
                />
              </motion.p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        key={hop}
        initial={false}
        animate={hop > 0 && !reduce ? { y: [0, -10, 0, -4, 0] } : { y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        ref={ref}
        type="button"
        onClick={showTip}
        aria-label="Mascot. Click for a tip"
        className="pointer-events-auto rounded-sm transition-transform focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none active:translate-y-px"
      >
        <svg
          // rem, so the sprite scales with the root size like the rest of the UI
          style={{
            width: `${((canWave ? W + 3 : W) * pixelSize) / 16}rem`,
            height: `${(H * pixelSize) / 16}rem`,
          }}
          viewBox={`0 0 ${canWave ? W + 3 : W} ${H}`}
          shapeRendering="crispEdges"
          aria-hidden
          className="drop-shadow-[0_0_10px_rgba(33,219,219,0.35)]"
        >
          {pixels}
          {armFrame !== null &&
            ARM_FRAMES[armFrame]!.map(([x, y], i) => (
              <rect
                key={`arm-${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={i === 3 ? COLORS.h : COLORS.b}
              />
            ))}
          {mood === "dead"
            ? EYES.flatMap((eye) =>
                [
                  [-1, -1],
                  [1, -1],
                  [0, 0],
                  [-1, 1],
                  [1, 1],
                ].map(([dx, dy]) => (
                  <rect
                    key={`${eye.x}-${dx}-${dy}`}
                    x={eye.x + dx!}
                    y={eye.y + dy!}
                    width={1}
                    height={1}
                    fill="#0f172b"
                  />
                )),
              )
            : !blink &&
              EYES.map((eye) => (
                <rect
                  key={eye.x}
                  x={eye.x + look.x}
                  y={eye.y + look.y}
                  width={1}
                  height={1}
                  fill="#0f172b"
                />
              ))}
        </svg>
      </motion.button>
    </div>
  );
}
