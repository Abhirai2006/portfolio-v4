# Abhishek Rai A - Portfolio

The personal portfolio of **Abhishek Rai A**, a B.E. Artificial Intelligence & Machine Learning student at Mysore University School of Engineering. It is a recruiter-friendly, single-page story about shipped projects, current learning, live code activity, and the person behind the work.

**Live site:** https://YOUR-DOMAIN  
**Résumé:** https://YOUR-DOMAIN/resume

![Portfolio hero](docs/screenshots/01-hero.png)

## What is included

- **A clear first screen** with Abhishek's current focus, GPA, semester, honest project count, portrait, résumé link, GitHub link, and a pre-filled “Hire me” email path.
- **Origin Story** with the Bluemind Solutions Core AI & ML internship, the Customer Churn Intelligence System capstone, and measurable model results.
- **Power Levels** that separate proficient, intermediate, and learning skills instead of presenting every tool as production experience.
- **Live Code Activity** with GitHub repository statistics, language mix, and a contribution heatmap fetched through cached server functions.
- **The Arsenal** with project cards, accessible click-to-open previews, screenshot carousels, terminal output for the C++ suite, live-site links, repository links, and full case-study pages.
- **Ask Abhishek** with streamed answers grounded in resume and lifestyle context. Anime Mode is optional and adds restrained Gen-Z phrasing and references from the anime shelf without changing factual answers.
- **Anime Shelf / Technique Vault** that stays opt-in and uses the supplied real video clips, hover previews, and a full-screen viewing stage.
- **Contact terminal** with the email and phone hidden until `cat contact.sh` is clicked, plus a copy-email action.
- **Public résumé, reviews, thank-you, and custom 404 pages** with page-specific metadata and responsive layouts.
- **A genuine visitor total** stored in Supabase. Each browser session is counted once, and the live distinct-session total is shown in the hero instead of using a placeholder number.
- **Light and dark themes**, keyboard-friendly controls, ARIA labels, responsive layouts, and reduced-motion support.

## Screens

| Hero | Power Levels |
| --- | --- |
| ![Hero](docs/screenshots/01-hero.png) | ![Power Levels](docs/screenshots/02-power-levels.png) |

| Live Code Activity | The Arsenal |
| --- | --- |
| ![GitHub activity and contribution heatmap](docs/screenshots/03-live-code.png) | ![Project case-study cards](docs/screenshots/04-projects.png) |

| Ask Abhishek | Anime Shelf |
| --- | --- |
| ![Ask Abhishek streaming chat](docs/screenshots/06-ask.png) | ![Anime shelf and watch log](docs/screenshots/05-anime.png) |

| Contact terminal | Mobile layout |
| --- | --- |
| ![Contact terminal](docs/screenshots/08-contact.png) | ![Portfolio on a 390px viewport](docs/screenshots/07-mobile-hero.png) |

## Current project lineup

1. **Customer Churn Intelligence System** - leak-free preprocessing, model comparison, threshold tuning, error analysis, and a Streamlit scoring dashboard. Reported results: 0.849 cross-validation ROC-AUC, 82% churner recall, and an estimated ~$179k annual recoverable revenue.
2. **MUSE Students Voice** - USN-verified anonymous grievance platform with database-level access control, peer escalation, and formal PDF letters.
3. **O(patience)** - step-by-step sorting visualiser with five algorithms, pointer state, Race Mode, Quiz Mode, sound mode, and an embeddable view.
4. **Binary Search Visualizer** - dependency-free JavaScript visualiser showing low/mid/high movement, logarithmic narrowing, and audio feedback.
5. **C++ Console Mini-Suite** - Tic-Tac-Toe, a validated Mini Banking System, and Rock-Paper-Scissors using C++17 and standard-library concepts.

Each project has shared data in `src/lib/projects.ts`, a case-study page at `/projects/:slug`, and the right presentation for its format: screenshots for web projects and a terminal session for the C++ suite.

## Technology

| Area | Tools |
| --- | --- |
| Framework | TanStack Start, TanStack Router, React 19, TypeScript |
| Build | Vite 8, Bun, ESLint, Prettier |
| Styling | Tailwind CSS v4, OKLCH semantic tokens, responsive CSS |
| 3D and motion | Three.js, React Three Fiber, Drei, Framer Motion, GSAP, Lenis |
| UI patterns | Accessible dialogs, command palette, MagicCard spotlight, Apple-style dock, carousels |
| Data and backend | Supabase (PostgreSQL), RLS, public server functions, anonymous analytics |
| AI | Gemini API (native) or any OpenAI-compatible endpoint with server-side SSE streaming |
| External data | GitHub REST API with server-side caching |
| Assets | CDN-hosted portfolio images, portrait, font, and anime media |

