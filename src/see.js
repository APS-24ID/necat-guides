// ---------- the guide "How do we see a protein?" (Introductory level) ----------
// The script is the drawing kit, introkit.js and this file.
// the pattern of spots, with the ones inside the circle of radius r (0 to 1) dark and the rest pale
const DEDGE=1.2, SP=mkSpots(21,DEDGE);
function drawSpots(c,cx,cy,S,r,t){rectF(c,cx-S/2,cy-S/2,S,S,WHITE,2.4);
  SP.forEach((s,i)=>{const on=s.rad<=r,tw=t===undefined?1:0.75+0.25*Math.sin(t*2.2+i*1.9);c.fillStyle=on?`rgba(27,27,27,${(Math.min(1,0.35+s.s)*tw).toFixed(3)})`:'rgba(27,27,27,.13)';c.beginPath();c.arc(cx+s.x*S/2*0.95,cy+s.y*S/2*0.95,(0.8+1.9*s.s)*Math.max(0.7,S/260),0,7);c.fill();});
  if(r<0.995){pen(c,2,ORG);c.setLineDash([6,5]);c.beginPath();c.arc(cx,cy,r*S/2*0.95,0,7);c.stroke();c.setLineDash([]);}
  disc(c,cx,cy,Math.max(3,S*0.02),GREY,1.4);}
// the pattern, an arrow, and the map made from the spots inside the circle. Returns the box of the map
function pair(c,w,h,r,t,narrow,top=0){let S,px,py,bx,by,bw,bh;
  if(narrow){S=Math.min(w*0.56,(h-top)*0.42);px=w/2;py=top+8+S/2;bx=w*0.03;by=py+S/2+30;bw=w*0.94;bh=h-by-8;arrow(c,px,py+S/2+5,px,by-5,INK,2.4,8);}
  else{S=(h-top)*0.84;px=w*0.05+S/2;py=top+(h-top)/2;bx=px+S/2+w*0.09;by=top+(h-top)*0.08;bw=w*0.97-bx;bh=(h-top)*0.84;arrow(c,px+S/2+8,py,bx-8,py,INK,2.6,9);}
  drawSpots(c,px,py,S,r,t);rectF(c,bx,by,bw,bh,WHITE,2.4);drawMap(c,bx+2,by+2,bw-4,bh-4,DEDGE/r,4);
  return {bx,by,bw,bh,px,py,S};}

// draws something at less than full strength: whole on a spare canvas first, so that overlapping pieces do not show through one another
let OFF=null;
function faded(f,c,a,go){if(a<=0)return;if(a>=1)return go(c);const o=OFF||(OFF=document.createElement('canvas'));if(o.width!==f.cv.width||o.height!==f.cv.height){o.width=f.cv.width;o.height=f.cv.height;}const k=o.getContext('2d'),r=f.cv.width/f.w;k.setTransform(1,0,0,1,0,0);k.clearRect(0,0,o.width,o.height);k.setTransform(r,0,0,r,0,0);go(k);c.save();c.globalAlpha=a;c.drawImage(o,0,0,f.w,f.h);c.restore();}
// turning from the side view of the helix (the view of the maps) to the view of the whole protein: a rotation about one axis, taken a part at a time
const TURN=(()=>{const R=MB.rot,th=Math.acos(Math.max(-1,Math.min(1,(R[0][0]+R[1][1]+R[2][2]-1)/2))),k=2*Math.sin(th)||1;
  // axis and angle of the turn that takes the protein's view back to the helix's (the inverse of MB.rot)
  return {th,ax:[(R[1][2]-R[2][1])/k,(R[2][0]-R[0][2])/k,(R[0][1]-R[1][0])/k]};})();
function turned(p,ang){const [x,y,z]=[p[0]-MB.off[0],p[1]-MB.off[1],p[2]-MB.off[2]],[a,b,d]=TURN.ax,cs=Math.cos(ang),sn=Math.sin(ang),dot=(a*x+b*y+d*z)*(1-cs);
  return [x*cs+(b*z-d*y)*sn+a*dot,y*cs+(d*x-a*z)*sn+b*dot,z*cs+(a*y-b*x)*sn+d*dot];}

