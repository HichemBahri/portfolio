"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { PixelMascot } from "~/components/home/pixel-mascot";
import { BracketButton } from "~/components/ui/screen-dialog";

const LINE = "segmentation fault (core dumped)";

const ERROR_TIPS = [
  "it wasn't you, it was me",
  "a retry fixes it more often than you'd think",
  "the crash report is already on its way",
];

interface ErrorScreenProps {
  error: Error & { digest?: string };
  /** Re-renders the failed segment (Next's `reset`) */
  onRetry: () => void;
}

// Shared by app/error.tsx and app/global-error.tsx: reports the crash to Sentry
// and shows the event id so a visitor can send it over (phones have no console).
export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const reduce = useReducedMotion();
  const [eventId, setEventId] = useState<string | null>(null);
  const [typed, setTyped] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setEventId(null);
  }, [error]);

  useEffect(() => {
    if (reduce) {
      setTyped(LINE.length);
      return;
    }
    const t = setInterval(() => {
      setTyped((n) => {
        if (n >= LINE.length) clearInterval(t);
        return Math.min(LINE.length, n + 1);
      });
    }, 35);
    return () => clearInterval(t);
  }, [reduce]);

  const ref = eventId ?? error.digest;

  return (
    <div className="flex min-h-[calc(100vh-48px)] items-center justify-center px-4 pt-14 pb-16 font-mono">
      <div className="w-full max-w-xl">
        <PixelMascot
          tips={ERROR_TIPS}
          mood="dead"
          bubbleSide="right"
          pixelSize={5}
          className="ml-5"
        />

        <div
          role="alert"
          className="relative mt-5 rounded-sm border-2 border-cyan-400/40 bg-[#101822] px-5 py-6 shadow-[6px_6px_0_0_rgba(33,219,219,0.18)] md:px-8 md:py-8"
        >
          <span
            aria-hidden
            className="absolute -top-[9px] left-12 size-4 rotate-45 border-t-2 border-l-2 border-cyan-400/40 bg-[#101822]"
          />

          <p className="text-sm text-slate-500">
            <span className="text-cyan-400">❯</span> ./render{" "}
            <span className="text-slate-600">--page</span>
          </p>
          <p className="text-dialog mt-3 font-semibold text-slate-100">
            <span className="sr-only">{LINE}</span>
            <span aria-hidden>
              {LINE.slice(0, typed)}
              <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-cyan-400/80 motion-safe:animate-[blink_1.2s_step-end_infinite]" />
            </span>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {"// something broke on this page. it has been reported."}
          </p>

          {ref && (
            <p className="mt-4 text-sm text-slate-400">
              {"// ref: "}
              <span className="text-syntax-string break-all select-all">{ref}</span>
            </p>
          )}

          {showDetails && (
            <pre className="mt-4 max-h-48 overflow-auto rounded-sm border border-slate-700/60 bg-black/30 p-3 text-xs break-words whitespace-pre-wrap text-red-300/90">
              {error.name}: {error.message || "unknown error"}
            </pre>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <BracketButton onClick={onRetry} className="-ml-2">
              retry
            </BracketButton>
            {/* Plain <a>: a full reload also clears whatever state broke */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="flex items-baseline gap-1 rounded-sm px-2 py-2 text-sm text-slate-400 transition-colors hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
            >
              <span aria-hidden className="text-slate-600">
                [
              </span>
              <span className="px-0.5">go home</span>
              <span aria-hidden className="text-slate-600">
                ]
              </span>
            </a>
            <button
              type="button"
              onClick={() => setShowDetails((s) => !s)}
              aria-expanded={showDetails}
              className="flex items-baseline gap-1 rounded-sm px-2 py-2 text-sm text-slate-400 transition-colors hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
            >
              <span aria-hidden className="text-slate-600">
                [
              </span>
              <span className="px-0.5">
                {showDetails ? "hide details" : "details"}
              </span>
              <span aria-hidden className="text-slate-600">
                ]
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
