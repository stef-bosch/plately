/**
 * Groups a shopping-list ingredient under a supermarket category, purely from
 * its Dutch name (the recipes carry no aisle data). Matching uses a leading
 * word boundary + prefix, which fits Dutch compounds ("sinaasappelsap" matches
 * "sinaasappel…") while avoiding infixes ("fruit" never matches "ui").
 *
 * The keyword lists are tuned to the current dish library and are easy to
 * extend — add a word to a category, or reorder categories, as recipes grow.
 * Anything unmatched lands in "Overig".
 */

export type GroceryCategory =
  | 'Groente'
  | 'Fruit'
  | 'Vlees & vis'
  | 'Zuivel & eieren'
  | 'Brood & granen'
  | 'Noten, zaden & droog'
  | 'Sauzen, olie & azijn'
  | 'Kruiden & specerijen'
  | 'Drank'
  | 'Overig';

/** Display order of the categories on the shopping list. */
export const GROCERY_ORDER: GroceryCategory[] = [
  'Groente',
  'Fruit',
  'Vlees & vis',
  'Zuivel & eieren',
  'Brood & granen',
  'Noten, zaden & droog',
  'Sauzen, olie & azijn',
  'Kruiden & specerijen',
  'Drank',
  'Overig',
];

function matcher(prefixes: string[], exacts: string[] = []) {
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts: string[] = [];
  if (prefixes.length) parts.push('\\b(?:' + prefixes.map(esc).join('|') + ')');
  if (exacts.length) parts.push('\\b(?:' + exacts.map(esc).join('|') + ')\\b');
  const re = new RegExp(parts.join('|'));
  return (name: string) => re.test(name);
}

// Checked in this order; first hit wins. Order resolves collisions (e.g. a
// sauce/oil/drink is caught before the produce word inside its name).
const CLASSIFIERS: { category: GroceryCategory; test: (n: string) => boolean }[] = [
  // Spice powders first, so "paprikapoeder" isn't caught by "paprika" (produce).
  {
    category: 'Kruiden & specerijen',
    test: matcher(['paprikapoeder', 'chilipoeder']),
  },
  {
    category: 'Sauzen, olie & azijn',
    test: matcher([
      'saus', 'sauce', 'sojasaus', 'oestersaus', 'vissaus', 'mosterd', 'dijon',
      'olijfolie', 'sesamolie', 'olie', 'oliespray', 'azijn', 'wittewijnazijn',
      'rodewijnazijn', 'rijstazijn', 'miso', 'tomatenpuree', 'hummus', 'pesto',
      'bouillon', 'groentebouillon', 'crispy chili', 'chili-olie',
      'caribbean green', 'tahin', 'kapper',
    ]),
  },
  {
    category: 'Drank',
    test: matcher([
      'alcoholvrij', 'prosecco', 'vermout', 'whiskey', 'tonic', 'bruiswater',
      'grenadine', 'gembersiroop', 'granaatappelsiroop', 'koffie', 'thee',
      'cola', 'sinaasappelsap', 'ananassap', 'mangosap', 'passievruchtsap',
      'druivensap', 'bitters', 'bitter', 'wijn', 'rum',
    ]),
  },
  {
    category: 'Vlees & vis',
    test: matcher([
      'kip', 'kipgehakt', 'garnaal', 'garnalen', 'witvis', 'zalm', 'tonijn',
      'pangasius', 'koolvis', 'kabeljauw', 'vis', 'dumpling', 'biefstuk',
      'rund', 'rundvlees',
    ]),
  },
  {
    category: 'Brood & granen',
    test: matcher([
      'brood', 'volkoren', 'havermout', 'havermeel', 'bulgur', 'couscous',
      'rijst', 'zilvervliesrijst', 'basmatirijst', 'noodle', 'noedel', 'ramen',
      'spaghetti', 'pasta', 'tortilla', 'wrap', 'bloem', 'tarwebloem',
      'pizzabloem', 'tarwemeel', 'polenta', 'knäckebröd', 'knackebrod',
      'rogge', 'zuurdesem',
    ]),
  },
  {
    category: 'Noten, zaden & droog',
    test: matcher([
      'noten', 'walnoten', 'hazelnoot', 'amandelen', 'pistache', 'pinda',
      'pindakaas', 'pijnboompitten', 'pompoenpit', 'sesamzaad', 'chiazaad',
      'zaad', 'kikkererwt', 'linzen', 'kidneyboon', 'kidneybonen',
      'witte bonen', 'zwarte bonen', 'bonen', 'kokosvlokken', 'kokosrasp',
      'cacao', 'palmsuiker', 'suiker', 'honing', 'agavesiroop', 'ahornsiroop',
      'gist', 'bakpoeder',
    ]),
  },
  {
    category: 'Zuivel & eieren',
    test: matcher(
      [
        'melk', 'halfvolle melk', 'amandelmelk', 'kokosmelk', 'yoghurt',
        'kwark', 'skyr', 'cottage', 'hüttenkäse', 'huttenkase', 'ricotta',
        'feta', 'parmeza', 'mozzarella', 'fior di latte',
      ],
      ['ei', 'eieren'],
    ),
  },
  {
    category: 'Fruit',
    test: matcher([
      'aardbei', 'framboz', 'banaan', 'appel', 'mango', 'ananas', 'abrikoz',
      'sinaasappel', 'citroen', 'limoen', 'druiven', 'granaatappel',
      'passievrucht', 'zomerfruit', 'fruit',
    ]),
  },
  {
    category: 'Groente',
    test: matcher(
      [
        'tomaat', 'tomaten', 'cherrytomaten', 'komkommer', 'courgette',
        'paprika', 'puntpaprika', 'sjalot', 'bosui', 'lente-ui', 'knoflook',
        'spinazie', 'rucola', 'waterkers', 'kiemen', 'taugé', 'tauge', 'paksoi',
        'spitskool', 'kool', 'bloemkool', 'boerenkool', 'spruit', 'wortel',
        'winterwortel', 'winterpeen', 'pastinaak', 'pompoen', 'flespompoen',
        'snackkomkommer', 'bleekselderij',
        'selderij', 'oesterzwam', 'paddenstoel', 'kastanjechampignon',
        'champignon', 'doperwten', 'edamame', 'sperziebonen', 'okra',
        'shiitake', 'krieltjes', 'aardappel', 'avocado', 'olijven', 'sla',
        'gemende sla',
      ],
      ['ui', 'uien'],
    ),
  },
  {
    category: 'Kruiden & specerijen',
    test: matcher([
      'basilicum', 'munt', 'peterselie', 'koriander', 'bieslook', 'tijm',
      'rozemarijn', 'oregano', 'dille', 'dragon', 'salie', 'laurier', 'kaneel',
      'ceylonkaneel', 'kardemom', 'kerrie', 'speculaas', 'komijn', 'kurkuma',
      'piment', 'nootmuskaat', 'saffraan', 'vanille',
      'ras el hanout', 'paprikapoeder', 'chilipoeder', 'chilivlokken',
      'chilipeper', 'chili', 'pul biber', 'peper', 'zout', 'sesamzaad',
      'gember', 'kruidenmix', "za'atar", 'zaatar',
    ]),
  },
];

export function classifyIngredient(name: string): GroceryCategory {
  const n = name.toLowerCase().replace(/[’]/g, "'");
  for (const c of CLASSIFIERS) {
    if (c.test(n)) return c.category;
  }
  return 'Overig';
}
