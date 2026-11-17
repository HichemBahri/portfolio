"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";

// Palette: neon blue grid (the site's glow blue), sun from --sh-string pink to
// --sh-keyword indigo, ground in the page background so waves hide each other.
const GRID = "56, 189, 248";
const SUN_TOP = "#ffa1ad";
const SUN_BOTTOM = "#615fff";
const GROUND = "#0f172b";

const HORIZON = 0.52; // horizon height as a fraction of the canvas
const CAM = 1.6; // camera height above the calm water line
const Z_NEAR = 1.1;
const ROW_GAP = 1.1; // world distance between wave rows
const ROWS = 22;
const COL_GAP = 1.4;
const SAMPLES = 56; // points per row
const SPEED = 1.6; // world units per second toward the viewer

// Tallest a wave can get (side amplitude at |x| = 7), plus a little margin
const MAX_WAVE = 0.08 + 49 * 0.035 + 0.25;

// Calm down the middle (the "road"), rolling waves out to the sides
function waveHeight(x: number, z: number, t: number) {
  const side = Math.min(Math.abs(x), 7);
  const amp = 0.08 + side * side * 0.035;
  return (
    amp *
    (0.6 * Math.sin(x * 0.55 + z * 0.35 + t * 0.9) +
      0.4 * Math.sin(x * 0.21 - z * 0.6 + t * 0.5))
  );
}

// Fixed, so the sky doesn't reshuffle on resize
const STARS = Array.from({ length: 22 }, (_, i) => ({
  x: (Math.sin(i * 12.9898) * 43758.5453) % 1,
  y: (Math.sin(i * 78.233) * 12345.6789) % 1,
  r: i % 5 === 0 ? 1.2 : 0.7,
}));

// Sun geometry at rest; draw() lowers the centre as it sets
function sunShape(w: number, h: number) {
  const horizon = h * HORIZON;
  const R = Math.min(w * 0.3, horizon * 0.82);
  return { horizon, R, cx: w / 2, cy: horizon + R * 0.12 };
}

type Layers = {
  stars: HTMLCanvasElement;
  halo: HTMLCanvasElement;
  disk: HTMLCanvasElement;
  glow: HTMLCanvasElement;
};

// Offscreen canvas in CSS px at the given DPR; returns null without a 2D context
function layer(cw: number, ch: number, dpr: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(cw * dpr));
  c.height = Math.max(1, Math.round(ch * dpr));
  const cx = c.getContext("2d");
  cx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return cx ? { c, cx } : null;
}

// Everything that never changes shape (stars, the sun's halo and gradient disk,
// the dusk glow), drawn once per size into offscreen canvases. Each frame only
// positions and fades them, so the sunset costs a few drawImage calls; gradient
// fills over large areas were a big part of the per-frame raster cost.
function drawLayers(w: number, h: number, dpr: number): Layers | null {
  const { horizon, R } = sunShape(w, h);

  // Stars at full strength; draw() fades them in with globalAlpha
  const stars = layer(w, horizon, dpr);
  // Halo: a square around the sun's centre, out to its 1.9R falloff
  const halo = layer(R * 3.8, R * 3.8, dpr);
  const disk = layer(R * 2, R * 2, dpr);
  // Warm band above the horizon, strongest while the sun goes down
  const glowH = horizon * 0.45;
  const glow = layer(w, glowH, dpr);
  if (!stars || !halo || !disk || !glow) return null;

  for (const s of STARS) {
    stars.cx.fillStyle = `rgba(226, 232, 240, ${s.r > 1 ? 1 : 0.5})`;
    stars.cx.fillRect(
      Math.abs(s.x) * w,
      Math.abs(s.y) * horizon * 0.8,
      s.r,
      s.r,
    );
  }

  const hg = halo.cx.createRadialGradient(
    R * 1.9,
    R * 1.9,
    R * 0.6,
    R * 1.9,
    R * 1.9,
    R * 1.9,
  );
  hg.addColorStop(0, "rgba(255, 161, 173, 0.22)");
  hg.addColorStop(1, "rgba(255, 161, 173, 0)");
  halo.cx.fillStyle = hg;
  halo.cx.fillRect(0, 0, R * 3.8, R * 3.8);

  // Pink at the top of the disk to indigo where it meets the horizon at rest
  disk.cx.beginPath();
  disk.cx.arc(R, R, R, 0, Math.PI * 2);
  const dg = disk.cx.createLinearGradient(0, 0, 0, R * 0.88);
  dg.addColorStop(0, SUN_TOP);
  dg.addColorStop(1, SUN_BOTTOM);
  disk.cx.fillStyle = dg;
  disk.cx.fill();

  const gg = glow.cx.createLinearGradient(0, 0, 0, glowH);
  gg.addColorStop(0, "rgba(255, 161, 173, 0)");
  gg.addColorStop(0.7, "rgba(255, 161, 173, 0.12)");
  gg.addColorStop(1, "rgba(255, 140, 120, 0.4)");
  glow.cx.fillStyle = gg;
  glow.cx.fillRect(0, 0, w, glowH);

  return { stars: stars.c, halo: halo.c, disk: disk.c, glow: glow.c };
}

