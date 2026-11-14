// ---------- the guide "How does an X-ray detector work?" (Introductory level) ----------
// Four stops, one figure and one control at each. The script is the drawing kit, introkit.js and this file.
const PIX=0.075, FW=DETG.fw, FH=DETG.fh;   // pixel size and window of the EIGER2 XE 16M, in millimeters

// ---------- opening figure: a data collection, image by image ----------
// A made-up crystal (cell 40 x 45 x 52 Å, tilted) turns about an upright axis in a beam of 1 Å X-rays. Each image shows the lattice
// points that lie close to the sphere of reflection at that angle, so the spots fall in curved bands, lunes, that move as it turns.
if($('pixHeroCv')){
const RMAX=1/2.4,TX=Math.tan(2*Math.asin(0.5/2.5)),TY=TX*FH/FW,SG=0.0009,PTS=(()=>{
  const ca=Math.cos(0.30),sa=Math.sin(0.30),cb=Math.cos(0.16),sb=Math.sin(0.16),cg=Math.cos(0.10),sg=Math.sin(0.10),P=[];
  const hash=(h,k,l)=>{let q=(h*73856093)^(k*19349663)^(l*83492791);q=(q^(q>>>13))>>>0;q=Math.imul(q,1274126177)>>>0;return ((q^(q>>>16))>>>0)/4294967296;};
  for(let h=-17;h<=17;h++)for(let k=-19;k<=19;k++)for(let l=-22;l<=22;l++){if(!h&&!k&&!l)continue;let x=h/40,y=k/45,z=l/52;const r=Math.hypot(x,y,z);if(r>RMAX)continue;
    let t=x*ca-y*sa;y=x*sa+y*ca;x=t;t=y*cb-z*sb;z=y*sb+z*cb;y=t;t=x*cg+z*sg;z=-x*sg+z*cg;x=t;   // tilt the lattice
    P.push(x,y,z,Math.pow(hash(h,k,l),1.6)*Math.exp(-2.2*(r/RMAX)*(r/RMAX)));}
  return new Float32Array(P);})();
let shown=-1,SPOTS=[];
// the spots on image n: 0.3 degrees of turn for each image
function image(n){const ph=n*0.3*Math.PI/180,cs=Math.cos(ph),sn=Math.sin(ph),S=[],px=FW/(DETG.mw+DETG.gx),py=FH/(DETG.mh+DETG.gy);
  for(let i=0;i<PTS.length;i+=4){const x=PTS[i]*cs+PTS[i+2]*sn,y=PTS[i+1],kz=-PTS[i]*sn+PTS[i+2]*cs+1;if(kz<=0)continue;
    const e=Math.sqrt(x*x+y*y+kz*kz)-1;if(e>3*SG||e<-3*SG)continue;const u=x/kz/TX,v=y/kz/TY;if(u<-1||u>1||v<-1||v>1||u*u+v*v<0.004)continue;
    // nothing is counted in the gaps between the modules
    const mx=((u+1)/2*FW)%(DETG.mw+DETG.gx),my=((v+1)/2*FH)%(DETG.mh+DETG.gy);if(mx>DETG.mw||my>DETG.mh)continue;
    const a=PTS[i+3]*Math.exp(-e*e/(2*SG*SG));if(a>0.02)S.push({u,v,a});}
  return S;}
fig('pixHeroCv',w=>w<560?1.1:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const S=narrow?h*0.66:h*0.9,dc=narrow?[w*0.36,h*0.58]:[w*0.3,h*0.5],R=narrow?h*0.26:h*0.36,mc=narrow?[w*0.78,h*0.36]:[w*0.72,h*0.5];
  const n=Math.floor(t*10);if(n!==shown){SPOTS=image(n);shown=n;}
  const B=detFace(c,dc[0],dc[1],S/DETG.hh),k=B.w/230;
  SPOTS.forEach(s=>{c.fillStyle=`rgba(27,27,27,${Math.min(1,0.45+2.5*s.a).toFixed(2)})`;c.beginPath();c.arc(dc[0]+s.u*B.w/2,dc[1]+s.v*B.h/2,(0.6+2.3*Math.sqrt(s.a))*k,0,7);c.fill();});
  disc(c,dc[0],dc[1],Math.max(3,B.w*0.022),GREY,1.4);
  // a magnified patch: pixels, each with its count
  const U0=-0.42,V0=0.38,HW=0.085,qx=dc[0]+U0*B.w/2,qy=dc[1]+V0*B.h/2,qs=HW*B.w/2;pen(c,1.8);c.strokeRect(qx-qs,qy-qs*FW/FH*1.05,2*qs,2*qs*FW/FH*1.05);
  line(c,qx+qs,qy-qs,mc[0]-R*0.72,mc[1]-R*0.6,1.6,INK,[4,4]);
  disc(c,mc[0],mc[1],R,WHITE,2.5);c.save();c.beginPath();c.arc(mc[0],mc[1],R-1.5,0,7);c.clip();
  const near=SPOTS.filter(s=>Math.abs(s.u-U0)<HW*1.3&&Math.abs(s.v-V0)<HW*1.3),p=R/2.6;
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){let cnt=(Math.imul(n*31+i*7+j*13+977,2654435761)>>>29)%3;
    near.forEach(s=>{const gu=(s.u-U0)/HW*2.6,gv=(s.v-V0)/HW*2.6;cnt+=Math.round(260*Math.min(1,s.a*2.5)*Math.exp(-((i-gu)*(i-gu)+(j-gv)*(j-gv))/0.9));});
    const x=mc[0]+(i-0.5)*p,y=mc[1]+(j-0.5)*p;c.fillStyle=`rgba(238,138,43,${Math.min(1,cnt/150).toFixed(2)})`;c.fillRect(x,y,p,p);pen(c,1,'rgba(27,27,27,.5)');c.strokeRect(x,y,p,p);txt(c,String(cnt),x+p/2,y+p/2,Math.max(9,p*0.34),'center');}
  c.restore();disc(c,mc[0],mc[1],R,null,2.5);
  cap(c,'detector',Math.max(6,dc[0]-S*0.47-(narrow?0:40)),Math.max(13,dc[1]-S/2+(narrow?-2:10)),'left',fs);cap(c,'pixels, each with its count',Math.min(w-6,mc[0]+R),Math.max(13,mc[1]-R-(narrow?14:18)),'right',fs);
  tag(c,'image '+(n%1200+1)+', as the crystal turns',narrow?w*0.03:mc[0]-R,narrow?h-12:Math.min(h-12,mc[1]+R+(narrow?12:16)),'left',fs);
});
}

