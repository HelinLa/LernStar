// Legt alle Bauteile einer Datei nebeneinander auf ein Blatt -> img/_test_<datei>.png
const { Resvg } = require('@resvg/resvg-js');
const fs=require('fs'), path=require('path');
const HERE=__dirname, SVG=path.join(HERE,'svg');
const datei=process.argv[2]; if(!datei){console.log('Aufruf: node bauteil_test.js bau_kueche.svg');process.exit(1);}
const stil=fs.readFileSync(path.join(SVG,'_stil.svg'),'utf8');
const teil=fs.readFileSync(path.join(SVG,datei),'utf8');
const ids=[...teil.matchAll(/<g\s+id="(t_[^"]+)"/g)].map(m=>m[1]);
if(!ids.length){console.log('keine <g id="t_..."> gefunden');process.exit(1);}
const cols=Math.min(4,ids.length), rows=Math.ceil(ids.length/cols), CW=420, CH=380;
let body='';
ids.forEach((id,i)=>{const r=Math.floor(i/cols),c=i%cols,x=c*CW+CW/2,y=r*CH+CH-70;
  body+=`<rect x="${c*CW+8}" y="${r*CH+8}" width="${CW-16}" height="${CH-16}" rx="14" fill="#FFF7E8" stroke="#DCCCA6"/>
<line x1="${c*CW+20}" y1="${y}" x2="${c*CW+CW-20}" y2="${y}" stroke="#C4963A" stroke-width="1.5" stroke-dasharray="5 5"/>
<circle cx="${x}" cy="${y}" r="4" fill="#C4963A"/>
<use href="#${id}" transform="translate(${x},${y})"/>\n`;});
const doc=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cols*CW}" height="${rows*CH}" viewBox="0 0 ${cols*CW} ${rows*CH}">
<defs>${stil}${teil}</defs><rect width="100%" height="100%" fill="#EFE7D6"/>${body}</svg>`;
const ziel=path.join(HERE,'img',`_test_${path.basename(datei,'.svg')}.png`);
try{fs.writeFileSync(ziel,new Resvg(doc,{fitTo:{mode:'width',value:cols*CW}}).render().asPng());
  console.log('OK ->',ziel,'|',ids.length,'Teile:',ids.join(' '));}
catch(e){console.log('FEHLER:',e.message.split('\n')[0]);process.exit(2);}
