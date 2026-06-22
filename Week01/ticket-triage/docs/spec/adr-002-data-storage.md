# ADR-002 — Data Storage

**Status:** Accepted  
**Date:** 2026-06-22

## Decision

Prisma ORM + SQLite for v1.

## Rationale

- SQLite requires no separate database server — single file, zero ops.
- Prisma gives type-safe queries and a clean migration workflow.
- Zod validates all API inputs before they reach the database.
- Migration path to PostgreSQL in v2 is a one-line datasource change.
