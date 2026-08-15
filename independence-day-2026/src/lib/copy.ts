/**
 * Every word that appears on screen, in one place.
 *
 * Kept centralised so scripts/copy_audit.mjs can mechanically verify the two
 * hard content rules for this reel:
 *
 *   1. "Shivansh Electronics" appears exactly ONCE, in the closing beat, with
 *      no designation and no promotional language attached to it. The wish
 *      itself is entirely about India; the company name is a signature on that
 *      wish, never the subject of a sentence.
 *   2. No political party and no contemporary political figure appears
 *      anywhere. This is a civic and cultural piece.
 *
 * Factual notes:
 *   - 15 August 2026 is the 80th Independence Day; 79 years have been
 *     completed since 15 August 1947. Both framings are accurate — they count
 *     different things — and the reel uses the ordinal on screen.
 *   - The Ashoka Chakra has 24 spokes and was adopted on the national flag in
 *     July 1947.
 *   - The Eighth Schedule of the Constitution lists 22 languages.
 *   - India has 28 states and 8 union territories.
 *   - The coastline is roughly 7,500 km including the island territories.
 */

export const COPY = {
  b01: {
    kicker: '15 AUGUST 2026',
    head: 'Eighty Years\nof a Free India',
    sub: 'One land. Many peoples. One story still being written.',
    stamp: '1947 — 2026',
  },
  b02: {
    kicker: 'THE LONG ROAD',
    head: 'A Nation\nAwoke',
    sub: 'Spun by hand. Carried by millions. Won without a shot fired in its name.',
    year: '1947',
    foot: 'FREEDOM · 15 AUGUST',
  },
  b03: {
    kicker: 'THE ASHOKA CHAKRA',
    head: 'Twenty-Four Spokes',
    sub: 'The wheel at the centre of the flag. It has never been allowed to stand still.',
    micro: 'ADOPTED · JULY 1947',
  },
  b04: {
    kicker: 'THE LAND · NORTH',
    head: 'From the Himalaya',
    sub: 'Where the rivers begin, and the first light of the country lands.',
  },
  b05: {
    kicker: 'THE LAND · THE PLAINS',
    head: 'Through Rivers That\nCarried Civilisations',
    sub: 'The Ganga, the Brahmaputra, the Kaveri — and the forests they feed.',
  },
  b06: {
    kicker: 'THE LAND · DESERT & SEA',
    head: 'To Sand and Shore',
    sub: 'The Thar in the west, and a coastline that runs some 7,500 kilometres.',
  },
  b07: {
    kicker: 'BUILT ACROSS THE CENTURIES',
    head: 'Stone That\nRemembers',
    sub: 'Seven regions. Twenty-three centuries. One unbroken habit of building.',
  },
  b08: {
    kicker: 'CLASSICAL & FOLK',
    head: 'A Country\nThat Dances',
    sub: 'Every region keeps its own steps — and teaches them to the next generation.',
  },
  b09: {
    kicker: 'RAGAS & RHYTHMS',
    head: 'And a Country\nThat Plays',
    sub: 'Strings, skins and breath, tuned by a thousand years of practice.',
  },
  b10: {
    kicker: 'MADE BY HAND',
    head: 'Woven, Printed,\nFired, Served',
    sub: 'Craft that never became an antique, because it never stopped being used.',
  },
  b11: {
    kicker: 'THE YEAR IN FESTIVALS',
    head: 'Something\nIs Always\nBeing Celebrated',
    sub: 'Lamps, colour, harvest and the new moon — every calendar at once.',
  },
  b12: {
    kicker: 'MANY TONGUES',
    head: 'One Country,\nHeard in Many Voices',
    sub: '22 languages in the Eighth Schedule. Hundreds more spoken every day.',
    micro: '28 STATES · 8 UNION TERRITORIES',
  },
  b13: {
    kicker: 'अनेकता में एकता',
    head: 'Unity in Diversity',
    sub: 'Not one people made alike — many peoples who chose to be one country.',
  },
  b14: {
    deva: 'शुभ स्वतंत्रता दिवस',
    line1: 'Wishing every Indian a very happy',
    head: '80th Independence Day',
    sub: 'Jai Hind.',
    /**
     * The single Shivansh Electronics mention. Name only — no designation, no
     * tagline, no contact detail, no call to action. It signs the wish; it is
     * never the subject of it.
     */
    signature: 'Shivansh Electronics',
  },
} as const;

/** The eleven scripts of beat 12, each with the face that can render it. */
export const NAMES: {text: string; font: string; label: string}[] = [
  {text: 'भारत', font: 'deva', label: 'Hindi'},
  {text: 'ভারত', font: 'beng', label: 'Bengali'},
  {text: 'இந்தியா', font: 'taml', label: 'Tamil'},
  {text: 'భారత్', font: 'telu', label: 'Telugu'},
  {text: 'ಭಾರತ', font: 'knda', label: 'Kannada'},
  {text: 'ભારત', font: 'gujr', label: 'Gujarati'},
  {text: 'ਭਾਰਤ', font: 'guru', label: 'Punjabi'},
  {text: 'ഇന്ത്യ', font: 'mlym', label: 'Malayalam'},
  {text: 'ଭାରତ', font: 'orya', label: 'Odia'},
  {text: 'بھارت', font: 'arab', label: 'Urdu'},
  {text: 'India', font: 'ui', label: 'English'},
];
