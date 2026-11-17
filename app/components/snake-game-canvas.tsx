"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useViewportKeys } from "~/hooks/useViewportKeys";

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

const INITIAL_GAME_SPEED_MS = 150;
const MIN_GAME_SPEED_MS = 60;
const SPEED_INCREMENT = 2;

const SNAKE_COLOR_RGB = "33, 219, 219";
const FOOD_COLOR = "#38bdf8";
const SNAKE_BODY_SIZE = CELL_SIZE * 0.85;
const FOOD_RADIUS = CELL_SIZE * 0.25;
const SNAKE_OFFSET = (CELL_SIZE - SNAKE_BODY_SIZE) / 2;

const INITIAL_SNAKE_POSITION = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };

type Vector2D = { x: number; y: number };
const generateFoodPosition = (snake: Vector2D[]): Vector2D => {
  while (true) {
    const foodPos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (
      !snake.some(
        (segment) => segment.x === foodPos.x && segment.y === foodPos.y,
      )
    ) {
      return foodPos;
    }
  }
};

export function SnakeGameCanvas({
  setScore,
  isGameActive,
  setIsGameActive,
  isGameOver,
  setIsGameOver,
  score,
}: {
  setScore: React.Dispatch<React.SetStateAction<number>>;
  isGameActive: boolean;
  setIsGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  isGameOver: boolean;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  score: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Vector2D[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Vector2D>(() =>
    generateFoodPosition(INITIAL_SNAKE_POSITION),
  );
  const [direction, setDirection] = useState<Vector2D>(INITIAL_DIRECTION);
  const nextDirection = useRef<Vector2D | null>(null);

  const resetGame = useCallback(() => {
    setIsGameOver(false);
    setIsGameActive(true);
    setScore(0);
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = null;
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
    ];
    setSnake(initialSnake);
    setFood(generateFoodPosition(initialSnake));
  }, [setIsGameOver, setIsGameActive, setScore]);

  // Steers while the console is on screen; scrolled away, keys go elsewhere
  useViewportKeys(canvasRef, (key) => {
    const dir = (
      {
        k: { x: 0, y: -1 },
        j: { x: 0, y: 1 },
        h: { x: -1, y: 0 },
        l: { x: 1, y: 0 },
      } as Record<string, Vector2D>
    )[key.toLowerCase()];
    if (!dir) return false;
    nextDirection.current = dir;
    return true;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    snake.forEach((segment, index) => {
      const opacity = Math.max(0.2, 1 - index / (snake.length + 2));
      ctx.fillStyle = `rgba(${SNAKE_COLOR_RGB}, ${opacity})`;
      ctx.fillRect(
        segment.x * CELL_SIZE + SNAKE_OFFSET,
        segment.y * CELL_SIZE + SNAKE_OFFSET,
        SNAKE_BODY_SIZE,
        SNAKE_BODY_SIZE,
      );
    });

    ctx.fillStyle = FOOD_COLOR;
    ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      FOOD_RADIUS,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (!isGameActive || isGameOver) {
      return;
    }

    const gameTick = () => {
      let currentDirection = direction;

      if (nextDirection.current) {
        const isOpposite =
          direction.x === -nextDirection.current.x &&
          direction.y === -nextDirection.current.y;

        if (!isOpposite) {
          currentDirection = nextDirection.current;
          setDirection(nextDirection.current);
        }
        nextDirection.current = null;
      }

      const newSnake = [...snake];
      const firstSegment = newSnake[0];

      if (!firstSegment) {
        setIsGameOver(true);
        return;
      }

      const head = { ...firstSegment };
      head.x += currentDirection.x;
      head.y += currentDirection.y;

      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFoodPosition(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const currentSpeed = Math.max(
      MIN_GAME_SPEED_MS,
      INITIAL_GAME_SPEED_MS - Math.floor(score / 10) * SPEED_INCREMENT,
    );

    const timeoutId = setTimeout(gameTick, currentSpeed);
    return () => clearTimeout(timeoutId);
  }, [
    snake,
    direction,
    food,
    isGameActive,
    isGameOver,
    score,
    setScore,
    setIsGameOver,
  ]);

  return (
    <div className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="h-full w-full rounded-lg"
      />

      {/* CRT screen: scanlines + edge vignette (static, never blocks input) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_3px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]"
      />

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-[#101822]/80 font-mono">
          <p className="text-2xl font-bold tracking-[0.2em] text-pink-300 [text-shadow:0_0_14px_rgba(255,161,173,0.6)]">
            GAME OVER
          </p>
          <p className="mt-3 text-sm text-slate-400">
            {"// you scored "}
            <span className="text-white tabular-nums">{score}</span>
          </p>
          <button
            type="button"
            onClick={resetGame}
            className="mt-6 flex items-baseline gap-1 rounded-sm px-2 py-1 text-sm text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none active:translate-y-px"
          >
            <span aria-hidden className="text-cyan-400">
              [
            </span>
            <span className="px-0.5">play again</span>
            <span aria-hidden className="text-cyan-400">
              ]
            </span>
          </button>
        </div>
      )}

      {!isGameActive && !isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg px-6 text-center font-mono">
          <p className="text-3xl font-bold tracking-[0.3em] text-cyan-400 [text-shadow:0_0_14px_rgba(56,189,248,0.6)]">
            SNAKE
          </p>
          <p className="mt-3 text-sm text-slate-300">
            can you beat me at vim movement?
          </p>
          <button
            type="button"
            onClick={() => setIsGameActive(true)}
            className="mt-8 rounded-lg bg-cyan-500 px-6 py-2 font-bold text-slate-900 shadow-lg shadow-cyan-500/30 transition-colors hover:bg-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101822] focus-visible:outline-none active:translate-y-px"
          >
            Start game
          </button>
        </div>
      )}
    </div>
  );
}
