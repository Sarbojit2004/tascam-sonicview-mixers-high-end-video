import React from 'react';
import {Reel, SceneNode} from './components/Reel';
import {PART2} from './lib/theme';
import * as S from './scenes/part2';

const NODES: React.ReactNode[] = [
  <S.P2S01 />,
  <S.P2S02 />,
  <S.P2S03 />,
  <S.P2S04 />,
  <S.P2S05 />,
  <S.P2S06 />,
  <S.P2S07 />,
  <S.P2S08 />,
  <S.P2S09 />,
  <S.P2S10 />,
];

const SCENES: SceneNode[] = PART2.map((s, i) => ({...s, node: NODES[i]}));

export const Part2Network: React.FC = () => <Reel part={2} scenes={SCENES} />;
