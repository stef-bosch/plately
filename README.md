# Plately

Een moderne, rustige voedingsapp voor je persoonlijke maaltijdplan. Volledig in
het Nederlands, gebouwd met **React Native + Expo + TypeScript**.

> Werktitel was "Bordplan"; de app heet **Plately** — kort, internationaal en
> verwijst speels naar "plate" (bord) en je persoonlijke plan.

## Functies

- **Dashboard** — datum van vandaag, het dagmenu (ontbijt, lunch, tussendoortjes,
  diner) en de totale calorieën + macro's (eiwitten, koolhydraten, vetten, vezels).
- **Weekmenu** — twee volledige seizoensweken (lente/zomer en herfst/winter),
  maandag t/m zondag, met een dagkiezer.
- **Recepten** — overzicht met zoeken op naam en filters op maaltijd en seizoen.
- **Receptdetail** — ingrediënten gegroepeerd per categorie, stap-voor-stap
  bereiding, macro's én micronutriënten per portie, en tags.
- **Porties schalen** — plus/minus-knoppen schalen alle schaalbare ingrediënten
  automatisch mee (½ aubergine → 1 aubergine), met nette breuken.
- **Instellingen** — doel, standaard aantal personen, voorkeursseizoen,
  dieetvoorkeuren en het tonen/verbergen van micronutriënten.

## Lokaal draaien

Vereisten: **Node.js 18+** en de **Expo Go**-app op je telefoon (of een iOS/Android
simulator).

```bash
# 1. Dependencies installeren
npm install

# 2. De ontwikkelserver starten
npm start
```

Scan daarna de QR-code met Expo Go (Android) of de Camera-app (iOS). Of druk in de
terminal op:

- `a` — open in een Android-emulator
- `i` — open in een iOS-simulator
- `w` — open in de browser (web)

Type-check draaien:

```bash
npm run tsc
```

## Projectstructuur

```
Plately/
├── App.tsx                      # Providers + navigator
├── index.ts                     # Expo entry point
├── src/
│   ├── components/              # Herbruikbare UI (RecipeCard, MealCard, Stepper, ...)
│   ├── constants/labels.ts      # Alle Nederlandse labels + datum-/seizoenshelpers
│   ├── context/SettingsContext  # App-instellingen (in-memory, makkelijk te persisteren)
│   ├── data/
│   │   ├── recipes.ts           # Receptenbibliotheek (mock data)
│   │   └── weeklyPlans.ts       # Twee seizoensweekmenu's
│   ├── navigation/              # Bottom tabs + stack
│   ├── screens/                 # Dashboard, Weekmenu, Recepten, Receptdetail, Instellingen
│   ├── theme/                   # Kleuren, spacing, typografie, schaduwen
│   ├── types/                   # TypeScript datamodellen
│   └── utils/
│       ├── scaling.ts           # Ingrediënten schalen + breuken formatteren
│       └── nutrition.ts         # Dagtotalen + micronutriënt-metadata
```

## Uitbreiden

- **Recept toevoegen** — voeg een object toe aan `src/data/recipes.ts` en verwijs
  naar het `id` vanuit een weekmenu in `src/data/weeklyPlans.ts`. Verder hoeft er
  niets te veranderen; alle schermen zoeken recepten op via hun `id`.
- **Weekmenu aanpassen** — wissel een recept-`id` in `src/data/weeklyPlans.ts`.
- **Exacte voedingswaarden** — `Nutrition` heeft een `isIndicative`-vlag en het
  `Ingredient`-model is voorbereid op voedingswaarden per ingrediënt, zodat je
  later van recept-niveau naar exacte berekeningen kunt overstappen zonder de UI
  aan te passen.
- **Instellingen bewaren** — vervang de `useState` in
  `src/context/SettingsContext.tsx` door AsyncStorage-state; de consumenten-API
  blijft gelijk.

## Ontwerp

Kalm, fris en licht premium: warme off-white achtergrond, diepe kruidengroene
accenten, zachte terracotta, ronde kaarten, subtiele schaduwen en veel witruimte.
Bewust géén felle fitnesskleuren of drukke dashboards.

> Alle voedingswaarden zijn **indicatief** en bedoeld voor een eerste MVP.
