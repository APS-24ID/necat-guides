// ---------- X-RAY FLUORESCENCE: element data ----------
// Edges, line energies and yields are from the xraylib library. Each line's strength (barn per atom, into all directions) is a power law
// above each of its edges, fitted to xraylib's Kissel cross-sections between 5 and 21 keV. ma and mw are the attenuation of that line
// in air (per mm) and in water (per micron).
const XRF=__XRF__;
const xSig=(l,E)=>{let s=0;for(let i=0;i<l.c.length;i++)if(E>l.th[i])s+=l.c[i]*Math.pow(E/(l.r?l.r[i]:l.th[i]),-l.n);return s;};
const xAll=(sym,E,air,um)=>XRF[sym].lines.reduce((s,l)=>s+xSig(l,E)*Math.exp(-l.ma*air-l.mw*um),0);
const XREF=xAll('Se',12.662,0,0);
// where each element usually comes from in a crystallography sample
const XUSE={Ca:'native sites and the crystallization solution',Mn:'native manganese enzymes',Fe:'hemes and iron–sulfur clusters',Co:'vitamin B12, and cobalt hexammine soaks',Ni:'native nickel enzymes, and nickel left from purification',
  Cu:'copper proteins and oxidases',Zn:'zinc sites, and zinc in the solution',As:'cacodylate buffer, which binds cysteines',Se:'selenomethionine, grown into the protein',Br:'bromide soaks, brominated DNA and RNA',
  Kr:'krypton gas under pressure',Rb:'soaks, standing in for potassium',Sr:'soaks, standing in for calcium',Y:'yttrium soaks',Mo:'nitrogenase and other molybdenum enzymes',
  I:'iodide soaks',Xe:'xenon gas under pressure',Sm:'lanthanide soaks',Eu:'lanthanide soaks',Gd:'lanthanide soaks and gadolinium complexes',Tb:'lanthanide soaks and tags',Ho:'lanthanide soaks',Yb:'lanthanide soaks',Lu:'lanthanide soaks',
  Ta:'the tantalum bromide cluster, for large complexes',W:'tungstate and tungsten clusters',Os:'osmium hexammine and osmate soaks',Ir:'iridium hexammine soaks',Pt:'platinum soaks',Au:'gold soaks',Hg:'mercury compounds on cysteines',Pb:'lead soaks',U:'uranyl soaks'};
const capName=s=>s[0].toUpperCase()+s.slice(1);
// energy resolution of a silicon drift detector (sigma, keV): electronic noise plus the counting statistics of silicon
const sddRes=E=>Math.sqrt(0.0049+0.002328*E)/2.355;
function wavy(c,x0,y0,x1,y1,col,amp=3.5,lam=8,lw=2.2){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<2)return;const ux=dx/L,uy=dy/L;pen(c,lw,col);c.beginPath();
  for(let s=0;s<=L;s+=1.2){const a=amp*Math.min(1,s/5,(L-s)/5)*Math.sin(2*Math.PI*s/lam),X=x0+ux*s-uy*a,Y=y0+uy*s+ux*a;s?c.lineTo(X,Y):c.moveTo(X,Y);}c.stroke();}
const blRange=()=>{const m=PS.range.match(/([\d.]+)–([\d.]+)/);return m?[+m[1],+m[2]]:null;};
const frac=v=>v>=0.095?v.toFixed(2)+' times':v>0?'1/'+(Math.round(1/v/(v<1e-3?100:10))*(v<1e-3?100:10)).toLocaleString('en-US'):'nothing';

