import React from 'react';
import {ChapterNode, LFShell} from './components/lf/LFShell';
import {LF_PART3} from './lib/lf-theme';
import * as C from './scenes/lf/part3';

const NODES: React.ReactNode[] = [
  <C.L3C01 />, <C.L3C02 />, <C.L3C03 />, <C.L3C04 />, <C.L3C05 />, <C.L3C06 />,
  <C.L3C07 />, <C.L3C08 />, <C.L3C09 />, <C.L3C10 />, <C.L3C11 />, <C.L3C12 />,
  <C.L3C13 />, <C.L3C14 />, <C.L3C15 />,
];

const CHAPTERS: ChapterNode[] = LF_PART3.map((c, i) => ({...c, node: NODES[i]}));

export const LongformPart3Protocol: React.FC = () => <LFShell part={3} chapters={CHAPTERS} />;
