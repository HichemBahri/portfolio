"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const BlinkingCursor = ({ className }: { className?: string }) => (
  <motion.span
    aria-hidden="true"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.2, repeat: Infinity }}
    className={`inline-block w-1 bg-current ${className}`}
  >
    &nbsp;
  </motion.span>
);

interface HeroTextAnimationProps {
  isLoading?: boolean;
}

export function HeroTextAnimation({
  isLoading = false,
}: HeroTextAnimationProps) {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [comment1, setComment1] = useState("");
  const [comment2, setComment2] = useState("");

  const [isLine1Complete, setIsLine1Complete] = useState(false);
  const [isLine2Complete, setIsLine2Complete] = useState(false);
  const [isLine3Complete, setIsLine3Complete] = useState(false);
  const [isComment1Complete, setIsComment1Complete] = useState(false);
  const [isComment2Complete, setIsComment2Complete] = useState(false);
  const [showGithubLink, setShowGithubLink] = useState(false);
  const [showProjectsLink, setShowProjectsLink] = useState(false);

  const text1 = "Hi all. I am";
  const text2 = "Mohamed Hichem Bahri";
  const text3 = "❯ Data engineer";
  const textComment1 = "// SELECT * FROM internships WHERE start = '2027-02';";
  const textComment2 = "// Check my work here";

  // Top text animation chain
  useEffect(() => {
    if (isLoading) return;

    let i = 0;
    const interval = setInterval(() => {
      setLine1(text1.substring(0, i));
      i++;
      if (i > text1.length) {
        clearInterval(interval);
        setIsLine1Complete(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLine1Complete || isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLine2(text2.substring(0, i));
      i++;
      if (i > text2.length) {
        clearInterval(interval);
        setIsLine2Complete(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isLine1Complete, isLoading]);

  useEffect(() => {
    if (!isLine2Complete || isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLine3(text3.substring(0, i));
      i++;
      if (i > text3.length) {
        clearInterval(interval);
        setIsLine3Complete(true);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isLine2Complete, isLoading]);

  // Code snippet animation chain (runs in parallel)
  useEffect(() => {
    if (isLoading) return;

    let i = 0;
    const interval = setInterval(() => {
      setComment1(textComment1.substring(0, i));
      i++;
      if (i > textComment1.length) {
        clearInterval(interval);
        setIsComment1Complete(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isComment1Complete || isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setComment2(textComment2.substring(0, i));
      i++;
      if (i > textComment2.length) {
        clearInterval(interval);
        setIsComment2Complete(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [isComment1Complete, isLoading]);

  useEffect(() => {
    if (!isComment2Complete || isLoading) return;
    const t1 = setTimeout(() => setShowGithubLink(true), 100);
    const t2 = setTimeout(() => setShowProjectsLink(true), 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isComment2Complete, isLoading]);

  return (
    <div className="flex flex-col justify-center text-left">
      {/* Each typed line reserves its height so the page doesn't jump while typing */}
      <p
        className="text-muted-foreground min-h-[1.5em] text-base md:text-lg"
        aria-live="polite"
      >
        {line1}
        {!isLine1Complete && <BlinkingCursor className="h-5" />}
      </p>

      <h1
        className="text-foreground mt-2 min-h-[1.1em] text-display font-bold tracking-tight"
        aria-live="polite"
      >
        <span
          data-text={line2}
          className={`glitch pointer-events-auto ${isLine2Complete ? "glitch-once" : ""}`}
        >
          {line2}
        </span>
        {isLine1Complete && !isLine2Complete && (
          <BlinkingCursor className="h-[0.9em]" />
        )}
      </h1>

      <div
        className="mt-3 flex min-h-[1.5em] items-center gap-3 text-lead text-slate-300"
        aria-live="polite"
      >
        {line3.startsWith("❯") ? (
          <>
            {/* Same ❯ prompt as the menus and section headers, with their glow */}
            <span className="text-cyan-400 [text-shadow:0_0_12px_rgba(56,189,248,0.7)]">
              ❯
            </span>
            {line3.substring(1)}
          </>
        ) : (
          line3
        )}
        {isLine1Complete && isLine2Complete && !isLine3Complete && (
          <BlinkingCursor className="h-[1em]" />
        )}
      </div>

      <div className="text-muted-foreground mt-8 font-mono text-sm leading-relaxed md:mt-12">
        <p className="text-syntax-comment min-h-[1.6em]" aria-live="polite">
          {comment1}
          {!isComment1Complete && <BlinkingCursor className="h-4" />}
        </p>

        <p
          className="text-syntax-comment mt-3 min-h-[1.6em]"
          aria-live="polite"
        >
          {comment2}
          {isComment1Complete && !isComment2Complete && (
            <BlinkingCursor className="h-4" />
          )}
        </p>
        {/* Reserve both code lines' height; strings stay on one unbroken line */}
        <div className="mt-1 min-h-[3.5em] space-y-1">
          {showGithubLink && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-syntax-keyword">const</span>{" "}
              <span className="text-syntax-function">githubLink</span>{" "}
              <span className="text-syntax-punctuation">=</span>{" "}
              <Link
                href="https://github.com/HichemBahri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-syntax-string pointer-events-auto inline-block transition-all hover:brightness-125"
              >
                &quot;https://github.com/HichemBahri&quot;
              </Link>
            </motion.p>
          )}
          {showProjectsLink && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-syntax-keyword">const</span>{" "}
              <span className="text-syntax-function">projectsLink</span>{" "}
              <span className="text-syntax-punctuation">=</span>{" "}
              <Link
                href="/projects"
                className="text-syntax-string pointer-events-auto inline-block transition-all hover:brightness-125"
              >
                &quot;~/projects&quot;
              </Link>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
