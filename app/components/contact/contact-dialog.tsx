"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { cn } from "~/lib/utils";
import { PixelMascot } from "~/components/home/pixel-mascot";
import { BracketButton } from "~/components/ui/screen-dialog";

const CONTACT_TIPS = [
  "ctrl + enter sends from the message box",
  "prefer email? the address is on this page",
];

const PROMPT = "what can I help you with?";
const SENT = "message sent.";

// Types `line` once `start` is true (instantly under reduced motion)
function useTyped(line: string, start: boolean) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setTyped(line.length);
      return;
    }
    setTyped(0);
    const t = setInterval(() => {
      setTyped((n) => {
        if (n >= line.length) clearInterval(t);
        return Math.min(line.length, n + 1);
      });
    }, 35);
    return () => clearInterval(t);
  }, [line, start, reduce]);

  return { text: line.slice(0, typed), done: typed >= line.length };
}

function TypedLine({ line, start }: { line: string; start: boolean }) {
  const { text, done } = useTyped(line, start);
  return (
    <p className="text-dialog font-semibold text-slate-100">
      <span className="sr-only">{line}</span>
      <span aria-hidden>
        {text}
        {!done && (
          <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-cyan-400/80" />
        )}
      </span>
    </p>
  );
}

type ContactDialogProps = {
  /** The form, rendered inside the box until the message is sent */
  form: ReactNode;
  isSubmitted: boolean;
  submissionError: string | null;
  /** Address the reply goes to, shown after sending */
  replyTo: string;
  onReset: () => void;
  /** Hide the mascot, e.g. on the home page where the sign-off mascot follows */
  showMascot?: boolean;
};

// The mascot asks, the form answers: same RPG dialogue box as the home page
// sign-off, with the form as its body. After sending it swaps to a confirmation.
export function ContactDialog({
  form,
  isSubmitted,
  submissionError,
  replyTo,
  onReset,
  showMascot = true,
}: ContactDialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [wave, setWave] = useState(0);
  const [hop, setHop] = useState(0);

  useEffect(() => {
    if (inView) setWave(1);
  }, [inView]);

  useEffect(() => {
    if (!isSubmitted) return;
    setHop((h) => h + 1);
    setWave((w) => w + 1);
  }, [isSubmitted]);

  const say = isSubmitted
    ? "got it, thanks!"
    : submissionError
      ? "hm, that one didn't go through"
      : null;

  return (
    <div ref={ref}>
      {showMascot && (
        <PixelMascot
          tips={CONTACT_TIPS}
          wave={wave}
          hop={hop}
          say={say}
          bubbleSide="right"
          pixelSize={5}
          className="ml-5"
        />
      )}

      <div
        className={cn(
          "relative rounded-sm border-2 border-cyan-400/40 bg-[#101822] px-5 py-6 font-mono shadow-[6px_6px_0_0_rgba(33,219,219,0.18)] md:px-8 md:py-8",
          showMascot && "mt-5",
        )}
      >
        {showMascot && (
          <span
            aria-hidden
            className="absolute -top-[9px] left-12 size-4 rotate-45 border-t-2 border-l-2 border-cyan-400/40 bg-[#101822]"
          />
        )}

        <AnimatePresence mode="wait" initial={false}>
          {isSubmitted ? (
            <motion.div
              key="sent"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="status"
            >
              <TypedLine line={SENT} start />
              <p className="mt-2 text-sm text-slate-400 md:text-base">
                {"// I'll reply to "}
                <span className="break-all text-slate-200">{replyTo}</span>
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <BracketButton onClick={onReset} className="-ml-2">
                  write another
                </BracketButton>
                <Link
                  href="/projects"
                  className="flex items-baseline gap-1 rounded-sm px-2 py-2 text-sm text-slate-400 transition-colors hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                >
                  <span aria-hidden className="text-slate-600">
                    [
                  </span>
                  <span className="px-0.5">browse projects</span>
                  <span aria-hidden className="text-slate-600">
                    ]
                  </span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TypedLine line={PROMPT} start={inView} />
              <p className="mt-2 text-sm text-slate-400">
                {"// replies go to the email you enter below"}
              </p>
              <div className="mt-8">{form}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