// set: 0 = the sun at rest, 1 = fully below the horizon (scroll-driven)
function draw(
  ctx: CanvasRenderingContext2D,
  layers: Layers,
  w: number,
  h: number,
  t: number,
  set: number,
) {
  ctx.clearRect(0, 0, w, h);
  const { horizon, R, cx, cy: rest } = sunShape(w, h);
  const cy = rest + set * R * 0.95;
  const focal = (h - horizon) * 0.9;

  // Sky: everything above the horizon, so the sun sinks behind it
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, horizon);
  ctx.clip();

  ctx.globalAlpha = 0.7 + 0.3 * set;
  ctx.drawImage(layers.stars, 0, 0, w, horizon);
  const dusk = Math.sin(Math.PI * Math.min(1, set * 1.15));
  if (dusk > 0.01) {
    ctx.globalAlpha = dusk;
    const glowH = horizon * 0.45;
    ctx.drawImage(layers.glow, 0, horizon - glowH, w, glowH);
  }
  ctx.globalAlpha = 1 - 0.8 * set;
  ctx.drawImage(layers.halo, cx - R * 1.9, cy - R * 1.9, R * 3.8, R * 3.8);
  ctx.globalAlpha = 1;
  ctx.drawImage(layers.disk, cx - R, cy - R, R * 2, R * 2);

  // Slits that widen toward the horizon and drift down, cut out of the disk
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalCompositeOperation = "destination-out";
  // Slits across the lower half of the visible disk
  const top = horizon - R * 0.6;
  const period = R * 0.12;
  const drift = (t * 8) % period;
  for (let y = top + drift - period; y < horizon; y += period) {
    const depth = Math.max(0, (y - top) / (horizon - top));
    ctx.fillRect(cx - R, y, R * 2, depth * period * 0.6);
  }
  ctx.restore();

  // Waves: rows far to near. Each row fills the ground below it (hiding what
  // is behind), then draws the column segments reaching back to the previous
  // row, then its own line.
  const shift = (t * SPEED) % ROW_GAP;
  const zFar = Z_NEAR + ROWS * ROW_GAP;
  let prev: { x: number; y: number }[] | null = null;
  let prevZ = 0;

  for (let k = ROWS; k >= 0; k--) {
    const z = Z_NEAR + k * ROW_GAP - shift;
    if (z <= 0.3) continue;
    const halfSpan = ((w / 2) * z) / focal + COL_GAP;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const X = -halfSpan + (2 * halfSpan * i) / SAMPLES;
      pts.push({
        x: cx + (X * focal) / z,
        y: horizon + ((CAM - waveHeight(X, z, t)) * focal) / z,
      });
    }

    // Brighter when near, fading in at the horizon
    const near = 1 - (z - Z_NEAR) / (zFar - Z_NEAR);
    const alpha = Math.max(0, Math.min(1, near * 1.3)) * 0.9;

    // Hide what is behind this row: only a band one max wave height deep
    // can be overlapped, so filling to the bottom of the canvas (as every
    // row did) painted the near ground up to ROWS times a frame
    const band = (MAX_WAVE * focal) / z;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i]!;
      ctx.lineTo(p.x, Math.min(h, p.y + band));
    }
    ctx.closePath();
    ctx.fillStyle = GROUND;
    ctx.fill();

    if (prev) {
      ctx.beginPath();
      for (
        let X = -Math.floor(halfSpan / COL_GAP) * COL_GAP;
        X <= halfSpan;
        X += COL_GAP
      ) {
        const x0 = cx + (X * focal) / prevZ;
        const y0 = horizon + ((CAM - waveHeight(X, prevZ, t)) * focal) / prevZ;
        const x1 = cx + (X * focal) / z;
        const y1 = horizon + ((CAM - waveHeight(X, z, t)) * focal) / z;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.strokeStyle = `rgba(${GRID}, ${alpha * 0.55})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Glow pass, then the bright line
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = `rgba(${GRID}, ${alpha * 0.22})`;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = `rgba(${GRID}, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    prev = pts;
    prevZ = z;
  }
}

// Mobile hero art: a 90s synthwave horizon, neon waves rolling toward a
// striped sun. Pauses off screen; a single still frame under reduced motion.
export function SynthwaveScene({
  sunset,
}: {
  /** 0..1 scroll progress: the sun sets as it rises, and rises back */
  sunset?: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    let visible = true;
    let t = 2; // a pleasant still frame when reduced motion is on
    let last = performance.now();
    let lastDraw = 0;
    let cost = 0; // smoothed ms per draw
    let interval = 0; // min ms between draws; 0 = every frame
    let layers: Layers | null = null;
    const sunsetAt = () => sunset?.get() ?? 0;
    const paint = () => {
      if (layers) draw(ctx, layers, w, h, t, sunsetAt());
    };

    const resize = () => {
      // Glowing 1px lines stay soft past 1.5x; 3x phones would raster 4x more
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (w > 0 && h > 0) layers = drawLayers(w, h, dpr);
      paint();
    };

    // Time drives the motion, so a lower frame rate keeps the same speed
    const tick = (now: number) => {
      t += Math.min(now - last, 100) / 1000;
      last = now;
      // A full-screen dialog covers the scene (see ScreenDialog): don't draw
      const covered = document.documentElement.dataset.screenOpen !== undefined;
      if (!covered && now - lastDraw >= interval - 2) {
        lastDraw = now;
        const start = performance.now();
        paint();
        cost = cost * 0.9 + (performance.now() - start) * 0.1;
        // Phones that can't draw a frame cheaply drop to 30fps instead of
        // janking scrolling; fast ones keep 60
        interval = cost > 6 ? 1000 / 30 : 0;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce || !visible) return;
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    io.observe(canvas);
    start();

    // Without the loop (reduced motion), still follow the scroll-driven sunset:
    // it only moves when the visitor scrolls
    const offSunset = reduce ? sunset?.on("change", paint) : undefined;

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      offSunset?.();
    };
  }, [reduce, sunset]);

  return (
    <div
      aria-hidden
      className="relative aspect-[5/4] w-full [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_78%,transparent),linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [mask-composite:intersect] will-change-transform"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      {/* CRT scanlines, same as the site's dialog panels */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}
