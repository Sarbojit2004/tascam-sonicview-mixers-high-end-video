import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VersionProvider, useV} from './lib/ctx';
import {VersionId} from './lib/music';
import {COPY, FONT, rgba} from './lib/theme';
import {Chip, Hero, Logo, Pill, logoH} from './ui/kit';
import {Grain, Lightning, Ribbons, Vignette} from './fx/fx';
import {ICON} from './lib/assets';
import {useFonts} from './fonts';

/** Portrait 9:16 cover: 1080 x 1920 design space, rendered at --scale=2 -> 2160 x 3840. */
const W = 1080;
const H = 1920;

const Inner: React.FC = () => {
  useFonts();
  const {t, v} = useV();
  const tw = 430;
  const sw = 760;
  return (
    <AbsoluteFill style={{background: t.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(75% 38% at 50% 58%, ${rgba(t.aRgb, 0.45)}, rgba(0,0,0,0) 70%),
            radial-gradient(60% 22% at 20% 16%, ${rgba(t.bRgb, 0.16)}, rgba(0,0,0,0) 70%),
            radial-gradient(60% 22% at 85% 22%, ${rgba(t.aRgb, 0.2)}, rgba(0,0,0,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.035) 1.5px, transparent 1.5px)',
          backgroundSize: '120px 120px',
          WebkitMaskImage: 'radial-gradient(80% 40% at 50% 60%, #000 20%, transparent 80%)',
        }}
      />
      {/* the effect layers are drawn in a 1920 square; centre it on the tall frame */}
      <div style={{position: 'absolute', left: (W - 1920) / 2, top: 0, width: 1920, height: 1920}}>
        {v === 'thunderstruck' ? (
          <>
            <Lightning strikes={[{f: 0, x: 620, seed: 17, big: true}]} />
            <Lightning strikes={[{f: 0, x: 1330, seed: 91}]} />
          </>
        ) : (
          <div style={{position: 'absolute', inset: 0, transform: 'translateY(-60px)'}}>
            <Ribbons o={0.9} />
          </div>
        )}
      </div>

      {/* two consoles: 16XP behind, 24XP in front */}
      <Hero id={62} x={W * 0.3} y={1170} w={760} glow={0.9} reflect={0.18} />
      <Hero id={109} x={W * 0.55} y={1440} w={1320} glow={1.3} reflect={0.26} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${t.bg} 0%, rgba(0,0,0,0.55) 24%, rgba(0,0,0,0) 38%)`}} />

      {/* masthead */}
      <div style={{position: 'absolute', top: 130, width: W, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: tw, height: logoH('tascam', tw)}}>
          <Logo name="tascam" w={tw} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 238,
          width: W,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: 134,
          letterSpacing: '-0.035em',
          lineHeight: 1,
          color: '#fff',
          textShadow: `0 0 40px ${rgba(t.aRgb, 0.75)}, 0 0 100px ${rgba(t.aRgb, 0.45)}`,
        }}
      >
        SONICVIEW
      </div>
      <div
        style={{
          position: 'absolute',
          top: 404,
          width: W,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: '0.1em',
          color: t.b,
          paddingLeft: '0.1em',
        }}
      >
        16XP · 24XP · 16dp · 24dp
      </div>
      <div style={{position: 'absolute', top: 490, width: W, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, padding: '0 90px', boxSizing: 'border-box'}}>
        <Chip size={30}>54-BIT FPGA</Chip>
        <Chip size={30}>96 kHz</Chip>
        <Chip size={30}>0.51 ms</Chip>
        <Chip size={30}>DANTE 64×64</Chip>
      </div>

      {/* partner block */}
      <div style={{position: 'absolute', left: 0, top: 1470, width: W, height: H - 1470, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 35%)'}} />
      <div style={{position: 'absolute', top: 1540, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{position: 'relative', width: sw, height: logoH('shivansh', sw)}}>
          <Logo name="shivansh" w={sw} />
        </div>
        <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 40, color: '#fff'}}>{COPY.role}</div>
        <Pill size={30} icon={ICON.website}>
          {COPY.website}
        </Pill>
      </div>
      <Vignette o={0.8} />
      <Grain o={0.05} />
    </AbsoluteFill>
  );
};

export const ThumbnailPortrait: React.FC<{v: VersionId}> = ({v}) => (
  <VersionProvider v={v}>
    <Inner />
  </VersionProvider>
);