// ---------- FLUORESCENCE FROM A CRYSTAL (opening figure of the fluorescence guide) ----------
if($('fxCv')){
const fxIn=(x,y,m)=>Math.abs(y)<=0.62-m&&Math.abs(x)<=1-m&&(Math.abs(x)<=0.6||Math.abs(y)<=0.62-m-(Math.abs(x)-0.6)*0.8);
const FXA=(()=>{const r=rng(5),at=[];let n=0;
  while(at.length<120&&n++<9000){const x=r()*2-1,y=(r()*2-1)*0.62;if(!fxIn(x,y,0.07))continue;if(at.some(a=>Math.hypot(a.x-x,a.y-y)<0.13))continue;at.push({x,y,se:false,fl:0});}
  let k=0;for(const a of at){if(k>=7)break;if(Math.abs(a.x)<0.78&&Math.abs(a.y)<0.42&&at.every(b=>!b.se||Math.hypot(a.x-b.x,a.y-b.y)>0.42)){a.se=true;k++;}}
  return at;})();
const FXS=FXA.filter(a=>a.se), YD=1.05;
const fx={ph:[],gr:[],hist:new Array(40).fill(0),n:0,acc:0,r:rng(21),last:0};
function fxCount(){const r=fx.r,g=Math.sqrt(-2*Math.log(r()+1e-12))*Math.cos(2*Math.PI*r()),E=(r()<0.86?11.21:12.50)+g*0.062,b=Math.floor((E-10.6)/0.065);
  if(fx.n>=150){fx.hist.fill(0);fx.n=0;}if(b>=0&&b<40){fx.hist[b]++;fx.n++;}}
function fxStep(dt){const r=fx.r;fx.acc+=dt*9;
  while(fx.acc>1){fx.acc--;if(r()<0.55){const a=FXS[Math.floor(r()*FXS.length)];fx.ph.push({x:-2.7,y:a.y,a});}else fx.ph.push({x:-2.7,y:(r()-0.5)*0.8,a:null});}
  fx.ph=fx.ph.filter(p=>{p.x+=1.7*dt;if(p.a&&p.x>=p.a.x){p.a.fl=0.5;fx.gr.push({a:p.a,ang:r()*2*Math.PI,d:-0.25,r:0});return false;}return p.x<2.5;});
  FXA.forEach(a=>{if(a.fl>0)a.fl=Math.max(0,a.fl-dt);});
  fx.gr=fx.gr.filter(g=>{g.d+=dt;if(g.d<=0)return true;const y0=g.a.y-Math.sin(g.ang)*g.r;g.r+=1.5*dt;const x=g.a.x+Math.cos(g.ang)*g.r,y=g.a.y-Math.sin(g.ang)*g.r;
    if(y0>-YD&&y<=-YD&&Math.abs(x)<=0.3){fxCount();return false;}return g.r<2.1;});}
for(let i=0;i<240;i++)fxStep(0.05);
for(let i=0;i<26;i++)fxCount();
fig('fxCv',w=>w<560?0.78:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const dt=t-fx.last;fx.last=t;if(dt>0&&dt<0.2)fxStep(dt);
  const cx=narrow?w*0.5:w*0.34, cy=narrow?h*0.4:h*0.6, S=narrow?Math.min(w*0.3,h*0.17):Math.min(w*0.13,h*0.3), PX=x=>cx+x*S, PY=y=>cy+y*S;
  // the beam, the crystal and its atoms
  c.fillStyle='rgba(47,109,181,0.13)';c.fillRect(0,PY(-0.5),narrow?w:PX(2.5),S);
  poly(c,[[-1,-0.3],[-0.6,-0.62],[0.6,-0.62],[1,-0.3],[1,0.3],[0.6,0.62],[-0.6,0.62],[-1,0.3]].map(p=>[PX(p[0]),PY(p[1])]),'#f6f9ee',2.5);
  FXA.forEach(a=>{if(a.se){if(a.fl>0){c.globalAlpha=Math.min(1,a.fl*3);c.fillStyle=YEL;c.beginPath();c.arc(PX(a.x),PY(a.y),narrow?10:13,0,7);c.fill();c.globalAlpha=1;}disc(c,PX(a.x),PY(a.y),narrow?5:6.5,GRN,2);}else disc(c,PX(a.x),PY(a.y),narrow?2.2:3,GREY,1);});
  fx.ph.forEach(p=>wavy(c,PX(p.x)-13,PY(p.y),PX(p.x),PY(p.y),BLUE,3,7,2));
  fx.gr.forEach(g=>{if(g.d<=0)return;const ux=Math.cos(g.ang),uy=-Math.sin(g.ang),x=PX(g.a.x+ux*g.r),y=PY(g.a.y+uy*g.r);c.globalAlpha=g.r>1.8?Math.max(0,(2.1-g.r)/0.3):1;wavy(c,x-ux*14,y-uy*14,x,y,GRN,3,7,2.4);c.globalAlpha=1;});
  // the fluorescence detector, at 90 degrees to the beam
  poly(c,[[-0.3,-YD],[0.3,-YD],[0.36,-YD-0.15],[-0.36,-YD-0.15]].map(p=>[PX(p[0]),PY(p[1])]),GREY);rectF(c,PX(-0.42),PY(-YD-0.57),0.84*S,0.42*S,ORG);
  txt(c,'fluorescence detector',PX(0.5),PY(-YD-0.36),fs,'left');
  txt(c,'X-ray beam',narrow?6:12,PY(0.5)+13,fs,'left');txt(c,'protein crystal',cx,PY(0.62)+15,fs,'center');
  const ky=narrow?PY(0.62)+38:h-40;
  disc(c,(narrow?10:12)+6,ky,3.2,GREY,1);txt(c,'carbon, nitrogen, oxygen: nothing the detector sees',narrow?24:28,ky,fs-1,'left');
  disc(c,(narrow?10:12)+6,ky+fs+5,5.5,GRN,1.8);txt(c,'selenium: gives off X-rays of its own',narrow?24:28,ky+fs+5,fs-1,'left');
  // what the detector has counted so far
  const gx0=narrow?w*0.1:w*0.66, gx1=w*0.96, gy0=narrow?h*0.74:h*0.26, gy1=narrow?h*0.885:h*0.76, X=E=>gx0+(E-10.6)/2.6*(gx1-gx0);
  const ym=Math.max(10,Math.max(...fx.hist)*1.5), Y=v=>gy1-(gy1-gy0)*v/ym;
  rectF(c,gx0,gy0,gx1-gx0,gy1-gy0,WHITE,2.5);
  c.beginPath();c.moveTo(gx0,gy1);fx.hist.forEach((v,i)=>{c.lineTo(X(10.6+i*0.065),Y(v));c.lineTo(X(10.6+(i+1)*0.065),Y(v));});c.lineTo(gx1,gy1);c.closePath();c.fillStyle=LTGRN;c.fill();pen(c,1.8);c.stroke();
  line(c,X(12.662),gy0,X(12.662),gy1,1.6,BLUE,[4,4]);txt(c,'beam',X(12.662)+4,gy0+11,fs-2,'left',BLUE);
  txt(c,'Se Kα',X(11.21),gy0+11,fs-1,'center','#2f7a45');txt(c,'Kβ',X(12.5)-3,gy0+11,fs-1,'right','#2f7a45');
  pen(c,2.5);c.strokeRect(gx0,gy0,gx1-gx0,gy1-gy0);
  [11,12,13].forEach(E=>{line(c,X(E),gy1,X(E),gy1+5,1.6);txt(c,String(E),X(E),gy1+15,fs-2,'center');});
  txt(c,'energy of each X-ray counted (keV)',(gx0+gx1)/2,gy1+31,fs-1,'center');
  txt(c,'what the detector has counted',gx0,gy0-11,fs-1,'left');txt(c,fx.n+' X-rays',gx1,gy0-11,fs-1,'right');
  cap(c,narrow?'Fluorescence from a crystal':'Fluorescence from a protein crystal',12,18,'left',narrow?12:15);
});
}