// The move from the atoms of the piece, as they sit in the map, to the whole protein: the view turns and pulls back. q0 runs from 0 to 1.
// Returns where the protein ends up: its center and its scale in pixels to the ångström
const HPH=MB.helP.map((p,i)=>({p,e:MB.hel[i][3]}));
function pullBack(f,c,X0,Y0,W,H,q0,narrow){const q=q0*q0*(3-2*q0),s0=mapScale(W,H),s1=Math.min(W/56,H/52),s=s0*Math.pow(s1/s0,q),k=(s0-s)/(s0-s1),ang=TURN.th*(1-q),pcx=X0+W/2,pcy=Y0+H/2-1.9*s1+(narrow?0:6);
  // where the middle of the piece is drawn: from its place in the map to its place in the protein
  const ax0=X0+W/2-MAPC[0]*s0,ay0=Y0+H/2+MAPC[1]*s0,ax1=pcx+MB.off[0]*s1,ay1=pcy-MB.off[1]*s1,ax=ax0+(ax1-ax0)*k,ay=ay0+(ay1-ay0)*k;
  const tf=p=>{const v=turned(p,ang);return [ax+v[0]*s,ay-v[1]*s,v[2]];};
  c.save();c.beginPath();c.rect(X0,Y0,W,H);c.clip();
  faded(f,c,Math.max(0,Math.min(1,(q-0.12)/0.4)),k2=>{k2.save();k2.beginPath();k2.rect(X0,Y0,W,H);k2.clip();drawMb(k2,0,0,s,MB.piece,tf);k2.restore();});
  const al=Math.max(0,Math.min(1,(0.9-q)/0.35));
  if(al>0){c.globalAlpha=al;const A=HPH.map(a=>({q:tf(a.p),e:a.e}));MB.helBonds.forEach(([i,j])=>line(c,A[i].q[0],A[i].q[1],A[j].q[0],A[j].q[1],Math.max(1,s*0.09)));
    A.slice().sort((m,n)=>m.q[2]-n.q[2]).forEach(a=>disc(c,a.q[0],a.q[1],Math.max(1.2,s*0.17),atomCol(a.e),Math.min(1.2,Math.max(0.5,s*0.06))));}
  c.restore();return {cx:pcx,cy:pcy,s:s1};}

// ---------- opening figure ----------
if($('seeHeroCv')){
fig('seeHeroCv',w=>w<560?0.95:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,u=t%19;
  // 0 to 6 s: more and more spots, and a sharper map. 7 s: atoms. 10 s: the map fades. 10.8 to 14.8 s: the view turns and pulls back to the whole protein
  const r=u<6?0.2+Math.round(30*Math.min(1,u/5))*0.02:0.8, B=pair(c,w,h,r,t,narrow,narrow?22:0),X0=B.bx+2,Y0=B.by+2,W=B.bw-4,H=B.bh-4;
  if(u>=7&&u<10.8){if(u>=10){c.save();c.globalAlpha=Math.min(1,(u-10)/0.7);c.fillStyle=WHITE;c.fillRect(X0,Y0,W,H);c.restore();}drawMol(c,X0,Y0,W,H,u<10?Math.min(1,(u-7)/1.2):1);}
  if(u>=10.8){c.fillStyle=WHITE;c.fillRect(X0,Y0,W,H);pullBack(f,c,X0,Y0,W,H,Math.min(1,(u-10.8)/4),narrow);}
  cap(c,u<2?'a few spots: a blur':u<6?'more spots: a sharper picture':u<7?'the map of one piece':u<10.8?'atoms fitted into the map':u<14.8?'the same atoms, in the whole protein':'piece by piece, the whole protein',narrow?w*0.03:B.bx+10,narrow?14:B.by+18,'left',fs);
});
}

