# Voiceover Script — Long-Form Part 3 of 3: "The Protocol Layer"

**Video:** `out/sonicview-longform-part3-protocol.mp4`
**Runtime:** 298.000 s (8,940 frames @ 30 fps) · 1920×1080
**Audio slot:** `public/vo/voiceover-longform-part3.mp3` — silent 298 s placeholder, replace in place
**Language:** English only
**Word count:** 668 words · average delivered pace ≈ 147 wpm, leaving ~25 s of deliberate silence

---

## Tone

**Option 2 (Precise & Technical-but-Accessible) throughout, with Option 1 (Warm & Trustworthy)
at the close of the series.**

This is the most technical of the three parts and the read should not apologise for that. The
audience for a five-minute video about expansion cards is an engineer or an integrator who is
deciding what to put in a rack. Card names, channel counts and connector types are the content —
say them cleanly and let them land.

Option 1 is held back until chapter 13 ("what the three parts add up to") and the close, where the
series is being summed up and an invitation is being made. Chapter 14 in particular should feel
like the end of something, not the end of a segment.

**Delivery notes for the read**

- Around 145–150 wpm. Card names get a small beat before them.
- Pronunciation: "IF-ST2110" is *eye-eff ess-tee twenty-one-ten*. "IF-AE16" is *eye-eff ay-ee
  sixteen*. "IF-AN16/OUT" is *eye-eff ay-en sixteen out*. "IF-MA64/EX" is *eye-eff em-ay sixty-four
  ee-ex*. "IF-DA64" is *eye-eff dee-ay sixty-four*.
- "AES/EBU" is *ay-ee-ess ee-bee-you*. "MADI" is *MAH-dee*. "PTP" spelled out. "NMOS" is *EN-moss*.
- "ST 2022-7" is *ess-tee twenty twenty-two dash seven*.
- Read dimensions naturally: "107 by 40 by 161.5 millimetres" — do not spell out "×".
- The line "no external conversion anywhere in the signal path" is the through-line of the whole
  part. Give it room every time the idea recurs.
- Do not lift into the CTA. It is the same voice, making an offer.

---

## Script

### [00:00 – 00:14] — Cold open · the console adapts
> *(chapter 01 · 420f — TASCAM and Shivansh Electronics interstitials land here)*

**"The console adapts to the facility."**

*[pause 1.2 s]*

**"Not the other way around — and not through a rack of format converters sitting in the signal
path."**

*(27 words · ~13 s including the pause.)*

---

### [00:14 – 00:30] — Two expansion slots
> *(chapter 02 · 480f)*

**"Every Sonicview has two internal expansion slots. A card slides into the rear bay and the
console starts speaking a new protocol natively. Which means the specification does not have to
predict the next standards migration — the console can follow the building as the building
changes."**

*(46 words · ~19 s.)*

---

### [00:30 – 00:50] — IF-ST2110 · the card
> *(chapter 03 · 600f)*

**"The IF-ST2110 puts the console onto the same IP fabric as the video. A plant that has already
moved its video to IP does not want an audio island sitting beside it."**

*[pause 0.6 s]*

**"Two media ports, a separate control port. Sixty-four by sixty-four at forty-eight kilohertz,
thirty-two by thirty-two at ninety-six."**

*(53 words · ~22 s including the pause.)*

---

### [00:50 – 01:12] — ST 2110 · what it carries
> *(chapter 04 · 660f)*

**"SMPTE ST 2110 is a suite, not a cable. Dash thirty carries uncompressed PCM audio, dash
thirty-one carries AES3 transparently, and AES67 keeps it interoperable. Video, audio and
ancillary data travel as separate essence streams on one network."**

*[pause 0.7 s]*

**"And ST 2022-7 sends the same essence down two independent paths at once, so a lost packet on
one path is never a lost sample on air."**

*(66 words · ~28 s including the pause.)*

---

### [01:12 – 01:30] — ST 2110 · control and sync
> *(chapter 05 · 540f)*

**"The card registers itself through NMOS IS-04 and accepts connection requests through IS-05, so
the facility's own broadcast controller patches it. Clock comes from the same PTP grandmaster the
cameras and the switcher follow — not from a separate audio clock distribution."**

*(43 words · ~18 s.)*

---

### [01:30 – 01:58] — ST 2110 · facility topologies
> *(chapter 06 · 840f)*

**"In a studio, control room, floor and master control sit on one fabric. In stadium remote
production, operators stay at base while the venue carries only the network. In an OB van, where
weight and rack space are the constraint, the card removes the converter rack the truck would
otherwise carry."**

*[pause 0.8 s]*

**"One card, the same role in all three. That is what makes it an architecture decision rather
than a product choice."**

*(72 words · ~30.5 s including the pause.)*

---

### [01:58 – 02:19] — IF-AE16 · AES/EBU
> *(chapter 07 · 690f)*

