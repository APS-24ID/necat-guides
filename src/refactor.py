import re, json
s=open('src-script.v6.js').read()
W=json.load(open('water.json'))
def rep(t,old,new,cnt=1):
    assert t.count(old)==cnt,(t.count(old),old[:70]); return t.replace(old,new)
marks=['// ---------- HERO ----------','// ---------- 1 WAVE ----------','// ---------- 2 DIPOLE ----------','// ---------- 3 UNDULATOR ----------','// ---------- 4a SLIPPAGE ----------','// ---------- 4b HEADLIGHT ----------','// ---------- 5 PURITY ----------','// ---------- 6 MONO ----------','// ---------- 7 SAMPLE ----------','// ---------- apply beamline settings everywhere ----------']
idx=[s.index(m) for m in marks]
top=s[:idx[0]]; B={m:s[idx[i]:idx[i+1]] for i,m in enumerate(marks[:-1])}; tail=s[idx[-1]:]
# top: presets get extra fields; shared state and helpers
top=rep(top,"lu:3.3,range:'6.5–19 keV',cr:'111',m:2,vert:true,monoTxt:'Si(111), 2 reflections'}","lu:3.3,range:'6.5–19 keV',cr:'111',m:2,vert:true,monoTxt:'Si(111), 2 reflections',nb:24,gmin:10.5,focus:'17 × 3.5 µm (h × v, 1σ)'}")
top=rep(top,"monoTxt:'Si(111) channel cut, 2 reflections'}","monoTxt:'Si(111) channel cut, 2 reflections',nb:324,gmin:8.5,focus:'23 × 5 µm (h × v)'}")
top=rep(top,"lu:3.3,range:'12.662 keV, fixed',cr:'220',m:1,vert:false,monoTxt:'Si(220)'}","lu:3.3,range:'12.662 keV, fixed',cr:'220',m:1,vert:false,monoTxt:'Si(220)',nb:24,gmin:10.5,focus:'30 × 3.5 µm (h × v, 1σ)'}")
top=rep(top,"lu:2.1,range:'12.662 keV, fixed',cr:'220',m:1,vert:false,monoTxt:'Si(220)'}","lu:2.1,range:'12.662 keV, fixed',cr:'220',m:1,vert:false,monoTxt:'Si(220)',nb:324,gmin:8.5,focus:'5 × 5 µm'}")
top=rep(top,"E1max:0.950*p.Ee*p.Ee/p.lu,","E1max:0.950*p.Ee*p.Ee/p.lu,gap:gapFor(K,p.lu),Kmax:0.934*B0fit(p.gmin,p.lu)*p.lu,")
top=rep(top,"function derive(p){","""// peak field against gap: the fit of Elleaume, Chavanne and Faatz (2000) for hybrid NdFeB undulators, scaled by 1.05 to match APS closed-gap K values
function B0fit(g,lu){const k=g/(lu*10);return k<=1?3.88*Math.exp(-5.068*k+1.52*k*k):3.88*Math.exp(-3.548)*Math.exp(-Math.PI*(k-1));}
function gapFor(K,lu){let a=1,b=80;for(let i=0;i<50;i++){const m=(a+b)/2;if(0.934*B0fit(m,lu)*lu>K)a=m;else b=m;}return (a+b)/2;}
// Bessel function of whole-number order, and the on-axis strength of harmonic n
function besJ(m,x){let s=0,t=Math.pow(x/2,m);for(let i=2;i<=m;i++)t/=i;for(let k=0;k<40;k++){s+=t;t*=-(x*x/4)/((k+1)*(k+1+m));}return s;}
function Fn(n,K){const xi=n*K*K/(4+2*K*K),d=besJ((n-1)/2,xi)-besJ((n+1)/2,xi);return n*n*K*K/Math.pow(1+K*K/2,2)*d*d;}
function derive(p){""")
top=rep(top,"let PKEY='Cpost', PS=PRESETS[PKEY], CUR=derive(PS);","let PKEY='Cpost', PS=PRESETS[PKEY], CUR=derive(PS), GAMMA=CUR.g;\nconst hooks=[], setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};")
def wrap(code,cond,hook=None):
    return 'if(%s){\n%s%s\n}\n\n'%(cond,code.rstrip(),('\nhooks.push(()=>{%s});'%hook) if hook else '')
