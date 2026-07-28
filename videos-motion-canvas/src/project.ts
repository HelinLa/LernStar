import {makeProject} from '@motion-canvas/core';

import geschwindigkeit from './scenes/geschwindigkeit?scene';
import energieerhaltung from './scenes/energieerhaltung?scene';
import energieerhaltungClip from './scenes/energieerhaltung_clip?scene';
import sehenClip from './scenes/sehen_clip?scene';
import stromkreisClip from './scenes/stromkreis_clip?scene';
import schattenClip from './scenes/schatten_clip?scene';
import schattenGroesseClip from './scenes/schatten_groesse_clip?scene';
import kernHalbschattenClip from './scenes/kern_halbschatten_clip?scene';
import magnetpoleClip from './scenes/magnetpole_clip?scene';
import magneteFelderClip from './scenes/magnete_felder_clip?scene';
import magnetStoffeClip from './scenes/magnet_stoffe_clip?scene';
import magnetfeldClip from './scenes/magnetfeld_clip?scene';
import kompassClip from './scenes/kompass_clip?scene';
import elektromagnetClip from './scenes/elektromagnet_clip?scene';

// LernStar-Motion-Canvas-Projekt. Weitere Szenen hier importieren und in
// scenes:[] ergänzen (Reihenfolge = Abspielreihenfolge im Editor).
// Hinweis: Der Headless-Render rendert ALLE scenes[] hintereinander in eine MP4.
// Zum Einzel-Rendern kurzzeitig nur die gewünschte Szene aktiv lassen.
export default makeProject({
  name: 'LernStar',
  scenes: [schattenGroesseClip],
});