// ---------- ONE ATOM: absorb, fill the hole, fluoresce or not ----------
if($('atomCv')){
let aSym='Se',aE=E0;
const atomFig=fig('atomCv',w=>w<560?0.62:2.1,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const el=XRF[aSym],ka=el.lines[0],kb=el.lines[1],on=aE>el.ed;
  const ax=narrow?w*0.5:w*0.27, ay=narrow?h*0.27:h*0.45, rM=narrow?Math.min(w*0.27,h*0.17):Math.min(h*0.27,w*0.15), rL=rM*0.68, rK=rM*0.36;
  const T=on?5.4:3.4, k=Math.floor(t/T)+1000, u=t-Math.floor(t/T)*T;
  const isF=j=>Math.floor((j+1)*el.w+0.37)>Math.floor(j*el.w+0.37), fl=isF(k), rr=rng(k*7+3), th=((rr()<0.5?0:180)-40+80*rr())*Math.PI/180;
  const sm=s=>{s=Math.max(0,Math.min(1,s));return s*s*(3-2*s);};
  // shells
  [[rK,'K',0.785],[rL,'L',0.39],[rM,'M',0.785]].forEach(([r,s2,b])=>{pen(c,1.4,'#7d8b96');c.beginPath();c.arc(ax,ay,r,0,7);c.stroke();txt(c,s2,ax+(r+10)*Math.cos(b),ay-(r+10)*Math.sin(b),fs-1,'center','#52606b');});
  disc(c,ax,ay,rK*0.42,RED,2);txt(c,aSym,ax,ay+1,narrow?12:14,'center',WHITE);
  const hole=(x,y)=>{pen(c,1.6,INK);c.setLineDash([3,3]);c.beginPath();c.arc(x,y,6,0,7);c.stroke();c.setLineDash([]);};
  const nM=Math.max(2,Math.min(8,el.Z-10));
  // K shell: the electron on the left is the one that is hit
  electron(c,ax+rK,ay,6);
  if(!on||u<1.1)electron(c,ax-rK,ay,6);
  else{if(u<2.8)hole(ax-rK,ay);
    if(u<2.1){const s=(u-1.1)/1.0;c.globalAlpha=s>0.7?(1-s)/0.3:1;electron(c,ax-rK-0.5*s*rM*1.5,ay-0.86*s*rM*1.5,6);c.globalAlpha=1;}}
  // L shell: the electron on the left drops in
  for(let i=1;i<8;i++){const b=Math.PI+i*Math.PI/4;electron(c,ax+rL*Math.cos(b),ay-rL*Math.sin(b),6);}
  if(!on||u<1.9)electron(c,ax-rL,ay,6);else{hole(ax-rL,ay);electron(c,ax-rL+(rL-rK)*sm((u-1.9)/0.9),ay,6);}
  // M shell: one of these leaves if the atom takes the Auger route
  const aug=on&&!fl&&u>=2.8, mb=i=>2.75+i*2*Math.PI/nM;
  for(let i=0;i<nM;i++){const b=mb(i);if(aug&&i===0){hole(ax+rM*Math.cos(b),ay-rM*Math.sin(b));continue;}electron(c,ax+rM*Math.cos(b),ay-rM*Math.sin(b),6);}
  // the X-ray coming in
  if(on){if(u<1.1){const hx=6+(ax-rK-12)*sm(u/1.1);wavy(c,hx-30,ay,hx,ay,BLUE,4,9,2.6);}}
  else{const xr=narrow?w-6:w*0.52, hx=6+(xr-6)*Math.min(1,u/2.6);c.globalAlpha=u>2.3?Math.max(0,(2.6-u)/0.3):1;wavy(c,hx-30,ay,hx,ay,BLUE,4,9,2.6);c.globalAlpha=1;}
  // what comes out
  if(on&&u>=2.8){const s=Math.min(1,(u-2.8)/1.7);c.globalAlpha=u>4.9?Math.max(0,(5.3-u)/0.4):1;
    if(fl){const r=rK+s*(rM*1.6-rK),x=ax+Math.cos(th)*r,y=ay-Math.sin(th)*r;wavy(c,x-Math.cos(th)*30,y+Math.sin(th)*30,x,y,GRN,4,9,2.8);}
    else{const b=mb(0),r=rM+s*rM*0.75;electron(c,ax+r*Math.cos(b),ay-r*Math.sin(b),6);}
    c.globalAlpha=1;}
  const say=!on?'below the K edge: the X-ray passes straight through':u<1.1?'an X-ray arrives':u<1.9?'it knocks an electron out of the K shell':u<2.8?'an L electron drops into the hole':fl?'the atom gives off an X-ray: fluorescence':'the atom throws out an electron instead: no X-ray';
  tag(c,say,ax,ay+rM+(narrow?21:24),'center',narrow?13:15,on&&u>=2.8?(fl?'#2f7a45':INK):INK);
  if(on){const n=20,sz=narrow?8:9,gp=3,x0=ax-(n*(sz+gp)-gp)/2,y0=ay+rM+(narrow?40:45),hi=u>=2.8?k:k-1;let nf=0;
    for(let i=0;i<n;i++){const j=hi-n+1+i,F=isF(j);if(F)nf++;rectF(c,x0+i*(sz+gp),y0,sz,sz,F?GRN:GREY,1.4);}
    txt(c,'the last 20 atoms hit: '+nf+' gave an X-ray',ax,y0+sz+13,fs-1,'center');}
  // the same thing as energy levels
  const lx0=narrow?w*0.22:w*0.6, lx1=narrow?w*0.9:w*0.93, yF=narrow?h*0.63:h*0.19, yM=narrow?h*0.67:h*0.28, yL=narrow?h*0.725:h*0.4, yK=narrow?h*0.84:h*0.68, lw=lx1-lx0;
  line(c,lx0,yF,lx1,yF,1.6,INK,[5,4]);txt(c,'free of the atom',lx1,yF-10,fs-1,'right');
  [[yM,'M shell',el.ed-kb.E],[yL,'L shell',el.ed-ka.E],[yK,'K shell',el.ed]].forEach(([y,s2,b])=>{line(c,lx0,y,lx1,y,3);txt(c,s2,lx0-6,y-7,fs-1,'right');txt(c,b.toFixed(2)+' keV',lx0-6,y+8,fs-2,'right','#52606b');});
  const xa=lx0+lw*0.12, xb=lx0+lw*0.46, xc=lx0+lw*0.74, ym=(yL+yK)/2-4;
  if(on){arrow(c,xa,yK-3,xa,yF-9,BLUE,3,9);txt(c,'beam: '+aE.toFixed(2),xa+7,ym-8,fs-1,'left',BLUE);txt(c,'keV, enough',xa+7,ym+8,fs-1,'left',BLUE);}
  else{const yt=yK-(yK-yF)*Math.min(0.94,aE/el.ed);arrow(c,xa,yK-3,xa,yt,GREY,3,9);txt(c,'beam: '+aE.toFixed(2),xa+7,ym-8,fs-1,'left','#52606b');txt(c,'keV, too little',xa+7,ym+8,fs-1,'left','#52606b');}
  const gc=on?'#2f7a45':'#8c979f';
  arrow(c,xb,yL+3,xb,yK-4,on?GRN:GREY,3.2,9);txt(c,'Kα',xb+7,ym-8,fs,'left',gc);txt(c,ka.E.toFixed(2)+' keV',xb+7,ym+8,fs-1,'left',gc);
  arrow(c,xc,yM+3,xc,yK-4,on?GRN:GREY,1.8,7);txt(c,'Kβ',xc+7,ym-8,fs,'left',gc);txt(c,kb.E.toFixed(2)+' keV',xc+7,ym+8,fs-1,'left',gc);
  // fluorescence yield
  const by=narrow?h*0.915:h*0.83, bh=narrow?12:15, nx=Math.round(100*el.w);
  txt(c,'of 100 atoms with a hole in the K shell',lx0,by-11,fs-1,'left');
  rectF(c,lx0,by,lw,bh,GREY,2);rectF(c,lx0,by,lw*el.w,bh,GRN,2);
  txt(c,nx+' give an X-ray',lx0,by+bh+12,fs-1,'left','#2f7a45');txt(c,(100-nx)+' an Auger electron',lx1,by+bh+12,fs-1,'right');
  cap(c,'One atom of '+el.name,12,18,'left',narrow?12:15);
  if(narrow)cap(c,'Its shells as energy levels',12,h*0.585,'left',12);else cap(c,'Its shells as energy levels',lx0-40,18,'left',15);
});
function axUpd(){aSym=$('aEl').value;aE=+$('aE').value;$('aEO').textContent=aE.toFixed(2)+' keV';const el=XRF[aSym];
  $('aK').textContent=el.ed.toFixed(3)+' keV';$('aKa').textContent=el.lines[0].E.toFixed(2)+' keV';$('aKb').textContent=el.lines[1].E.toFixed(2)+' keV';
  $('aY').textContent=aE>el.ed?String(Math.round(100*el.w)):'none: beam below the edge';atomFig.w&&atomFig.draw(atomFig);}
