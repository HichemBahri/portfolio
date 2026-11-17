"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FloatingNav } from "./floating-nav";
import { BracketMenu, type BracketOption } from "./ui/bracket-menu";
import { PixelMascot } from "./home/pixel-mascot";
import { findMeAlsoIn } from "~/_data/contact-data";

import { BracketButton, ScreenDialog } from "~/components/ui/screen-dialog";

const navItems = [
  { href: "/", label: "_hello" },
  { href: "/about", label: "_about me" },
  { href: "/projects", label: "_projects" },
  { href: "/contact", label: "_contact-me" },
];

const MENU_OPTIONS: BracketOption[] = navItems.map((item) => ({
  label: item.label,
  href: item.href,
}));

const SOCIAL_OPTIONS: BracketOption[] = [
  ...findMeAlsoIn.map((item) => ({
    label: item.label.toLowerCase(),
    href: item.href,
    external: true,
  })),
  { label: "email", href: "mailto:bahri.hichem50@gmail.com", external: true },
];

// Full-screen "where to?" menu: page options, then social links at the bottom
function MobileMenuBody({
  currentIndex,
  onClose,
}: {
  currentIndex: number;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <>
      <BracketMenu
        options={MENU_OPTIONS}
        restIndex={Math.max(0, currentIndex)}
        orientation="column"
        onNavigate={onClose}
        enterDelay={0.35}
        className="[&_a]:text-2xl"
        aria-label="Main navigation"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.25 }}
        className="mt-auto border-t-2 border-cyan-400/20 pt-6"
      >
        <p className="mb-3 text-xs text-slate-500">{"// find me in"}</p>
        <BracketMenu
          options={SOCIAL_OPTIONS}
          restIndex={-1}
          size="sm"
          aria-label="Find me in"
        />
      </motion.div>
    </>
  );
}

const NAV_MASCOT_TIPS = [
  "hi. tap [ menu ] to get around",
  "my projects are ranked on the home page",
  "I follow your finger too",
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const currentIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <>
      <FloatingNav />
      <header
        className={clsx(
          "text-muted-foreground flex h-12 items-center justify-between text-sm",
          "fixed top-0 left-0 z-50 w-full md:absolute",
          "border-border/50 bg-background/95 md:bg-background/80 border-b md:backdrop-blur-sm",
        )}
      >
        <nav className="hidden h-full items-center md:flex">
          <Link
            href="/"
            className="border-border/50 hover:text-foreground flex h-full items-center border-r px-6 transition-colors"
          >
            Mohamed-Hichem-Bahri
          </Link>

          {/* Main navigation items */}
          {navItems.slice(0, 3).map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "border-border/50 hover:text-foreground flex h-full items-center border-r px-6 transition-colors",
                  "border-b-2",
                  {
                    "border-b-transparent": !isActive,
                    "border-b-primary text-foreground": isActive,
                  },
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/contact"
            className={clsx(
              "border-border/50 hover:text-foreground flex h-full items-center border-l px-6 transition-colors",
              "border-b-2",
              {
                "border-b-transparent": pathname !== "/contact",
                "border-b-primary text-foreground": pathname === "/contact",
              },
            )}
          >
            _contact-me
          </Link>
        </div>

        <div className="flex w-full items-center justify-between pr-3 pl-4 md:hidden">
          <div className="flex items-center gap-3">
            <PixelMascot
              tips={NAV_MASCOT_TIPS}
              pixelSize={2}
              bubbleSide="bottom"
            />
            <Link
              href="/"
              className="hover:text-foreground py-3 transition-colors"
            >
              Mohamed-Hichem-Bahri
            </Link>
          </div>

          <ScreenDialog
            open={menuOpen}
            onOpenChange={setMenuOpen}
            title="where to?"
            hint="tap an option, or use j and k"
            trigger={<BracketButton>menu</BracketButton>}
          >
            <MobileMenuBody
              currentIndex={currentIndex}
              onClose={() => setMenuOpen(false)}
            />
          </ScreenDialog>
        </div>
      </header>
    </>
  );
}
