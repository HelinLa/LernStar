import {makeProject} from '@motion-canvas/core';

import geschwindigkeit from './scenes/geschwindigkeit?scene';

// LernStar-Motion-Canvas-Projekt. Weitere Szenen hier importieren und in
// scenes:[] ergänzen (Reihenfolge = Abspielreihenfolge im Editor).
export default makeProject({
  name: 'LernStar',
  scenes: [geschwindigkeit],
});
