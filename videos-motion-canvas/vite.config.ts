import {defineConfig} from 'vite';
import motionCanvasImport from '@motion-canvas/vite-plugin';
import ffmpegImport from '@motion-canvas/ffmpeg';

// CJS/ESM-Interop: unter Vite 5 liefert der Default-Import das Namespace-Objekt,
// die eigentliche Plugin-Fabrik steckt in .default. Fallback für beide Fälle.
const motionCanvas = (motionCanvasImport as any).default ?? motionCanvasImport;
const ffmpeg = (ffmpegImport as any).default ?? ffmpegImport;

// Motion-Canvas-Editor (npm start) + MP4-Export über den ffmpeg-Plugin.
export default defineConfig({
  plugins: [
    motionCanvas({
      project: ['./src/project.ts'],
    }),
    ffmpeg(),
  ],
});
