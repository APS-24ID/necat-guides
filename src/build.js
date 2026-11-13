// Builds the finished pages from the page bodies (compose.py) and the scripts (refactor.py). Run it from this folder, or use build.sh.
//   OUTDIR  where the pages go. Default: the folder above this one, which is the root of the repository and of the web site.
//   ARTDIR  optional. If set, a second copy of each page is written there with absolute links between the pages, taken from
//           urls.json ({"home": "...", "aps": "...", ...}). It is for previews hosted somewhere other than the web site.
const fs=require('fs'),path=require('path'),katex=require('katex');
const DIR=path.resolve(process.env.OUTDIR||path.join(__dirname,'..'))+path.sep;fs.mkdirSync(DIR,{recursive:true});
const ART=process.env.ARTDIR?path.resolve(process.env.ARTDIR)+path.sep:null;if(ART)fs.mkdirSync(ART,{recursive:true});
// visitor counting for the GitHub Pages copies only (GoatCounter: no cookies, nothing stored in the browser)
const GC='<script data-goatcounter="https://frankvm04.goatcounter.com/count"\n        async src="//gc.zgo.at/count.js"></script>';
const HEAD='<!doctype html>\n<!-- Copyright (c) 2026 NE-CAT, Cornell University. Released under the MIT License: https://github.com/APS-24ID/necat-guides/blob/main/LICENSE -->\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n';
// A guide's address is its name, with no number in it, so that adding a guide never changes the address of another.
// "old" lists every address a guide has had on the live site. Each becomes a small page that forwards to the new one.
const OUT={aps:{art:'aps-how-it-works.html',file:'how-aps-works.html',js:'aps',old:'NE-CAT_1_How_APS_Works.html'},
  overview:{art:'necat-how-it-works.html',file:'how-necat-works.html',old:['NE-CAT_2_How_NE-CAT_Works.html','NE-CAT_1_How_It_Works.html']},
  polarization:{art:'aps-polarization.html',file:'polarization.html',old:['NE-CAT_3_Beam_Polarization.html','NE-CAT_2_Beam_Polarization.html']},
  syn:{art:'necat-syn.html',file:'how-aps-works-intro.html',js:'syn'},
  walk:{art:'necat-walk.html',file:'how-necat-works-intro.html',js:'walk'},
  detintro:{art:'necat-detintro.html',file:'detector-intro.html',js:'detintro'},
  det:{art:'necat-det.html',file:'detector.html',js:'det'},
  hutch:{art:'necat-hutch.html',file:'shielded-room.html',js:'hutch'},
  cold:{art:'necat-cold.html',file:'radiation-damage-intro.html',js:'cold'},
  damage:{art:'necat-damage.html',file:'radiation-damage.html',js:'damage'},
  mx:{art:'necat-mx.html',file:'how-mx-works.html',js:'mx'},
  scatter:{art:'necat-scatter.html',file:'fluorescence.html',old:['NE-CAT_4_X-ray_Fluorescence.html','NE-CAT_4_Scatter_and_Fluorescence.html','NE-CAT_3_Scatter_and_Fluorescence.html']}};
// a guide whose text is not in this folder (no <key>_guide.py and so no body-<key>.html) is left out
for(const k of Object.keys(OUT))if(!fs.existsSync('body-'+k+'.html'))delete OUT[k];
let urls={};try{urls=JSON.parse(fs.readFileSync('urls.json','utf8'));}catch(e){}
const src=fs.readFileSync('src-script.v6.js','utf8'), kit=src.slice(0,src.indexOf('// ---- beamline settings'))+src.slice(src.indexOf('// ---- ligne claire palette'),src.indexOf('// ---------- HERO'));
const IK=fs.readFileSync('introkit.js','utf8');   // helpers shared by the Introductory guides
const SCRIPT={shared:fs.readFileSync('shared.js','utf8'),aps:kit+fs.readFileSync('aps.js','utf8'),mx:OUT.mx?kit+fs.readFileSync('mx.js','utf8'):'',};
for(const k of ['walk','syn','cold','damage','hutch','detintro','det'])if(OUT[k])SCRIPT[k]=kit+IK+fs.readFileSync(k+'.js','utf8');
const US=[['centimetre','centimeter'],['millimetre','millimeter'],['centre','center'],['Centre','Center'],['neighbouring','neighboring'],['travelling','traveling'],['Travelling','Traveling'],['The maths,','The math,'],['colours','colors'],['goes round','goes around'],['other way round','other way around']];
const SP='<mspace width="0.17em"></mspace>';let n=0;
const r=(tex,d)=>{n++;let m=katex.renderToString(tex.trim(),{output:'mathml',displayMode:d,throwOnError:true,strict:false});
  m=m.replace(/<mo>⁡<\/mo>(?!<mo[^>]*>\()/g,'<mo>⁡</mo>'+SP);
  m=m.replace(/(<\/(?:mi|mn|msub|msup|msubsup|mfrac)>|\)<\/mo>)((?:<msup>)?<mi>(?:cos|sin|tan)<\/mi>)/g,'$1'+SP+'$2');return m;};