out=top
out+=wrap(B[marks[0]],"$('heroCv')")
out+=wrap(B[marks[1]],"$('waveCv')")
out+=wrap(B[marks[2]],"$('dipCv')")
u=rep(B[marks[3]],"let uK=1,uL=3.3; let GAMMA=6000/0.51099895;","let uK=1,uL=3.3,uG=12,uB0=0.6;")
u=rep(u,"const sy=h*0.3, gap=h*0.1, mh=h*0.075;","const sy=h*0.3, gap=h*(0.04+0.003*(Math.min(uG,30)-8)), mh=h*0.075, bs=Math.min(1.2,uB0);")
u=rep(u,"arrow(c,x,sy+(s>0?gap*0.78:-gap*0.78),x,sy-(s>0?gap*0.78:-gap*0.78),PUR,1.8,6);","arrow(c,x,sy+(s>0?gap*0.78:-gap*0.78),x,sy-(s>0?gap*0.78:-gap*0.78),PUR,0.8+2.8*bs,5+2*bs);")
u=rep(u,"cap(c,'Side view',12,18);","cap(c,'Side view',12,18);txt(c,'gap '+uG.toFixed(1)+' mm,  B₀ = '+uB0.toFixed(2)+' T',x1,18,15,'right');")
u=rep(u,"const ty=h*0.75, amp=Math.min(h*0.12,28)*uK/1.5, bh=h*0.17;","const ty=h*0.75, bh=h*0.17, amp=Math.min(bh*0.88,Math.min(h*0.12,28)*uK/1.5);")
a_=u.index("function uUpd(){"); b_=u.index("uUpd();",u.index("$('uL').addEventListener"))+len("uUpd();")
u=u[:a_]+"""function uUpd(){uG=+$('uG').value;uL=+$('uL').value;uB0=B0fit(uG,uL);uK=0.934*uB0*uL;if(Math.abs(uG-CUR.gap)<0.006&&Math.abs(uL-PS.lu)<1e-6){uK=CUR.K;uB0=CUR.B0;}$('uGO').textContent=uG.toFixed(2)+' mm';$('uLO').textContent=uL.toFixed(1)+' cm';
  $('uB').textContent=uB0.toFixed(2)+' T';$('uKv').textContent=uK.toFixed(2);
  $('uAmp').textContent=(uK*(uL/100)/(2*Math.PI*GAMMA)*1e6).toFixed(2)+' µm';
  $('uAng').textContent=(uK/GAMMA*1e6).toFixed(0)+' µrad';undFig.w&&undFig.draw(undFig);}
$('uG').addEventListener('input',uUpd);$('uL').addEventListener('input',uUpd);uUpd();"""+u[b_:]
u=rep(u,"fatArrow(c,zE+14,sy,zE+14,sy-By*gap*0.8,PUR,5);electron(c,zE,sy,8);","fatArrow(c,zE,sy,zE,sy-By*gap*0.8,PUR,2.5+4.5*bs);electron(c,zE,sy,8);")
out+=wrap(u,"$('undCv')","$('uG').min=PS.gmin;$('uL').value=PS.lu;$('uG').value=CUR.gap.toFixed(2);uUpd();")
sl=rep(B[marks[4]],"tc=(NP*lu)/ve+1.4, tt=t%tc;","tc=Ltr/ve+0.5, tt=t%tc;")
sl=rep(sl,"const ze=Math.min(tt*ve,NP*lu), lam=lu*(1/sBeta-1);","const ze=tt*ve, lam=lu*(1/sBeta-1);")
sl=rep(sl,"electron(c,x0+ze,y0,8);","if(ze<Ltr-6)electron(c,x0+ze,y0,8);")
out+=wrap(sl,"$('slipCv')")
hl=B[marks[5]]; k=hl.index("function cUpd()")
out+=wrap(hl[:k],"$('relCv')")
out+=wrap('// ---------- CALCULATOR ----------\n'+hl[k:],"$('cE')","$('cE').value=PS.Ee;$('cL').value=PS.lu;$('cK').step='0.0001';$('cK').value=CUR.K.toFixed(4);$('cN').value=String(CUR.n);cUpd();")
out+=wrap(B[marks[6]],"$('purCv')","pUpd();")
m=B[marks[7]]
m=rep(m,"mE=+$('mE').value;mPin=+$('mP').value;mCr=$('mCr').value;mB=+$('mB').value;$('mEO').textContent=mE.toFixed(3)+' keV';$('mPO').textContent=mPin.toFixed(3);",
        "mE=+$('mE').value;mPin=$('mP')?+$('mP').value:PSRC;mCr=$('mCr').value;mB=+$('mB').value;$('mEO').textContent=mE.toFixed(3)+' keV';setT('mPO',mPin.toFixed(3));")
