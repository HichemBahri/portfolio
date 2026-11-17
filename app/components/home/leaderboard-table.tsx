"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Github, Globe } from "lucide-react";
import { cn } from "~/lib/utils";
import { LeaderboardCarousel } from "./leaderboard-carousel";
import { LEADERBOARD_TIPS, PixelMascot } from "./pixel-mascot";
import { useUnlock } from "./achievements";
import type { ProjectType } from "~/models/project";
import { useViewportKeys } from "~/hooks/useViewportKeys";
import { useMediaQuery } from "~/hooks/useMediaQuery";

// Same palette as the snake game console (snake-game.tsx / snake-game-canvas.tsx)
const SNAKE_RGB = "33, 219, 219";

// Desktop: rank | project | stack | difficulty | status | toggle
// Phones:  rank | project (difficulty under the name) | toggle. A separate
// difficulty column left the names only 2-3 characters before truncating.
const ROW_GRID =
  "grid grid-cols-[2.75rem_minmax(0,1fr)_1rem] md:grid-cols-[4rem_minmax(0,1fr)_10rem_6.5rem_6.5rem_1rem] items-center gap-x-3 md:gap-x-4";

function ordinal(n: number) {
  const s =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ??
        "th");
  return `${n}${s}`;
}

function status(project: ProjectType) {
  if (project.liveUrl) return { label: "live", className: "text-cyan-300" };
  if (project.repoUrl)
    return { label: "open source", className: "text-syntax-string" };
  return { label: "private", className: "text-slate-500" };
}

