/**
 * BRANDING CONSTANTS.
 *
 * The contact set is confirmed twice over: by the user's own build instruction
 * (§6.1) and independently by Stage 10 of the research brief, which lists the
 * identical website, three handles and three numbers. Wording is pulled from
 * the TASCAM Recording Series' `build/shared/brand.ts`, where the
 * "Authorized Partner" phrasing was already settled for a TASCAM subject.
 *
 * No territory clause. No distributor, dealer or reseller language, anywhere.
 */
export const BRAND = {
  name: "Shivansh Electronics",
  role: "Authorized Partner of TASCAM",
  website: "www.shivanshelectronics.in",
  instagram: "instagram.com/@shivanshelectronics.in",
  facebook: "facebook.com/@shivanshelectronics.in",
  youtube: "youtube.com/@shivanshelectronics-in",
  phones: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
} as const;

/**
 * THE FIVE MARKETED CHANNELS.
 *
 * The rotation works in CHANNELS, not in individual contact details, because
 * the three phone numbers are ONE channel: whenever WhatsApp is marketed, all
 * three numbers appear together on a single line behind one icon, never one at
 * a time. That is the format §6.1 specifies exactly, and surfacing them singly
 * would make a viewer wait through three appearances to learn there are three.
 */
export const CHANNELS = ["website", "instagram", "facebook", "youtube", "whatsapp"] as const;
export type ChannelKey = (typeof CHANNELS)[number];

/** What each channel puts on screen beside its icon. */
export const CHANNEL_VALUE: Record<ChannelKey, string> = {
  website: BRAND.website,
  instagram: BRAND.instagram,
  facebook: BRAND.facebook,
  youtube: BRAND.youtube,
  whatsapp: BRAND.phones.join(", "),
};

/**
 * WhatsApp's three numbers make a strip roughly twice as wide as any other
 * channel's, which decides both its type size and which slots can hold it.
 *
 * It lives here rather than beside the component because the placement planner
 * needs it too, and the planner is plain TypeScript that the audit runs under
 * `node --experimental-strip-types`, which cannot load a .tsx module.
 */
export const isWide = (c: ChannelKey) => c === "whatsapp";

/**
 * The CTA. A technical-consultation offer, never a purchase close — which is
 * both the standing editorial rule and the correct register for Stage 9's
 * "senior systems architect addressing professional engineering peers".
 */
export const CTA = "Talk to the team about your facility.";

/**
 * Strings that must never appear in any rendered text, in any deliverable.
 *
 * The pricing list is deliberately broader than literal figures. Written that
 * way it previously caught "expensive", "budget line", "costs a fraction of"
 * and "line item" in an already-rendered production — none of which is a price,
 * all of which is cost framing.
 *
 * TASCAM is deliberately absent from the competitor list: this IS a TASCAM
 * production and the brand is named throughout, confidently and accurately.
 * MOTU IS on the list — the MOTU productions are this build's structural
 * reference, but MOTU must never be named on screen in a TASCAM video.
 * Dante, Ember+, NMOS, AES67 and SMPTE are protocols and standards, not
 * competing console brands, and are named freely.
 */
export const FORBIDDEN = {
  pricing: [
    "price", "pricing", "priced", "mrp", "mop", "rs.", "inr", "usd", "eur",
    "cost", "costs", "costly", "discount", "offer", "deal", "cheap", "cheaper",
    "afford", "affordable", "budget", "buy now", "order now", "emi", "gst",
    "expensive", "inexpensive", "value for money", "line item", "investment",
    "spend", "premium price", "entry-level price", "quote", "quotation",
  ],
  competitors: [
    "behringer", "zoom", "yamaha", "ssl", "solid state logic", "soundcraft",
    "mackie", "presonus", "rme", "allen & heath", "allen and heath", "midas",
    "motu", "mark of the unicorn", "focusrite", "universal audio", "apogee",
    "audient", "roland", "korg", "digico", "avid", "calrec", "lawo", "studer",
    "wheatstone", "axia",
  ],
  /** Relationship wording that is not ours to use. */
  relationship: [
    "distributor", "distribution partner", "dealer", "reseller", "re-seller",
    "stockist", "authorized distributor", "sole agent",
  ],
} as const;
