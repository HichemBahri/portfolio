"use client";

import "./global.css";
import { Fira_Code } from "next/font/google";
import { ErrorScreen } from "~/components/error-screen";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

// Replaces the root layout when it crashes, so it needs its own <html>, styles and font
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={firaCode.variable}>
      <body className="bg-background min-h-screen font-mono antialiased">
        <ErrorScreen error={error} onRetry={reset} />
      </body>
    </html>
  );
}
