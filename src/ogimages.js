// Makes the pictures used in link previews, and the icons, from the built pages:
//   og/<page>.png (1200 x 630), apple-touch-icon.png (180 x 180), favicon-32.png
// Run it after build.sh whenever an opening figure or a title changes, and commit the results. Needs Playwright (see README.md).
//   OUTDIR   where the built pages are and where the pictures go (default: the folder above this one)
//   FONTDIR  optional: a folder holding @fontsource packages, for a machine that cannot reach Google Fonts
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const D=path.resolve(process.env.OUTDIR||path.join(__dirname,'..'))+path.sep, FD=process.env.FONTDIR;
const PAGES=[['home','index.html','homeCv','NE-CAT beamline guides'],['syn','how-aps-works-intro.html','synHeroCv'],['aps','how-aps-works.html','chainCv'],['walk','how-necat-works-intro.html','walkHeroCv'],['overview','how-necat-works.html','stationsCv'],
  ['polarization','polarization.html','heroCv'],['detintro','detector-intro.html','pixHeroCv'],['det','detector.html','detHeroCv'],['hutch','shielded-room.html','hutchHeroCv'],
  ['see','how-mx-works-intro.html','seeHeroCv'],['mx','how-mx-works.html','mxHeroCv'],['cold','radiation-damage-intro.html','coldHeroCv'],['damage','radiation-damage.html','damHeroCv'],['scatter','fluorescence.html','fxCv']];
const face=(fam,file,wt)=>{const f=path.join(FD,file);return fs.existsSync(f)?`@font-face{font-family:"${fam}";font-weight:${wt};src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format("woff2")}`:'';};
const FONTS=FD?face('Bricolage Grotesque','bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2','600 800')+face('Patrick Hand','patrick-hand/files/patrick-hand-latin-400-normal.woff2',400)+face('Literata','literata/files/literata-latin-400-normal.woff2',400):'';
(async()=>{const b=await chromium.launch();fs.mkdirSync(D+'og',{recursive:true});
 for(const [key,file,cvId,title] of PAGES.filter(p=>fs.existsSync(D+p[1]))){
  const p=await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await p.setContent(fs.readFileSync(D+file,'utf8'),{waitUntil:'domcontentloaded'});
  if(FONTS)await p.addStyleTag({content:FONTS});
  // lay the card out over the page: label, title, and the opening figure as large as will fit
  await p.evaluate(([cvId,title])=>{const cv=document.getElementById(cvId),k=document.querySelector('.kicker'),h=document.querySelector('h1');
    const card=document.createElement('div');card.id='ogcard';card.style.cssText='position:fixed;inset:0;z-index:99999;background:var(--paper);padding:34px 48px 0;display:flex;flex-direction:column;align-items:flex-start;gap:14px';
    const kk=k.cloneNode(true);kk.textContent='NE-CAT beamline guides';kk.style.cssText='font-size:22px;margin:0';
    const hh=document.createElement('div');hh.textContent=title||h.textContent;hh.style.cssText='font-family:var(--f-display);font-weight:800;font-size:64px;line-height:1.05;letter-spacing:-0.01em;color:var(--ink)';
    const box=document.createElement('div');box.id='ogbox';box.style.cssText='width:1104px';cv.style.cssText='width:100%;display:block;border:3px solid var(--ink);background:var(--sky)';box.appendChild(cv);
    card.append(kk,hh,box);document.body.appendChild(card);},[cvId,title||null]);
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
  await p.evaluate(cvId=>{const cv=document.getElementById(cvId),box=document.getElementById('ogbox'),top=box.getBoundingClientRect().top,asp=cv.clientWidth/cv.clientHeight;box.style.width=Math.min(1104,Math.floor((630-top-34)*asp))+'px';},cvId);
  await p.waitForTimeout(key==='mx'?2600:3200);
  await p.screenshot({path:D+'og/'+key+'.png',clip:{x:0,y:0,width:1200,height:630}});await p.close();console.log('og/'+key+'.png');}
 // the icons, from favicon.svg
 const svg=fs.readFileSync(path.join(__dirname,'favicon.svg'),'utf8');
 for(const [name,size] of [['apple-touch-icon.png',180],['favicon-32.png',32]]){const p=await b.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  await p.setContent('<body style="margin:0">'+svg.replace('<svg ','<svg width="'+size+'" height="'+size+'" style="display:block" '));await p.screenshot({path:D+name});await p.close();console.log(name);}
 await b.close();})();
