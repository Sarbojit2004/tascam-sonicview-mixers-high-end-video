# TASCAM Sonicview — B-Roll Generation Prompt Sheet

**For: Google Gemini / Veo image-to-video generation.**
Every clip is **exactly 10 seconds**, **16:9 source aspect**, generated **from the attached real
TASCAM product photograph(s)** named against each scenario.

Grounded in `TASCAM Sonicview Technical Research [DATED_ 30th AUGUST, 2026].docx` (Stages 1–10).
The older `TASCAM Sonicview Pre-Production Brief` is superseded and was not used.

---

## Final clip count: **14**

**Reasoning.** A scenario earns a slot only if it is (a) a genuinely distinct technical claim or
workflow from the research brief, and (b) anchored to a real photograph that actually shows the
thing being claimed. Working from Stage 4's six ranked features and Stage 7's five-phase arc, and
auditing the 166 real B-roll-eligible files against them, fourteen scenarios clear both bars.

The number is set by the library, not by a target:

- The Sonicview library is overwhelmingly **studio elevation photography on white** — superb for
  macro, orbit and rack-focus motion over real hardware, and that is where most of these clips sit.
- It is **thin on real-world environments**: only three usable in-situ photographs exist
  (Newport Jazz, the university conference room, and the FOH tablet shot). Two of those three are
  used; the third is a wide empty room with no Sonicview visible in frame and is not a B-roll
  candidate.
- Several strong-looking assets are **diagrams or marketing lockups**, not photography
  — for example `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (46).jpg` and
  `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (44).jpg` (control-system block diagrams),
  `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (5).jpg`
  (a radio signal-flow diagram), and `TASCAM Sonicview 16XP-24XP with IF-ST2110 (8).jpg`
  (a marketing lockup). Those belong in the Remotion edit as graphics; animating them as B-roll
  would be padding.
- Pushing to 16–17 (the Recording Series count) would mean a second fader beauty pass and a second
  SB-16D orbit. Those add runtime, not information.

Coverage check: all six Stage 4 ranked features are represented, and all four Stage 7 phases that
call for footage. Phase 5 (Technical Validation) is an end-card in the Remotion edit and correctly
generates no B-roll.

| Stage 4 rank | Feature | Clips |
|---|---|---|
| 1 | 54-bit floating-point FPGA engine | 03, 04 |
| 2 | Native Dante 64×64 & ST 2110 IP topologies | 05, 06, 07, 08 |
| 3 | Class 1 HDIA preamplifier topology | 02, 03 |
| 4 | Hardware & software disaster recovery | 14 |
| 5 | Broadcast automation logic | 09, 10, 13 |
| 6 | TASCAM VIEW HMI architecture | 11, 12 |
| — | Ecosystem establishing | 01 |

---

## One reconciliation you should know about

Stage 5 of the research brief calls for a **cold, clinical, high-contrast** grammar evoking a
"sterile server room or broadcast Master Control Room." Your production-base note requires
**white/light background throughout**, consistent with the MOTU and Recording Series productions.

These pull in opposite directions if read literally, so every prompt below resolves them the same
way, deliberately: **bright, clean, white-and-light-grey technical environments, lit cool.** White
seamless, pale grey acoustic panel, brushed aluminium, white laminate bench — with **cyan and cold
blue accents** arriving as edge-light, screen spill and specular highlights on the chassis rather
than as ambient darkness. The result is clinical and high-tech but light-keyed, so it cuts cleanly
against the white Remotion canvas. Two clips (05, 13) sit in darker rooms because their real anchor
photographs are dark and hardware fidelity outranks palette consistency there — both are flagged.

---

## The hardware fidelity contract

**Paste this block verbatim at the top of every one of the 14 prompts.** It is the single most
important part of the sheet — it is what keeps Gemini reproducing the real console instead of
inventing a generic mixer.

> Use the attached photograph(s) as an exact visual reference for the hardware. Reproduce the
> device precisely as photographed: the same chassis proportions and depth, the same matte
> dark-grey/black panel finish and metallic side trim, the same control layout and spacing, the
> same number and arrangement of faders, knobs, buttons and connectors, the same screen count and
> screen placement, and the same printed panel labelling in the same positions and the same
> typeface. Do not simplify, restyle, modernise, beautify or generify the hardware. Do not add,
> remove, resize or rearrange any control, port or marking. Do not invent screen content that is
> not consistent with the reference. Treat the photograph as a photograph of a real object that
> must survive intact into the video — the camera moves, the object does not change.

**And this negative block at the end of every prompt:**

> No on-screen text of any kind. No captions, subtitles, titles, lower-thirds, watermarks, logos,
> brand marks or graphic overlays added to the frame. No pricing, currency, numbers-as-graphics or
> commercial copy. No people speaking to camera. No competing brands or other manufacturers'
> equipment visible. Nothing may obscure the console. Do not letterbox or add bars.

---

# The 14 clips

---

## SV-BR-01 — "The Node, Not the Desk"
**Model:** Sonicview ecosystem (24 + 16 + SB-16D) · **Phase 1** · **Establishing**

**Real reference image(s):**
- `TASCAM SB-16D (1).jpg` *(primary — the three units together)*
- `TASCAM SONICVIEW DIGITAL RECORDING & MIXING CONSOLE OVERVIEW IMAGE.jpg` *(secondary — confirms relative scale and the 2-screen vs 3-screen distinction)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A slow, continuous 10-second cinematic dolly move across three pieces of TASCAM Sonicview
> hardware arranged on a bright white seamless studio floor: a Sonicview 24 digital mixing console
> with its three 7-inch colour touchscreens and 24+1 motorised 100mm faders in the foreground left,
> a smaller Sonicview 16 console with two touchscreens set behind and to the right, and a black
> SB-16D rack stagebox with its dense double row of XLR connectors sitting between and slightly
> behind them.
>
> Camera: a smooth motorised dolly travelling slowly left to right on a horizontal track at desk
> height, roughly 40 degrees off the consoles' front edge, with a very gentle simultaneous push-in.
> Constant speed, no easing, no handheld shake, no whip. Shallow-to-medium depth of field: the
> Sonicview 24's fader bank holds critical focus for the first four seconds, then focus racks
> smoothly back to bring the SB-16D and the Sonicview 16 into sharpness across seconds five to
> eight, holding on all three units in the final two seconds.
>
> Environment and light: a clean, bright, high-key product studio. White seamless backdrop, soft
> white overhead key, and a cold cyan-white edge light raking along the top edge of each chassis to
> pick out the metallic side trim and the matte finish of the fader tracks. Pale, neutral, almost
> clinical colour. Faint soft reflections of the units on the polished floor. No haze, no smoke, no
> coloured gels beyond the cool edge light. The touchscreens are powered and glowing with their
> characteristic blue and cyan channel-strip graphics, bright enough to read as active but not
> blown out.
>
> Mood: precise, engineered, calm. This is equipment being surveyed, not sold.
>
> [NEGATIVE BLOCK]

---

