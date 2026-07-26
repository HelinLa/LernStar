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
import { TagNacht, TAG_NACHT_DURATION } from './videos/TagNacht';
import { Jahreszeiten, JAHRESZEITEN_DURATION } from './videos/Jahreszeiten';
import { Mondphasen, MONDPHASEN_DURATION } from './videos/Mondphasen';
import { Sonnenfinsternis, SONNENFINSTERNIS_DURATION } from './videos/Sonnenfinsternis';
import { Mondfinsternis, MONDFINSTERNIS_DURATION } from './videos/Mondfinsternis';
import { Reflexion, REFLEXION_DURATION } from './videos/Reflexion';
import { ReiheParallel, REIHE_PARALLEL_DURATION } from './videos/ReiheParallel';
import { Elektromagnet6, ELEKTROMAGNET6_DURATION } from './videos/Elektromagnet6';
import { BildLinse, BILD_LINSE_DURATION } from './videos/BildLinse';
import { Lochkamera, LOCHKAMERA_DURATION } from './videos/Lochkamera';
import { Sammellinse, SAMMELLINSE_DURATION } from './videos/Sammellinse';
import { Lupe, LUPE_DURATION } from './videos/Lupe';
import { Kamera, KAMERA_DURATION } from './videos/Kamera';
import { Auge, AUGE_DURATION } from './videos/Auge';
import { Brille, BRILLE_DURATION } from './videos/Brille';
import { Spiegelbild, SPIEGELBILD_DURATION } from './videos/Spiegelbild';
import { Brechung, BRECHUNG_DURATION } from './videos/Brechung';
import { Brechungswinkel, BRECHUNGSWINKEL_DURATION } from './videos/Brechungswinkel';
import { Totalreflexion, TOTALREFLEXION_DURATION } from './videos/Totalreflexion';
import { Prisma, PRISMA_DURATION } from './videos/Prisma';
import { Regenbogen, REGENBOGEN_DURATION } from './videos/Regenbogen';
import { FarbmischungAdditiv, FARBMISCHUNG_ADDITIV_DURATION } from './videos/FarbmischungAdditiv';
import { Himmelskoerper, HIMMELSKOERPER_DURATION } from './videos/Himmelskoerper';
import { Gravitation, GRAVITATION_DURATION } from './videos/Gravitation';
import { Teleskop, TELESKOP_DURATION } from './videos/Teleskop';
import { Spezialteleskop, SPEZIALTELESKOP_DURATION } from './videos/Spezialteleskop';
import { Entfernungen, ENTFERNUNGEN_DURATION } from './videos/Entfernungen';
import { WeltallAufbau, WELTALL_AUFBAU_DURATION } from './videos/WeltallAufbau';
import { SchwarzesLoch, SCHWARZES_LOCH_DURATION } from './videos/SchwarzesLoch';
import { Weltbild, WELTBILD_DURATION } from './videos/Weltbild';
import { Urknall, URKNALL_DURATION } from './videos/Urknall';
import { Geschwindigkeit, GESCHWINDIGKEIT_DURATION } from './videos/Geschwindigkeit';
import { Beschleunigung, BESCHLEUNIGUNG_DURATION } from './videos/Beschleunigung';
import { KraftNewton, KRAFT_NEWTON_DURATION } from './videos/KraftNewton';
import { Hebelgesetz, HEBELGESETZ_DURATION } from './videos/Hebelgesetz';
import { Ladung, LADUNG_DURATION } from './videos/Ladung';
import { Stromstaerke, STROMSTAERKE_DURATION } from './videos/Stromstaerke';
import { Spannung, SPANNUNG_DURATION } from './videos/Spannung';
import { Messen, MESSEN_DURATION } from './videos/Messen';
import { Stromabhaengigkeit, STROMABHAENGIGKEIT_DURATION } from './videos/Stromabhaengigkeit';
import { UIGroessen, U_I_GROESSEN_DURATION } from './videos/UIGroessen';
import { Widerstand, WIDERSTAND_DURATION } from './videos/Widerstand';
import { OhmKennlinie, OHM_KENNLINIE_DURATION } from './videos/OhmKennlinie';
import { Draht, DRAHT_DURATION } from './videos/Draht';
import { ReiheWiderstand, REIHE_WIDERSTAND_DURATION } from './videos/ReiheWiderstand';
import { ParallelWiderstand, PARALLEL_WIDERSTAND_DURATION } from './videos/ParallelWiderstand';
import { Potentiometer, POTENTIOMETER_DURATION } from './videos/Potentiometer';
import { RUI, R_U_I_DURATION } from './videos/RUI';
import { ElektrischeLeistung, ELEKTRISCHE_LEISTUNG_DURATION } from './videos/ElektrischeLeistung';
import { ElektrischeEnergie, ELEKTRISCHE_ENERGIE_DURATION } from './videos/ElektrischeEnergie';
import { Stromkosten, STROMKOSTEN_DURATION } from './videos/Stromkosten';
import { Energiesparen, ENERGIESPAREN_DURATION } from './videos/Energiesparen';
import { Stromgefahren, STROMGEFAHREN_DURATION } from './videos/Stromgefahren';
import { PUIEPt, P_U_I_E_P_T_DURATION } from './videos/PUIEPt';
import { VBegriff, V_BEGRIFF_DURATION } from './videos/VBegriff';
import { VMessen, V_MESSEN_DURATION } from './videos/VMessen';
import { VUmrechnung, V_UMRECHNUNG_DURATION } from './videos/VUmrechnung';
import { Gleichfoermig, GLEICHFOERMIG_DURATION } from './videos/Gleichfoermig';
import { WegZeitDiagramm, WEG_ZEIT_DIAGRAMM_DURATION } from './videos/WegZeitDiagramm';
import { VZeitDiagramm, V_ZEIT_DIAGRAMM_DURATION } from './videos/VZeitDiagramm';
import { VerkehrMessung, VERKEHR_MESSUNG_DURATION } from './videos/VerkehrMessung';
import { KraftWirkung, KRAFT_WIRKUNG_DURATION } from './videos/KraftWirkung';
import { KraftWirkungen, KRAFT_WIRKUNGEN_DURATION } from './videos/KraftWirkungen';
import { Kraftmesser, KRAFTMESSER_DURATION } from './videos/Kraftmesser';
import { Federgesetz, FEDERGESETZ_DURATION } from './videos/Federgesetz';
import { MasseGewicht, MASSE_GEWICHT_DURATION } from './videos/MasseGewicht';
import { Ortsfaktor, ORTSFAKTOR_DURATION } from './videos/Ortsfaktor';
import { Kraftpfeil, KRAFTPFEIL_DURATION } from './videos/Kraftpfeil';
import { KraefteAddieren, KRAEFTE_ADDIEREN_DURATION } from './videos/KraefteAddieren';
import { KraefteGleichgewicht, KRAEFTE_GLEICHGEWICHT_DURATION } from './videos/KraefteGleichgewicht';
import { Wechselwirkung, WECHSELWIRKUNG_DURATION } from './videos/Wechselwirkung';
import { SchiefeEbene, SCHIEFE_EBENE_DURATION } from './videos/SchiefeEbene';
import { Reibung, REIBUNG_DURATION } from './videos/Reibung';
import { BewegungBeschreiben, BEWEGUNG_BESCHREIBEN_DURATION } from './videos/BewegungBeschreiben';
import { GeschwindigkeitRs, GESCHWINDIGKEIT_RS_DURATION } from './videos/GeschwindigkeitRs';
import { GleichfoermigeBewegung, GLEICHFOERMIGE_BEWEGUNG_DURATION } from './videos/GleichfoermigeBewegung';
import { StDiagrammDeuten, ST_DIAGRAMM_DEUTEN_DURATION } from './videos/StDiagrammDeuten';
import { BeschleunigungJg9, BESCHLEUNIGUNG_JG9_DURATION } from './videos/BeschleunigungJg9';
import { BeschleunigungFormelJg9, BESCHLEUNIGUNG_FORMEL_JG9_DURATION } from './videos/BeschleunigungFormelJg9';
import { VerzoegerungJg9, VERZOEGERUNG_JG9_DURATION } from './videos/VerzoegerungJg9';
import { BremswegJg9, BREMSWEG_JG9_DURATION } from './videos/BremswegJg9';
import { FreierFallJg9, FREIER_FALL_JG9_DURATION } from './videos/FreierFallJg9';
import { LuftwiderstandJg9, LUFTWIDERSTAND_JG9_DURATION } from './videos/LuftwiderstandJg9';
import { Energieerhaltung, ENERGIEERHALTUNG_DURATION } from './videos/Energieerhaltung';
import { Achterbahn, ACHTERBAHN_DURATION } from './videos/Achterbahn';
import { Energieentwertung, ENERGIEENTWERTUNG_DURATION } from './videos/Energieentwertung';
import { Wirkungsgrad, WIRKUNGSGRAD_DURATION } from './videos/Wirkungsgrad';
import { WirkungsgradVerluste, WIRKUNGSGRAD_VERLUSTE_DURATION } from './videos/WirkungsgradVerluste';
import { Leistung, LEISTUNG_DURATION } from './videos/Leistung';
import { LeistungEinheiten, LEISTUNG_EINHEITEN_DURATION } from './videos/LeistungEinheiten';
import { EnergieEntwerten, ENERGIE_ENTWERTEN_DURATION } from './videos/EnergieEntwerten';
import { Energiekette, ENERGIEKETTE_DURATION } from './videos/Energiekette';
import { Generator, GENERATOR_DURATION } from './videos/Generator';
import { Waermekraftwerk, WAERMEKRAFTWERK_DURATION } from './videos/Waermekraftwerk';

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
      <Composition id="TagNacht" component={TagNacht} durationInFrames={TAG_NACHT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Jahreszeiten" component={Jahreszeiten} durationInFrames={JAHRESZEITEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Mondphasen" component={Mondphasen} durationInFrames={MONDPHASEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Sonnenfinsternis" component={Sonnenfinsternis} durationInFrames={SONNENFINSTERNIS_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Mondfinsternis" component={Mondfinsternis} durationInFrames={MONDFINSTERNIS_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Reflexion" component={Reflexion} durationInFrames={REFLEXION_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ReiheParallel" component={ReiheParallel} durationInFrames={REIHE_PARALLEL_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Elektromagnet6" component={Elektromagnet6} durationInFrames={ELEKTROMAGNET6_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="BildLinse" component={BildLinse} durationInFrames={BILD_LINSE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Lochkamera" component={Lochkamera} durationInFrames={LOCHKAMERA_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Sammellinse" component={Sammellinse} durationInFrames={SAMMELLINSE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Lupe" component={Lupe} durationInFrames={LUPE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Kamera" component={Kamera} durationInFrames={KAMERA_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Auge" component={Auge} durationInFrames={AUGE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Brille" component={Brille} durationInFrames={BRILLE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Spiegelbild" component={Spiegelbild} durationInFrames={SPIEGELBILD_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Brechung" component={Brechung} durationInFrames={BRECHUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Brechungswinkel" component={Brechungswinkel} durationInFrames={BRECHUNGSWINKEL_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Totalreflexion" component={Totalreflexion} durationInFrames={TOTALREFLEXION_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Prisma" component={Prisma} durationInFrames={PRISMA_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Regenbogen" component={Regenbogen} durationInFrames={REGENBOGEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="FarbmischungAdditiv" component={FarbmischungAdditiv} durationInFrames={FARBMISCHUNG_ADDITIV_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Himmelskoerper" component={Himmelskoerper} durationInFrames={HIMMELSKOERPER_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Gravitation" component={Gravitation} durationInFrames={GRAVITATION_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Teleskop" component={Teleskop} durationInFrames={TELESKOP_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Spezialteleskop" component={Spezialteleskop} durationInFrames={SPEZIALTELESKOP_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Entfernungen" component={Entfernungen} durationInFrames={ENTFERNUNGEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="WeltallAufbau" component={WeltallAufbau} durationInFrames={WELTALL_AUFBAU_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="SchwarzesLoch" component={SchwarzesLoch} durationInFrames={SCHWARZES_LOCH_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Weltbild" component={Weltbild} durationInFrames={WELTBILD_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Urknall" component={Urknall} durationInFrames={URKNALL_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Geschwindigkeit" component={Geschwindigkeit} durationInFrames={GESCHWINDIGKEIT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Beschleunigung" component={Beschleunigung} durationInFrames={BESCHLEUNIGUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="KraftNewton" component={KraftNewton} durationInFrames={KRAFT_NEWTON_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Hebelgesetz" component={Hebelgesetz} durationInFrames={HEBELGESETZ_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Ladung" component={Ladung} durationInFrames={LADUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Stromstaerke" component={Stromstaerke} durationInFrames={STROMSTAERKE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Spannung" component={Spannung} durationInFrames={SPANNUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Messen" component={Messen} durationInFrames={MESSEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Stromabhaengigkeit" component={Stromabhaengigkeit} durationInFrames={STROMABHAENGIGKEIT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="UIGroessen" component={UIGroessen} durationInFrames={U_I_GROESSEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Widerstand" component={Widerstand} durationInFrames={WIDERSTAND_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="OhmKennlinie" component={OhmKennlinie} durationInFrames={OHM_KENNLINIE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Draht" component={Draht} durationInFrames={DRAHT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ReiheWiderstand" component={ReiheWiderstand} durationInFrames={REIHE_WIDERSTAND_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ParallelWiderstand" component={ParallelWiderstand} durationInFrames={PARALLEL_WIDERSTAND_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Potentiometer" component={Potentiometer} durationInFrames={POTENTIOMETER_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="RUI" component={RUI} durationInFrames={R_U_I_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ElektrischeLeistung" component={ElektrischeLeistung} durationInFrames={ELEKTRISCHE_LEISTUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="ElektrischeEnergie" component={ElektrischeEnergie} durationInFrames={ELEKTRISCHE_ENERGIE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Stromkosten" component={Stromkosten} durationInFrames={STROMKOSTEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Energiesparen" component={Energiesparen} durationInFrames={ENERGIESPAREN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Stromgefahren" component={Stromgefahren} durationInFrames={STROMGEFAHREN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="PUIEPt" component={PUIEPt} durationInFrames={P_U_I_E_P_T_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="VBegriff" component={VBegriff} durationInFrames={V_BEGRIFF_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="VMessen" component={VMessen} durationInFrames={V_MESSEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="VUmrechnung" component={VUmrechnung} durationInFrames={V_UMRECHNUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Gleichfoermig" component={Gleichfoermig} durationInFrames={GLEICHFOERMIG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="WegZeitDiagramm" component={WegZeitDiagramm} durationInFrames={WEG_ZEIT_DIAGRAMM_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="VZeitDiagramm" component={VZeitDiagramm} durationInFrames={V_ZEIT_DIAGRAMM_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="VerkehrMessung" component={VerkehrMessung} durationInFrames={VERKEHR_MESSUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="KraftWirkung" component={KraftWirkung} durationInFrames={KRAFT_WIRKUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="KraftWirkungen" component={KraftWirkungen} durationInFrames={KRAFT_WIRKUNGEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Kraftmesser" component={Kraftmesser} durationInFrames={KRAFTMESSER_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Federgesetz" component={Federgesetz} durationInFrames={FEDERGESETZ_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="MasseGewicht" component={MasseGewicht} durationInFrames={MASSE_GEWICHT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Ortsfaktor" component={Ortsfaktor} durationInFrames={ORTSFAKTOR_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Kraftpfeil" component={Kraftpfeil} durationInFrames={KRAFTPFEIL_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="KraefteAddieren" component={KraefteAddieren} durationInFrames={KRAEFTE_ADDIEREN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="KraefteGleichgewicht" component={KraefteGleichgewicht} durationInFrames={KRAEFTE_GLEICHGEWICHT_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Wechselwirkung" component={Wechselwirkung} durationInFrames={WECHSELWIRKUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="SchiefeEbene" component={SchiefeEbene} durationInFrames={SCHIEFE_EBENE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Reibung" component={Reibung} durationInFrames={REIBUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="BewegungBeschreiben" component={BewegungBeschreiben} durationInFrames={BEWEGUNG_BESCHREIBEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="GeschwindigkeitRs" component={GeschwindigkeitRs} durationInFrames={GESCHWINDIGKEIT_RS_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="GleichfoermigeBewegung" component={GleichfoermigeBewegung} durationInFrames={GLEICHFOERMIGE_BEWEGUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="StDiagrammDeuten" component={StDiagrammDeuten} durationInFrames={ST_DIAGRAMM_DEUTEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="BeschleunigungJg9" component={BeschleunigungJg9} durationInFrames={BESCHLEUNIGUNG_JG9_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="BeschleunigungFormelJg9" component={BeschleunigungFormelJg9} durationInFrames={BESCHLEUNIGUNG_FORMEL_JG9_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="VerzoegerungJg9" component={VerzoegerungJg9} durationInFrames={VERZOEGERUNG_JG9_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="BremswegJg9" component={BremswegJg9} durationInFrames={BREMSWEG_JG9_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="FreierFallJg9" component={FreierFallJg9} durationInFrames={FREIER_FALL_JG9_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="LuftwiderstandJg9" component={LuftwiderstandJg9} durationInFrames={LUFTWIDERSTAND_JG9_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Energieerhaltung" component={Energieerhaltung} durationInFrames={ENERGIEERHALTUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Achterbahn" component={Achterbahn} durationInFrames={ACHTERBAHN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Energieentwertung" component={Energieentwertung} durationInFrames={ENERGIEENTWERTUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Wirkungsgrad" component={Wirkungsgrad} durationInFrames={WIRKUNGSGRAD_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="WirkungsgradVerluste" component={WirkungsgradVerluste} durationInFrames={WIRKUNGSGRAD_VERLUSTE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Leistung" component={Leistung} durationInFrames={LEISTUNG_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="LeistungEinheiten" component={LeistungEinheiten} durationInFrames={LEISTUNG_EINHEITEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="EnergieEntwerten" component={EnergieEntwerten} durationInFrames={ENERGIE_ENTWERTEN_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Energiekette" component={Energiekette} durationInFrames={ENERGIEKETTE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Generator" component={Generator} durationInFrames={GENERATOR_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="Waermekraftwerk" component={Waermekraftwerk} durationInFrames={WAERMEKRAFTWERK_DURATION} fps={30} width={1920} height={1080} />
      {/* Weitere Videos kommen hier dazu. */}
    </>
  );
};
