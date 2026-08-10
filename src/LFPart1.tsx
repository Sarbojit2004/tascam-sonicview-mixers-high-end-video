import React from 'react';
import {ChapterNode, LFShell} from './components/lf/LFShell';
import {LF_PART1} from './lib/lf-theme';
import * as C from './scenes/lf/part1';

const NODES: React.ReactNode[] = [
  <C.L1C01 />, <C.L1C02 />, <C.L1C03 />, <C.L1C04 />, <C.L1C05 />, <C.L1C06 />,
  <C.L1C07 />, <C.L1C08 />, <C.L1C09 />, <C.L1C10 />, <C.L1C11 />, <C.L1C12 />,
  <C.L1C13 />, <C.L1C14 />, <C.L1C15 />, <C.L1C16 />, <C.L1C17 />, <C.L1C18 />,
];

const CHAPTERS: ChapterNode[] = LF_PART1.map((c, i) => ({...c, node: NODES[i]}));

export const LongformPart1Hub: React.FC = () => <LFShell part={1} chapters={CHAPTERS} />;