m=rep(m,"$('mTh').textContent=(th*180/Math.PI).toFixed(2)+'°';$('mC').textContent=mB===2?","setT('mTh',(th*180/Math.PI).toFixed(2)+'°');setT('mC',mB===2?")
m=rep(m,"'C = '+Cf.toFixed(3)+' (one bounce)';","'C = '+Cf.toFixed(3)+' (one bounce)');")
m=rep(m,"$('mOut').textContent=Pout.toFixed(4)+(Pout>mPin+1e-6?'  (up)':Pout<mPin-1e-6?'  (down)':'');","setT('mOut',Pout.toFixed(4)+(Pout>mPin+1e-6?'  (up)':Pout<mPin-1e-6?'  (down)':''));")
m=rep(m,"$('mWalk').textContent=mB===2?(1/Math.tan(th)).toFixed(2)+' × gap':'no second face';$('mOff').textContent=mB===2?(2*Math.cos(th)).toFixed(3)+' × gap':'beam leaves at 2θB';",
        "setT('mWalk',mB===2?(1/Math.tan(th)).toFixed(2)+' × gap':'no second face');setT('mOff',mB===2?(2*Math.cos(th)).toFixed(3)+' × gap':'beam leaves at 2θB');")
m=rep(m,"['mE','mP','mCr','mB'].forEach(id=>$(id).addEventListener('input',mUpd));","['mE','mP','mCr','mB'].forEach(id=>{const e=$(id);if(e)e.addEventListener('input',mUpd);});")
m=rep(m,"function mSet(v){mVert=v;$('mV').setAttribute('aria-pressed',String(v));$('mH').setAttribute('aria-pressed',String(!v));mUpd();}\n$('mV').addEventListener('click',()=>mSet(true));$('mH').addEventListener('click',()=>mSet(false));",
        "function mSet(v){mVert=v;if($('mV')){$('mV').setAttribute('aria-pressed',String(v));$('mH').setAttribute('aria-pressed',String(!v));}mUpd();}\nif($('mV')){$('mV').addEventListener('click',()=>mSet(true));$('mH').addEventListener('click',()=>mSet(false));}")