**"The IF-AE16 gives you sixteen channels in and sixteen out of AES/EBU on DB25 — the connection
every piece of digital outboard in a rack already has. Sample rate conversion is built into the
card, from thirty-two kilohertz to a hundred and ninety-two, so gear running on its own clock
connects without clicks or dropouts."**

*(55 words · ~22.5 s.)*

---

### [02:19 – 02:40] — IF-AN16/OUT · analog output
> *(chapter 08 · 630f)*

**"The IF-AN16/OUT adds sixteen analog line outputs — in-ear monitor racks, multi-zone
distribution amplifiers, anything that still wants line level. Each output has its own
attenuation, zero to minus fourteen decibels in half-decibel steps, so levels are matched at the
card."**

*(45 words · ~18.5 s.)*

---

### [02:40 – 03:03] — IF-MA64/EX · MADI
> *(chapter 09 · 690f)*

**"The IF-MA64/EX carries sixty-four channels each way over MADI — the interface large studio
routers and OB vans were wired for long before audio-over-IP existed. Optical and coaxial
connectors are both on the card, so it meets whichever the plant standardised on. None of that
infrastructure becomes stranded."**

*(51 words · ~21 s.)*

---

### [03:03 – 03:26] — IF-DA64 · expanded Dante
> *(chapter 10 · 690f — Dante branding beat lands here)*

**"And the IF-DA64 adds sixty-four more Dante channels each way, on top of the sixty-four already
built into the console. A hundred and twenty-eight by a hundred and twenty-eight in total, with
its own redundant primary and secondary ports — the capacity a stadium-scale network runs out of
first."**

*(51 words · ~21 s.)*

---

### [03:26 – 03:49] — Choosing between them
> *(chapter 11 · 690f)*

**"The choice is the building. An IP broadcast plant takes the ST2110. A rack of digital outboard
takes the AE16. In-ear and zone amplifiers take the AN16. An existing MADI router takes the MA64.
A large Dante network takes the DA64."**

*[pause 0.7 s]*

**"And two slots means two answers at once — a MADI router on one side and an IP fabric on the
other, with the mix engine between them doing the translation."**

*(74 words · ~31 s including the pause.)*

---

### [03:49 – 04:09] — Facility control integration
> *(chapter 12 · 600f)*

**"Fader position, mute state and device status are exchanged with the facility's control
management system. Clock status, temperature and fan status are monitored like any other
broadcast asset. The console sits alongside the router, the cameras and the video switcher — which
is where a broadcast engineer expects to find it."**

*(50 words · ~20.5 s.)*

---

### [04:09 – 04:29] — The complete architecture
> *(chapter 13 · 600f)*

**"So: the hub — 16XP, 24XP and the dp power-redundancy axis. The network — Dante and the SB-16D.
And the protocol layer — the IF-Series cards. A processing core that does not change, a transport
that reaches wherever the inputs are, and an interface layer that matches whatever the building
already speaks."**

*(52 words · ~21 s.)*

---

### [04:29 – 04:39] — Close of series
> *(chapter 14 · 300f)*

**"That is the complete Sonicview ecosystem. Console, network and protocol — one architecture."**

*(13 words · ~5.5 s — leave the rest for the sting.)*

---

### [04:39 – 04:58] — CTA and Shivansh Electronics outro
> *(chapter 15 · 510f — full contact block on screen)*

**"Architect the system before you specify it. Shivansh Electronics is TASCAM's authorized
partner, offering system design, protocol matching and infrastructure planning for the Sonicview
platform, across India."**

*[pause 0.8 s]*

**"Talk to the team about your facility."**

*(37 words · ~16 s including the pause.)*

---

## Compliance notes

- No pricing, MRP, cost or discount language anywhere in the script or on screen. The chapter-11
  headline was written as "the choice is the building, not the budget" and was cut back to "the
  choice is the building" specifically to keep cost framing out of the picture entirely.
- No competing console brand is named, alluded to, or implied.
- Shivansh Electronics is described only as **TASCAM's Authorized Partner** — never distributor,
  dealer or reseller.
- The CTA is a technical-consultation offer, not a purchase close.
- Every figure spoken here is a verified specification from the brief: 64 × 64 / 32 × 32 on the
  IF-ST2110, ST 2110-30 / -31, AES67, ST 2022-7, NMOS IS-04 / IS-05, PTP, 16 in / 16 out and
  32 kHz–192 kHz SRC on the IF-AE16, 16 analog outputs with 0 to −14 dB in 0.5 dB steps on the
  IF-AN16/OUT, 64 in / 64 out optical and coaxial MADI on the IF-MA64/EX, +64 / +64 for 128 × 128
  on the IF-DA64, and the card dimensions and weights where quoted.
- **IF-MA64/BN is deliberately not mentioned.** The brief documents it, but the asset set contains
  no photograph of it, so the video neither shows nor claims it. Its coaxial-BNC capability is
  covered honestly on the IF-MA64/EX, which physically carries both connector types.
