#!/usr/bin/env node
// ============================================================================
//  bau.js  –  das einzige Bildwerkzeug des Arbeitshefts
// ============================================================================
//  Quellen
//    svg/_stil.svg      Materialien: Verlaeufe, Filter, Vignetten
//    svg/bauteile.svg   72 Bauteile (t_*) plus deren eigene defs (b_*)
//    szenen/<id>.svg    nur der Szenenkoerper, meist ein paar <use>-Zeilen
//  Ergebnis
//    svg/einstieg_<id>.svg   zusammengebautes SVG (zum Nachsehen)
//    img/einstieg_<id>.png   900 px breit, das was ins Heft kommt
//
//  node bau.js                    alle Szenen bauen
//  node bau.js l1 s3 h4           nur diese
//  node bau.js --teile            Kontaktbogen aller Bauteile -> img/_bauteile.png
//  node bau.js --blatt            Kontaktbogen aller Szenen   -> img/_szenen.png
//  node bau.js --pruefen          doppelte ids, fehlende Bauteil-Verweise, tote defs
// ============================================================================
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs'), path = require('path');
const HERE = __dirname, SVG = path.join(HERE,'svg'), SZ = path.join(HERE,'szenen'), IMG = path.join(HERE,'img');
const BUILD = path.join(HERE,'build'); fs.mkdirSync(BUILD,{recursive:true});
const BREITE = 900;   // pastefit im Heft skaliert auf 587 px – ab hier wird nur verkleinert

const stil = fs.readFileSync(path.join(SVG,'_stil.svg'),'utf8');
// svg/bauteile.svg ist die Bibliothek. Zusaetzliche svg/bau_*.svg sind die Werkstatt:
// dort entstehen neue Teile, ohne dass die grosse Datei angefasst wird. Nach der Abnahme
// werden sie eingeschmolzen (siehe README).
const werkstatt = fs.readdirSync(SVG).filter(f => /^bau_.*\.svg$/.test(f)).sort();
const bauteile = [fs.readFileSync(path.join(SVG,'bauteile.svg'),'utf8')]
  .concat(werkstatt.map(f => `<!-- ===== Werkstatt: ${f} ===== -->\n` + fs.readFileSync(path.join(SVG,f),'utf8')))
  .join('\n');
if (werkstatt.length) console.log('Werkstatt aktiv:', werkstatt.join(' '));
const defsQuelle = stil + '\n' + bauteile;

// ---------------------------------------------------------------- defs ---
// Die Bibliothek ist 360 KB. Wuerde sie in jede Szene kopiert, muesste resvg sie
// 31-mal parsen und jede erzeugte Datei waere 360 KB gross. Stattdessen bekommt
// jede Szene nur die Bloecke, die sie wirklich benutzt - samt allem, was diese
// Bloecke ihrerseits brauchen.
function bloeckeLesen(quelle) {
  const bloecke = [];             // {id, text} in Originalreihenfolge
  const re = /<(linearGradient|radialGradient|filter|clipPath|pattern|mask|g)\b[^>]*\sid="([^"]+)"[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(quelle))) {
    const [voll, tag, id, selbstEnde] = m;
    if (selbstEnde === '/') { bloecke.push({id, text: voll}); continue; }
    // passendes Endtag ueber einen Zaehler suchen (Bloecke sind verschachtelt)
    let tiefe = 0, i = m.index, ende = -1;
    const tr = new RegExp(`<${tag}\\b|<\\/${tag}>`, 'g'); tr.lastIndex = m.index;
    let x;
    while ((x = tr.exec(quelle))) {
      if (x[0][1] === '/') { if (--tiefe === 0) { ende = x.index + x[0].length; break; } }
      else tiefe++;
    }
    if (ende < 0) continue;
    bloecke.push({id, text: quelle.slice(m.index, ende)});
    re.lastIndex = ende;
  }
  return bloecke;
}
const ALLE_BLOECKE = bloeckeLesen(defsQuelle);
const NACH_ID = new Map(ALLE_BLOECKE.map(b => [b.id, b]));
// Die Karte, ihre Eckenrundung und die Vignetten setzt bau.js selbst ein
const IMMER = ['clipKarte','karte','karteNacht','vigTag','vigNacht'];

