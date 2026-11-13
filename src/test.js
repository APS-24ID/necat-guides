// Loads every page at desktop and phone width, steps through the menus, and reports script errors, sideways scrolling
// and empty read-outs. Needs Playwright: npm install --no-save playwright && npx playwright install chromium
//   OUTDIR  where the pages are (default: the folder above this one)      SHOTS  if set, full-page screenshots go to shots/
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const D=path.resolve(process.env.OUTDIR||path.join(__dirname,'..'))+path.sep, SHOTS=process.env.SHOTS;
const PAGES=['index','how-aps-works-intro','how-aps-works','how-necat-works-intro','how-necat-works','polarization','detector-intro','detector','shielded-room','how-mx-works','radiation-damage-intro','radiation-damage','fluorescence'];
(async()=>{const b=await chromium.launch();let bad=0;const PG=PAGES.filter(f=>fs.existsSync(D+f+'.html'));if(SHOTS)fs.mkdirSync('shots',{recursive:true});
 for(const f of PG){const html=fs.readFileSync(D+f+'.html','utf8');
  for(const [name,W] of [['desk',1100],['phone',400]]){
   const p=await b.newPage({viewport:{width:W,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
   await p.setContent(html,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1500);
   if(await p.$('#preset'))for(const k of ['Cpre','Epost','Epre','Cpost']){await p.selectOption('#preset',k);await p.waitForTimeout(100);}
   if(await p.$('#mode'))for(const k of ['48','324','216']){await p.selectOption('#mode',k);await p.waitForTimeout(150);}
   const ov=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
   const cnt=await p.evaluate(()=>[document.querySelectorAll('details.eqcard').length,document.querySelectorAll('canvas').length,[...document.querySelectorAll('[data-d]')].filter(e=>!e.textContent.trim()).length,[...document.querySelectorAll('.ro .v')].filter(e=>e.textContent.trim()==='–').length]);
   const ok=!errs.length&&!ov&&!cnt[2]&&!cnt[3];if(!ok)bad++;
   console.log(ok?'ok  ':'FAIL',f,name,'errors',errs,'sideways scroll',ov,'equations/figures/empty text/empty read-outs',cnt);
   if(SHOTS)await p.screenshot({path:`shots/${f}_${name}.png`,fullPage:true});await p.close();}
 }
 await b.close();process.exit(bad?1:0);})();
