import Link from "next/link";
import { projects } from "~/_data/projects-data";
import { LeaderboardTable } from "./leaderboard-table";
import { ScrambleText } from "./scramble-text";

// Ranked by difficulty, then by how many technologies the project uses.
function rankProjects() {
  return [...projects].sort(
    (a, b) =>
      Number(b.difficulty) - Number(a.difficulty) ||
      b.technologies.length - a.technologies.length,
  );
}

export function Leaderboard() {
  const ranked = rankProjects();

  return (
    <section
      id="leaderboard"
      aria-labelledby="leaderboard-title"
      className="mx-auto max-w-7xl scroll-mt-16 px-4 pt-8 pb-16 sm:px-6 md:py-20 lg:px-8"
    >
      <p className="text-muted-foreground font-mono text-sm">
        <span className="text-syntax-function">❯</span> top -o difficulty
      </p>
      <h2
        id="leaderboard-title"
        className="text-foreground text-title mt-3 font-semibold tracking-tight"
      >
        <ScrambleText text="My Projects" />
      </h2>
      <p className="text-syntax-comment mt-3 max-w-[65ch] text-sm md:text-base">
        {
          "// Every project I've built, ranked by how hard it was. Ties go to the bigger stack."
        }
      </p>

      <div className="mt-20">
        <LeaderboardTable projects={ranked} />
      </div>

      <p className="text-muted-foreground mt-8 font-mono text-sm">
        <span className="text-syntax-comment">
          {"// filter by technology in "}
        </span>
        <Link
          href="/projects"
          className="text-syntax-string focus-visible:ring-ring rounded-sm underline-offset-4 hover:underline hover:brightness-125 focus-visible:ring-2 focus-visible:outline-none"
        >
          ~/projects
        </Link>
      </p>
    </section>
  );
}