['aEl','aE'].forEach(id=>$(id).addEventListener('input',axUpd));axUpd();
}

// ---------- WHICH ATOMS REACH THE DETECTOR ----------
if($('invCv')){
const IV=[['C',0],['N',0],['O',0],['P',1],['S',1],['Cl',2],['Ca',2],['Fe',3],['Cu',3],['Zn',3],['Se',4],['Br',4],['Hg',4]];
const IG=['protein and water','protein, DNA','salts','metals in the protein','put in for phasing'];
let iE=E0,iAir=15,iUm=50;
const invFig=fig('invCv',w=>w<560?0.85:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const x0=w*(narrow?0.2:0.115), x1=w*0.98, y0=h*0.15, y1=h*(narrow?0.84:0.74), sw=(x1-x0)/IV.length, ND=6, Y=v=>y1-(y1-y0)*Math.max(0,(Math.log10(Math.max(v,1e-12))+ND)/ND);
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  ['1','1/10','1/100','1/1,000','1/10,000','1/100,000','1 millionth'].forEach((s2,i)=>{const y=y0+(y1-y0)*i/ND;if(i&&i<ND)line(c,x0,y,x1,y,1,GREY);txt(c,s2,x0-6,y,fs-2,'right');});
  IV.forEach(([sym,g],i)=>{const el=XRF[sym],xm=x0+(i+0.5)*sw,bw=sw*0.34,light=g<3;
    if(i&&IV[i-1][1]!==g)line(c,x0+i*sw,y0,x0+i*sw,y1,1.4,INK,[2,4]);
    if(iE<=el.ed){c.save();c.translate(xm,(y0+y1)/2);c.rotate(-Math.PI/2);txt(c,'edge above the beam',0,0,fs-1,'center','#8c979f');c.restore();}
    else{const em=xAll(sym,iE,0,0)/XREF, rc=xAll(sym,iE,iAir,iUm)/XREF;
      if(em>1e-6){c.fillStyle=light?LTBLUE:LTGRN;c.fillRect(xm-bw,Y(em),bw,y1-Y(em));pen(c,1.6);c.strokeRect(xm-bw,Y(em),bw,y1-Y(em));}
      if(rc>1e-6){c.fillStyle=light?BLUE:GRN;c.fillRect(xm,Y(rc),bw,y1-Y(rc));pen(c,1.6);c.strokeRect(xm,Y(rc),bw,y1-Y(rc));}
      else txt(c,'×',xm+bw/2,y1-9,fs+1,'center','#8c979f');}
    txt(c,sym,xm,y1+13,fs,'center');});
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  if(!narrow){let a=0;IG.forEach((s2,g)=>{const n=IV.filter(q=>q[1]===g).length,xa=x0+a*sw+5,xb=x0+(a+n)*sw-5,y=y1+29;pen(c,1.6);c.beginPath();c.moveTo(xa,y-5);c.lineTo(xa,y);c.lineTo(xb,y);c.lineTo(xb,y-5);c.stroke();
    txt(c,s2,(xa+xb)/2,y+13,fs-2,'center');a+=n;});}
  cap(c,narrow?'One atom of each, against one Se':'One atom of each element, compared with one selenium atom',12,18,'left',narrow?12:15);
},false);
function ivUpd(){iE=+$('iE').value;iAir=+$('iAir').value;iUm=+$('iUm').value;$('iEO').textContent=iE.toFixed(2)+' keV';$('iAirO').textContent=iAir+' mm';$('iUmO').textContent=iUm+' µm';
  $('iS').textContent=frac(xAll('S',iE,iAir,iUm)/XREF);$('iFe').textContent=frac(xAll('Fe',iE,iAir,iUm)/XREF);
  const off=IV.filter(q=>iE<=XRF[q[0]].ed).map(q=>q[0]);$('iOff').textContent=off.length?off.join(', '):'none of these';invFig.w&&invFig.draw(invFig);}
