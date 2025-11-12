Reflection on Building with AI Assistants (≤ 1 page)
This project showcased how AI assistants accelerate full‑stack delivery when paired with explicit architecture and verification. Starting from a clean slate, the assistants produced consistent scaffolding for a hexagonal backend (core domain, ports, services; Prisma repositories; Express controllers) and a modular frontend (Axios APIs, hooks, and presentational components). The largest time savings came from:

Boilerplate generation (folder structure, interfaces, controller wiring)

Repetitive patterns (Axios clients, React hooks, Tailwind utility strings)

ORM schema drafting and migration guidance

However, assistants occasionally produced path inconsistencies and type mismatches, especially around Axios response shapes (data vs data.data) and Prisma Decimal conversions. These were mitigated by enforcing a uniform ApiResponse contract, adding mappers to coerce Decimal to number, and running quick curl/console tests. Windows‑specific issues (npx “could not determine executable to run” during Tailwind init) required pragmatic workarounds: cleaning cache, reinstalling dependencies, or creating Tailwind/PostCSS configs manually.

Efficiency gains were most visible in:

Cutting initial setup time by more than half

Achieving a coherent hexagonal separation early, which made subsequent changes safe

Quickly iterating UI tabs with hooks and shared components

If building again, improvements would include:

Adding lightweight automated tests for services and controllers to lock in behavior

CI for lint, typecheck, migrations, and a smoke test of key endpoints

A small schema evolution guide and a seed “variants” pack for richer demos

A typed API client layer that encodes the ApiResponse shape to reduce data.data slips

Overall, AI assistants functioned best as accelerators for scaffolding and repetition, while human oversight remained essential for domain rules (banking constraints, pooling invariants), error handling, and environment‑specific troubleshooting. The combination delivered a production‑like demo quickly, with a maintainable structure and clear extension paths.
