// Project catalogue. The ids in `filters` MUST equal the lowercased `name`
// of a technology used in `projects[].technologies`, or the filter matches nothing.

export const filters = [
  {
    name: "Languages",
    technologies: [
      { id: "python", name: "Python", icon: "devicon-python-plain" },
      { id: "sql", name: "SQL", icon: "devicon-azuresqldatabase-plain" },
      { id: "typescript", name: "TypeScript", icon: "devicon-typescript-plain" },
      { id: "html / css", name: "HTML / CSS", icon: "devicon-html5-plain" },
    ],
  },
  {
    name: "Frameworks",
    technologies: [
      { id: "fastapi", name: "FastAPI", icon: "devicon-fastapi-plain" },
      { id: "flask", name: "Flask", icon: "devicon-flask-original" },
      { id: "react", name: "React", icon: "devicon-react-original" },
      { id: "bootstrap", name: "Bootstrap", icon: "devicon-bootstrap-plain" },
      { id: "customtkinter", name: "CustomTkinter", icon: "devicon-python-plain" },
    ],
  },
  {
    name: "AI & Data",
    technologies: [
      { id: "langgraph", name: "LangGraph", icon: "devicon-langgraph-plain" },
      { id: "langchain", name: "LangChain", icon: "devicon-langchain-plain" },
      { id: "scikit-learn", name: "scikit-learn", icon: "devicon-scikitlearn-plain" },
      { id: "pandas", name: "pandas", icon: "devicon-pandas-plain" },
      { id: "pulp", name: "PuLP", icon: "devicon-python-plain" },
      { id: "faiss", name: "FAISS", icon: "devicon-meta-original" },
      { id: "gemini", name: "Gemini", icon: "devicon-google-plain" },
      { id: "postgresql", name: "PostgreSQL", icon: "devicon-postgresql-plain" },
      { id: "metabase", name: "Metabase", icon: "devicon-grafana-original" },
    ],
  },
  {
    name: "Infrastructure & Monitoring",
    technologies: [
      { id: "docker", name: "Docker", icon: "devicon-docker-plain" },
      { id: "elasticsearch", name: "Elasticsearch", icon: "devicon-elasticsearch-plain" },
      { id: "logstash", name: "Logstash", icon: "devicon-logstash-plain" },
      { id: "kibana", name: "Kibana", icon: "devicon-kibana-plain" },
      { id: "nginx", name: "Nginx", icon: "devicon-nginx-original" },
      { id: "pytest", name: "pytest", icon: "devicon-pytest-plain" },
    ],
  },
];