// ---------- stop 1: far too small for light ----------
if($('sScaleCv')){
let WD=1e-4;const GREEN=5e-7,XRAY=1e-10;
const fmtL=m=>m>=0.995e-6?(m*1e6).toFixed(m<1e-5?1:0)+' microns':m>=0.995e-9?(m*1e9).toFixed(m<1e-8?1:0)+' nm':(m*1e10).toFixed(m<1e-9?1:0)+' Å';
const OBJ=[['a hair, seen end on',7e-5,(c,x,y,s)=>disc(c,x,y,s/2,'#c9a27a',2.4)],
  ['a red blood cell',7.5e-6,(c,x,y,s)=>{disc(c,x,y,s/2,RED,2.2);disc(c,x,y,s*0.2,'#e8776a',0);}],
  ['a bacterium',2e-6,(c,x,y,s)=>{c.lineCap='round';line(c,x-s*0.3,y,x+s*0.3,y,s*0.4+4,INK);line(c,x-s*0.3,y,x+s*0.3,y,s*0.4,GRN);c.lineCap='butt';}],
  ['a virus',1e-7,(c,x,y,s)=>poly(c,[0,1,2,3,4,5].map(i=>[x+s/2*Math.cos(i*1.0472+0.52),y+s/2*Math.sin(i*1.0472+0.52)]),PUR,2.2)],
  ['a protein: myoglobin',4.5e-9,(c,x,y,s,a,f)=>faded(f,c,a,k=>drawMb(k,x-CAM[0]*s/45,y+CAM[1]*s/45,s/45,s>27?MB.piece:null)),
   s=>s<2.5?1:Math.max(0,1-(s-2.5)/4)]];
// Past the protein, the view moves to two bonded atoms of its first helix: the carbon-carbon bond of the piece that lies most nearly across the page
const HP=MB.helP.map(([x,y,z],i)=>({x,y,z,e:MB.hel[i][3],i})),HPZ=HP.slice().sort((p,q)=>p.z-q.z);
const TB=MB.helBonds.reduce((m,[i,j])=>{const d=Math.abs(HP[i].x-HP[j].x);return HP[i].e===6&&HP[j].e===6&&d>m.d?{d,i,j}:m;},{d:0}),TGT=[(HP[TB.i].x+HP[TB.j].x)/2,(HP[TB.i].y+HP[TB.j].y)/2];
let CAM=[0,0];
const what=()=>{const A=WD*1e10;return A<=7?'two atoms, joined by a bond':A<=14?'atoms in one helix of the protein':A<=34?'one helix of the protein':null;};
const F=fig('sScaleCv',w=>w<560?1.0:2.5,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,cx=w/2,cy=h*0.47,A=WD*1e10,sc=w/A,sp=45/A;
  const u=Math.max(0,Math.min(1,(sp-0.5)/2)),e=u*u*(3-2*u);CAM=[TGT[0]*e,TGT[1]*e];
  let best=null,bs=0;OBJ.forEach(o=>{const s=o[1]/WD;if(s<1.3&&s>bs&&s>0.03){bs=s;best=o;}});
  // the largest thing that fits in the picture, and behind it anything larger, fading as it outgrows the view
  OBJ.forEach(o=>{const s=o[1]/WD,a=o[3]?o[3](s):Math.max(0,Math.min(1,(2.4-s)/1.2));if(a<=0||s<bs)return;if(o[3]){o[2](c,cx,cy,s*w,a,f);return;}c.save();c.globalAlpha=a;o[2](c,cx,cy,s*w);c.restore();});
  // the atoms of the piece, where they sit in the protein
  if(sp>1.4){const al=Math.min(1,(sp-1.4)/1.2),X=p=>cx+(p.x-CAM[0])*sc,Y=p=>cy-(p.y-CAM[1])*sc;c.save();c.globalAlpha=al;
    MB.helBonds.forEach(([i,j])=>line(c,X(HP[i]),Y(HP[i]),X(HP[j]),Y(HP[j]),Math.max(1.5,sc*0.12)));
    HPZ.forEach(p=>disc(c,X(p),Y(p),Math.max(2,sc*0.3),p.e===8?RED:p.e===7?BLUE:'#5d6a73',Math.min(2,Math.max(1,sc*0.03))));c.restore();
    // a small picture of the whole protein, with a red mark where the view is
    const B=Math.min(w*0.24,h*0.42),bx=w-B-(narrow?6:12),by=h*0.8-B,s2=B/50,mx=bx+B/2,my=by+B/2;c.save();c.globalAlpha=al;rectF(c,bx,by,B,B,WHITE,2);drawMb(c,mx,my,s2,MB.piece);
    const vw=Math.max(6,A*s2),vh=Math.max(6,A*h/w*s2);pen(c,2.2,RED);c.strokeRect(mx+CAM[0]*s2-vw/2,my-CAM[1]*s2-vh/2,vw,vh);c.restore();
    if(al>0.6)tag(c,narrow?'you are here':'where this is in the protein',bx+B,by-(narrow?11:13),'right',fs);}
  const wh=what();
  if(wh)tag(c,wh,narrow?w*0.03:cx,h*0.74,narrow?'left':'center',fs);
  else if(best)tag(c,best[0],cx,Math.min(h*0.74,cy+bs*w/2*(best[1]===2e-6?0.45:1)+(narrow?16:20)),'center',fs);
  // one wave of green light, to the same scale
  const lg=GREEN/WD*w,yg=h*0.88;
  if(lg<5){line(c,0,yg,w,yg,5,GDK);}else wave(c,0,w,yg,narrow?7:10,lg,0,GDK,3);
  tag(c,lg<5?'green light: waves too close together to draw':lg>w*3?'green light: one wave is far wider than the picture':'waves of green light',w*0.02,yg-(narrow?20:26),'left',fs);
  const lx=XRAY/WD*w;if(lx>=5){wave(c,0,w,h*0.13,narrow?5:7,lx,0,ORG,2.4);tag(c,'x-ray waves',w*0.98,h*0.13+(narrow?18:22),'right',fs);}
},false);
bind('sZ',v=>Math.round(v*100)+'%',()=>{WD=Math.pow(10,-4-5.3*(+$('sZ').value));setT('sW',fmtL(WD));const k=GREEN/WD,r2=n=>n<100?n:+n.toPrecision(2);
  setT('sG',k<0.8?big(r2(1/k))+' fit across the picture':k<1.25?'about as wide as the picture':big(r2(k))+' times wider than the picture');
  let best='';let bs=0;OBJ.forEach(o=>{const s=o[1]/WD;if(s<1.3&&s>bs&&s>0.03){bs=s;best=o[0];}});setT('sO',what()||best||'nothing this size');F.w&&F.draw(F);});
}

