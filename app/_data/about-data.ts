import {
  Mail,
  Phone,
  FileBox,
  GraduationCap,
  Folder,
  type LucideIcon,
} from "lucide-react";

type SidebarItem = {
  title: string;
  path: string;
  icon: LucideIcon;
  color?: string;
  items?: SidebarItem[];
};

export const sidebarSections: {
  title: string;
  value: string;
  isContact?: boolean;
  items: (SidebarItem & { label?: string; href?: string })[];
}[] = [
  {
    title: "personal-info",
    value: "personal-info",
    items: [
      {
        title: "experience",
        path: "/about/experience",
        icon: Folder,
        color: "text-red-400",
        items: [
          { title: "GETS", path: "/about/experience/gets", icon: FileBox },
          { title: "CEED Tunisia", path: "/about/experience/ceed", icon: FileBox },
          { title: "Biomediqa", path: "/about/experience/biomediqa", icon: FileBox },
          { title: "Tac-Tic", path: "/about/experience/tac-tic", icon: FileBox },
          { title: "ARSII", path: "/about/experience/arsii", icon: FileBox },
          { title: "Zitouna Bank", path: "/about/experience/zitouna", icon: FileBox },
        ],
      },
      {
        title: "education",
        path: "/about/education",
        icon: Folder,
        color: "text-blue-400",
        items: [
          {
            title: "unige (STRATEGOS)",
            path: "/about/education/unige",
            icon: GraduationCap,
          },
          {
            title: "ihec-carthage",
            path: "/about/education/ihec",
            icon: GraduationCap,
          },
        ],
      },
      {
        title: "index (bio)",
        path: "/about/bio",
        icon: FileBox,
        color: "text-gray-400",
      },
      {
        title: "interests",
        path: "/about/interests",
        icon: FileBox,
        color: "text-gray-400",
      },
    ],
  },
  {
    title: "contacts",
    value: "contacts",
    isContact: true,
    items: [
      {
        title: "email",
        label: "bahri.hichem50@gmail.com",
        path: "",
        href: "mailto:bahri.hichem50@gmail.com",
        icon: Mail,
      },
      {
        title: "phone",
        label: "+39 351 480 1710",
        path: "",
        href: "tel:+393514801710",
        icon: Phone,
      },
    ],
  },
];

type Content = {
  language: string;
  content: string;
};

