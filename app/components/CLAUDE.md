# app/components — UI

Everything is grouped by **feature folder**. Generic primitives go in `ui/`.
Almost every component is a client component (`"use client"`). The server/client split happens in the route
`page.tsx` files (see the root CLAUDE.md, "server page → layout shim → client layout").

## Global shell (top level)
| File | Role |
|---|---|
| `nav.tsx` | `Navbar`. h-12 header: `absolute` on desktop (tabs `_hello`, `_about me`, `_projects`, `_contact-me`), `fixed` on mobile (mini `PixelMascot` + a `[ menu ]` button opening a `Sheet` styled as an RPG dialog with a vertical `BracketMenu` and social links). Also renders `FloatingNav` (`floating-nav.tsx`): desktop-only dialog-box nav that replaces the bar after 120px of window scroll |
| `footer.tsx` | Fixed h-12 footer with GitHub/LinkedIn links (hard-coded, duplicating `_data/contact-data.ts`) and a live clock |
| `SplashScreenProvider.tsx` → `LogoLoadingAnimation.tsx` | Wraps the app in `layout.tsx`. Children always render; a `.splash-cover` overlay sits on top until `window` `load` (max 5s) and only becomes visible after 400ms, so fast loads never show it. `useSplashVisible()` lets intros wait (the hero typing does) |
| `LogoLoadingAnimation.tsx` | Also used by `app/loading.tsx` (route Suspense fallback) |
| `hero.tsx` + `hero/` | Home page. `hero-text-animation.tsx`/`.css` is the typing intro. `hero-blobs.tsx`/`.css` holds the decorative blobs (`ssr:false`). It also uses `ui/background-boxes` |
| `snake-game.tsx` → `snake-game-canvas.tsx` | Interactive canvas snake game on the hero (dynamic, `ssr:false`, desktop only). On mobile the hero shows `hero/synthwave-scene.tsx` instead: a canvas synthwave horizon (neon blue wireframe waves, striped pink-to-indigo sun), dynamic `ssr:false`, paused off screen, one still frame under reduced motion. |
| `markdown-renderers.tsx` | `markdownComponents` map for `react-markdown` (headings, tables → `ui/table`, `pre` → `ui/code-block`, `img` → `next/image` + click-to-zoom `Dialog`). Code fences support `language-x{1,3-5}[filename]` meta for highlighted lines and a filename |
| `LoadingProvider.tsx`, `LoadingScreen.tsx`, `PageTransition.tsx` | **Unused.** `useLoading` is commented out in `hero.tsx` |
| `mdx.tsx`, `posts.tsx` | Blog template leftovers (`next-mdx-remote` + `sugar-high`). They are only referenced from commented-out blog code |

## Feature folders

### `about/` (route `/about/[[...slug]]`)
- `about-layout.tsx` is a shim. `about-page-client.tsx` holds the real layout:
  - Desktop: a horizontal `ResizablePanelGroup` with the sidebar (20%) and the main area. The main area has a `TabBar`
    on top, then a vertical split of content (55%) and `Terminal`, unless the terminal is minimized.
  - Mobile: the header shows the current file name and a `[ switch file ▾ ]` button that opens a full-screen `ScreenDialog` with `about-file-tree.tsx` (the sidebar data drawn as a `tree`-style folder hierarchy). A floating `[ ask ai ]` button opens the `Terminal` full-screen in another `ScreenDialog`.
  - **Open tabs persist in localStorage** (`openAboutTabs`) through `~/hooks/useLocalStorage`. So does the terminal minimized
    state (`terminalMinimized`). Navigating to a key adds a tab, and closing the active tab `router.push`es to a neighbor.
    `icon` cannot survive JSON serialization, so `TabBar` always renders `FileCode`.
- `about-sidebar.tsx` renders `sidebarSections` from `_data/about-data.ts` as a file-tree. Links go to `item.path`.
- `content-panel.tsx` uses `react-syntax-highlighter` (Prism) with a theme built from the `--sh-*` CSS vars and line numbers.
- `animated-typing.tsx` is **unused**.

