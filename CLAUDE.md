# CLAUDE.md — Portfolio (Mohamed Hichem Bahri)

A personal developer portfolio styled like an IDE/terminal ("Enter the matrix"). It is built with
Next.js 15 App Router, React 19, Tailwind v4 and shadcn/ui (new-york). It is deployed on Vercel.
The repo began as Vercel's `portfolio-blog-starter` template, so the README and a few leftovers
(blog, RSS, `baseUrl`) still come from that template.

More detailed notes live in sub-directory CLAUDE.md files. Read the one for the area you are touching:

| Area | File |
|---|---|
| Content/data layer (projects, about, contacts, project markdown) | `app/_data/CLAUDE.md` |
| UI components (feature folders, shadcn `ui/`, layout patterns) | `app/components/CLAUDE.md` |
| API routes (AI chat, contact email, image resizing) | `app/api/CLAUDE.md` |
| Image pipeline scripts and `public/` layout | `tools/CLAUDE.md` |

## Commands

The package manager is **pnpm** (`pnpm-lock.yaml`).

```bash
pnpm dev                 # next dev
pnpm build               # next build (ESLint is skipped during builds: next.config.js ignoreDuringBuilds)
pnpm start
pnpm exec eslint .       # there is no lint script; run ESLint directly
pnpm exec tsc --noEmit   # type-check (strict + noUncheckedIndexedAccess)
node tools/optimize-images.mjs   # see tools/CLAUDE.md
```

There is no test suite.

### Environment variables (server-only, read from `.env`, which is gitignored)
- `GROQ_API_KEY`: AI terminal chat (`app/api/chat/route.ts`)
- `RESEND_API_KEY`, `EMAIL_ADDRESS`: contact form email (`app/api/contact/route.ts`)

## Architecture at a glance

```
app/layout.tsx  (RSC root: Fira Code font, metadata/SEO, Vercel Analytics + SpeedInsights)
 └─ SplashScreenProvider (client)  ← renders children at once; covers them with the logo splash only while the page is still loading
     ├─ Navbar (absolute, h-12 top)       app/components/nav.tsx
     ├─ {page}
     └─ Footer (fixed, h-12 bottom)        app/components/footer.tsx
```

