"""The ten slides.

`hero` is the frame that interrupts the headline; where it sits on a white sweep
it is matted to its own silhouette, otherwise it is a hard-edged photo block.
`band` is the full-bleed lower photograph. `plates` is the indexed register.

Image roles were assigned so that, wherever the set allows it, the interrupting
frame is one that can carry a real silhouette -- which is why a few slides swap
which of their two principal frames leads. No image moved between slides.
"""

# fractional regions whose connected component is dropped from a matte
BADGE_TR = [(0.70, 0.00, 1.00, 0.42)]

SPEC = {
"01": dict(
    name="01_sonicview-the-family",
    labels=("One System", "Three Boxes"),
    head=("SONIC", "VIEW"),
    # None of this slide's frames sits on a white sweep, so none can carry a
    # silhouette. OVERVIEW-02 is the only one on a genuinely black ground, which
    # is the dark mass the reference puts over its red type; OVERVIEW-01 is the
    # same line-up on white and reads as a different picture underneath it.
    hero="OVERVIEW-02", hero_mode="block",
    band="OVERVIEW-01", band_mode="scene", band_pos="center",
    plates=["SV16-24", "SV16-12", "SV24-23"],
    cap_title=("The ", "family"),
    cap_body="Two desk sizes and a stage box, photographed as one line-up. "
             "The 16 carries two screens and sixteen faders, the 24 carries three "
             "and twenty-four; the stage box sits between them and belongs to both.",
    cap_meta="Above &mdash; the line-up on black",
    band_meta="Below &mdash; the same three on white",
    found="SV16-37",
),
"02": dict(
    name="02_sonicview-16-the-surface",
    labels=("Sixteen Faders", "Two Screens"),
    head=("CHANN", "ELS"),
    hero="SV16-11", hero_mode="cut",
    band="SV16-08", band_mode="bbox", band_pos="center",
    plates=["SV16-01", "SV16-03", "SV16-06", "SV16-07", "SV16-09", "SV16-10",
            "SV16-14", "SV16-15", "SV16-16", "SV16-17", "SV16-18"],
    cap_title=("One ", "desk"),
    cap_body="Every clean angle TASCAM supplied of the 16-series surface, in one "
             "place. Two touchscreens over a single knob row, a colour-coded "
             "select strip, then sixteen faders across the bed.",
    cap_meta="Above &mdash; Sonicview 16XP",
    band_meta="Below &mdash; Sonicview 16XP",
),
"03": dict(
    name="03_sonicview-rear-connectors",
    labels=("Rear Panel", "Slot 1 &middot; Slot 2"),
    head=("CONNEC", "TORS"),
    hero="SV16-13", hero_mode="cut", hero_fixed=(196, 712),
    band="SV16-04", band_mode="bbox", band_pos="center",
    plates=["SV16-02", "SV16-05", "SV16-41", "SV16-44", "SV16-26",
            "SV16-36", "SV16-40", "SV16-42", "SV16-43"],
    cap_title=("Two ", "backs"),
    cap_body="From the front, the 16dp and the 16XP are the same desk &mdash; same "
             "screens, same knob rows, same fader bed. The rear is the only place "
             "this photography separates them: an EXT DC IN beside the mains inlet "
             "on one, an IF-MTR32 card in SLOT&nbsp;1 on the other.",
    cap_meta="Above &mdash; Sonicview 16XP",
    band_meta="Below &mdash; Sonicview 16dp",
    mark=(0.780, 0.625, 0.085, 0.200),
),
"04": dict(
    name="04_sonicview-24-the-wide-desk",
    labels=("Twenty-Four", "Three Screens"),
    head=("TWENTY", "FOUR"),
    hero="SV24-11", hero_mode="cut",
    band="SV24-02", band_mode="bbox", band_pos="center",
    plates=["SV24-03", "SV24-04", "SV24-05", "SV24-06", "SV24-07", "SV24-08",
            "SV24-10", "SV24-12", "SV24-13", "SV24-14", "SV24-22"],
    cap_title=("The wider ", "bed"),
    cap_body="Same control language as the 16, run across a third screen and eight "
             "more faders. The 24dp and the 24XP are, from the front, the same "
             "desk as each other &mdash; the difference is again at the back.",
    cap_meta="Above &mdash; Sonicview 24XP",
    band_meta="Below &mdash; Sonicview 24dp",
),
"05": dict(
    name="05_sonicview-24-backbone",
    labels=("Rear", "Ext DC In"),
    head=("BACK", "BONE"),
    hero="SV24-09", hero_mode="cut",
    band="SV24-01", band_mode="bbox", band_pos="center",
    plates=["SV24-16", "SV24-20", "SV24-21", "SV24-15", "SV24-17",
            "SV24-18", "SV24-19"],
    cap_title=("The same ", "split"),
    cap_body="What separated the 16dp from the 16XP separates the 24s too. One back "
             "carries an EXT DC IN next to the mains inlet; the other carries an "
             "IF-MTR32 card in SLOT&nbsp;1 and no second inlet.",
    cap_meta="Above &mdash; Sonicview 24XP",
    band_meta="Below &mdash; Sonicview 24dp",
    mark=(0.796, 0.590, 0.062, 0.235),
),
"06": dict(
    name="06_sonicview-the-engine",
    labels=("FPGA Mixing Engine", "54-Bit &middot; 96 kHz"),
    head=("FIFTY", "FOUR"),
    hero="SV16-34", hero_mode="cut",
    band="SV16-25", band_mode="scene", band_pos="center",
    plates=["SV16-19", "SV16-20", "SV16-21", "SV16-22", "SV16-23", "SV16-27",
            "SV16-28", "SV16-29", "SV16-30", "SV16-31", "SV16-32", "SV16-33",
            "SV16-35", "SV16-38", "SV16-39",
            "FPGA-01", "FPGA-02", "FPGA-03", "FPGA-04", "FPGA-06"],
    cap_title=("Under the ", "lid"),
    cap_body="The asset set names it plainly: an FPGA mixing engine running 54-bit "
             "floating point at 96&nbsp;kHz. Below is the board that carries it. "
             "Everything in the register is a screen off that engine, or a plot "
             "the manufacturer published against it.",
    cap_meta="Above &mdash; IF-MTR32 recording card",
    band_meta="Below &mdash; the processing board",
    cols=10,
),
"07": dict(
    name="07_sb-16d-the-stage-end",
    labels=("SB-16D", "Sixteen In"),
    head=("STAGE", "BOX"),
    hero="SB16D-11", hero_mode="cut",
    band="SB16D-09", band_mode="scene", band_pos="center",
    plates=["SB16D-01", "SB16D-02", "SB16D-03", "SB16D-04", "SB16D-05",
            "SB16D-06", "SB16D-07", "SB16D-08", "SB16D-10", "SB16D-12",
            "SB16D-13", "SB16D-14", "SB16D-15"],
    cap_title=("The far ", "end"),
    cap_body="A separate product, not a version of the desk. Sixteen inputs and "
             "eight outputs in a rack frame with moulded corner bumpers, built to "
             "live at the stage end of the run rather than under the engineer.",
    cap_meta="Above &mdash; SB-16D",
    band_meta="Below &mdash; the desks and the box together",
),
"08": dict(
    name="08_sonicview-the-slots",
    labels=("Expansion", "Four Cards"),
    head=("INTER", "FACES"),
    hero="IFCARD-06", hero_mode="cut",
    band="IFCARD-08", band_mode="bbox", band_pos="center",
    plates=["IFCARD-01", "IFCARD-02", "IFCARD-03", "IFCARD-04",
            "IFCARD-05", "IFCARD-07"],
    cap_title=("Four ", "answers"),
    cap_body="Each card is a different way out of the same two slots &mdash; "
             "AES/EBU on D-sub, analogue out on D-sub, a networked pair on "
             "etherCON, MADI on coax and optical. Same faceplate footprint, "
             "four different back ends.",
    cap_meta="Above &mdash; IF-DA64",
    band_meta="Below &mdash; IF-MA64/EX",
),
"09": dict(
    name="09_if-st2110-the-protocol",
    labels=("IF-ST2110", "Two Ports"),
    head=("PROTO", "COL"),
    hero="IFST-01", hero_mode="cut",
    band="IFST-07", band_mode="scene", band_pos="center",
    plates=["IFST-02", "IFST-03", "IFST-04", "IFST-05", "IFST-06", "IFST-08",
            "IFST-09", "IFST-10", "IFST-11",
            "ST2110SET-01", "ST2110SET-02", "ST2110SET-03", "ST2110SET-04",
            "ST2110SET-05", "ST2110SET-06", "ST2110SET-07"],
    cap_title=("Three ", "sockets"),
    cap_body="One card, one control port and two media ports. The register holds "
             "the card on its own, the card in a slot, its browser pages, and the "
             "three deployment drawings TASCAM issued with it.",
    cap_meta="Above &mdash; IF-ST2110",
    band_meta="Below &mdash; control, port 1, port 2",
),
"10": dict(
    name="10_sonicview-in-service",
    labels=("In The Field", "Three Rooms"),
    head=("FIELD", "WORK"),
    hero="CS_RADIO-03", hero_mode="block",
    band="CS_HCMC-06", band_mode="scene", band_pos="center",
    plates=["CS_HCMC-01", "CS_HCMC-02", "CS_HCMC-03", "CS_HCMC-04", "CS_HCMC-05",
            "CS_RADIO-01", "CS_RADIO-02", "CS_RADIO-04", "CS_RADIO-05",
            "CS_JAZZ-01", "CS_CONF-01", "CS_CONF-02"],
    cap_title=("Rooms, not ", "studios"),
    cap_body="The only frames in this set that were not shot on a sweep. A radio "
             "studio mid-programme, a university conference room with the desk "
             "racked in a flight case, and a festival truck. Lighting, cabling and "
             "wear are whatever the room had that day.",
    cap_meta="Above &mdash; radio studio",
    band_meta="Below &mdash; conference room, flight-cased",
),
}

