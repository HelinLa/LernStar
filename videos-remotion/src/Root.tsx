import React from 'react';
import { Composition } from 'remotion';
import { Traegheit, TRAEGHEIT_DURATION } from './videos/Traegheit';

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
      {/* Weitere Videos (9.2.12, 9.2.13, …) kommen hier dazu. */}
    </>
  );
};