## Architecture

```text
src/
├── routes/
│   ├── __root.tsx                 Shared shell, metadata, fonts, 404, error boundary
│   ├── index.tsx                  Main narrative portfolio chapters 00–07
│   ├── resume.tsx                 Indexable, print-friendly résumé
│   ├── reviews.tsx                Anonymous review form and published review wall
│   ├── thank-you.tsx              Review submission confirmation
│   ├── projects.$slug.tsx         Dynamic project case studies
│   └── api/chat.ts                Validated public chat endpoint with SSE output
├── components/
│   ├── portfolio/                 Hero, GitHub, chat, anime, cards, navigation
│   └── motion/                    Dock, magnetic buttons, counters, reveals, trails
├── lib/
│   ├── projects.ts                Shared project content, metrics, screenshots, links
│   ├── analytics.ts               Anonymous events and session-deduplicated visitor count
│   ├── github.functions.ts        Cached GitHub server functions
│   └── contact.ts                 Obfuscated contact data and mail templates
└── styles.css                     Theme tokens, font faces, motion, and accessibility rules
```

### Data flow

- The browser renders the public portfolio and uses the publishable backend client for anonymous review submissions and analytics.
- The visitor counter calls `record_site_visit(session_id)`. A unique browser session is inserted once, and the database returns the current total. No visitor identity or contact data is stored.
- GitHub data is loaded through TanStack server functions and cached for ten minutes so the public page stays fast and does not expose server-side implementation details.
- Chat requests are validated at `/api/chat`, trimmed to the most recent turns, enriched with the portfolio context, and streamed back as Server-Sent Events.
- Project content is local and typed, so cards, modals, case-study pages, and résumé entries stay aligned.

## Run locally

**Prerequisites:** Bun or Node 20+.

```bash
bun install
bun run dev       # http://localhost:8080
bun run build     # production build
bun run lint      # ESLint
bun run format    # Prettier
```

Copy `.env.example` to `.env` and fill it in. Set `VITE_SITE_URL` to the public URL, the Supabase variables, and `AI_API_KEY` (optionally `AI_MODEL`; set `AI_BASE_URL` to use an OpenAI-compatible provider instead of native Gemini). Keep private keys server-only; never expose `AI_API_KEY` through a `VITE_` variable or client bundle.

## Ask Abhishek

`src/routes/api/chat.ts` accepts a validated message list and an `animeMode` flag. It keeps the latest twelve turns, applies the resume and lifestyle context, calls the configured AI endpoint with streaming enabled, and forwards the SSE response to `AskAbhishek.tsx` for the typewriter effect. Anime Mode is off by default and may add one subtle reference from the watched list while preserving grounded answers.

## Accessibility and performance

- Semantic headings, descriptive image alt text, keyboard-accessible dialogs and links, ARIA labels, and visible focus behavior.
- `prefers-reduced-motion` disables long-running motion, marquee movement, theme banners, and decorative animation.
- Heavy 3D code is lazy-loaded, screenshots and media are CDN-hosted, and GitHub requests are cached.
- Public routes have unique titles, descriptions, canonical URLs, Open Graph/Twitter metadata, and structured profile data where appropriate.

## Deployment

Deployed on Vercel. Import the repo, leave the build command as `bun run build`, and add these environment variables in Project Settings → Environment Variables:

- `VITE_SITE_URL` (public URL, no trailing slash)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID`
- `AI_API_KEY` (optionally `AI_BASE_URL`, `AI_MODEL`)

Nitro detects Vercel automatically. Elsewhere it falls back to Cloudflare Workers; set `NITRO_PRESET` to force a different target.

## Author

**Abhishek Rai A**  
[Portfolio](https://YOUR-DOMAIN) · [GitHub](https://github.com/Abhirai2006) · [LinkedIn](https://www.linkedin.com/in/abhishek-rai-a-00067238b)

## License

The source code is MIT-licensed. Personal content, résumé text, portrait, project screenshots, font, and anime media are © Abhishek Rai A and are not licensed for reuse.
