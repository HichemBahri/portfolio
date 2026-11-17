"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";
import { PixelMascot } from "./pixel-mascot";
import { BracketMenu } from "~/components/ui/bracket-menu";

const SIGN_OFF_TIPS = [
  "see you around",
  "the about page has the full story",
  "the snake game is still up top",
];

const LINE = "you made it to the end.";

const OPTIONS = [
  { label: "about me", href: "/about" },
  { label: "projects", href: "/projects" },
  { label: "contact", href: "/#contact" },
];

// The mascot waves, then asks where to go next in an RPG-style dialogue box
export function SignOff() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [wave, setWave] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (inView) setWave(1);
  }, [inView]);

  // Text crawl, once
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setTyped(LINE.length);
      return;
    }
    const t = setInterval(() => {
      setTyped((n) => {
        if (n >= LINE.length) clearInterval(t);
        return Math.min(LINE.length, n + 1);
      });
    }, 40);
    return () => clearInterval(t);
  }, [inView, reduce]);

  const done = typed >= LINE.length;

  return (
    <section
      aria-label="End of page"
      className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:px-8"
    >
      <div ref={ref} className="flex flex-col items-center">
        <div onClickCapture={() => setWave((w) => w + 1)}>
          <PixelMascot tips={SIGN_OFF_TIPS} wave={wave} bubbleSide="top" />
        </div>

        {/* Dialogue box */}
        <div className="relative mt-5 w-full max-w-xl rounded-sm border-2 border-cyan-400/40 bg-[#101822] px-6 py-6 font-mono shadow-[6px_6px_0_0_rgba(33,219,219,0.18)] md:px-8 md:py-7">
          <span
            aria-hidden
            className="absolute -top-[9px] left-1/2 size-4 -translate-x-1/2 rotate-45 border-t-2 border-l-2 border-cyan-400/40 bg-[#101822]"
          />

          <p className="text-dialog font-semibold text-slate-100">
            <span className="sr-only">{LINE}</span>
            <span aria-hidden>
              {LINE.slice(0, typed)}
              {!done && (
                <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-cyan-400/80" />
              )}
            </span>
          </p>
          <p
            className={cn(
              "mt-2 text-sm text-slate-400 transition-opacity duration-300 md:text-base",
              done ? "opacity-100" : "opacity-0",
            )}
          >
            where to next?
          </p>

          <div
            className={cn(
              "mt-6 transition-opacity duration-300",
              done ? "opacity-100" : "opacity-0",
            )}
          >
            <BracketMenu
              options={OPTIONS}
              viewportKeys
              aria-label="Where to next"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
