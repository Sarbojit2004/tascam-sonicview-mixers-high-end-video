import React from 'react';
import {Reel, SceneNode} from './components/Reel';
import {PART3} from './lib/theme';
import * as S from './scenes/part3';

const NODES: React.ReactNode[] = [
  <S.P3S01 />,
  <S.P3S02 />,
  <S.P3S03 />,
  <S.P3S04 />,
  <S.P3S05 />,
  <S.P3S06 />,
  <S.P3S07 />,
  <S.P3S08 />,
  <S.P3S09 />,
  <S.P3S10 />,
  <S.P3S11 />,
];

const SCENES: SceneNode[] = PART3.map((s, i) => ({...s, node: NODES[i]}));

export const Part3Protocol: React.FC = () => <Reel part={3} scenes={SCENES} />;
