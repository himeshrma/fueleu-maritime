AI Agent Workflow Log
Project context
Goal: Stand up a small but credible FuelEU Maritime demo (backend with Node.js/TypeScript/PostgreSQL/Prisma, frontend with React/TypeScript/Tailwind/Recharts), using AI agents to accelerate scaffolding and iteration while keeping business logic clean and verifiable.

Agents used
Code assistant for end-to-end scaffolding and domain design: used to draft hexagonal architecture (core domain, ports, services), controllers, Prisma repositories, and seed scripts. Helped with consistent naming and folder structure.

ORM-savvy helper for Prisma: leaned on it to design schema models, relations, indexes, and to reason about Decimal handling and migrations. Cross-checked its Decimal-to-JSON advice with community notes to avoid precision pitfalls.​

Frontend UI helper for React + Tailwind + Recharts: produced initial components (Layout/Tabs/Card/Button), hooks, and chart configs; sped up Tailwind utility selection and responsive layout.

Troubleshooting assistant for Windows/npm/Tailwind CLI: guided the “could not determine executable to run” fix paths and Tailwind v3 vs v4 CLI differences, validated by community threads and posts.​

Prompts & outputs
Backend hexagonal skeleton

Prompt: “Create Node.js + TypeScript backend using hexagonal architecture (core → ports → services), Express controllers, Prisma repositories, Prisma client + seed, and transactions for setting a single baseline route.”

Output wins: Generated consistent folders, interfaces, and services; reminded to wrap baseline change in a transaction; produced an initial seed and route comparison structure.

What changed: Rewrote mappers to convert Prisma Decimal to numbers before JSON responses to keep the frontend simple, following community guidance about Decimal serialization.​

Banking logic (FIFO apply)

Prompt: “Implement banking: bank positive CB only; apply banked FIFO with partial consumption; return before/after state.”

Output wins: Good draft with ordered selection and partial updates inside a transaction.

What changed: Added guards for negative/zero CB banking and insufficient available balance; verified logic with multiple entry scenarios.

Frontend hooks and tabs

Prompt: “Build React hooks for routes/comparison/banking/pooling; Axios API with a base client; reusable Layout/Tabs/Card/Button; a Compare tab with baseline/comparison/target bars.”

Output wins: Hooks were immediately usable; chart rendered on first try.

What changed: Fixed some relative imports and ensured uniform ApiResponse shape so calls consistently use response.data.data.

Windows + Tailwind hiccup

Prompt: “Resolve ‘npm error could not determine executable to run’ for Tailwind init on Windows 11.”

Outcome: Adopted two-track solution: either use Tailwind v3 CLI (then npx tailwindcss init -p works) or manually create tailwind.config.js and postcss.config.js if staying on v4+; this matched community fixes and clarified the CLI change across versions.​

How outputs were validated and corrected
API contract-first: Hit endpoints with curl/Browser first (GET /health, /routes, /routes/comparison, /compliance/cb) before wiring UI to guarantee backend stability.

Decimal-to-number mapping: Verified that route and compliance fields arrived as plain numbers in JSON; avoided leaking Decimal.js instances into responses per community advice.​

Transactions under concurrency: Toggled baseline multiple times quickly; confirmed only one route persisted as baseline.

Banking FIFO: Seeded two bank entries, applied more than the first entry’s amount, confirmed status flips and partial remainder updated the second entry correctly.

Frontend sanity: Confirmed Compare tab bars mapped to keys name/baseline/comparison/target and showed correct green/red states; checked React console and Network tab for 200s.

Tailwind on Windows: When npx failed, confirmed working alternatives (v3 CLI or manual config) from Q&A threads and posts.​

Real-life moments (what actually saved time)
Day 1 scaffolding: The agent produced the directory tree, Prisma schema, seed script, Express app wiring, and React shell in under an hour — a task that typically eats half a day.

“Small paper cuts” eliminated: Axios client + interceptors + .env baseURL; Tabs/Layout/Card/Button; Recharts boilerplate — all generated reliably, freeing attention for domain rules.

Documentation-by-example: The agent’s consistent naming and layered structure made it easy to write README tasks and reproducible run steps.

Real-life misses (where it stumbled)
Import paths and response shapes: Occasional mismatch like response.data vs response.data.data and wrong relative paths; fixed quickly but frequent enough to note.

Tailwind CLI on Windows: The agent suggested standard npx commands that break with newer Tailwind packaging; community sources clarified version-specific behavior.​

Decimal semantics: Initial code sometimes passed Decimal instances; needed explicit mapping or toJSON overrides to keep the frontend simple.​

Best practices that stuck
Ports and services first, adapters second: made tests and later changes far safer.

Keep controllers thin; put rules in services (banking constraints, pooling invariants).

Standard ApiResponse shape and centralized Axios client.

Seed data that exercises both happy and edge paths (surplus + deficit ships).

Version-aware setup notes (Tailwind v3 vs v4 CLI differences on Windows).​

What we’d do again
Start with a contract (endpoints and JSON shapes), then code to it.

Use the agent to blast through boilerplate, but always validate with curl/console.

Keep “mapper” functions near repositories to normalize ORM types (especially Decimal).

References checked during build
Prisma Decimal handling and JSON serialization examples​

Tailwind “could not determine executable to run” fixes, Windows + CLI version specifics​

General agent workflow examples for inspiration (not authoritative)​
