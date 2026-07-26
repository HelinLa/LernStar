import React from 'react';
import { Composition } from 'remotion';
import { Traegheit, TRAEGHEIT_DURATION } from './videos/Traegheit';
import { TraegheitAlltag, TRAEGHEIT_ALLTAG_DURATION } from './videos/TraegheitAlltag';
import { Schwerelosigkeit, SCHWERELOSIGKEIT_DURATION } from './videos/Schwerelosigkeit';
import { Orbit, ORBIT_DURATION } from './videos/Orbit';
import { Rueckstoss, RUECKSTOSS_DURATION } from './videos/Rueckstoss';
import { Energie, ENERGIE_DURATION } from './videos/Energie';

// Alle LernStar-Lernvideos werden hier registriert.
// Format: 1920x1080 (16:9), 30 fps – passt als <video> in LernStar.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Traegheit"
        component={Traegheit}
        durationInFrames={TRAEGHEIT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TraegheitAlltag"
        component={TraegheitAlltag}
        durationInFrames={TRAEGHEIT_ALLTAG_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Schwerelosigkeit"
        component={Schwerelosigkeit}
        durationInFrames={SCHWERELOSIGKEIT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Orbit"
        component={Orbit}
        durationInFrames={ORBIT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Rueckstoss"
        component={Rueckstoss}
        durationInFrames={RUECKSTOSS_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Energie"
        component={Energie}
        durationInFrames={ENERGIE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Weitere Videos kommen hier dazu. */}
    </>
  );
};
