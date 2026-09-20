import type { ImageSourcePropType } from 'react-native';

/**
 * Bundled dish photos (exported from Supabase Storage on 2026-09-20,
 * re-encoded to webp). Attached to dishes by id in content.ts. Add a photo
 * for a new dish by dropping a .webp in src/assets/dishes/ and adding a
 * require() here.
 */
export const DISH_IMAGES: Record<string, ImageSourcePropType> = {
  "aperol-spritz": require('../assets/dishes/aperol-spritz.webp'),
  "avocado-toast-met-cottage-cheese-zachtgekookt-ei-za-atar-en-": require('../assets/dishes/avocado-toast-met-cottage-cheese-zachtgekookt-ei-za-atar-en-.webp'),
  "citroen-havermoutpannenkoeken-met-ricotta-en-warm-rood-zomer": require('../assets/dishes/citroen-havermoutpannenkoeken-met-ricotta-en-warm-rood-zomer.webp'),
  "citrus-foam-mocktail": require('../assets/dishes/citrus-foam-mocktail.webp'),
  "coffee-spice-cooler": require('../assets/dishes/coffee-spice-cooler.webp'),
  "dumpling-noodle-comfort-bowl": require('../assets/dishes/dumpling-noodle-comfort-bowl.webp'),
  "fruit-punch-cooler": require('../assets/dishes/fruit-punch-cooler.webp'),
  "ginger-lime-spritz": require('../assets/dishes/ginger-lime-spritz.webp'),
  "groene-omelet-met-spinazie-kruiden-feta-en-volkorenbrood": require('../assets/dishes/groene-omelet-met-spinazie-kruiden-feta-en-volkorenbrood.webp'),
  "groene-pesto": require('../assets/dishes/groene-pesto.webp'),
  "kwark-met-frambozen-en-walnoten": require('../assets/dishes/kwark-met-frambozen-en-walnoten.webp'),
  "margerita": require('../assets/dishes/margerita.webp'),
  "mediterrane-parelcouscoussalade-met-gegrilde-courgette-papri": require('../assets/dishes/mediterrane-parelcouscoussalade-met-gegrilde-courgette-papri.webp'),
  "negroni": require('../assets/dishes/negroni.webp'),
  "old-fashioned": require('../assets/dishes/old-fashioned.webp'),
  "overnight-oats": require('../assets/dishes/overnight-oats.webp'),
  "pad-krapow-gai-met-sperziebonen-en-zilvervliesrijst": require('../assets/dishes/pad-krapow-gai-met-sperziebonen-en-zilvervliesrijst.webp'),
  "panzanella-met-witte-bonen-gegrilde-groenten-en-basilicum": require('../assets/dishes/panzanella-met-witte-bonen-gegrilde-groenten-en-basilicum.webp'),
  "passion-fruit-spritz": require('../assets/dishes/passion-fruit-spritz.webp'),
  "pasta-al-limone-met-zalm-doperwten-en-spinazie": require('../assets/dishes/pasta-al-limone-met-zalm-doperwten-en-spinazie.webp'),
  "perzische-saffraan-citroen-kip-met-volkoren-bulgur-en-komkom": require('../assets/dishes/perzische-saffraan-citroen-kip-met-volkoren-bulgur-en-komkom.webp'),
  "pizza-margherita": require('../assets/dishes/pizza-margherita.webp'),
  "salade-nicoise-met-krieltjes-sperziebonen-ei-en-tonijn": require('../assets/dishes/salade-nicoise-met-krieltjes-sperziebonen-ei-en-tonijn.webp'),
  "skyr-met-aardbeien-en-pistachenoten": require('../assets/dishes/skyr-met-aardbeien-en-pistachenoten.webp'),
  "souvlaki-bowl": require('../assets/dishes/souvlaki-bowl.webp'),
  "tequila-sunrise": require('../assets/dishes/tequila-sunrise.webp'),
  "turkse-k-s-r-met-kikkererwten-granaatappel-en-veel-peterseli": require('../assets/dishes/turkse-k-s-r-met-kikkererwten-granaatappel-en-veel-peterseli.webp'),
  "vietnamese-noedelsalade-met-kip-wortel-komkommer-munt-korian": require('../assets/dishes/vietnamese-noedelsalade-met-kip-wortel-komkommer-munt-korian.webp'),
  "virgin-caipirinha": require('../assets/dishes/virgin-caipirinha.webp'),
  "virgin-mojito": require('../assets/dishes/virgin-mojito.webp'),
  "volkorenbrood-met-100-pindakaas-en-banaan": require('../assets/dishes/volkorenbrood-met-100-pindakaas-en-banaan.webp'),
  "volkorenbrood-met-hummus-en-appel": require('../assets/dishes/volkorenbrood-met-hummus-en-appel.webp'),
};
