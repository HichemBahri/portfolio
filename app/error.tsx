"use client";

import { ErrorScreen } from "~/components/error-screen";

// Catches errors below the root layout, so the navbar and footer stay up
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorScreen error={error} onRetry={reset} />;
}