['iE','iAir','iUm'].forEach(id=>$(id).addEventListener('input',ivUpd));ivUpd();
}

// ---------- EDGES AND LINES ON ONE ENERGY SCALE ----------
if($('mapCv')){
const MK=['Ca','Mn','Fe','Co','Ni','Cu','Zn','As','Se','Br','Kr','Rb','Sr','Y','Mo'], ML=['I','Xe','Sm','Eu','Gd','Tb','Ho','Yb','Lu','Ta','W','Os','Ir','Pt','Au','Hg','Pb','U'];
let mSym='Se',mE=E0,mHit=[];
const mapFig=fig('mapCv',w=>w<560?0.74:2.55,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?11:14;
  const Ea=3,Eb=21,x0=w*0.035,x1=w*0.975,X=E=>x0+(E-Ea)/(Eb-Ea)*(x1-x0), yA=narrow?h*0.4:h*0.43, yB=h-(narrow?40:44), bw=narrow?19:25, bh=narrow?15:18, st=bh+4;
  const rg=blRange(), el=XRF[mSym], on=mE>el.ed;
  // what the beamline can be set to
  if(rg){c.fillStyle=LTYEL;c.fillRect(X(rg[0]),30,X(rg[1])-X(rg[0]),yB-66);pen(c,1.4);c.setLineDash([5,4]);c.strokeRect(X(rg[0]),30,X(rg[1])-X(rg[0]),yB-66);c.setLineDash([]);}
  else line(c,X(12.662),30,X(12.662),yB-36,7,LTYEL);
  line(c,x0,yA,x1,yA,2.5);for(let E=Ea;E<=Eb;E++)line(c,X(E),yA-4,X(E),yA+4,1.6);
  // flags: K edges above the axis, L edges below, stacked so that none overlap
  mHit=[];
  const place=(list,dir)=>{const lev=[];list.map(s2=>({s:s2,x:X(XRF[s2].ed)})).sort((a,b)=>a.x-b.x).forEach(q=>{let L=0;while(lev[L]!==undefined&&q.x-bw/2<lev[L]+3)L++;lev[L]=q.x+bw/2;
    const y=yA+dir*(14+L*st+bh/2), sel=q.s===mSym, ex=mE>XRF[q.s].ed;
    line(c,q.x,yA,q.x,y-dir*bh/2,1.1,sel?RED:'#7d8b96');
    rectF(c,q.x-bw/2,y-bh/2,bw,bh,sel?RED:ex?LTGRN:WHITE,sel?2.2:1.5);txt(c,q.s,q.x,y+1,fs,'center',sel?WHITE:INK);mHit.push([q.x,y,q.s]);});};
  place(MK,-1);place(ML,1);
  txt(c,'K edges',x0,yA-14-bh-12,fs,'left');txt(c,'L edges',x0,yA+14+2*st+11,fs,'left');
  // the beam
  const yT=narrow?h*0.105+19:64;line(c,X(mE),yT,X(mE),yB-16,2.2,BLUE);tag(c,'beam '+mE.toFixed(2)+' keV',Math.min(Math.max(X(mE),x0+52),x1-52),yT,'center',fs,BLUE);
  // the chosen element: its edge and its lines on a second copy of the scale
  line(c,x0,yB,x1,yB,2);for(let E=Ea+1;E<=Eb;E+=(narrow?2:1)){line(c,X(E),yB,X(E),yB+4,1.4);txt(c,String(E),X(E),yB+14,fs-1,'center');}
  txt(c,'keV',x1,yB+28,fs-1,'right');
  const lc=on?GRN:GREY;
  el.lines.forEach((l,i)=>{line(c,X(l.E),yB-13,X(l.E),yB+1,i?3:5,lc);});
  line(c,X(el.ed),yB-13,X(el.ed),yB+1,3,RED);
  txt(c,el.lines[0].nm,X(el.lines[0].E),yB-22,fs-1,'center',on?'#2f7a45':'#8c979f');txt(c,el.lines[1].nm,X(el.lines[1].E)+3,yB-22,fs-1,'right',on?'#2f7a45':'#8c979f');txt(c,'edge',X(el.ed)+5,yB-22,fs-1,'left',RED);
  const la=el.lines.map(l=>l.nm).join(', ');
  txt(c,capName(el.name)+': '+(narrow?(on?'lines in green, edge in red':'beam below the edge, no lines'):(on?'lines in green ('+la+'), edge in red':'no lines while the beam is below the edge, which is in red')),x0,yB+28,fs,'left',on?INK:'#52606b');
  if(rg)txt(c,narrow?PS.bl+': anywhere in this band':PS.bl+' can be set anywhere in the yellow band',X(rg[0])+6,narrow?h*0.105:42,fs,'left');else txt(c,PS.bl+' works at 12.662 keV only',narrow?x0:X(12.662)-10,narrow?h*0.105:42,fs,narrow?'left':'right');
  cap(c,'Absorption edges on one energy scale',12,18,'left',narrow?12:15);
},false);
function mpUpd(){mSym=$('mEl').value;mE=+$('mE2').value;$('mE2O').textContent=mE.toFixed(2)+' keV';const el=XRF[mSym],rg=blRange(),K=el.sh==='K';
  $('mEd').textContent=(K?'K edge, ':'L₃ edge, ')+el.ed.toFixed(3)+' keV';$('mLn').textContent=el.lines.map(l=>l.nm+' '+l.E.toFixed(2)).join(', ')+' keV';
  $('mSrc').textContent=XUSE[mSym];
  $('mBl').textContent=rg?(el.ed<rg[0]+0.03?'edge below the range: it fluoresces, but no edge scan':el.ed>rg[1]-0.03?'edge at the very top of the range':'edge within the range: an edge scan is possible')
    :(el.ed<12.662?'it fluoresces at 12.662 keV, but the energy cannot be scanned':'edge above 12.662 keV: no fluorescence here');
  mapFig.w&&mapFig.draw(mapFig);}