// ---------- stop 2: many copies in step ----------
if($('sRowCv')){
let N=1;
const env=q=>Math.exp(-0.1*q*q)*(0.3+0.7*Math.pow(Math.cos(0.9*q+0.5),2));
const laue=(q,n)=>{const s=Math.sin(Math.PI*q);return Math.abs(s)<1e-5?1:Math.pow(Math.sin(n*Math.PI*q)/(n*s),2);};
const F=fig('sRowCv',w=>w<560?0.95:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const cx=w/2,ym=h*0.3,x0=w*0.05,x1=w*0.95,ys=h*0.9,sh=narrow?16:22,H=h*0.3;
  // the beam, from above
  const span=Math.min(w*0.8,Math.max(w*0.12,N*w*0.04)),gap=N>1?span/(N-1):0;
  for(let i=0;i<5;i++){const x=cx+(i-2)/2*Math.max(w*0.05,span/2);arrow(c,x,h*0.03,x,ym-(narrow?14:18),ORG,2.2,7);}
  for(let i=0;i<N;i++){const x=cx-span/2+i*gap+(N===1?span/2:0),r=Math.max(2.4,Math.min(narrow?5:7,gap*0.2||7));disc(c,x-r*0.6,ym+r*0.3,r,LTBLUE,1.6);disc(c,x+r*0.6,ym+r*0.3,r*0.85,LTBLUE,1.6);disc(c,x,ym-r*0.6,r*0.9,LTBLUE,1.6);}
  cap(c,'x-rays in',w*0.03,narrow?13:17,'left',fs);tag(c,N===1?'one molecule':N+' molecules in a row',w*0.97,ym,'right',fs);
  // what lands along a strip of the detector
  rectF(c,x0,ys-sh,x1-x0,sh,WHITE,2);pen(c,2.2,INK);c.beginPath();
  for(let x=x0;x<=x1;x+=0.5){const q=(x-cx)/(x1-x0)*7,I=env(q)*laue(q,N);c.fillStyle=`rgba(27,27,27,${Math.min(1,Math.pow(I,0.6)*(N===1?0.35:1)).toFixed(3)})`;c.fillRect(x,ys-sh+1.5,0.6,sh-3);const y=ys-sh-6-H*I*(N===1?0.35:1);x===x0?c.moveTo(x,y):c.lineTo(x,y);}
  c.stroke();pen(c,2);c.strokeRect(x0,ys-sh,x1-x0,sh);
  cap(c,'what lands on a strip of the detector',x0,ys-sh-H-(narrow?14:18),'left',fs);
},false);
bind('sN',v=>String(v),()=>{N=+$('sN').value;setT('sBr',N===1?'the same':(N*N)+' times brighter');setT('sSh',N===1?'a faint smear':N<4?'broad patches':N<9?'separate spots':'sharp spots');F.w&&F.draw(F);});
}

