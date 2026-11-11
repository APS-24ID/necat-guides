(()=>{
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let playing = !reduce;
const mBtn = document.getElementById('motionBtn');
const setMotionLabel=()=>{mBtn.textContent = playing?'Pause motion':'Play motion'; mBtn.setAttribute('aria-pressed', String(!playing));};
setMotionLabel();
mBtn.addEventListener('click',()=>{playing=!playing;setMotionLabel();});
const $=id=>document.getElementById(id);

// ---- beamline settings (see the table and its notes for sources and assumptions) ----
const PRESETS={
  Cpre:{bl:'24-ID-C',when:'before the upgrade',ring:'APS',Ee:7,I:100,emit:'3113 pm',sx:280,sy:10.0,sxp:11.6,syp:3.4,lu:3.3,range:'6.5–19 keV',cr:'111',m:2,vert:true,monoTxt:'Si(111), 2 reflections'},
  Cpost:{bl:'24-ID-C',when:'after the upgrade',ring:'APS-U',Ee:6,I:200,emit:'42 pm',sx:14.7,sy:3.2,sxp:2.8,syp:1.3,lu:3.0,range:'6–20 keV',cr:'111',m:2,vert:true,monoTxt:'Si(111) channel cut, 2 reflections'},
  Epre:{bl:'24-ID-E',when:'before the upgrade',ring:'APS',Ee:7,I:100,emit:'3113 pm',sx:280,sy:10.0,sxp:11.6,syp:3.4,lu:3.3,range:'12.662 keV, fixed',cr:'220',m:1,vert:false,monoTxt:'Si(220)'},
  Epost:{bl:'24-ID-E',when:'after the upgrade',ring:'APS-U',Ee:6,I:200,emit:'42 pm',sx:14.7,sy:3.2,sxp:2.8,syp:1.3,lu:2.1,range:'12.662 keV, fixed',cr:'220',m:1,vert:false,monoTxt:'Si(220)'}
};
const ORDER=['Cpre','Cpost','Epre','Epost'], DSP={'111':3.1356,'220':1.9201}, E0=12.662, PSRC=0.98, LID=210;
function derive(p){const g=p.Ee*1000/0.51099895, invg=1e6/g; let n=1,K=0;
  for(const nn of [1,3,5,7]){const q=0.950*nn*p.Ee*p.Ee/(p.lu*E0);if(q>1){const k=Math.sqrt(2*(q-1));if(k>=0.7){n=nn;K=k;break;}}}
  const N=Math.floor(LID/p.lu+1e-9), lam1=p.lu*1e8/(2*g*g), lamp=p.lu*1e4/g, F=1+K*K/2;
  const thc=invg*Math.sqrt(F/(n*N)), d=DSP[p.cr], sinB=12.398/(2*d*E0), thB=Math.asin(sinB), C=Math.abs(Math.cos(2*thB)), Cm=Math.pow(C,p.m);
  const Ih=(1+PSRC)/2, Iv=(1-PSRC)/2, pv=(Ih-Cm*Iv)/(Ih+Cm*Iv), ph=(Cm*Ih-Iv)/(Cm*Ih+Iv);
  return {g,invg,n,K,N,lam1,lamp,F,thc,d,sinB,thB,C,Cm,Pout:p.vert?pv:ph,Palt:p.vert?ph:pv,E1max:0.950*p.Ee*p.Ee/p.lu,B0:K/(0.934*p.lu),
    amp:K*(p.lu/100)/(2*Math.PI*g)*1e6,ang:K*invg,short:p.bl+' '+p.when};}
let PKEY='Cpost', PS=PRESETS[PKEY], CUR=derive(PS);

// ---- ligne claire palette: flat colours, one ink line ----
const INK='#1b1b1b', SKY='#dcecf5', WHITE='#ffffff', RED='#d8412f', BLUE='#2f6db5', YEL='#f6c52e', CAP='#ffe98a',
      GRN='#5aa469', ORG='#ee8a2b', GREY='#b9c2c9', PUR='#8a63c2', LTGRN='#cfe6c9', LTYEL='#ffe9a3', LTRED='#f4c9c2',
      LTBLUE='#c6d9f0', STEEL='#9fb6cc', FLOOR='#efe3c4', LTORG='#ffd98a', MINT='#bfe0c4';
const HAND='"Patrick Hand","Chalkboard SE","Comic Sans MS",cursive';

const figs=[];
function fig(id,aspect,draw,animated=true){
  const cv=$(id), ctx=cv.getContext('2d');
  const f={cv,ctx,draw,animated,visible:true,w:0,h:0,t:0};
  function size(){const dpr=Math.min(window.devicePixelRatio||1,2);const w=cv.clientWidth;if(!w)return;const asp=typeof aspect==='function'?aspect(w):aspect;const h=Math.round(w/asp);
    cv.style.height=h+'px';cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);f.w=w;f.h=h;f.draw(f);}
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(es=>{es.forEach(e=>f.visible=e.isIntersecting)}).observe(cv);
  figs.push(f); return f;
}
const redrawAll=()=>figs.forEach(f=>f.w&&f.draw(f));
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(redrawAll);
let last=performance.now();
function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;
  figs.forEach(f=>{if(f.animated&&f.visible&&playing&&f.w){f.t+=dt;f.draw(f);}});requestAnimationFrame(loop);}
requestAnimationFrame(loop);

// ---- drawing kit ----
function pen(c,w=2,col=INK){c.strokeStyle=col;c.lineWidth=w;c.lineJoin='round';c.lineCap='round';c.setLineDash([]);}
function bg(c,w,h,col=SKY){c.fillStyle=col;c.fillRect(0,0,w,h);}
function rectF(c,x,y,w,h,fill,lw=2){c.fillStyle=fill;c.fillRect(x,y,w,h);pen(c,lw);c.strokeRect(x,y,w,h);}
function disc(c,x,y,r,fill,lw=2){c.beginPath();c.arc(x,y,r,0,7);if(fill){c.fillStyle=fill;c.fill();}pen(c,lw);c.stroke();}
function poly(c,pts,fill,lw=2){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill();}pen(c,lw);c.stroke();}
function line(c,x0,y0,x1,y1,lw=2,col=INK,dash){pen(c,lw,col);if(dash)c.setLineDash(dash);c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();c.setLineDash([]);}
function arrow(c,x0,y0,x1,y1,col=INK,lw=2.2,head=8){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);pen(c,lw,col);c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();if(L<3)return;
  const ux=dx/L,uy=dy/L,h=Math.min(head,L*0.7);c.fillStyle=col;c.beginPath();c.moveTo(x1,y1);c.lineTo(x1-ux*h-uy*h*0.5,y1-uy*h+ux*h*0.5);c.lineTo(x1-ux*h+uy*h*0.5,y1-uy*h-ux*h*0.5);c.closePath();c.fill();c.stroke();}
function fatArrow(c,x0,y0,x1,y1,fill,wd=7){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy);if(L<4)return;const ux=dx/L,uy=dy/L,nx=-uy,ny=ux;const hd=Math.min(wd*2.2,L*0.65),hw=wd*1.35;const bx=x1-ux*hd,by=y1-uy*hd;
  poly(c,[[x0+nx*wd/2,y0+ny*wd/2],[bx+nx*wd/2,by+ny*wd/2],[bx+nx*hw,by+ny*hw],[x1,y1],[bx-nx*hw,by-ny*hw],[bx-nx*wd/2,by-ny*wd/2],[x0-nx*wd/2,y0-ny*wd/2]],fill);}
