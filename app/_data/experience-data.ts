// Career timeline for the home page, newest first.
// Mirrors the jobs listed in about-data.ts (experience/*); keep both in sync.

export type Experience = {
  role: string;
  company: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM or "present"
  summary: string;
  /** "main" = internships, "side" = volunteering, drawn as a branch */
  lane: "main" | "side";
  /** git-style decoration shown next to the commit, e.g. "HEAD -> main" */
  ref?: string;
  aboutPath: string;
  project?: { label: string; href: string };
};

export const experiences: Experience[] = [
  {
    role: "AI / Data Engineering Intern (master's thesis)",
    company: "GETS",
    start: "2026-03",
    end: "2026-09",
    summary:
      "Built SupplyScope: an agentic AI analytics platform for EPC supply chains, 5 sprints, 133 tests.",
    lane: "main",
    ref: "HEAD -> main",
    aboutPath: "/about/experience/gets",
    project: { label: "SupplyScope", href: "/projects/supplyscope" },
  },
  {
    role: "Business Analysis Intern",
    company: "CEED Tunisia",
    start: "2025-05",
    end: "2025-08",
    summary:
      "Python ETL over 25+ data sources and a Power BI dashboard that replaced manual monthly reporting.",
    lane: "main",
    aboutPath: "/about/experience/ceed",
  },
  {
    role: "Business Analysis Intern",
    company: "Biomediqa",
    start: "2024-09",
    end: "2025-02",
    summary:
      "Gap analysis, functional requirements and BPMN process models for an ERP transformation.",
    lane: "main",
    aboutPath: "/about/experience/biomediqa",
  },
  {
    role: "BI & Web Development Intern",
    company: "Tac-Tic",
    start: "2024-01",
    end: "2024-06",
    summary:
      "Metabase as the company reporting layer, plus a web app with live departmental dashboards.",
    lane: "main",
    aboutPath: "/about/experience/tac-tic",
  },
  {
    role: "Machine Learning Intern",
    company: "ARSII",
    start: "2023-07",
    end: "2023-08",
    summary: "First ML model: liver-cancer prediction from clinical data.",
    lane: "main",
    aboutPath: "/about/experience/arsii",
  },
  {
    role: "Vice-President",
    company: "HECMUN",
    start: "2022-07",
    end: "2023-07",
    summary:
      "Trained delegates in diplomacy and academic writing; Best Delegate award.",
    lane: "side",
    ref: "volunteering",
    aboutPath: "/about/interests",
  },
  {
    role: "Data Analysis Intern",
    company: "Zitouna Bank",
    start: "2022-07",
    end: "2022-09",
    summary: "Where it started: financial data analysis for loan evaluations.",
    lane: "main",
    ref: "root",
    aboutPath: "/about/experience/zitouna",
  },
  {
    role: "Brand Manager",
    company: "AIESEC Bardo",
    start: "2020-09",
    end: "2022-08",
    summary: "Brand and communication for the local committee.",
    lane: "side",
    aboutPath: "/about/interests",
  },
];