// ---------- the guide "Why are we freezing our crystals?" (Introductory level) ----------
// Four stops, one figure and one control at each. The script is the drawing kit, introkit.js and this file.
const BROWN='#8a6a3b', ICEB='#e8f4fb';
// the nozzle of the cold stream and the gas leaving it, toward the point (x,y)
function coldStream(c,x,y,L,t,n=14){const ax=x+L*0.72,ay=y-L*0.72;
  for(let k=0;k<n;k++){const u=((t*0.9+k/n)%1),px=ax+(x-ax)*u*1.25,py=ay+(y-ay)*u*1.25,sp=(1-u)*0.5+0.5;c.fillStyle=`rgba(255,255,255,${(0.9-0.6*u).toFixed(2)})`;c.beginPath();c.arc(px+Math.sin(k*7.3)*L*0.07*sp,py+Math.cos(k*5.1)*L*0.07*sp,2+3*u,0,7);c.fill();}
  c.save();c.translate(ax,ay);c.rotate(Math.PI*0.75);rectF(c,-L*0.34,-L*0.1,L*0.34,L*0.2,STEEL,2);rectF(c,-L*0.05,-L*0.13,L*0.05,L*0.26,GREY,2);c.restore();}

// ---------- opening figure ----------
if($('coldHeroCv')){
const HS=mkSpots(7,1.8);
fig('coldHeroCv',w=>w<560?1.15:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const x=w*(narrow?0.3:0.3),y=h*(narrow?0.36:0.56),S=narrow?Math.min(w*0.5,h*0.5):h*0.78,dc=narrow?[w*0.68,h*0.68]:[w*0.78,h*0.5],L=narrow?70:110;
  arrow(c,w*0.02,y,x-18,y,ORG,3,9);line(c,x,y,dc[0],dc[1],1.6,'rgba(238,138,43,.6)');
  drawPattern(c,dc[0],dc[1],S,HS,0,1.8,0);
  coldStream(c,x,y,L,t);
  line(c,x,y+8,x,y+(narrow?40:70),3);xtal(c,x,y,narrow?10:14);
  cap(c,'x-rays',w*0.02,y-(narrow?18:24),'left',fs);tag(c,'−173 °C',x+(narrow?16:24),y+(narrow?22:30),'left',fs+1);
  cap(c,'cold nitrogen gas',Math.min(w-8,x+L*0.72+ (narrow?70:120)),Math.max(13,y-L*0.72-(narrow?24:34)),'right',fs);
});
}

// ---------- stop 1: the spots fade as the crystal takes up X-rays ----------
if($('cFadeCv')){
let D=0;const SP=mkSpots(11,1.5);
const F=fig('cFadeCv',w=>w<560?0.85:2.4,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const S=narrow?Math.min(w*0.86,h*0.64):Math.min(h*0.86,w*0.42),dc=narrow?[w/2,h-S/2-h*0.035]:[w*0.72,h/2],xc=narrow?[w*0.5,h*0.13]:[w*0.16,h*0.5],u=Math.min(1,D/45);
  arrow(c,w*0.01,xc[1],xc[0]-(narrow?20:28),xc[1],ORG,3,9);line(c,xc[0],xc[1],dc[0],dc[1],1.6,'rgba(238,138,43,.6)');
  drawPattern(c,dc[0],dc[1],S,SP,D,1.5,0);
  line(c,xc[0],xc[1]+10,xc[0],xc[1]+(narrow?26:h*0.24),3);xtal(c,xc[0],xc[1],narrow?13:20,mix('#5aa469',BROWN,u));
  cap(c,'crystal',narrow?xc[0]+24:xc[0],narrow?xc[1]:xc[1]-(narrow?24:38),narrow?'left':'center',fs);
  txt(c,'coarse detail',dc[0],dc[1]+S*0.09,fs,'center','#52606b');txt(c,'fine detail',dc[0],dc[1]+S/2-(narrow?10:13),fs,'center','#52606b');
},false);
bind('cfT',v=>v.toFixed(0)+'% of the limit',()=>{D=0.3*(+$('cfT').value);const dh=D/10;
  setT('cfD',dh<=1.5?'all of it, down to 1.5 Å':'only detail coarser than '+dh.toFixed(1)+' Å');
  setT('cfN',SP.filter(s=>Math.pow(2,-D/(10*s.d))>=0.25).length+' of '+SP.length);F.w&&F.draw(F);});
}

