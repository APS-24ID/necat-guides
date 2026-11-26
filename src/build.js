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
  see:{art:'necat-see.html',file:'how-mx-works-intro.html',js:'see'},
  prot:{art:'necat-prot.html',file:'what-is-a-protein.html',js:'prot'},
  grow:{art:'necat-grow.html',file:'growing-crystals-intro.html',js:'grow'},
  ride:{art:'necat-ride.html',file:'sample-to-beam.html',js:'ride'},
  waves:{art:'necat-waves.html',file:'fourier-intro.html',js:'waves'},
  res:{art:'necat-res.html',file:'resolution.html',js:'res'},
  phase:{art:'necat-phase.html',file:'phase-problem.html',js:'phase'},
  why:{art:'necat-why.html',file:'why-measure.html',js:'why'},
  med:{art:'necat-med.html',file:'structure-to-medicine.html',js:'med'},
  design:{art:'necat-design.html',file:'protein-design.html',js:'design'},
  found:{art:'necat-found.html',file:'necat-structures.html',js:'found'},
  xtal:{art:'necat-xtal.html',file:'crystallization.html',js:'xtal'},
  proc:{art:'necat-proc.html',file:'data-processing.html',js:'proc'},
  upg:{art:'necat-upg.html',file:'aps-upgrade.html',js:'upg'},
  four:{art:'necat-four.html',file:'fourier-series.html',js:'four'},
  recip:{art:'necat-recip.html',file:'reciprocal-space.html',js:'recip'},
  sym:{art:'necat-sym.html',file:'symmetry.html',js:'sym'},
  mx:{art:'necat-mx.html',file:'how-mx-works.html',js:'mx'},
  scatter:{art:'necat-scatter.html',file:'fluorescence.html',old:['NE-CAT_4_X-ray_Fluorescence.html','NE-CAT_4_Scatter_and_Fluorescence.html','NE-CAT_3_Scatter_and_Fluorescence.html']}};
// a guide whose text is not in this folder (no <key>_guide.py and so no body-<key>.html) is left out
for(const k of Object.keys(OUT))if(!fs.existsSync('body-'+k+'.html'))delete OUT[k];
let urls={};try{urls=JSON.parse(fs.readFileSync('urls.json','utf8'));}catch(e){}
const src=fs.readFileSync('src-script.v6.js','utf8'), kit=src.slice(0,src.indexOf('// ---- beamline settings'))+src.slice(src.indexOf('// ---- ligne claire palette'),src.indexOf('// ---------- HERO'));
const IK=fs.readFileSync('introkit.js','utf8');   // helpers shared by the Introductory guides
const SCRIPT={shared:fs.readFileSync('shared.js','utf8'),aps:kit+fs.readFileSync('aps.js','utf8'),mx:OUT.mx?kit+IK+fs.readFileSync('mbdata.js','utf8')+fs.readFileSync('mx.js','utf8'):'',};
for(const k of ['walk','syn','cold','damage','hutch','detintro','det','see','prot','grow','ride','waves','res','phase','why','med','design','found','xtal','proc','upg','four','recip','sym'])if(OUT[k])SCRIPT[k]=kit+IK+(['see','prot','grow','res','why','design'].includes(k)?fs.readFileSync('mbdata.js','utf8'):'')+(k==='prot'?fs.readFileSync('protdata.js','utf8'):'')+fs.readFileSync(k+'.js','utf8');   // mbdata.js: myoglobin, for the guides that draw it
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
// kiosk mode (kiosk.js) is on every page, ahead of the visitor counter, and does nothing unless it has been switched on
// The kiosk's doors: each lists the five-minute guides behind it that are in the set. kiosk.js is given the same list, so that in kiosk mode
// "Back" and "Next" at the foot of a guide lead around the door the visitor came through.
// The kiosk is built only when kiosk.js is in this folder, as a guide is built only when its files are.
const KIOSK=fs.existsSync('kiosk.js')&&fs.existsSync('kiosk.json'),KK=KIOSK?JSON.parse(fs.readFileSync('kiosk.json','utf8')):{},khas=k=>KK[k]&&OUT[k];
const KDOORS=[{title:'I have five minutes',blurb:'The whole story, once through',pic:['see'],keys:['see']},
  {file:'kiosk-machine.html',title:'Show me the machine',blurb:'A ring of electrons, a beam finer than a hair, a robot and a camera with 16 million pixels',pic:['ride','walk','syn'],keys:['syn','walk','ride','detintro','hutch']},
  {file:'kiosk-why.html',title:'Why does it matter?',blurb:'What proteins are, and how knowing their shape leads to medicines',pic:['med','prot'],keys:['prot','med','design','found','why']}]
  .map(d=>({...d,keys:d.keys.filter(khas),pic:d.pic.find(khas)})).filter(d=>d.keys.length&&d.pic).map(d=>({...d,file:d.keys.length>1?d.file:OUT[d.keys[0]].file}));