## SV-BR-02 — "Instrumentation Grade"
**Model:** Sonicview 24XP · **Phase 2** · **Stage 4 rank 3 — Class 1 HDIA**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` *(primary — full rear elevation: 24 XLR mic/line inputs with PUSH latches, LINE IN (BAL) TRS on 17–24, INSERT on 15/16)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro tracking shot travelling along the rear input bank of a TASCAM Sonicview 24
> console. The frame is filled by the horizontal row of black XLR mic/line input connectors, each
> with its chromed PUSH release latch and its engraved channel number, with the second row of
> quarter-inch LINE IN (BAL) TRS jacks and the two white-outlined INSERT points visible below.
>
> Camera: a macro lens on a slow linear slider, travelling right to left parallel to the panel at a
> constant, unhurried pace, holding the connectors at a slight three-quarter angle rather than dead
> square. Extremely shallow depth of field — two or three XLR sockets are razor sharp at any moment
> while the rest of the row falls away into smooth, structured bokeh in both directions. The move is
> perfectly steady, mechanical, no drift or wobble. No cuts.
>
> Environment and light: bright, clinical, high-key. The console sits on a white laminate technical
> bench against a pale grey wall. A hard, cold cyan-white key light rakes across the panel at a
> shallow angle from the left, catching the chrome of the PUSH latches and the machined rims of the
> XLR barrels as small, sharp specular glints that travel across frame as the camera moves. Soft
> white fill from the right keeps the black panel legible rather than crushed. The perforated
> ventilation grille above the connector row reads as fine, crisp texture.
>
> Mood: forensic, exacting, laboratory-clean. The feeling of inspecting a measurement instrument.
>
> [NEGATIVE BLOCK]

---

## SV-BR-03 — "Inside the Gain Stage"
**Model:** Sonicview platform internals · **Phase 2** · **Stage 4 ranks 1 & 3**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (37).jpg` *(primary — internal green PCB macro showing discrete components and the oversized capacitors the brief describes)*

> Note: this photograph is filed by TASCAM under three names, and all three files are
> byte-identical:
>
> - `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (37).jpg`
> - `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (39).jpg`
> - `TASCAM SB-16D (8).jpg`
>
> It is a platform-wide image of the Class 1 HDIA circuitry rather than an SB-16D-specific one,
> which is why it is used here to represent the console gain stage. Attach any one of the three.

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second extreme macro push-in across a populated green printed circuit board from inside
> TASCAM Sonicview hardware. The frame is dominated by rows of large cylindrical electrolytic
> capacitors, smaller surface-mount components, a black multi-pin header connector, and the fine
> gold-and-green traces of the board itself.
>
> Camera: a probe-style macro lens executing a single slow, continuous push-in that travels between
> two tall capacitors and continues deeper into the component field, as though flying through a
> miniature city. Very shallow depth of field with the plane of focus creeping forward through the
> board as the camera advances, so successive component rows resolve and then soften. Absolutely
> smooth, motorised, no handshake. No cuts, no speed change.
>
> Environment and light: bright and clean rather than dark and moody. A soft white top light lifts
> the green solder mask to a luminous, saturated green, while a narrow cold cyan accent light from
> the lower right throws long, precise shadows between the components and catches the metallic tops
> of the capacitors and the tin of the solder joints as small hard highlights. Background falls to a
> soft pale grey rather than black. Immaculately clean — no dust, no fingerprints, no scratches.
>
> Mood: the interior of something built to a standard. Silent, dense, deliberate engineering.
>
> [NEGATIVE BLOCK]

---

## SV-BR-04 — "Two Samples"
**Model:** Sonicview 24XP · **Phase 2** · **Stage 4 rank 1 — FPGA determinism**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (22).jpg` *(primary — top-down/high-angle of the full 24+1 motorised fader bank and surrounding controls)*
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (23).jpg` *(secondary — second angle on the same surface for control-layout confirmation)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second high-frame-rate shot of the motorised fader bank of a TASCAM Sonicview 24 console
> executing a snapshot recall. Twenty-four channel faders plus one master fader, all 100mm
> travel with ribbed grey caps, sit in their black slotted tracks with the illuminated channel
> select and mute buttons above them.
>
> Action: for the first three seconds the faders are static, scattered at varied heights. Then, in a
> single instantaneous event, every fader drives to a new position simultaneously — a fast, precise,
> perfectly synchronised mechanical sweep, captured in high-speed slow motion so the travel reads as
> smooth and deliberate rather than a jump. They arrive together and settle absolutely dead still,
> with no bounce, no overshoot, no drift. The final three seconds hold on the new, motionless
> configuration.
>
> Camera: a high, steep three-quarter angle looking down the length of the fader bank, on a slow
> lateral drift that continues at constant speed straight through the recall event — the camera does
> not react to the faders moving. Medium-shallow depth of field with the near third of the bank
> sharpest.
>
> Environment and light: bright, cool, clinical. A broad soft white key from above, plus a cold
> cyan-white edge light skimming along the fader caps so each one carries a thin bright rim that
> travels as they move. Pale grey surround. The channel buttons glow in their real colours; screens
> at the top of frame spill a faint blue.
>
> Mood: mechanical certainty. Machines obeying mathematics, instantly and identically.
>
> [NEGATIVE BLOCK]

---

## SV-BR-05 — "Primary and Secondary"
**Model:** Sonicview 16 · **Phase 3** · **Stage 4 rank 2 — Dante / ST 2022-7 redundancy**
*⚠ Dark-keyed by exception — the anchor photograph is a dark rear panel and hardware fidelity wins.*