function txt(c,s,x,y,size=16,align='left',col=INK){c.fillStyle=col;c.font=`${size}px ${HAND}`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
function cap(c,s,x,y,align='left',size=15){s=s.replace(/[a-z]/g,ch=>ch.toUpperCase());c.font=`${size}px ${HAND}`;const tw=c.measureText(s).width,pw=tw+16,ph=size+10;
  const x0=align==='center'?x-pw/2:align==='right'?x-pw:x;rectF(c,x0,y-ph/2,pw,ph,CAP,2);c.fillStyle=INK;c.textAlign='left';c.textBaseline='middle';c.fillText(s,x0+8,y+1);}
function electron(c,x,y,r=8){disc(c,x,y,r,YEL);line(c,x-r*0.45,y,x+r*0.45,y,2);}
function eye(c,x,y,ang){c.save();c.translate(x,y);c.rotate(ang);c.beginPath();c.ellipse(0,0,15,9,0,0,7);c.fillStyle=WHITE;c.fill();pen(c,2);c.stroke();disc(c,-5,0,4.5,INK);c.restore();}
function sampleLoop(c,x,y,s=1){line(c,x,y+7*s,x,y+34*s,3);disc(c,x,y,9*s,WHITE);poly(c,[[x-5*s,y],[x,y-5*s],[x+5*s,y],[x,y+5*s]],GRN,1.6);}
function bind(id,fmt,cb){const el=$(id),o=$(id+'O');const up=()=>{if(o)o.textContent=fmt(+el.value);cb&&cb();};el.addEventListener('input',up);up();return el;}

// ---------- HERO ----------
fig('heroCv',w=>w<560?1.25:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const narrow=w<560; const y0=h*0.5, xL=w*0.03, xR=w*0.97, fy=h*0.84;
  rectF(c,-4,fy,w+8,h,FLOOR);
  const ox=-0.55, oy=0.55, A=Math.min(h*0.2,44);
  const u0=w*0.04,u1=w*0.24, mx=w*0.45, kx=w*0.66, sx=w*0.9;
  // stands
  [[u0+10,u1-10],[mx-18,mx+18],[kx-18,kx+18]].forEach(([a,b])=>{line(c,a,y0+A+26,a,fy,3);line(c,b,y0+A+26,b,fy,3);line(c,a-8,y0+A+26,b+8,y0+A+26,3);});
  // beam
  line(c,u1,y0,xR,y0,3,BLUE);
  // undulator
  const nper=narrow?4:6, pw=(u1-u0)/(nper*2), mh=narrow?12:16;
  for(let i=0;i<nper*2;i++){rectF(c,u0+i*pw,y0-A-mh-2,pw,mh,i%2?BLUE:RED);rectF(c,u0+i*pw,y0+A*0.25+6,pw,mh,i%2?RED:BLUE);}
  pen(c,2);c.beginPath();for(let x=u0-6;x<=u1;x+=2){const s=Math.sin((x-u0)/(2*pw)*Math.PI*2)*0.33;const X=x+s*ox*A,Y=y0+s*oy*A;x===u0-6?c.moveTo(X,Y):c.lineTo(X,Y);}c.stroke();
  const ex=u0+((t*0.16)%1)*(u1-u0), es=Math.sin((ex-u0)/(2*pw)*Math.PI*2)*0.33; electron(c,ex+es*ox*A,y0+es*oy*A,7);
  // E arrows
  const k=2*Math.PI/(narrow?64:84), om=2*Math.PI*0.55;
  for(let x=u1+12;x<xR-10;x+=narrow?11:13){if(Math.abs(x-mx)<30||Math.abs(x-kx)<32||Math.abs(x-sx)<16)continue;
    const a=Math.cos(k*x-om*t); arrow(c,x,y0,x+a*ox*A,y0+a*oy*A,ORG,2.2,6);}
  // mono, mirrors, sample
  rectF(c,mx-24,y0+5,30,10,STEEL);rectF(c,mx-4,y0-15,30,10,STEEL);
  rectF(c,kx-28,y0+5,34,8,GREY);rectF(c,kx+12,y0-18,8,34,GREY);
  sampleLoop(c,sx,y0,narrow?0.9:1.1);line(c,sx,y0+36,sx,fy,3);
  arrow(c,xR-22,y0,xR,y0,BLUE,3,9);
  const cy=narrow?h*0.1:h*0.12, cs=narrow?12:15;
  cap(c,'Undulator',(u0+u1)/2,cy,'center',cs);cap(c,narrow?'Mono':'Si(111) mono',mx,cy,'center',cs);cap(c,narrow?'KB':'KB mirrors',kx,cy,'center',cs);cap(c,'Sample',sx,cy,'center',cs);
  const gx=w*0.3, gy=h*0.93; arrow(c,gx,gy,gx+ox*20,gy+oy*20,ORG,2.2,6);arrow(c,gx,gy,gx-ox*20,gy-oy*20,ORG,2.2,6);
  txt(c,'E: horizontal, across the beam',gx+20,gy,narrow?14:16);
});