### Routes
| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` → `components/hero.tsx` | Typing text animation, snake game, background boxes and blobs (client, dynamically imported with `ssr:false`) |
| `/about/[[...slug]]` | `app/about/[[...slug]]/page.tsx` | Joins the slug into a key (`experience/talan`) and looks it up in `mainContent` from `_data/about-data.ts`. The default key is `bio`. Shows an IDE layout with a sidebar, tabs, a code viewer and the AI terminal |
| `/projects?tech=a,b` | `app/projects/page.tsx` | Server-side filtering through the URL search param `tech`. The filter UI is plain `<Link>`s (no client state) |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Finds the project in `_data/projects-data.ts`, reads `app/_data/content/<markdownFilename>` with `fs` at request time, and passes it to `ProjectPageClient` |
| `/contact` | `app/contact/page.tsx` | Whole page is `"use client"`. Uses react-hook-form + zod, a live code preview, and POSTs to `/api/contact` |
| `/blog`, `/blog/[slug]` | `app/blog/**` | **Disabled.** The template code is commented out. The posts in `app/blog/posts/*.mdx` are template samples, and `[slug]` renders a placeholder |
| `/api/chat` | `app/api/chat/route.ts` | Groq LLM grounded on the `_data` content |
| `/api/contact` | `app/api/contact/route.ts` | Sends email through Resend |
| `/api/images/[...path]` | `app/api/images/[...path]/route.ts` | On-the-fly sharp resize/convert of files in `public/` |
| `/og?title=` | `app/og/route.tsx` | Edge `ImageResponse` with the logo and `~/{title} ❯ _Mohamed_Hichem_Bahri` |
| `/rss` | `app/rss/route.ts` | Fully commented out |
| `sitemap.xml`, `robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Sitemap covers `/`, `/blog`, `/projects` and every project slug |

### Recurring design pattern: server page → "layout" shim → client layout
The `about` and `projects` pages are async Server Components. They compute data and pass already-rendered
RSC nodes (`sidebar`, `contentPanel`, `filterBar`, …) as **props** into a client layout component.
That client component owns the resizable panels (desktop) and the drawer/sheet (mobile).
The `*-layout.tsx` files are thin pass-through wrappers around `*-page-client(-layout).tsx`.
Keep data fetching and `fs` reads in the server page, and keep interactivity in the client layout.

Every main page uses the wrapper `<div className="h-[calc(100vh-48px)] pt-11">` so it fits between the
absolute navbar and the fixed footer. Desktop and mobile are separate trees, toggled with `hidden md:block` / `md:hidden`.

### Single source of truth: `app/_data/`
All site content is hard-coded TypeScript and Markdown in `app/_data/`. There is no CMS and no DB.
The same data feeds three consumers: the pages, the sitemap, and the **AI chat system prompt**.
When you edit content, all three change. See `app/_data/CLAUDE.md`.

## Conventions
- Path alias: `~/*` → `./app/*`. Examples: `~/components/ui/button`, `~/_data/projects-data`, `~/lib/utils`.
  `app/robots.ts` uses the bare `app/sitemap` instead. Prefer `~/`.
- `cn()` (clsx + tailwind-merge) lives in `app/lib/utils.ts`.
- shadcn config is in `components.json`: style new-york, RSC, lucide icons, aliases under `~/`.
  New primitives go in `app/components/ui/`.
- Styling: **Tailwind v4 CSS-first**. Theme tokens are defined in `app/global.css` (`:root` vars + `@theme inline`).
  Landing page display type uses fluid tokens from `global.css` (`text-display` hero name, `text-title` section h2, `text-dialog` dialogue-box lines, `text-lead` hero tagline). They scale with min(vw, vh), so use them instead of fixed `md:text-5xl`-style sizes for headings.
  On desktop (>= 1024px wide) the root font size shrinks from 100% (1080px tall) to 87.5% (720px tall) for laptops with 125-150% OS scaling, so prefer rem over px for sizes that should follow (the pixel mascot is rem-based for this reason).
  The site is dark-only, with no light mode. Syntax-highlight colors are `--sh-*`, exposed as `text-syntax-{keyword,string,function,…}`.
  `tailwind.config.ts` is a **legacy v3 file and is not loaded** (no `@config` directive). Do not edit it expecting an effect.
- Tech icons use **devicon** CSS classes (`devicon-react-original`), imported globally in `global.css`.
- Animation: use `framer-motion` (it is used almost everywhere). `motion/react` appears only in the unused `ui/background-lines.tsx`.
- Visual language: terminal/IDE metaphors (`❯ ls ./projects | grep "React"`, `cat filters.yml`, `_hello`, `_about me`,
  `^C` to clear filters). Monospace Fira Code is used everywhere (`--font-fira-code`). Follow the same style in new UI.
- Prettier uses `prettier-plugin-tailwindcss` (class sorting). ESLint is flat config with typescript-eslint type-checked rules.
  The `drizzle` plugin rules are leftover from the T3 template (there is no DB).
- TS is strict with `noUncheckedIndexedAccess`, so array/record indexing returns `T | undefined`.

## Known gotchas and tech debt (verify before relying on these)
- `SplashScreenProvider` overlays the splash until the `load` event (5s cap). It is invisible for the first 400ms
  (CSS delay), so it only appears on slow loads. The hero typing waits for it via `useSplashVisible()`.
- `app/sitemap.ts` `baseUrl` is still the template URL `https://portfolio-blog-starter.vercel.app`.
  `layout.tsx` metadataBase and `robots.ts` use it too.
- The project filter compares `tech.name.toLowerCase()` against the filter `id`. A filter only matches when the id
  equals the lowercased technology name in the project data. For example, id `apache-airflow` vs name "Apache Airflow" never matches.
- `/api/contact` interpolates user input into the email HTML without escaping.
- The `/api/images` route joins user-provided path segments under `public/` and has no explicit traversal guard.
- Unused or dead modules exist (listed in the sub-CLAUDE.md files). Check for importers before you "fix" something there,
  because it may not be wired up at all.