// ---------- stop 1: zoom in to the pixels ----------
if($('pZoomCv')){
let Z=0,VW0=760;const SP=mkSpots(31,1.8),vwOf=z=>VW0*Math.pow(0.6/VW0,z),S0=SP.reduce((a,b)=>Math.hypot(b.x-0.3,b.y-0.2)<Math.hypot(a.x-0.3,a.y-0.2)?b:a);
const F=fig('pZoomCv',w=>w<560?1.0:2.2,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  VW0=450*Math.max(1,w/h);readZ();   // wide enough to show the whole detector at the start
  const vw=vwOf(Z),z=w/vw,u=Math.min(1,Z*3),hx=FW/2*0.95,hy=FH/2*0.95,ox=S0.x*hx*u,oy=S0.y*hy*u,X=x=>w/2+(x-ox)*z,Y=y=>h/2+(y-oy)*z,p=PIX*z;
  detFace(c,X(0),Y(0),z);
  // the pixel that holds the middle of the chosen spot, and the counts around it
  const pi=Math.floor(S0.x*hx/PIX),pj=Math.floor(S0.y*hy/PIX);
  if(p>5){const n=Math.ceil(w/p/2)+1,m=Math.ceil(h/p/2)+1;
    for(let i=-n;i<=n;i++)for(let j=-m;j<=m;j++){const di=i,dj=j,cnt=Math.round(240*Math.exp(-(di*di+dj*dj)/1.7))+((i*7+j*13+700)%3),x=X((pi+i)*PIX),y=Y((pj+j)*PIX);
      if(cnt>3){c.fillStyle=`rgba(238,138,43,${Math.min(1,cnt/200).toFixed(2)})`;c.fillRect(x,y,p,p);}
      if(p>30)txt(c,String(cnt),x+p/2,y+p/2,Math.min(18,p*0.3),'center');}
    pen(c,1,'rgba(27,27,27,.45)');c.beginPath();for(let i=-n;i<=n+1;i++){c.moveTo(X((pi+i)*PIX),0);c.lineTo(X((pi+i)*PIX),h);}for(let j=-m;j<=m+1;j++){c.moveTo(0,Y((pj+j)*PIX));c.lineTo(w,Y((pj+j)*PIX));}c.stroke();
  }else SP.forEach(s=>{const x=X(s.x*hx),y=Y(s.y*hy);if(x<-9||x>w+9||y<-9||y>h+9)return;c.fillStyle=s===S0?ORG:INK;c.beginPath();c.arc(x,y,Math.max(0.8+1.6*s.s,0.1*z*(0.6+s.s)),0,7);c.fill();});
  if(p<=5&&u>0.05){disc(c,X(S0.x*hx),Y(S0.y*hy),Math.max(8,0.25*z),null,2);}
  const bars=[100,50,20,10,5,2,1,0.5,0.2,0.1],b=bars.find(v=>v<=vw*0.3)||0.1,bx=w*0.04,by=h-(narrow?16:20);
  rectF(c,bx-6,by-(narrow?30:36),Math.max(b*z,70)+12,narrow?44:52,'rgba(255,255,255,.85)',0.01);line(c,bx,by,bx+b*z,by,4);line(c,bx,by-6,bx,by+6,2);line(c,bx+b*z,by-6,bx+b*z,by+6,2);
  txt(c,b>=1?b+' mm':Math.round(b*1000)+' µm',bx,by-(narrow?17:20),fs);
},false);
function readZ(){const vw=vwOf(Z),m=VW0/vw;setT('pW',vw>=10?vw.toFixed(0)+' mm':vw.toFixed(1)+' mm');setT('pP',big(vw/PIX));setT('pZO',(m<10?m.toFixed(1):Math.round(m))+'×');}
bind('pZ',v=>{const m=VW0/vwOf(v);return (m<10?m.toFixed(1):Math.round(m))+'×';},()=>{Z=+$('pZ').value;readZ();F.w&&F.draw(F);});
}

