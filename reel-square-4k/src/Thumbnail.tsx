import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VersionProvider, useV} from './lib/ctx';
import {VersionId} from './lib/music';
import {COPY, FONT, rgba} from './lib/theme';
import {Chip, Hero, Logo, Pill, logoH} from './ui/kit';
import {Grain, Lightning, Ribbons, Vignette} from './fx/fx';
import {ICON} from './lib/assets';

const S = 1920;

const Inner: React.FC = () => {
  const {t, v} = useV();
  const tw = 470;
  return (
    <AbsoluteFill style={{background: t.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% 70%, ${rgba(t.aRgb, 0.42)}, rgba(0,0,0,0) 70%),
            radial-gradient(45% 30% at 22% 18%, ${rgba(t.bRgb, 0.16)}, rgba(0,0,0,0) 70%),
            radial-gradient(45% 30% at 80% 22%, ${rgba(t.aRgb, 0.2)}, rgba(0,0,0,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,0.035) 1.5px, transparent 1.5px)',
          backgroundSize: '160px 160px',
          WebkitMaskImage: 'radial-gradient(70% 55% at 50% 72%, #000 20%, transparent 80%)',
        }}
      />
      {v === 'thunderstruck' ? (
        <>
          <Lightning strikes={[{f: 0, x: 380, seed: 17, big: true}]} />
          <Lightning strikes={[{f: 0, x: 1560, seed: 91}]} />
        </>
      ) : (
        <Ribbons o={0.9} />
      )}
      {/* hero */}
      <Hero id={109} x={S / 2} y={1600} w={1880} glow={1.3} reflect={0.26} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${t.bg} 0%, rgba(0,0,0,0.55) 26%, rgba(0,0,0,0) 44%)`}} />

      {/* masthead */}
      <div style={{position: 'absolute', top: 96, width: S, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative', width: tw, height: logoH('tascam', tw)}}>
          <Logo name="tascam" w={tw} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 210,
          width: S,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 900,
          fontSize: 238,
          letterSpacing: '-0.035em',
          lineHeight: 1,
          color: '#fff',
          textShadow: `0 0 60px ${rgba(t.aRgb, 0.75)}, 0 0 140px ${rgba(t.aRgb, 0.45)}`,
        }}
      >
        SONICVIEW
      </div>
      <div
        style={{
          position: 'absolute',
          top: 486,
          width: S,
          textAlign: 'center',
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 62,
          letterSpacing: '0.12em',
          color: t.b,
          paddingLeft: '0.12em',
        }}
      >
        16XP · 24XP · 16dp · 24dp
      </div>
      <div style={{position: 'absolute', top: 598, width: S, display: 'flex', justifyContent: 'center', gap: 18}}>
        <Chip size={34}>54-BIT FPGA</Chip>
        <Chip size={34}>96 kHz</Chip>
        <Chip size={34}>0.51 ms</Chip>
        <Chip size={34}>DANTE 64×64</Chip>
      </div>

      {/* partner bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1650,
          width: S,
          height: 270,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.78) 40%)',
        }}
      />
      <Logo name="shivansh" w={560} x={96} y={1700} />
      <div style={{position: 'absolute', right: 96, top: 1712, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16}}>
        <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 42, color: '#fff'}}>{COPY.role}</div>
        <Pill size={30} icon={ICON.website}>
          {COPY.website}
        </Pill>
      </div>
      <Vignette o={0.8} />
      <Grain o={0.05} />
    </AbsoluteFill>
  );
};

export const Thumbnail: React.FC<{v: VersionId}> = ({v}) => (
  <VersionProvider v={v}>
    <Inner />
  </VersionProvider>
);
