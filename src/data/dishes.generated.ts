import type { Recipe } from '../types';

/**
 * Bundled recipe library (exported from the old Supabase backend on
 * 2026-09-20). The app is standalone: dishes live here, not in a backend.
 * Add or edit dishes directly in this array; photos are attached from
 * dishImages.ts by id.
 */
export const BUNDLED_DISHES: Recipe[] = [
  {
    "id": "aperol-spritz",
    "tags": [
      "Lactosevrij",
      "Glutenvrij",
      "Vegetarisch"
    ],
    "title": "Aperol Spritz",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "subtitle": "Fris, licht bitter en citrusachtig met een bruisende afdronk.",
    "nutrition": {
      "fat": 0,
      "carbs": 16,
      "fiber": 0,
      "protein": 0,
      "calories": 85,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "alcoholvrije sinaasappel-bitter of alcoholvrije aperitiefspritz",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "alcoholvrije prosecco of alcoholvrije mousserende wijn",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "vers sinaasappelsap",
            "unit": "ml",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "sinaasappelschijfje, voor garnering",
            "unit": "",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "lactosevrij",
      "glutenvrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Vul een groot wijnglas royaal met ijsblokjes.",
      "Schenk de alcoholvrije sinaasappel-bitter of aperitiefspritz in het glas.",
      "Voeg het sinaasappelsap toe.",
      "Schenk de alcoholvrije prosecco of mousserende wijn erbij.",
      "Vul af met bruiswater.",
      "Roer kort en voorzichtig door, zodat de bubbels behouden blijven.",
      "Garneer met een sinaasappelschijfje.",
      "Serveer direct.",
      "Alcoholversie: gebruik 75 ml prosecco, 50 ml Aperol en 25 ml bruiswater. Serveer in een groot glas met veel ijs en een sinaasappelschijfje."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "avocado-toast-met-cottage-cheese-zachtgekookt-ei-za-atar-en-",
    "tags": [
      "Vegetarisch",
      "Halal"
    ],
    "title": "Avocado toast",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "ontbijt",
    "prepTime": 15,
    "subtitle": "Een romige en frisse toast waarin avocado, cottage cheese en za'atar zorgen voor een perfecte balans tussen hartig en citrus.",
    "nutrition": {
      "fat": 27,
      "carbs": 37,
      "fiber": 11,
      "protein": 31,
      "calories": 530,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sneetjes volkoren (zuurdesem)brood",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "avocado (±75 g)",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "cottage cheese",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "ei",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "za'atar",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rasp en sap van citroen",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "handje kiemen of rucola",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Kook het ei 7 minuten.",
      "Rooster het brood.",
      "Prak de avocado met citroensap en peper.",
      "Besmeer het brood met avocado.",
      "Verdeel de cottage cheese erover.",
      "Halveer het ei en leg op de toast.",
      "Garneer met za'atar, citroenrasp en kiemen."
    ]
  },
  {
    "id": "caribische-zoete-aardappel-groentesalade",
    "tags": [
      "Vegetarisch",
      "Lactosevrij",
      "Glutenvrij"
    ],
    "title": "Caribische zoete-aardappel-groentesalade",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 40,
    "subtitle": "Zoet, zuur, rokerig, fris, licht bitter, kruidig en knapperig",
    "nutrition": {
      "fat": 8,
      "carbs": 36,
      "fiber": 9,
      "protein": 6,
      "calories": 230,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "zoete aardappel, in kleine parten of blokken",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "okra, grote exemplaren gehalveerd",
            "unit": "g",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "rode paprika, in grove repen",
            "unit": "g",
            "quantity": 50,
            "scalable": true
          },
          {
            "name": "rode ui, in dunne parten",
            "unit": "g",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "gerookt paprikapoeder",
            "unit": "tl",
            "quantity": 0.125,
            "scalable": true
          },
          {
            "name": "snuf gemalen komijn",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Warme groenten"
      },
      {
        "items": [
          {
            "name": "spitskool of witte kool, zeer dun gesneden",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "komkommer, in dunne halve maantjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "wortel, grof geraspt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "limoensap",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "handje verse munt, grof gesneden",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "handje verse koriander, grof gesneden",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "snuf chilivlokken",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Fris saladegedeelte"
      },
      {
        "items": [
          {
            "name": "ongezouten pinda’s, geroosterd en grof gehakt",
            "unit": "g",
            "quantity": 5,
            "scalable": true
          },
          {
            "name": "Caribbean Green Sauce",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "mango, in kleine blokjes",
            "unit": "g",
            "quantity": 10,
            "scalable": true
          }
        ],
        "category": "Afwerking"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "lactosevrij",
      "glutenvrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Verwarm de BBQ voor op indirect grillen op 200–220°C.",
      "Meng de zoete aardappel met ongeveer de helft van de olijfolie, het gerookte paprikapoeder, de komijn en zwarte peper.",
      "Rooster de zoete aardappel in ongeveer 20–30 minuten gaar en goudbruin.",
      "Meng de okra, paprika en rode ui met de resterende olie.",
      "Grill deze groenten gedurende de laatste 8–12 minuten mee.",
      "Meng ondertussen de kool, komkommer, wortel, munt en koriander.",
      "Voeg het limoensap, de chilivlokken en zwarte peper toe.",
      "Laat de warme groenten na het grillen ongeveer 2 minuten afkoelen.",
      "Schep de warme groenten voorzichtig door het frisse saladegedeelte.",
      "Voeg 1–2 theelepels Caribbean Green Sauce toe.",
      "Werk af met de geroosterde pinda’s.",
      "Voeg eventueel enkele mangoblokjes toe voor een extra tropisch accent."
    ],
    "overigCategory": "Bijgerechten"
  },
  {
    "id": "chili-con-carne",
    "tags": [
      "Halal",
      "Vegetarisch"
    ],
    "title": "Chili sin carne",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 30,
    "subtitle": "Een kruidige, gezonde chili con carne (of chili sin carne) met kidneybonen, paprika en tomaat.",
    "nutrition": {
      "fat": 12,
      "carbs": 108,
      "fiber": 24,
      "protein": 31,
      "calories": 670,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "zoete aardappel, in blokjes van circa 1 cm",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "kidneybonen, uitgelekt en afgespoeld",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "tomatenblokjes uit blik",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "kleine rode paprika, in kleine blokjes",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rode ui, fijngesnipperd",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "kleine teen knoflook, fijngehakt",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "tomatenpuree",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "water",
            "unit": "ml",
            "quantity": 75,
            "scalable": true
          }
        ],
        "category": "Chili sin carne"
      },
      {
        "items": [
          {
            "name": "gemalen komijn",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "gerookt paprikapoeder",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "chilipoeder, of naar smaak",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "gedroogde oregano",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "gemalen koriander",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "ongezoet cacaopoeder",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "klein snufje kaneel",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Kruidenmix"
      },
      {
        "items": [
          {
            "name": "kleine volkoren tortilla’s",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "snufje gerookt paprikapoeder",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "snufje komijn",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "snufje zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Tortillachips"
      },
      {
        "items": [
          {
            "name": "Griekse yoghurt 0% vet",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "sap van limoen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "fijn geraspte limoenschil",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "fijngehakte verse koriander",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "kleine teen knoflook, zeer fijn geraspt",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "water",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Limoenyoghurtsaus"
      }
    ],
    "suitableFor": [
      "halal",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Verwarm de oven voor op 200 °C.",
      "Snijd de tortilla’s in driehoekjes en verdeel ze over een met bakpapier beklede bakplaat. Bestrooi licht met gerookt paprikapoeder, komijn en een klein snufje zout.\n\nBak ze 8–10 minuten, tot ze goudbruin en krokant zijn. Houd ze tegen het einde goed in de gaten.",
      "Meng de Griekse yoghurt met het limoensap, de limoenrasp, koriander, knoflook, zwarte peper en een klein snufje zout. Verdun eventueel met 1–2 theelepels water. Zet apart.",
      "Verhit de olijfolie in een pan. Bak de rode ui en paprika ongeveer 3 minuten op middelhoog vuur.",
      "Voeg de blokjes zoete aardappel toe en bak ze 2–3 minuten mee.",
      "Voeg de knoflook, komijn, gerookt paprikapoeder, chilipoeder, oregano, gemalen koriander, cacao, kaneel en zwarte peper toe. Bak ongeveer 30 seconden mee, tot de kruiden goed beginnen te geuren.",
      "Voeg de tomatenpuree toe en bak ongeveer 1 minuut mee. Dit maakt de smaak wat voller en minder zuur.",
      "Voeg de tomatenblokjes, kidneybonen en ongeveer 75 ml water toe. Breng aan de kook en zet het vuur laag.\n\nLaat de chili met het deksel schuin op de pan ongeveer 15–20 minuten zachtjes pruttelen, tot de zoete aardappel gaar is. Roer regelmatig. Voeg indien nodig wat extra water toe.",
      "Prak met een houten lepel enkele stukjes zoete aardappel en kidneybonen tegen de zijkant van de pan. Roer ze vervolgens door de chili. Hierdoor wordt de saus vanzelf wat dikker en romiger.",
      "Proef en voeg naar behoefte zout, zwarte peper, chilipoeder of een klein scheutje limoensap toe.\n\nDe cacao en kaneel moeten niet afzonderlijk te proeven zijn; ze zorgen op de achtergrond voor een diepere, warmere smaak.",
      "Schep de chili sin carne in een kom of diep bord. Lepel er wat frisse limoenyoghurtsaus over of serveer de saus ernaast.\n\nServeer met de krokante zelfgemaakte tortillachips om mee te dippen."
    ]
  },
  {
    "id": "citroen-havermoutpannenkoeken-met-ricotta-en-warm-rood-zomer",
    "tags": [
      "Vegetarisch",
      "Halal"
    ],
    "title": "Citroen-havermoutpannenkoeken met ricotta en warm rood zomerfruit",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "ontbijt",
    "prepTime": 20,
    "subtitle": "Luchtige volkoren pannenkoeken met frisse citroen, romige ricotta en warm zomerfruit: een ontspannen zondagochtend op je bord.",
    "nutrition": {
      "fat": 22,
      "carbs": 56,
      "fiber": 10,
      "protein": 27,
      "calories": 560,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "havermeel",
            "unit": "g",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "ei",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "halfvolle melk",
            "unit": "ml",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "ricotta",
            "unit": "g",
            "quantity": 50,
            "scalable": true
          },
          {
            "name": "rasp van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "bakpoeder",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "kaneel",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Pannenkoeken"
      },
      {
        "items": [
          {
            "name": "rood zomerfruit",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "honing",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "ongezouten pistachenoten, grof gehakt",
            "unit": "g",
            "quantity": 10,
            "scalable": true
          }
        ],
        "category": "Topping"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Meng alle ingrediënten voor het beslag.",
      "Laat het beslag 5 minuten rusten.",
      "Bak 3 à 4 kleine pannenkoeken in een licht ingevette koekenpan.",
      "Verwarm het zomerfruit kort in een pannetje.",
      "Serveer de pannenkoeken met het warme fruit en de pistachenoten."
    ]
  },
  {
    "id": "citrus-foam-mocktail",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Pisco Sour",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 10,
    "nutrition": {
      "fat": 0,
      "carbs": 29,
      "fiber": 0,
      "protein": 1,
      "calories": 120,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "vers limoensap",
            "unit": "ml",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "witte druivensap",
            "unit": "ml",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "koud water",
            "unit": "ml",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "agavesiroop",
            "unit": "ml",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "aquafaba",
            "unit": "ml",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "sinaasappelrasp",
            "unit": "",
            "quantity": "optioneel",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Doe het limoensap, witte druivensap, koude water, de agavesiroop of honing en aquafaba in een shaker.",
      "Shake eerst 20 seconden zonder ijs, zodat er schuim ontstaat.",
      "Voeg ijsblokjes toe.",
      "Shake opnieuw 15 seconden.",
      "Zeef in een gekoeld glas.",
      "Garneer eventueel met een klein beetje sinaasappelschilrasp.",
      "Alcoholversie: Vervang de 60 ml witte druivensap door 60 ml pisco."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "coffee-spice-cooler",
    "tags": [
      "Vegetarisch",
      "Glutenvrij",
      "Lactosevrij"
    ],
    "title": "Cola de Mono",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "nutrition": {
      "fat": 1,
      "carbs": 10,
      "fiber": 0,
      "protein": 1,
      "calories": 55,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sterke koude koffie",
            "unit": "ml",
            "quantity": 120,
            "scalable": true
          },
          {
            "name": "ongezoete amandelmelk",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "ahornsiroop",
            "unit": "ml",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "kaneel",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "glutenvrij",
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Doe de koude koffie, amandelmelk, ahornsiroop of honing en kaneel in een shaker.",
      "Voeg ijsblokjes toe.",
      "Shake kort en krachtig.",
      "Zeef in een glas met ijs.",
      "Bestrooi met een klein beetje kaneel.",
      "Alcoholversie: Voeg 50 ml aguardiente of donkere rum toe. Voeg eventueel een klein snufje kruidnagel of nootmuskaat toe."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "dumpling-noodle-comfort-bowl",
    "tags": [
      "Lactosevrij"
    ],
    "title": "Dumpling Comfort Bowl",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 25,
    "subtitle": "Een verwarmende noedelbowl met knapperige groenten, sappige dumplings en een lichte umamibouillon. Gezond comfort food dat binnen 25 minuten op tafel staat.",
    "nutrition": {
      "fat": 31,
      "carbs": 66,
      "fiber": 12,
      "protein": 39,
      "calories": 735,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "kip- of groentedumplings",
            "unit": "",
            "quantity": 5,
            "scalable": true
          },
          {
            "name": "portie volkoren instant noodles of volkoren ramennoedels",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "groentebouillon met minder zout",
            "unit": "ml",
            "quantity": 500,
            "scalable": true
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "paksoi",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "shiitake",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "wortel, julienne",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "edamame (gedopt)",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "bosuitjes",
            "unit": "",
            "quantity": 2,
            "scalable": true
          }
        ],
        "category": "Groenten"
      },
      {
        "items": [
          {
            "name": "teen knoflook, fijngehakt",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "verse gember, geraspt",
            "unit": "cm",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "sojasaus met minder zout",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "witte miso",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "rijstazijn",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sesamolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Bouillon"
      },
      {
        "items": [
          {
            "name": "zachtgekookt ei",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sesamzaad",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "verse koriander of bieslook",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "chili-olie of crispy chili",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Toppings"
      }
    ],
    "suitableFor": [
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Breng de bouillon aan de kook.",
      "Voeg knoflook, gember, miso, sojasaus, rijstazijn en sesamolie toe.",
      "Voeg de wortel en shiitake toe en laat 3 minuten zacht koken.",
      "Voeg de paksoi en edamame toe.",
      "Kook ondertussen de noedels volgens de verpakking.",
      "Stoom of kook de dumplings in 6–8 minuten gaar (of bak ze eerst krokant en voeg ze daarna toe).",
      "Verdeel de noedels over een diepe kom.",
      "Schenk de bouillon met groenten erbij.",
      "Leg de dumplings erop.",
      "Garneer met het gehalveerde ei, bosui, sesamzaad en eventueel een beetje chili-olie."
    ]
  },
  {
    "id": "fruit-punch-cooler",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Rum Punch",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "nutrition": {
      "fat": 0,
      "carbs": 27,
      "fiber": 0,
      "protein": 1,
      "calories": 115,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sinaasappelsap",
            "unit": "ml",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "ananassap",
            "unit": "ml",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "mangosap",
            "unit": "ml",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 90,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Meng het sinaasappelsap, ananassap en mangosap.",
      "Vul een glas met ijsblokjes.",
      "Schenk het sapmengsel over het ijs.",
      "Vul af met bruiswater.",
      "Roer kort door en serveer direct.",
      "Alcoholversie: Voeg 60 ml donkere rum toe. Voeg eventueel een klein scheutje grenadine toe voor kleur."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "gegrilde-witvis-met-limoen-en-tijm",
    "tags": [
      "Lactosevrij"
    ],
    "title": "Gegrilde witvis met limoen en tijm",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 15,
    "subtitle": "Fris, hartig, licht rokerig en kruidig",
    "nutrition": {
      "fat": 4,
      "carbs": 0,
      "fiber": 0,
      "protein": 17,
      "calories": 105,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "stevige witvis, eventueel met huid",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "limoensap",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "teen knoflook, fijngehakt",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "verse tijmblaadjes",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "olijfolie",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "chilivlokken",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "limoenpartje",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Dep de vis goed droog.",
      "Meng het limoensap, de knoflook, tijm, olijfolie, zwarte peper en chilivlokken.",
      "Wrijf de vis dun in met de marinade.",
      "Laat maximaal 15–20 minuten marineren.",
      "Verwarm de BBQ voor op indirect grillen op 180–190°C.",
      "Grill de vis afhankelijk van de dikte ongeveer 6–9 minuten.",
      "Gebruik bij vis zonder stevige huid eventueel een grillplaat, visklem of herbruikbaar BBQ-matje.",
      "Serveer de vis direct met een klein partje limoen."
    ],
    "overigCategory": "Hoofdgerechten"
  },
  {
    "id": "ginger-lime-spritz",
    "tags": [
      "Vegetarisch",
      "Glutenvrij",
      "Lactosevrij"
    ],
    "title": "Chilcano",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "nutrition": {
      "fat": 0,
      "carbs": 16,
      "fiber": 0,
      "protein": 0,
      "calories": 65,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "vers limoensap",
            "unit": "ml",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "gembersiroop",
            "unit": "ml",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 200,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "verse munt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "limoenschijfje",
            "unit": "",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "glutenvrij",
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Vul een glas met ijsblokjes.",
      "Voeg het limoensap en de gembersiroop toe.",
      "Vul af met bruiswater.",
      "Roer kort door.",
      "Garneer met verse munt en een limoenschijfje.",
      "Alcoholversie: Voeg 50 ml pisco toe en verlaag het bruiswater naar 120–150 ml."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "groene-omelet-met-spinazie-kruiden-feta-en-volkorenbrood",
    "tags": [
      "Vegetarisch",
      "Halal"
    ],
    "title": "Groene omelet met spinazie, kruiden, feta en volkorenbrood",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "ontbijt",
    "prepTime": 15,
    "subtitle": "Een luchtige omelet vol groene groenten en verse kruiden, gecombineerd met romige feta voor een hartige start van de dag.",
    "nutrition": {
      "fat": 29,
      "carbs": 34,
      "fiber": 8,
      "protein": 35,
      "calories": 555,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "eieren",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "verse spinazie",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "feta",
            "unit": "g",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "sneetjes volkorenbrood",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "verse peterselie",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "bieslook",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Verhit de olijfolie in een koekenpan.",
      "Laat de spinazie kort slinken.",
      "Klop de eieren los met peper en de verse kruiden.",
      "Schenk het eimengsel over de spinazie.",
      "Verkruimel de feta over de omelet en bak rustig gaar.",
      "Serveer met geroosterd volkorenbrood."
    ]
  },
  {
    "id": "groene-pesto",
    "tags": [],
    "title": "Groene Pesto",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 10,
    "nutrition": {
      "fat": 0,
      "carbs": 0,
      "fiber": 0,
      "protein": 0,
      "calories": 0,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "verse basilicum",
            "unit": "g",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "verse spinazie",
            "unit": "g",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "pijnboompitten",
            "unit": "g",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "teentje knoflook",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "extra vierge olijfolie",
            "unit": "ml",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "sap van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "Parmezaam",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "baseServings": 1,
    "instructions": [
      "Rooster de pijnboompitten kort in een droge pan tot ze licht kleuren.",
      "Doe de basilicum, spinazie, geroosterde noten, knoflook, olijfolie, citroensap, Parmezaan en zwarte peper in een hakmolentje of blender.",
      "Mix kort tot een grove pesto. Maak de pesto niet helemaal glad; een beetje structuur geeft een lekkerder resultaat.",
      "Proef en voeg eventueel een klein snufje zout toe.",
      "Verdeel de pesto in kleine porties, bijvoorbeeld in een ijsblokjesvorm.",
      "Vries de pesto in.",
      "Haal per lunch 1 blokje of ongeveer 1 eetlepel pesto uit de diepvries."
    ],
    "overigCategory": "Sauzen"
  },
  {
    "id": "jamaicaanse-jerk-kip",
    "tags": [
      "Lactosevrij"
    ],
    "title": "Jamaicaanse jerk-kip",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 20,
    "subtitle": "Kruidig, rokerig, pittig, hartig en lichtzoet",
    "nutrition": {
      "fat": 6,
      "carbs": 3,
      "fiber": 0,
      "protein": 16,
      "calories": 120,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "kipfilet of ontvelde kipdijfilet",
            "unit": "g",
            "quantity": 65,
            "scalable": true
          }
        ],
        "category": "Kip"
      },
      {
        "items": [
          {
            "name": "lente-ui, grof gesneden",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "teen knoflook",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "klein stukje rode chili",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "gemalen piment",
            "unit": "tl",
            "quantity": 0.125,
            "scalable": true
          },
          {
            "name": "gedroogde tijm",
            "unit": "tl",
            "quantity": 0.125,
            "scalable": true
          },
          {
            "name": "snuf kaneel",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "snuf nootmuskaat",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "limoensap",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "sojasaus met minder zout",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "olijfolie",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "honing",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          }
        ],
        "category": "Marinade"
      }
    ],
    "suitableFor": [
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Doe de lente-ui, knoflook, chili, piment, tijm, kaneel, nootmuskaat, limoensap, sojasaus, olijfolie en zwarte peper in een klein hakmolentje.",
      "Pureer tot een grove marinade.",
      "Meng de kip zorgvuldig met de marinade.",
      "Laat de kip minimaal 2 uur afgedekt marineren in de koelkast.",
      "Grill de kip ongeveer 2 minuten per kant boven directe hitte.",
      "Verplaats hem daarna naar het indirecte gedeelte van de BBQ.",
      "Laat op 190–210°C verder garen.",
      "Gaar de kip tot een kerntemperatuur van circa 72°C.",
      "Laat de kip enkele minuten rusten.",
      "Snijd hem voor het serveren schuin in twee of drie stukken."
    ],
    "overigCategory": "Hoofdgerechten"
  },
  {
    "id": "kwark-met-frambozen-en-walnoten",
    "tags": [
      "Vegetarisch",
      "Halal",
      "Glutenvrij"
    ],
    "title": "Kwark met frambozen en walnoten",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "tussendoortje",
    "prepTime": 10,
    "subtitle": "Een romige en eiwitrijke snack waarin frisse frambozen en knapperige walnoten zorgen voor een mooie balans tussen zoet en hartig.",
    "nutrition": {
      "fat": 14,
      "carbs": 20,
      "fiber": 8,
      "protein": 29,
      "calories": 315,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "magere kwark",
            "unit": "g",
            "quantity": 250,
            "scalable": true
          },
          {
            "name": "frambozen",
            "unit": "g",
            "quantity": 125,
            "scalable": true
          },
          {
            "name": "ongezouten walnoten",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "halal",
      "glutenvrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Schep de kwark in een kom.",
      "Voeg de frambozen toe.",
      "Bestrooi met de walnoten."
    ]
  },
  {
    "id": "margerita",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Margerita",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "subtitle": "Fris, zuur en licht zoutig met limoen en citrus.",
    "nutrition": {
      "fat": 0,
      "carbs": 22,
      "fiber": 0,
      "protein": 0,
      "calories": 95,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "vers limoensap",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "sinaasappelsap",
            "unit": "ml",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "bruiswater of tonic zero",
            "unit": "ml",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "agavesiroop",
            "unit": "ml",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "grof zout, voor de rand van het glas",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "limoenpartje, voor garnering",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Wrijf eventueel met een limoenpartje langs de rand van het glas.",
      "Dip de rand voorzichtig in grof zout.",
      "Doe het limoensap, sinaasappelsap, bruiswater of tonic zero en de agavesiroop in een shaker.",
      "Voeg ijsblokjes toe.",
      "Shake kort en krachtig.",
      "Zeef in een glas met ijsblokjes.",
      "Garneer eventueel met een limoenpartje.",
      "Serveer direct.",
      "Alcoholversie: gebruik 50 ml tequila, 25 ml vers limoensap en 20 ml triple sec of Cointreau. Voeg eventueel 5–10 ml agavesiroop toe als je de Margarita iets zachter wilt maken. Shake met ijs en serveer met een zoutrand."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "mediterrane-parelcouscoussalade-met-gegrilde-courgette-papri",
    "tags": [
      "Vegetarisch",
      "Halal"
    ],
    "title": "Mediterrane parelcouscoussalade met gegrilde courgette, paprika, witte bonen en basilicum",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "lunch",
    "prepTime": 10,
    "subtitle": "Een kleurrijke maaltijdsalade waarin gegrilde groenten, romige witte bonen en frisse citroen samenkomen in een zomers geheel.",
    "nutrition": {
      "fat": 25,
      "carbs": 76,
      "fiber": 16,
      "protein": 25,
      "calories": 655,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "volkoren parelcouscous",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "witte bonen (uitgelekt)",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "courgette",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rode paprika",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "cherrytomaten",
            "unit": "",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "rucola",
            "unit": "g",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "Parmezaanse kaas",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "verse basilicum",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "extra vierge olijfolie",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sap van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "Dijonmosterd",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "klein teentje knoflook",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Dressing"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de parelcouscous volgens de verpakking en laat afkoelen.",
      "Grill de courgette en paprika.",
      "Meng alle ingrediënten voor de dressing.",
      "Meng parelcouscous, groenten, witte bonen en dressing.",
      "Voeg vlak voor het serveren de rucola, basilicum en Parmezaanse kaas toe."
    ]
  },
  {
    "id": "moqueca",
    "tags": [
      "Lactosevrij"
    ],
    "title": "Moqueca",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 35,
    "subtitle": "Een kleurrijke Braziliaanse visstoof met zachte witvis en garnalen, drie kleuren paprika, tomaat en ui in een volle kokossaus met limoen, kurkuma en koriander",
    "nutrition": {
      "fat": 19,
      "carbs": 74,
      "fiber": 10,
      "protein": 52,
      "calories": 700,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "pangasiusfilet, koolvis of kabeljauw",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "rauwe gepelde garnalen",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "limoensap",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "snuf zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Vis en garnalen"
      },
      {
        "items": [
          {
            "name": "groene paprika, in dunne ringen",
            "unit": "",
            "quantity": 0.33,
            "scalable": true
          },
          {
            "name": "rode paprika, in dunne ringen",
            "unit": "",
            "quantity": 0.33,
            "scalable": true
          },
          {
            "name": "gele paprika, in dunne ringen",
            "unit": "",
            "quantity": 0.33,
            "scalable": true
          },
          {
            "name": "middelgrote tomaat, in plakjes",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "middelgrote ui, in dunne ringen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "extra vierge olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "kurkuma",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "sojasaus met minder zout",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "lichte kokosmelk",
            "unit": "ml",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "rode chilipeper, fijngehakt",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "limoensap",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "verse koriander, grof gehakt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "snuf zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Moqueca"
      },
      {
        "items": [
          {
            "name": "volkoren basmatirijst of zilvervliesrijst, ongekookt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Rijst"
      }
    ],
    "suitableFor": [
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de volkorenrijst volgens de verpakking en laat na het afgieten kort uitstomen.",
      "Dep de vis droog, snijd in grote stukken en meng met limoensap, peper en een klein snufje zout. Dep ook de garnalen droog.",
      "Verhit de olijfolie in een brede pan. Voeg ui, paprika en chili toe en bak 3–4 minuten. Voeg vervolgens tomaat, kurkuma en zwarte peper toe.",
      "Voeg de kokosmelk en sojasaus toe. Laat zonder deksel 5–7 minuten zacht sudderen, zodat de groenten vocht verliezen en de saus vanzelf iets indikt.",
      "Leg de stukken vis voorzichtig in de saus. Schep wat saus erover en laat met het deksel schuin op de pan ongeveer 4–5 minuten zacht garen.",
      "Verdeel de garnalen tussen de vis en laat nog 3–4 minuten garen, totdat ze net roze en stevig zijn. Roer zo weinig mogelijk.",
      "Voeg limoensap en koriander toe. Proef en voeg eventueel nog peper, chili of een klein beetje zout toe.",
      "Is de saus toch nog te dun, meng dan ½ tl maïzena met 1 tl koud water. Roer een klein beetje hiervan door de saus en laat maximaal 1 minuut zacht koken.",
      "Serveer de moqueca direct met de volkorenrijst en eventueel een extra partje limoen."
    ]
  },
  {
    "id": "negroni",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Negroni",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "subtitle": "Bitter, kruidig en citrusachtig met een volwassen, aperitiefachtige smaak.",
    "nutrition": {
      "fat": 0,
      "carbs": 14,
      "fiber": 0,
      "protein": 0,
      "calories": 70,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "alcoholvrije rode bitter",
            "unit": "ml",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "alcoholvrije vermout of alcoholvrije aperitiefbasis",
            "unit": "ml",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "bruiswater of tonic zero",
            "unit": "ml",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "vers sinaasappelsap",
            "unit": "ml",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "sinaasappelschil",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Vul een tumblerglas met ijsblokjes of één grote ijsblok.",
      "Schenk de alcoholvrije rode bitter, alcoholvrije vermout en het sinaasappelsap in het glas.",
      "Roer 20–30 seconden, zodat de cocktail goed koud wordt.",
      "Vul af met bruiswater of tonic zero.",
      "Roer nog één keer kort door.",
      "Knijp de sinaasappelschil boven het glas uit, zodat de oliën vrijkomen.",
      "Garneer met de sinaasappelschil en serveer direct.",
      "Alcoholversie: gebruik 30 ml gin, 30 ml Campari en 30 ml rode vermout. Roer met ijs en garneer met sinaasappelschil. Laat het bruiswater en sinaasappelsap weg voor een klassieke Negroni."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "old-fashioned",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Old Fashioned",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "subtitle": "Kruidig, bitterzoet en verwarmend met sinaasappel en specerijen.",
    "nutrition": {
      "fat": 0,
      "carbs": 10,
      "fiber": 0,
      "protein": 0,
      "calories": 45,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sterke zwarte thee, afgekoeld",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "alcoholvrije whiskey of alcoholvrije rum",
            "unit": "ml",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "ahornsiroop",
            "unit": "ml",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "druppels alcoholvrije bitters",
            "unit": "",
            "quantity": 3,
            "scalable": true
          },
          {
            "name": "sinaasappelschil",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "IJsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Doe de afgekoelde zwarte thee, alcoholvrije whiskey of rum, ahornsiroop en bitters in een mengglas.",
      "Voeg ijsblokjes toe.",
      "Roer 20–30 seconden, tot de cocktail goed koud is.",
      "Zeef in een tumblerglas met een grote ijsblok.",
      "Knijp de sinaasappelschil kort boven het glas uit, zodat de oliën vrijkomen.",
      "Garneer met de sinaasappelschil.",
      "Serveer direct.",
      "Voor de alcoholversie: vervang de zwarte thee en alcoholvrije whiskey door 60 ml bourbon of rye whiskey. Gebruik 5–10 ml ahornsiroop of suikersiroop en voeg 2–3 dashes Angostura bitters toe."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "overnight-oats",
    "tags": [
      "Vegetarisch",
      "Halal"
    ],
    "title": "Overnight oats",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "ontbijt",
    "prepTime": 5,
    "subtitle": "Een romig ontbijt dat je de avond ervoor voorbereidt, met zoete abrikoos, frisse sinaasappel en knapperige amandelen.",
    "nutrition": {
      "fat": 19,
      "carbs": 61,
      "fiber": 12,
      "protein": 28,
      "calories": 560,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "havermout",
            "unit": "g",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "halfvolle melk",
            "unit": "ml",
            "quantity": 200,
            "scalable": true
          },
          {
            "name": "magere kwark",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "chiazaad",
            "unit": "g",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "kaneel",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "vanille-extract",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "verse abrikozen",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "sinaasappel(en)",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "ongezouten amandelen",
            "unit": "g",
            "quantity": 15,
            "scalable": true
          }
        ],
        "category": "Toppings"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Meng havermout, melk, kwark, chiazaad, kaneel en vanille in een afsluitbare pot.",
      "Zet minimaal een nacht in de koelkast.",
      "Voeg vlak voor het eten de abrikozen, sinaasappel en amandelen toe."
    ]
  },
  {
    "id": "pad-krapow-gai-met-sperziebonen-en-zilvervliesrijst",
    "tags": [],
    "title": "Phat Kaphrao Kai",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 30,
    "subtitle": "Een moderne, lichte versie van de Thaise klassieker met kruidige kip, royale hoeveelheden knapperige groenten en geurige basilicum in een krachtige umamisaus.",
    "nutrition": {
      "fat": 18,
      "carbs": 78,
      "fiber": 13,
      "protein": 53,
      "calories": 725,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "mager kipgehakt",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "zilvervliesrijst, ongekookt",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "sperziebonen",
            "unit": "g",
            "quantity": 200,
            "scalable": true
          },
          {
            "name": "rode paprika",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "kleine sjalot",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "tenen knoflook",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "rode chilipeper",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "(Thaise heilige) basilicum",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "neutrale olie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "oestersaus",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "sojasaus met minder zout",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "vissaus",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "donkere sojasaus",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "palmsuiker of gewone suiker",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "water",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Saus"
      },
      {
        "items": [
          {
            "name": "gebakken ei",
            "unit": "",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Extra"
      }
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de zilvervliesrijst volgens de verpakking. Snijd de sperziebonen in stukken en blancheer ze 3 minuten; giet af.",
      "Meng alle ingrediënten voor de saus. Snijd de paprika in reepjes en de sjalot in dunne partjes. Stamp of hak de knoflook en chili samen grof.",
      "Verhit de olie in een wok of ruime koekenpan op hoog vuur. Bak het knoflook-chilimengsel ongeveer 20 seconden, zonder het te laten verbranden.",
      "Voeg de kip toe en roerbak deze in 3–4 minuten rul, goudbruin en vrijwel gaar.",
      "Voeg de sjalot, paprika en sperziebonen toe. Roerbak nog 3–4 minuten, zodat de groenten gaar maar knapperig blijven.",
      "Schenk de saus erbij en roerbak kort op hoog vuur, totdat het vocht grotendeels is verdampt en de saus aan de kip en groenten kleeft.",
      "Zet het vuur uit en schep de basilicum erdoor. Laat de blaadjes alleen kort slinken.",
      "Serveer direct met de zilvervliesrijst en eventueel een krokant gebakken ei."
    ]
  },
  {
    "id": "panzanella-met-witte-bonen-gegrilde-groenten-en-basilicum",
    "tags": [
      "Vegan",
      "Halal"
    ],
    "title": "Panzanella met witte bonen, gegrilde groenten en basilicum",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "lunch",
    "prepTime": 20,
    "subtitle": "Een Toscaanse broodsalade waarin knapperige groenten, witte bonen en geroosterd zuurdesembrood zorgen voor een heerlijke combinatie van fris en hartig.",
    "nutrition": {
      "fat": 24,
      "carbs": 67,
      "fiber": 15,
      "protein": 22,
      "calories": 610,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sneetjes volkoren (zuurdesem)brood",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "witte bonen, uitgelekt",
            "unit": "g",
            "quantity": 125,
            "scalable": true
          },
          {
            "name": "cherrytomaten",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "komkommer",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rode paprika",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rode ui",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "verse basilicum",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "rucola",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "extra vierge olijfolie",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "rodewijnazijn",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "klein teentje knoflook",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Dressing"
      }
    ],
    "suitableFor": [
      "vegan",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Rooster het brood in blokjes goudbruin.",
      "Snijd alle groenten in hapklare stukken.",
      "Meng de ingrediënten voor de dressing.",
      "Meng brood, groenten, witte bonen en dressing.",
      "Laat de salade 10 minuten staan zodat het brood de smaken opneemt.",
      "Garneer met basilicum en rucola."
    ]
  },
  {
    "id": "passion-fruit-spritz",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Pornstar Martini",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "nutrition": {
      "fat": 0,
      "carbs": 24,
      "fiber": 0,
      "protein": 1,
      "calories": 105,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "passievruchtsap",
            "unit": "ml",
            "quantity": 80,
            "scalable": true
          },
          {
            "name": "vanille-extract",
            "unit": "ml",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 160,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Schenk het passievruchtsap in een glas.",
      "Voeg het alcoholvrije vanille-extract of de vanillesiroop toe.",
      "Vul het glas met ijsblokjes.",
      "Vul af met bruiswater.",
      "Roer kort door en serveer direct.",
      "Alcoholversie: Voeg 40 ml vanillevodka en 20 ml Passoã toe. Gebruik dan 5–10 ml vanillesiroop in plaats van 10 ml alcoholvrij vanille-extract."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "pasta-al-limone-met-zalm-doperwten-en-spinazie",
    "tags": [],
    "title": "Pasta al Limone",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 30,
    "subtitle": "Een frisse citroenpasta waarin romige Parmezaanse kaas, zalm en lentegroenten samen zorgen voor een lichte maar rijke maaltijd.",
    "nutrition": {
      "fat": 31,
      "carbs": 63,
      "fiber": 12,
      "protein": 46,
      "calories": 740,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "volkoren spaghetti",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "zalmfilet",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "doperwten",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "verse spinazie",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "kleine sjalot",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "teen knoflook",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "rasp en sap van citroen",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "Parmezaanse kaas",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "extra vierge olijfolie",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "verse basilicum",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de spaghetti beetgaar en bewaar een kopje kookvocht.",
      "Bak de zalm goudbruin en gaar.",
      "Fruit sjalot en knoflook.",
      "Voeg de doperwten en spinazie toe en laat de spinazie slinken.",
      "Meng de pasta met de groenten, citroenrasp, citroensap, Parmezaanse kaas en een beetje kookvocht tot een romige saus.",
      "Verdeel de zalm in grove stukken en schep voorzichtig door de pasta.",
      "Garneer met basilicum en zwarte peper."
    ]
  },
  {
    "id": "perzische-saffraan-citroen-kip-met-volkoren-bulgur-en-komkom",
    "tags": [
      "Halal"
    ],
    "title": "Perzische saffraan-citroen kip met volkoren bulgur en komkommer-kruidensalade",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 30,
    "subtitle": "Malse kip gemarineerd met saffraan en citroen, geserveerd met nootachtige bulgur en een frisse kruidensalade vol zomerse smaken.",
    "nutrition": {
      "fat": 18,
      "carbs": 63,
      "fiber": 11,
      "protein": 49,
      "calories": 715,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "kipfilet",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "sap van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "teen knoflook",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "snufje saffraan, opgelost in 1 el warm water",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "kurkuma",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Kip"
      },
      {
        "items": [
          {
            "name": "volkoren bulgur",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          }
        ],
        "category": "Bulgur"
      },
      {
        "items": [
          {
            "name": "komkommer",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "cherrytomaten",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "rode ui",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "platte peterselie",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "verse munt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Salade"
      },
      {
        "items": [
          {
            "name": "extra vierge olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sap van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Dressing"
      }
    ],
    "suitableFor": [
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Marineer de kip minimaal 30 minuten in citroen, saffraan, knoflook en kruiden.",
      "Kook de bulgur volgens de verpakking.",
      "Meng alle ingrediënten voor de salade en dressing.",
      "Grill of bak de kip goudbruin en gaar.",
      "Serveer de kip met de bulgur en de kruidensalade."
    ]
  },
  {
    "id": "pizza-margherita",
    "tags": [
      "Vegetarisch"
    ],
    "title": "Pizza Margherita",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 120,
    "subtitle": "Een gezondere interpretatie van de klassieke Pizza Margherita, met een luchtig gerezen volkorenbodem, pure tomatensaus, goed uitgelekte mozzarella, verse basilicum en extra vierge olijfolie.",
    "nutrition": {
      "fat": 20,
      "carbs": 87,
      "fiber": 12,
      "protein": 39,
      "calories": 700,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "magere cottage cheese",
            "unit": "g",
            "quantity": 65,
            "scalable": true
          },
          {
            "name": "volkoren tarwemeel",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "sterke tarwebloem of pizzabloem",
            "unit": "g",
            "quantity": 25,
            "scalable": true
          },
          {
            "name": "droge gist",
            "unit": "g",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "zout",
            "unit": "g",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "lauwwarm water",
            "unit": "ml",
            "quantity": 25,
            "scalable": true
          }
        ],
        "category": "Bodem"
      },
      {
        "items": [
          {
            "name": "gepelde tomaten uit blik, bij voorkeur San Marzano",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "verse mozzarella of fior di latte",
            "unit": "g",
            "quantity": 70,
            "scalable": true
          },
          {
            "name": "blaadjes verse basilicum",
            "unit": "",
            "quantity": 7,
            "scalable": true
          },
          {
            "name": "extra vierge olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "snuf zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Toppings"
      }
    ],
    "suitableFor": [
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Blend de cottage cheese volledig glad. Meng het volkorenmeel, de sterke bloem en de gist. Voeg de cottage cheese en 25 ml lauwwarm water toe en meng tot een deeg.",
      "Kneed 8–10 minuten met de hand. Voeg na enkele minuten het zout toe. Voeg alleen extra water toe wanneer het deeg droog blijft. Het eindresultaat moet zacht, soepel en licht kleverig zijn.",
      "Vorm een bol en leg deze in een licht afgedekte kom. Laat 1½–2 uur op kamertemperatuur rijzen, totdat het deeg duidelijk luchtiger is geworden.",
      "Plaats een pizzasteen, pizzastaal of omgekeerde metalen bakplaat in de oven. Verwarm minimaal 30–45 minuten voor op de hoogste stand, bij voorkeur 250 °C boven- en onderwarmte.",
      "Scheur de mozzarella in kleine stukken en laat deze tussen keukenpapier goed uitlekken. Prak de tomaten tot een grove saus, giet overtollig vocht af en voeg alleen een klein snufje zout toe.",
      "Bestuif het werkblad licht met meel of semola. Druk het deeg met je vingertoppen vanuit het midden naar buiten tot een pizza van ongeveer 25–27 centimeter. Laat rondom een iets dikkere rand staan en gebruik geen deegroller.",
      "Verdeel een dunne laag tomatensaus over de bodem en laat de rand vrij. Verdeel de uitgelekte mozzarella gelijkmatig over de saus. Besprenkel met ongeveer de helft van de olijfolie.",
      "Schuif de pizza direct op de hete steen, het staal of de bakplaat. Bak bij 250 °C ongeveer 8–11 minuten, totdat de rand goudbruin is, de bodem stevig is en de mozzarella lichte bruine plekjes heeft.",
      "Verdeel direct na het bakken de basilicumblaadjes over de pizza en besprenkel met de resterende olijfolie. Serveer meteen.",
      "Voor een nog betere korst:\n\nMaak het deeg een dag van tevoren met 1 gram droge gist. Laat het eerst 30 minuten op kamertemperatuur staan en vervolgens 12–24 uur afgedekt in de koelkast rijzen. Haal het deeg ongeveer 60 minuten voor het bakken uit de koelkast. Deze langzame fermentatie geeft meer smaak en maakt het deeg doorgaans beter verteerbaar."
    ]
  },
  {
    "id": "salade-nicoise-met-krieltjes-sperziebonen-ei-en-tonijn",
    "tags": [
      "Halal"
    ],
    "title": "Salade Niçoise",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "lunch",
    "prepTime": 25,
    "subtitle": "Een klassieke Franse maaltijdsalade met verse groenten, aardappelen, tonijn en ei: licht, voedzaam en perfect als lunch.",
    "nutrition": {
      "fat": 32,
      "carbs": 42,
      "fiber": 9,
      "protein": 44,
      "calories": 655,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "krieltjes",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "sperziebonen",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "tonijn uit blik op water, uitgelekt",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "eieren",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "cherrytomaten",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "komkommer",
            "unit": "g",
            "quantity": 50,
            "scalable": true
          },
          {
            "name": "gemende sla",
            "unit": "g",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "zwarte olijven",
            "unit": "",
            "quantity": 6,
            "scalable": true
          },
          {
            "name": "verse peterselie",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "extra vierge olijfolie",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "Dijonmosterd",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sap van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Dressing"
      }
    ],
    "suitableFor": [
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de krieltjes en sperziebonen beetgaar en laat afkoelen.",
      "Kook de eieren 8 minuten en halveer ze.",
      "Meng alle ingrediënten voor de dressing.",
      "Verdeel de sla, groenten, krieltjes, tonijn en eieren over een schaal.",
      "Besprenkel met de dressing en garneer met peterselie."
    ]
  },
  {
    "id": "skyr-met-aardbeien-en-pistachenoten",
    "tags": [
      "Vegan",
      "Halal",
      "Glutenvrij"
    ],
    "title": "Skyr met aardbeien en pistachenoten",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "tussendoortje",
    "prepTime": 5,
    "subtitle": "Een eiwitrijke snack met fris zomerfruit en knapperige pistachenoten voor een langdurig verzadigd gevoel.",
    "nutrition": {
      "fat": 11,
      "carbs": 22,
      "fiber": 5,
      "protein": 30,
      "calories": 300,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "naturel skyr",
            "unit": "g",
            "quantity": 250,
            "scalable": true
          },
          {
            "name": "aardbeien",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "ongezouten pistachenoten",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegan",
      "halal",
      "glutenvrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Schep de skyr in een kom.",
      "Voeg de aardbeien toe.",
      "Bestrooi met de pistachenoten."
    ]
  },
  {
    "id": "souvlaki-bowl",
    "tags": [],
    "title": "Souvlaki",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 30,
    "subtitle": "Een kleurrijke bowl met sappige kipsouvlaki, romige huisgemaakte tzatziki en een knapperige salade.",
    "nutrition": {
      "fat": 22,
      "carbs": 67,
      "fiber": 13,
      "protein": 54,
      "calories": 710,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "kipfilet",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "kleine teen knoflook, fijn geraspt",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "gedroogde oregano",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "mild paprikapoeder",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "gedroogde rozemarijn, fijngewreven",
            "unit": "tl",
            "quantity": 0.125,
            "scalable": true
          },
          {
            "name": "citroensap",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "extra vierge olijfolie",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "droge witte wijn",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "klein laurierblaadje(s)",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Kipsouvlaki"
      },
      {
        "items": [
          {
            "name": "volkoren bulgur, ongekookt",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "cherrytomaten",
            "unit": "g",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "komkommer",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rode ui",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "handje platte peterselie",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Bowl"
      },
      {
        "items": [
          {
            "name": "magere kwark",
            "unit": "g",
            "quantity": 125,
            "scalable": true
          },
          {
            "name": "komkommer",
            "unit": "g",
            "quantity": 60,
            "scalable": true
          },
          {
            "name": "klein teentje knoflook, fijn geraspt",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "gedroogde dille",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "fijngehakte verse munt",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "citroensap of wittewijnazijn",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "extra vierge olijfolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Tzatziki"
      }
    ],
    "baseServings": 1,
    "instructions": [
      "Snijd de kip in gelijkmatige blokjes. Meng knoflook, oregano, paprikapoeder, rozemarijn, zout, peper, citroensap, olijfolie en witte wijn tot een marinade. Voeg het gekneusde laurierblaadje en de kip toe en marineer minimaal 30 minuten in de koelkast.",
      "Laat houten spiesen, indien gebruikt, minimaal 20 minuten in water weken.",
      "Rasp voor de tzatziki de komkommer grof, meng met een klein snufje zout en laat 10–15 minuten uitlekken in een zeef. Knijp de komkommer daarna zeer goed droog in een schone doek of keukenpapier.",
      "Meng de droge komkommer met magere kwark, knoflook, dille, munt, citroensap of wittewijnazijn en olijfolie. Breng op smaak met peper en een klein snufje zout en zet koel weg.",
      "Kook de bulgur volgens de aanwijzingen op de verpakking en laat kort uitstomen.",
      "Halveer de cherrytomaten en snijd de komkommer en rode ui. Meng met de peterselie en wat zwarte peper.",
      "Verwijder het laurierblaadje, rijg de kip aan de spiesen en grill deze in 8–10 minuten goudbruin en gaar. Keer regelmatig en laat daarna 2 minuten rusten.",
      "Verdeel de bulgur over een kom en serveer met de salade, kipsouvlaki en tzatziki."
    ]
  },
  {
    "id": "tequila-sunrise",
    "tags": [
      "Vegetarisch",
      "Lactosevrij",
      "Glutenvrij"
    ],
    "title": "Tequila Sunrise",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "subtitle": "Fruitig, fris en licht zoet met sinaasappel en granaatappel.",
    "nutrition": {
      "fat": 0,
      "carbs": 28,
      "fiber": 1,
      "protein": 1,
      "calories": 120,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "vers sinaasappelsap",
            "unit": "ml",
            "quantity": 150,
            "scalable": true
          },
          {
            "name": "limoensap",
            "unit": "ml",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "bruiswater of tonic zero",
            "unit": "ml",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "grenadine of granaatappelsiroop",
            "unit": "ml",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "sinaasappelschijfje, voor garnering",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "cocktailkers, voor garnering",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "lactosevrij",
      "glutenvrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Vul een hoog glas met ijsblokjes.",
      "Schenk het sinaasappelsap en limoensap in het glas.",
      "Vul af met bruiswater of tonic zero.",
      "Roer kort door.",
      "Schenk de grenadine of granaatappelsiroop langzaam langs de binnenkant van het glas.",
      "Laat de siroop naar de bodem zakken, zodat het sunrise-effect ontstaat.",
      "Garneer eventueel met een sinaasappelschijfje en cocktailkers.",
      "Serveer direct.",
      "Voor de alcohol-versie: voeg 50 ml tequila toe. Gebruik dan 120 ml sinaasappelsap en 60–80 ml bruiswater of laat het bruiswater weg voor een klassiekere versie."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "tostada-met-zwartebonencreme-mango-en-tomaat",
    "tags": [
      "Vegetarisch",
      "Lactosevrij"
    ],
    "title": "Tostada met zwartebonencrème, mango en tomaat",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 20,
    "subtitle": "Knapperig, romig, fris, zoetzuur, hartig en licht pittig",
    "nutrition": {
      "fat": 4,
      "carbs": 22,
      "fiber": 5,
      "protein": 5,
      "calories": 135,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "volkoren wrap",
            "unit": "g",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "olijfolie of oliespray",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Tostada"
      },
      {
        "items": [
          {
            "name": "zwarte bonen zonder toegevoegd zout, uitgelekt",
            "unit": "g",
            "quantity": 45,
            "scalable": true
          },
          {
            "name": "avocado",
            "unit": "g",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "limoensap",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "gemalen komijn",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "gerookt paprikapoeder",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zwarte peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "zout",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Zwartebonencrème"
      },
      {
        "items": [
          {
            "name": "mango, in zeer kleine blokjes",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "tomaat, in kleine blokjes",
            "unit": "g",
            "quantity": 25,
            "scalable": true
          },
          {
            "name": "rode ui, zeer fijn gesneden",
            "unit": "g",
            "quantity": 5,
            "scalable": true
          },
          {
            "name": "verse koriander, fijngehakt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "klein beetje verse rode chili",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "blaadjes rucola of waterkers",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Mango-tomaattopping"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "lactosevrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Snijd de volkoren wrap in een kleine cirkel of in twee driehoekjes.",
      "Bestrijk hem flinterdun met olijfolie.",
      "Rooster de wrap op de BBQ of in de oven gedurende 4–6 minuten op 190–200°C.",
      "Laat de tostada volledig afkoelen. Hierdoor wordt hij extra knapperig.",
      "Prak de zwarte bonen met de avocado, het limoensap, de komijn, het gerookte paprikapoeder en zwarte peper.",
      "Meng de mango met de tomaat, rode ui, koriander en chili.",
      "Bestrijk de tostada vlak voor het serveren met de zwartebonencrème.",
      "Verdeel de mango-tomaattopping erover.",
      "Werk af met enkele blaadjes rucola of waterkers."
    ],
    "overigCategory": "Voorgerechten"
  },
  {
    "id": "tropicana",
    "tags": [
      "Vegetarisch",
      "Lactosevrij",
      "Glutenvrij"
    ],
    "title": "Tropicana",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 10,
    "nutrition": {
      "fat": 0,
      "carbs": 9,
      "fiber": 0,
      "protein": 0,
      "calories": 35,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "100% ananassap",
            "unit": "ml",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "sinaasappelsap",
            "unit": "ml",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "vers limoensap",
            "unit": "ml",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "klein stukje verse gember",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "blaadjes verse munt",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "limoenpartje",
            "unit": "",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "lactosevrij",
      "glutenvrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Rasp of kneus een klein stukje verse gember.",
      "Meng het ananassap, sinaasappelsap en limoensap.",
      "Voeg een kleine hoeveelheid gember toe en roer door.",
      "Vul een klein glas met ijsblokjes.",
      "Schenk het sapmengsel in het glas.",
      "Vul aan met bruiswater.",
      "Garneer met munt en een klein partje limoen."
    ],
    "overigCategory": "Voorgerechten"
  },
  {
    "id": "tropische-mango-ananas-limoensorbet",
    "tags": [
      "Vegetarisch",
      "Vegan",
      "Lactosevrij",
      "Glutenvrij"
    ],
    "title": "Tropische mango-ananas-limoensorbet",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 20,
    "subtitle": "Tropisch, friszuur, zachtzoet, licht pittig en geroosterd",
    "nutrition": {
      "fat": 2,
      "carbs": 29,
      "fiber": 3,
      "protein": 1,
      "calories": 130,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "rijpe mango, in blokjes en volledig bevroren",
            "unit": "g",
            "quantity": 70,
            "scalable": true
          },
          {
            "name": "rijpe ananas, in blokjes en volledig bevroren",
            "unit": "g",
            "quantity": 50,
            "scalable": true
          },
          {
            "name": "vers limoensap",
            "unit": "tl",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "fijn geraspte verse gember",
            "unit": "tl",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "ijskoud water of sinaasappelsap",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "fijne limoenrasp",
            "unit": "",
            "quantity": 0.125,
            "scalable": true
          }
        ],
        "category": "Sorbet"
      },
      {
        "items": [
          {
            "name": "verse ananas",
            "unit": "g",
            "quantity": 20,
            "scalable": true
          },
          {
            "name": "snuf kaneel",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "enkele druppels limoensap",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Gegrilde ananas"
      },
      {
        "items": [
          {
            "name": "ongezoete kokosvlokken of kokosrasp",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "blaadje verse munt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "fijne limoenrasp",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Afwerking"
      }
    ],
    "suitableFor": [
      "vegetarisch",
      "vegan",
      "lactosevrij",
      "glutenvrij"
    ],
    "baseServings": 1,
    "instructions": [
      "Haal de bevroren mango en ananas ongeveer 3–5 minuten voor het blenden uit de vriezer.",
      "Doe het fruit met het limoensap, de gember en limoenrasp in een krachtige blender.",
      "Voeg eerst één eetlepel ijskoud water of sinaasappelsap toe.",
      "Gebruik de pulseerstand en stop regelmatig om het fruit met een spatel naar beneden te duwen.",
      "Voeg alleen extra vocht toe wanneer de messen niet goed kunnen draaien.",
      "Mix tot een gladde, dikke sorbet met de structuur van stevig softijs.",
      "Schep de sorbet in een ondiepe koude bak.",
      "Zet hem 15–30 minuten terug in de vriezer wanneer een stevigere structuur gewenst is.",
      "Snijd de verse ananas in een klein plakje of een smalle reep.",
      "Bestrooi met een heel klein beetje kaneel.",
      "Grill kort op hoge hitte totdat duidelijke grillstrepen ontstaan en laat iets afkoelen.",
      "Snijd de ananas in een zeer fijne brunoise of laat hem als klein gegrild partje heel.",
      "Besprenkel met enkele druppels limoensap.",
      "Rooster de kokosvlokken kort in een droge koekenpan of op een grillplaat.",
      "Koel kleine glazen, coupes of dessertbordjes vooraf in de koelkast.",
      "Leg een kleine lepel gegrilde ananas op de bodem of iets uit het midden van het bord.",
      "Strooi de geroosterde kokos alleen aan één zijde van de sorbet.",
      "Werk af met zeer fijne limoenrasp en één klein muntblaadje."
    ],
    "overigCategory": "Desserts & gebak"
  },
  {
    "id": "turkse-k-s-r-met-kikkererwten-granaatappel-en-veel-peterseli",
    "tags": [
      "Vegan",
      "Halal"
    ],
    "title": "Kısır",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "lunch",
    "prepTime": 25,
    "subtitle": "Een frisse bulgursalade boordevol kruiden, groenten en peulvruchten die na een nacht in de koelkast nóg lekkerder wordt.",
    "nutrition": {
      "fat": 22,
      "carbs": 84,
      "fiber": 18,
      "protein": 21,
      "calories": 670,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "fijne bulgur (ongekookt)",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "kikkererwten",
            "unit": "g",
            "quantity": 100,
            "scalable": true
          },
          {
            "name": "tomaat",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "komkommer",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "rode puntpaprika",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "rode ui",
            "unit": "",
            "quantity": 0.25,
            "scalable": true
          },
          {
            "name": "granaatappelpitten",
            "unit": "el",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "flinke hand platte peterselie",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "kleine hand verse munt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "extra vierge olijfolie",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sap van citroen",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "tomatenpuree",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "komijn",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "pul biber",
            "unit": "tl",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "peper",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Dressing"
      }
    ],
    "suitableFor": [
      "vegan",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de bulgur volgens de verpakking en laat afkoelen.",
      "Meng de ingrediënten voor de dressing.",
      "Meng de bulgur met de dressing.",
      "Voeg groenten, kikkererwten en kruiden toe.",
      "Garneer met granaatappelpitten."
    ]
  },
  {
    "id": "vietnamese-noedelsalade-met-kip-wortel-komkommer-munt-korian",
    "tags": [
      "Halal"
    ],
    "title": "Vietnamese noedelsalade met kip, wortel, komkommer, munt, koriander en limoen",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "lunch",
    "prepTime": 25,
    "subtitle": "Een lichte en frisse maaltijdsalade waarin knapperige groenten, geurige kruiden en sappige kip samenkomen in een pittig-frisse limoen dressing.",
    "nutrition": {
      "fat": 18,
      "carbs": 70,
      "fiber": 10,
      "protein": 38,
      "calories": 645,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "volkoren rijstnoedels",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "kipfilet",
            "unit": "g",
            "quantity": 125,
            "scalable": true
          },
          {
            "name": "wortel, julienne",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "komkommer, in dunne reepjes",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "taugé",
            "unit": "g",
            "quantity": 75,
            "scalable": true
          },
          {
            "name": "rode paprika",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "bosui",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "verse munt",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          },
          {
            "name": "verse koriander",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      },
      {
        "items": [
          {
            "name": "sap van limoen",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sojasaus met minder zout",
            "unit": "el",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "vissaus",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "sesamolie",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "honing",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "teen knoflook, geraspt",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "geraspte gember",
            "unit": "tl",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Dressing"
      }
    ],
    "suitableFor": [
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Kook de rijstnoedels volgens de verpakking en spoel koud af.",
      "Grill of bak de kipfilet en snijd in dunne plakjes.",
      "Meng alle ingrediënten voor de dressing.",
      "Meng de noedels met de groenten en dressing.",
      "Verdeel de kip erover en garneer met munt, koriander en bosui."
    ]
  },
  {
    "id": "virgin-caipirinha",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Caipirinha",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "nutrition": {
      "fat": 0,
      "carbs": 18,
      "fiber": 0,
      "protein": 0,
      "calories": 75,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "limoen, in partjes",
            "unit": "",
            "quantity": 1,
            "scalable": true
          },
          {
            "name": "agavesiroop",
            "unit": "ml",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 200,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Doe de limoenpartjes in een glas.",
      "Voeg de agavesiroop toe.",
      "Kneus de limoen voorzichtig, zodat sap en aroma vrijkomen.",
      "Vul het glas met ijsblokjes.",
      "Vul af met bruiswater.",
      "Roer kort door en serveer direct.",
      "Alcoholversie: Voeg 60 ml cachaça toe. Verlaag het bruiswater naar 0–50 ml, afhankelijk van hoe klassiek of licht je de cocktail wilt maken."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "virgin-mojito",
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Vegetarisch"
    ],
    "title": "Mojito",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "diner",
    "prepTime": 5,
    "nutrition": {
      "fat": 0,
      "carbs": 16,
      "fiber": 0,
      "protein": 0,
      "calories": 65,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "limoen, in partjes",
            "unit": "",
            "quantity": 0.5,
            "scalable": true
          },
          {
            "name": "verse muntblaadjes",
            "unit": "",
            "quantity": 10,
            "scalable": true
          },
          {
            "name": "agavesiroop",
            "unit": "ml",
            "quantity": 15,
            "scalable": true
          },
          {
            "name": "bruiswater",
            "unit": "ml",
            "quantity": 200,
            "scalable": true
          },
          {
            "name": "ijsblokjes",
            "unit": "",
            "quantity": "naar smaak",
            "scalable": false
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "vegetarisch"
    ],
    "baseServings": 1,
    "instructions": [
      "Doe de limoenpartjes en muntblaadjes in een glas.",
      "Kneus de limoen en munt voorzichtig, zodat de aroma’s vrijkomen.",
      "Voeg de agavesiroop toe.",
      "Vul het glas met ijsblokjes.",
      "Vul af met bruiswater.",
      "Roer kort door en serveer direct.",
      "Alcoholversie: Voeg 50 ml witte rum toe en verlaag het bruiswater naar 100–150 ml."
    ],
    "overigCategory": "Dranken & cocktails"
  },
  {
    "id": "volkorenbrood-met-100-pindakaas-en-banaan",
    "tags": [
      "Vegan",
      "Halal"
    ],
    "title": "Volkorenbrood met 100% pindakaas en banaan",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "tussendoortje",
    "prepTime": 5,
    "subtitle": "Een klassieke combinatie die zorgt voor langdurige energie dankzij volkoren granen, gezonde vetten en fruit.",
    "nutrition": {
      "fat": 18,
      "carbs": 52,
      "fiber": 9,
      "protein": 15,
      "calories": 425,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sneetjes volkorenbrood",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "100% pindakaas",
            "unit": "g",
            "quantity": 30,
            "scalable": true
          },
          {
            "name": "middelgrote banaan",
            "unit": "",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegan",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Besmeer het brood met de pindakaas.",
      "Snijd de banaan in plakjes en verdeel over het brood of eet deze ernaast."
    ]
  },
  {
    "id": "volkorenbrood-met-hummus-en-appel",
    "tags": [
      "Vegan",
      "Halal"
    ],
    "title": "Volkorenbrood met hummus en appel",
    "status": "gepubliceerd",
    "seasons": [
      "lente-zomer"
    ],
    "cookTime": 0,
    "mealType": "tussendoortje",
    "prepTime": 5,
    "subtitle": "Een eenvoudige, vezelrijke snack waarin volkoren granen, peulvruchten en fruit samen zorgen voor langdurige energie.",
    "nutrition": {
      "fat": 9,
      "carbs": 56,
      "fiber": 11,
      "protein": 11,
      "calories": 355,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "items": [
          {
            "name": "sneetjes volkorenbrood",
            "unit": "",
            "quantity": 2,
            "scalable": true
          },
          {
            "name": "hummus",
            "unit": "g",
            "quantity": 40,
            "scalable": true
          },
          {
            "name": "middelgrote appel",
            "unit": "",
            "quantity": 1,
            "scalable": true
          }
        ],
        "category": "Basis"
      }
    ],
    "suitableFor": [
      "vegan",
      "halal"
    ],
    "baseServings": 1,
    "instructions": [
      "Besmeer het brood royaal met hummus.",
      "Serveer met de appel."
    ]
  },
  {
    "id": "kabeljauw-pastinaakcreme-spruitjes-hazelnoot-citroen-dille",
    "title": "Kabeljauw met pastinaakcrème, geblakerde spruitjes, hazelnoot & citroen-dille",
    "status": "gepubliceerd",
    "subtitle": "Zachte pastinaakcrème, sappige kabeljauw en donker geroosterde spruitjes met citroen, dille, kappertjes en krokante hazelnoten.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 25,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Glutenvrij",
      "Halal",
      "Eiwitrijk",
      "Vezelrijk",
      "Restaurantwaardig",
      "Gezond"
    ],
    "suitableFor": [
      "glutenvrij",
      "halal"
    ],
    "nutrition": {
      "calories": 625,
      "protein": 46,
      "carbs": 70,
      "fat": 23,
      "fiber": 22,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "kabeljauwfilet", "unit": "g", "quantity": 150, "scalable": true, "note": "vers of ontdooid" },
          { "name": "pastinaak", "unit": "g", "quantity": 250, "scalable": true },
          { "name": "spruitjes", "unit": "g", "quantity": 200, "scalable": true },
          { "name": "hüttenkäse", "unit": "g", "quantity": 50, "scalable": true },
          { "name": "ongezouten hazelnoten", "unit": "g", "quantity": 15, "scalable": true },
          { "name": "olijfolie", "unit": "tl", "quantity": 2, "scalable": true },
          { "name": "kappertjes", "unit": "tl", "quantity": 1, "scalable": true, "note": "fijngehakt" },
          { "name": "Dijonmosterd", "unit": "tl", "quantity": 0.25, "scalable": true },
          { "name": "citroen", "unit": "", "quantity": 0.5, "scalable": true },
          { "name": "verse dille", "unit": "el", "quantity": 2, "scalable": true, "note": "fijngehakt" },
          { "name": "witte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zout", "unit": "", "quantity": "snufje", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Kook de pastinaak. Schil de pastinaak, snijd in kleine blokjes en kook in 10–12 minuten volledig zacht. Bewaar enkele eetlepels kookvocht.",
      "Rooster de spruitjes. Halveer de spruitjes, verhit 1 tl olijfolie in een ruime koekenpan en leg ze met de snijkant naar beneden in de pan.",
      "Laat de spruitjes enkele minuten ongemoeid bakken tot de snijkanten donker goudbruin zijn. Draai om en bak verder tot ze beetgaar zijn.",
      "Hak de hazelnoten grof en bak ze de laatste 2 minuten met de spruitjes mee. Voeg vlak voor het serveren de kappertjes toe.",
      "Maak de pastinaakcrème. Pureer de uitgelekte pastinaak met hüttenkäse, Dijonmosterd, ongeveer ½ tl fijn geraspte citroenschil en witte peper.",
      "Voeg beetje bij beetje kookvocht toe tot een gladde, fluweelzachte crème ontstaat. Proef en breng voorzichtig op smaak met zout.",
      "Bak de kabeljauw. Dep de vis zeer goed droog, kruid met zwarte peper en een klein beetje zout en verhit de resterende 1 tl olijfolie.",
      "Bak de kabeljauw afhankelijk van de dikte ongeveer 2–3 minuten per kant, tot hij net gaar is en gemakkelijk in lamellen uiteenvalt.",
      "Haal de kabeljauw van het vuur en geef hem direct ongeveer 1 tl vers citroensap.",
      "Serveer. Strijk de pastinaakcrème over het bord, leg de kabeljauw erop en verdeel de spruitjes ernaast. Werk af met verse dille en eventueel extra citroenrasp."
    ]
  },
  {
    "id": "franse-mosterd-dragonkip-winterwortel-zilvervliesrijst",
    "title": "Franse mosterd-dragonkip met geroosterde winterwortel & zilvervliesrijst",
    "status": "gepubliceerd",
    "subtitle": "Sappige goudbruine kipdij met romige mosterd-dragonsaus, zoet geroosterde winterwortel en zilvervliesrijst.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 25,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Glutenvrij",
      "Halal",
      "Eiwitrijk",
      "Restaurantwaardig"
    ],
    "suitableFor": [
      "glutenvrij",
      "halal"
    ],
    "nutrition": {
      "calories": 720,
      "protein": 39,
      "carbs": 71,
      "fat": 30,
      "fiber": 12,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "kipdijfilet", "unit": "g", "quantity": 150, "scalable": true, "note": "overtollig vet verwijderd" },
          { "name": "winterpeen", "unit": "g", "quantity": 300, "scalable": true },
          { "name": "snelkook-zilvervliesrijst", "unit": "g", "quantity": 60, "scalable": true, "note": "ongekookt" },
          { "name": "magere kwark", "unit": "g", "quantity": 30, "scalable": true },
          { "name": "kleine sjalot", "unit": "", "quantity": 0.5, "scalable": true },
          { "name": "grove mosterd", "unit": "el", "quantity": 1, "scalable": true },
          { "name": "Dijonmosterd", "unit": "tl", "quantity": 0.5, "scalable": true },
          { "name": "olijfolie", "unit": "tl", "quantity": 2, "scalable": true },
          { "name": "verse dragon", "unit": "el", "quantity": 1, "scalable": true, "note": "fijngehakt, of 1 tl gedroogde dragon" },
          { "name": "gedroogde tijm", "unit": "tl", "quantity": 0.5, "scalable": true },
          { "name": "vers citroensap", "unit": "tl", "quantity": 0.5, "scalable": true },
          { "name": "water", "unit": "ml", "quantity": 60, "scalable": true },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zout", "unit": "", "quantity": "snufje", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Rooster de wortel. Verwarm oven of airfryer voor op 200°C en snijd de wortel schuin in dunne plakken.",
      "Meng de wortel met 1 tl olijfolie, tijm, zwarte peper en een klein snufje zout. Rooster 18–20 minuten tot de randen donker kleuren.",
      "Bereid ondertussen de zilvervliesrijst volgens de aanwijzingen op de verpakking.",
      "Bak de kip. Dep de kipdij droog, kruid met zwarte peper en weinig zout, verhit de resterende 1 tl olijfolie en bak rondom diep goudbruin.",
      "Zet het vuur iets lager en bak verder tot de kip volledig gaar maar nog sappig is. Haal uit de pan en laat rusten.",
      "Snijd de sjalot zeer fijn en fruit 1–2 minuten in het achtergebleven braadvet.",
      "Voeg 50–60 ml water toe en schraap alle gekaramelliseerde aanbaksels los. Laat ongeveer voor de helft inkoken.",
      "Voeg grove mosterd, Dijon en dragon toe. Gebruik je gedroogde dragon, laat deze ongeveer 30 seconden meekoken.",
      "Haal de pan van het vuur en roer de magere kwark erdoor. Voeg het citroensap en royaal zwarte peper toe.",
      "Serveer. Schep de zilvervliesrijst op het bord met de geroosterde wortel en kip en lepel de warme mosterd-dragonsaus over de kip."
    ]
  },
  {
    "id": "biefstukwok-oesterzwammen-paksoi-gember-rijstazijn",
    "title": "Biefstukwok met gekaramelliseerde oesterzwammen, paksoi, gember & rijstazijn",
    "status": "gepubliceerd",
    "subtitle": "Malse biefstuk, diep gekaramelliseerde oesterzwammen en knapperige paksoi met frisheid van rijstazijn en aroma van gember, soja en sesam.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 20,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Lactosevrij",
      "Halal",
      "Eiwitrijk",
      "Restaurantwaardig"
    ],
    "suitableFor": [
      "lactosevrij",
      "halal"
    ],
    "nutrition": {
      "calories": 675,
      "protein": 47,
      "carbs": 63,
      "fat": 28,
      "fiber": 9,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "biefstukreepjes", "unit": "g", "quantity": 150, "scalable": true, "note": "onbewerkt" },
          { "name": "snelkook-zilvervliesrijst", "unit": "g", "quantity": 60, "scalable": true, "note": "ongekookt" },
          { "name": "oesterzwammen", "unit": "g", "quantity": 150, "scalable": true },
          { "name": "paksoi", "unit": "g", "quantity": 200, "scalable": true },
          { "name": "verse gember", "unit": "cm", "quantity": 2, "scalable": true },
          { "name": "knoflook", "unit": "teen", "quantity": 1, "scalable": true },
          { "name": "natriumarme sojasaus", "unit": "el", "quantity": 1, "scalable": true },
          { "name": "rijstazijn", "unit": "tl", "quantity": 1.5, "scalable": true },
          { "name": "sesamolie", "unit": "tl", "quantity": 1.5, "scalable": true },
          { "name": "sesamzaad", "unit": "g", "quantity": 5, "scalable": true },
          { "name": "lente-ui", "unit": "", "quantity": 1, "scalable": true },
          { "name": "water", "unit": "el", "quantity": 1, "scalable": true },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Bereid de zilvervliesrijst volgens de aanwijzingen op de verpakking.",
      "Maak de woksaus. Meng de sojasaus met rijstazijn en 1 eetlepel water en zet apart.",
      "Rooster het sesamzaad kort in een droge wok of koekenpan tot het geurt en schep uit de pan.",
      "Bereid de groenten voor. Scheur de oesterzwammen grof, scheid de witte paksoistelen van het groene blad en snijd beide grof.",
      "Verhit de wok zeer heet, voeg ongeveer de helft van de sesamolie toe en bak de biefstuk 45–60 seconden op hoog vuur.",
      "Schep de biefstuk direct uit de wok zodra de buitenkant mooi bruin is; het vlees gaart later nog heel kort mee.",
      "Voeg de resterende sesamolie toe, leg de oesterzwammen in de pan en laat ze eerst ongemoeid zodat ze diep goudbruin worden.",
      "Rasp gember en knoflook fijn en voeg toe zodra de paddenstoelen goed gekleurd zijn. Bak ongeveer 30 seconden mee.",
      "Voeg eerst de witte paksoistelen toe en wok 1–2 minuten, voeg daarna het groene blad toe en bak nog ongeveer 30 seconden.",
      "Doe de biefstuk terug in de wok, voeg de saus toe en hussel alles 30–60 seconden op hoog vuur.",
      "Serveer. Schep de rijst op het bord, verdeel de wok erover en werk af met dun gesneden lente-ui en geroosterd sesamzaad."
    ]
  },
  {
    "id": "ras-el-hanoutbloemkool-krokante-kikkererwten-tahin",
    "title": "Ras-el-hanoutbloemkool met krokante kikkererwten & citroen-knoflooktahin",
    "status": "gepubliceerd",
    "subtitle": "Diep geroosterde bloemkool en krokante kikkererwten met warmte van ras el hanout, romige citroen-knoflooktahin en frisse peterselie.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 20,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Vegan",
      "Vegetarisch",
      "Glutenvrij",
      "Lactosevrij",
      "Halal",
      "Vezelrijk",
      "Gezond"
    ],
    "suitableFor": [
      "vegan",
      "vegetarisch",
      "lactosevrij",
      "glutenvrij",
      "halal"
    ],
    "nutrition": {
      "calories": 645,
      "protein": 27,
      "carbs": 61,
      "fat": 30,
      "fiber": 29,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "kikkererwten", "unit": "g", "quantity": 240, "scalable": true, "note": "uit blik of pot, uitgelekt" },
          { "name": "bloemkool", "unit": "g", "quantity": 350, "scalable": true },
          { "name": "rode ui", "unit": "g", "quantity": 100, "scalable": true },
          { "name": "tahin", "unit": "g", "quantity": 15, "scalable": true },
          { "name": "olijfolie", "unit": "el", "quantity": 1, "scalable": true },
          { "name": "ras el hanout", "unit": "el", "quantity": 1, "scalable": true, "note": "ruime eetlepel" },
          { "name": "vers citroensap", "unit": "el", "quantity": 1.5, "scalable": true },
          { "name": "kleine teen knoflook", "unit": "", "quantity": 0.5, "scalable": true },
          { "name": "warm water", "unit": "el", "quantity": 2, "scalable": true },
          { "name": "citroen", "unit": "", "quantity": 0.5, "scalable": true, "note": "voor de rasp" },
          { "name": "platte peterselie", "unit": "", "quantity": "ruime hand", "scalable": false },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zout", "unit": "", "quantity": "snufje", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Snijd de bloemkool in kleine roosjes en enkele dunne plakken en snijd de rode ui in dunne parten.",
      "Spoel de kikkererwten af, laat goed uitlekken en dep ze zo droog mogelijk, zodat ze beter roosteren.",
      "Verhit de olijfolie in een ruime hapjespan op middelhoog tot hoog vuur en bak de bloemkool 5–6 minuten; laat hem regelmatig ongemoeid liggen.",
      "Doe de rode ui erbij en bak nog 2–3 minuten tot zowel bloemkool als ui duidelijke donkere randjes krijgen.",
      "Zet het vuur iets lager, maak ruimte in het midden van de pan en voeg de ras el hanout toe. Bak ongeveer 20 seconden tot de specerijen sterk geuren.",
      "Voeg de kikkererwten toe, schep alles om en bak nog 3–4 minuten zodat ze warm en aan de buitenkant iets droger worden.",
      "Maak de tahinsaus. Rasp de knoflook zeer fijn en meng met tahin en citroensap.",
      "Klop er beetje bij beetje 2–3 eetlepels warm water door tot een gladde, lichte en schenkbare saus ontstaat. Voeg zwarte peper toe.",
      "Schep bloemkool, ui en kikkererwten op een bord en verdeel de tahinsaus er losjes overheen.",
      "Bestrooi royaal met platte peterselie en fijne citroenrasp. Proef en voeg alleen indien nodig nog een klein beetje zout toe."
    ]
  },
  {
    "id": "zalm-franse-mosterdlinzen-wortel-selderij-tijm",
    "title": "Zalm met warme Franse mosterdlinzen, wortel, selderij & tijm",
    "status": "gepubliceerd",
    "subtitle": "Sappige gebakken zalm op warme Franse linzen met wortel, selderij, Dijon en tijm, fris afgewerkt met rodewijnazijn en peterselie.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 25,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Glutenvrij",
      "Lactosevrij",
      "Halal",
      "Eiwitrijk",
      "Vezelrijk"
    ],
    "suitableFor": [
      "glutenvrij",
      "lactosevrij",
      "halal"
    ],
    "nutrition": {
      "calories": 665,
      "protein": 42,
      "carbs": 49,
      "fat": 30,
      "fiber": 17,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "zalmfilet", "unit": "g", "quantity": 130, "scalable": true },
          { "name": "gekookte linzen", "unit": "g", "quantity": 150, "scalable": true, "note": "uit blik of stazak, uitgelekt" },
          { "name": "winterwortel", "unit": "g", "quantity": 150, "scalable": true },
          { "name": "kleine sjalot", "unit": "", "quantity": 1, "scalable": true },
          { "name": "bleekselderij", "unit": "stengel", "quantity": 1, "scalable": true },
          { "name": "knoflook", "unit": "teen", "quantity": 0.5, "scalable": true },
          { "name": "zoutarme groentebouillon", "unit": "ml", "quantity": 100, "scalable": true },
          { "name": "olijfolie", "unit": "el", "quantity": 1, "scalable": true },
          { "name": "Dijonmosterd", "unit": "tl", "quantity": 1, "scalable": true },
          { "name": "rodewijnazijn", "unit": "tl", "quantity": 1.5, "scalable": true },
          { "name": "verse tijm", "unit": "takjes", "quantity": 2, "scalable": true },
          { "name": "platte peterselie", "unit": "", "quantity": "ruime hand", "scalable": false },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zout", "unit": "", "quantity": "snufje", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Snijd wortel, sjalot en bleekselderij in kleine blokjes en hak de knoflook fijn.",
      "Verhit ongeveer de helft van de olijfolie en bak sjalot, wortel en bleekselderij 4–5 minuten op middelhoog vuur.",
      "Voeg knoflook en tijm toe en bak ongeveer 30 seconden mee tot ze geuren.",
      "Spoel de linzen af, laat goed uitlekken en voeg samen met de bouillon toe.",
      "Laat 8–10 minuten zacht pruttelen tot de groenten gaar zijn en de bouillon grotendeels is opgenomen; de linzen moeten sappig blijven.",
      "Dep de zalm zeer goed droog en kruid met zwarte peper en een klein beetje zout.",
      "Verhit de resterende olijfolie en bak de zalm eerst aan de mooiste zijde of huidzijde stevig goudbruin.",
      "Draai de zalm om, zet het vuur iets lager en gaar verder tot het midden nog sappig is.",
      "Haal de linzen van het vuur, verwijder harde tijmtakjes en roer Dijonmosterd en rodewijnazijn erdoor.",
      "Hak de peterselie fijn en meng royaal door de warme linzen. Proef en voeg eventueel zwarte peper of enkele druppels extra azijn toe.",
      "Serveer. Schep de warme linzen in een diep bord, leg de gebakken zalm erop en werk af met wat extra peterselie en zwarte peper."
    ]
  },
  {
    "id": "romige-zilvervliesrijst-paddenstoelen-parmezaan-salie",
    "title": "Romige zilvervliesrijst met diep gebakken paddenstoelen, Parmezaan, tijm & krokante salie",
    "status": "gepubliceerd",
    "subtitle": "Diep gebakken paddenstoelen en romige zilvervliesrijst met hartige kaas, aardse tijm, krokante salie en precies genoeg citroen.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 25,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Vegetarisch",
      "Glutenvrij",
      "Eiwitrijk",
      "Restaurantwaardig"
    ],
    "suitableFor": [
      "vegetarisch",
      "glutenvrij"
    ],
    "nutrition": {
      "calories": 620,
      "protein": 31,
      "carbs": 80,
      "fat": 20,
      "fiber": 7,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "snelkook-zilvervliesrijst", "unit": "g", "quantity": 85, "scalable": true, "note": "ongekookt" },
          { "name": "gemengde paddenstoelen", "unit": "g", "quantity": 200, "scalable": true, "note": "bijv. kastanjechampignons en oesterzwammen" },
          { "name": "hüttenkäse", "unit": "g", "quantity": 100, "scalable": true },
          { "name": "Parmezaanse kaas", "unit": "g", "quantity": 15, "scalable": true, "note": "vegetarisch, fijn geraspt" },
          { "name": "kleine sjalot", "unit": "", "quantity": 1, "scalable": true },
          { "name": "knoflook", "unit": "teen", "quantity": 0.5, "scalable": true },
          { "name": "zoutarme groentebouillon", "unit": "ml", "quantity": 300, "scalable": true },
          { "name": "olijfolie", "unit": "tl", "quantity": 2, "scalable": true },
          { "name": "verse tijm", "unit": "takjes", "quantity": 2, "scalable": true },
          { "name": "verse salieblaadjes", "unit": "", "quantity": 3, "scalable": true },
          { "name": "vers citroensap", "unit": "tl", "quantity": 0.5, "scalable": true },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zout", "unit": "", "quantity": "snufje", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Pureer de hüttenkäse met een staafmixer volledig glad en zet apart.",
      "Borstel de paddenstoelen schoon. Snijd kastanjechampignons in grove stukken en scheur oesterzwammen met de hand.",
      "Snijd de sjalot fijn, verhit 1 tl olijfolie en fruit de sjalot 2 minuten zachtjes.",
      "Hak de knoflook fijn en voeg samen met de tijmblaadjes toe. Bak ongeveer 30 seconden mee.",
      "Voeg de zilvervliesrijst toe en bak 1 minuut. Schenk ongeveer 300 ml bouillon erbij en kook volgens de verpakking gaar.",
      "Roer tijdens het koken af en toe en voeg indien nodig wat extra bouillon toe; de rijst moet gaar en vochtig blijven.",
      "Verhit ondertussen de resterende 1 tl olijfolie in een ruime koekenpan op hoog vuur.",
      "Verdeel de paddenstoelen ruim over de pan en laat ze regelmatig 1–2 minuten ongemoeid liggen zodat ze diep goudbruin worden.",
      "Voeg pas wanneer de paddenstoelen goed gekleurd zijn zwarte peper en een klein snufje zout toe.",
      "Bak de salieblaadjes de laatste minuut kort tussen de paddenstoelen tot ze krokant zijn en haal ze uit de pan.",
      "Haal de gare rijst volledig van het vuur en roer de gladde hüttenkäse en geraspte harde kaas erdoor.",
      "Voeg royaal zwarte peper en ongeveer ½ tl citroensap toe. Proef voordat je extra zout gebruikt.",
      "Serveer. Schep de romige rijst in een diep bord, verdeel de gebakken paddenstoelen erover en verkruimel de krokante salie erboven met eventueel wat fijne citroenrasp."
    ]
  },
  {
    "id": "rozemarijnkip-pompoen-parmezaanpolenta-boerenkoolchips",
    "title": "Rozemarijnkip met pompoen-Parmezaanpolenta, boerenkoolchips & pompoenpitten",
    "status": "gepubliceerd",
    "subtitle": "Romige pompoenpolenta met Parmezaan als basis voor kruidige rozemarijnkip, krokante boerenkool, geroosterde pompoenpitten en frisse citroenrasp.",
    "mealType": "diner",
    "seasons": [
      "herfst-winter"
    ],
    "prepTime": 25,
    "cookTime": 0,
    "baseServings": 1,
    "tags": [
      "Glutenvrij",
      "Halal",
      "Eiwitrijk",
      "Restaurantwaardig"
    ],
    "suitableFor": [
      "glutenvrij",
      "halal"
    ],
    "nutrition": {
      "calories": 690,
      "protein": 44,
      "carbs": 58,
      "fat": 33,
      "fiber": 12,
      "isIndicative": true,
      "micronutrients": {}
    },
    "ingredients": [
      {
        "category": "Basis",
        "items": [
          { "name": "kipdijfilet", "unit": "g", "quantity": 150, "scalable": true, "note": "overtollig vet verwijderd" },
          { "name": "polentameel", "unit": "g", "quantity": 50, "scalable": true },
          { "name": "pompoenblokjes", "unit": "g", "quantity": 150, "scalable": true },
          { "name": "gesneden boerenkool", "unit": "g", "quantity": 100, "scalable": true },
          { "name": "Parmezaanse kaas", "unit": "g", "quantity": 10, "scalable": true },
          { "name": "ongezouten pompoenpitten", "unit": "g", "quantity": 10, "scalable": true },
          { "name": "olijfolie", "unit": "el", "quantity": 1, "scalable": true },
          { "name": "zoutarme groentebouillon", "unit": "ml", "quantity": 250, "scalable": true },
          { "name": "knoflook", "unit": "teen", "quantity": 0.5, "scalable": true },
          { "name": "verse rozemarijn", "unit": "tl", "quantity": 0.5, "scalable": true, "note": "zeer fijngehakt" },
          { "name": "kleine salieblaadjes", "unit": "", "quantity": 2, "scalable": true, "note": "fijngehakt" },
          { "name": "nootmuskaat", "unit": "", "quantity": "snufje", "scalable": false },
          { "name": "citroen", "unit": "", "quantity": 0.5, "scalable": true, "note": "voor de rasp" },
          { "name": "zwarte peper", "unit": "", "quantity": "naar smaak", "scalable": false },
          { "name": "zout", "unit": "", "quantity": "snufje", "scalable": false }
        ]
      }
    ],
    "instructions": [
      "Verwarm de oven voor op 190°C.",
      "Meng de boerenkool met ongeveer 1 tl olijfolie en een klein snufje zout en verdeel ruim over een bakplaat.",
      "Rooster de boerenkool 8–10 minuten; schep halverwege om en controleer regelmatig zodat de randen krokant maar niet verbrand worden.",
      "Rooster de pompoenpitten kort in een droge koekenpan tot ze geuren en licht kleuren en zet apart.",
      "Meng de kip met zwarte peper, rozemarijn, fijngehakte salie en zeer fijngehakte knoflook.",
      "Verhit de resterende olijfolie en bak de kipdij op middelhoog vuur rondom stevig goudbruin.",
      "Zet het vuur iets lager en bak verder tot de kip volledig gaar maar nog sappig is. Laat enkele minuten rusten.",
      "Kook ondertussen de pompoenblokjes in ongeveer 8 minuten volledig zacht, giet goed af en stamp of pureer fijn.",
      "Breng de groentebouillon aan de kook en strooi de polenta er al roerend langzaam in.",
      "Kook volgens de verpakking, meestal 3–5 minuten, en blijf regelmatig roeren.",
      "Roer de pompoenpuree en Parmezaanse kaas door de polenta.",
      "Voeg royaal zwarte peper en een heel klein snufje nootmuskaat toe. Proef voordat je extra zout toevoegt.",
      "Rasp direct na het bakken een klein beetje citroenschil over de boerenkoolchips; gebruik geen citroensap zodat ze krokant blijven.",
      "Serveer. Schep de pompoenpolenta in een diep bord, snijd de kip schuin in plakken en leg erop of ernaast.",
      "Verdeel de boerenkoolchips en geroosterde pompoenpitten over het bord en eindig met wat extra zwarte peper en eventueel citroenrasp."
    ]
  }
];