// ---------- stop 2: counting X-rays one at a time ----------
if($('pThrCv')){
let TH=0.5;const r=rng(41),EV=[];
for(let i=0;i<12;i++)EV.push({x:0.04+(i+0.2+0.6*r())/12*0.92,a:0.96+0.08*r(),ph:true});
for(let i=0;i<46;i++)EV.push({x:0.02+0.96*r(),a:0.05+0.24*r()*r(),ph:false});
const F=fig('pThrCv',w=>w<560?1.2:2.8,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const x0=w*0.05,x1=w*0.97,yb=h*0.82,yt=h*0.16,Y=v=>yb-v*(yb-yt)/1.35,wd=(x1-x0)*0.006;
  line(c,x0,yb,x1,yb,1.4,'#52606b');
  // the signal from one pixel: a sharp pulse for each X-ray, and small bumps of noise
  pen(c,2,INK);c.beginPath();for(let px=0;px<=x1-x0;px+=1){const xx=px/(x1-x0);let v=0.012*Math.sin(px*0.9)+0.01*Math.sin(px*0.37);
    EV.forEach(e=>{const d=(xx-e.x)*(x1-x0);if(d>-wd*1.2&&d<wd*9)v+=e.a*(d<0?Math.max(0,1+d/(wd*1.2)):Math.exp(-d/(wd*2.2)));});px?c.lineTo(x0+px,Y(v)):c.moveTo(x0+px,Y(v));}c.stroke();
  line(c,x0,Y(TH),x1,Y(TH),2,RED,[7,5]);tag(c,'threshold',x1,Y(TH)-(narrow?12:14),'right',fs,RED);
  EV.forEach(e=>{if(e.a>TH){const x=x0+e.x*(x1-x0);poly(c,[[x,yt-(narrow?2:4)],[x-5,yt-(narrow?11:14)],[x+5,yt-(narrow?11:14)]],e.ph?GRN:RED,1.2);}});
  txt(c,'time',x1,yb+(narrow?12:14),fs,'right','#52606b');txt(c,'each mark is one count',x0,narrow?10:13,fs,'left','#52606b');
},false);
bind('pT',v=>Math.round(v*100)+'% of a full pulse',()=>{TH=+$('pT').value;const np=EV.filter(e=>e.ph&&e.a>TH).length,nn=EV.filter(e=>!e.ph&&e.a>TH).length;
  setT('pCnt',(np+nn)+' (12 X-rays arrived)');setT('pVer',nn>0?nn+' of the counts are only noise':np<12?(12-np)+' X-rays were missed':'every X-ray counted once, and no noise');F.w&&F.draw(F);});
}

