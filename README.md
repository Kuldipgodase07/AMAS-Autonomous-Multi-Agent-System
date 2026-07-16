# AMAS — Autonomous Multi-Agent System

Mission-control console for the Autonomous Multi-Agent System. Supervise orchestrator, sub-agents, approvals and reasoning traces in real time.

## Project Structure

```
AMAS-Autonomous-Multi-Agent-System/
├── frontend/          # React + Vite frontend (deployed on Vercel)
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/  # UI components (Radix UI + shadcn)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and helpers
│   │   ├── routes/      # TanStack Router route files
│   │   ├── main.tsx     # App entry point
│   │   ├── router.tsx   # Router configuration
│   │   └── styles.css   # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── vercel.json
└── README.md
```

## Frontend

Built with:
- **React 19** + **TypeScript**
- **Vite** (build tool)
- **TanStack Router** (file-based routing)
- **TanStack Query** (server state)
- **Radix UI** + **shadcn/ui** (components)
- **Tailwind CSS v4**
- **Zustand** (client state)
- **Recharts** (data visualization)

## Deploy on Vercel

1. Import the GitHub repo on [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Vercel auto-detects Vite — click **Deploy**

## Local Development

```bash
cd frontend
npm install
npm run dev
```