// ---------- 1 WAVE ----------
let wAng=0,wPh=0;
const waveFig=fig('waveCv',w=>w<560?1.05:2.4,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const narrow=w<560; const pw=narrow?w:w*0.66; const y0=narrow?h*0.3:h*0.52; const x0=pw*0.1,x1=pw*0.93;
  const A=Math.min(h*(narrow?0.16:0.3),66); const ox=-0.55,oy=0.45;
  const ax=Math.cos(wAng*Math.PI/180),ay=Math.sin(wAng*Math.PI/180),ph=wPh*Math.PI/180;
  const k=2*Math.PI/((x1-x0)/2.2), om=2*Math.PI*0.5;
  const P=(z,ex,ey)=>[z+ex*ox*A,y0+ex*oy*A-ey*A];
  poly(c,[P(x0,-1.15,0),P(x1,-1.15,0),P(x1,1.15,0),P(x0,1.15,0)],LTGRN);
  line(c,x0,y0,x1,y0,2);
  for(let z=x0;z<=x1;z+=narrow?9:11){const p0=k*(z-x0)-om*t;const p=P(z,ax*Math.cos(p0),ay*Math.cos(p0-ph));line(c,z,y0,p[0],p[1],1.6,ORG);}
  pen(c,3,ORG);c.beginPath();for(let z=x0;z<=x1;z+=2){const p0=k*(z-x0)-om*t;const p=P(z,ax*Math.cos(p0),ay*Math.cos(p0-ph));z===x0?c.moveTo(p[0],p[1]):c.lineTo(p[0],p[1]);}c.stroke();
  fatArrow(c,x1+2,y0,x1+34,y0,BLUE,6);
  cap(c,'The wave, in perspective',12,18);txt(c,'travel',x1+18,y0+20,15,'center');
  txt(c,'horizontal plane',P(x0,1.15,0)[0]+10,P(x0,1.15,0)[1]+14,15);
  const cx=narrow?w*0.5:w*0.83, cy=narrow?h*0.76:h*0.55, R=Math.min(narrow?h*0.19:h*0.34,88);
  disc(c,cx,cy,R,WHITE,2.5);line(c,cx-R,cy,cx+R,cy,1.2);line(c,cx,cy-R,cx,cy+R,1.2);
  pen(c,2);c.setLineDash([5,5]);c.beginPath();for(let i=0;i<=120;i++){const p0=i/120*2*Math.PI;const X=cx+ax*Math.cos(p0)*R*0.9,Y=cy-ay*Math.cos(p0-ph)*R*0.9;i?c.lineTo(X,Y):c.moveTo(X,Y);}c.stroke();c.setLineDash([]);
  const p0=-om*t;fatArrow(c,cx,cy,cx+ax*Math.cos(p0)*R*0.9,cy-ay*Math.cos(p0-ph)*R*0.9,ORG,6);disc(c,cx,cy,3,INK);
  cap(c,'Looking down the beam',cx,narrow?cy-R-18:18,'center');
  txt(c,'horizontal',cx+R-4,cy+13,14,'right');txt(c,'vertical',cx+5,cy-R+12,14);
});
const wA=$('wAng'),wP=$('wPh');
function wUpd(){wAng=+wA.value;wPh=+wP.value;$('wAngO').textContent=wAng+'°';$('wPhO').textContent=wPh+'°';
  document.querySelectorAll('[data-w]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.w===wAng+','+wPh)));waveFig.w&&waveFig.draw(waveFig);}
wA.addEventListener('input',wUpd);wP.addEventListener('input',wUpd);
document.querySelectorAll('[data-w]').forEach(b=>b.addEventListener('click',()=>{const [a,p]=b.dataset.w.split(',');wA.value=a;wP.value=p;wUpd();}));
wUpd();

// ---------- 2 DIPOLE ----------
let dPsi=60;
const dipFig=fig('dipCv',w=>w<560?1.0:1.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const cx=w*0.5,cy=h*0.52,R=Math.min(w,h)*0.34, Rmax=Math.min(w,h)*0.62;
  const sp=R*0.42, a0=0.42;
  for(let r0=((t*55)%sp)+R*0.2;r0<Rmax;r0+=sp){pen(c,1.6,'#6f97b8');
    [[a0,Math.PI-a0],[Math.PI+a0,2*Math.PI-a0]].forEach(([s,e])=>{c.beginPath();c.arc(cx,cy,r0,s,e);c.stroke();});}
  c.beginPath();for(let i=0;i<=360;i++){const a=i/360*2*Math.PI;const r=R*Math.sin(a)**2;const X=cx+r*Math.cos(a),Y=cy-r*Math.sin(a);i?c.lineTo(X,Y):c.moveTo(X,Y);}
  c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,2.2);c.stroke();
  line(c,cx-R*1.3,cy,cx+R*1.3,cy,1.6,INK,[6,5]);txt(c,'oscillation axis',cx+R*1.3,cy+15,15,'right');
  const osc=Math.sin(t*2*Math.PI*0.7), xo=osc*R*0.12, acc=-osc;
  if(Math.abs(acc)>0.08)arrow(c,cx+xo,cy-17,cx+xo+acc*R*0.26,cy-17,PUR,2.6,8);
  txt(c,'a',cx+xo+acc*R*0.26+(acc>0?9:-9),cy-18,17,'center',PUR);
  electron(c,cx+xo,cy,8);
  const ps=dPsi*Math.PI/180, ob=[cx+R*1.16*Math.cos(ps),cy-R*1.16*Math.sin(ps)];
  line(c,cx,cy,ob[0],ob[1],1.6,INK,[2,5]);
  const n=[Math.cos(ps),-Math.sin(ps)], dot=acc*n[0], ap=[acc-dot*n[0],-dot*n[1]], Ln=R*0.42;
  fatArrow(c,ob[0],ob[1],ob[0]-ap[0]*Ln,ob[1]-ap[1]*Ln,ORG,6);
  eye(c,ob[0],ob[1],-ps);
  pen(c,1.6);c.beginPath();c.arc(cx,cy,R*0.3,-ps,0);c.stroke();
  txt(c,'ψ',cx+R*0.38*Math.cos(ps/2),cy-R*0.38*Math.sin(ps/2),18,'center');
  cap(c,'Radiation from a wiggling charge',12,18);
  txt(c,'no radiation along the axis',cx-R*1.3,cy-14,15,'left');
});
bind('dPsi',v=>v+'°',()=>{dPsi=+$('dPsi').value;const s=Math.sin(dPsi*Math.PI/180);$('dAmp').textContent=s.toFixed(2);$('dInt').textContent=(s*s).toFixed(2);dipFig.w&&dipFig.draw(dipFig);});

// ---------- 3 UNDULATOR ----------
let uK=1,uL=3.3; let GAMMA=6000/0.51099895;
const undFig=fig('undCv',w=>w<560?0.9:1.85,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const x0=w*0.05,x1=w*0.95; const per=(w*0.9)/(4*3.3/uL); const nHalf=Math.ceil((x1-x0)/(per/2));
  const k=2*Math.PI/per; const zE=x0+((t*0.12*(x1-x0))%(x1-x0));
  const sy=h*0.3, gap=h*0.1, mh=h*0.075;
  for(let i=0;i<nHalf;i++){const xa=x0+i*per/2;if(xa>=x1)break;const xb=Math.min(xa+per/2,x1);const topN=i%2===0;
    rectF(c,xa,sy-gap-mh,xb-xa,mh,topN?RED:BLUE);rectF(c,xa,sy+gap,xb-xa,mh,topN?BLUE:RED);
    if(xb-xa>18){txt(c,topN?'N':'S',(xa+xb)/2,sy-gap-mh/2+1,16,'center',WHITE);txt(c,topN?'S':'N',(xa+xb)/2,sy+gap+mh/2+1,16,'center',WHITE);}}
  for(let x=x0+per/4;x<x1;x+=per/2){const s=Math.cos(k*(x-x0-per/4));arrow(c,x,sy+(s>0?gap*0.78:-gap*0.78),x,sy-(s>0?gap*0.78:-gap*0.78),PUR,1.8,6);}
  line(c,x0,sy,x1,sy,2.2);
  const By=Math.cos(k*(zE-x0-per/4));
  fatArrow(c,zE+14,sy,zE+14,sy-By*gap*0.8,PUR,5);electron(c,zE,sy,8);
  cap(c,'Side view',12,18);
  const ty=h*0.75, amp=Math.min(h*0.12,28)*uK/1.5, bh=h*0.17;
  for(let i=0;i<nHalf;i++){const xa=x0+i*per/2;if(xa>=x1)break;const xb=Math.min(xa+per/2,x1);rectF(c,xa,ty-bh,xb-xa,2*bh,i%2===0?LTRED:LTBLUE,1.6);}
  pen(c,2.6);c.beginPath();for(let x=x0;x<=x1;x+=2){const X=-amp*Math.sin(k*(x-x0-per/4));x===x0?c.moveTo(x,ty+X):c.lineTo(x,ty+X);}c.stroke();
  const xe=-amp*Math.sin(k*(zE-x0-per/4)), F=-xe/amp;
  fatArrow(c,zE,ty+xe,zE,ty+xe+F*bh*0.8,ORG,6);
  arrow(c,zE,ty+xe,zE+30,ty+xe,INK,2,7);txt(c,'v',zE+38,ty+xe,16,'left');
  electron(c,zE,ty+xe,8);
  cap(c,'Top view',12,h*0.52);txt(c,'horizontal ↕',x1,h*0.52,15,'right');
});
function uUpd(){uK=+$('uK').value;uL=+$('uL').value;$('uKO').textContent=uK.toFixed(2);$('uLO').textContent=uL.toFixed(1)+' cm';
  $('uB').textContent=(uK/(0.934*uL)).toFixed(2)+' T';
  $('uAmp').textContent=(uK*(uL/100)/(2*Math.PI*GAMMA)*1e6).toFixed(2)+' µm';
  $('uAng').textContent=(uK/GAMMA*1e6).toFixed(0)+' µrad';undFig.w&&undFig.draw(undFig);}
$('uK').addEventListener('input',uUpd);$('uL').addEventListener('input',uUpd);uUpd();

