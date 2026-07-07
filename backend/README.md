# Nutrition backend — recipe/day-menu personalisation

A TypeScript/Node backend that personalises **base recipes** (a `RecipeBlueprint`
for 1 person at normal portions) to a user's energy needs. It **does not scale
recipes linearly** — it scales *components* by their role in the dish, keeping
taste, texture, portion realism, health and recognisability intact.

The optimizer is pluggable: a robust **greedy** optimizer ships first, behind a
`RecipeScaler` interface, so a linear-programming / mixed-integer optimizer can
be added later without changing callers.

## Architecture

```
src/
  domain/                 pure, dependency-free calc engine (fully unit-tested)
    types.ts              domain model (FoodItem, RecipeBlueprint, roles, …)
    config.ts             every tunable number (factors, weights, portion rules)
    nutrition.ts          ingredient + recipe nutrition
    targets.ts            BMR (Mifflin–St Jeor) · TDEE · kcal target · macro targets
    mealSplit.ts          split day targets across meals
    scaling/
      RecipeScaler.ts     the interface + result/candidate/context types
      candidates.ts       candidate generation (§7)
      scoring.ts          the scoring function + penalties/bonuses (§9–12)
      GreedyRecipeScaler.ts   greedy optimizer (§6)
    dayCorrection.ts      day-level totals, correction pass + health checks (§13)
    mealPlan.ts           orchestrates a full day menu
  data/
    repository.ts         storage interface
    inMemoryRepository.ts seeded store (runs without a DB)
    seed.ts               food items + 2 recipes (light butter chicken, overnight oats)
  api/
    service.ts            use-cases + the §15 output mapping
    server.ts             Express routes
  index.ts                entrypoint (in-memory repo)
prisma/schema.prisma      PostgreSQL data model (§2)
```

### Design principle

The system scales **components within recipes**, not recipes as a whole:

- carb bases (rice, pasta, oats, potato) scale well;
- protein bases (chicken, fish, tofu, egg, quark, legumes) scale moderately–well;
- fat sources (oil, nuts, seeds, avocado) scale but are **capped**;
- vegetables stay at least at base, may rise a little;
- fruit may rise a little;
- **flavourings** (herbs, spices, lemon, vinegar, garlic, chili, salt) are
  **never** auto-scaled;
- sauces scale as a **group** (`scaling_group`), but the spices inside them do not.

## Run

```bash
cd backend
npm install
npm test          # vitest — the calc engine + scaler behaviour
npm run typecheck # tsc --noEmit
npm start         # Express API on http://localhost:3000 (in-memory seed data)
```

### Endpoints

- `POST /users/:id/calculate-target` → `{ bmr, tdee, target_kcal, source, macro_targets }`
- `POST /recipes/:id/scale` body `{ target_kcal, macro_target? }` → scaled recipe (see §15)
- `POST /meal-plans/generate` body `{ user_id, date?, target_kcal?, meals?, recipe_ids_by_meal?, excluded_ingredients? }`
- `GET  /recipes/:id`
- `GET  /food-items/:id`

Example:

```bash
curl -X POST localhost:3000/recipes/light_butter_chicken/scale \
  -H 'content-type: application/json' \
  -d '{"target_kcal":900,"macro_target":{"protein_g":55,"carbs_g":100,"fat_g":30}}'
```

## PostgreSQL / Prisma

`prisma/schema.prisma` defines all tables (§2). To wire the DB:

1. set `DATABASE_URL` in `.env`
2. `npm run prisma:generate && npm run prisma:migrate`
3. add a `PrismaRepository implements DataRepository` (mirror `InMemoryRepository`,
   mapping Prisma rows onto the domain types) and pass it to `createServer`.

The domain layer and API depend only on `DataRepository`, so swapping the
in-memory store for Postgres is a one-line change in `src/index.ts`.

## Extending the optimizer

```ts
export interface RecipeScaler {
  scaleRecipeToTarget(recipe, targetKcal, context): ScaledRecipeResult;
}
```

Implementations: `GreedyRecipeScaler` (now), and later
`LinearProgrammingRecipeScaler` / `MixedIntegerRecipeScaler` minimising

```
kcalDeviation + macroDeviation + portionUnrealism + deviationFromBaseRecipe
  + lowSchijfVanVijfPenalty + excessiveSaltPenalty + excessiveSaturatedFatPenalty
```

subject to `min_g ≤ amount ≤ max_g`, step alignment, `vegetable_g ≥ base`,
flavourings fixed, protein ≥ minimum, and salt/sat-fat caps when data exists.
