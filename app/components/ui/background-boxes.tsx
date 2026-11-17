"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "~/lib/utils";

type Cell = { row: number; col: number } | null;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const BoxesCore = ({
  className,
  cellWidth = 32,
  cellHeight = 16,
  lineColor = "#334155", // slate-700
  trackWindow = false,
  ...rest
}: {
  className?: string;
  cellWidth?: number;
  cellHeight?: number;
  lineColor?: string;
  // Read the pointer from the whole window, so cells still light up when
  // other elements sit on top of the canvas (the canvas can stay pointer-events-none)
  trackWindow?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<Cell>(null);

  // ---- constants kept stable for linting/TS ----
  const SKEW_X = toRad(-48);
  const SKEW_Y = toRad(14);
  const SCALE = 1.4;
  const OVERSCAN = 200;

  const palette = [
    "#93c5fd",
    "#f9a8d4",
    "#86efac",
    "#fde047",
    "#fca5a5",
    "#d8b4fe",
    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
  ] satisfies readonly string[];

  const getRandomColor = useCallback(
    (): string =>
      palette[Math.floor(Math.random() * palette.length)] ?? "#000000",
    [palette],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Last drawn size: mobile browsers fire `resize` whenever the address bar
    // slides in or out while scrolling, which only changes the height a little.
    let drawnWidth = 0;
    let drawnHeight = 0;

    // Size from the container; the canvas keeps the height it was drawn at
    // (overflow is clipped by the container) so a shorter viewport never
    // squashes the drawing
    const host = canvas.parentElement ?? canvas;

    const draw = (force = true) => {
      const width = host.clientWidth;
      const height = Math.max(host.clientHeight, force ? 0 : drawnHeight);
      if (!force && width === drawnWidth && height <= drawnHeight) return;
      drawnWidth = width;
      drawnHeight = height;
      canvas.style.height = `${height}px`;
      // A faint 1px grid gains nothing past 2x; 3x phones would otherwise
      // allocate and raster 2.25x the pixels
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // size backing store
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      // reset & set pixel ratio
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // center origin -> skew/scale -> uncenter
      ctx.translate(width / 2, height / 2);
      ctx.transform(SCALE, Math.tan(SKEW_Y), Math.tan(SKEW_X), SCALE, 0, 0);
      ctx.translate(-width / 2, -height / 2);

      ctx.clearRect(0, 0, width, height);

      // ensure non-undefined color for TS
      const stroke: string = lineColor ?? "#334155";
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      // All cells go into one path with a single stroke (one per cell was the
      // main cost of a redraw)
      const grid = new Path2D();

      // compute integer index bounds so hover indices match draw indices
      const startCol = Math.floor(-OVERSCAN / cellWidth);
      const endCol = Math.ceil((width + OVERSCAN) / cellWidth);
      const startRow = Math.floor(-OVERSCAN / cellHeight);
      const endRow = Math.ceil((height + OVERSCAN) / cellHeight);

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const x = col * cellWidth;
          const y = row * cellHeight;

          // hover fill (no undefined access thanks to optional chaining)
          if (hoveredCell?.row === row && hoveredCell?.col === col) {
            ctx.fillStyle = getRandomColor();
            ctx.fillRect(x, y, cellWidth, cellHeight);
          }

          grid.rect(x, y, cellWidth, cellHeight);
        }
      }
      ctx.stroke(grid);
    };

    draw();
    const onResize = () => draw(false);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [
    cellWidth,
    cellHeight,
    lineColor,
    hoveredCell,
    getRandomColor,
    SKEW_X,
    SKEW_Y,
    SCALE,
  ]);

  // hover detection (inverse of the draw transform)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        mouseX < 0 ||
        mouseY < 0 ||
        mouseX > rect.width ||
        mouseY > rect.height
      ) {
        setHoveredCell(null);
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // shift to centered coords
      const cx = mouseX - width / 2;
      const cy = mouseY - height / 2;

      // forward 2x2 (scale + skewX + skewY) in same order as draw()
      const a = SCALE; // m00
      const b = Math.tan(SKEW_X); // m01 (skewX term)
      const c = Math.tan(SKEW_Y); // m10 (skewY term)
      const d = SCALE; // m11

      // inverse
      const det = a * d - b * c;
      if (!det) return;
      const invA = d / det;
      const invB = -b / det;
      const invC = -c / det;
      const invD = a / det;

      // apply inverse to centered mouse
      const ix = invA * cx + invB * cy;
      const iy = invC * cx + invD * cy;

      // uncenter
      const gridX = ix + width / 2;
      const gridY = iy + height / 2;

      const col = Math.floor(gridX / cellWidth);
      const row = Math.floor(gridY / cellHeight);

      // only re-render when the pointer enters a different cell
      setHoveredCell((prev) =>
        prev?.row === row && prev?.col === col ? prev : { row, col },
      );
    };

    const handleMouseLeave = () => setHoveredCell(null);

    const moveTarget: Window | HTMLCanvasElement = trackWindow
      ? window
      : canvas;
    const leaveTarget: HTMLElement = trackWindow
      ? document.documentElement
      : canvas;

    // Hover only exists with a mouse or trackpad. On touch screens a tap also
    // fires mousemove, and each lit cell redraws the whole canvas, so the grid
    // stays static there. Re-checked live (e.g. a tablet with a mouse).
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      moveTarget.addEventListener(
        "mousemove",
        handleMouseMove as EventListener,
      );
      leaveTarget.addEventListener("mouseleave", handleMouseLeave);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      moveTarget.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener,
      );
      leaveTarget.removeEventListener("mouseleave", handleMouseLeave);
      setHoveredCell(null);
    };
    const sync = () => (canHover.matches ? attach() : detach());
    sync();
    canHover.addEventListener("change", sync);
    return () => {
      canHover.removeEventListener("change", sync);
      detach();
    };
  }, [cellWidth, cellHeight, SKEW_X, SKEW_Y, SCALE, trackWindow]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 block h-full w-full", className)}
      {...rest}
    />
  );
};

export const Boxes = React.memo(BoxesCore);