// ---------- 4a SLIPPAGE ----------
let sBeta=0.8;
const slipFig=fig('slipCv',w=>w<560?1.25:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const x0=w*0.04,x1=w*0.96,Ltr=x1-x0, NP=4, lu=Ltr/(NP+1.2), y0=h*0.56, mh=Math.max(12,h*0.08), gap=h*0.2;
  const cs=Ltr/4.2, ve=sBeta*cs, tc=(NP*lu)/ve+1.4, tt=t%tc;
  for(let i=0;i<NP*2;i++){const xa=x0+i*lu/2;rectF(c,xa,y0-gap-mh,lu/2,mh,i%2?BLUE:RED);rectF(c,xa,y0+gap,lu/2,mh,i%2?RED:BLUE);}
  line(c,x0,y0,x1,y0,1.6,INK,[6,5]);
  const ze=Math.min(tt*ve,NP*lu), lam=lu*(1/sBeta-1);
  // crests: j emitted at tj=j*lu/ve at zj=j*lu
  const crests=[];for(let j=0;j<=NP;j++){const tj=j*lu/ve;if(tt>=tj)crests.push(j*lu+cs*(tt-tj));}
  if(crests.length){const zf=crests[0], zb=crests[crests.length-1];
    c.save();c.beginPath();c.rect(x0,0,Ltr,h);c.clip();
    pen(c,3,ORG);c.beginPath();const A=gap*0.55;
    for(let z=zb;z<=zf;z+=1){const y=y0-A*Math.cos(2*Math.PI*(z-zf)/lam);z===zb?c.moveTo(x0+z,y):c.lineTo(x0+z,y);}c.stroke();
    crests.forEach(z=>{line(c,x0+z,y0-A,x0+z,y0+A,1.6,ORG,[3,4]);disc(c,x0+z,y0-A,4,ORG,1.6);});
    if(crests.length>=2){const a=x0+crests[1],b=x0+crests[0],yy=y0+A+16;if(b<x1-4){line(c,a,yy,b,yy,2);line(c,a,yy-5,a,yy+5,2);line(c,b,yy-5,b,yy+5,2);txt(c,'λ',(a+b)/2,yy+14,18,'center');}}
    c.restore();}
  electron(c,x0+ze,y0,8);
  const by=y0-gap-mh-12;line(c,x0,by,x0+lu,by,2);line(c,x0,by-5,x0,by+5,2);line(c,x0+lu,by-5,x0+lu,by+5,2);txt(c,'λu, one magnet period',x0+lu+10,by,16);
  cap(c,'The electron races its own light',12,h-20);
  txt(c,'electron: speed βc',x1,h-34,15,'right');txt(c,'light: speed c',x1,h-16,15,'right',ORG);
});
function slUpd(){sBeta=+$('sB').value;$('sBO').textContent=sBeta.toFixed(2);const g=1/Math.sqrt(1-sBeta*sBeta);
  $('sEx').textContent=(1/sBeta-1).toFixed(3);$('sAp').textContent=(1/(2*g*g)).toFixed(3)+'  (γ = '+g.toFixed(2)+')';slipFig.w&&slipFig.draw(slipFig);}
$('sB').addEventListener('input',slUpd);slUpd();

// ---------- 4b HEADLIGHT ----------
let rg=1;
const relFig=fig('relCv',w=>w<560?0.85:2.2,f=>{const {ctx:c,w,h}=f;bg(c,w,h);
  const narrow=w<560; const g=rg, b=Math.sqrt(Math.max(0,1-1/(g*g)));
  const pat=(th,phi)=>{const cs=Math.cos(th),s=Math.sin(th),d=1-b*cs;return (d*d-(1-b*b)*s*s*Math.cos(phi)**2)/Math.pow(d,5);};
  const cx=narrow?w*0.42:w*0.24, cy=narrow?h*0.3:h*0.55, R=narrow?Math.min(w*0.36,h*0.2):Math.min(w*0.19,h*0.38);
  const N=3000; let mm=0; const v0=[],v1=[];
  for(let i=0;i<=N;i++){const th=-Math.PI+i/N*2*Math.PI;const a=pat(th,0),d=pat(th,Math.PI/2);v0.push(a);v1.push(d);mm=Math.max(mm,a,d);}
  disc(c,cx,cy,R,WHITE,2);
  [[v1,MINT],[v0,LTORG]].forEach(([v,col])=>{c.beginPath();for(let i=0;i<=N;i++){const th=-Math.PI+i/N*2*Math.PI;const r=R*v[i]/mm;const X=cx+r*Math.cos(th),Y=cy-r*Math.sin(th);i?c.lineTo(X,Y):c.moveTo(X,Y);}
    c.closePath();c.fillStyle=col;c.fill();pen(c,2);c.stroke();});
  arrow(c,cx-R*1.2,cy,cx+R*1.42,cy,INK,2,8);txt(c,'electron travel →',cx-R*1.2,cy+16,15,'left');
  if(g>1.3){const a=Math.atan(1/(g*b));[1,-1].forEach(s=>line(c,cx,cy,cx+R*1.15*Math.cos(a),cy-s*R*1.15*Math.sin(a),1.6,INK,[4,5]));txt(c,'1/γ',cx+R*1.17*Math.cos(a)+4,cy-R*1.17*Math.sin(a)-8,16);}
  electron(c,cx,cy,6);
  cap(c,'Radiation pattern',12,18);
  const px0=narrow?w*0.1:w*0.56, px1=narrow?w*0.94:w*0.96, py0=narrow?h*0.62:h*0.2, py1=narrow?h*0.9:h*0.82;
  rectF(c,px0,py0,px1-px0,py1-py0,WHITE,2.5);
  const U=3, X=u=>px0+(u+U)/(2*U)*(px1-px0);
  for(let u=-3;u<=3;u++){if(Math.abs(u)<3)line(c,X(u),py0,X(u),py1,1,GREY);txt(c,String(u),X(u),py1+13,14,'center');}
  txt(c,'angle × γ',(px0+px1)/2,py1+30,15,'center');
  cap(c,'Same pattern, angle in units of 1/γ',narrow?12:px0,narrow?py0-18:18);
  const gg=Math.max(g,1.0001), vals=[[],[]];let mx=0;
  for(let i=0;i<=600;i++){const u=-U+i/600*2*U,th=u/gg;const a=pat(th,0),d=pat(th,Math.PI/2);vals[0].push(a);vals[1].push(d);mx=Math.max(mx,a,d);}
  c.save();c.beginPath();c.rect(px0,py0,px1-px0,py1-py0);c.clip();
  [[1,GRN],[0,ORG]].forEach(([j,col])=>{pen(c,3,col);c.beginPath();for(let i=0;i<=600;i++){const u=-U+i/600*2*U;const Y=py1-(py1-py0)*0.9*vals[j][i]/mx;i?c.lineTo(X(u),Y):c.moveTo(X(u),Y);}c.stroke();});
  c.restore();pen(c,2.5);c.strokeRect(px0,py0,px1-px0,py1-py0);
},false);
function rUpd(){const s=+$('rG').value; rg=Math.pow(30,s); $('rGO').textContent=rg<10?rg.toFixed(2):rg.toFixed(1);
  const b=Math.sqrt(Math.max(0,1-1/(rg*rg))); $('rB').textContent=b.toFixed(b>0.999?6:4);
  $('rC').textContent=rg<1.01?'no cone yet':(180/Math.PI/rg).toFixed(1)+'°';relFig.w&&relFig.draw(relFig);}
