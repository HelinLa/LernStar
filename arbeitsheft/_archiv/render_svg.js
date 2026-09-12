// SVG-Szenen -> hochaufloesende PNGs in img/.  Aufruf: node render_svg.js
const {Resvg}=require('@resvg/resvg-js'); const fs=require('fs'), path=require('path');
const SRC=path.join(__dirname,'svg'), OUT=path.join(__dirname,'img'), SCALE=2.4;
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.svg'))){
  const svg=fs.readFileSync(path.join(SRC,f),'utf8');
  const vb=/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)/.exec(svg);
  const w=Math.round(parseFloat(vb[1])*SCALE);
  const png=new Resvg(svg,{fitTo:{mode:'width',value:w},background:'rgba(0,0,0,0)'}).render().asPng();
  const out=path.join(OUT,f.replace(/\.svg$/,'.png')); fs.writeFileSync(out,png);
  console.log('  ',path.basename(out),w+'px');
}