**Real reference image(s):**
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (32).jpg` *(primary — extreme close-up of the Dante etherCON PRIMARY and SECONDARY ports with their PUSH latches, the Dante wordmark, adjacent XLR and BNC connectors)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro rack-focus across the network section of a TASCAM Sonicview rear panel. Two
> ruggedised etherCON RJ45 network ports sit side by side in chromed shells with sprung PUSH release
> latches above them, labelled PRIMARY and SECONDARY on the panel, with a three-pin XLR connector
> above and two silver BNC word-clock connectors to the right.
>
> Camera: begins tight on the PRIMARY port, holding it in razor-sharp critical focus while
> SECONDARY sits soft beside it. Across seconds three to six the focus racks slowly and precisely
> across to SECONDARY, reversing the sharpness. The camera simultaneously makes a very slight
> lateral drift to the right and an almost imperceptible push-in. In the final two seconds it pulls
> back a fraction so both ports read together, both acceptably sharp. Extremely shallow depth of
> field throughout. Perfectly smooth motorised motion, no shake.
>
> Environment and light: the panel is dark textured metal, so light does the work. A hard, narrow
> cold cyan key from the upper left rakes across the panel, catching the machined chrome of the
> etherCON shells, the knurling on the latches and the polished rims of the BNC connectors as bright
> specular highlights. Cool white fill from below keeps the panel texture and printed labelling
> legible. Background falls to soft neutral grey bokeh, not pure black.
>
> Mood: two identical paths, one purpose. Redundancy as a physical fact you can point at.
>
> [NEGATIVE BLOCK]

---

## SV-BR-06 — "The Card That Joins the Fabric"
**Model:** IF-ST2110 in Sonicview 24 · **Phase 3** · **Stage 4 rank 2 — ST 2110 / NMOS**

**Real reference image(s):**
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (28).jpg` *(primary — the IF-ST2110 card itself: green PCB, black anodised heatsink, cooling fan, faceplate with CONTROL, PORT 1, PORT 2)*
- `TASCAM Sonicview 16XP-24XP with IF-ST2110 (1).jpg` *(secondary — the card's faceplate elevation, for exact port and labelling reproduction)*
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (4).jpg` *(secondary — the console rear with SLOT 1 and SLOT 2 bays empty, for the receiving aperture)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot of a TASCAM IF-ST2110 expansion card being installed into the rear expansion bay
> of a Sonicview 24 console. The card is a green circuit board carrying a large black finned
> heatsink and a small cooling fan, terminating in a black metal faceplate with three RJ45 ports
> labelled CONTROL, PORT 1 and PORT 2, and two captive thumbscrews.
>
> Action: the card enters frame from the right, held level, and slides smoothly and slowly along the
> slot guides into the console's rear bay. It travels the full depth, decelerating as it seats, and
> comes to rest flush with the rear panel, its faceplate now continuous with the chassis. The
> movement is single, continuous and unhurried across the full ten seconds — no hands visible in
> frame, or at most the edge of a hand at the extreme frame edge, never obscuring the card.
>
> Camera: a low, tight three-quarter angle looking along the rear panel so the card travels away
> from camera into the slot, with a slow simultaneous push-in that follows it partway. Shallow depth
> of field with the faceplate and its three ports holding focus as the board behind it softens.
> Smooth motorised motion only.
>
> Environment and light: bright and clinical. White technical bench, pale grey surround, soft white
> overhead. A cold cyan accent light from the left catches the heatsink fins as a travelling ladder
> of highlights during the slide, and picks out the gold contact fingers on the board edge just
> before they disappear into the slot. Clean, dust-free, high-key.
>
> Mood: a precise mechanical commitment. The console becoming something new.
>
> [NEGATIVE BLOCK]

---

## SV-BR-07 — "Sixteen Inputs, One Run"
**Model:** SB-16D · **Phase 3** · **Stage 4 rank 2 — AoIP edge**

**Real reference image(s):**
- `TASCAM SB-16D (12).jpg` *(primary — full SB-16D at a three-quarter angle, both rows of XLR connectors and the corner protectors clearly visible)*
- `TASCAM SB-16D (15).jpg` *(secondary — front elevation for connector-count and labelling fidelity)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second slow orbit around a TASCAM SB-16D Dante stagebox. The unit is a short-depth black
> steel rack chassis with heavy moulded corner protectors at all four corners, carrying an upper row
> of sixteen female XLR mic/line inputs and a lower row of sixteen male XLR line outputs, with a
> small status and indicator section and printed channel numbering across the face.
>
> Camera: a smooth, constant-speed arc travelling roughly 45 degrees around the front of the unit
> from left to right, staying at a low angle just above the height of the connector rows so the
> XLRs stay dominant in frame and the chassis reads as long and low. Slight simultaneous rise. The
> complete unit stays fully within frame for the entire move — never cropped, never running off an
> edge. Medium depth of field: the connector rows stay legible along most of their length while the
> far end softens.
>
> Environment and light: bright high-key product studio. White seamless with a soft gradient, a
> broad white key from above and slightly front, and a cold cyan-white rim light from behind-left
> that separates the black chassis from the white ground and travels along the top edge as the
> camera arcs. Clean soft reflection beneath the unit. The status indicators glow faintly.
>
> Mood: purposeful, industrial, unglamorous. A working component, photographed with respect.
>
> [NEGATIVE BLOCK]

---

## SV-BR-08 — "Stacked at the Stage End"
**Model:** SB-16D · **Phase 3** · **Stage 4 rank 2 — deployment topology**

**Real reference image(s):**
- `TASCAM SB-16D (14).jpg` *(primary — two SB-16D units stacked, corner protectors interlocking)*
- `TASCAM SB-16D (9).jpg` *(secondary — SB-16D rack-mounted in a rack frame, for the rack-ear and 3U context)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot of two TASCAM SB-16D stageboxes stacked one directly on top of the other, their
> heavy moulded corner protectors interlocking so the upper unit sits positively located on the
> lower one, with a visible air gap between the two chassis bodies.
>
> Camera: begins as a tight macro on the interlocking corner protectors where the two units meet,
> filling the frame with the moulded ribs and the shadowed gap between them. Across the ten seconds
> the camera executes a single continuous slow pull-back and slight crane upward, progressively
> revealing the full height of the stack and then both complete units together, ending on a clean
> three-quarter view of the pair. Constant speed, motorised, no cuts. Focus follows the pull-back so
> the frame is sharp throughout.
>
> Environment and light: bright, clean, light-keyed technical space — pale grey floor, white wall,
> soft daylight-balanced overhead. A cold cyan edge light from the right defines the vertical
> shoulder line where the two chassis stack and rakes across the moulded texture of the corner
> protectors. High-key, no gloom, but strongly directional so the stacking geometry reads clearly.
>
> Mood: modular, rugged, made to be moved. Physical infrastructure.
>
> [NEGATIVE BLOCK]

---

## SV-BR-09 — "Gain, From the Desk"
**Model:** SB-16D + Sonicview · **Phase 3** · **Stage 4 rank 5 — remote preamp control**

**Real reference image(s):**
- `TASCAM SB-16D (13).jpg` *(primary — the Sonicview touchscreen displaying SB-16D remote control: device name header, sixteen channel strips with gain values, phantom power indicators)*
- `TASCAM SB-16D (7).jpg` *(secondary — two SB-16D units above a console screen showing the XLR array, for spatial relationship)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot of one of the TASCAM Sonicview 7-inch colour touchscreens displaying the remote
> preamp control page for a networked SB-16D stagebox: a header bar naming the connected device,
> then sixteen vertical channel strips side by side, each with its own numbered gain control,
> level indication and phantom-power state, rendered in the console's real interface colours.
>
> Action: the screen is live. Meters move with small, believable audio activity. Partway through,
> one channel's gain control is adjusted — the value steps and its strip highlights — and shortly
> after, a phantom-power indicator on a different channel changes state. Both changes are small,
> precise and instantaneous, the way a digital control surface responds, not smooth analogue drift.
> No hand or finger enters frame.
>
> Camera: a very slow push-in toward the screen, beginning with the whole display and its bezel in
> frame and ending tight enough that six or seven channel strips fill the width. Very slight
> parallax as the angle shifts a few degrees. Constant speed, motorised, no cuts. The screen stays
> crisply in focus and free of moiré, glare and reflected light sources — polarised, cleanly
> readable, anti-aliased.
>
> Environment and light: bright, cool, clinical control-room feel. Pale grey and white surround, soft
> even ambient so the screen is the brightest thing in frame without blooming. Cold cyan spill from
> the display across the surrounding panel and the tops of nearby controls.
>
> Mood: authority at a distance. Something on stage being adjusted by someone who is not.
>
> [NEGATIVE BLOCK]

---

## SV-BR-10 — "Tally to Fader"
**Model:** Sonicview 24XP · **Phase 3** · **Stage 4 rank 5 — GPIO / AFV automation**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` *(primary — the rear panel section carrying the GPIO DB25 connector, the WORD THRU/OUT and WORD IN BNC pair, the ETHERNET control port, USB to PC and FOOTSWITCH)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro shot of the control and synchronisation section of a TASCAM Sonicview 24 rear
> panel: a wide 25-pin D-sub GPIO connector with its two hex jackposts, a pair of silver BNC
> word-clock connectors labelled THRU/OUT and IN, a small RJ45 ETHERNET control port, a USB type-B
> socket and a quarter-inch FOOTSWITCH jack, all with their printed panel labelling.
>
> Camera: a macro lens making one continuous slow lateral track from the word-clock BNCs across to
> the GPIO D-sub, right to left, at constant speed and a slight downward tilt. Extremely shallow
> depth of field — the connector currently centred is critically sharp, everything either side
> dissolves into clean bokeh. In the last two seconds the move slows almost to rest with the full
> width of the GPIO connector held sharp, its individual pin sockets resolvable.
>
> Environment and light: bright and clinical. A hard cold cyan-white key from high left rakes along
> the panel, catching the machined rims of the BNCs and the plated shell and jackposts of the D-sub
> as tight travelling specular highlights. Cool white fill keeps the black panel and its white
> printed labelling readable. Pale grey background falloff. Immaculate — no dust, no scuffs.
>
> Mood: the physical terminals through which automation actually arrives. Unglamorous, decisive.
>
> [NEGATIVE BLOCK]

---

## SV-BR-11 — "Three Screens, One Engine"
**Model:** Sonicview 24 · **Phase 4** · **Stage 4 rank 6 — TASCAM VIEW**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (13).jpg` *(primary — front/high view showing all three 7-inch touchscreens and the surrounding encoder and button rows)*
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (21).jpg` *(secondary — second angle on the same surface for exact control-layout confirmation)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot travelling across the three 7-inch colour touchscreens of a TASCAM Sonicview 24
> console. Each screen carries the console's real interface: multi-channel strip views with level
> meters, parametric EQ curves and dynamics graphics in the console's characteristic blue, cyan,
> orange and yellow palette, framed by the rows of illuminated buttons and rotary encoders above and
> below them.
>
> Action: the displays are live — meters move with small realistic audio activity, an EQ curve is
> visible, indicators update. Nothing dramatic; the interface simply behaves like a running console.
>
> Camera: a slow lateral dolly from the leftmost screen to the rightmost, parallel to the surface at
> a shallow three-quarter angle so each screen passes through the frame in turn with real parallax
> against the controls in front of it. Constant speed, one continuous move, no cuts. Focus holds on
> the screen plane throughout, so each display is crisp and legible as it passes — no moiré, no
> rolling shutter banding, no glare, no reflected lights across the glass.
>
> Environment and light: bright, cool and clinical. Pale grey and white surround, soft even ambient
> from above so the panel reads clearly, with the screens themselves the brightest elements without
> blooming. Cold cyan screen spill catches the ridged tops of the encoder caps and the edges of the
> button rows. A restrained cold rim light along the console's top edge.
>
> Mood: dense, information-rich, entirely under control.
>
> [NEGATIVE BLOCK]

---

## SV-BR-12 — "The Layer Beneath"
**Model:** Sonicview 24 · **Phase 4** · **Stage 4 rank 6 — fader layers / DCA spill**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (6).jpg` *(primary — the surface showing the fader bank and the layer/DCA relationship)*
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (8).jpg` *(secondary — equivalent view on the 16-fader surface, for layout confirmation)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot of a TASCAM Sonicview console fader bank changing layer. The frame holds a run of
> motorised 100mm faders with ribbed grey caps in their black tracks, the illuminated select and
> mute buttons above each one, and the small per-channel name displays.
>
> Action: the bank sits still in one configuration for the first three seconds. Then every fader
> moves at once to a completely different set of positions, and simultaneously the illuminated
> buttons above them change colour and the per-channel name displays change content — the whole
> surface reassigning itself in one instant. The faders travel fast, precisely and in perfect
> unison, then stop absolutely dead with no settle. The last four seconds hold on the new layer,
> static.
>
> Camera: a low, raking angle along the length of the bank so the fader caps recede in a strong
> diagonal, with a slow continuous push-in that runs straight through the layer change without
> reacting to it. Shallow depth of field, the nearest three or four faders critically sharp.
>
> Environment and light: bright, cool, clinical. Soft broad white key from above, a cold cyan edge
> light skimming the fader caps so each carries a thin travelling rim during the move, pale grey
> surround. Button illumination reads in its real colours against the cool ambient.
>
> Mood: one surface, many configurations. Instant, total, obedient reassignment.
>
> [NEGATIVE BLOCK]

---

## SV-BR-13 — "Anywhere on the Network"
**Model:** Sonicview 24 · **Phase 4** · **Stage 4 rank 5 — remote operation**
*⚠ Dark-keyed by exception — the anchor is a real low-light venue photograph and it is the strongest in-situ asset in the library.*

**Real reference image(s):**
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (4).jpg` *(primary — an engineer holding a tablet running the Sonicview control application, with the console glowing on its stand in the background)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot in a working venue. In the foreground, seen from just behind and over the
> shoulder, a sound engineer holds a tablet running the TASCAM Sonicview control application — a
> multi-channel mixing interface with vertical faders, channel labels and meters, exactly as shown
> in the reference. In the mid-background, elevated on its stand, the Sonicview console itself glows
> with its touchscreens and illuminated buttons.
>
> Action: the engineer's thumb makes one small, precise adjustment to a fader on the tablet, and the
> interface responds immediately. Nothing else moves. No speech, no face to camera — the engineer is
> a silhouette and a pair of hands only.
>
> Camera: a slow, shallow push-in over the shoulder that gradually shifts the emphasis from the
> tablet in the foreground to the console glowing behind it, with a gentle focus rack in the final
> three seconds from the tablet screen back to the console. Handheld feel is not wanted — smooth
> gimbal motion, quiet and steady.
>
> Environment and light: a dark auditorium. The tablet screen is the dominant light source on the
> engineer's hands and face-edge, cold and bluish; the console in the background is a compact
> cluster of blue, cyan and warm indicator light. A single distant warm practical light in the far
> background gives depth. Deep shadow elsewhere, but the tablet interface and the console remain
> clearly legible — no crushed blacks over the hardware itself.
>
> Mood: quiet competence. The room is running and one person is steering it from where they stand.
>
> [NEGATIVE BLOCK]

---

## SV-BR-14 — "The Second Supply"
**Model:** Sonicview 24dp · **Phase 4/5** · **Stage 4 rank 4 — disaster recovery**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (10).jpg` *(primary — the dp rear panel power section: the 4-pin EXT DC IN connector with its printed `EXT DC IN 14-27V / 6-3A` legend and pin key, immediately beside the `~ IN` AC inlet and the POWER rocker switch)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro shot of the power section of a TASCAM Sonicview 24dp rear panel. Two power
> inlets sit side by side on the black panel: a round four-pin locking DC input connector in a
> chromed shell, recessed in its own labelled sub-panel with a small ventilation grille beside it,
> and to its right a standard three-pin AC mains inlet, with a rocker POWER switch below and to the
> right of both.
>
> Camera: opens tight and critically sharp on the four-pin DC connector, its chromed shell and the
> arrangement of its pins filling much of the frame. Across seconds three to seven the focus racks
> slowly right to the AC inlet while the camera drifts a small distance in the same direction, so the
> two inlets trade sharpness. In the final three seconds the camera eases back very slightly to hold
> both inlets and the power switch together in one frame. Extremely shallow depth of field, smooth
> motorised motion, no cuts.
>
> Environment and light: bright and clinical. A hard cold cyan-white key from the upper left rakes
> across the panel, catching the chromed rim of the DC connector, the plated pins inside it and the
> edge of the rocker switch as tight specular highlights, while cool white fill from below keeps the
> panel's printed labelling crisply legible. Pale neutral grey falloff behind. Spotless.
>
> Mood: two ways in, so there is never no way in. Understated, structural reassurance.
>
> [NEGATIVE BLOCK]

---

# Reference table — clip to source image

| Clip | Scenario | Model represented | Real source image filename(s) |
|---|---|---|---|
| SV-BR-01 | The Node, Not the Desk | Ecosystem (24 + 16 + SB-16D) | `TASCAM SB-16D (1).jpg` · `TASCAM SONICVIEW DIGITAL RECORDING & MIXING CONSOLE OVERVIEW IMAGE.jpg` |
| SV-BR-02 | Instrumentation Grade | Sonicview 24XP | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` |
| SV-BR-03 | Inside the Gain Stage | Sonicview platform internals | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (37).jpg` |
| SV-BR-04 | Two Samples | Sonicview 24XP | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (22).jpg` · `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (23).jpg` |
| SV-BR-05 | Primary and Secondary | Sonicview 16 | `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (32).jpg` |
| SV-BR-06 | The Card That Joins the Fabric | IF-ST2110 in Sonicview 24 | `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (28).jpg` · `TASCAM Sonicview 16XP-24XP with IF-ST2110 (1).jpg` · `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (4).jpg` |
| SV-BR-07 | Sixteen Inputs, One Run | SB-16D | `TASCAM SB-16D (12).jpg` · `TASCAM SB-16D (15).jpg` |
| SV-BR-08 | Stacked at the Stage End | SB-16D | `TASCAM SB-16D (14).jpg` · `TASCAM SB-16D (9).jpg` |
| SV-BR-09 | Gain, From the Desk | SB-16D + Sonicview | `TASCAM SB-16D (13).jpg` · `TASCAM SB-16D (7).jpg` |
| SV-BR-10 | Tally to Fader | Sonicview 24XP | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` |
| SV-BR-11 | Three Screens, One Engine | Sonicview 24 | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (13).jpg` · `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (21).jpg` |
| SV-BR-12 | The Layer Beneath | Sonicview 24 (+16 ref) | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (6).jpg` · `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (8).jpg` |
| SV-BR-13 | Anywhere on the Network | Sonicview 24 | `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (4).jpg` |
| SV-BR-14 | The Second Supply | Sonicview 24dp | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (10).jpg` |

**Model distribution:** Sonicview 24 (XP/dp) 7 · SB-16D 3 · Sonicview 16 (XP/dp) 2 · IF-ST2110 1 ·
ecosystem 1. Weighted toward the 24 because it is the flagship, has the largest and most varied
photo set, and is the only variant with three touchscreens; the 16 shares an identical internal
architecture per Stage 1, so duplicating architecture clips on both chassis would add no information.

---

# On acceptance

When the generated clips come back, each should be checked for:

1. **Duration** — close to 10.0 s. Anything that drifts meaningfully gets regenerated, not trimmed.
2. **Hardware fidelity** — the console in the clip must still be the console in the photograph.
   Check fader count, screen count, connector count and arrangement, and printed labelling. A clip
   that has invented a control, dropped a screen, or turned the panel into a generic mixer is
   rejected and regenerated. This is the core quality bar for the whole approach.
3. **Clean frame** — no text, captions, watermarks, logos or pricing anywhere in the generated
   footage.

Send them back and I will run those checks and log the results.

---
---

# Addendum — clips 15 to 20 (six additional)

Added on request when further generation capacity became available. **Total library: 20 clips.**

These six were the next-strongest scenarios in the ranking, held back from the original fourteen
only by capacity. Each is a genuinely distinct technical claim with its own real anchor, and none
repeats a camera move or a subject already covered. Two deliberately reuse a photograph already cited
(`TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (21).jpg` in clip 11, and
`TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` in clips 02 and 10) but frame a
**different region of the same panel** — the right-hand key cluster rather than the screens, the card bay rather than the
XLR bank — so they are new shots, not second passes.

| Clip | Adds | Stage grounding |
|---|---|---|
| 15 | Assignable User Keys and Layer Keys with LED state | Stage 1 Control Surface · Stage 4 rank 6 |
| 16 | 32-track direct-to-SDXC via IF-MTR32 | Stage 1 Recording and Multitrack Capability |
| 17 | The full IF-Series card family as one protocol layer | Stage 3 identity · Stage 4 rank 2 |
| 18 | One engine, two chassis footprints (16 vs 24) | Stage 1 Inter-Lineup Relationship |
| 19 | Real deployment, real engineer, real venue | Stage 7 Phase 5 validation |
| 20 | The physical act of making the network connection | Stage 4 rank 2 |

Same **hardware fidelity contract** at the top of every prompt and same **negative block** at the
bottom — both unchanged from the main sheet above.

---

## SV-BR-15 — "Assigned"
**Model:** Sonicview 24 · **Phase 4** · **Stage 4 rank 6 — User Keys / Layer Keys**

**Real reference image(s):**
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (21).jpg` *(primary — the right-hand control cluster: the USER KEYS block lettered A to F, the numbered USER KEYS column, the LAYER KEYS column, HOME / MENU / TALKBACK, the MONITOR OUT encoder and the meter bridge)*
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (22).jpg` *(secondary — second angle on the same cluster for exact key positions)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro shot of the right-hand control cluster of a TASCAM Sonicview 24 console. In
> frame: a block of six square backlit user keys arranged two rows of three and lettered A to F, a
> vertical column of numbered backlit keys beside the channel SOLO and SEL buttons, a further
> vertical column of layer keys below that, three small function buttons above, a rotary monitor
> encoder, and the segmented LED meter bridge at the top of frame.
>
> Action: the keys are illuminated and live. Over the ten seconds, three separate keys change state
> in sequence — each one switching colour crisply and instantly, with no fade or glow ramp, the way
> an LED-backlit key actually behaves. Between the changes nothing moves. The meter bridge segments
> flicker with small realistic audio activity throughout. No hand or finger enters frame.
>
> Camera: a slow, shallow arc drifting from lower left to upper right across the cluster, holding a
> steep three-quarter angle so the keys read as raised physical objects with real depth and cast
> shadow rather than as a flat graphic. Very gentle simultaneous push-in. Shallow depth of field —
> the lettered key block is critically sharp for the first half, then focus eases back to bring the
> numbered column and layer keys into sharpness. Smooth motorised motion, one continuous take.
>
> Environment and light: bright, cool and clinical. Soft broad white key from above so the dark
> panel and its white legends stay legible, a cold cyan rim skimming across the raised key caps to
> define their edges, pale grey falloff behind. The key illumination is the most saturated colour in
> frame and should read cleanly against the cool neutral ambient without blooming.
>
> Mood: a surface that has been configured by someone who knows exactly what they want where.
>
> [NEGATIVE BLOCK]

---

## SV-BR-16 — "Thirty-Two Tracks, No Computer"
**Model:** IF-MTR32 in Sonicview · **Phase 2/4** · **Stage 1 — Recording and Multitrack Capability**

**Real reference image(s):**
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (40).jpg` *(primary — the IF-MTR32 multitrack recording card: green PCB, black faceplate, SDXC card slot with its PUSH EJECT legend)*
- `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` *(secondary — the console rear with the IF-MTR32 fitted in its slot, for the installed context and surrounding panel labelling)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro shot of an SDXC memory card being inserted into the card slot of a TASCAM
> IF-MTR32 multitrack recording card installed in the rear panel of a Sonicview console. The
> faceplate carries the slot, its printed legend and a small indicator, set into the console's black
> rear panel between the surrounding connector fields.
>
> Action: the memory card enters from the right, held level, and slides smoothly into the slot in one
> continuous unhurried movement, decelerating as it goes home and seating with a small final travel.
> It comes to rest almost flush, with only its end edge proud of the faceplate. The activity
> indicator beside the slot begins to blink steadily once the card is seated. No hands visible, or at
> most the very edge of fingertips at the extreme frame edge, never covering the slot.
>
> Camera: a tight macro at a shallow three-quarter angle looking along the faceplate so the card
> travels away from camera into the slot, with a very slow simultaneous push-in that follows it part
> of the way. Extremely shallow depth of field, the slot mouth and the card's leading edge holding
> critical focus while the surrounding panel softens. Perfectly steady motorised motion, no cuts.
>
> Environment and light: bright, clinical, high-key. A cold cyan-white key from the upper left rakes
> across the panel and catches the moulded edge of the memory card and the machined lip of the slot
> as tight specular highlights; cool white fill from below keeps the printed legend legible. Pale
> grey falloff behind. Spotless — no dust, no fingerprints.
>
> Mood: a self-contained machine. The recording happens here, in this slot, with nothing else
> attached.
>
> [NEGATIVE BLOCK]

---

## SV-BR-17 — "The Protocol Layer"
**Model:** IF-Series expansion cards (AE16 / AN16-OUT / DA64 / MA64-EX / ST2110) · **Phase 3** · **Stage 3 identity · Stage 4 rank 2**

**Real reference image(s):**
- `TASCAM IF-AE16 (1).jpg` *(AES/EBU — twin DB25, labelled 1-8 I/O and 9-16 I/O)*
- `TASCAM IF-AN16 OUT (1).jpg` *(analog out — twin DB25, labelled ANALOG OUT)*
- `TASCAM IF-DA64 (1).jpg` *(expanded Dante — PRIMARY and SECONDARY etherCON)*
- `TASCAM IF-MA64 EX (1).jpg` *(MADI — three BNC coaxial connectors plus duplex optical)*
- `TASCAM Sonicview 16XP-24XP with IF-ST2110 (1).jpg` *(ST 2110 — CONTROL, PORT 1, PORT 2)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second overhead shot of five TASCAM IF-Series expansion card faceplates laid out side by side
> in a neat row on a bright white surface, each one a black anodised plate with captive thumbscrews
> and its own distinct connector set: one with two 25-pin D-sub connectors labelled for AES/EBU
> input and output, one with two 25-pin D-sub connectors labelled for analog output, one with two
> RJ45 network ports labelled PRIMARY and SECONDARY, one with three silver BNC coaxial connectors
> alongside a duplex optical connector, and one with three RJ45 ports labelled CONTROL, PORT 1 and
> PORT 2. Each card must reproduce exactly the connectors and printed labelling shown in its own
> reference photograph — do not swap connectors between cards or give any card a port it does not
> have.
>
> Camera: a straight-down overhead view, slowly tracking along the row from the first card to the
> last at constant speed, holding the plane of the faceplates parallel to the sensor so the layout
> reads as a clean technical comparison. Very slight simultaneous descent so the cards grow a little
> in frame across the move. Medium-shallow depth of field: the card currently centred is critically
> sharp, its neighbours slightly soft at the edges of frame. One continuous motorised take.
>
> Environment and light: bright, clinical, high-key. White surface, soft broad white key from above,
> and a cold cyan raking light from the left that runs across the row picking out the machined shells
> of the D-sub connectors, the chrome of the BNC barrels, the ceramic of the optical connector and
> the plated contacts inside the RJ45 ports. Crisp, short shadows directly beneath each card. Pale
> neutral colour throughout.
>
> Mood: a set of options laid out for a decision. Five different buildings, five different answers.
>
> [NEGATIVE BLOCK]

---

## SV-BR-18 — "One Engine, Two Footprints"
**Model:** Sonicview 16 and Sonicview 24 together · **Phase 1/4** · **Stage 1 — Inter-Lineup Relationship**

**Real reference image(s):**
- `TASCAM SB-16D (3).jpg` *(primary — a Sonicview 16 and a Sonicview 24 shown together at an angle, correct relative scale, 2 screens versus 3 screens, 16+1 versus 24+1 faders)*
- `TASCAM SONICVIEW DIGITAL RECORDING & MIXING CONSOLE OVERVIEW IMAGE (1).jpg` *(secondary — confirms proportions and surface layout of both)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot of two TASCAM Sonicview consoles standing side by side on a bright white surface:
> the smaller Sonicview 16 with two 7-inch colour touchscreens and sixteen channel faders plus a
> master fader, and the larger Sonicview 24 with three touchscreens and twenty-four channel faders
> plus a master. Both are the same depth and the same height with the same wedge profile, the same
> panel finish and the same control layout — only the width and the screen and fader counts differ.
> That similarity is the point of the shot and must be preserved exactly.
>
> Camera: a slow lateral dolly moving from the Sonicview 16 across to the Sonicview 24, travelling
> parallel to their front edges at just above surface height so the two wedge profiles align in the
> frame and the difference in width reads clearly against their identical height and depth. Constant
> speed, one continuous take, no cuts. Both consoles remain complete within frame throughout —
> neither is ever cropped by an edge. Medium depth of field so both surfaces stay readable.
>
> Environment and light: bright, high-key product studio. White seamless with a soft gradient, broad
> soft white key from above and front, and a cold cyan-white rim light along the top edge of both
> chassis that travels as the camera moves, separating them from the white ground. Soft reflections
> beneath both units. The touchscreens on both consoles are powered and showing their characteristic
> blue and cyan channel graphics.
>
> Mood: two sizes of the same idea. A scale decision, not a capability decision.
>
> [NEGATIVE BLOCK]

---

## SV-BR-19 — "In Service"
**Model:** Sonicview 24XP · **Phase 5** · **Stage 7 — technical validation, real deployment**
*⚠ Two cautions on this one — read the note under the prompt.*

**Real reference image(s):**
- `TASCAM's Sonicview 24XP Helps Steve Remote Thrive at the 2023 Newport Jazz Festival.jpg` *(primary — a working audio engineer seated at a Sonicview 24 in a wood-panelled remote-production room)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second observational shot of a working audio engineer operating a TASCAM Sonicview 24 console
> in a remote-production room with warm wood-panelled walls. The engineer is seated at the console,
> seen from a three-quarter rear angle over his shoulder, working — not looking at or addressing the
> camera at any point. The console fills the lower half of frame with its three touchscreens lit and
> its fader bank in front of him.
>
> Action: the engineer makes two small, unhurried adjustments — a hand moves to a fader and rides it
> a short distance, then moves to the touchscreen and makes a single contact. Entirely natural
> working movement, no performance, no gesturing, no turning toward camera.
>
> Camera: a slow push-in from behind the engineer's shoulder, starting wide enough to include the
> whole console and the room around it and ending closer on the console surface and his hands. Very
> gentle, quiet gimbal motion — no handheld shake, no whip, no cuts. Focus stays on the console and
> the hands; the engineer's head and the room behind remain slightly soft throughout.
>
> Environment and light: the room is warm and wood-toned, lit softly and evenly, with the console's
> screens providing the cool blue-cyan accent that draws the eye. Keep the background at a shallow
> depth of field so wall surfaces, signage and any framed or illuminated graphics behind the
> engineer are rendered as soft, unreadable shapes — no legible words, marks or symbols anywhere in
> the background.
>
> Mood: unglamorous professional competence. A real room, a real session, a real engineer at work.
>
> [NEGATIVE BLOCK]

> **Two cautions specific to this clip.**
>
> 1. The reference photograph contains an **illuminated third-party company sign** on the back wall.
>    That must not be reproduced legibly — hence the explicit instruction to hold the background
>    soft and unreadable. Reject any returned clip where background signage or lettering can be
>    made out.
> 2. The person in the reference is **facing camera**. The prompt deliberately reorients him to a
>    rear three-quarter working position, both to satisfy the no-person-addressing-camera rule and
>    because a working shot cuts better than a portrait. Expect this clip to need more regeneration
>    attempts than the others; it is the only one asking Gemini to change a subject's orientation.

---

## SV-BR-20 — "Seating the Run"
**Model:** Sonicview 16 / SB-16D · **Phase 3** · **Stage 4 rank 2 — the physical network connection**

**Real reference image(s):**
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (32).jpg` *(primary — the Dante etherCON PRIMARY and SECONDARY ports at extreme close range, with their PUSH release latches and the panel labelling)*
- `TASCAM SB-16D (6).jpg` *(secondary — the SB-16D rear network and power section, for the stagebox end of the same connection)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second extreme macro shot of a ruggedised locking Ethernet cable connector being inserted
> into the PRIMARY network port on a TASCAM Sonicview rear panel. The port is a chromed etherCON
> shell with a sprung PUSH release latch above it, with the SECONDARY port immediately alongside and
> the panel labelling clearly printed beneath both.
>
> Action: the cable connector enters from the right, aligned and level, and pushes home into the port
> in one smooth continuous movement. As it seats, the sprung latch engages with a small, crisp
> mechanical travel and the connector stops absolutely dead — a positive, locked termination, not a
> loose push-fit. The cable then hangs still. The whole action occupies roughly the middle four
> seconds; the shot opens on the empty port and closes on the seated, locked connector. No hands in
> frame beyond the very edge, never obscuring the port.
>
> Camera: an extreme macro at a shallow angle along the panel so the connector travels away from
> camera into the port, with a very slight push-in through the move. Razor-thin depth of field held
> on the port mouth and the latch, so the seating action is the sharpest thing in frame while the
> cable body and the adjacent SECONDARY port fall soft. Motorised, absolutely steady, one take.
>
> Environment and light: bright and clinical rather than dark. A hard cold cyan-white key from the
> upper left picks out the chrome of the etherCON shell, the knurled grip of the cable connector and
> the sprung latch as sharp specular highlights that shift as the connector advances; cool white fill
> from below keeps the black panel texture and printed labelling readable. Pale neutral grey falloff.
>
> Mood: the small decisive moment where infrastructure actually becomes infrastructure.
>
> [NEGATIVE BLOCK]

---

## Updated reference table — clips 15 to 20

| Clip | Scenario | Model represented | Real source image filename(s) |
|---|---|---|---|
| SV-BR-15 | Assigned | Sonicview 24 | `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (21).jpg` · `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (22).jpg` |
| SV-BR-16 | Thirty-Two Tracks, No Computer | IF-MTR32 in Sonicview | `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (40).jpg` · `TASCAM Sonicview 24XP - TASCAM Sonicview 24dp (18).jpg` |
| SV-BR-17 | The Protocol Layer | IF-Series card family | `TASCAM IF-AE16 (1).jpg` · `TASCAM IF-AN16 OUT (1).jpg` · `TASCAM IF-DA64 (1).jpg` · `TASCAM IF-MA64 EX (1).jpg` · `TASCAM Sonicview 16XP-24XP with IF-ST2110 (1).jpg` |
| SV-BR-18 | One Engine, Two Footprints | Sonicview 16 + 24 | `TASCAM SB-16D (3).jpg` · `TASCAM SONICVIEW DIGITAL RECORDING & MIXING CONSOLE OVERVIEW IMAGE (1).jpg` |
| SV-BR-19 | In Service | Sonicview 24XP | `TASCAM's Sonicview 24XP Helps Steve Remote Thrive at the 2023 Newport Jazz Festival.jpg` |
| SV-BR-20 | Seating the Run | Sonicview 16 / SB-16D | `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (32).jpg` · `TASCAM SB-16D (6).jpg` |

**Library totals after the addendum — 20 clips.**
Sonicview 24 (XP/dp) 9 · SB-16D 3 · Sonicview 16 (XP/dp) 3 · IF-Series cards 3 · ecosystem 2.

**Stage 4 coverage after the addendum**

| Rank | Feature | Clips |
|---|---|---|
| 1 | 54-bit floating-point FPGA engine | 03, 04 |
| 2 | Native Dante 64×64 & ST 2110 IP topologies | 05, 06, 07, 08, 17, 20 |
| 3 | Class 1 HDIA preamplifier topology | 02, 03 |
| 4 | Hardware & software disaster recovery | 14 |
| 5 | Broadcast automation logic | 09, 10, 13 |
| 6 | TASCAM VIEW HMI architecture | 11, 12, 15 |
| — | Recording / multitrack | 16 |
| — | Lineup scale & ecosystem | 01, 18 |
| — | Real-world validation | 19 |

---
---

# Addendum 2 — clips 21 to 24 (four additional)

**Total library: 24 clips.**

## Correction to the count reasoning above

The original reasoning said the library holds "only three usable in-situ photographs." **That was
wrong**, and re-auditing the case-study sets for this addendum found **six**:

| File | What it actually shows |
|---|---|
| `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (2).jpg` | A working radio studio — operator at a Sonicview 16, playout monitors, boom mic |
| `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (3).jpg` | Tight on the same installed Sonicview 16 surface in that studio |
| `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16.jpg` | A Sonicview 16 mounted in an open wheeled flight-case rack |
| `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (5).jpg` | A real wood-panelled control room with the console on a desk |
| `TASCAM's Sonicview 24XP Helps Steve Remote Thrive at the 2023 Newport Jazz Festival.jpg` | Engineer at a 24XP in a remote-production room *(used in clip 19)* |
| `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16.jpg` | Two operators at the console in the radio studio *(letterboxed source)* |

I had classified the whole radio set as diagrams after seeing only the signal-flow file. Three of
these six are genuinely strong real-world anchors, and two of them carry clips 21 and 22 below. The
fourteen-clip figure was not wrong for the reasons given, but that particular reason was.

Also worth recording: `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (1).jpg`,
`Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (2).jpg` and
`Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (3).png` are **screen captures of the VIEW
interface itself** — channel strips, a parametric EQ curve, a dynamics graph, meters — not room
photography. Clip 23 uses them, which is what Stage 5's "Screen Legibility as Subject" instruction
actually asks for.

Same **hardware fidelity contract** and **negative block** apply, unchanged.

---

## SV-BR-21 — "On Air"
**Model:** Sonicview 16 · **Phase 5** · **Stage 2 broadcast buyer · Stage 7 validation**
*⚠ Heavy legible third-party signage in the reference — see the caution below.*

**Real reference image(s):**
- `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (2).jpg` *(primary — the working radio studio: operator seated at a Sonicview 16, playout monitors either side, studio condenser on a boom arm, equipment rack at right)*
- `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (3).jpg` *(secondary — tight on the same installed console surface, for exact layout in situ)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second observational shot inside a working radio broadcast studio. A TASCAM Sonicview 16
> digital mixing console sits angled on a white studio desk, its two touchscreens and channel name
> displays lit. A presenter-operator in a dark polo shirt and over-ear headphones is seated at the
> desk, back three-quarters to camera, working the console. A large studio condenser microphone on a
> boom arm reaches in from the left, and computer monitors running playout software flank the
> console on both sides. An equipment rack stands to the right.
>
> Action: the operator makes one small fader adjustment on the console and then reaches to a
> touchscreen. Entirely natural working movement — no performance, no turning toward camera, no
> speech. The console's screens and channel displays stay live throughout with small realistic meter
> activity.
>
> Camera: a slow push-in from behind and slightly above the operator's right shoulder, starting wide
> enough to hold the whole desk and ending closer on the console surface and the operator's hands.
> Very gentle, quiet gimbal motion — no handheld shake, no whip, no cuts. Focus stays on the console;
> the operator's head and the room behind stay soft.
>
> Environment and light: a real working room, not a studio set — mixed practical lighting, grey
> carpet tile, an office chair. The console's own screens and the computer monitors provide the cool
> blue accent. Keep everything beyond the desk at shallow depth of field so wall banners, posters,
> rack equipment labels and any station graphics behind the operator render as soft, unreadable
> colour — no legible words, logos or symbols anywhere in the background.
>
> Mood: an ordinary shift in a room that cannot go quiet. Competent, unremarkable, real.
>
> [NEGATIVE BLOCK]

> **Caution.** The reference photograph contains extensive legible third-party station branding on
> wall banners and on the rack equipment. The prompt holds all of it soft and unreadable. Reject any
> returned clip where background lettering, logos or QR codes can be made out.

---

## SV-BR-22 — "Cased and Rolling"
**Model:** Sonicview 16 · **Phase 4** · **Stage 2 — deployment reality**
*⚠ Other manufacturers' rack gear sits below the console in the reference — frame excludes it.*

**Real reference image(s):**
- `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16.jpg` *(primary — a Sonicview 16 mounted in an open wheeled flight-case rack, lid folded back, in a real venue)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second shot of a TASCAM Sonicview 16 console mounted into the top of a heavy black wheeled
> flight-case rack, its hinged lid folded back and the case's aluminium extrusion corners, butterfly
> latches and ball corners clearly visible around it. The console sits proud in the case at its
> working angle, two touchscreens and channel name displays lit, sixteen faders plus master ready to
> hand.
>
> Framing constraint: hold the shot tight enough that the **console and the upper part of the flight
> case fill the frame**. Do not include the lower rack bays or any equipment mounted below the
> console — the frame stops at the console's own case shelf.
>
> Camera: a slow crane-down and simultaneous gentle push-in, beginning high and looking down across
> the open case at the console, ending at a lower, flatter three-quarter angle where the fader bank
> and the two screens read clearly. One continuous motorised move at constant speed, no cuts.
> Medium-shallow depth of field: the console surface holds focus, the case latches and lid edge
> soften at frame edge.
>
> Environment and light: a real interior rather than a studio — a pale stone or tiled floor and a
> warm wood-panelled wall behind, lit by soft even ambient daylight. The console's screens are the
> cool blue accent against that warmth. A restrained cold highlight along the aluminium case
> extrusion and the chromed latches gives the metal its edge. Clean, undramatic, believable.
>
> Mood: this is how it actually arrives and how it actually works. Rolled in, lid open, running.
>
> [NEGATIVE BLOCK]

> **Caution.** The reference shows other manufacturers' rack units mounted below the console. The
> framing constraint above exists to keep them out of shot. Reject any returned clip in which
> equipment below the console is visible or any third-party product labelling can be read.

---

## SV-BR-23 — "The Curve"
**Model:** Sonicview 16 — TASCAM VIEW interface · **Phase 2/4** · **Stage 5 "Screen Legibility as Subject" · Stage 4 rank 6**

**Real reference image(s):**
- `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (2).jpg` *(primary — the VIEW module screen: a parametric EQ curve on the left display and a dynamics/compressor graph on the right, with the channel encoder row beneath)*
- `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (3).png` *(secondary — the same interface showing EQ alongside a full meter array)*
- `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (1).jpg` *(secondary — the multi-channel strip view, for the interface's colour language and typography)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second macro shot of the TASCAM VIEW interface running on the two 7-inch touchscreens of a
> Sonicview 16, with the row of illuminated rotary encoders and coloured status buttons directly
> beneath them in frame. The left screen shows a channel's parametric EQ page with its response
> curve plotted over a dark blue graph field; the right screen shows the dynamics page with its
> transfer-function graph and threshold markers. Reproduce the interface's real colour language and
> layout exactly as in the reference — the same blues, cyans, greens and ambers, the same panel
> proportions, the same on-screen control shapes.
>
> Action: the EQ curve is edited live. Over the middle four seconds one band's gain rises and its Q
> narrows, and the plotted curve redraws smoothly and continuously as it changes, exactly as a real
> console redraws. On the right screen the dynamics graph's threshold marker steps once. Meters move
> with small realistic activity throughout. No hand or finger enters frame.
>
> Camera: a very slow push-in that starts with both screens and the encoder row in frame and ends
> tight enough that the EQ curve fills most of the width, with a slight lateral drift left so the
> emphasis moves onto the curve. Constant speed, motorised, one take. The screens must stay crisp and
> perfectly legible throughout — no moiré, no scan banding, no rolling shutter, no glare or reflected
> light sources on the glass, no keystone distortion.
>
> Environment and light: bright, cool and clinical. Pale grey and white surround with soft even
> ambient so the panel around the screens reads as real hardware, while the displays remain the
> brightest elements without blooming. Cold cyan screen spill across the tops of the encoder caps.
>
> Mood: the arithmetic made visible. The place where the operator actually sees what the engine is
> doing.
>
> [NEGATIVE BLOCK]

> **Note.** The negative block's "no on-screen text" rule refers to text **added to the video frame**
> — captions, titles, watermarks. The console's own interface labelling is part of the hardware and
> must be reproduced faithfully, not removed.

---

## SV-BR-24 — "The Sixteen"
**Model:** Sonicview 16 · **Phase 1/2** · **Establishing — the compact chassis in its own right**

**Real reference image(s):**
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (18).jpg` *(primary — a dramatic low three-quarter view of the Sonicview 16 showing the full wedge profile, both touchscreens and the complete fader bank)*
- `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (22).jpg` *(secondary — a second angle on the same console for surface-layout confirmation)*

**Prompt:**

> [HARDWARE FIDELITY CONTRACT]
>
> A 10-second hero reveal of a TASCAM Sonicview 16 digital mixing console, complete and alone in
> frame. Two 7-inch colour touchscreens across the upper surface, a row of rotary encoders and
> illuminated select and mute buttons beneath them, the blue channel name display strip, and sixteen
> 100mm motorised channel faders plus a master fader across the lower surface. The wedge-shaped
> chassis with its metallic side trim and moulded side cheeks reads clearly in profile.
>
> Camera: begins low and close at the front edge of the fader bank, looking along the faders so they
> recede in a strong diagonal. Across the ten seconds the camera executes one continuous slow crane
> upward and slight arc to the right, rising past the encoder row to finish on a high three-quarter
> view where the whole console — every fader, both screens, both side cheeks — sits complete within
> the frame, never cropped by an edge. Constant speed, motorised, no cuts. Focus pulls with the move
> so the surface stays sharp throughout.
>
> Environment and light: bright, high-key product studio. White seamless with a soft gradient
> falloff, broad soft white key from above and slightly front, and a cold cyan-white rim light
> travelling along the console's top edge and side trim as the camera rises, separating the dark
> chassis from the white ground. A soft, believable reflection beneath the unit. The touchscreens are
> powered and glowing with their characteristic blue and cyan channel graphics.
>
> Mood: the compact one, given the same respect as the flagship. Complete, self-contained, capable.
>
> [NEGATIVE BLOCK]

---

## Updated reference table — clips 21 to 24

| Clip | Scenario | Model represented | Real source image filename(s) |
|---|---|---|---|
| SV-BR-21 | On Air | Sonicview 16 | `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (2).jpg` · `Updating the Audio System for Next Generation Radio Programs with the TASCAM Sonicview 16 (3).jpg` |
| SV-BR-22 | Cased and Rolling | Sonicview 16 | `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16.jpg` |
| SV-BR-23 | The Curve | Sonicview 16 (VIEW UI) | `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (2).jpg` · `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (3).png` · `Compact, Easy-to-Use, High-Quality Audio for Ho Chi Minh City University of Technology’s Conference Room with TASCAM Sonicview 16 (1).jpg` |
| SV-BR-24 | The Sixteen | Sonicview 16 | `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (18).jpg` · `TASCAM Sonicview 16XP - TASCAM Sonicview 16dp (22).jpg` |

**Library totals after addendum 2 — 24 clips.**
Sonicview 24 (XP/dp) 9 · Sonicview 16 (XP/dp) 7 · SB-16D 3 · IF-Series cards 3 · ecosystem 2.

The 16 was under-represented at 20 clips; these four bring it to near parity with the 24, which is
right — Stage 1 establishes that the two share an identical engine and differ only in HMI footprint,
so both deserve real establishing and real in-situ coverage.