$('rG').addEventListener('input',rUpd);
$('rAPS').addEventListener('click',()=>{$('rG').value=(Math.log(20)/Math.log(30)).toFixed(3);rUpd();});
$('rOne').addEventListener('click',()=>{$('rG').value=0;rUpd();});rUpd();

function cUpd(){const E=+$('cE').value, Lu=+$('cL').value, K=+$('cK').value, n=+$('cN').value; $('cKO').textContent=K.toFixed(2);
  if(!(E>0&&Lu>0)){$('cOut').textContent='–';$('cLam').textContent='–';$('cSe').textContent='–';return;}
  const En=0.950*n*E*E/(Lu*(1+K*K/2)); $('cOut').textContent=En.toFixed(2)+' keV'; $('cLam').textContent=(12.398/En).toFixed(3)+' Å';
  const q=0.950*n*E*E/(Lu*12.66); $('cSe').textContent=q>1?Math.sqrt(2*(q-1)).toFixed(2)+' on harmonic '+n:'out of reach on harmonic '+n;}
['cE','cL','cK','cN'].forEach(id=>$(id).addEventListener('input',cUpd));cUpd();

// ---------- 5 PURITY ----------
let pA=0.5, pMode='I', pZoomed=false;
function field(u,v){const r2=u*u+v*v, d=1+r2;return [(1-u*u+v*v)/d,-2*u*v/d,1/(d*d*d)];}
const TEALS=['#ffffff','#d9eee8','#a9d8cd','#74c0b1','#43a392'], REDS=['#ffffff','#fadbd6','#f2aea5','#e87f72','#d8412f'];
const purFig=fig('purCv',w=>w<560?0.82:1.6,f=>{const {ctx:c,w,h}=f;bg(c,w,h);
  const narrow=w<560; const S=narrow?Math.min(w*0.9,h*0.8):Math.min(w*0.56,h*0.86), X0=narrow?(w-S)/2:w*0.05, Y0=narrow?h*0.14:(h-S)/2+8, U=pZoomed?0.25:2;
  const N=240, cell=S/N; let maxI=0,maxX=0; const grid=[];
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const u=-U+(i+0.5)/N*2*U, v=U-(j+0.5)/N*2*U;const [Ex,Ey,wg]=field(u,v);const I=(Ex*Ex+Ey*Ey)*wg,Xp=Ey*Ey*wg;grid.push([I,Xp]);maxI=Math.max(maxI,I);maxX=Math.max(maxX,Xp);}
  const pal=pMode==='I'?TEALS:REDS;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const g=grid[j*N+i];const val=pMode==='I'?g[0]/maxI:g[1]/maxX;const b=val>0.6?4:val>0.3?3:val>0.12?2:val>0.03?1:0;
    c.fillStyle=pal[b];c.fillRect(X0+i*cell-0.3,Y0+j*cell-0.3,cell+0.6,cell+0.6);}
  c.save();c.beginPath();c.rect(X0,Y0,S,S);c.clip();
  pen(c,1.6);c.setLineDash([5,5]);c.beginPath();c.arc(X0+S/2,Y0+S/2,S/2/U,0,7);c.stroke();c.setLineDash([]);
  const M=15;for(let j=0;j<M;j++)for(let i=0;i<M;i++){const u=-U+(i+0.5)/M*2*U, v=U-(j+0.5)/M*2*U;const [Ex,Ey]=field(u,v);if(Math.hypot(Ex,Ey)<1e-3)continue;
    const ang=Math.atan2(Ey,Ex), tilt=Math.abs(Math.sin(ang)), px=X0+(i+0.5)/M*S, py=Y0+(j+0.5)/M*S, l=S/M*0.36;
    line(c,px-l*Math.cos(ang),py+l*Math.sin(ang),px+l*Math.cos(ang),py-l*Math.sin(ang),2.2,tilt>0.12?RED:INK);}
  const a=pA/U*S/2;pen(c,3.5,BLUE);c.strokeRect(X0+S/2-a,Y0+S/2-a,2*a,2*a);
  const sc=S/2/U/CUR.invg, erx=Math.max(1.5,PS.sxp*sc), ery=Math.max(1.5,PS.syp*sc);
  pen(c,2.5,PUR);c.beginPath();c.arc(X0+S/2,Y0+S/2,CUR.thc*sc,0,7);c.stroke();
  c.beginPath();c.ellipse(X0+S/2,Y0+S/2,erx,ery,0,0,7);c.fillStyle=ORG;c.fill();pen(c,1.4);c.stroke();
  c.restore();
  pen(c,3);c.strokeRect(X0,Y0,S,S);
  txt(c,'frame: ±'+U+'/γ = ±'+(U*CUR.invg).toFixed(0)+' µrad',X0+S,Y0+S+14,14,'right');
  txt(c,'horizontal angle × γ',X0,Y0+S+14,15,'left');
  cap(c,'The beam, looking upstream',12,18);
  if(!narrow){const lx=X0+S+28, ly=Y0+30;
    line(c,lx,ly,lx+26,ly,2.2);txt(c,'E is horizontal here',lx+36,ly,16);
    line(c,lx+2,ly+32,lx+24,ly+20,2.2,RED);txt(c,'E is tilted more than 7°',lx+36,ly+26,16);
    pen(c,3.5,BLUE);c.strokeRect(lx+3,ly+44,20,16);txt(c,'accepted aperture',lx+36,ly+52,16);
    line(c,lx,ly+78,lx+26,ly+78,1.6,INK,[5,5]);txt(c,'the 1/γ ring',lx+36,ly+78,16);
    c.beginPath();c.ellipse(lx+13,ly+104,11,5,0,0,7);c.fillStyle=ORG;c.fill();pen(c,1.4);c.stroke();txt(c,'electron-beam spread, 1σ',lx+36,ly+104,16);
    pen(c,2.5,PUR);c.beginPath();c.arc(lx+13,ly+130,8,0,7);c.stroke();txt(c,'single-electron central cone',lx+36,ly+130,16);
    pal.forEach((col,i)=>rectF(c,lx+i*22,ly+152,22,16,col,1.6));
    txt(c,pMode==='I'?'weak → strong: total intensity':'weak → strong: vertical part',lx,ly+182,16);}
},false);
function pUpd(){pA=+$('pA').value;$('pAO').textContent=pA.toFixed(2);
  let Ix=0,Iy=0;const N=160;for(let j=0;j<N;j++)for(let i=0;i<N;i++){const u=-pA+(i+0.5)/N*2*pA, v=-pA+(j+0.5)/N*2*pA;const [Ex,Ey,wg]=field(u,v);Ix+=Ex*Ex*wg;Iy+=Ey*Ey*wg;}
  const P=(Ix-Iy)/(Ix+Iy); $('pP').textContent=(P*100).toFixed(P>0.9999?3:2)+' %'; $('pX').textContent=(Iy/(Ix+Iy)*100).toFixed(3)+' %';
  $('pAng').textContent='±'+(pA/GAMMA*1e6).toFixed(0)+' µrad';purFig.w&&purFig.draw(purFig);}
$('pA').addEventListener('input',pUpd);
function pSet(m){pMode=m;$('pShowI').setAttribute('aria-pressed',String(m==='I'));$('pShowX').setAttribute('aria-pressed',String(m==='X'));purFig.w&&purFig.draw(purFig);}
$('pZoom').addEventListener('click',()=>{pZoomed=!pZoomed;$('pZoom').setAttribute('aria-pressed',String(pZoomed));purFig.w&&purFig.draw(purFig);});
$('pShowI').addEventListener('click',()=>pSet('I'));$('pShowX').addEventListener('click',()=>pSet('X'));
pUpd();

