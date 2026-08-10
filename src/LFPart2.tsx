import React from 'react';
import {ChapterNode, LFShell} from './components/lf/LFShell';
import {LF_PART2} from './lib/lf-theme';
import * as C from './scenes/lf/part2';

const NODES: React.ReactNode[] = [
  <C.L2C01 />, <C.L2C02 />, <C.L2C03 />, <C.L2C04 />, <C.L2C05 />, <C.L2C06 />,
  <C.L2C07 />, <C.L2C08 />, <C.L2C09 />, <C.L2C10 />, <C.L2C11 />, <C.L2C12 />,
  <C.L2C13 />, <C.L2C14 />, <C.L2C15 />, <C.L2C16 />,
];

const CHAPTERS: ChapterNode[] = LF_PART2.map((c, i) => ({...c, node: NODES[i]}));

export const LongformPart2Network: React.FC = () => <LFShell part={2} chapters={CHAPTERS} />;