// ---------- stop 3: image after image, with no pause ----------
if($('pFastCv')){
// K counts the images drawn so far and A is the angle of the crystal. Both advance a little each frame at the rate set by the slider,
// so a change of rate never makes the picture jump. Up to 4 images a second the animation runs at true speed. Above that it is slowed,
// but it always runs faster for a faster setting: 560 a second is drawn at about 20 a second.
let RT=25,K=0,A=0,last=null;
const shownRate=r=>r<=4?r:4*Math.pow(r/4,0.33);
fig('pFastCv',w=>w<560?1.3:3.2,f=>{const {ctx:c,w,h,t}=f;const dt=last===null?0:Math.min(0.05,Math.max(0,t-last));last=t;K+=dt*shownRate(RT);A+=dt*shownRate(RT)*0.14;
  bg(c,w,h);const narrow=w<560,fs=narrow?12:15,n=narrow?7:13,x0=w*0.22,x1=w*0.97,fw=(x1-x0)/n,y=h*0.5,fh=Math.min(fw*0.86,h*0.5),cx=w*0.1,k0=Math.floor(K),fr=K-k0;
  // the crystal, turning without stopping
  line(c,cx,y+12,cx,y+h*0.3,3);const bw=narrow?16:24,wa=bw*Math.abs(Math.cos(A)),wb=bw*0.75*Math.abs(Math.sin(A));
  if(wa>0.5)rectF(c,cx-(wa+wb)/2,y-bw*0.55,wa,bw*1.1,GRN,2);if(wb>0.5)rectF(c,cx-(wa+wb)/2+wa,y-bw*0.55,wb,bw*1.1,GDK,2);
  // the images, newest on the right, moving left as each new one starts
  c.save();c.beginPath();c.rect(x0,0,x1-x0,h);c.clip();
  for(let j=-1;j<=n;j++){const i=k0-j,x=x1-fw*(j+1+fr);if(i<0)continue;rectF(c,x+3,y-fh/2,fw-6,fh,j<0?'#e6eef3':WHITE,2);
    if(j>=0){const rr=rng(i*7+3),m=j===0?Math.max(1,Math.round(14*fr)):14;for(let q=0;q<m;q++){c.fillStyle=j===0?ORG:INK;c.beginPath();c.arc(x+3+(0.12+0.76*rr())*(fw-6),y-fh/2+(0.12+0.76*rr())*fh,j===0?2:1.3,0,7);c.fill();}}}
  c.restore();
  cap(c,'one image after another, with no gap',x0+3,y-fh/2-(narrow?14:18),'left',fs);
  const slow=RT/shownRate(RT);tag(c,slow<1.05?'shown at true speed':'shown '+(slow<10?slow.toFixed(1):Math.round(slow))+' times slower than real',x1-3,y+fh/2+(narrow?14:18),'right',fs);
});
bind('pR',v=>v.toFixed(0),()=>{RT=+$('pR').value;const s=1800/RT;setT('pTurn',s>=120?(s/60).toFixed(0)+' minutes':s>=60?(s/60).toFixed(1)+' minutes':s.toFixed(s<10?1:0)+' seconds');setT('pEach',(1000/RT).toFixed(RT>100?1:0)+' thousandths of a second');});
}

// ---------- stop 4: near or far ----------
if($('pDistCv')){
let D=300,GEO=null,DRAG=false;
const F=fig('pDistCv',w=>w<560?1.0:2.1,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const gr=GEO&&GEO.grab;GEO=geoDraw(c,w,h,D,w<560?12:15,w<560,DRAG);GEO.grab=gr;},false);
geoDrag('pDistCv','pD',()=>GEO,v=>{DRAG=v;F.w&&F.draw(F);});
bind('pD',v=>v>=1000?(v/1000).toFixed(2)+' m':v.toFixed(0)+' mm',()=>{D=+$('pD').value;const sep=LAMBDA*D/300;
  setT('pRes',resAt(D).toFixed(1)+' Å');setT('pSep',(sep/PIX).toFixed(0)+' pixels');F.w&&F.draw(F);});
}
capK();
})();