['mEl','mE2'].forEach(id=>$(id).addEventListener('input',mpUpd));
mapFig.cv.style.cursor='pointer';
mapFig.cv.addEventListener('click',e=>{const r=mapFig.cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=18;
  mHit.forEach(q=>{const d=Math.hypot(q[0]-x,q[1]-y);if(d<bd){bd=d;best=q[2];}});if(best){$('mEl').value=best;mpUpd();}});
mpUpd();hooks.push(mpUpd);
}

// ---------- THE EDGE SCAN: from fluorescence to f' and f'' ----------
if($('scanCv')){
// a model of a selenomethionine K edge with the right sizes, not a measurement: a step, a white line just above it,
// and the f' that goes with each (a logarithmic dip for the step, a dispersive curve for the white line)
const SEE=12.658, SEG=0.0015, SEW=12.6605;
const fpp=(E,A)=>0.5+3.1*(0.5+Math.atan((E-SEE)/SEG)/Math.PI)+3*A/(1+((E-SEW)/SEG)**2);
const fpr=(E,A)=>{const x=(E-SEW)/SEG;return -1.5+3.1/Math.PI*Math.log(Math.hypot(E-SEE,SEG)/2)+3*A*x/(1+x*x);};
const SZ=(()=>{const r=rng(31),z=[];for(let i=0;i<=100;i++)z.push(Math.sqrt(-2*Math.log(r()+1e-12))*Math.cos(2*Math.PI*r()));return z;})();
let sE=SEW,sA=1,sPk=SEW,sIn=SEE,sHas=true;
function sFind(){let a=-1e9,b=1e9;for(let E=12.64;E<=12.68;E+=0.0001){const p=fpp(E,sA),q=fpr(E,sA);if(p>a){a=p;sPk=E;}if(q<b){b=q;sIn=E;}}
  // with no white line f″ only levels off: there is no peak, and the energy used is a little above the edge
  sHas=sPk<12.675;if(!sHas)sPk=SEE+0.006;}
const scanFig=fig('scanCv',w=>w<560?0.72:1.9,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const Ea=12.62,Eb=12.72,x0=w*(narrow?0.13:0.075),x1=w*0.965,X=E=>x0+(E-Ea)/(Eb-Ea)*(x1-x0);
  const ty0=h*0.13,ty1=h*0.36,by0=h*0.43,by1=h*0.87, top=fpp(sPk,sA)-0.5, N0=1500;
  const YT=v=>ty1-(ty1-ty0)*Math.min(1.12,v/N0)/1.12, YB=v=>by1-(by1-by0)*(v+12)/22;
  rectF(c,x0,ty0,x1-x0,ty1-ty0,WHITE,2.5);rectF(c,x0,by0,x1-x0,by1-by0,WHITE,2.5);
  // the scan as counted, one point per electron-volt
  pen(c,4,LTGRN);c.beginPath();for(let i=0;i<=400;i++){const E=Ea+(Eb-Ea)*i/400,v=N0*(fpp(E,sA)-0.5)/top;i?c.lineTo(X(E),YT(v)):c.moveTo(X(E),YT(v));}c.stroke();
  for(let i=0;i<=100;i+=(narrow?2:1)){const E=Ea+i*0.001,v=N0*(fpp(E,sA)-0.5)/top+12;disc(c,X(E),YT(Math.max(0,v+Math.sqrt(v)*SZ[i])),narrow?1.8:2.4,GRN,1);}
  txt(c,'fluorescence counted at each step',x0+8,ty0+13,fs-1,'left');
  // f'' and f'
  [-10,-5,0,5].forEach(v=>{line(c,x0,YB(v),x1,YB(v),v?1:1.8,v?GREY:INK);txt(c,String(v),x0-6,YB(v),fs-1,'right');});
  [[sIn,'inflection','right'],[sPk,sHas?'peak':'no sharp peak','left']].forEach(([E,s2,al])=>{line(c,X(E),ty0,X(E),by1,1.3,'#7d8b96',[3,4]);txt(c,s2,X(E)+(al==='left'?5:-5),(ty1+by0)/2,fs-1,al,'#52606b');});
  [[fpp,RED],[fpr,BLUE]].forEach(([fn,col])=>{pen(c,2.6,col);c.beginPath();for(let i=0;i<=500;i++){const E=Ea+(Eb-Ea)*i/500;i?c.lineTo(X(E),YB(fn(E,sA))):c.moveTo(X(E),YB(fn(E,sA)));}c.stroke();});
  txt(c,'f″',x1-8,YB(fpp(Eb,sA))-12,fs+2,'right',RED);txt(c,'f′',x1-8,YB(fpr(Eb,sA))+13,fs+2,'right',BLUE);
  txt(c,'electrons',x0+8,by0+13,fs-1,'left');
  // the chosen energy
  line(c,X(sE),ty0,X(sE),by1,2,INK);disc(c,X(sE),YB(fpp(sE,sA)),5,RED,2);disc(c,X(sE),YB(fpr(sE,sA)),5,BLUE,2);
  pen(c,2.5);c.strokeRect(x0,ty0,x1-x0,ty1-ty0);c.strokeRect(x0,by0,x1-x0,by1-by0);
  for(let i=0;i<=5;i++){const E=Ea+i*0.02;line(c,X(E),by1,X(E),by1+5,1.6);txt(c,E.toFixed(2),X(E),by1+16,fs-1,'center');}
  txt(c,'beam energy (keV)',(x0+x1)/2,by1+33,fs,'center');
  cap(c,narrow?'A selenium edge scan':'A selenium edge scan, and what is worked out from it',12,18,'left',narrow?12:15);
},false);
function scUpd(){sE=+$('sE').value;sA=+$('sA').value;sFind();$('sEO').textContent=sE.toFixed(4)+' keV';$('sAO').textContent=sA===0?'no peak':sA<0.6?'small':sA<1.4?'typical':'tall';
  $('sFpp').textContent=fpp(sE,sA).toFixed(1)+' electrons';$('sFp').textContent=fpr(sE,sA).toFixed(1).replace('-','−')+' electrons';
  $('sPkE').textContent=sHas?sPk.toFixed(4)+' keV':'no sharp peak: use '+sPk.toFixed(3)+' keV';$('sInE').textContent=sIn.toFixed(4)+' keV';scanFig.w&&scanFig.draw(scanFig);}
