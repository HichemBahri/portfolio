# Tac-Tic Consulting

An open-source business-intelligence platform: a star-schema data warehouse, Metabase dashboards, and a web portal where each employee sees the dashboards of their own department and can discuss them.

> **Bachelor's final project**: six-month internship at Tac-Tic, an independent engineering firm specialised in open-source technologies (Tunis). Run in Scrum over five sprints.

## The problem

Each department collected its own figures (sales, customer feedback, operational metrics) in spreadsheets and shared them by e-mail. Reports were rebuilt by hand, numbers disagreed between departments, and the people who should have been analysing were spending their time reconciling.

The brief: integrate an open-source reporting tool and build a web application where employees access the dashboards of their department, with role-based access and a responsive layout.

![The portal: log in or register to reach your department's data](/optimized/images/tactic_1-large.webp)

## Sprint 1 and 2: the warehouse and the ETL

I started with the KPIs each department actually tracked, then modelled a **multidimensional star schema**: eight dimensions (projects, employees, clients, departments, invoices, offices, tasks, platforms) around one fact table.

The ETL, written in Python, extracts from the source files, cleans and deduplicates (department names were a particular mess), and loads into **PostgreSQL**.

## Sprint 3: choosing and deploying Metabase

Before building dashboards I ran a comparative study of open-source reporting tools on criteria that mattered to a small firm: self-service for non-technical users, embedding, deployment options, licence. **Metabase** won: questions can be built without SQL, dashboards embed cleanly, and it runs as one container.

I then built one dashboard module per business area: client interaction, employee overview, financial overview, office activities, project management, task management, technology utilisation.

![The seven dashboard modules](/optimized/images/tactic_3-large.webp)

![Financial overview: invoices by project, payment delays, invoice trends](/optimized/images/tactic_4-large.webp)

![Office activities: projects per office, satisfaction rating, employee distribution](/optimized/images/tactic_5-large.webp)

![Task management: completion, deadlines, tasks per employee](/optimized/images/tactic_6-large.webp)

## Sprint 4 and 5: the web portal

A **Flask** application with a three-tier architecture (PostgreSQL, Flask, browser) and a **Bootstrap** front end:

- **Registration and authentication**: employees sign up; an administrator approves the account and assigns it to a department.
- **Role-based access**: administrators manage users from an admin panel (search, filter by department, approve, edit); employees only see their department's dashboards.
- **Dashboards page**: Metabase dashboards embedded in the portal, responsive down to a phone, with a **comments thread** under each dashboard so a team can discuss a number where they see it.
- **Profile management**: employees update their own details.

Each sprint went through analysis (use cases, sequence diagrams in StarUML), design, implementation and tests (Postman for the API, manual UI tests).

![Sign-up form](/optimized/images/tactic_2-large.webp)

![Admin panel: approve users and assign departments](/optimized/images/tactic_8-large.webp)

![Dashboard embedded in the portal, with comments underneath](/optimized/images/tactic_7-large.webp)

## What I took from it

This was the first time my dashboards were used by people other than me. Most of the real work was before any chart existed: agreeing on what a KPI means across departments, and getting the data clean enough that two people looking at the same number would get the same number.
