// ERZEUGT von mathe_mikrohilfen/narration_bauen.py - nicht von Hand
// ändern. Sprechertext, Szene und Zeitmarken stehen in den Hilfen;
// wer hier tippt, baut eine zweite Wahrheit.

import gl01 from './gl01.json';
import gl01Zeit from '../narration/mh-gl01.timings.json';
import gl02 from './gl02.json';
import gl02Zeit from '../narration/mh-gl02.timings.json';
import gl03 from './gl03.json';
import gl03Zeit from '../narration/mh-gl03.timings.json';
import gl04 from './gl04.json';
import gl04Zeit from '../narration/mh-gl04.timings.json';
import gl05 from './gl05.json';
import gl05Zeit from '../narration/mh-gl05.timings.json';
import gl06 from './gl06.json';
import gl06Zeit from '../narration/mh-gl06.timings.json';
import gl07 from './gl07.json';
import gl07Zeit from '../narration/mh-gl07.timings.json';
import gl08 from './gl08.json';
import gl08Zeit from '../narration/mh-gl08.timings.json';
import gl09 from './gl09.json';
import gl09Zeit from '../narration/mh-gl09.timings.json';
import gl10 from './gl10.json';
import gl10Zeit from '../narration/mh-gl10.timings.json';
import gl11 from './gl11.json';
import gl11Zeit from '../narration/mh-gl11.timings.json';

export type Baustein = Record<string, unknown>;
export type Teil = { id: string; text: string; szene: Baustein[] };
export type Hilfe = {
  kennung: string;
  frage: string;
  aufgabe: string;
  teile: Teil[];
  zeiten: Record<string, number>;
};

export const MIKROHILFEN: Record<string, Hilfe> = {
  gl01: { ...gl01, zeiten: gl01Zeit as Record<string, number> },
  gl02: { ...gl02, zeiten: gl02Zeit as Record<string, number> },
  gl03: { ...gl03, zeiten: gl03Zeit as Record<string, number> },
  gl04: { ...gl04, zeiten: gl04Zeit as Record<string, number> },
  gl05: { ...gl05, zeiten: gl05Zeit as Record<string, number> },
  gl06: { ...gl06, zeiten: gl06Zeit as Record<string, number> },
  gl07: { ...gl07, zeiten: gl07Zeit as Record<string, number> },
  gl08: { ...gl08, zeiten: gl08Zeit as Record<string, number> },
  gl09: { ...gl09, zeiten: gl09Zeit as Record<string, number> },
  gl10: { ...gl10, zeiten: gl10Zeit as Record<string, number> },
  gl11: { ...gl11, zeiten: gl11Zeit as Record<string, number> },
};