['sE','sA'].forEach(id=>$(id).addEventListener('input',scUpd));
[['sBP',()=>sPk],['sBI',()=>sIn],['sBR',()=>12.708]].forEach(([id,fn])=>$(id).addEventListener('click',()=>{$('sE').value=fn().toFixed(4);scUpd();}));
scUpd();
}

// ---------- THE SPECTRUM: which elements are in the beam ----------
if($('idCv')){
const IDL=['Mn','Fe','Co','Ni','Cu','Zn','Se','Br','Pt','Hg'], idOn={Fe:true,Zn:true};
let dE=E0,dP=0.98;const DKDA=150;
function idPeaks(){const pk=[];IDL.forEach(s2=>{if(!idOn[s2])return;XRF[s2].lines.forEach(l=>{const a=xSig(l,dE)/(4*Math.PI*0.07941)*Math.exp(-l.ma*15-l.mw*50);if(a>0)pk.push({E:l.E,a,sg:sddRes(l.E),nm:s2+' '+l.nm,sym:s2,k:0});});});
  const q=scatCone(90,0,dE,dP,9),nW=DKDA*1000/WMASS,Ec=comptonE(dE,90);
  pk.push({E:Ec,a:q[1]*nW,sg:Math.hypot(sddRes(Ec),0.06),nm:'Compton',k:1});pk.push({E:dE,a:q[0]*nW,sg:sddRes(dE),nm:'elastic',k:2});return pk;}
const idFig=fig('idCv',w=>w<560?1.0:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const Ea=4.5,Eb=Math.max(11,dE+0.9),x0=w*0.05,x1=w*0.975,y0=h*0.14,y1=h*0.8,X=E=>x0+(E-Ea)/(Eb-Ea)*(x1-x0);
  const pk=idPeaks(), val=E=>pk.reduce((s,q)=>s+q.a/q.sg*Math.exp(-0.5*((E-q.E)/q.sg)**2),0), N=narrow?500:900;
  let ym=1e-9;for(let i=0;i<=N;i++)ym=Math.max(ym,val(Ea+(Eb-Ea)*i/N));ym*=1.75;
  const Y=v=>y1-(y1-y0)*v/ym;
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  c.beginPath();c.moveTo(x0,y1);for(let i=0;i<=N;i++){const E=Ea+(Eb-Ea)*i/N;c.lineTo(X(E),Y(val(E)));}c.lineTo(x1,y1);c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,2.2);c.stroke();
  // labels, stacked so that none overlap
  const lev=[],labs=[];c.font=`${fs}px ${HAND}`;
  pk.filter(q=>q.a/q.sg>ym*0.012).sort((a,b)=>a.E-b.E).forEach(q=>{const tw=c.measureText(q.nm).width,x=Math.min(Math.max(X(q.E),x0+tw/2+3),x1-tw/2-3);let L=0;while(lev[L]!==undefined&&x-tw/2<lev[L]+6)L++;lev[L]=x+tw/2;
    const yy=y0+13+L*(fs+3), col=q.k===0?'#2f7a45':q.k===1?BLUE:RED, tp=Y(val(q.E));
    if(tp>yy+11)line(c,X(q.E),yy+9,X(q.E),tp-3,1.2,col,[2,3]);labs.push([q.nm,x,yy,col,tw]);});
  labs.forEach(([s2,x,yy,col,tw])=>{c.fillStyle=WHITE;c.fillRect(x-tw/2-2,yy-fs/2-1,tw+4,fs+3);txt(c,s2,x,yy,fs,'center',col);});
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  for(let E=Math.ceil(Ea);E<=Eb;E++){line(c,X(E),y1,X(E),y1+5,1.6);if(!narrow||E%2===0)txt(c,String(E),X(E),y1+16,fs-1,'center');}
  txt(c,'energy of the X-rays arriving (keV)',(x0+x1)/2,y1+34,fs,'center');
  cap(c,'A fluorescence spectrum',12,18,'left',narrow?12:15);
},false);
function dUpdX(){dE=+$('dEb').value;$('dEbO').textContent=dE.toFixed(2)+' keV';
  const on=IDL.filter(s2=>idOn[s2]), lit=on.filter(s2=>dE>XRF[s2].ed), off=on.filter(s2=>dE<=XRF[s2].ed);
  $('dOn').textContent=lit.length?lit.map(s2=>s2+' '+XRF[s2].lines[0].nm+' '+XRF[s2].lines[0].E.toFixed(2)).join(', ')+' keV':'none';
  $('dOff').textContent=off.length?off.join(', ')+': edge above the beam':on.length?'none':'nothing chosen';
  let best=null;const ls=[];lit.forEach(s2=>XRF[s2].lines.forEach(l=>{if(xSig(l,dE)>0)ls.push([s2,l]);}));
  for(let i=0;i<ls.length;i++)for(let j=i+1;j<ls.length;j++){if(ls[i][0]===ls[j][0])continue;const d=Math.abs(ls[i][1].E-ls[j][1].E);if(!best||d<best[0])best=[d,ls[i],ls[j]];}
  $('dCl').textContent=best?best[1][0]+' '+best[1][1].nm+' and '+best[2][0]+' '+best[2][1].nm+', '+best[0].toFixed(2)+' keV apart':'needs two elements';
  idFig.w&&idFig.draw(idFig);}
IDL.forEach(s2=>{const b=$('dT'+s2);b.setAttribute('aria-pressed',String(!!idOn[s2]));b.addEventListener('click',()=>{idOn[s2]=!idOn[s2];b.setAttribute('aria-pressed',String(idOn[s2]));dUpdX();});});
$('dEb').addEventListener('input',dUpdX);dUpdX();
hooks.push(()=>{dP=CUR.Pout;dUpdX();});
}