// ---------- stop 3: from the spots to a map ----------
if($('sMapCv')){
let R=0.3;
const F=fig('sMapCv',w=>w<560?0.9:2.5,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const B=pair(c,w,h,R,undefined,narrow);
  tag(c,'spots used',B.px-B.S/2+6,B.py-B.S/2+(narrow?13:15),'left',fs);tag(c,'the map they give',B.bx+6,B.by+(narrow?13:15),'left',fs);
},false);
bind('sR',v=>Math.round(v*100)+'% of the way to the edge',()=>{R=+$('sR').value;const d=DEDGE/R;setT('sD',d.toFixed(1)+' Å');
  setT('sWh',d<=1.3?'separate atoms':d<=2.0?'the rings, with holes in them':d<=3.0?'the shape of each side chain':d<=4.2?'the helix, with lumps for its side chains':'a blob the size of the helix');F.w&&F.draw(F);});
}

// ---------- stop 4: atoms fitted into the map ----------
if($('sFitCv')){
// M: what is asked for (0 map, 1 map with atoms, 2 atoms alone, 3 the whole protein). The figure moves toward it a little each frame:
// mA and aA are how strongly the map and the atoms are drawn, q is how far the view has pulled back, and dx blends from the last map to the new one
let M=0,D=2,D0=2,mA=1,aA=0,q=0,dx=1,last=null;
const goal=()=>M===3?[0,1,1]:[M<2?1:0,M>0?1:0,0];
const step=dt=>{const [tm,ta,tq]=goal(),to=(v,t,r)=>v<t?Math.min(t,v+dt*r):Math.max(t,v-dt*r);dx=to(dx,1,2.2);
  if(tq===1){mA=to(mA,0,2);aA=to(aA,1,2);if(mA<0.02&&aA>0.98)q=to(q,1,0.3);}
  else if(q>0){q=to(q,0,0.4);mA=0;aA=1;}
  else{mA=to(mA,tm,2);aA=to(aA,ta,2);}};
const snap=()=>{[mA,aA,q]=goal();dx=1;};
const F=fig('sFitCv',w=>w<560?1.05:2.2,f=>{const {ctx:c,w,h,t}=f;if(last!==null&&playing)step(Math.min(0.05,Math.max(0,t-last)));last=t;
  bg(c,w,h,WHITE);const narrow=w<560,fs=narrow?12:15,y0=narrow?26:8,H=h-y0-(narrow?30:8);
  if(q>0){const P=pullBack(f,c,0,y0,w,H,q,narrow);
    if(q>0.97){c.save();c.globalAlpha=Math.min(1,(q-0.97)/0.03);const p=mbAt(10,P.cx,P.cy,P.s),e=mbFe(P.cx,P.cy,P.s);tag(c,'the piece in the map',Math.min(w-8,p[0]+P.s*18),p[1]-P.s*7,'right',fs);tag(c,'heme: oxygen binds here',Math.max(8,e[0]-P.s*3),e[1]+P.s*9,'left',fs);c.restore();}}
  else{if(mA>0){if(dx<1&&D0!==D)faded(f,c,mA*(1-dx),k=>drawMap(k,0,y0,w,H,D0,narrow?3:4));faded(f,c,mA*(D0!==D?dx:1),k=>drawMap(k,0,y0,w,H,D,narrow?3:4));}
    if(aA>0)drawMol(c,0,y0,w,H,aA);}
  cap(c,q>0.5?'the whole of myoglobin':q>0?'the same atoms, in the whole protein':mA>0.5?'the map at '+D.toFixed(1)+' Å':aA>0.5?'the atoms alone':'',10,narrow?13:18,'left',fs);
  if(aA>0.5&&q===0){const yl=h-(narrow?13:18);[['carbon','#5d6a73'],['nitrogen',BLUE],['oxygen',RED]].forEach(([n,col],i)=>{const x=narrow?12+i*(w-20)/3:w-330+i*108;disc(c,x,yl,6,col,1.5);txt(c,n,x+11,yl+1,fs,'left');});}
});
const show=()=>{if(!playing){snap();F.w&&F.draw(F);}};
choice('sM',v=>{M=+v;setT('sAt',M===0?'none yet':M===3?'about 1,200 in the whole protein':'all 113 in this piece');show();});
choice('sQ',v=>{if(+v!==D){D0=D;D=+v;dx=0;}setT('sEase',D>3?'poorly: the atoms could sit in many ways':D>1.5?'well: each side chain has its own shape':'closely: every atom has its own peak');show();});
snap();
}
capK();
})();