function defsFuer(...texte) {
  const noetig = new Set(), warteschlange = [];
  const sammeln = s => {
    for (const m of s.matchAll(/(?:url\(#|href="#)([^)"]+)/g))
      if (NACH_ID.has(m[1]) && !noetig.has(m[1])) { noetig.add(m[1]); warteschlange.push(m[1]); }
  };
  IMMER.forEach(id => { if (NACH_ID.has(id) && !noetig.has(id)) { noetig.add(id); warteschlange.push(id); } });
  texte.forEach(sammeln);
  while (warteschlange.length) sammeln(NACH_ID.get(warteschlange.shift()).text);
  return ALLE_BLOECKE.filter(b => noetig.has(b.id)).map(b => b.text).join('\n');
}

const rendern = (doc, ziel, breite=BREITE) => {
  fs.writeFileSync(ziel, new Resvg(doc,{fitTo:{mode:'width',value:breite}}).render().asPng());
};

// ---------------------------------------------------------------- pruefen ---
function pruefen() {
  let fehler = 0;
  const zaehler = {};
  for (const m of defsQuelle.matchAll(/\sid="([^"]+)"/g)) zaehler[m[1]] = (zaehler[m[1]]||0)+1;
  const doppelt = Object.entries(zaehler).filter(([,n]) => n>1);
  if (doppelt.length) { console.log('DOPPELTE IDS:', doppelt.map(([k,n])=>`${k} (${n}x)`).join(', ')); fehler++; }

  const vorhanden = new Set(Object.keys(zaehler));
  for (const m of defsQuelle.matchAll(/url\(#([^)]+)\)/g))
    if (!vorhanden.has(m[1])) { console.log('BIBLIOTHEK verweist auf fehlendes def:', m[1]); fehler++; }

  const benutzt = new Set();
  for (const f of fs.readdirSync(SZ).filter(f=>/\.svg$/.test(f))) {
    const t = fs.readFileSync(path.join(SZ,f),'utf8');
    for (const m of t.matchAll(/href="#([^"]+)"/g)) {
      benutzt.add(m[1]);
      if (!vorhanden.has(m[1]) && !/^[a-z0-9]+[A-Z]/.test(m[1]) && !t.includes(`id="${m[1]}"`))
        { console.log(`${f}: benutzt fehlendes Bauteil ${m[1]}`); fehler++; }
    }
  }
  const teile = [...vorhanden].filter(i=>i.startsWith('t_'));
  const tot = teile.filter(i=>!benutzt.has(i));
  console.log(`${teile.length} Bauteile, davon ${benutzt.size ? teile.length-tot.length : 0} benutzt.`);
  if (tot.length) console.log('von keiner Szene benutzt:', tot.join(' '));
  console.log(fehler ? `\n${fehler} Befund(e).` : '\nkeine Befunde.');
  process.exit(fehler?2:0);
}

// -------------------------------------------------------------- kontakte ---
function kontaktbogen(art) {
  const ZELLE = art==='teile' ? {w:420,h:380} : {w:470,h:300};
  let namen, zeichne;
  if (art==='teile') {
    namen = [...bauteile.matchAll(/<g\s+id="(t_[^"]+)"/g)].map(m=>m[1]);
    zeichne = (id,x,y) =>
      `<line x1="${x-190}" y1="${y}" x2="${x+190}" y2="${y}" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="5 5"/>
       <circle cx="${x}" cy="${y}" r="4" fill="#C4963A"/>
       <use href="#${id}" transform="translate(${x},${y})"/>`;
  } else {
    namen = fs.readdirSync(SZ).filter(f=>/\.svg$/.test(f)).map(f=>path.basename(f,'.svg')).sort();
    zeichne = (id,x,y) => {
      const p = path.join(IMG,`einstieg_${id}.png`);
      if (!fs.existsSync(p)) return '';
      const b64 = fs.readFileSync(p).toString('base64');
      return `<image href="data:image/png;base64,${b64}" x="${x-225}" y="${y-135}" width="450" height="270"/>`;
    };
  }
  const spalten = Math.min(4, namen.length), zeilen = Math.ceil(namen.length/spalten);
  let body = '';
  namen.forEach((id,i)=>{
    const s=i%spalten, z=Math.floor(i/spalten);
    const x=s*ZELLE.w+ZELLE.w/2, y=z*ZELLE.h+(art==='teile'?ZELLE.h-70:ZELLE.h/2+12);
    body += `<rect x="${s*ZELLE.w+8}" y="${z*ZELLE.h+8}" width="${ZELLE.w-16}" height="${ZELLE.h-16}" rx="14" fill="#FFF7E8" stroke="#DCCCA6"/>\n`;
    body += zeichne(id,x,y)+'\n';
  });
  const W=spalten*ZELLE.w, H=zeilen*ZELLE.h;
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${art==='teile'?defsQuelle:''}</defs><rect width="100%" height="100%" fill="#EFE7D6"/>${body}</svg>`;
  const ziel = path.join(IMG, art==='teile' ? '_bauteile.png' : '_szenen.png');
  rendern(doc, ziel, Math.min(W,2400));
  console.log('->', ziel, '|', namen.length, art==='teile'?'Bauteile':'Szenen');
}

// ---------------------------------------------------------------- szenen ---
function szenen(nur) {
  const dateien = fs.readdirSync(SZ).filter(f=>/\.svg$/.test(f))
    .filter(f=>!nur.length || nur.includes(path.basename(f,'.svg')));
  if (!dateien.length) { console.log('keine Szenen gefunden in szenen/'); return 0; }
  let fehler = 0;
  for (const f of dateien) {
    const id = path.basename(f,'.svg');
    let roh = fs.readFileSync(path.join(SZ,f),'utf8');
    const nacht = /<!--\s*nacht\s*-->/.test(roh);
    let eigen = '';
    roh = roh.replace(/<defs>([\s\S]*?)<\/defs>/g, (_,inner)=>{ eigen += inner; return ''; });
    const doc =
`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="540" viewBox="0 0 900 540">
<defs>
${defsFuer(roh, eigen)}
<!-- ===== nur fuer diese Szene ===== -->
${eigen}
</defs>
<g clip-path="url(#clipKarte)">
  <rect width="900" height="540" fill="url(#${nacht?'karteNacht':'karte'})"/>
${roh.trim()}
  <rect x="0" y="0" width="900" height="540" fill="url(#${nacht?'vigNacht':'vigTag'})"/>
</g>
<rect x="6" y="6" width="888" height="528" rx="78" fill="none" stroke="#C4963A" stroke-width="4.8"/>
</svg>`;
    fs.writeFileSync(path.join(BUILD,`einstieg_${id}.svg`), doc);
    try { rendern(doc, path.join(IMG,`einstieg_${id}.png`)); console.log('  ', id, nacht?'(Nacht)':''); }
    catch(e) { console.log('   FEHLER', id, '->', e.message.split('\n')[0].slice(0,150)); fehler++; }
  }
  return fehler;
}

const arg = process.argv.slice(2);
if (arg.includes('--pruefen')) pruefen();
else if (arg.includes('--teile')) kontaktbogen('teile');
else if (arg.includes('--blatt')) kontaktbogen('szenen');
else process.exit(szenen(arg) ? 2 : 0);
