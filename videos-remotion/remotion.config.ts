import { Config } from '@remotion/cli/config';

// Ausgabequalität / Rendering-Einstellungen für die LernStar-Lernvideos
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // automatisch nach CPU-Kernen
Config.setCodec('h264');     // MP4 (H.264), gut für <video> im Browser