// ---------- 6 MONO ----------
let mE=12.662,mPin=0.98,mVert=true,mCr='111',mB=2;
const monoFig=fig('monoCv',w=>w<560?1.1:2.1,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const narrow=w<560, d=DSP[mCr], thOf=E=>Math.asin(Math.min(1,12.398/(2*d*E)));
  const th=thOf(mE), Cf=Math.abs(Math.cos(2*th)), t2=2*th;
  const g=w*0.05, tb=g*0.55, O=[w*0.3,h*0.76], xA=w*0.03, xB=w*0.97, fs=narrow?13:15;
  const sv=[Math.cos(th),-Math.sin(th)], nv=[-Math.sin(th),-Math.cos(th)];
  const P=(u,v)=>[O[0]+u*sv[0]+v*nv[0],O[1]+u*sv[1]+v*nv[1]];
  const nm='Si('+mCr+')'; let pts;
  if(mB===2){
    const uLo=g/Math.tan(thOf(6)), uHi=g/Math.tan(thOf(20)), u2a=uLo-0.7*g, u2b=uHi+0.7*g, uw=g/Math.tan(th), pad=0.28*g;
    const plate=[P(-2.4*g,-tb-pad),P(u2b,-tb-pad),P(u2b,g+tb+pad),P(-2.4*g,g+tb+pad)];
    poly(c,plate,'#d6e0ea');
    poly(c,[P(-2.4*g,0),P(1.2*g,0),P(1.2*g,-tb),P(-2.4*g,-tb)],STEEL);
    poly(c,[P(u2a,g),P(u2b,g),P(u2b,g+tb),P(u2a,g+tb)],STEEL);
    [[uLo,'6 keV'],[uHi,'20 keV']].forEach(([u,lab])=>{const a=P(u,g),b=P(u,g+tb),q=P(u,g+tb+pad+0.5*g);line(c,a[0],a[1],b[0],b[1],1.8,INK,[3,3]);txt(c,lab,q[0],q[1],fs-1,'center');});
    const hit=P(uw,g), px=Math.max(...plate.map(p=>p[0]))+10;
    pts=[[xA,O[1]],O,hit,[xB,hit[1]]];
    if(px<xB-40){line(c,px,O[1],xB,O[1],1.6,INK,[5,5]);const bx=xB-14;line(c,bx,O[1],bx,hit[1],2);line(c,bx-5,O[1],bx+5,O[1],2);line(c,bx-5,hit[1],bx+5,hit[1],2);txt(c,'height step',xB,O[1]+14,fs-1,'right');}
    txt(c,nm+' channel cut: one crystal, two faces locked together',w/2,h-16,fs,'center');
  }else{
    poly(c,[P(-2.4*g,0),P(2.4*g,0),P(2.4*g,-tb),P(-2.4*g,-tb)],STEEL);
    const L=Math.min((O[1]-h*0.2)/Math.sin(t2),(xB-O[0])/Math.cos(t2));pts=[[xA,O[1]],O,[O[0]+L*Math.cos(t2),O[1]-L*Math.sin(t2)]];
    txt(c,nm+', single crystal',w/2,h-16,fs,'center');
  }
  // beam path
  pen(c,2,BLUE);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  const pe=pts[pts.length-1], pp=pts[pts.length-2], eL=Math.hypot(pe[0]-pp[0],pe[1]-pp[1]), eux=(pe[0]-pp[0])/eL, euy=(pe[1]-pp[1])/eL;
  arrow(c,pe[0]-eux*18,pe[1]-euy*18,pe[0],pe[1],BLUE,2.4,9);
  // wave packets, one per photon, travelling along the path
  const segs=[];let tot=0;for(let i=0;i<pts.length-1;i++){const L=Math.hypot(pts[i+1][0]-pts[i][0],pts[i+1][1]-pts[i][1]);segs.push({p:pts[i],ux:(pts[i+1][0]-pts[i][0])/L,uy:(pts[i+1][1]-pts[i][1])/L,L,s0:tot,i});tot+=L;}
  const A=Math.min(g*0.5,24), lamw=narrow?11:15, sig=narrow?14:20, spacing=narrow?96:140, off=(t*80)%spacing;
  const wave=[];let k=0;
  for(let s=0;s<=tot-10;s+=1.2){while(k<segs.length-1&&s>segs[k].s0+segs[k].L)k++;const sg=segs[k], ds=s-sg.s0, x=sg.p[0]+sg.ux*ds, y=sg.p[1]+sg.uy*ds;
    const r=((s-off)%spacing+spacing)%spacing-spacing/2;
    const a=A*Math.exp(-(r*r)/(2*sig*sig))*Math.cos(2*Math.PI*r/lamw)*(mVert?1:Math.pow(Cf,sg.i));
    wave.push([x,y,x+(mVert?0.45:-sg.uy)*a,y+(mVert?0.78:sg.ux)*a,a]);}
  pen(c,1,ORG);c.beginPath();wave.forEach((q,i)=>{if(i%2===0&&Math.abs(q[4])>1.5){c.moveTo(q[0],q[1]);c.lineTo(q[2],q[3]);}});c.stroke();
  pen(c,2.4,ORG);c.beginPath();wave.forEach((q,i)=>i?c.lineTo(q[2],q[3]):c.moveTo(q[2],q[3]));c.stroke();
  if(mB===2){const hit=pts[2];disc(c,hit[0],hit[1],5,ORG,2);}
  disc(c,O[0],O[1],6,WHITE,2);line(c,O[0]-3,O[1],O[0]+3,O[1],1.6);line(c,O[0],O[1]-3,O[0],O[1]+3,1.6);
  txt(c,'The crystal turns the beam through 2θB = '+(t2*180/Math.PI).toFixed(1)+'°',12,narrow?46:48,fs,'left');
  cap(c,mVert?'Side view: horizontal E points out of the page (σ)':'Top view: horizontal E lies in the page (π)',12,18,'left',narrow?12:15);
  txt(c,'from undulator',xA,O[1]+A+12,fs,'left');
  if(mB===2)txt(c,'to sample',xB-(narrow?22:0),narrow?pe[1]+A+12:pe[1]-A-12,fs,'right');else txt(c,'to sample',pe[0]-16,pe[1]-A-6,fs,'right');
});
function mUpd(){mE=+$('mE').value;mPin=+$('mP').value;mCr=$('mCr').value;mB=+$('mB').value;$('mEO').textContent=mE.toFixed(3)+' keV';$('mPO').textContent=mPin.toFixed(3);
  const th=Math.asin(Math.min(1,12.398/(2*DSP[mCr]*mE))), Cf=Math.abs(Math.cos(2*th)), Cm=Math.pow(Cf,mB), Ih=(1+mPin)/2, Iv=(1-mPin)/2;
  const Pout=mVert?(Ih-Cm*Iv)/(Ih+Cm*Iv):(Cm*Ih-Iv)/(Cm*Ih+Iv);
  $('mTh').textContent=(th*180/Math.PI).toFixed(2)+'°';$('mC').textContent=mB===2?'C = '+Cf.toFixed(3)+',  C² = '+Cm.toFixed(3):'C = '+Cf.toFixed(3)+' (one bounce)';
  $('mOut').textContent=Pout.toFixed(4)+(Pout>mPin+1e-6?'  (up)':Pout<mPin-1e-6?'  (down)':'');
  $('mWalk').textContent=mB===2?(1/Math.tan(th)).toFixed(2)+' × gap':'no second face';$('mOff').textContent=mB===2?(2*Math.cos(th)).toFixed(3)+' × gap':'beam leaves at 2θB';monoFig.w&&monoFig.draw(monoFig);}