const linker=page=>variant=>page.split('{{home}}').join(variant==='art'?(urls.home||'#'):'index.html').replace(/\{\{link:(\w+)\}\}/g,(_,g)=>variant==='art'?(urls[g]||'#'):OUT[g].file)
  .replace(/<a class="(guidelink|homelink)"([^>]*)href="(https:[^"]+)"/g,'<a class="$1"$2target="_blank" rel="noopener" href="$3"').replace(/<a href="(https:\/\/claude\.ai[^"]+)"/g,'<a target="_blank" rel="noopener" href="$1"');
// ---- link previews and icons, for the web site copies only ----
// Messages, LinkedIn, Slack and the rest build their link cards from these tags. They do not run the page's scripts, so the picture
// has to be a real image file: og/<page>.png, made by "node ogimages.js" and kept in the repository.
const SITE='https://aps-24id.github.io/necat-guides/', SITENAME='NE-CAT beamline guides';
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const social=(file,title,desc,img,type)=>{const url=SITE+(file==='index.html'?'':file);return [
  '<meta name="description" content="'+esc(desc)+'">','<meta name="author" content="NE-CAT, Cornell University">','<link rel="canonical" href="'+url+'">',
  '<meta property="og:type" content="'+type+'">','<meta property="og:site_name" content="'+SITENAME+'">','<meta property="og:title" content="'+esc(title)+'">',
  '<meta property="og:description" content="'+esc(desc)+'">','<meta property="og:url" content="'+url+'">',
  '<meta property="og:image" content="'+SITE+'og/'+img+'.png">','<meta property="og:image:type" content="image/png">','<meta property="og:image:width" content="1200">','<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="'+esc('Opening figure of '+(type==='website'?'the '+SITENAME:'the guide “'+title+'”'))+'">','<meta name="twitter:card" content="summary_large_image">',
  '<link rel="icon" type="image/svg+xml" href="favicon.svg">','<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">','<link rel="apple-touch-icon" href="apple-touch-icon.png">'].join('\n');};
const INFO=JSON.parse(fs.readFileSync('guides.json','utf8'));
const standalone=(file,st,head='')=>{const i=st.indexOf('</style>')+8;fs.writeFileSync(DIR+file,HEAD+head+(head?'\n':'')+st.slice(0,i)+'\n</head><body>\n'+st.slice(i)+'\n'+GC+'\n</body></html>\n');};
for(const k of Object.keys(OUT)){
  let body=fs.readFileSync('body-'+k+'.html','utf8');
  body=body.replace(/\\\[([\s\S]*?)\\\]/g,(_,t)=>r(t,true)).replace(/\\\(([\s\S]*?)\\\)/g,(_,t)=>r(t,false));
  // the fluorescence figures and their element table go into the fluorescence guide only
  let page=body+'\n<script>\n'+SCRIPT[OUT[k].js||'shared'].replace('/*__XRFFIGS__*/',k==='scatter'?fs.readFileSync('xrf.built.js','utf8'):'')+'\n</script>\n';
  for(const [x,y] of US) page=page.split(x).join(y);
  const link=linker(page);
  if(ART)fs.writeFileSync(ART+OUT[k].art,link('art'));
  standalone(OUT[k].file,link('file'),social(OUT[k].file,INFO[k].h1,INFO[k].desc,k,'article'));
  // the addresses a guide had before now forward to the new one
  for(const old of [].concat(OUT[k].old||[]))fs.writeFileSync(DIR+old,'<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>This guide has moved</title>\n<meta http-equiv="refresh" content="0; url='+OUT[k].file+'">\n<link rel="canonical" href="'+OUT[k].file+'">\n<script>location.replace("'+OUT[k].file+'"+location.hash);</script>\n</head><body><p>This guide has moved to <a href="'+OUT[k].file+'">'+OUT[k].file+'</a>.</p></body></html>\n');
  console.log(k,page.length);
}
console.log('equations',n);
fs.copyFileSync('favicon.svg',DIR+'favicon.svg');
// ---- the landing page: same style sheet and drawing kit, its own small script ----
{let page=fs.readFileSync('body-home.html','utf8')+'\n<script>\n'+kit+fs.readFileSync('home.js','utf8')+'\n</script>\n';
 for(const [x,y] of US) page=page.split(x).join(y);
 const link=linker(page);
 if(ART)fs.writeFileSync(ART+'necat-guides-home.html',link('art'));
 standalone('index.html',link('file'),social('index.html',SITENAME,'Illustrated, interactive guides to the Advanced Photon Source, the NE-CAT beamlines, and macromolecular crystallography.','home','website'));
 console.log('home',page.length);}