const KD={doors:KDOORS.map(d=>({file:d.file,title:d.title,guides:d.keys.length>1?d.keys.map(k=>OUT[k].file):[]})),names:Object.fromEntries(Object.keys(KK).filter(khas).map(k=>[OUT[k].file,KK[k].name]))};
const KS=KIOSK?'<script>\nvar NECAT_KIOSK='+JSON.stringify(KD)+';\n'+fs.readFileSync('kiosk.js','utf8')+'</script>':'';
const standalone=(file,st,head='')=>{const i=st.indexOf('</style>')+8;fs.writeFileSync(DIR+file,HEAD+head+(head?'\n':'')+st.slice(0,i)+'\n</head><body>\n'+st.slice(i)+'\n'+(KS?KS+'\n':'')+GC+'\n</body></html>\n');};
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
{let page=fs.readFileSync('body-home.html','utf8')+'\n<script>\n'+kit+IK+fs.readFileSync('mbdata.js','utf8')+fs.readFileSync('home.js','utf8')+'\n</script>\n';
 for(const [x,y] of US) page=page.split(x).join(y);
 const link=linker(page);
 if(ART)fs.writeFileSync(ART+'necat-guides-home.html',link('art'));
 standalone('index.html',link('file'),social('index.html',SITENAME,'Illustrated, interactive guides to the Advanced Photon Source, the NE-CAT beamlines, and macromolecular crystallography.','home','website'));
 console.log('home',page.length);}

// ---- the kiosk: first screens for a touch panel, 1920 x 1080 and scaled to fit. "Three doors"; a door with several guides opens a screen of tiles ----
if(KIOSK){const K=KK,DOORS=KDOORS,QR=fs.existsSync('kiosk-qr.svg')?fs.readFileSync('kiosk-qr.svg','utf8'):'';
 const CSS=fs.readFileSync('kiosk.css','utf8'),FONTS='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Patrick+Hand&display=swap">';
 const foot=more=>'<div class="foot"><div class="who">NE-CAT<small>Beamlines 24-ID-C and 24-ID-E at the Advanced Photon Source, Argonne National Laboratory</small></div>'+more+'<div class="take"><b>Take the guides with you</b>aps-24id.github.io/necat-guides</div>'+QR+'</div>';
 const FIT="<script>(function(){var s=document.getElementById('stage');function fit(){var k=Math.min(innerWidth/1920,innerHeight/1080);s.style.transform='translate('+((innerWidth-1920*k)/2)+'px,'+((innerHeight-1080*k)/2)+'px) scale('+k+')';}addEventListener('resize',fit);fit();})();</script>";
 const JS=kit+IK+fs.readFileSync('mbdata.js','utf8')+fs.readFileSync('home.js','utf8');
 const write=(file,title,body)=>{fs.writeFileSync(DIR+file,HEAD+'<title>'+title+'</title>\n<meta name="robots" content="noindex">\n<link rel="icon" type="image/svg+xml" href="favicon.svg">\n'+FONTS+'\n<style>\n'+CSS+'</style>\n</head><body>\n<div id="stage"><button id="motionBtn" hidden></button>'+body+'</div>\n'+FIT+'\n<script>\n'+JS+'\n</script>\n'+KS+'\n'+GC+'\n</body></html>\n');console.log(file,body.length);};
 const all='<a class="btn" href="index.html?level=intro">All the five-minute guides ›</a>';
 write('kiosk.html','NE-CAT guides',
  '<div class="top"><div><h1>X-rays that show the shape of life</h1><p>NE-CAT runs two X-ray beamlines where scientists find the structures of proteins. Pick a door.</p></div><div class="touch">touch to explore</div></div><div class="doors n'+DOORS.length+'">'+
  DOORS.map(d=>{const one=d.keys.length===1;return '<a class="door" href="'+d.file+'"><div class="pic"><canvas id="'+K[d.pic].cv+'"></canvas></div><h2>'+d.title+'</h2><p>'+d.blurb+'</p><ul>'+d.keys.map(k=>'<li>'+K[k].name+'</li>').join('')+'</ul><span class="btn dark">'+(one?'Start':'Open ('+d.keys.length+' guides)')+' ›</span></a>';}).join('')+'</div>'+foot(all));
 for(const d of DOORS)if(d.keys.length>1)write(d.file,d.title,
  '<div class="top"><div><h1>'+d.title+'</h1><p>'+d.blurb+'. Five minutes each.</p></div><a class="btn" href="kiosk.html">‹ Back</a></div><div class="tiles n'+d.keys.length+'">'+
  d.keys.map(k=>'<a class="tile" href="'+OUT[k].file+'"><div class="pic"><canvas id="'+K[k].cv+'"></canvas></div><h3>'+K[k].name+'</h3></a>').join('')+'</div>'+foot(all));}
