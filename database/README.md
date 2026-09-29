# SmartShop AI - Database Layer

This directory maintains the relational data layer and migrations for SmartShop AI.

## Structure

- `prisma/schema.prisma`: Prisma declarative schema for PostgreSQL.
- `prisma/seed.ts`: Seed script for demo products and baseline accounts.
- `sql/`: Raw SQL migration and DDL scripts (`products.sql`, `users.sql`, `carts.sql`, `orders.sql`).

## Migrations Workflow

```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# Seed database
npx tsx prisma/seed.ts
```