# per-image preparation overrides
PREP = {
    # composited INTER BEE award badges: the badge is its own connected blob, so
    # it comes off the matte whole, with no product pixels cropped (ruling 02)
    "SV16-09":      dict(mode="cut", drop_in=BADGE_TR),
    "SV24-06":      dict(mode="cut", drop_in=BADGE_TR),
    "IFST-05":      dict(mode="cut", drop_in=BADGE_TR),
    # these two banners sit on a grey ground the matte cannot separate, so the
    # badge comes off with a straight crop instead
    "ST2110SET-05": dict(mode="crop", box=(0.0, 0.0, 0.715, 1.0)),
    "ST2110SET-06": dict(mode="crop", box=(0.0, 0.0, 0.715, 1.0)),
    # composited Dante DDM READY badge cropped off, etherCON macro kept (ruling 01)
    "SV16-26":      dict(mode="crop", box=(0.0, 0.0, 0.585, 1.0)),
    # white-sweep frames carrying a burned-in model caption in the margin: trimming
    # to the product's own bounding box removes the caption (ruling 03)
    **{k: dict(mode="bbox") for k in [
        "SV16-01", "SV16-02", "SV16-03", "SV16-05", "SV16-06", "SV16-07",
        "SV16-10", "SV16-12", "SV16-14", "SV16-15", "SV16-16", "SV16-17",
        "SV16-18", "SV16-41", "SV16-21", "SV16-34",
        "SV24-03", "SV24-04", "SV24-05", "SV24-07", "SV24-08", "SV24-10",
        "SV24-12", "SV24-13", "SV24-14", "SV24-16", "SV24-21", "SV24-22",
        "SV24-23",
        "SB16D-02", "SB16D-03", "SB16D-04", "SB16D-07", "SB16D-10",
        "SB16D-11", "SB16D-12", "SB16D-15",
        "IFCARD-01", "IFCARD-02", "IFCARD-03", "IFCARD-04", "IFCARD-05",
        "IFCARD-07",
        "IFST-02", "IFST-03", "IFST-04",
        "ST2110SET-01", "ST2110SET-03",
    ]},
}
