import { da--change--ngerDSLType } from 'da--change--nger';
// intentional implicit dep (this is the actual type da--change--nger uses)
import { Chunk } from 'parse-diff';

export type da--change--ngerJS = {
  da--change--nger: da--change--ngerDSLType;
  markdown: (markdown: string) => void;
  warn: (message: string) => void;
  fail: (message: string) => void;
};

export type StructuredDiff = {
  chunks: Chunk[];
};
