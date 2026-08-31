# Voiceover Script — Part 1 of 3 — The Computational Core

**Video:** `out/sonicview-part1.mp4`
**Runtime:** 298.000 s (8940 frames @ 30 fps) · 1920×1080
**Word count:** 412 words · ≈ 165 s at 150 wpm, leaving ≈ 133 s of deliberate silence
**Language:** English only

---

## Tone

Stage 9 of the research brief: "rigorous clinical precision, sounding like a senior
systems architect addressing professional engineering peers. Measured, data-heavy,
and unyielding in its technical authority." Commercial enthusiasm is explicitly
rejected.

**Delivery notes**

- 145–150 wpm. The figures are the content; do not rush them.
- "Dante" is *DAHN-tay*. "SB-16D" is *ess-bee sixteen-dee*. "Cat5e" is *cat five-E*.
- "µs" is *microseconds*, spoken in full. "dBu" is *dee-bee-you*.
- The SB-16D must never sound like a mixer. Where the script says "the console's
  input stage, moved", the stress is on **moved**.
- This narration is written to COMPLEMENT the on-screen copy, not to read it. Where
  a figure is already large on screen, the line around it carries the meaning.
- Do not lift into the CTA. It is the same voice, making an offer.

---

## Script

### [00:00 – 00:14]  p1-cold  ·  14s  ·  cold
> *on screen: TASCAM SONICVIEW — A node, not a desk*

**"A mixing console used to be a room full of copper with a surface on top. This one is a computation node that happens to have faders."**

*(27 words · budget 35)*

---

### [00:14 – 00:30]  p1-problem  ·  16s  ·  problem
> *on screen: THE BROADCAST CHALLENGE — Forty channels of transient peaks, summed onto one bus, live.*

**"Consider what a live bus actually has to survive. Forty channels of transient material, arriving together, summed in real time, with no opportunity to try again."**

*(26 words · budget 40)*

---

### [00:30 – 00:46]  p1-edge  ·  16s  ·  macro
> *on screen: WHERE ANALOG ENDS — Digitised at the chassis edge*

**"Every analog input is converted at the physical boundary of the chassis. Past that point there is no analog signal path left to protect — which changes what the rest of the design has to worry about."**

*(37 words · budget 40)*

---

### [00:46 – 01:06]  p1-hdia  ·  20s  ·  broll
> *on screen: CLASS 1 HDIA — Instrumentation grade*

**"The first gain stage is a true instrumentation amplifier. High input impedance, high common-mode rejection, and discrete components sized so the supply can deliver current when a transient asks for it."**

*(31 words · budget 50)*

---

### [01:06 – 01:28]  p1-demo-hdia  ·  22s  ·  demo
> *on screen: INSTRUMENTATION STAGE — What a difference amplifier rejects*

**"An instrumentation amplifier amplifies the difference between two inputs and rejects what is common to both. Interference induced on a cable run arrives on both legs equally, so it subtracts to nothing while the signal survives."**

*(36 words · budget 55)*

---

### [01:28 – 01:42]  p1-ein  ·  14s  ·  specs
> *on screen: MEASURED — -128 dBu or less*

**"Equivalent input noise of minus one hundred and twenty-eight dBu, with a maximum input level of plus thirty-two dBu."**

*(19 words · budget 35)*

---

### [01:42 – 01:56]  p1-adc  ·  14s  ·  broll
> *on screen: THE CONVERSION — Into thirty-two bits*

**"The preamps feed the converters directly. Thirty-two-bit analog to digital, twenty-four-bit back out, at ninety-six kilohertz throughout."**

*(17 words · budget 35)*

---

### [01:56 – 02:16]  p1-fpga  ·  20s  ·  hero
> *on screen: THE ENGINE — 54-bit floating point*

**"The mixing engine is a field-programmable gate array rather than a fixed-point DSP chip. That is a difference in kind: an array of gates configured to perform this specific arithmetic, in parallel, every sample."**

*(34 words · budget 50)*

---

### [02:16 – 02:40]  p1-demo-sum  ·  24s  ·  demo
> *on screen: THE SUMMING MATRIX — Forty-four channels, and the ceiling still not reached*

**"Fifty-four bits, allocated deliberately: forty-two carry amplitude, twelve are held above as headroom. The consequence is that the internal bus cannot be clipped, however many channels are summed into it."**

*(30 words · budget 60)*

---

### [02:40 – 02:54]  p1-headroom  ·  14s  ·  specs
> *on screen: THE ARITHMETIC — 42 + 12*

**"Twelve bits of margin, reserved and never spent."**

*(8 words · budget 35)*

---

### [02:54 – 03:12]  p1-latency  ·  18s  ·  broll
> *on screen: INTERNAL LATENCY — Two samples*

**"Two samples through the engine. At ninety-six kilohertz that is twenty-point-eight microseconds — short enough that in-ear monitoring stays phase-coherent."**

*(20 words · budget 45)*

---

### [03:12 – 03:26]  p1-roundtrip  ·  14s  ·  specs
> *on screen: ANALOG TO ANALOG — 0.51 ms*

**"Analog in to analog out, through conversion, processing and conversion again: half a millisecond."**

*(14 words · budget 35)*

---

### [03:26 – 03:42]  p1-channels  ·  16s  ·  statement
> *on screen: THE MATRIX — Forty-four in, thirty-two buses out*

**"Forty-four input channels, forty mono and two stereo, plus four effect returns. Twenty-two flexible buses that can be subgroups, auxiliaries or matrices, alongside the main pair and four effect sends."**

*(30 words · budget 40)*

---

### [03:42 – 03:56]  p1-dsp  ·  14s  ·  screen
> *on screen: PER CHANNEL, PER BUS — Processing that does not run out*

**"Every channel gets delay, phase, trim, a high-pass filter, gating, parametric EQ and compression. Every bus gets a graphic EQ, an analyser, compression and delay. None of it is a shared pool that runs out."**

*(35 words · budget 35)*

---

### [03:56 – 04:12]  p1-segregation  ·  16s  ·  broll
> *on screen: DISASTER RECOVERY — The audio outlives the interface*

**"The graphical operating system is separated from the engine. If the interface halts, the gate array keeps passing audio, keeps clocking the network, and keeps processing."**

*(26 words · budget 40)*

---

### [04:12 – 04:28]  p1-sixteen  ·  16s  ·  montage
> *on screen: THE SIXTEEN — 16 + 1 faders, two screens*

**"Sixteen faders, two screens, thirteen kilograms."**

*(6 words · budget 40)*

---

### [04:28 – 04:40]  p1-bridge  ·  12s  ·  montage
> *on screen: THE TWENTY-FOUR — Same engine, 24 + 1 faders, three screens*

**"Twenty-four faders, three screens, the same forty-four channels underneath."**

*(9 words · budget 30)*

---

### [04:40 – 04:58]  p1-outro  ·  18s  ·  outro
> *on screen: (end screen)*

**"Talk to the team about your facility."**

*(7 words · budget 45)*


---

## Compliance

- No pricing, MRP, cost or discount language anywhere in this script.
- No competing console brand named, alluded to or implied.
- Shivansh Electronics is described only as **Authorized Partner of TASCAM** — never distributor, dealer
  or reseller, and with no territory clause.
- The CTA is a technical-consultation offer, not a purchase close: "Talk to the team about your facility."
- Every figure spoken is VERIFIED in the Stage 8 master tables. Nothing the brief
  marks UNVERIFIED appears here or on screen.