out+=wrap(m,"$('monoCv')","$('mE').step='0.001';$('mE').value=E0;if($('mP'))$('mP').value=PSRC;$('mCr').value=PS.cr;$('mB').value=String(PS.m);mSet(PS.vert);")
sm=B[marks[8]]; k=sm.index("function qUpd()")
out+=wrap(sm[:k],"$('smpCv')","$('sP').value=CUR.Pout.toFixed(3);sUpd();")
out+=wrap('// ---------- MEASURE P ----------\n'+sm[k:],"$('qH')")
out+=open('newfigs.js').read().replace('__WF2__',json.dumps(W['F2'])).replace('__WS__',json.dumps(W['S']))+'\n'
out+='/*__XRFFIGS__*/\n'
open('xrf.built.js','w').write(open('xrffigs.js').read().replace('__XRF__',open('xrf.json').read()))
# tail: text, table, apply
tail=rep(tail,"This is the K = 0 limit. Equation 4.4 adds the corrections.`","This is the limit of a very weak wiggle. The undulator equation adds the corrections.`")
tail=rep(tail,"taking an assumed 0.98 from the source through the mono of step 6.`","taking an assumed 0.98 from the source and passing it through the mono.`")
tail=rep(tail,"useUnd:`Set for ${s}: λu = ${lu} cm, K = ${K} (harmonic ${d.n} at 12.662 keV), γ = ${g}.`","useUnd:`Set for ${s}: λu = ${lu} cm and a gap of about ${d.gap.toFixed(1)} mm, which give K = ${K} (harmonic ${d.n} at 12.662 keV). γ = ${g}. The gap slider stops at ${p.gmin} mm, the smallest gap these undulators close to.`")
tail=rep(tail,"    ['Setting for 12.662 keV ‡',k=>'harmonic '+D[k].n+', K = '+D[k].K.toFixed(2)],","    ['Setting for 12.662 keV ‡',k=>'harmonic '+D[k].n+', K = '+D[k].K.toFixed(2)],\n    ['Undulator gap for that setting ‡',k=>'about '+D[k].gap.toFixed(1)+' mm (smallest: '+PRESETS[k].gmin+' mm)'],")
tail=rep(tail,"  const T={\n","""  const T={
    numGap:`For ${s}: K = ${K} needs B₀ = ${d.B0.toFixed(2)} T. With λu = ${lu} cm the fit puts that at g/λu = ${(d.gap/(p.lu*10)).toFixed(2)}, a gap of about ${d.gap.toFixed(1)} mm. Closing the gap by 1 mm from there raises K by about ${(0.934*B0fit(d.gap-1,p.lu)*p.lu-d.K).toFixed(2)}. At the smallest gap, ${p.gmin} mm, K would be ${d.Kmax.toFixed(2)}.`,
    harmSum:`For ${s}, 12.662 keV is taken from harmonic ${d.n} with K = ${K}, at a gap of about ${d.gap.toFixed(1)} mm.`+(d.n===1?` The short ${lu} cm period lets the fundamental itself reach this energy.`:d.E1max<E0?` The fundamental cannot do it. Even with the gap wide open it stops at ${d.E1max.toFixed(1)} keV, and it fades away as it gets there.`:` The fundamental could reach it, but only with the gap so wide that K falls to ${Math.sqrt(2*(d.E1max/E0-1)).toFixed(2)} and the light is weak. Harmonic ${d.n} is about ${(Fn(d.n,d.K)/Fn(1,Math.sqrt(2*(d.E1max/E0-1)))).toFixed(1)} times as bright on the axis.`),
    useHarm:`Set for ${s}: ${p.Ee} GeV, λu = ${lu} cm. The gap starts at about ${d.gap.toFixed(1)} mm, which puts harmonic ${d.n} on 12.662 keV, and can close to ${p.gmin} mm (K = ${d.Kmax.toFixed(2)}).`,
    numFn:`For ${s} at K = ${K}: F₁ = ${Fn(1,d.K).toFixed(2)}, F₃ = ${Fn(3,d.K).toFixed(2)}, F₅ = ${Fn(5,d.K).toFixed(2)}, F₇ = ${Fn(7,d.K).toFixed(2)}. The beamline uses harmonic ${d.n}.`,
    useRing:`${s}: ${p.Ee} GeV, ${p.I} mA, ${p.nb} bunches.`,
    ringSum:`With the settings for ${s}, the ring holds ${p.I} mA of electrons at ${p.Ee} GeV. Each electron carries ${g} times its rest energy, and falls short of the speed of light by only ${(1e9/(2*d.g*d.g)).toFixed(1)} parts in a billion.`,
    undSum:`For ${s}, each magnet period is ${lu} cm long. The wiggle is only ${d.amp.toFixed(2)} µm to either side, and the electron's direction never swings by more than ${d.ang.toFixed(0)} µrad.`,
    xraySum:`For ${s}, a ${lu} cm magnet period comes out as light of about ${d.lam1.toFixed(2)} Å for a very weak wiggle. For 12.662 keV, the beamline works on harmonic ${d.n} with a wiggle strength K of ${K}.`,
    coneSum:`For ${s}, the cone from one wiggle is about ${ig} µrad wide, which is ${(d.invg*30/1000).toFixed(1)} mm at 30 m from the source. The bright centre is about ${d.thc.toFixed(0)} µrad. The electrons' own spread is ${p.sxp} µrad horizontally and ${p.syp} µrad vertically.`,
    monoSum:`For ${s}: ${crn}, set to a Bragg angle of ${(d.thB*180/Math.PI).toFixed(2)}° for 12.662 keV, which turns the beam through ${t2}°.`+(p.m===2?' The second reflection turns it back, so it leaves parallel to the way it came in.':' These guides assume a single reflection here, so the beam leaves at that angle.'),
    focusSum:`Published focus at the sample for ${s}: ${p.focus}.`,
    useSpec:`Set for ${s}: P = ${d.Pout.toFixed(3)} at the sample, 9° sensor cone.`,
    useCone:`Set for ${s}: 12.662 keV, P = ${d.Pout.toFixed(3)} at the sample.`,
    useEdge:`Set for ${s}: P = ${d.Pout.toFixed(3)} at the sample, 9° sensor cone.`,
    seSum:(()=>{const q=scatCone(90,0,E0,d.Pout,9),m=SEKA*WMASS/(q[0]+q[1])/1000;return `How much scatter is too much depends on how much fluorescence there is. Seen from the ideal spot, with the settings for ${s}, one selenium atom just above its edge sends as much Kα toward the detector as the scatter from about ${Math.round(m/10)*10} kDa of protein and water. A selenomethionine protein has roughly one selenium atom for every 5 to 10 kDa, and the solvent in the crystal and the liquid around it add as much again or more. So in this simple picture its fluorescence stands well clear of the scatter. Real spectra show more scatter than this, because air and the mount add their own, and one metal atom in a large complex has far less fluorescence to offer.`;})(),
    useSweep:`Set for ${s}: 12.662 keV, P = ${d.Pout.toFixed(3)} at the sample.`,
    useMap:/–/.test(p.range)?`Set for ${s}: the beam energy can be set anywhere in ${p.range}.`:`Set for ${s}: the beam energy is fixed at 12.662 keV.`,
    useId:`Set for ${s}: P = ${d.Pout.toFixed(3)} at the sample. Detector at the ideal spot, 15 mm away through air, with a 9° sensor cone.`,
    rangeSum:/–/.test(p.range)?`With the settings for ${s}, the beam can be set anywhere in ${p.range}. That takes in the K edges of the metals from manganese to zinc, and of arsenic, selenium and bromine. It also takes in the L edges of the lanthanides and of the heavy atoms used for soaks, such as platinum, gold and mercury.`:`With the settings for ${s}, the beam stays at one energy, 12.662 keV, which sits just above the selenium K edge. Every element with an edge below that fluoresces there, selenium included, but the energy cannot be stepped across an edge. 24-ID-C can: its range takes in the K edges from manganese to bromine and beyond, and the L edges of the lanthanides and of heavy atoms such as platinum, gold and mercury.`,
""")
tail=rep(tail,"    ['Polarization at the sample ‡',k=>D[k].Pout.toFixed(3)+', from 0.98 † at the mono']","    ['Focused beam at the sample §',k=>PRESETS[k].focus],\n    ['Polarization at the sample ‡',k=>D[k].Pout.toFixed(3)+', from 0.98 † at the mono']")
a=tail.index("function applyPreset(key)"); b=tail.index("})();")
tail=tail[:a]+"""// readout labels in capitals, leaving Greek symbols as they are (γ must not become Γ)
function capK(){document.querySelectorAll('.ro .k').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))n.nodeValue=n.nodeValue.replace(/[a-z]/g,ch=>ch.toUpperCase());});}
function updateLinks(){document.querySelectorAll('a.guidelink').forEach(el=>{if(!el.dataset.base)el.dataset.base=el.getAttribute('href').split('#')[0];if(el.dataset.base&&el.dataset.base!=='#')el.setAttribute('href',el.dataset.base+'#set-'+PKEY);});}
function applyPreset(key){if(!PRESETS[key])key='Cpost';PKEY=key;PS=PRESETS[key];CUR=derive(PS);GAMMA=CUR.g;$('preset').value=key;
  hooks.forEach(fn=>fn());if($('setTbl'))buildTable();fillText();capK();redrawAll();updateLinks();
  try{localStorage.setItem('necat-guide-preset',key);}catch(e){}}
$('preset').addEventListener('change',e=>applyPreset(e.target.value));
let saved=null;const hm=(location.hash||'').match(/^#set-(\\w+)$/);
if(hm)saved=hm[1];else{try{saved=localStorage.getItem('necat-guide-preset');}catch(e){}}
applyPreset(saved||'Cpost');
// ---- equations: open or close all ----
const eqBtn=$('eqAll');let eqOpen=false;
function setEq(o){eqOpen=o;document.querySelectorAll('details.eqcard').forEach(d=>d.open=o);eqBtn.textContent=o?'Close all equations':'Open all equations';eqBtn.setAttribute('aria-pressed',String(o));try{localStorage.setItem('necat-guide-eq',o?'1':'0');}catch(e){}}
eqBtn.addEventListener('click',()=>setEq(!eqOpen));
try{if(localStorage.getItem('necat-guide-eq')==='1')setEq(true);}catch(e){}
"""+tail[b:]
out+=tail
open('shared.js','w').write(out)
print('ok',len(out))
