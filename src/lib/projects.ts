import type { Project } from "@/components/portfolio/ProjectModal";
import muse1 from "@/assets/projects/muse-1.png.asset.json";
import muse2 from "@/assets/projects/muse-2.png.asset.json";
import muse3 from "@/assets/projects/muse-3.png.asset.json";
import sort1 from "@/assets/projects/sort-1.png.asset.json";
import sort2 from "@/assets/projects/sort-2.png.asset.json";
import sort3 from "@/assets/projects/sort-3.png.asset.json";
import bs1 from "@/assets/projects/bs-1.png.asset.json";
import bs2 from "@/assets/projects/bs-2.png.asset.json";
import bs3 from "@/assets/projects/bs-3.png.asset.json";

export type Metric = { value: string; label: string };

export type CaseStudy = {
  summary: string;
  problem: string;
  constraints: string[];
  built: string[];
  tradeoffs: { choice: string; why: string }[];
  outcome: string[];
  stack: string[];
};

export type ProjectEntry = Project & {
  slug: string;
  year: string;
  metrics: Metric[];
  caseStudy: CaseStudy;
};

export const PROJECTS: ProjectEntry[] = [
  {
    slug: "customer-churn-intelligence-system",
    title: "Customer Churn Intelligence System",
    tag: "Capstone · Bluemind Solutions AI/ML Internship",
    year: "2026",
    body: "End-to-end tabular ML system on IBM Telco Customer Churn: leak-free preprocessing, model comparison, stratified 5-fold CV, business-driven threshold selection, error analysis, and a Streamlit dashboard for single and batch scoring.",
    tags: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "Streamlit", "Pandas"],
    metrics: [
      { value: "0.849", label: "CV ROC-AUC" },
      { value: "82%", label: "churner recall" },
      { value: "~$179k", label: "est. annual recovery" },
    ],
    caseStudy: {
      summary:
        "A production-ready customer churn intelligence system completed as the capstone for Bluemind Solutions' Core AI & ML Internship.",
      problem:
        "Customer churn predictions are only useful when the evaluation is leak-free, the threshold reflects business cost, and the result can be used by someone beyond a notebook.",
      constraints: [
        "Build a leak-free pipeline on the IBM Telco Customer Churn dataset.",
        "Compare multiple classical and gradient-boosted models with stratified 5-fold cross-validation.",
        "Turn model output into an actionable workflow through a live dashboard for single and batch scoring.",
      ],
      built: [
        "A preprocessing pipeline using Scikit-learn Pipelines and ColumnTransformer to keep transformations inside validation.",
        "Model comparison across Logistic Regression, Random Forest, XGBoost and LightGBM.",
        "Business-driven threshold tuning, error analysis and SHAP-style analysis for more useful decisions than a default 0.5 cutoff.",
        "A Streamlit dashboard for single-customer and batch churn scoring.",
      ],
      tradeoffs: [
        {
          choice: "LightGBM as the final model",
          why: "It delivered the strongest reported result in the comparison: 0.849 cross-validation ROC-AUC with 82% recall on churners.",
        },
        {
          choice: "Threshold tuning instead of optimising accuracy alone",
          why: "The system is meant to support retention decisions, so missing a likely churner matters more than maximising a generic accuracy score.",
        },
        {
          choice: "Streamlit dashboard alongside the model pipeline",
          why: "A usable scoring surface makes the capstone demonstrable as a shipped system, not only as an experiment.",
        },
      ],
      outcome: [
        "LightGBM reached 0.849 CV ROC-AUC and 82% recall on churners.",
        "Estimated ~$179k in annual recoverable revenue from the business-oriented scoring setup.",
        "Completed as the capstone of a 4-week (~120 hour) Core AI & ML internship at Bluemind Solutions Pvt. Ltd.",
      ],
      stack: ["Python", "NumPy", "Pandas", "Scikit-learn", "XGBoost", "LightGBM", "Streamlit"],
    },
  },
  {
    slug: "muse-students-voice",
    title: "MUSE Students Voice",
    tag: "Full-stack · SSR · Auth",
    year: "2026",
    body: "USN-verified anonymous grievance platform. Peer-voted complaints auto-escalate into formal PDF letters. Supabase RLS + security-definer RPCs so identities stay server-side.",
    tags: ["TanStack Start", "Supabase RLS", "Cloudflare"],
    images: [muse1.url, muse2.url, muse3.url],
    live: "https://muse-studentsvoice.lovable.app/",
    repo: "https://github.com/Abhirai2006",
    metrics: [
      { value: "1,159", label: "verified student IDs" },
      { value: "0", label: "identities exposed to client" },
      { value: "SSR", label: "edge-rendered" },
    ],
    caseStudy: {
      summary:
        "An anonymous-but-accountable grievance channel for a university, where a complaint only becomes official once enough peers back it.",
      problem:
        "Students at MUSE had no safe way to raise campus issues. Named complaints invited retaliation; fully anonymous forms invited spam and were ignored by the administration because nobody could vouch that the sender was even a student.",
      constraints: [
        "A complaint must be provably from an enrolled student, without ever showing who wrote it.",
        "No moderator and no budget, so the escalation rule has to be mechanical, not human.",
        "Runs on a free edge tier: no long-lived server, no background workers.",
      ],
      built: [
        "USN (roll number) verification against a seeded roster of 1,159 enrolled IDs before an account can post.",
        "Postgres row-level security plus security-definer RPCs: the author column is never selectable by the client. Only the RPC can join it, and it never returns it.",
        "Peer voting with a threshold; crossing it flips the complaint to 'escalated' and renders a formal PDF letter addressed to the department.",
        "Server-side rendering on Cloudflare Workers so complaint pages load instantly on campus Wi-Fi.",
      ],
      tradeoffs: [
        {
          choice: "RLS + security-definer RPCs instead of a custom API layer",
          why: "One place to reason about who can read what. A leaky endpoint can't bypass the database itself, so the guarantee lives below the app.",
        },
        {
          choice: "Threshold voting instead of moderators",
          why: "No volunteer moderator would survive exam season. A rule that runs itself keeps the system alive when nobody is watching.",
        },
        {
          choice: "Roster seeding over email OTP",
          why: "Institutional email delivery was unreliable; the roster was already authoritative and offline-verifiable.",
        },
      ],
      outcome: [
        "Anonymous posting with zero client-side access to author identity.",
        "Complaints escalate into a printable, formally worded PDF with no manual step.",
        "Taught me that access control is a data-model problem, not a UI problem.",
      ],
      stack: [
        "TanStack Start",
        "React 19",
        "Supabase (Postgres, RLS)",
        "Cloudflare Workers",
        "TypeScript",
      ],
    },
  },
  {
    slug: "arthra",
    title: "Arthra",
    tag: "Personal finance for India",
    year: "2026",
    body: "A personal finance workspace built around how money actually works in India: INR with integer-paise storage, April to March financial years, GST references, shared Expense Spaces and read-only report links for a CA.",
    tags: ["TypeScript", "MySQL", "Vitest"],
    images: [
      "/media/projects/arthra-1.jpg",
      "/media/projects/arthra-2.jpg",
      "/media/projects/arthra-3.jpg",
      "/media/projects/arthra-4.jpg",
    ],
    live: "https://arthrafin-7qakibfj.manus.space",
    repo: "https://github.com/Abhirai2006/arthra",
    metrics: [
      { value: "60", label: "automated tests passing" },
      { value: "3", label: "Expense Space roles" },
      { value: "Apr to Mar", label: "financial-year reports" },
    ],
    caseStudy: {
      summary:
        "Arthra is a private expense tracker for Indian users, built around financial years, rupees and sharing money with other people.",
      problem:
        "I wanted a money tracker that follows the Indian financial year and rupees from day one, and keeps to plain record-keeping: what came in, what went out, and who I can safely show it to.",
      constraints: [
        "Money has to be exact, so no floating point rupees.",
        "Shared spending (a trip, a household) needs real access control, not just a hidden button.",
        "Sharing a report with a CA should not mean sharing the whole account.",
      ],
      built: [
        "Income and expense tracking with categories, accounts, notes, search and filters.",
        "Review-first import of CSV and Excel statements, with column mapping and duplicate checks before anything is saved.",
        "Monthly category budgets with spending trends and unusual-spend hints.",
        "Expense Spaces with Owner, Editor and Viewer roles, enforced on the server.",
        "April to March financial-year reports, CSV export and time-limited read-only links that can be revoked.",
        "A read-only demo with fictional data so anyone can look around without signing up.",
      ],
      tradeoffs: [
        {
          choice: "Integer paise instead of decimal rupees",
          why: "Adding floats drifts. Storing whole paise keeps totals exact.",
        },
        {
          choice: "Calculations stay deterministic, AI is optional",
          why: "Totals and budgets come from plain code. AI summaries only run when you ask for them and never edit transactions.",
        },
      ],
      outcome: [
        "60 automated tests across 26 files covering financial-year boundaries, authorization, budgets, imports and share-link revocation.",
        "A public demo that works without an account.",
      ],
      stack: ["TypeScript", "MySQL", "Vitest"],
    },
  },
  {
    slug: "ittige",
    title: "Ittige",
    tag: "Management & Entrepreneurship · Team project",
    year: "2026",
    body: "A scroll-driven site for our social enterprise plan in Mysuru: low-value plastic packaging melted with sand into pavers and blocks. The whole block-making animation is drawn in code, and the cost numbers are shown honestly, including where it loses to clay.",
    tags: ["JavaScript", "Three.js", "WebGL"],
    images: [
      "/media/projects/ittige-1.jpg",
      "/media/projects/ittige-2.jpg",
      "/media/projects/ittige-3.jpg",
      "/media/projects/ittige-4.jpg",
    ],
    live: "https://ittige.vercel.app/",
    repo: "https://github.com/Abhirai2006/ittige",
    metrics: [
      { value: "7", label: "scroll stages in the animation" },
      { value: "Rs 10 to 24", label: "cost per brick, three cases" },
      { value: "~550 t", label: "solid waste a day in Mysuru" },
    ],
    caseStudy: {
      summary:
        "Ittige is Kannada for brick. It's the website for our 21AI51 business plan, made to explain the idea in a minute of scrolling.",
      problem:
        "A plan that turns plastic waste into building blocks sounds good on paper, but a report is hard to skim. We wanted people to see how a block gets made and to trust the numbers behind it.",
      constraints: [
        "Every figure on the page has to match the report or be labelled as an assumption.",
        "It had to run on phones and on a classroom projector.",
        "No video files, so the page stays light.",
      ],
      built: [
        "A seven-stage 3D animation (drop, shred, sand, furnace, press, cool, block) driven by scroll position, so it plays forwards and backwards.",
        "The real plastic mix named on screen, with the types we screen out.",
        "A cost section with low, base and high cases against a clay brick, including what would have to change for Ittige to win.",
        "Team links that only show when you hover or click a name.",
      ],
      tradeoffs: [
        {
          choice: "Show where we lose to clay",
          why: "The plan is easier to believe when it admits where it loses.",
        },
        {
          choice: "Equations instead of a physics simulation",
          why: "Every scroll position can be computed directly, so the animation is smooth and looks the same on every visit.",
        },
      ],
      outcome: [
        "A live site that tells the plan in four parts: the waste problem, how a block is made, the cost numbers and the team.",
        "A static export, so hosting is just plain files.",
      ],
      stack: ["JavaScript", "Three.js", "WebGL", "Vercel"],
    },
  },
  {
    slug: "o-patience",
    title: "O(patience)",
    tag: "Algorithms · React · TypeScript",
    year: "2025",
    body: "A deep sorting playground with 5 algorithms, pointer flags, pitch-based sound mode, step-by-step export, Race Mode with live leaderboard, Quiz Mode and an embeddable widget.",
    tags: ["TypeScript", "React", "Motion"],
    images: [sort1.url, sort2.url, sort3.url, "/media/projects/o-patience-og.jpg"],
    live: "https://sort-visually-abhirai2006.lovable.app/",
    repo: "https://github.com/Abhirai2006",
    metrics: [
      { value: "5", label: "algorithms, step-for-step" },
      { value: "~60fps", label: "on 200-element arrays" },
      { value: "1", label: "embeddable /embed widget" },
    ],
    caseStudy: {
      summary:
        "A sorting visualiser built for people who already know the pseudocode and still can't feel why quicksort degrades.",
      problem:
        "Every sorting visualiser online animates bars and stops there. You watch it, you nod, you learn nothing about comparison counts, pointer movement or why one algorithm collapses on nearly-sorted input.",
      constraints: [
        "Animation must stay smooth while the array grows, with no dropped frames at 200 elements.",
        "The visualisation has to be inspectable: pause, step, and read the exact state.",
        "It should be usable inside someone else's lecture slide or blog.",
      ],
      built: [
        "A generator-based engine: each algorithm yields discrete steps, so playback, stepping and export all read from one source of truth.",
        "Pointer flags (i, j, pivot, low/high) rendered on the bars, plus live comparison and swap counters.",
        "Sound mode mapping array values to pitch, so a nearly sorted array sounds like a rising scale.",
        "Race Mode running algorithms side by side with a live leaderboard, and Quiz Mode that pauses and asks what happens next.",
        "An /embed route that renders just the canvas for iframing.",
      ],
      tradeoffs: [
        {
          choice: "Generators over recursive animation callbacks",
          why: "Decouples the algorithm from the renderer. Speed control, stepping backwards and exporting steps became free instead of three separate implementations.",
        },
        {
          choice: "Transform-only animation",
          why: "Layout-affecting properties tanked the frame rate past ~80 bars; transforms stay on the compositor.",
        },
        {
          choice: "No virtualization",
          why: "Capping the array size kept the code readable. Beyond a few hundred bars the visual stops teaching anything anyway.",
        },
      ],
      outcome: [
        "Five algorithms, all steppable and comparable in the same run.",
        "Holds ~60fps at 200 elements on a mid-range laptop.",
        "Made complexity intuitive for me in a way the textbook chapter never did.",
      ],
      stack: ["React", "TypeScript", "Web Audio API", "Framer Motion"],
    },
  },
  {
    slug: "binary-search-visualizer",
    title: "Binary Search Visualizer",
    tag: "Vanilla JS · Glassmorphism",
    year: "2025",
    body: "High-performance visualizer with real-time low/mid/high tracking and audio feedback per step. Demonstrates O(log n) narrowing visually.",
    tags: ["JavaScript", "Netlify"],
    images: [bs1.url, bs2.url, bs3.url],
    live: "https://binarysearch-abhirai.netlify.app/",
    repo: "https://github.com/Abhirai2006",
    metrics: [
      { value: "0", label: "dependencies / frameworks" },
      { value: "log₂n", label: "steps shown live" },
      { value: "<50KB", label: "shipped to the browser" },
    ],
    caseStudy: {
      summary: "The smallest thing I could build that makes O(log n) obvious in one look.",
      problem:
        "Binary search is the first algorithm where beginners memorise the code without believing the halving. The gap is that nobody ever sees the search window shrink.",
      constraints: [
        "No build step and no framework. It had to be one HTML file a classmate could open offline.",
        "Every step must be legible: which index is low, which is mid, which is high.",
      ],
      built: [
        "Real-time low / mid / high markers that slide as the window collapses, with discarded halves visibly dimming.",
        "A step counter next to the theoretical log₂n bound, so the two numbers meet.",
        "Per-step audio feedback so the halving is audible as well as visible.",
        "A glass-style UI built with plain CSS and backdrop filters, no component library.",
      ],
      tradeoffs: [
        {
          choice: "Vanilla JS instead of React",
          why: "The whole app is one list and three markers. A framework would have been more code than the algorithm.",
        },
        {
          choice: "CSS transitions instead of an animation library",
          why: "Keeps the payload tiny and the file self-contained.",
        },
      ],
      outcome: ["Loads instantly, works offline, under 50KB total."],
      stack: ["JavaScript (ES modules)", "CSS", "Netlify"],
    },
  },
  {
    slug: "git-github-viva-prep",
    title: "Git & GitHub Viva Prep",
    tag: "Lab viva · Study tool",
    year: "2026",
    body: "A study site for our Project Management with Git lab viva: flashcards, a quiz, a debugging drill and a searchable command cheat sheet covering all 12 experiments. No backend, and progress is saved only in your own browser.",
    tags: ["TypeScript", "Three.js", "Netlify"],
    live: "https://git-github-by-abhirai2006.netlify.app/",
    repo: "https://github.com/Abhirai2006/git-and-GitHub",
    metrics: [
      { value: "49", label: "flashcards" },
      { value: "20", label: "quiz questions" },
      { value: "6", label: "real Git errors to debug" },
    ],
    caseStudy: {
      summary: "I built this site to prepare for the Git and GitHub lab viva.",
      problem:
        "Viva prep for a lab course is scattered across a manual, notes and half-remembered commands. I wanted one place to practise the questions and the commands together.",
      constraints: [
        "It had to cover all five lab sessions and all twelve experiments.",
        "No sign-up and no tracking, because it's just for revision.",
      ],
      built: [
        "49 flashcards with a flip animation, session filters and a star-to-review option.",
        "A 20-question quiz by session or all together, with an explanation after each answer.",
        "A debug drill with 6 real Git error messages, where you pick the actual fix.",
        "A cheat sheet of every command from the 12 experiments, searchable, with one-click copy.",
      ],
      tradeoffs: [
        {
          choice: "Everything in the browser, nothing on a server",
          why: "Starred cards and quiz scores sit in local storage. It's simpler, free to host and private by default.",
        },
      ],
      outcome: ["A static site that deploys on Netlify with no backend to look after."],
      stack: ["TypeScript", "Three.js", "Netlify"],
    },
  },
  {
    slug: "cpp-console-suite",
    title: "C++ Console Mini-Suite",
    tag: "OOP · Terminal",
    year: "2025",
    body: "Tic-Tac-Toe (board logic, win/tie), Mini Banking System (validated deposit/withdraw), Rock-Paper-Scissors. Built to practise OOP, arrays and modular design.",
    tags: ["C++", "OOP"],
    images: [],
    repo: "https://github.com/Abhirai2006",
    metrics: [
      { value: "3", label: "programs, one shared core" },
      { value: "100%", label: "input paths validated" },
      { value: "C++17", label: "standard, no libraries" },
    ],
    snippet: {
      title: "banking.cpp (sample session)",
      lines: [
        "$ ./banking",
        "-- Mini Banking System --------------",
        "1) Deposit   2) Withdraw   3) Balance   4) Exit",
        "> 1",
        "Amount: 2500",
        "✔ Deposited ₹2500.  New balance: ₹7,300",
        "> 2",
        "Amount: 9000",
        "✘ Insufficient funds. Balance: ₹7,300",
        "> 3",
        "Balance: ₹7,300",
        "> 4",
        "Session closed. Goodbye 👋",
      ],
    },
    caseStudy: {
      summary:
        "Three console programs written to make OOP stop being vocabulary and start being a tool.",
      problem:
        "Classroom C++ is syntax drills. I wanted programs where a bad design decision actually hurts, where state, validation and control flow have to be arranged properly or the thing breaks.",
      constraints: [
        "Standard library only, no external dependencies, and it has to compile with a plain g++ command.",
        "Every user input is hostile until validated.",
      ],
      built: [
        "Tic-Tac-Toe: board represented as a flat array, win/tie detection via line masks rather than nested conditionals.",
        "Mini Banking System: an Account class that owns its own rules. The balance can never go negative, and that check lives inside the class, not in the menu loop.",
        "Rock-Paper-Scissors with seeded RNG and a running score.",
        "A shared input helper that re-prompts on non-numeric or out-of-range entry instead of silently accepting garbage.",
      ],
      tradeoffs: [
        {
          choice: "Invariants inside the class, not the menu",
          why: "The first version validated in the UI loop. Adding a second entry point instantly duplicated the rule, which is exactly why encapsulation exists.",
        },
        {
          choice: "Line masks over nested if-chains for win detection",
          why: "Eight conditions became one loop, and the bug I had in the diagonal case disappeared with it.",
        },
      ],
      outcome: [
        "Every invalid input path is handled, so the programs can't be crashed from the keyboard.",
      ],
      stack: ["C++17", "STL", "g++"],
    },
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