['mE','mP','mCr','mB'].forEach(id=>$(id).addEventListener('input',mUpd));
function mSet(v){mVert=v;$('mV').setAttribute('aria-pressed',String(v));$('mH').setAttribute('aria-pressed',String(!v));mUpd();}
$('mV').addEventListener('click',()=>mSet(true));$('mH').addEventListener('click',()=>mSet(false));
mUpd();

// ---------- 7 SAMPLE ----------
let sAz=90,sEl=0,sP=0.98,sCone=9;
function scatterAt(az,el,P,cone){
  const b=az*Math.PI/180,e=el*Math.PI/180;const a=[Math.cos(e)*Math.sin(b),Math.sin(e),Math.cos(e)*Math.cos(b)];
  const u=[Math.cos(b),0,-Math.sin(b)], v=[a[1]*u[2]-a[2]*u[1],a[2]*u[0]-a[0]*u[2],a[0]*u[1]-a[1]*u[0]];
  const al=cone*Math.PI/180;let s=0,n=0;const R=8,T=24;
  for(let i=0;i<=R;i++){const r=al*i/R, m=i===0?1:T;for(let j=0;j<m;j++){const ph=j/m*2*Math.PI, du=r*Math.cos(ph), dv=r*Math.sin(ph);
    let d=[a[0]+du*u[0]+dv*v[0],a[1]+du*u[1]+dv*v[1],a[2]+du*u[2]+dv*v[2]];const L=Math.hypot(d[0],d[1],d[2]);d=d.map(x=>x/L);
    const val=P*(1-d[0]*d[0])+(1-P)*(1+d[2]*d[2])/2, ww=(i===0?0.25:i)/m;s+=val*ww;n+=ww;}}
  return s/n;}
const smpFig=fig('smpCv',w=>w<560?0.92:2.0,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const narrow=w<560; const cx=narrow?w*0.47:w*0.4, cy=narrow?h*0.56:h*0.6, R=narrow?Math.min(w*0.24,h*0.3):Math.min(w*0.19,h*0.27), e=sEl*Math.PI/180;
  c.beginPath();for(let i=0;i<=360;i++){const b=i/360*2*Math.PI, nx=Math.cos(e)*Math.sin(b), nz=Math.cos(e)*Math.cos(b);
    const r=R*(sP*(1-nx*nx)+(1-sP)*(1+nz*nz)/2), X=cx+r*Math.cos(b), Y=cy-r*Math.sin(b); i?c.lineTo(X,Y):c.moveTo(X,Y);}
  c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,2.2);c.stroke();
  // beam, ending on the diffraction (area) detector downstream
  const px=cx+R*1.66, phh=R*0.62, bx0=Math.max(6,cx-R*2.1), ex=Math.max(22,cx-R*(narrow?1.7:1.95));
  line(c,bx0,cy,px-6,cy,3,BLUE);arrow(c,px-30,cy,px-7,cy,BLUE,3,9);
  rectF(c,px-6,cy-phh,12,2*phh,'#6b7f93');
  txt(c,'diffraction detector',narrow?w-8:px,cy+phh+15,15,narrow?'right':'center');txt(c,'(area detector, downstream)',narrow?w-8:px,cy+phh+32,13,narrow?'right':'center');
  txt(c,'X-ray beam',px-12,cy+16,15,'right');
  const ph=Math.cos(t*4);
  arrow(c,ex,cy,ex,cy-ph*R*0.34,ORG,2.6,7);
  txt(c,'E',ex-12,cy+R*0.3,18,'center',ORG);
  // fluorescence detector
  const b=sAz*Math.PI/180, rr=R*1.26*Math.cos(e)+R*0.08, dx=cx+rr*Math.cos(b), dy=cy-rr*Math.sin(b);
  line(c,cx,cy,dx,dy,1.6,INK,[3,5]);
  c.save();c.translate(dx,dy);c.rotate(-b+Math.PI/2);poly(c,[[-5,10],[5,10],[10,-4],[-10,-4]],GREY);rectF(c,-13,-24,26,20,ORG);c.restore();
  const lab='fluorescence detector (SDD)';c.font=`15px ${HAND}`;const tw=c.measureText(lab).width;
  txt(c,lab,Math.max(tw/2+8,Math.min(dx,px-tw/2-14)),dy-38,15,'center');
  // sample
  line(c,cx,cy+9,cx,cy+R*1.08,1.6);disc(c,cx,cy+R*1.08,2.5,INK);
  cap(c,'Sample: crystal in its loop',cx,cy+R*1.08+16,'center',narrow?13:14);
  disc(c,cx,cy,9,WHITE,2.5);poly(c,[[cx-5,cy],[cx,cy-5],[cx+5,cy],[cx,cy+5]],GRN,1.6);
  cap(c,'Top view, looking down on the sample',12,18,'left',narrow?13:15);
  if(!narrow){const gr=Math.min(h*0.46,w*0.17), gx=w*0.96-gr, gy=h*0.86;
    c.beginPath();c.moveTo(gx,gy);c.arc(gx,gy,gr,-Math.PI/2,0);c.closePath();c.fillStyle=WHITE;c.fill();pen(c,2.2);c.stroke();
    fatArrow(c,gx,gy,gx+gr*0.94*Math.cos(e),gy-gr*0.94*Math.sin(e),ORG,6);disc(c,gx,gy,4,INK);
    cap(c,'Side view: SDD elevation '+sEl+'°',w-12,18,'right');txt(c,'horizontal',gx+gr,gy+14,15,'right');txt(c,'up',gx-8,gy-gr+8,15,'right');}
});
function sUpd(){sAz=+$('sAz').value;sEl=+$('sEl').value;sP=+$('sP').value;sCone=+$('sCone').value;
  $('sAzO').textContent=sAz+'°';$('sElO').textContent=sEl+'°';$('sPO').textContent=sP.toFixed(3);$('sConeO').textContent=sCone+'°';
  const r=scatterAt(sAz,sEl,sP,sCone)/scatterAt(90,0,sP,sCone);$('sRel').textContent=r.toFixed(r<10?2:1)+'×';smpFig.w&&smpFig.draw(smpFig);}
['sAz','sEl','sP','sCone'].forEach(id=>$(id).addEventListener('input',sUpd));sUpd();

function qUpd(){const H=+$('qH').value,V=+$('qV').value;$('qP').textContent=(V+H>0)?((V-H)/(V+H)).toFixed(4):'–';}
['qH','qV'].forEach(id=>$(id).addEventListener('input',qUpd));qUpd();

