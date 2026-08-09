/**
 * Fixed copy shared by all three reels.
 *
 * Hard rules enforced here and everywhere downstream:
 *   · Shivansh Electronics is TASCAM's AUTHORIZED PARTNER. The words
 *     "distributor", "dealer" and "reseller" appear nowhere.
 *   · No pricing, MRP or cost figure of any kind, in any part, ever.
 *   · No other console manufacturer is named or alluded to.
 *   · The CTA is a technical-consultation invitation, never a sales close.
 */

export const PARTNER = 'Shivansh Electronics';
export const PARTNER_ROLE = "TASCAM's Authorized Partner";

export const CONTACT = {
  website: 'shivanshelectronics.in',
  linktree: 'shivanshelectronics.in/linktree-hub',
  whatsappChannel: 'shivanshelectronics.in/whatsapp-channel',
  phones: ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755'],
  instagram: 'shivanshelectronics.in/instagram-page',
  facebook: 'shivanshelectronics.in/facebook-page',
  linkedin: 'shivanshelectronics.in/linkedin-page',
  threads: 'shivanshelectronics.in/threads-profile',
  x: 'shivanshelectronics.in/x-twitter-profile',
  youtube: 'shivanshelectronics.in/youtube-channel',
  address:
    'Raja Electric — Shivansh Electronics, 3, Ramanath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal, India 700031',
  directions: 'shivanshelectronics.in/google-profile-location',
} as const;

/** Social handles woven through the body of each reel, not just the outro. */
export const SOCIALS: {label: string; value: string}[] = [
  {label: 'Web', value: CONTACT.website},
  {label: 'Instagram', value: CONTACT.instagram},
  {label: 'LinkedIn', value: CONTACT.linkedin},
  {label: 'YouTube', value: CONTACT.youtube},
  {label: 'Facebook', value: CONTACT.facebook},
  {label: 'Threads', value: CONTACT.threads},
  {label: 'X', value: CONTACT.x},
  {label: 'WhatsApp Channel', value: CONTACT.whatsappChannel},
];

/** Technical-consultation CTA lines. No price, no urgency, no sales pressure. */
export const CTA = {
  eyebrow: 'TECHNICAL CONSULTATION',
  headline: 'Architect the system\nbefore you specify it.',
  body:
    'System design, protocol matching and infrastructure planning for the Sonicview platform — across India.',
  partnerLine: `${PARTNER} · ${PARTNER_ROLE}`,
} as const;

/** Continuity beats between the three parts (Section 0c). */
export const CONTINUITY = {
  1: {kicker: 'PART 1 OF 3 · THE HUB', line: 'The console is the hub.', next: 'Next: how it reaches the stage.'},
  2: {kicker: 'PART 2 OF 3 · THE NETWORK', line: 'The network is in place.', next: 'Next: adapting it to any facility standard.'},
  3: {kicker: 'PART 3 OF 3 · THE PROTOCOL LAYER', line: 'That is the complete Sonicview ecosystem.', next: 'Console, network and protocol — one architecture.'},
} as const;

export const PART_TITLE = {
  1: 'THE HUB',
  2: 'THE NETWORK',
  3: 'THE PROTOCOL LAYER',
} as const;
