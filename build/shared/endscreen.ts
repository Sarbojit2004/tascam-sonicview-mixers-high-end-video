/**
 * THE END-SCREEN CONTRACT — what §6.1 requires, as data.
 *
 * This lives in a plain .ts module rather than beside the component so the
 * audit can import it. The auditor runs under `node --experimental-strip-types`,
 * which cannot load a .tsx file, and a contract that only the renderer can read
 * is a contract nothing can check.
 */
import { BRAND, CTA } from "./brand.ts";

/** All three numbers, together, one line, one mark. Exactly as specified. */
export const WHATSAPP_LINE = BRAND.phones.join(", ");

export const ROWS = [
  { icon: "website", value: BRAND.website },
  { icon: "instagram", value: BRAND.instagram },
  { icon: "facebook", value: BRAND.facebook },
  { icon: "youtube", value: BRAND.youtube },
] as const;

/**
 * Every element §6.1 requires on every one of the six end screens. The audit
 * asserts each is present and non-empty, and that the WhatsApp line matches the
 * specified format character for character.
 */
export const END_SCREEN_REQUIRED = [
  BRAND.role,
  BRAND.website,
  BRAND.instagram,
  BRAND.facebook,
  BRAND.youtube,
  WHATSAPP_LINE,
  CTA,
] as const;

/** The two marks that appear, and nowhere else in any deliverable. */
export const END_SCREEN_MARKS = ["shivansh", "tascam"] as const;
