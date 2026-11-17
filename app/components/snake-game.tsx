"use client";
import React, { useEffect, useState } from "react";
import { SnakeGameCanvas } from "./snake-game-canvas";
import { PixelMascot } from "./home/pixel-mascot";
import { useUnlock } from "./home/achievements";

const SNAKE_TIPS = [
  "steer with h j k l",
  "the blue dot is food",
  "walls bite. so does your tail",
  "I'll cheer every bite",
];

const BEST_KEY = "snakeBestScore";

const Key = ({ k }: { k: string }) => (
  <kbd className="rounded bg-slate-200 px-3 py-1 text-sm font-bold text-slate-800 shadow-[0_2px_0_0_rgba(15,23,42,0.6)]">
    {k}
  </kbd>
);

export function SnakeGame() {
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const unlock = useUnlock();
  const [best, setBest] = useState(0);
  // X-eyes are a reaction to losing, not a state: they clear after a moment
  const [mascotDead, setMascotDead] = useState(false);

  useEffect(() => {
    if (!isGameOver) {
      setMascotDead(false);
      return;
    }
    setMascotDead(true);
    const t = setTimeout(() => setMascotDead(false), 2500);
    return () => clearTimeout(t);
  }, [isGameOver]);

  // Best score lives in this browser only
  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {
      /* storage unavailable: best stays per visit */
    }
  }, []);

  useEffect(() => {
    if (score >= 5) unlock("snack");
    if (score > best) {
      setBest(score);
      try {
        localStorage.setItem(BEST_KEY, String(score));
      } catch {
        /* ignore */
      }
    }
  }, [score, best, unlock]);

  return (
    <div className="relative w-full max-w-xl rounded-xl border border-cyan-400/20 bg-gradient-to-br from-[#1A3A4A]/50 via-[#1D2B3A]/50 to-[#1A2533]/50 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      <PixelMascot
        tips={SNAKE_TIPS}
        mood={mascotDead ? "dead" : "idle"}
        hop={score}
        say={isGameOver ? `ouch. ${score} points. again?` : null}
        bubbleSide="right"
        className="absolute -top-[4.5rem] left-10 z-30"
      />
      <div className="absolute top-3 left-3 h-2 w-2 rounded-full border border-slate-500/50 bg-slate-600/50"></div>
      <div className="absolute top-3 right-3 h-2 w-2 rounded-full border border-slate-500/50 bg-slate-600/50"></div>
      <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full border border-slate-500/50 bg-slate-600/50"></div>
      <div className="absolute right-3 bottom-3 h-2 w-2 rounded-full border border-slate-500/50 bg-slate-600/50"></div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="relative aspect-square w-full rounded-lg bg-[#101822] shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
            <SnakeGameCanvas
              score={score}
              setScore={setScore}
              isGameActive={isGameActive}
              setIsGameActive={setIsGameActive}
              isGameOver={isGameOver}
              setIsGameOver={setIsGameOver}
            />
          </div>
        </div>

        <div className="col-span-1 flex flex-col justify-between font-mono">
          <div className="rounded-md bg-black/20 p-3">
            <p className="text-center text-xs text-cyan-400/80">
              {"// steer with"}
            </p>
            <div className="mt-3 flex flex-col items-center gap-1">
              <Key k="k" />
              <div className="flex gap-1">
                <Key k="h" />
                <Key k="j" />
                <Key k="l" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-cyan-400/80">{"// score"}</p>
            <p className="mt-1 text-5xl font-semibold text-white tabular-nums [text-shadow:0_0_16px_rgba(56,189,248,0.35)]">
              {score}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {"// best "}
              <span className="text-slate-300 tabular-nums">{best}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
