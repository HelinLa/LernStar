// Hintergrundmusik-Konfiguration für alle LernStar-Lernvideos.
//
// Rohe Pixabay-Tracks kommen nach  public/music/<datei>.mp3
// (dieser Ordner ist per .gitignore ausgeschlossen – lizenzkonform,
//  da nur das fertige Video mit eingemischter Musik veröffentlicht wird).
//
// BG_MUSIC = Dateiname in public/music/, oder null (= keine Musik).
// Sobald eine Datei vorhanden ist, hier den Namen eintragen und neu rendern.
export const BG_MUSIC: string | null = null; // z. B. 'calm.mp3'

// Lautstärke der Musik unter der Sprecherstimme (0..1). Leise halten!
export const BG_VOLUME = 0.12;
