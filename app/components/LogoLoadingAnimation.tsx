"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LogoLoadingAnimationProps {
  onComplete?: () => void;
}

export function LogoLoadingAnimation({
  onComplete,
}: LogoLoadingAnimationProps) {
  const [showTyping, setShowTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(true);

  const textToType = "hello ^-^";
  const typingSpeed = 100; // ms per character (faster)
  const blinkSpeed = 500; // ms for cursor blink
  const minLoadingTime = 2000; // Minimum 2 seconds total loading time (shorter)

  useEffect(() => {
    // Start typing animation after a shorter delay
    const typingTimer = setTimeout(() => {
      setShowLoadingText(false); // Hide loading text
      setShowTyping(true);
    }, 800); // Shorter delay

    return () => clearTimeout(typingTimer);
  }, []);

  useEffect(() => {
    // Ensure minimum loading time
    const minTimer = setTimeout(() => {
      if (isComplete) {
        onComplete?.();
      }
    }, minLoadingTime);

    return () => clearTimeout(minTimer);
  }, [isComplete, onComplete]);

  useEffect(() => {
    if (!showTyping) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < textToType.length) {
        setTypedText(textToType.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Mark as complete but let minimum timer handle the actual completion
        setIsComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [showTyping]);

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, blinkSpeed);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Logo SVG with animated middle bar */}
      <div className="relative">
        <svg
          width="82"
          height="68"
          viewBox="0 0 82 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-16"
        >
          {/* Left chevron */}
          <path
            d="M12 16L6.5 34L12 52L5.5 52L0 34L5.5 16L12 16Z"
            fill="url(#paint3_linear_0_1)"
          />

          {/* Right chevron */}
          <path
            d="M70 16L75.5 34L70 52L76.5 52L82 34L76.5 16L70 16Z"
            fill="url(#paint4_linear_0_1)"
          />

          {/* H uprights */}
          <rect x="21" y="0" width="10" height="68" fill="url(#paint0_linear_0_1)" />
          <rect x="51" y="0" width="10" height="68" fill="url(#paint1_linear_0_1)" />

          {/* H crossbar with blinking animation */}
          <motion.rect
            x="31"
            y="29"
            width="20"
            height="10"
            fill="url(#paint2_linear_0_1)"
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <defs>
            <linearGradient id="paint0_linear_0_1" x1="26" y1="0" x2="26" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38F8F8" />
              <stop offset="1" stopColor="#218ADB" />
            </linearGradient>
            <linearGradient id="paint1_linear_0_1" x1="56" y1="0" x2="56" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38F8F8" />
              <stop offset="1" stopColor="#218ADB" />
            </linearGradient>
            <linearGradient id="paint2_linear_0_1" x1="41" y1="29" x2="41" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38F8F8" />
              <stop offset="1" stopColor="#218ADB" />
            </linearGradient>
            <linearGradient id="paint3_linear_0_1" x1="6" y1="16" x2="6" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38F8F8" />
              <stop offset="1" stopColor="#218ADB" />
            </linearGradient>
            <linearGradient id="paint4_linear_0_1" x1="76" y1="16" x2="76" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38F8F8" />
              <stop offset="1" stopColor="#218ADB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typing animation */}
      <AnimatePresence>
        {showTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-foreground font-mono text-2xl">
                {typedText}
              </span>
              <motion.span
                className="text-foreground font-mono text-2xl"
                animate={{
                  opacity: showCursor ? 1 : 0,
                }}
                transition={{
                  duration: 0.1,
                }}
              >
                |
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading assets text - BELOW the logo */}
      <AnimatePresence>
        {showLoadingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <motion.p
              className="text-muted-foreground font-mono text-sm"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Loading assets...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