// ---------- apply beamline settings everywhere ----------
const cm=x=>Math.round(x).toLocaleString('en-US');
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const sci=x=>{const e=Math.floor(Math.log10(x));return (x/Math.pow(10,e)).toFixed(1)+'×10'+String(e).split('').map(ch=>SUP[ch]).join('');};
function fillText(){const p=PS,d=CUR,s=d.short, crn='Si('+p.cr+')', defl=p.vert?'vertical':'horizontal', bn=p.m===2?'2 reflections':'1 reflection';
  const K=d.K.toFixed(2), lu=p.lu.toFixed(1), g=cm(d.g), ig=d.invg.toFixed(0), t2=(2*d.thB*180/Math.PI).toFixed(1), nN=d.n*d.N;
  const Sx=Math.hypot(d.thc,p.sxp), Sy=Math.hypot(d.thc,p.syp);
  const T={
    useHero:`${s}: ${p.Ee} GeV ring, ${lu} cm undulator, ${crn} mono, 12.662 keV. Change this with the Settings menu at the top.`,
    useUnd:`Set for ${s}: λu = ${lu} cm, K = ${K} (harmonic ${d.n} at 12.662 keV), γ = ${g}.`,
    gammaDD:`The Lorentz factor, ${g} at ${p.Ee} GeV.`,
    num33:`For ${s}: K = ${K} and λu = ${lu} cm give a largest angle K/γ = ${d.ang.toFixed(0)} µrad and an amplitude of ${d.amp.toFixed(2)} µm.`,
    num34:`K = ${K} with λu = ${lu} cm needs B₀ = ${K} / (0.934 × ${lu}) = ${d.B0.toFixed(2)} T.`,
    num41:`For ${s} the ring energy is ${p.Ee} GeV, so γ = ${p.Ee*1000} / 0.511 = ${g}. Then 1 − β = 1/2γ² = ${sci(1/(2*d.g*d.g))}. Over one ${lu} cm period, light gains just ${d.lam1.toFixed(2)} Å on the electron.`,
    slipK:`This ring: 1 − β = ${sci(1/(2*d.g*d.g))}`, slipV:`${lu} cm → ${d.lam1.toFixed(2)} Å`,
    num42:`${lu} cm / (2 × ${g}²) = ${d.lam1.toFixed(2)} Å, or ${(12.398/d.lam1).toFixed(1)} keV. This is the K = 0 limit. Equation 4.4 adds the corrections.`,
    num43:`${lu} cm / ${g} = ${d.lamp.toFixed(2)} µm in the electron's frame, then ${d.lamp.toFixed(2)} µm / ${cm(2*d.g)} = ${d.lam1.toFixed(2)} Å in the lab.`,
    useCalc:`Set for ${s}: ${p.Ee} GeV, λu = ${lu} cm, harmonic ${d.n}, K = ${K}. Change any value to explore.`,
    num45:`For ${s}: harmonic ${d.n} with K = ${K} gives 0.950 × ${d.n} × ${p.Ee*p.Ee} / (${lu} × ${d.F.toFixed(2)}) = 12.66 keV. With K = 0 the fundamental would sit at ${d.E1max.toFixed(1)} keV.`,
    relK:`This ring, γ = ${g}`, relV:`1/γ = ${ig} µrad`,
    num46:`1/γ = ${ig} µrad. That is ${(d.invg*30/1000).toFixed(1)} mm of beam radius at 30 m from the source.`,
    num48:`For ${s}, with about ${d.N} periods, n = ${d.n} and K = ${K}: θcen ≈ ${ig} µrad × √(${d.F.toFixed(2)} / ${nN}) ≈ ${d.thc.toFixed(0)} µrad, and Δλ/λ ≈ ${(100/nN).toFixed(1)}%.`,
    usePur:`For ${s}: 1/γ = ${ig} µrad. Electron-beam spread (1σ): ${p.sxp} × ${p.syp} µrad. Single-electron cone: about ${d.thc.toFixed(0)} µrad.`,
    num52:`At γθx = γθy = 0.3 (${(0.3*d.invg).toFixed(0)} µrad each way at this ring): tan χ = −0.18, a tilt of 10°. The vertical intensity there is 0.18² = 3% of the horizontal.`,
    num54:`For ${s}: electron spread ${p.sxp} µrad horizontally and ${p.syp} µrad vertically, against a cone of about ${d.thc.toFixed(0)} µrad. Combined: about ${Sx.toFixed(0)} µrad × ${Sy.toFixed(0)} µrad.`,
    useMono:`Set for ${s}: ${crn}, ${bn}, ${defl} deflection (assumed), 12.662 keV.`,
    num61:`For ${s}: ${crn}, d = ${d.d} Å. At 12.662 keV, sin θB = 12.398 / (2 × ${d.d} × 12.662) = ${d.sinB.toFixed(3)}, so θB = ${(d.thB*180/Math.PI).toFixed(2)}° and the beam turns through ${t2}°.`,
    num62:`At that angle C = cos ${t2}° = ${d.C.toFixed(3)}. `+(p.m===2?`Two bounces give C² = ${d.Cm.toFixed(3)}.`:`There is one bounce, so the total factor is C itself.`),
    num63:`P = 0.980 in gives ${d.Pout.toFixed(4)} out for ${s} (${bn}, ${defl} deflection). The other deflection plane would give ${d.Palt.toFixed(4)}.`,
    useSmp:`Set for ${s}: P = ${d.Pout.toFixed(3)} at the sample, taking an assumed 0.98 from the source through the mono of step 6.`
  };
  document.querySelectorAll('[data-d]').forEach(el=>{const k=el.dataset.d;if(k in T)el.textContent=T[k];});}
function buildTable(){const D={};ORDER.forEach(k=>D[k]=derive(PRESETS[k]));
  const rows=[
    ['Storage ring',k=>{const p=PRESETS[k];return p.ring+', '+p.Ee+' GeV, '+p.I+' mA';}],
    ['γ and cone angle 1/γ ‡',k=>cm(D[k].g)+'; '+D[k].invg.toFixed(0)+' µrad'],
    ['Emittance',k=>PRESETS[k].emit],
    ['Electron beam size, h × v (rms)',k=>PRESETS[k].sx+' × '+PRESETS[k].sy+' µm'],
    ['Electron beam divergence, h × v (rms)',k=>PRESETS[k].sxp+' × '+PRESETS[k].syp+' µrad'],
    ['Undulator period',k=>PRESETS[k].lu.toFixed(1)+' cm'],
    ['Number of periods †',k=>'about '+D[k].N],
    ['Photon energy',k=>PRESETS[k].range],
    ['Setting for 12.662 keV ‡',k=>'harmonic '+D[k].n+', K = '+D[k].K.toFixed(2)],
    ['Monochromator',k=>PRESETS[k].monoTxt],
    ['Mono deflection †',k=>PRESETS[k].vert?'vertical':'horizontal, single reflection'],
    ['Polarization at the sample ‡',k=>D[k].Pout.toFixed(3)+', from 0.98 † at the mono']
  ];
  const on=k=>k===PKEY?' class="on"':'';
  let html='<thead><tr><th></th>'+ORDER.map(k=>`<th${on(k)}>${PRESETS[k].bl}<br>${PRESETS[k].when}</th>`).join('')+'</tr></thead><tbody>';
  rows.forEach(r=>{html+='<tr><th>'+r[0]+'</th>'+ORDER.map(k=>`<td${on(k)}>${r[1](k)}</td>`).join('')+'</tr>';});
  $('setTbl').innerHTML=html+'</tbody>';}
function applyPreset(key){if(!PRESETS[key])key='Cpost';PKEY=key;PS=PRESETS[key];CUR=derive(PS);GAMMA=CUR.g;$('preset').value=key;
  $('uK').step='0.001';$('uK').value=CUR.K.toFixed(3);$('uL').value=PS.lu;uUpd();
  $('cE').value=PS.Ee;$('cL').value=PS.lu;$('cK').step='0.001';$('cK').value=CUR.K.toFixed(3);$('cN').value=String(CUR.n);cUpd();
  $('mE').step='0.001';$('mE').value=E0;$('mP').value=PSRC;$('mCr').value=PS.cr;$('mB').value=String(PS.m);mSet(PS.vert);
  $('sP').value=CUR.Pout.toFixed(3);sUpd();pUpd();
  buildTable();fillText();redrawAll();
  try{localStorage.setItem('aps-pol-preset',key);}catch(e){}}
$('preset').addEventListener('change',e=>applyPreset(e.target.value));
let saved=null;try{saved=localStorage.getItem('aps-pol-preset');}catch(e){}
applyPreset(saved||'Cpost');
})();
