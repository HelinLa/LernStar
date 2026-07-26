import React from 'react';
import { Composition } from 'remotion';
import { Traegheit, TRAEGHEIT_DURATION } from './videos/Traegheit';
import { TraegheitAlltag, TRAEGHEIT_ALLTAG_DURATION } from './videos/TraegheitAlltag';
import { Schwerelosigkeit, SCHWERELOSIGKEIT_DURATION } from './videos/Schwerelosigkeit';
import { Orbit, ORBIT_DURATION } from './videos/Orbit';
import { Rueckstoss, RUECKSTOSS_DURATION } from './videos/Rueckstoss';
import { Energie, ENERGIE_DURATION } from './videos/Energie';
import { Arbeit, ARBEIT_DURATION } from './videos/Arbeit';
import { Hubarbeit, HUBARBEIT_DURATION } from './videos/Hubarbeit';
import { Lageenergie, LAGEENERGIE_DURATION } from './videos/Lageenergie';
import { Bewegungsenergie, BEWEGUNGSENERGIE_DURATION } from './videos/Bewegungsenergie';
import { Reibungswaerme, REIBUNGSWAERME_DURATION } from './videos/Reibungswaerme';
import { LichtUndSehen, LICHT_UND_SEHEN_DURATION } from './videos/LichtUndSehen';
import { Schatten, SCHATTEN_DURATION } from './videos/Schatten';
import { GegenstandSehen, GEGENSTAND_SEHEN_DURATION } from './videos/GegenstandSehen';
import { Lichtausbreitung, LICHTAUSBREITUNG_DURATION } from './videos/Lichtausbreitung';
import { SchattenGroesse, SCHATTEN_GROESSE_DURATION } from './videos/SchattenGroesse';
import { KernHalbschatten, KERN_HALBSCHATTEN_DURATION } from './videos/KernHalbschatten';
import { MagneteFelder, MAGNETE_FELDER_DURATION } from './videos/MagneteFelder';
import { MagnetStoffe, MAGNET_STOFFE_DURATION } from './videos/MagnetStoffe';
import { Magnetpole, MAGNETPOLE_DURATION } from './videos/Magnetpole';
import { Magnetfeld, MAGNETFELD_DURATION } from './videos/Magnetfeld';
import { Kompass, KOMPASS_DURATION } from './videos/Kompass';
import { Elektromagnet, ELEKTROMAGNET_DURATION } from './videos/Elektromagnet';
import { StromkreisSchaltzeichen, STROMKREIS_SCHALTZEICHEN_DURATION } from './videos/StromkreisSchaltzeichen';
import { StromkreisLampe, STROMKREIS_LAMPE_DURATION } from './videos/StromkreisLampe';
import { LeiterNichtleiter, LEITER_NICHTLEITER_DURATION } from './videos/LeiterNichtleiter';
import { Schaltplan, SCHALTPLAN_DURATION } from './videos/Schaltplan';
import { Reihenschaltung, REIHENSCHALTUNG_DURATION } from './videos/Reihenschaltung';
import { Parallelschaltung, PARALLELSCHALTUNG_DURATION } from './videos/Parallelschaltung';
import { Stromwirkungen, STROMWIRKUNGEN_DURATION } from './videos/Stromwirkungen';
import { TemperaturWaerme, TEMPERATUR_WAERME_DURATION } from './videos/TemperaturWaerme';
import { ThermometerVideo, THERMOMETER_DURATION } from './videos/ThermometerVideo';
import { Waermeausdehnung, WAERMEAUSDEHNUNG_DURATION } from './videos/Waermeausdehnung';
import { Aggregatzustaende, AGGREGATZUSTAENDE_DURATION } from './videos/Aggregatzustaende';
import { Waermeuebertragung, WAERMEUEBERTRAGUNG_DURATION } from './videos/Waermeuebertragung';
import { Daemmung, DAEMMUNG_DURATION } from './videos/Daemmung';
import { DunkleFlaechen, DUNKLE_FLAECHEN_DURATION } from './videos/DunkleFlaechen';
import { TonEntsteht, TON_ENTSTEHT_DURATION } from './videos/TonEntsteht';
import { Lautstaerke, LAUTSTAERKE_DURATION } from './videos/Lautstaerke';
import { Tonhoehe, TONHOEHE_DURATION } from './videos/Tonhoehe';
import { Schallausbreitung, SCHALLAUSBREITUNG_DURATION } from './videos/Schallausbreitung';
import { Ohr, OHR_DURATION } from './videos/Ohr';
import { Laermschutz, LAERMSCHUTZ_DURATION } from './videos/Laermschutz';

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
      <Composition
        id="Arbeit"
        component={Arbeit}
        durationInFrames={ARBEIT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Hubarbeit"
        component={Hubarbeit}
        durationInFrames={HUBARBEIT_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lageenergie"
        component={Lageenergie}
        durationInFrames={LAGEENERGIE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Bewegungsenergie"
        component={Bewegungsenergie}
        durationInFrames={BEWEGUNGSENERGIE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Reibungswaerme"
        component={Reibungswaerme}
        durationInFrames={REIBUNGSWAERME_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LichtUndSehen"
        component={LichtUndSehen}
        durationInFrames={LICHT_UND_SEHEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Schatten"
        component={Schatten}
        durationInFrames={SCHATTEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GegenstandSehen"
        component={GegenstandSehen}
        durationInFrames={GEGENSTAND_SEHEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Lichtausbreitung"
        component={Lichtausbreitung}
        durationInFrames={LICHTAUSBREITUNG_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SchattenGroesse"
        component={SchattenGroesse}
        durationInFrames={SCHATTEN_GROESSE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KernHalbschatten"
        component={KernHalbschatten}
        durationInFrames={KERN_HALBSCHATTEN_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition id="MagneteFelder" component={MagneteFelder} durationInFrames={MAGNETE_FELDER_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="MagnetStoffe" component={MagnetStoffe} durationInFrames={MAGNET_STOFFE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Magnetpole" component={Magnetpole} durationInFrames={MAGNETPOLE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Magnetfeld" component={Magnetfeld} durationInFrames={MAGNETFELD_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Kompass" component={Kompass} durationInFrames={KOMPASS_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Elektromagnet" component={Elektromagnet} durationInFrames={ELEKTROMAGNET_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="StromkreisSchaltzeichen" component={StromkreisSchaltzeichen} durationInFrames={STROMKREIS_SCHALTZEICHEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="StromkreisLampe" component={StromkreisLampe} durationInFrames={STROMKREIS_LAMPE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="LeiterNichtleiter" component={LeiterNichtleiter} durationInFrames={LEITER_NICHTLEITER_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Schaltplan" component={Schaltplan} durationInFrames={SCHALTPLAN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Reihenschaltung" component={Reihenschaltung} durationInFrames={REIHENSCHALTUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Parallelschaltung" component={Parallelschaltung} durationInFrames={PARALLELSCHALTUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Stromwirkungen" component={Stromwirkungen} durationInFrames={STROMWIRKUNGEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="TemperaturWaerme" component={TemperaturWaerme} durationInFrames={TEMPERATUR_WAERME_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ThermometerVideo" component={ThermometerVideo} durationInFrames={THERMOMETER_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Waermeausdehnung" component={Waermeausdehnung} durationInFrames={WAERMEAUSDEHNUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Aggregatzustaende" component={Aggregatzustaende} durationInFrames={AGGREGATZUSTAENDE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Waermeuebertragung" component={Waermeuebertragung} durationInFrames={WAERMEUEBERTRAGUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Daemmung" component={Daemmung} durationInFrames={DAEMMUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="DunkleFlaechen" component={DunkleFlaechen} durationInFrames={DUNKLE_FLAECHEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="TonEntsteht" component={TonEntsteht} durationInFrames={TON_ENTSTEHT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Lautstaerke" component={Lautstaerke} durationInFrames={LAUTSTAERKE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Tonhoehe" component={Tonhoehe} durationInFrames={TONHOEHE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Schallausbreitung" component={Schallausbreitung} durationInFrames={SCHALLAUSBREITUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Ohr" component={Ohr} durationInFrames={OHR_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Laermschutz" component={Laermschutz} durationInFrames={LAERMSCHUTZ_DURATION} fps={30} width={1920} height={1080} />
      {/* Weitere Videos kommen hier dazu. */}
    </>
  );
};
