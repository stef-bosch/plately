import type { ReactiveRecipe } from '../types';

/**
 * Reactive breakfast recipes.
 *
 * Each recipe carries a full ingredient + nutrition set per energy level
 * (laag / gemiddeld / hoog). `resolveRecipe` (see ../utils/resolveRecipe.ts)
 * picks the right level for the user's `energyNeed`, so portions update live.
 *
 * Diets are NOT applied as substitutions. A recipe declares the diets it suits
 * (`suitableFor`) and the diets it can meet with one trivial swap (`dietSwaps`,
 * shown as a hint). The recipe browser filters on this; nutrition is unchanged.
 */

const SKYR_SWAPS_DAIRY = [
  {
    diet: 'vegan' as const,
    hint: 'Vervang de skyr door ongezoete plantaardige kwark (soja), bij voorkeur verrijkt met calcium en vitamine B12.',
  },
  {
    diet: 'lactosevrij' as const,
    hint: 'Gebruik lactosevrije skyr of magere kwark.',
  },
  {
    diet: 'glutenvrij' as const,
    hint: 'Gebruik gecertificeerde glutenvrije havermout.',
  },
];

export const breakfastRecipes: ReactiveRecipe[] = [
  {
    id: 'ontbijt-mango-overnight-oats',
    title: 'Mango overnight oats met skyr, limoen & amandel',
    subtitle: 'Romig, fris en tropisch met een lichte crunch',
    mealType: 'ontbijt',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 0,
    tags: ['Vegetarisch'],
    instructions: [
      'Meng de havermout, skyr, halfvolle melk, chiazaad, kaneel, limoensap en een klein snufje zout in een pot of kom.',
      'Roer de diepvriesmango erdoor.',
      'Zet minimaal 4 uur, maar liefst een nacht, in de koelkast.',
      'Roer voor het serveren goed door.',
      'Top met limoenrasp en gehakte amandelen.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Havermout', quantity: 35, unit: 'g', scalable: true },
              { name: 'Skyr', quantity: 125, unit: 'g', scalable: true },
              { name: 'Halfvolle melk', quantity: 75, unit: 'ml', scalable: true },
              { name: 'Diepvriesmango', quantity: 125, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 5, unit: 'g', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Amandelen, grof gehakt', quantity: 5, unit: 'g', scalable: true },
              { name: 'Limoenrasp', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 370, protein: 25, carbs: 54, fat: 7, fiber: 8,
          micronutrients: { calcium: 330, potassium: 710, magnesium: 120, iron: 2.5, phosphorus: 380, zinc: 2.0, vitaminC: 45, folate: 85, vitaminA: 65, vitaminB12: 0.6 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Havermout', quantity: 50, unit: 'g', scalable: true },
              { name: 'Skyr', quantity: 150, unit: 'g', scalable: true },
              { name: 'Halfvolle melk', quantity: 100, unit: 'ml', scalable: true },
              { name: 'Diepvriesmango', quantity: 125, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 10, unit: 'g', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Amandelen, grof gehakt', quantity: 10, unit: 'g', scalable: true },
              { name: 'Limoenrasp', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 520, protein: 33, carbs: 69, fat: 14, fiber: 12,
          micronutrients: { calcium: 430, potassium: 920, magnesium: 190, iron: 3.7, phosphorus: 520, zinc: 3.0, vitaminC: 47, folate: 105, vitaminA: 70, vitaminB12: 0.8 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Havermout', quantity: 65, unit: 'g', scalable: true },
              { name: 'Skyr', quantity: 200, unit: 'g', scalable: true },
              { name: 'Halfvolle melk', quantity: 125, unit: 'ml', scalable: true },
              { name: 'Diepvriesmango', quantity: 150, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 10, unit: 'g', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Amandelen, grof gehakt', quantity: 20, unit: 'g', scalable: true },
              { name: 'Limoenrasp', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 700, protein: 43, carbs: 90, fat: 22, fiber: 16,
          micronutrients: { calcium: 560, potassium: 1180, magnesium: 265, iron: 4.8, phosphorus: 690, zinc: 4.0, vitaminC: 55, folate: 130, vitaminA: 85, vitaminB12: 1.0 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch', 'halal'],
    dietSwaps: SKYR_SWAPS_DAIRY,
  },
  {
    id: 'ontbijt-volkoren-toast-avocado',
    title: 'Volkoren toast met avocado, cottage cheese & ei',
    subtitle: 'Hartig, romig en fris met veel verzadiging',
    mealType: 'ontbijt',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 15,
    cookTime: 0,
    tags: ['Vegetarisch', 'Notenvrij'],
    instructions: [
      'Kook het ei 6–8 minuten of bak het als spiegelei.',
      'Rooster het volkorenbrood.',
      'Prak de avocado met citroen- of limoensap, zwarte peper en een klein snufje zout.',
      'Besmeer het brood met de geprakte avocado.',
      'Verdeel de cottage cheese over de toast.',
      'Beleg met spinazie of rucola, cherrytomaten en ei.',
      "Maak af met za'atar of chilivlokken en pompoenpitten.",
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkorenbrood', quantity: 1, unit: 'sneetje', scalable: true },
              { name: 'Avocado', quantity: 50, unit: 'g', scalable: true },
              { name: 'Cottage cheese', quantity: 100, unit: 'g', scalable: true },
              { name: 'Ei', quantity: 1, unit: 'stuk', scalable: true },
              { name: 'Spinazie of rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Cherrytomaten, gehalveerd', quantity: 7, unit: 'stuk', scalable: true },
              { name: 'Citroen- of limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Pompoenpitten', quantity: 0.5, unit: 'tl', scalable: true },
              { name: "Za'atar of chilivlokken", quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 380, protein: 24, carbs: 28, fat: 20, fiber: 8,
          micronutrients: { calcium: 200, potassium: 850, magnesium: 105, iron: 3.3, phosphorus: 340, zinc: 2.5, vitaminC: 26, folate: 150, vitaminA: 290, vitaminB12: 1.3, selenium: 24 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkorenbrood', quantity: 2, unit: 'sneetje', scalable: true },
              { name: 'Avocado', quantity: 70, unit: 'g', note: 'ongeveer ½ kleine avocado', scalable: true },
              { name: 'Cottage cheese', quantity: 100, unit: 'g', scalable: true },
              { name: 'Ei', quantity: 1, unit: 'stuk', scalable: true },
              { name: 'Spinazie of rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Cherrytomaten, gehalveerd', quantity: 7, unit: 'stuk', scalable: true },
              { name: 'Citroen- of limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Pompoenpitten', quantity: 1, unit: 'tl', scalable: true },
              { name: "Za'atar of chilivlokken", quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 510, protein: 30, carbs: 44, fat: 25, fiber: 12,
          micronutrients: { calcium: 225, potassium: 1070, magnesium: 155, iron: 4.6, phosphorus: 420, zinc: 3.2, vitaminC: 28, folate: 195, vitaminA: 300, vitaminB12: 1.3, selenium: 28 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkorenbrood', quantity: 3, unit: 'sneetje', scalable: true },
              { name: 'Avocado', quantity: 100, unit: 'g', scalable: true },
              { name: 'Cottage cheese', quantity: 150, unit: 'g', scalable: true },
              { name: 'Ei', quantity: 1, unit: 'stuk', scalable: true },
              { name: 'Spinazie of rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Cherrytomaten, gehalveerd', quantity: 7, unit: 'stuk', scalable: true },
              { name: 'Citroen- of limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Pompoenpitten', quantity: 2, unit: 'tl', scalable: true },
              { name: "Za'atar of chilivlokken", quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 720, protein: 43, carbs: 65, fat: 34, fiber: 17,
          micronutrients: { calcium: 310, potassium: 1450, magnesium: 225, iron: 6.2, phosphorus: 610, zinc: 4.5, vitaminC: 34, folate: 250, vitaminA: 330, vitaminB12: 1.5, selenium: 35 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch'],
    dietSwaps: [
      { diet: 'vegan', hint: 'Vervang de cottage cheese door plantaardige cottage cheese of tofu-kruimels en het ei door tofu-scramble (met kurkuma, zwarte peper, chilivlokken en citroensap).' },
      { diet: 'lactosevrij', hint: 'Gebruik lactosevrije cottage cheese.' },
      { diet: 'glutenvrij', hint: 'Gebruik glutenvrij volkorenbrood.' },
      { diet: 'halal', hint: 'Gebruik cottage cheese met halal-certificering of zonder dierlijk stremsel.' },
    ],
  },
  {
    id: 'ontbijt-skyr-bowl-bessen',
    title: 'Skyr bowl met bessen, banaan & amandelcrunch',
    subtitle: 'Fris, eiwitrijk en fruitig met een krokante topping',
    mealType: 'ontbijt',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 0,
    tags: ['Vegetarisch'],
    instructions: [
      'Schep de skyr in een kom.',
      'Verdeel de banaan en blauwe bessen erover.',
      'Rooster de havermout en gehakte amandelen kort in een droge pan tot ze licht goudbruin en geurend zijn.',
      'Strooi de havermout-amandelcrunch over de bowl.',
      'Maak af met chiazaad, kaneel en citroenrasp.',
      'Serveer direct.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Skyr', quantity: 200, unit: 'g', scalable: true },
              { name: 'Banaan, in plakjes', quantity: 0.33, unit: 'stuk', scalable: true },
              { name: 'Blauwe bessen', quantity: 100, unit: 'g', scalable: true },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Havermout', quantity: 10, unit: 'g', scalable: true },
              { name: 'Amandelen, grof gehakt', quantity: 5, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 315, protein: 28, carbs: 42, fat: 5, fiber: 7,
          micronutrients: { calcium: 305, potassium: 650, magnesium: 85, iron: 1.6, phosphorus: 345, zinc: 1.8, vitaminC: 15, folate: 45, vitaminA: 30, vitaminB12: 0.6 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Skyr', quantity: 250, unit: 'g', scalable: true },
              { name: 'Banaan, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Blauwe bessen', quantity: 100, unit: 'g', scalable: true },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Havermout', quantity: 20, unit: 'g', scalable: true },
              { name: 'Amandelen, grof gehakt', quantity: 10, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 430, protein: 35, carbs: 56, fat: 9, fiber: 9,
          micronutrients: { calcium: 380, potassium: 845, magnesium: 130, iron: 2.2, phosphorus: 460, zinc: 2.4, vitaminC: 16, folate: 55, vitaminA: 35, vitaminB12: 0.8 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Skyr', quantity: 300, unit: 'g', scalable: true },
              { name: 'Banaan, in plakjes', quantity: 1, unit: 'stuk', scalable: true },
              { name: 'Blauwe bessen', quantity: 100, unit: 'g', scalable: true },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Havermout', quantity: 35, unit: 'g', scalable: true },
              { name: 'Amandelen, grof gehakt', quantity: 20, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 2, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 625, protein: 45, carbs: 82, fat: 16, fiber: 14,
          micronutrients: { calcium: 475, potassium: 1175, magnesium: 205, iron: 3.4, phosphorus: 620, zinc: 3.5, vitaminC: 22, folate: 80, vitaminA: 45, vitaminB12: 1.0 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch', 'halal'],
    dietSwaps: SKYR_SWAPS_DAIRY,
  },
  {
    id: 'ontbijt-smoothie-bowl',
    title: 'Smoothie bowl met banaan, bessen & spinazie',
    subtitle: 'Romig, fruitig en fris met extra groente',
    mealType: 'ontbijt',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 0,
    tags: ['Vegetarisch'],
    instructions: [
      'Doe banaan, skyr, blauwe bessen, spinazie, havermout, halfvolle melk, chiazaad, kaneel en een klein snufje zout in een blender.',
      'Blend tot een dikke, romige smoothie.',
      'Voeg eventueel een klein scheutje melk toe als de bowl te dik is.',
      'Schep de smoothie in een kom.',
      'Top met gehakte amandelen en extra blauwe bessen.',
      'Serveer direct.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Banaan, liefst bevroren', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Skyr', quantity: 150, unit: 'g', scalable: true },
              { name: 'Blauwe bessen', quantity: 100, unit: 'g', scalable: true },
              { name: 'Spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Havermout', quantity: 10, unit: 'g', scalable: true },
              { name: 'Halfvolle melk', quantity: 75, unit: 'ml', scalable: true },
              { name: 'Chiazaad', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Amandelen, grof gehakt', quantity: 5, unit: 'g', scalable: true },
              { name: 'Extra blauwe bessen', quantity: 25, unit: 'g', scalable: true },
            ],
          },
        ],
        nutrition: {
          calories: 340, protein: 25, carbs: 50, fat: 6, fiber: 8,
          micronutrients: { calcium: 350, potassium: 900, magnesium: 115, iron: 2.3, phosphorus: 335, zinc: 1.9, vitaminC: 27, folate: 100, vitaminA: 170, vitaminB12: 0.7 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Banaan, liefst bevroren', quantity: 1, unit: 'stuk', scalable: true },
              { name: 'Skyr', quantity: 150, unit: 'g', scalable: true },
              { name: 'Blauwe bessen', quantity: 100, unit: 'g', scalable: true },
              { name: 'Spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Havermout', quantity: 20, unit: 'g', scalable: true },
              { name: 'Halfvolle melk', quantity: 100, unit: 'ml', scalable: true },
              { name: 'Chiazaad', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Amandelen, grof gehakt', quantity: 10, unit: 'g', scalable: true },
              { name: 'Extra blauwe bessen', quantity: 25, unit: 'g', scalable: true },
            ],
          },
        ],
        nutrition: {
          calories: 470, protein: 29, carbs: 71, fat: 11, fiber: 11,
          micronutrients: { calcium: 410, potassium: 1230, magnesium: 170, iron: 3.2, phosphorus: 430, zinc: 2.6, vitaminC: 29, folate: 120, vitaminA: 175, vitaminB12: 0.8 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Banaan, liefst bevroren', quantity: 1, unit: 'grote', scalable: true },
              { name: 'Skyr', quantity: 200, unit: 'g', scalable: true },
              { name: 'Blauwe bessen', quantity: 125, unit: 'g', scalable: true },
              { name: 'Spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Havermout', quantity: 40, unit: 'g', scalable: true },
              { name: 'Halfvolle melk', quantity: 125, unit: 'ml', scalable: true },
              { name: 'Chiazaad', quantity: 2, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Amandelen, grof gehakt', quantity: 20, unit: 'g', scalable: true },
              { name: 'Extra blauwe bessen', quantity: 25, unit: 'g', scalable: true },
            ],
          },
        ],
        nutrition: {
          calories: 670, protein: 40, carbs: 96, fat: 18, fiber: 16,
          micronutrients: { calcium: 545, potassium: 1620, magnesium: 255, iron: 4.5, phosphorus: 610, zinc: 3.8, vitaminC: 36, folate: 155, vitaminA: 210, vitaminB12: 1.0 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch', 'halal'],
    dietSwaps: SKYR_SWAPS_DAIRY,
  },
  {
    id: 'ontbijt-zomerkwark-perzik',
    title: 'Frisse zomerkwark met perzik, havermout & pistache',
    subtitle: 'Fris, romig en zomers met een zachte crunch',
    mealType: 'ontbijt',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 0,
    tags: ['Vegetarisch'],
    instructions: [
      'Schep de skyr in een kom.',
      'Verdeel de perzikpartjes erover.',
      'Rooster de havermout kort in een droge pan tot deze licht goudbruin en geurend is.',
      'Top de bowl met de geroosterde havermout, pistachenoten, chiazaad, kaneel en citroenrasp.',
      'Voeg een klein snufje zout toe om de fruitsmaak sterker naar voren te laten komen.',
      'Serveer direct.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Skyr', quantity: 200, unit: 'g', scalable: true },
              { name: 'Perzik, in partjes', quantity: 1, unit: 'stuk', scalable: true },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Havermout', quantity: 15, unit: 'g', scalable: true },
              { name: 'Pistachenoten, grof gehakt', quantity: 5, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 315, protein: 28, carbs: 40, fat: 5, fiber: 7,
          micronutrients: { calcium: 305, potassium: 690, magnesium: 80, iron: 1.5, phosphorus: 330, zinc: 1.7, vitaminC: 13, folate: 45, vitaminA: 45, vitaminB12: 0.6 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Skyr', quantity: 250, unit: 'g', scalable: true },
              { name: 'Perzik, in partjes', quantity: 1, unit: 'stuk', scalable: true },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Havermout', quantity: 25, unit: 'g', scalable: true },
              { name: 'Pistachenoten, grof gehakt', quantity: 10, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 410, protein: 34, carbs: 48, fat: 10, fiber: 8,
          micronutrients: { calcium: 380, potassium: 850, magnesium: 115, iron: 2.0, phosphorus: 430, zinc: 2.3, vitaminC: 13, folate: 55, vitaminA: 45, vitaminB12: 0.8 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Skyr', quantity: 300, unit: 'g', scalable: true },
              { name: 'Perzik, in partjes', quantity: 1.5, unit: 'stuk', scalable: true },
            ],
          },
          {
            category: 'Topping',
            items: [
              { name: 'Havermout', quantity: 45, unit: 'g', scalable: true },
              { name: 'Pistachenoten, grof gehakt', quantity: 20, unit: 'g', scalable: true },
              { name: 'Chiazaad', quantity: 2, unit: 'tl', scalable: true },
              { name: 'Kaneel', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zout', quantity: 'klein snufje', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 610, protein: 45, carbs: 70, fat: 18, fiber: 13,
          micronutrients: { calcium: 465, potassium: 1160, magnesium: 190, iron: 3.2, phosphorus: 625, zinc: 3.6, vitaminC: 18, folate: 80, vitaminA: 65, vitaminB12: 1.0 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch', 'halal'],
    dietSwaps: SKYR_SWAPS_DAIRY,
  },
];
