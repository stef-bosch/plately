import type { ReactiveRecipe } from '../types';

/**
 * Reactive lunch recipes. Same model as the breakfasts: energy variants
 * (laag/gemiddeld/hoog) drive the portion, and `suitableFor` + `dietSwaps`
 * drive the dietary filter. See ../utils/resolveRecipe.ts.
 */

export const lunchRecipes: ReactiveRecipe[] = [
  {
    id: 'lunch-hummus-avocado-sandwich',
    title: 'Volkoren hummus-avocado sandwich met komkommer, paprika & rucola',
    subtitle: 'Romig, fris en knapperig met milde kruidigheid',
    mealType: 'lunch',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 0,
    tags: ['Vegetarisch', 'Lactosevrij', 'Notenvrij'],
    instructions: [
      'Rooster het volkorenbrood eventueel kort.',
      'Besmeer één snee brood met hummus.',
      'Prak de avocado met citroen- of limoensap en zwarte peper.',
      'Besmeer de andere snee brood met avocado.',
      'Beleg met komkommer, paprika en rucola of spinazie.',
      'Maak af met chilivlokken en pompoenpitten.',
      'Leg de sneetjes op elkaar en snijd de sandwich doormidden.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkorenbrood', quantity: 1, unit: 'sneetje', scalable: true },
              { name: 'Hummus', quantity: 30, unit: 'g', scalable: true },
              { name: 'Avocado', quantity: 35, unit: 'g', scalable: true },
              { name: 'Komkommer, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rode paprika, in reepjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola of spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Citroen- of limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Pompoenpitten', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Chilivlokken', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 330, protein: 11, carbs: 35, fat: 16, fiber: 11,
          micronutrients: { calcium: 115, potassium: 760, magnesium: 105, iron: 3.0, phosphorus: 250, zinc: 2.0, vitaminC: 90, folate: 120, vitaminA: 180 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkorenbrood', quantity: 2, unit: 'sneetje', scalable: true },
              { name: 'Hummus', quantity: 40, unit: 'g', scalable: true },
              { name: 'Avocado', quantity: 50, unit: 'g', scalable: true },
              { name: 'Komkommer, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rode paprika, in reepjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola of spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Citroen- of limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Pompoenpitten', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Chilivlokken', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 465, protein: 16, carbs: 52, fat: 22, fiber: 14,
          micronutrients: { calcium: 145, potassium: 930, magnesium: 145, iron: 4.0, phosphorus: 350, zinc: 2.8, vitaminC: 90, folate: 150, vitaminA: 180 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkorenbrood', quantity: 3, unit: 'sneetje', scalable: true },
              { name: 'Hummus', quantity: 60, unit: 'g', scalable: true },
              { name: 'Avocado', quantity: 75, unit: 'g', scalable: true },
              { name: 'Komkommer, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rode paprika, in reepjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola of spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Citroen- of limoensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Pompoenpitten', quantity: 2, unit: 'tl', scalable: true },
              { name: 'Chilivlokken', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 650, protein: 23, carbs: 76, fat: 30, fiber: 20,
          micronutrients: { calcium: 200, potassium: 1250, magnesium: 210, iron: 5.8, phosphorus: 520, zinc: 4.2, vitaminC: 105, folate: 210, vitaminA: 220 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch', 'vegan', 'lactosevrij', 'halal'],
    dietSwaps: [
      { diet: 'glutenvrij', hint: 'Gebruik glutenvrij brood.' },
    ],
  },
  {
    id: 'lunch-roggebrood-makreel',
    title: 'Roggebrood met makreel, citroen, komkommer & radijs',
    subtitle: 'Fris, hartig en eiwitrijk met lichte pit',
    mealType: 'lunch',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 0,
    tags: ['Lactosevrij', 'Notenvrij'],
    instructions: [
      'Meng de makreel met citroensap, citroenrasp, olijfolie en zwarte peper.',
      'Beleg het roggebrood met veldsla of rucola.',
      'Verdeel de makreel erover.',
      'Voeg komkommer en radijs toe.',
      'Werk af met dille of bieslook.',
      'Serveer direct.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Roggebrood', quantity: 2, unit: 'sneetje', scalable: true },
              { name: 'Makreel, uitgelekt', quantity: 75, unit: 'g', scalable: true },
              { name: 'Olijfolie', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Komkommer, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Radijsjes, dun gesneden', quantity: 4, unit: 'stuk', scalable: true },
              { name: 'Veldsla of rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Citroensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Dille of bieslook', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 330, protein: 21, carbs: 34, fat: 13, fiber: 8,
          micronutrients: { calcium: 135, potassium: 670, magnesium: 80, iron: 2.6, phosphorus: 330, zinc: 1.8, vitaminC: 14, vitaminB12: 6.0, vitaminD: 5.2, selenium: 42, iodine: 34 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Roggebrood', quantity: 3, unit: 'sneetje', scalable: true },
              { name: 'Makreel, uitgelekt', quantity: 100, unit: 'g', scalable: true },
              { name: 'Olijfolie', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Komkommer, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Radijsjes, dun gesneden', quantity: 4, unit: 'stuk', scalable: true },
              { name: 'Veldsla of rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Citroensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Dille of bieslook', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 455, protein: 28, carbs: 45, fat: 19, fiber: 10,
          micronutrients: { calcium: 170, potassium: 850, magnesium: 105, iron: 3.4, phosphorus: 420, zinc: 2.3, vitaminC: 14, vitaminB12: 8.0, vitaminD: 7, selenium: 55, iodine: 45 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Roggebrood', quantity: 3, unit: 'sneetje', scalable: true },
              { name: 'Makreel, uitgelekt', quantity: 125, unit: 'g', scalable: true },
              { name: 'Olijfolie', quantity: 1.5, unit: 'tl', scalable: true },
              { name: 'Komkommer, in plakjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Radijsjes, dun gesneden', quantity: 4, unit: 'stuk', scalable: true },
              { name: 'Veldsla of rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Citroensap', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Citroenrasp', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Dille of bieslook', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 610, protein: 36, carbs: 58, fat: 27, fiber: 13,
          micronutrients: { calcium: 220, potassium: 1120, magnesium: 135, iron: 4.5, phosphorus: 540, zinc: 3.0, vitaminC: 18, vitaminB12: 10.0, vitaminD: 9, selenium: 70, iodine: 58 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['lactosevrij', 'halal'],
    dietSwaps: [
      { diet: 'glutenvrij', hint: 'Vervang het roggebrood door glutenvrij brood (rogge bevat gluten).' },
    ],
  },
  {
    id: 'lunch-pastasalade-witte-bonen',
    title: 'Siciliaanse volkoren pastasalade met witte bonen, tomaat & rucola',
    subtitle: 'Fris, hartig en mediterraan met veel bite',
    mealType: 'lunch',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 10,
    cookTime: 10,
    tags: ['Vegetarisch', 'Notenvrij'],
    instructions: [
      'Kook de volkoren pasta beetgaar volgens de verpakking.',
      'Spoel kort koud af en laat goed uitlekken.',
      'Meng de pasta met witte bonen, cherrytomaten, komkommer, rucola en kappertjes.',
      'Voeg citroensap, citroenrasp, olijfolie, oregano en zwarte peper toe.',
      'Schep alles goed om.',
      'Werk af met 30+ kaas en verse basilicum of peterselie.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkoren pasta', quantity: 50, unit: 'g', scalable: true },
              { name: 'Witte bonen, afgespoeld en uitgelekt', quantity: 125, unit: 'g', scalable: true },
              { name: 'Cherrytomaten, gehalveerd', quantity: 100, unit: 'g', scalable: true },
              { name: 'Komkommer, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Kappertjes, afgespoeld', quantity: 1, unit: 'el', scalable: true },
              { name: 'Citroen, sap en rasp', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Olijfolie', quantity: 0.5, unit: 'tl', scalable: true },
              { name: '30+ kaas, fijngeraspt', quantity: 10, unit: 'g', scalable: true },
              { name: 'Oregano', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Verse basilicum of peterselie', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 430, protein: 22, carbs: 68, fat: 8, fiber: 14,
          micronutrients: { calcium: 190, potassium: 970, magnesium: 125, iron: 4.4, phosphorus: 370, zinc: 2.5, vitaminC: 35, folate: 190, vitaminA: 180, vitaminB12: 0.2 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkoren pasta', quantity: 70, unit: 'g', scalable: true },
              { name: 'Witte bonen, afgespoeld en uitgelekt', quantity: 150, unit: 'g', scalable: true },
              { name: 'Cherrytomaten, gehalveerd', quantity: 100, unit: 'g', scalable: true },
              { name: 'Komkommer, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Kappertjes, afgespoeld', quantity: 1, unit: 'el', scalable: true },
              { name: 'Citroen, sap en rasp', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Olijfolie', quantity: 1, unit: 'tl', scalable: true },
              { name: '30+ kaas, fijngeraspt', quantity: 15, unit: 'g', scalable: true },
              { name: 'Oregano', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Verse basilicum of peterselie', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 570, protein: 28, carbs: 88, fat: 12, fiber: 17,
          micronutrients: { calcium: 250, potassium: 1150, magnesium: 160, iron: 5.5, phosphorus: 460, zinc: 3.2, vitaminC: 35, folate: 220, vitaminA: 180, vitaminB12: 0.3 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkoren pasta', quantity: 90, unit: 'g', scalable: true },
              { name: 'Witte bonen, afgespoeld en uitgelekt', quantity: 200, unit: 'g', scalable: true },
              { name: 'Cherrytomaten, gehalveerd', quantity: 150, unit: 'g', scalable: true },
              { name: 'Komkommer, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Kappertjes, afgespoeld', quantity: 1, unit: 'el', scalable: true },
              { name: 'Citroen, sap en rasp', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Olijfolie', quantity: 2, unit: 'tl', scalable: true },
              { name: '30+ kaas, fijngeraspt', quantity: 20, unit: 'g', scalable: true },
              { name: 'Oregano', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Verse basilicum of peterselie', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 760, protein: 38, carbs: 119, fat: 17, fiber: 24,
          micronutrients: { calcium: 340, potassium: 1580, magnesium: 230, iron: 7.4, phosphorus: 650, zinc: 4.6, vitaminC: 48, folate: 315, vitaminA: 230, vitaminB12: 0.4 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch'],
    dietSwaps: [
      { diet: 'vegan', hint: 'Laat de 30+ kaas weg of gebruik plantaardige kaas.' },
      { diet: 'lactosevrij', hint: 'Gebruik lactosevrije of belegen kaas.' },
      { diet: 'glutenvrij', hint: 'Gebruik glutenvrije pasta.' },
      { diet: 'halal', hint: 'Gebruik kaas zonder dierlijk stremsel.' },
    ],
  },
  {
    id: 'lunch-couscous-kikkererwten-feta',
    title: 'Couscous bowl met kikkererwten, paprika, komkommer & feta',
    subtitle: 'Fris, kruidig en vullend met mediterrane tonen',
    mealType: 'lunch',
    seasons: ['lente-zomer'],
    baseServings: 1,
    prepTime: 15,
    cookTime: 0,
    tags: ['Vegetarisch', 'Notenvrij'],
    instructions: [
      'Bereid de volkoren couscous volgens de verpakking met kokend water.',
      'Maak de couscous los met een vork.',
      'Meng de couscous met kikkererwten, komkommer, paprika en rucola of spinazie.',
      'Voeg citroensap, olijfolie, komijn, ras el hanout of paprikapoeder en zwarte peper toe.',
      'Schep alles goed om.',
      'Verkruimel de feta erover.',
      'Werk af met munt of peterselie.',
    ],
    energy: {
      laag: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkoren couscous', quantity: 50, unit: 'g', scalable: true },
              { name: 'Kikkererwten, afgespoeld en uitgelekt', quantity: 125, unit: 'g', scalable: true },
              { name: 'Komkommer, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Paprika, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola of spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Feta', quantity: 15, unit: 'g', scalable: true },
              { name: 'Citroen, sap van', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Olijfolie', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Komijnpoeder', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Ras el hanout of paprikapoeder', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Verse munt of peterselie', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 420, protein: 19, carbs: 65, fat: 9, fiber: 13,
          micronutrients: { calcium: 180, potassium: 800, magnesium: 115, iron: 3.8, phosphorus: 335, zinc: 2.4, vitaminC: 80, folate: 215, vitaminA: 190, vitaminB12: 0.2 },
          isIndicative: true,
        },
      },
      gemiddeld: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkoren couscous', quantity: 70, unit: 'g', scalable: true },
              { name: 'Kikkererwten, afgespoeld en uitgelekt', quantity: 150, unit: 'g', scalable: true },
              { name: 'Komkommer, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Paprika, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Rucola of spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Feta', quantity: 20, unit: 'g', scalable: true },
              { name: 'Citroen, sap van', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Olijfolie', quantity: 1, unit: 'tl', scalable: true },
              { name: 'Komijnpoeder', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Ras el hanout of paprikapoeder', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Verse munt of peterselie', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 555, protein: 24, carbs: 82, fat: 14, fiber: 16,
          micronutrients: { calcium: 230, potassium: 950, magnesium: 145, iron: 4.8, phosphorus: 420, zinc: 3.0, vitaminC: 80, folate: 250, vitaminA: 190, vitaminB12: 0.3 },
          isIndicative: true,
        },
      },
      hoog: {
        ingredients: [
          {
            category: 'Basis',
            items: [
              { name: 'Volkoren couscous', quantity: 90, unit: 'g', scalable: true },
              { name: 'Kikkererwten, afgespoeld en uitgelekt', quantity: 200, unit: 'g', scalable: true },
              { name: 'Komkommer, in blokjes', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Paprika, in blokjes', quantity: 1, unit: 'stuk', scalable: true },
              { name: 'Rucola of spinazie', quantity: 1, unit: 'handje', scalable: true },
              { name: 'Feta', quantity: 30, unit: 'g', scalable: true },
              { name: 'Citroen, sap van', quantity: 0.5, unit: 'stuk', scalable: true },
              { name: 'Olijfolie', quantity: 2, unit: 'tl', scalable: true },
              { name: 'Komijnpoeder', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Ras el hanout of paprikapoeder', quantity: 0.5, unit: 'tl', scalable: true },
              { name: 'Zwarte peper', quantity: 'naar smaak', unit: '', scalable: false },
              { name: 'Verse munt of peterselie', quantity: 'naar smaak', unit: '', scalable: false },
            ],
          },
        ],
        nutrition: {
          calories: 750, protein: 34, carbs: 112, fat: 21, fiber: 23,
          micronutrients: { calcium: 320, potassium: 1350, magnesium: 215, iron: 6.7, phosphorus: 625, zinc: 4.5, vitaminC: 125, folate: 360, vitaminA: 260, vitaminB12: 0.4 },
          isIndicative: true,
        },
      },
    },
    suitableFor: ['vegetarisch'],
    dietSwaps: [
      { diet: 'vegan', hint: 'Laat de feta weg of gebruik plantaardige feta.' },
      { diet: 'lactosevrij', hint: 'Gebruik lactosevrije of plantaardige feta.' },
      { diet: 'glutenvrij', hint: 'Vervang de couscous door glutenvrije couscous, quinoa of rijst.' },
      { diet: 'halal', hint: 'Gebruik feta zonder dierlijk stremsel.' },
    ],
  },
];