// Difficulty drawn as a snake: faint tail on the left, glowing head on the right
function SnakeMeter({ rank, className }: { rank: number; className?: string }) {
  return (
    <span
      className={cn("flex items-center gap-[3px]", className)}
      role="img"
      aria-label={`Difficulty ${rank} of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rank;
        const isHead = i === rank - 1;
        return (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-[2px]",
              !filled && "border border-slate-600/50",
            )}
            style={
              filled
                ? {
                    backgroundColor: `rgba(${SNAKE_RGB}, ${0.3 + (0.7 * (i + 1)) / rank})`,
                    boxShadow: isHead
                      ? `0 0 10px rgba(${SNAKE_RGB}, 0.7)`
                      : undefined,
                  }
                : undefined
            }
          />
        );
      })}
    </span>
  );
}

function StackIcons({ project }: { project: ProjectType }) {
  const shown = project.technologies.filter((t) => t.icon).slice(0, 4);
  const extra = project.technologies.length - shown.length;
  return (
    <span className="flex items-center gap-2 text-base text-slate-400">
      {shown.map((t) => (
        <i key={t.name} className={t.icon} title={t.name} aria-hidden />
      ))}
      {extra > 0 && (
        <span className="font-mono text-xs text-slate-500">+{extra}</span>
      )}
      <span className="sr-only">
        {project.technologies.map((t) => t.name).join(", ")}
      </span>
    </span>
  );
}

// Details panel open/close animation
const PANEL_OPEN_MS = 300;

type Shot = { index: number; direction: 1 | -1 };

// Cover first, then the gallery; medium sizes are plenty for the small screen
function screenshots(project: ProjectType) {
  return [project.imageUrl, ...project.gallery].map((src) =>
    src.replace("-large.", "-medium."),
  );
}

function Details({
  project,
  shot,
  onShotChange,
}: {
  project: ProjectType;
  shot: Shot;
  onShotChange: (shot: Shot) => void;
}) {
  return (
    <div className="grid gap-6 pt-1 pb-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:pl-[calc(4rem+1rem)]">
      <LeaderboardCarousel
        images={screenshots(project)}
        title={project.title}
        index={shot.index}
        direction={shot.direction}
        onChange={(index, direction) => onShotChange({ index, direction })}
      />
      <div className="flex flex-col gap-4 text-sm">
        <p className="line-clamp-4 leading-relaxed text-slate-300">
          {project.longDescription}
        </p>
        <p className="text-syntax-string font-mono text-xs leading-relaxed">
          {project.technologies.map((t) => t.name).join(", ")}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 font-mono">
          <Link
            href={`/projects/${project.slug}`}
            className="rounded-lg bg-cyan-500 px-4 py-1.5 font-bold text-slate-900 shadow-lg shadow-cyan-500/30 transition-colors hover:bg-cyan-400 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101822] focus-visible:outline-none"
          >
            Open project
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
            >
              <Globe className="size-4" aria-hidden /> Live site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
            >
              <Github className="size-4" aria-hidden /> Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Key({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded bg-slate-200 px-3 py-1 font-mono text-sm font-bold text-slate-800 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none active:translate-y-px"
    >
      {children}
    </button>
  );
}

const Screw = ({ className }: { className: string }) => (
  <div
    aria-hidden
    className={cn(
      "absolute h-2 w-2 rounded-full border border-slate-500/50 bg-slate-600/50",
      className,
    )}
  />
);

export function LeaderboardTable({ projects }: { projects: ProjectType[] }) {
  const reduce = useReducedMotion();
  // Phones fade the details panel in at full height instead of animating its
  // height: a height animation re-lays out and repaints everything below it
  // every frame, which is what made switching lag on mobile GPUs
  const isPhone = useMediaQuery("(max-width: 767px)") === true;
  const flat = Boolean(reduce) || isPhone;
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(true);
  const [shot, setShot] = useState<Shot>({ index: 0, direction: 1 });
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const unlock = useUnlock();
  const opened = useRef(new Set<string>());
  const seenShots = useRef(new Map<string, Set<number>>());
  // Row to keep still on screen while panels swap (see the effect below)
  const anchor = useRef<{ index: number; top: number } | null>(null);
  // Panels open without animation on first render, animated after any pick
  const [interacted, setInteracted] = useState(false);

  // Track what has been opened and viewed, for the achievements
  useEffect(() => {
    const project = projects[selected];
    if (!open || !project) return;
    opened.current.add(project.slug);
    if (opened.current.size === projects.length) unlock("completionist");

    const seen = seenShots.current.get(project.slug) ?? new Set<number>();
    seen.add(shot.index);
    seenShots.current.set(project.slug, seen);
    const count = screenshots(project).length;
    if (count > 1 && seen.size === count) unlock("collector");
  }, [open, selected, shot.index, projects, unlock]);

  const select = (index: number, focus = false) => {
    const next = (index + projects.length) % projects.length;
    // Focus first (it may scroll an off-screen row into view), then remember
    // where the row sits so it can be held there
    if (focus) rowRefs.current[next]?.focus();
    const row = rowRefs.current[next];
    anchor.current = row
      ? { index: next, top: row.getBoundingClientRect().top }
      : null;
    // The browser's own scroll anchoring would also react to the old panel
    // disappearing, and the two corrections together overshoot. Off until
    // the effect below has made its single correction.
    if (next !== selected)
      document.documentElement.style.overflowAnchor = "none";
    setInteracted(true);
    setSelected(next);
    setShot({ index: 0, direction: 1 });
    setOpen(true);
  };

  // Switching projects closes the open panel, which on phones is most of a
  // screen tall. If it sat above the chosen row, the row (and its new panel)
  // jumped up out from under the finger. The old panel is removed in the same
  // commit (see the AnimatePresence key below) and the new one starts at
  // height 0, so the row's final position is known here, before paint: one
  // scroll puts it back where it was tapped. No per-frame work.
  useLayoutEffect(() => {
    const target = anchor.current;
    anchor.current = null;
    const row = target && rowRefs.current[target.index];
    if (row) {
      const delta = row.getBoundingClientRect().top - target.top;
      if (Math.abs(delta) > 0.5) window.scrollBy(0, delta);
    }
    const frame = requestAnimationFrame(() => {
      document.documentElement.style.overflowAnchor = "";
    });
    // Once the new panel has opened, bring it fully on screen if a pick near
    // the bottom left it below the fold ("nearest" does nothing otherwise)
    const reveal = window.setTimeout(
      () =>
        row?.closest("li")?.scrollIntoView({
          block: "nearest",
          behavior: reduce ? "auto" : "smooth",
        }),
      reduce ? 0 : PANEL_OPEN_MS,
    );
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reveal);
    };
  }, [selected, reduce]);

  const handleKey = (key: string) => {
    if (key === "j" || key === "ArrowDown") {
      if (key === "j") unlock("vim");
      select(selected + 1, true);
      return true;
    }
    if (key === "k" || key === "ArrowUp") {
      if (key === "k") unlock("vim");
      select(selected - 1, true);
      return true;
    }
    if ((key === "h" || key === "l") && open) {
      const project = projects[selected];
      if (!project) return false;
      const count = screenshots(project).length;
      const step = key === "l" ? 1 : -1;
      setShot({ index: (shot.index + step + count) % count, direction: step });
      return true;
    }
    return false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    if (handleKey(e.key)) e.preventDefault();
  };

  // j/k/h/l also work while the console is on screen, without focusing it.
  // Arrow keys keep scrolling the page unless a row is focused.
  useViewportKeys(rootRef, (key) => !key.startsWith("Arrow") && handleKey(key));

  if (projects.length === 0) {
    return (
      <p className="text-syntax-comment mt-12 font-mono text-sm">
        {"// no projects ranked yet"}
      </p>
    );
  }

  return (
    // Phones: the same gradient pre-mixed with the page background instead of
    // a backdrop blur, which they'd recompute on every scrolled frame (all it
    // blurred was the faint background grid)
    <div
      ref={rootRef}
      className="relative rounded-xl border border-cyan-400/20 bg-gradient-to-br from-[#14283a]/95 via-[#162132]/95 to-[#141e2f]/95 p-3 max-md:p-2 md:from-[#1A3A4A]/50 md:via-[#1D2B3A]/50 md:to-[#1A2533]/50 md:p-6 md:shadow-2xl md:shadow-cyan-500/10 md:backdrop-blur-xl"
    >
      <PixelMascot
        tips={LEADERBOARD_TIPS}
        className="absolute -top-[4.5rem] right-10 z-30 md:right-16"
      />
      <Screw className="top-3 left-3 hidden md:block" />
      <Screw className="top-3 right-3 hidden md:block" />
      <Screw className="bottom-3 left-3 hidden md:block" />
      <Screw className="right-3 bottom-3 hidden md:block" />

      {/* Screen */}
      <div className="relative overflow-hidden rounded-lg bg-[#101822] md:shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
        {/* CRT scanlines + vignette, static */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 hidden bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)] md:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 hidden bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)] md:block"
        />

        <div className="flex items-baseline justify-between gap-4 border-b border-cyan-400/15 px-3 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4">
          <p className="font-mono text-lg font-bold tracking-[0.2em] text-cyan-400 [text-shadow:0_0_12px_rgba(56,189,248,0.6)] md:text-2xl">
            HIGH SCORES
          </p>
          <p className="hidden font-mono text-xs text-cyan-400/80 md:block">
            {"// j k to move, h l to flip screenshots"}
          </p>
        </div>

        <div
          aria-hidden
          className={cn(
            ROW_GRID,
            "px-3 py-3 font-mono text-xs text-cyan-400/60 md:px-6",
          )}
        >
          <span>rank</span>
          <span>project</span>
          <span className="hidden md:block">stack</span>
          <span className="hidden md:block">difficulty</span>
          <span className="hidden md:block">status</span>
          <span />
        </div>

        <ol onKeyDown={onKeyDown}>
          {projects.map((project, i) => {
            const isSelected = selected === i;
            const isOpen = isSelected && open;
            const s = status(project);
            const panelId = `leaderboard-${project.slug}`;

            return (
              <li
                key={project.id}
                className={cn(
                  "relative border-t border-cyan-400/10 px-3 transition-colors md:px-6",
                  isSelected
                    ? "bg-cyan-400/[0.06] has-[:focus-visible]:bg-cyan-400/[0.1]"
                    : "hover:bg-cyan-400/[0.03]",
                )}
              >
                {/* Selection bar: dim on the selected row, glowing with focus */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-[3px] bg-cyan-300 transition-opacity",
                    isSelected
                      ? "opacity-40 [li:has(:focus-visible)>&]:opacity-100 [li:has(:focus-visible)>&]:shadow-[0_0_12px_2px_rgba(56,189,248,0.6)]"
                      : "opacity-0",
                  )}
                />
                <button
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => (isSelected ? setOpen(!open) : select(i))}
                  className={cn(
                    ROW_GRID,
                    "group w-full py-4 text-left focus-visible:outline-none",
                  )}
                >
                  <span className="flex items-baseline gap-1 font-mono tabular-nums md:gap-1.5">
                    <span
                      aria-hidden
                      className={cn(
                        "text-cyan-400 transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    >
                      ❯
                    </span>
                    <span
                      className={cn(
                        "text-base md:text-xl",
                        i === 0
                          ? "font-bold text-cyan-300 [text-shadow:0_0_12px_rgba(56,189,248,0.7)]"
                          : isSelected
                            ? "text-white"
                            : "text-slate-500",
                      )}
                    >
                      {ordinal(i + 1)}
                    </span>
                  </span>

                  <span className="flex min-w-0 items-center gap-2.5 md:gap-3">
                    <Image
                      src={project.logo}
                      alt=""
                      width={36}
                      height={36}
                      className="size-8 shrink-0 rounded-md border border-cyan-400/15 bg-black/20 object-contain p-0.5 md:size-9"
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate font-medium transition-colors",
                          isSelected
                            ? "text-cyan-300"
                            : "text-slate-100 group-hover:text-cyan-300",
                        )}
                      >
                        {project.title}
                      </span>
                      {/* Phones: the meter takes the description's place (the
                          full description is in the opened panel) */}
                      <span className="hidden truncate text-sm text-slate-400 md:block">
                        {project.shortDescription}
                      </span>
                      <SnakeMeter
                        rank={Number(project.difficulty)}
                        className="mt-1.5 md:hidden"
                      />
                    </span>
                  </span>

                  <span className="hidden md:block">
                    <StackIcons project={project} />
                  </span>

                  <span className="hidden md:flex">
                    <SnakeMeter rank={Number(project.difficulty)} />
                  </span>

                  <span
                    className={cn(
                      "hidden font-mono text-xs md:block",
                      s.className,
                    )}
                  >
                    {s.label}
                  </span>

                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-4 text-cyan-400/60 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Keyed by selection: when another row is picked this
                    presence remounts, so the old panel leaves in the same
                    commit (no exit animation to wait for; the anchor effect
                    keeps the new row still). Collapsing the selected row
                    itself keeps the exit animation. */}
                <AnimatePresence
                  key={isSelected ? "selected" : "idle"}
                  initial={interacted ? undefined : false}
                >
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="details"
                      initial={
                        reduce
                          ? false
                          : flat
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                      }
                      animate={
                        flat ? { opacity: 1 } : { height: "auto", opacity: 1 }
                      }
                      exit={flat ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{
                        duration: reduce ? 0 : PANEL_OPEN_MS / 1000,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative z-20 overflow-hidden"
                    >
                      <Details
                        project={project}
                        shot={shot}
                        onShotChange={setShot}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Console controls, like the snake game's side panel */}
      <div className="mt-4 hidden items-center justify-between px-2 md:flex">
        <div className="flex items-center gap-3">
          <Key
            label="Previous project"
            onClick={() => select(selected - 1, true)}
          >
            k
          </Key>
          <Key label="Next project" onClick={() => select(selected + 1, true)}>
            j
          </Key>
          <span className="font-mono text-xs text-cyan-400/80">
            {"// use vim keys to browse"}
          </span>
        </div>
        <p className="font-mono text-xs text-cyan-400/80">
          {"// projects "}
          <span className="ml-1 text-2xl font-semibold text-white">
            {projects.length}
          </span>
        </p>
      </div>
    </div>
  );
}
