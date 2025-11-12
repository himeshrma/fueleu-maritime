FuelEU Maritime – Full‑Stack App (Node.js + PostgreSQL + Prisma + React + Tailwind)
Overview
A full‑stack reference app that demonstrates FuelEU Maritime workflows:

Define and compare voyage routes against a baseline and a target intensity

Compute and visualize compliance differences

Bank positive compliance balances and apply them in later years

Create pools to reallocate balances among ships while preserving constraints

Architecture (Hexagonal)
Core (domain, ports, application):

Domain: Route, ComplianceBalance, BankEntry, Pool

Ports: Repository/API interfaces

Application: RouteService, ComplianceService, BankingService, PoolingService

Adapters:

Outbound: Prisma repositories for PostgreSQL

Inbound: Express controllers (REST)

Frontend: Axios API clients, React hooks, UI components/pages

Infrastructure:

Prisma client

Express app bootstrap

Frontend:

React + TypeScript + TailwindCSS, Recharts

High‑level flow:
Frontend → Axios API → Express Controllers → Services (rules) → Repositories (Prisma) → PostgreSQL

Backend Setup
Prerequisites:

Node.js ≥ 18

PostgreSQL ≥ 13

npm

Steps:

Environment

In backend/.env:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fueleu_db?schema=public"
PORT=3001
NODE_ENV=development

Install and generate

cd backend

npm install

npx prisma generate

Migrate + seed

npx prisma migrate dev --name init

npm run db:seed

Run

npm run dev
Server on http://localhost:3001
Health: http://localhost:3001/health

Key endpoints:

GET /routes

POST /routes/:routeId/baseline

GET /routes/comparison

GET /compliance/cb?shipId=SHIP001&year=2025

GET /compliance/adjusted-cb?shipId=SHIP001&year=2025

GET /banking/records?shipId=SHIP001&year=2024

POST /banking/bank { shipId, year, amount }

POST /banking/apply { shipId, year, amount }

POST /pools { year, memberShipIds: [ ... ] }

Frontend Setup
Prerequisites:

Node.js ≥ 18

npm

Steps:

Environment (frontend/.env)

REACT_APP_API_URL=http://localhost:3001

Install

cd frontend

npm install

If Tailwind init failed earlier, ensure tailwind.config.js and postcss.config.js exist per our conversation

Run

npm start
App on http://localhost:3000

Structure:

src/core: domain types + ports

src/adapters/infrastructure: Axios clients

src/adapters/ui/hooks: useRoutes/useBanking/usePooling

src/adapters/ui/components: Layout/Tabs/Card/Button

src/adapters/ui/pages: RoutesTab/CompareTab/BankingTab/PoolingTab

Tests (Manual)
Quick curl checks:

Health: curl http://localhost:3001/health

Routes: curl http://localhost:3001/routes

CB: curl "http://localhost:3001/compliance/cb?shipId=SHIP001&year=2025"

UI checks:

Routes tab: list, filters, set baseline

Compare tab: table + bar chart (baseline vs comparison vs target)

Banking tab: bank/apply flows, records update

Pooling tab: adjusted balances and valid pool creation

Sample Requests / Responses
Set baseline:

POST /routes/R002/baseline

Response:
{
"success": true,
"data": { "routeId": "R002", "isBaseline": true, ... },
"message": "Route R002 set as baseline"
}

Get CB:

GET /compliance/cb?shipId=SHIP001&year=2025

Response:
{
"success": true,
"data": {
"shipId": "SHIP001",
"year": 2025,
"cbGco2eq": 150000,
"targetIntensity": 89.3368,
"actualIntensity": 88.0,
"energyInScope": 196800000
}
}

Create pool:

POST /pools

Body:
{ "year": 2025, "memberShipIds": ["SHIP001", "SHIP002"] }

Response:
{
"success": true,
"data": {
"year": 2025,
"totalCbBefore": 170000,
"totalCbAfter": 170000,
"members": [
{ "shipId": "SHIP001", "cbBefore": 250000, "cbAfter": 170000 },
{ "shipId": "SHIP002", "cbBefore": -80000, "cbAfter": 0 }
]
},
"message": "Pool created successfully"
}

Screenshots (Suggested)
Routes tab with baseline badge

Compare tab chart

Banking tab showing positive CB and records

Pooling tab before/after pool creation

Troubleshooting
Tailwind init fails (Windows): clear npm cache, reinstall, or create config files manually

CORS/network errors: ensure backend running on PORT 3001 and cors middleware enabled

Prisma decimals in JSON: use mappers to parse Decimal to number

Port conflicts: free :3000 or :3001 (lsof/netstat) and retry