// ---------- stop 2: warm, the damage spreads; cold, it stays where it started ----------
if($('cWarmCv')){
let COLD=0,T0=0;const r=rng(5),NB=90,NR=5,NS=150,BD=[],RD=[];
for(let i=0;i<NB;i++)BD.push({x:0.04+0.92*r(),y:0.08+0.84*r(),a:r()*3.14});
for(let k=0;k<NR;k++){const p=[{x:0.12+0.76*r(),y:0.15+0.7*r()}];for(let s=1;s<NS;s++){const q=p[s-1],a=r()*6.2832;p.push({x:Math.min(0.97,Math.max(0.03,q.x+0.035*Math.cos(a))),y:Math.min(0.95,Math.max(0.05,q.y+0.06*Math.sin(a)))});}RD.push(p);}
// the step at which each bond is broken: warm, by a fragment wandering past; cold, only if the X-ray landed on it
const near=(b,p)=>Math.hypot((b.x-p.x),(b.y-p.y)*0.6)<0.045;
BD.forEach(b=>{b.w=Infinity;b.c=Infinity;RD.forEach(p=>{if(near(b,p[0]))b.c=0;for(let s=0;s<NS;s++)if(near(b,p[s])){b.w=Math.min(b.w,s);break;}});});
let shown=-1;
const F=fig('cWarmCv',w=>w<560?1.1:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h,'#eef6ee');const narrow=w<560,fs=narrow?12:15;
  const tau=(t-T0)%16,s=Math.min(NS-1,Math.floor(tau*10)),L=narrow?9:13;let n=0;
  BD.forEach(b=>{const broken=(COLD?b.c:b.w)<=s;if(broken)n++;const x=b.x*w,y=b.y*h,dx=L*Math.cos(b.a),dy=L*Math.sin(b.a);
    if(broken){line(c,x-dx,y-dy,x-dx*0.25,y-dy*0.25,3,RED);line(c,x+dx*0.25,y+dy*0.25,x+dx,y+dy,3,RED);}else line(c,x-dx,y-dy,x+dx,y+dy,3,GDK);});
  RD.forEach((p,k)=>{const q=COLD?p[0]:p[s],jx=COLD?Math.sin(t*9+k)*1.5:0,jy=COLD?Math.cos(t*8+k*2)*1.5:0;
    if(tau<0.6){pen(c,2.5,ORG);c.beginPath();c.arc(p[0].x*w,p[0].y*h,6+tau*40,0,7);c.stroke();}
    if(!COLD){pen(c,1.2,'rgba(216,65,47,.35)');c.beginPath();for(let i=0;i<=s;i++)i?c.lineTo(p[i].x*w,p[i].y*h):c.moveTo(p[i].x*w,p[i].y*h);c.stroke();}
    disc(c,q.x*w+jx,q.y*h+jy,narrow?4.5:6,RED,1.6);});
  cap(c,COLD?'cold: the fragments stay put':'warm: the fragments wander',w/2,narrow?14:18,'center',fs);
  if(n!==shown){shown=n;setT('cwB',n+' of '+NB);}
});
choice('cW',v=>{COLD=+v;T0=F.t;shown=-1;setT('cwL',COLD?'about 70 times longer':'this is the comparison');if(!playing&&F.w)F.draw(F);});
}