### `projects/` (routes `/projects` and `/projects/[slug]`)
- List page: `project-page-layout.tsx` (shim) → `projects-page-client-layout.tsx`. Desktop shows a resizable
  filter sidebar and the grid. Mobile shows a `[ filters ▾ ]` button that opens a full-screen `ScreenDialog` with
  `FilterSidebar variant="screen"` (`[x]`/`[ ]` bracket toggles that update `?tech=` live, plus `[ clear all ]` and `[ show N projects ]`). Above the grid, mobile shows `❯ ls ./projects // N of M` and, when filters are on, a scrollable row of removable `[ name ✕ ]` chips (`MobileFilterChips` in `app/projects/page.tsx`); the `| grep` command line is desktop-only.
  `filter-sidebar.tsx` (server-safe; an accordion of `<Link>` checkboxes that toggle `?tech=`).
  `projects-page-client.tsx` is a framer-motion staggered grid of `project-card.tsx`.
- Detail page: `project-page-client.tsx` contains the hero (logo, difficulty gems, tags, repo/live buttons),
  the gallery `Carousel` with a fullscreen `Dialog` and prev/next, and `project-tabs.tsx` (`README` | `TECH_STACK`).
  `project-views.tsx` lazy-loads `ReadmeView` (→ `project-showcase.tsx` → ReactMarkdown + remark-gfm + `markdownComponents`)
  and `TechStackView` (devicon cards).
- `project-blobs.tsx` and `project-carousel.tsx` are **unused**.

### `contact/` (route `/contact`, and the `#contact` section of the home page)
- `contact-section.tsx` owns the form state and renders everything below. `variant="page"` (the `/contact` route) uses an h1 and the mascot. `variant="home"` (`app/page.tsx`, between `Timeline` and `SignOff`) uses an h2, `id="contact"`, and no mascot because the sign-off mascot follows. The sign-off `[ contact ]` option links to `/#contact`.
- Styled like the home page, not the IDE panes: `HomeBackground`, a `❯ mail iheb` / `Contact` / `// comment` header, then a
  two-column grid (stacks below `lg`).
- `contact-dialog.tsx`: the `PixelMascot` above a sign-off-style dialogue box (2px cyan border, `#101822`, hard offset shadow).
  It types a prompt and holds the form. After a successful send it swaps to a typed confirmation with `[ write another ]`, and the mascot hops and waves.
- `contact-form.tsx` (shadcn `Form`): inset fields that pick up the hard shadow on focus, a `n/500` counter, Ctrl/Cmd+Enter sends from the message box, and a bracket submit button with a press-in shadow. `schema.ts` is the zod schema (the client-side rules).
- `contact-channels.tsx` (from `_data/contact-data.ts`) and `mail-preview.tsx`: the live message drawn as a `mail` session, md+ only.

### `terminal/`
- `terminal.tsx` is the AI chat terminal embedded in the about page (dynamic, `ssr:false`). It handles `help` and `clear`
  locally and POSTs other input to `/api/chat`. Messages live only in component state.
  `message.tsx` is a memoized message line.

## `ui/`: primitives
- **shadcn (new-york)**: accordion, alert, badge, button, card, carousel (embla), checkbox, dialog, drawer (vaul),
  dropdown-menu, form, input, label, navigation-menu, resizable (react-resizable-panels), scroll-area, separator,
  sheet, skeleton, table, textarea, tooltip. Regenerate or add them with the shadcn CLI (it uses `components.json`).
  Unused right now: alert, card, navigation-menu, separator, tooltip.
- **Custom / Aceternity-style** (do not overwrite with the shadcn CLI):
  - `view-tabs.tsx`: always-visible bracket-style segmented tabs for switching panels on mobile. **Unused** since the contact page redesign.
  - `screen-dialog.tsx`: `ScreenDialog` (full-screen mobile sheet: CRT power-on, typed title, `[ close ]`) and `BracketButton`. Used by the mobile nav menu and the about page.
  - `bracket-menu.tsx`: RPG-style `❯ [ option ]` link menu (row or column, h/l or j/k keys). Used by the floating nav, the mobile menu and the home sign-off.
  - `lazy-image.tsx`: wrapper around `next/image` with an `AsciiDonut` loading state and an error fallback.
    Used by the project pages and the home leaderboard carousel (`fill` mode, with `loaderClassName` to scale the donut to the small screen).
    It rewrites `/images/*` sources to `/api/images/*?w=&h=&q=`.
  - `ascii-donut.tsx`: the spinning ASCII donut loader.
  - `background-boxes.tsx` (`Boxes` grid; hero + project page), `background-gradient.tsx` (project cards),
    `background-lines.tsx` (unused), `blob.tsx`.
  - `code-block.tsx`: Prism highlighter with copy button, filename and highlighted lines (used for markdown).