const contentMap: Record<string, Content> = {
  bio: {
    language: "typescript",
    content: `/* Bio
 *
 * Started in business intelligence, ended up building the systems
 * that turn messy company data into decisions.
 * Two master's degrees, six internships, one agentic AI platform.
 * */

export const bio = {
  name: "Mohamed Hichem Bahri",
  role: "Data Engineer",
  based_in: "Genova, Italy",
  currently: "MSc Engineering Technology for Strategy and Security @ University of Genova",
  previously: "MSc Big Data & E-commerce @ IHEC Carthage",
  looking_for: "6-month master's thesis internship, from 2027-02",
  languages: ["arabic", "french", "english", "italian"],
};

// git log --oneline career
export const timeline = [
  { date: "2022-07", note: "first internship: financial data at Zitouna Bank" },
  { date: "2023-07", note: "first ML model, at ARSII" },
  { date: "2024-01", note: "first dashboards in production, at Tac-Tic" },
  { date: "2025-05", note: "ETL + Power BI for 25+ data sources at CEED" },
  { date: "2026-03", note: "built SupplyScope, an agentic AI platform, as my thesis" },
  { date: "2026-09", note: "moved to Genova for a second master's" },
];`,
  },

  interests: {
    language: "typescript",
    content: `/* Interests
 *
 * The question behind most of my projects:
 * how do you get a machine to answer a business question correctly?
 * */

export const interests = [
  "LLM agents that query databases, and the guardrails around them",
  "optimisation: turning a tender evaluation into a MILP problem",
  "dashboards people actually open",
];

// outside the terminal
export const also = [
  "Model United Nations: trained delegates, won Best Delegate",
  "AIESEC: brand and communication for the local committee",
];`,
  },

  "education/unige": {
    language: "typescript",
    content: `/* University of Genova (STRATEGOS)
 *
 * MSc in Engineering Technology for Strategy and Security.
 * MAECI scholarship. Second master's, this time on the engineering side.
 * */

export const degree = {
  school: "Università degli Studi di Genova",
  program: "Engineering Technology for Strategy and Security (STRATEGOS)",
  years: "2025 - 2027",
  scholarship: "MAECI (Italian Ministry of Foreign Affairs)",
};

export const next = {
  when: "2027-02 to 2027-07",
  what: "mandatory internship + master's thesis",
  where: "data engineering, AI engineering or analytics, Italy",
};`,
  },

  "education/ihec": {
    language: "typescript",
    content: `/* IHEC Carthage
 *
 * Five years. A bachelor's in business intelligence,
 * then a master's in big data, defended in 2026.
 * */

export const timeline = [
  { date: "2021", note: "Bachelor's in Business Intelligence" },
  { date: "2024", note: "final-year project: monitoring and decision-support platform for ERP modules" },
  { date: "2024", note: "MSc Big Data & E-commerce" },
  { date: "2026", note: "thesis: SupplyScope, an agentic AI platform for EPC supply chains" },
];

// full write-up: ~/projects/supplyscope`,
  },

  education: {
    language: "typescript",
    content: `// Select a sub-category from the education section to see details.`,
  },

  experience: {
    language: "typescript",
    content: `// Select a sub-category from the experience section to see details.`,
  },

  "experience/gets": {
    language: "typescript",
    content: `/* GETS - Global Engineering for Technical Services, Sfax
 *
 * EPC contractor in oil & gas. Materials bought in Tunisia,
 * built on sites in Libya. My master's thesis lived here.
 * */

export const timeline = [
  { date: "2026-03", role: "AI / Data Engineering Intern", note: "master's thesis, 6 months" },
];

// SupplyScope: ask the ERP a question in plain English, get a chart back
export const supplyscope = {
  agent: "LLM translates the question into read-only SQL, self-corrects on errors",
  dashboards: "refresh live when the ERP changes",
  models: ["delivery-risk prediction", "price prediction"],
  decisions: ["rule-based alert engine", "multi-criteria supplier recommender", "MILP award optimiser (PuLP)"],
};

export const delivery = {
  method: "5 Scrum sprints",
  tests: 133,
  benchmark: "95.3% accuracy on 43 reproducible questions",
  stack: ["Python", "PostgreSQL", "LangChain", "scikit-learn", "PuLP", "Flask", "Power BI"],
};

// full write-up: ~/projects/supplyscope`,
  },

  "experience/ceed": {
    language: "typescript",
    content: `/* CEED Tunisia, Tunis
 *
 * An entrepreneurship programme with data in 25+ places
 * and a monthly report built by hand. Not anymore.
 * */

export const timeline = [
  { date: "2025-05", role: "Business Analysis Intern", note: "4 months" },
];

export const pipeline = {
  sources: "25+ Excel exports, forms and CRM extracts",
  tool: "Python / pandas ETL",
  output: "one reporting model",
};

export const dashboard = {
  tool: "Power BI",
  replaced: "manual monthly reporting",
  used_by: "leadership, for decisions",
};`,
  },

  "experience/biomediqa": {
    language: "typescript",
    content: `/* Biomediqa, Tunis
 *
 * An ERP transformation. My job: find out what the business
 * actually needs before anyone writes code.
 * */

export const timeline = [
  { date: "2024-09", role: "Business Analysis Intern", note: "6 months" },
];

export const work = [
  "gap analysis workshops with key stakeholders",
  "functional requirements for the new ERP",
  "as-is and to-be processes in BPMN",
  "design reviews with stakeholders, iterated until validated",
];`,
  },

  "experience/tac-tic": {
    language: "typescript",
    content: `/* Tac-Tic, Tunis
 *
 * First time my dashboards were used by people other than me.
 * */

export const timeline = [
  { date: "2024-01", role: "Business Intelligence & Web Development Intern", note: "6 months" },
];

export const shipped = [
  "Metabase as the company's open-source reporting layer",
  "responsive web app with live dashboards for every department",
];`,
  },

  "experience/arsii": {
    language: "typescript",
    content: `/* ARSII, Sousse
 *
 * Research association. Clinical data, a prediction task,
 * and my first real machine-learning model.
 * */

export const timeline = [
  { date: "2023-07", role: "Machine Learning Intern", note: "2 months" },
];

export const model = {
  task: "liver-cancer prediction from clinical data",
  steps: ["preprocessing", "feature engineering", "cross-validated model selection"],
  with: "researchers, on cleaning and validating the medical datasets",
};`,
  },

  "experience/zitouna": {
    language: "typescript",
    content: `/* Zitouna Bank, Tunis
 *
 * Where it started. Excel, financial statements, loan files.
 * */

export const timeline = [
  { date: "2022-07", role: "Data Analysis Intern", note: "3 months" },
];

export const work = [
  "financial data analysis for loan evaluations",
  "financial-statement reviews",
  "customer-service improvements",
];`,
  },
};

export const mainContent = contentMap;