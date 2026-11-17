# SupplyScope

Agentic AI platform for the reactive analytical visualisation of EPC supply-chain data.

> **Master's thesis**: built during a five-month internship in the IT department of GETS (Global Engineering for Technical Services, Sfax), an EPC contractor in oil & gas, in collaboration with its supply-chain and tendering teams. Version 1.0 frozen in September 2026. [Source on GitHub](https://github.com/HichemBahri/supplyscope).

## The problem

An EPC contractor buys thousands of items for projects that are built far from where they are purchased. The data exists in the ERP, but every question ("which suppliers are late this quarter?", "how much did steel cost us per project?") goes through someone who knows SQL, and the answer is a static export that is already stale by the time it is read.

SupplyScope lets a procurement engineer, a logistics coordinator or a tendering team member ask the question in plain language, get a chart back, pin it to a dashboard, and watch it refresh by itself when the ERP changes.

![Ask the ERP a question in plain language](/optimized/images/supplyscope_5-large.webp)

## What it does

Around one PostgreSQL database modelled on the procure-to-pay process, five reasoning layers:

| Module | Capability |
|---|---|
| **Conversational analytics** | A LangGraph agent turns a question into SQL, runs it under a read-only database role, repairs its own errors from the database feedback and returns a validated chart. Fast and smart model tiers. |
| **Charts and dashboards** | Charts saved from answers, composed into dashboards that refresh within a second of a change in the ERP (LISTEN/NOTIFY, Server-Sent Events). Shared dashboards with comments. |
| **Predictions** | Delivery-risk classifier (order-time features, time split, model ladder with a registry) and a six-month price-index forecast with an expanding-window backtest. |
| **Alerts** | Seven declarative business rules evaluated on every data change, alert lifecycle (new, acknowledged, resolved, purged), in-app notifications and critical-alert e-mail. |
| **Supplier recommendation** | Simple Additive Weighting over seven criteria, including the predicted risk, with presets and custom weights; every score decomposes into auditable contributions. |
| **Award optimisation** | Mixed-integer program (PuLP + CBC) that allocates a tender round under a risk ceiling and the 40% concentration rule, compared with the actual awards and the cheapest-bid plan. |
| **Dashboard synthesis** | A complete dashboard generated from one topic, each view produced by the agent and filtered by deterministic quality gates that drop or repair defective charts and explain why. |

## Architecture

A modular monolith, deliberately. One FastAPI application with strict internal layering (routes, services, agent, persistence), three containers under docker-compose, a React + Vite single-page frontend.

```
React SPA  ──NL question──►  FastAPI
 Plotly.js ◄──chart spec──    ├─ LangGraph orchestrator: plan → SQL → validate → chart spec → answer
   ▲                          └─ Reactivity engine: LISTEN/NOTIFY → dependency index → re-exec → SSE push
   └──auto-refresh (SSE)──    PostgreSQL 16 (schema erp: supply-chain data · schema app: users, charts, dashboards)
```

Three design decisions shaped everything else:

- **One orchestrator, not a team of agents.** The task is a sequential workflow (plan, generate, validate, correct). A single LangGraph state machine with typed state and conditional edges is auditable, testable and cheap, and still agentic: dynamic planning, tool use, self-correction loops.
- **Charts are declarative JSON, never generated code or images.** The agent emits `{sql, chart_type, encodings, title}` validated against Pydantic models; the frontend renders it with Plotly. Reactivity then is just "re-run the query and push the rows", and no LLM output is ever executed.
- **Read-only by construction.** The agent's SQL runs under a database role that cannot write. Self-correction uses the database's own error messages as feedback.

## Predictions

The **delivery-risk classifier** scores every open shipment with the probability that it misses its promised date. Models are trained on a time split (no leakage from the future), compared on a ladder (logistic regression, random forest, MLP) and registered with their metrics and top signals.

![Late-delivery risk on open shipments, with the active model and its baseline ladder](/optimized/images/supplyscope_3-large.webp)

The **price-index forecast** projects the median unit price of each material category six months ahead. The winner of an expanding-window backtest makes the forecast, and the backtest error of every candidate is shown next to it.

![Six-month material price-index forecast with the backtest results](/optimized/images/supplyscope_4-large.webp)

## Alerts and optimisation

Seven business rules (project over budget, supplier on-time rate below threshold, and so on) are re-evaluated on every data change, and alerts go through a lifecycle with acknowledgement and e-mail for the critical ones.

![Expert-system alerts evaluated continuously over live data](/optimized/images/supplyscope_7-large.webp)

The **award optimiser** allocates the contested RFQs of a tender round across suppliers, minimising expected cost (price plus an ML-predicted delay penalty) under one award per RFQ, a hard risk ceiling and a 40% concentration rule, and compares the plan with the actual awards and the naive cheapest-bid plan.

![MILP award optimisation, solved exactly by CBC, compared with the actual awards](/optimized/images/supplyscope_6-large.webp)

## Evaluation

Every number in the thesis is reproducible from the repository with one `make` command:

- **Agent accuracy: 95.3%** (fast tier) and 93.0% (smart tier) on a 43-question benchmark whose ground truth is computed by the database, identical over three runs.
- **133 automated tests** run against the seeded stack.
- **Scale study**: a twin pandas / Spark feature job, benchmarked from 10k to 30M rows; pandas was faster at every size on one machine.

## Security and data

JWT with three roles (analyst, manager, administrator), e-mail verification, lockout after failed attempts and an immutable audit trail of sensitive actions.

![Sign-in](/optimized/images/supplyscope_1-large.webp)

![Audit trail: every sensitive action with its actor and time](/optimized/images/supplyscope_8-large.webp)

![User profile and department](/optimized/images/supplyscope_2-large.webp)

The data is synthetic, generated from a seed (21 tables, about 9,000 rows, with planted situations for the demos) and contains no information from GETS.

## Method

Five Scrum sprints, one module per sprint, with the report written chapter by chapter alongside. Stack: Python 3.12, FastAPI, LangGraph, PostgreSQL 16, scikit-learn, PuLP, React, TypeScript, Docker, pytest.