## Hooks (`app/hooks/`)
- `useLocalStorage.ts`: `[value, setValue]` persisted with JSON. It reads synchronously in the initializer, so a
  hydration mismatch is possible.
- `useMediaQuery.ts`: `useMediaQuery(query)` returns `boolean | null` (`null` before mount). The hero and `HomeBackground` use it so phones never download the snake game or hero blobs and desktops never load the synthwave canvas.
- `useViewportKeys.ts`: `useViewportKeys(ref, handler, enabled?)` gives a component vim keys while it is on screen, with no focus needed. One shared window listener sends each key to the registered element that fills the most of the viewport (at least 50% visible). It skips keys a focused element already handled (`preventDefault`), typing in inputs, modifier combos and open dialogs. Used by the snake canvas, `LeaderboardTable` (j/k/h/l) and `BracketMenu` when `viewportKeys` is set (the sign-off). Arrow keys are left to page scrolling unless the component is focused.
- `useLogoColor.ts`: **unused**.

## Mobile performance notes
- Keep looping animations compositor-only (CSS `transform`/`opacity` on an HTML element with its own layer). Animating an SVG's transform with framer-motion repainted the page every frame (that was the `ScrollPager` arrow).
- `HomeBackground` and the synthwave scene sit on their own layers (`will-change-transform`) so other repaints never re-raster them.
- `background-boxes.tsx` draws one batched path at max 2x DPR and ignores height-only shrinks from mobile address-bar resizes. Hover highlighting is attached only when `(hover: hover) and (pointer: fine)` matches, so on touch screens the grid is static (taps fire `mousemove`, and every lit cell redrew the whole canvas).
- Leaderboard project switching (`leaderboard-table.tsx`): the old panel leaves in the same commit (each row's `AnimatePresence` is keyed by selection), the browser's scroll anchoring is paused, and one `scrollBy` in a layout effect keeps the tapped row where it was; after the open animation, `scrollIntoView({ block: "nearest" })` reveals the panel. Don't reintroduce per-frame scroll correction (it forced a layout and repaint every frame).
- While a `ScreenDialog` is open, `<html>` gets `data-screen-open` (immediately) and `data-screen-covered` (after the 250ms power-on); `global.css` hides `<main>` on the latter and the synthwave scene stops drawing on the former. New looping animations on the page should check `data-screen-open` too: being covered by the dialog doesn't stop `IntersectionObserver` from reporting them visible.
- GPU-heavy effects are desktop-only (`md:`): backdrop blurs (navbar, achievement toast, leaderboard), large blurred `shadow-2xl` glows, and full-size gradient overlays (leaderboard scanlines and vignette) on anything that changes size. On phones the leaderboard details panel fades in at full height instead of animating `height` (which repainted everything below it every frame). `ScreenDialog` renders its sheet without the dim overlay (`overlay={false}` on `SheetContent`).
- Avoid `backdrop-blur` on large panels on phones; pre-mix the tint with the page background instead (see `leaderboard-table.tsx`).

## Conventions for new components
- Put new components in the matching feature folder. Put a component in `ui/` only if it is generic.
- Keep the IDE/terminal aesthetic: mono font, `text-syntax-*` colors, `❯` prompts, bordered `border-border` panes.
- Provide both a desktop (`hidden md:block`) and a mobile (`md:hidden`) tree for panel-heavy layouts. Do not try to
  make resizable panels responsive.
- Load heavy, browser-only pieces (canvas, terminal, blobs) with `next/dynamic` and `{ ssr: false }`.