export const projects = [
  {
    id: 1,
    slug: "supplyscope",
    title: "SupplyScope",
    imageUrl: "/optimized/images/supplyscope_cover-medium.webp",
    backgroundImage: "/optimized/images/supplyscope_cover-medium.webp",
    logo: "/optimized/images/supplyscope_logo-small.webp",
    shortDescription:
      "Agentic AI platform for reactive analytics and decision support on EPC supply-chain data",
    longDescription:
      "SupplyScope is my master's thesis, built at GETS, an EPC contractor in oil & gas. A LangGraph agent turns a plain-language question into read-only SQL, repairs its own errors and returns a validated chart. Dashboards refresh within a second of a change in the ERP. On top of that: delivery-risk and price-forecast models, a rule-based alert engine, a multi-criteria supplier recommender and a MILP award optimiser for tender rounds. 95.3% accuracy on a reproducible 43-question benchmark, 133 automated tests.",
    projectUrl: "https://github.com/HichemBahri/supplyscope",
    difficulty: "5",
    tags: ["agentic ai", "text-to-sql", "supply chain", "optimisation", "ml"],
    markdownFilename: "supplyscope.md",
    color: "#22d3ee",
    technologies: [
      {
        name: "Python",
        icon: "devicon-python-plain",
        version: "3.12",
        description:
          "Backend language for the agent, the ML pipeline, the rule engine, the recommender and the optimiser.",
      },
      {
        name: "FastAPI",
        icon: "devicon-fastapi-plain",
        description:
          "REST API with JWT authentication, three roles, e-mail verification and an audit trail.",
      },
      {
        name: "LangGraph",
        icon: "devicon-langgraph-plain",
        description:
          "Agent graph: question to SQL, execution under a read-only role, self-repair from database feedback, chart validation.",
      },
      {
        name: "PostgreSQL",
        icon: "devicon-postgresql-plain",
        version: "16",
        description:
          "ERP data model of the procure-to-pay process; LISTEN/NOTIFY triggers drive the live dashboards.",
      },
      {
        name: "SQL",
        icon: "devicon-azuresqldatabase-plain",
        description:
          "Schemas, roles, triggers and the ground-truth queries of the evaluation benchmark.",
      },
      {
        name: "scikit-learn",
        icon: "devicon-scikitlearn-plain",
        description:
          "Delivery-risk classifier with a time split and a model ladder, and a six-month price-index forecast with an expanding-window backtest.",
      },
      {
        name: "PuLP",
        icon: "devicon-python-plain",
        description:
          "Mixed-integer program (CBC solver) allocating a tender round under a risk ceiling and a 40% concentration rule.",
      },
      {
        name: "pandas",
        icon: "devicon-pandas-plain",
        description:
          "Feature engineering; benchmarked against Spark from 10k to 30M rows.",
      },
      {
        name: "React",
        icon: "devicon-react-original",
        description:
          "Single-page frontend (Vite): chat, charts, dashboards, alerts, recommendations, award plans.",
      },
      {
        name: "TypeScript",
        icon: "devicon-typescript-plain",
        description: "Typed frontend code and API client.",
      },
      {
        name: "Docker",
        icon: "devicon-docker-plain",
        description:
          "docker-compose stack: PostgreSQL, backend, MailHog, Adminer. One `make up` to run everything.",
      },
      {
        name: "pytest",
        icon: "devicon-pytest-plain",
        description: "133 automated tests run against the seeded stack.",
      },
    ],
    liveUrl: "",
    repoUrl: "https://github.com/HichemBahri/supplyscope",
    gallery: [
      "/optimized/images/supplyscope_5-large.webp",
      "/optimized/images/supplyscope_3-large.webp",
      "/optimized/images/supplyscope_4-large.webp",
      "/optimized/images/supplyscope_6-large.webp",
      "/optimized/images/supplyscope_7-large.webp",
      "/optimized/images/supplyscope_8-large.webp",
      "/optimized/images/supplyscope_1-large.webp",
      "/optimized/images/supplyscope_2-large.webp",
    ],
    technicalDetails: [
      { label: "Context", value: "Master's thesis, 5-month internship at GETS (Sfax)" },
      { label: "Method", value: "5 Scrum sprints, one module per sprint" },
      { label: "Benchmark", value: "95.3% on 43 questions, stable over 3 runs" },
      { label: "Tests", value: "133 automated (pytest)" },
      { label: "Data", value: "Synthetic seeded ERP world, 21 tables" },
    ],
    codeSnippet: "",
  },

  {
    id: 2,
    slug: "tactic-consulting",
    title: "Tac-Tic Consulting",
    imageUrl: "/optimized/images/tactic_cover-medium.webp",
    backgroundImage: "/optimized/images/tactic_cover-medium.webp",
    logo: "/optimized/images/tactic_logo-small.webp",
    shortDescription:
      "Open-source BI platform: a star-schema warehouse, Metabase dashboards and a Flask portal with role-based access and comments",
    longDescription:
      "End-of-studies project at Tac-Tic, an engineering firm specialised in open-source technologies. Departments were sharing figures by e-mail and rebuilding reports by hand. I designed a multidimensional data warehouse (8 dimensions, one fact table), built the ETL into PostgreSQL, compared open-source reporting tools and chose Metabase, then developed a Flask web application where employees log in and see the dashboards for their department, with an admin approving accounts and assigning departments.",
    projectUrl: "",
    difficulty: "3",
    tags: ["business intelligence", "data warehouse", "etl", "dashboards", "scrum"],
    markdownFilename: "tactic.md",
    color: "#a78bfa",
    technologies: [
      {
        name: "Python",
        icon: "devicon-python-plain",
        description: "ETL scripts (extract, clean, deduplicate, load) and the web backend.",
      },
      {
        name: "PostgreSQL",
        icon: "devicon-postgresql-plain",
        description:
          "Data warehouse in a star schema, plus the application database for users and departments.",
      },
      {
        name: "SQL",
        icon: "devicon-azuresqldatabase-plain",
        description: "Multidimensional model, KPIs and the Metabase questions behind each chart.",
      },
      {
        name: "Metabase",
        icon: "devicon-grafana-original",
        description:
          "Open-source reporting layer, chosen after a comparative study; dashboards embedded in the portal.",
      },
      {
        name: "Flask",
        icon: "devicon-flask-original",
        description:
          "Web application: registration, authentication, role-based access, profile and dashboard pages.",
      },
      {
        name: "Bootstrap",
        icon: "devicon-bootstrap-plain",
        description: "Responsive layout so dashboards work on any screen.",
      },
      {
        name: "HTML / CSS",
        icon: "devicon-html5-plain",
        description: "Templates and styling of the portal.",
      },
    ],
    liveUrl: "",
    repoUrl: "",
    gallery: [
      "/optimized/images/tactic_3-large.webp",
      "/optimized/images/tactic_7-large.webp",
      "/optimized/images/tactic_4-large.webp",
      "/optimized/images/tactic_5-large.webp",
      "/optimized/images/tactic_6-large.webp",
      "/optimized/images/tactic_8-large.webp",
      "/optimized/images/tactic_1-large.webp",
      "/optimized/images/tactic_2-large.webp",
    ],
    technicalDetails: [
      { label: "Context", value: "Bachelor's final project, 6-month internship" },
      { label: "Method", value: "Scrum, 5 sprints" },
      { label: "Warehouse", value: "Star schema: 8 dimensions, 1 fact table" },
      { label: "Architecture", value: "Three-tier: PostgreSQL, Flask, browser" },
    ],
    codeSnippet: "",
  },

  {
    id: 3,
    slug: "elk-log-monitoring",
    title: "ELK Log Monitoring",
    imageUrl: "/optimized/images/elk_cover-medium.webp",
    backgroundImage: "/optimized/images/elk_cover-medium.webp",
    logo: "/optimized/images/elk_logo-small.webp",
    shortDescription:
      "Real-time analysis of e-commerce web logs with the ELK stack, Python analytics and automated e-mail alerts",
    longDescription:
      "Big-data architecture project: Nginx logs from an e-commerce site are shipped by Filebeat over TLS to Logstash, parsed with Grok, enriched with GeoIP and indexed in Elasticsearch. Kibana dashboards cover traffic, errors and user journeys. A Flask interface launches a suite of Python analyses (error patterns, user scoring, geolocation of error sources) and runs an alerting job that e-mails the team when 4xx/5xx thresholds are crossed.",
    projectUrl: "",
    difficulty: "3",
    tags: ["elk stack", "log analytics", "monitoring", "alerting", "big data"],
    markdownFilename: "elk.md",
    color: "#f59e0b",
    technologies: [
      {
        name: "Elasticsearch",
        icon: "devicon-elasticsearch-plain",
        description:
          "Index with an explicit mapping for the fields queried most (status, URL, IP, geo_point).",
      },
      {
        name: "Logstash",
        icon: "devicon-logstash-plain",
        description:
          "Pipeline: Grok patterns for Nginx, mutate, date, GeoIP enrichment; parse failures tagged and routed to a separate index.",
      },
      {
        name: "Kibana",
        icon: "devicon-kibana-plain",
        description: "Dashboards for traffic, error codes, user agents and geography.",
      },
      {
        name: "Nginx",
        icon: "devicon-nginx-original",
        description: "Source of the access and error logs, shipped by Filebeat over TLS.",
      },
      {
        name: "Python",
        icon: "devicon-python-plain",
        description:
          "Elasticsearch client queries and aggregations, matplotlib/seaborn charts, GeoIP map, alert job.",
      },
      {
        name: "Flask",
        icon: "devicon-flask-original",
        description:
          "Web interface to trigger the pipeline, refresh the analyses and start or stop the alerts.",
      },
      {
        name: "pandas",
        icon: "devicon-pandas-plain",
        description: "Aggregation of query results before plotting.",
      },
    ],
    liveUrl: "",
    repoUrl: "",
    gallery: [
      "/optimized/images/elk_1-large.webp",
      "/optimized/images/elk_3-large.webp",
      "/optimized/images/elk_4-large.webp",
      "/optimized/images/elk_5-large.webp",
      "/optimized/images/elk_6-large.webp",
      "/optimized/images/elk_2-large.webp",
    ],
    technicalDetails: [
      { label: "Context", value: "Master's course project, IHEC Carthage" },
      { label: "Pipeline", value: "Filebeat → Logstash → Elasticsearch → Kibana" },
      { label: "Alerts", value: "Thresholds on 403/500/502/503/504, e-mail + log file" },
    ],
    codeSnippet: "",
  },

  {
    id: 4,
    slug: "dona",
    title: "Dona",
    imageUrl: "/optimized/images/dona_cover-medium.webp",
    backgroundImage: "/optimized/images/dona_cover-medium.webp",
    logo: "/optimized/images/dona_logo-small.webp",
    shortDescription:
      "Educational AI reading assistant: reads documents aloud with an expressive avatar, quizzes you, and answers questions with RAG",
    longDescription:
      "Dona is a desktop reading companion for learners. Load a PDF, Word or text file and it reads it aloud sentence by sentence, highlighting as it goes, while an avatar lip-syncs and changes expression with the sentiment of the text. Challenge mode pops a quiz every few sentences and keeps score. A second tab is a chatbot grounded on the document through a FAISS vector store and Gemini, so you can ask questions about what you just read.",
    projectUrl: "",
    difficulty: "3",
    tags: ["rag", "nlp", "text-to-speech", "edtech", "desktop app"],
    markdownFilename: "dona.md",
    color: "#f472b6",
    technologies: [
      {
        name: "Python",
        icon: "devicon-python-plain",
        description: "Single-codebase desktop application (about 2,600 lines).",
      },
      {
        name: "CustomTkinter",
        icon: "devicon-python-plain",
        description: "Modern Tkinter UI: reader tab, chatbot tab, avatar editor, quiz dialogs.",
      },
      {
        name: "LangChain",
        icon: "devicon-langchain-plain",
        description:
          "Document chunking (recursive splitter, 1000/150) and HuggingFace sentence embeddings.",
      },
      {
        name: "FAISS",
        icon: "devicon-meta-original",
        description: "Local vector store for retrieval over the loaded document.",
      },
      {
        name: "Gemini",
        icon: "devicon-google-plain",
        description: "Gemini 2.5 Flash generates grounded answers and the quiz questions.",
      },
    ],
    liveUrl: "",
    repoUrl: "",
    gallery: [
      "/optimized/images/dona_3-large.webp",
      "/optimized/images/dona_2-large.webp",
      "/optimized/images/dona_4-large.webp",
      "/optimized/images/dona_1-large.webp",
      "/optimized/images/dona_5-large.webp",
    ],
    technicalDetails: [
      { label: "Input", value: "PDF, DOCX, TXT; language auto-detected" },
      { label: "Voice", value: "gTTS + pygame, sentence-level playback" },
      { label: "NLP", value: "NLTK (tokenising, VADER sentiment), spaCy" },
      { label: "Avatar", value: "python-avatars, SVG → PNG per expression" },
    ],
    codeSnippet: "",
  },
];
