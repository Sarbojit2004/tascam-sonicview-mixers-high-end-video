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
