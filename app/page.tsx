import { Hero } from "./components/hero";
import { Leaderboard } from "./components/home/leaderboard";
import { Timeline } from "./components/home/timeline";
import { SignOff } from "./components/home/sign-off";
import { ContactSection } from "./components/contact/contact-section";
import { HomeBackground } from "./components/home/home-background";
import { AchievementsProvider } from "./components/home/achievements";

export default function Page() {
  // pb-12 keeps the last section clear of the fixed footer
  return (
    <AchievementsProvider>
      <div className="pb-12">
        <HomeBackground />
        <Hero />
        <Leaderboard />
        <Timeline />
        <ContactSection variant="home" className="py-16 md:py-20" />
        <SignOff />
      </div>
    </AchievementsProvider>
  );
}