// ---------- stop 3: cool it without making ice ----------
if($('cIceCv')){
let A=0;const SP=mkSpots(19,1.8),r=rng(3),HX=[];for(let i=0;i<16;i++)HX.push({x:(r()-0.5)*1.5,y:(r()-0.5)*1.5,s:0.12+0.12*r(),a:r()});
const F=fig('cIceCv',w=>w<560?0.85:2.4,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const ice=Math.max(0,Math.min(1,1-A/25)),S=narrow?Math.min(w*0.86,h*0.6):Math.min(h*0.86,w*0.42),dc=narrow?[w/2,h-S/2-h*0.035]:[w*0.72,h/2],xc=narrow?[w*0.5,h*0.17]:[w*0.2,h*0.5],R=narrow?h*0.12:h*0.3;
  // the frozen drop that holds the crystal
  disc(c,xc[0],xc[1],R,mix('#c6d9f0','#f4f8fb',ice),2.5);
  c.save();c.beginPath();c.arc(xc[0],xc[1],R-2,0,7);c.clip();
  HX.forEach((q,i)=>{if(i>=Math.round(ice*HX.length))return;const s=q.s*R;poly(c,[0,1,2,3,4,5].map(k=>[xc[0]+q.x*R*0.62+s*Math.cos(k*1.0472+q.a),xc[1]+q.y*R*0.62+s*Math.sin(k*1.0472+q.a)]),WHITE,1.4);});
  c.restore();xtal(c,xc[0],xc[1],R*0.22);
  cap(c,ice>0.02?'ice in the drop':'a clear glass',xc[0],narrow?xc[1]+R+14:xc[1]-R-(narrow?14:20),'center',fs);
  line(c,xc[0]+R,xc[1],dc[0]-S/2,dc[1],1.6,'rgba(238,138,43,.6)');
  drawPattern(c,dc[0],dc[1],S,SP,0,1.8,ice);
  if(ice>0.02)tag(c,'ice rings',dc[0]+S/2-8,dc[1]-S/2+(narrow?14:18),'right',fs);
},false);
bind('cA',v=>v.toFixed(0)+'%',()=>{A=+$('cA').value;const ice=Math.max(0,Math.min(1,1-A/25));
  setT('ciI',ice>0.6?'a lot':ice>0.25?'some':ice>0.02?'a trace':'none: the water is a glass');setT('ciR',ice>0.6?'strong, hiding many spots':ice>0.25?'clear to see':ice>0.02?'faint':'none');F.w&&F.draw(F);});
}

// ---------- stop 4: how cold is cold ----------
if($('cThermCv')){
let TC=20;const LM=[[37,'body','body temperature'],[20,'room','a warm room'],[0,'water freezes','water freezes'],[-78,'dry ice','dry ice'],[-89,'coldest air on Earth','the coldest air recorded on Earth'],[-173,'the crystal','the crystal in the X-ray beam'],[-196,'liquid nitrogen','liquid nitrogen boils'],[-273,'absolute zero','absolute zero, the coldest there is']];
const F=fig('cThermCv',w=>w<560?1.25:3.2,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?11:14;
  const x0=w*0.05,x1=w*0.95,y=h*0.5,bh=narrow?14:18,X=T=>x0+(T+273)/313*(x1-x0);
  for(let i=0;i<80;i++){c.fillStyle=mix('#2f6db5','#d8412f',i/79);c.fillRect(x0+i*(x1-x0)/80,y-bh/2,(x1-x0)/80+1,bh);}pen(c,2);c.strokeRect(x0,y-bh/2,x1-x0,bh);
  LM.forEach(([T,s],i)=>{const x=X(T),up=i%2===0,yy=y+(up?-1:1)*(narrow?(i%4<2?30:52):(i%4<2?34:58));
    line(c,x,y+(up?-bh/2:bh/2),x,yy+(up?9:-9),1.6,INK,[3,3]);tag(c,s,Math.max(x0-4+2,Math.min(x1+4,x)),yy,x>w*0.8?'right':x<w*0.2?'left':'center',fs,T===-173?RED:INK);});
  const x=X(TC);poly(c,[[x,y-bh/2-1],[x-7,y-bh/2-13],[x+7,y-bh/2-13]],INK,1.5);poly(c,[[x,y+bh/2+1],[x-7,y+bh/2+13],[x+7,y+bh/2+13]],INK,1.5);
},false);
bind('cK',v=>(v<0?'−'+Math.abs(v).toFixed(0):v.toFixed(0))+' °C',()=>{TC=+$('cK').value;setT('ctK',Math.round(TC+273.15)+' K');
  const n=LM.reduce((a,b)=>Math.abs(b[0]-TC)<Math.abs(a[0]-TC)?b:a);setT('ctN',n[2]+(Math.abs(n[0]-TC)<1.5?'':': '+Math.round(Math.abs(n[0]-TC))+' degrees '+(TC>n[0]?'colder':'warmer')));F.w&&F.draw(F);});
}
capK();
})();
