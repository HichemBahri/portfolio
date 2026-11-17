import { LogoLoadingAnimation } from "~/components/LogoLoadingAnimation";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LogoLoadingAnimation />
    </div>
  );
}