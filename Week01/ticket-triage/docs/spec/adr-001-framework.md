# ADR-001 — Framework Selection

**Status:** Accepted  
**Date:** 2026-06-22

## Decision

Next.js 15 App Router with TypeScript strict mode.

## Rationale

- App Router enables Server Components for data fetching and API routes in one project.
- TypeScript strict + Zod catches invalid priority values at compile and runtime.
- Tailwind CSS for rapid, consistent styling without a separate design system.
- Single repo: frontend + API routes + DB — no separate backend service needed.
