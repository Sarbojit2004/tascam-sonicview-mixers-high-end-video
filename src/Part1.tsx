import React from 'react';
import {Reel, SceneNode} from './components/Reel';
import {PART1} from './lib/theme';
import * as S from './scenes/part1';

const NODES: React.ReactNode[] = [
  <S.P1S01 />,
  <S.P1S02 />,
  <S.P1S03 />,
  <S.P1S04 />,
  <S.P1S05 />,
  <S.P1S06 />,
  <S.P1S07 />,
  <S.P1S08 />,
  <S.P1S09 />,
  <S.P1S10 />,
  <S.P1S11 />,
  <S.P1S12 />,
];

const SCENES: SceneNode[] = PART1.map((s, i) => ({...s, node: NODES[i]}));

export const Part1Hub: React.FC = () => <Reel part={1} scenes={SCENES} />;
