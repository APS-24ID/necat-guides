// ---------- the guide "How do you grow a protein crystal?" (Introductory level) ----------
// Four stops, one figure and one control at each. The script is the drawing kit, introkit.js and this file.
const GMUT='#52606b',XT='#cfe6c9',LIQ='#cfe3f3',smg=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// one protein molecule: a disc with a mark on one side, so that the way it faces can be seen
function gmol(c,x,y,r,a,col=LTBLUE){disc(c,x,y,r,col,Math.max(0.8,r*0.16));c.beginPath();c.arc(x+Math.cos(a)*r*0.48,y+Math.sin(a)*r*0.48,r*0.27,0,7);c.fillStyle=BLUE;c.fill();}
// one crystal: a six-sided block of half-length r, turned by a
function xtal(c,x,y,r,a,k=0.62){if(r<0.6)return;const P=[[-1,-k*0.5],[-0.55,-k],[0.7,-k],[1,-k*0.4],[0.6,k],[-0.7,k]].map(([u,v])=>[x+(u*Math.cos(a)-v*Math.sin(a))*r,y+(u*Math.sin(a)+v*Math.cos(a))*r]);
  poly(c,P,XT,Math.max(0.9,Math.min(1.8,r*0.12)));if(r>5){line(c,P[1][0],P[1][1],P[4][0],P[4][1],0.8,'rgba(27,27,27,.35)');}}
// The drop over its reservoir, from the side, and the same drop seen from above through a microscope. day: time since the drop was set up
const DROPV=d=>0.5+0.5*Math.exp(-d/2),NUC=3;   // the drop shrinks toward half its volume. Crystals first appear on day 3. Both are for illustration
const GX=(()=>{const r=rng(12),X=[];for(let i=0;i<9;i++)X.push([0.62*Math.sqrt(r())*Math.cos(i*2.4+r()),0.62*Math.sqrt(r())*Math.sin(i*2.4+r()),r()*3.1,0.55+0.45*r(),r()*2.2]);
  // nudged apart, so that the grown crystals do not run into one another
  for(let k=0;k<300;k++)for(let i=0;i<9;i++){const p=X[i],d0=Math.hypot(p[0],p[1]);if(d0>0.7){p[0]*=0.7/d0;p[1]*=0.7/d0;}for(let m=0;m<i;m++){const q=X[m],dx=p[0]-q[0],dy=p[1]-q[1],d=Math.hypot(dx,dy)||0.01;if(d<0.46){const s=(0.46-d)/2;p[0]+=dx/d*s;p[1]+=dy/d*s;q[0]-=dx/d*s;q[1]-=dy/d*s;}}}
  return X;})();
const VAP=(()=>{const r=rng(5),V=[];for(let i=0;i<14;i++)V.push([r(),r(),r()]);return V;})();
function dropScene(c,w,h,day,narrow,fs,t,top){const V=DROPV(day),conc=1/V,g=Math.max(0,day-NUC);
  // the well, in cross-section
  const wx=narrow?w*0.06:w*0.05,ww=narrow?w*0.88:w*0.46,wy=top+(narrow?6:10),wh=narrow?(h-top)*0.42:(h-top)*0.8,wall=narrow?7:9;
  rectF(c,wx,wy+wall,ww,wh-wall,'#f4f7f9',0);c.fillStyle=LIQ;c.fillRect(wx+wall,wy+wh*0.68,ww-2*wall,wh*0.32-wall);
  line(c,wx+wall,wy+wh*0.68,wx+ww-wall,wy+wh*0.68,1.6,BLUE);
  pen(c,wall,'#9aa7b3');c.lineCap='butt';c.beginPath();c.moveTo(wx+wall/2,wy+wall);c.lineTo(wx+wall/2,wy+wh-wall/2);c.lineTo(wx+ww-wall/2,wy+wh-wall/2);c.lineTo(wx+ww-wall/2,wy+wall);c.stroke();
  rectF(c,wx-6,wy,ww+12,wall,YEL,1.6);   // the seal
  // the post that holds the drop, and the drop on it
  const px=wx+ww*0.5,pw=ww*0.3,py=wy+wh*0.42;rectF(c,px-pw*0.16,py,pw*0.32,wy+wh-wall-py,'#c3ccd4',1.4);rectF(c,px-pw/2,py-6,pw,8,'#c3ccd4',1.4);
  const dr=pw*0.42*Math.cbrt(V);c.beginPath();c.ellipse(px,py-6,dr,dr*0.62,0,Math.PI,2*Math.PI);c.closePath();c.fillStyle=mbMixG(conc);c.fill();pen(c,1.8);c.stroke();
  GX.slice(0,5).forEach((q,i)=>{const s2=Math.min(1,Math.max(0,(g-q[4]*0.6)/5))*q[3]*dr*0.2;xtal(c,px+q[0]*dr*0.9,py-8-Math.abs(q[1])*dr*0.3,s2,q[2]);});
  // water leaving the drop as vapor, and settling in the reservoir
  if(t!==null){const rate=Math.exp(-day/2);VAP.forEach((v,i)=>{if(v[2]>rate*1.05)return;const u=(t*0.18*(0.6+v[1])+v[0])%1,sd=i%2?1:-1,x=px+sd*(dr*0.8+u*(ww*0.5-wall-dr)*0.9),y=py-10-Math.sin(u*Math.PI)*wh*0.2+u*(wy+wh*0.66-py);
      c.beginPath();c.arc(x,y,2.2,0,7);c.fillStyle='rgba(47,109,181,'+(0.75*(1-u*0.6)).toFixed(2)+')';c.fill();});}
  txt(c,'seal',wx+ww-4,wy-(narrow?9:11),fs-1,'right',GMUT);tag(c,narrow?'drop':'drop: protein solution and recipe',px,py-10-dr*0.62-(narrow?12:14),'center',fs-1);
  tag(c,narrow?'reservoir':'reservoir: the recipe alone',wx+ww*0.5,wy+wh*0.84,'center',fs-1);
  // the view down the microscope
  const R=narrow?Math.min(w*0.3,(h-top)*0.24):Math.min(w*0.19,(h-top)*0.4),mx=narrow?w*0.5:w*0.76,my=narrow?wy+wh+R+(narrow?26:0):top+(h-top)*0.5;
  disc(c,mx,my,R+6,'#3b4046',2);disc(c,mx,my,R,mbMixG(conc),2);
  c.save();c.beginPath();c.arc(mx,my,R-1,0,7);c.clip();GX.forEach(q=>{const s2=Math.min(1,Math.max(0,(g-q[4])/5))*q[3]*R*0.2;xtal(c,mx+q[0]*R,my+q[1]*R,s2,q[2]);});c.restore();
  txt(c,narrow?'through the microscope':'the drop through a microscope',mx,my-R-(narrow?14:18),fs-1,'center',GMUT);
  if(!narrow){line(c,px+dr,py-8,mx-R-6,my-R*0.5,1.2,INK,[4,4]);line(c,px+dr,py-4,mx-R-6,my+R*0.5,1.2,INK,[4,4]);}
  return {V,conc,g};}
const mbMixG=conc=>{const k=Math.max(0,Math.min(1,conc-1)),A=[226,238,248],B=[176,206,236];return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')';};

// ---------- opening figure: ten days in a drop, again and again ----------
if($('growHeroCv')){
fig('growHeroCv',w=>w<560?0.8:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,u=t%16,day=u<1?0:u<13?(u-1)/12*10:10;
  const S=dropScene(c,w,h,day,narrow,fs,t,narrow?26:30);
  cap(c,'day '+Math.floor(day)+(S.g<=0?': the drop is clear':S.g<2?': the first crystals':': the crystals grow'),narrow?8:12,narrow?15:19,'left',fs);
});
}

// ---------- stop 1: dissolved, a clump, a crystal ----------
if($('gOrderCv')){
const N=24,r0=rng(31),ST=[[],[],[]];
// myoglobin, drawn once at the size needed and then stamped, turned, for each molecule
let SPR=null,SPK=0;function mbSprite(u){const k=Math.round(u);if(SPR&&SPK===k)return SPR;const d=Math.min(window.devicePixelRatio||1,2),S=Math.ceil(k*1.2);SPR=document.createElement('canvas');SPR.width=SPR.height=S*d;const g=SPR.getContext('2d');g.setTransform(d,0,0,d,0,0);drawMb(g,S/2,S/2+k*0.03,k*0.96/46);SPR.S=S;SPK=k;return SPR;}
function gmb(c,x,y,u,a,d=0){const s=mbSprite(u),k=1-0.13*d;c.save();c.globalAlpha=1-0.42*d;c.translate(x,y);c.rotate(a);c.drawImage(s,-s.S/2*k,-s.S/2*k,s.S*k,s.S*k);c.restore();}
// the crystal: 4 across, 3 down and 2 layers deep, drawn at a slant so that the layer behind shows. Each entry: x, y, angle, depth (0 front, 1 back)
const LX=1.04,OBX=0.5,OBY=-0.46;
for(let i=0;i<N;i++){ST[0].push([(r0()-0.5)*8.2,(r0()-0.5)*4.4,r0()*6.28,0]);{const z=Math.floor(i/12),k=i%12;ST[2].push([(k%4-1.5)*LX+(z-0.5)*OBX,(Math.floor(k/4)-1)*LX+(z-0.5)*OBY,0,z]);}}
// dissolved: nudged apart so that no two overlap
for(let k=0;k<200;k++)for(let i=0;i<N;i++){const p=ST[0][i];p[0]=Math.max(-4.1,Math.min(4.1,p[0]));p[1]=Math.max(-2.1,Math.min(2.1,p[1]));for(let m=0;m<i;m++){const q=ST[0][m],dx=p[0]-q[0],dy=p[1]-q[1],d=Math.hypot(dx,dy)||0.01;if(d<1.3){const s=(1.3-d)/2;p[0]+=dx/d*s;p[1]+=dy/d*s;q[0]-=dx/d*s;q[1]-=dy/d*s;}}}
// the clump: the molecules pushed together anyhow, touching but not in line
{const P=[];for(let i=0;i<N;i++)P.push([(r0()-0.5)*4,(r0()-0.5)*3]);for(let k=0;k<400;k++){for(let i=0;i<N;i++){P[i][0]*=0.985;P[i][1]*=0.985;for(let j=0;j<i;j++){const dx=P[i][0]-P[j][0],dy=P[i][1]-P[j][1],d=Math.hypot(dx,dy)||0.01;if(d<1.02){const m=(1.02-d)/2;P[i][0]+=dx/d*m;P[i][1]+=dy/d*m;P[j][0]-=dx/d*m;P[j][1]-=dy/d*m;}}}}
  P.forEach(p=>ST[1].push([p[0],p[1],r0()*6.28,0]));}
const SPG=mkSpots(8,1.4);
let TO=0,FROM=ST[0].map(p=>p.slice()),CUR=ST[0].map(p=>p.slice()),T0=-9,TN=0,WAS=0;
const F=fig('gOrderCv',w=>w<560?0.78:2.4,f=>{const {ctx:c,w,h,t}=f;TN=t;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,e=playing?smg((t-T0)/1.8):1;
  const bx=narrow?w*0.04:w*0.04,by=narrow?40:h*0.16,bw=narrow?w*0.92:w*0.56,bh=narrow?h*0.46:h*0.74,u=Math.min(bw/9.6,bh/5.6),cx=bx+bw/2,cy=by+bh/2;
  rectF(c,bx,by,bw,bh,'#e6f0f8',2.4);
  CUR=ST[TO].map((p,i)=>{const q=FROM[i],jig=TO===0&&playing?1:0;return [q[0]+(p[0]-q[0])*e+jig*0.12*Math.sin(t*0.9+i*1.7),q[1]+(p[1]-q[1])*e+jig*0.12*Math.cos(t*0.8+i*2.3),q[2]+(p[2]-q[2])*e+jig*0.25*Math.sin(t*0.6+i),q[3]+(p[3]-q[3])*e];});
  // the outline of the block of crystal, behind the molecules
  {const kc=TO===2?e:WAS===2?1-e:0;if(kc>0.02){const hx=1.5*LX+0.56,hy=LX+0.56,F0=[[-hx,-hy],[hx,-hy],[hx,hy],[-hx,hy]],Q=z=>F0.map(([x,y])=>[cx+(x+(z-0.5)*OBX)*u,cy+(y+(z-0.5)*OBY)*u]),A=Q(0),Bk=Q(1);c.save();c.globalAlpha=kc*0.7;
      const ring=P=>{c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();};pen(c,1.4,GMUT);c.setLineDash([5,5]);ring(Bk);A.forEach((p,i)=>{c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(Bk[i][0],Bk[i][1]);c.stroke();});ring(A);c.setLineDash([]);c.restore();}}
  CUR.slice().sort((a,b)=>b[3]-a[3]).forEach(p=>gmb(c,cx+p[0]*u,cy+p[1]*u,u,p[2],p[3]));
  txt(c,narrow?'myoglobin in solution':'molecules of myoglobin in solution, much enlarged',bx+bw/2,by-(narrow?11:13),fs-1,'center',GMUT);
  // what X-rays would show: a blur for molecules that are not in order, sharp spots for a crystal
  const S=narrow?Math.min(w*0.42,h*0.3):Math.min(w*0.26,h*0.66),sx=narrow?w/2:w*0.81,sy=narrow?by+bh+S/2+34:h*0.53,k=TO===2?e:WAS===2?1-e:0;
  rectF(c,sx-S/2,sy-S/2,S,S,WHITE,2.4);
  if(k<1){const g=c.createRadialGradient(sx,sy,S*0.04,sx,sy,S*0.46);g.addColorStop(0,'rgba(27,27,27,'+(0.3*(1-k)).toFixed(2)+')');g.addColorStop(0.5,'rgba(27,27,27,'+(0.13*(1-k)).toFixed(2)+')');g.addColorStop(1,'rgba(27,27,27,0)');c.fillStyle=g;c.fillRect(sx-S/2+2,sy-S/2+2,S-4,S-4);}
  if(k>0)SPG.forEach(s=>{c.fillStyle='rgba(27,27,27,'+(Math.min(1,0.35+s.s)*k).toFixed(2)+')';c.beginPath();c.arc(sx+s.x*S/2*0.95,sy+s.y*S/2*0.95,(0.8+1.9*s.s)*Math.max(0.7,S/260),0,7);c.fill();});
  disc(c,sx,sy,Math.max(3,S*0.02),GREY,1.4);txt(c,narrow?'what X-rays show':'what X-rays would show',sx,sy-S/2-(narrow?11:13),fs-1,'center',GMUT);
  if(!narrow)arrow(c,bx+bw+10,sy,sx-S/2-10,sy,INK,2.4,8);
});
const SAY=[['spread out, each turned its own way','a blur'],['stuck together, each turned its own way','a blur'],['in rows, all turned the same way','sharp spots']];
choice('gO',x=>{FROM=CUR.map(p=>p.slice());WAS=TO;TO=+x;T0=TN;setT('gOm',SAY[TO][0]);setT('gOx',SAY[TO][1]);F.w&&F.draw(F);});
}

// ---------- stop 2: the drop dries slowly, and crystals appear ----------
if($('gDropCv')){
let DAY=0;
const F=fig('gDropCv',w=>w<560?0.8:2.4,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;dropScene(c,w,h,DAY,narrow,fs,t,narrow?20:22);});
bind('gT',v=>'day '+v.toFixed(1),()=>{DAY=+$('gT').value;const V=DROPV(DAY),g=DAY-NUC;setT('gTv',Math.round(V*100)+'% of its first size');setT('gTc',g<=0?(DAY<0.05?'as crowded as when the drop was set up':(1/V).toFixed(1)+' times as crowded as at the start'):'falling: the crystals are taking it up');
  setT('gTs',g<=0?'nothing to see yet':g<1.5?'the first tiny crystals':g<5?'crystals, still growing':'crystals, fully grown');F.w&&F.draw(F);});
}

// ---------- stop 3: a plate of 96 recipes ----------
if($('gScreenCv')){
// what each well holds: 0 clear, 1 a cloudy solid, 2 a shower of tiny crystals, 3 crystals worth measuring
const R1=rng(77),A=[];for(let i=0;i<96;i++){const v=R1();A.push(v<0.56?0:v<0.92?1:2);}[17,52,78].forEach(i=>A[i]=3);
const B=[];for(let j=0;j<8;j++)for(let i=0;i<12;i++){const ac=(i-5.5)/5.5,salt=(3.5-j)/3.5,d=Math.abs(ac-0.15);B.push(salt>0.62?1:salt<-0.6?0:d<0.42&&Math.abs(salt)<0.45?3:d<0.75&&salt>-0.6?2:salt>0.2?1:0);}
const SEED=(()=>{const r=rng(3),S=[];for(let i=0;i<96;i++){const q=[];for(let k=0;k<14;k++)q.push([r()*2-1,r()*2-1,r()*3.1]);S.push(q);}return S;})();
let MODE=0;
function well(c,x,y,r,v,sd){disc(c,x,y,r,v===1?'#ece4d6':'#e3eef7',1.2);const rr=r*0.78;
  if(v===1)sd.forEach(q=>{if(Math.hypot(q[0],q[1])>1)return;c.beginPath();c.arc(x+q[0]*rr,y+q[1]*rr,Math.max(0.9,r*0.11),0,7);c.fillStyle='#8a6a48';c.fill();});
  if(v===2)sd.forEach(q=>{if(Math.hypot(q[0],q[1])>1)return;line(c,x+q[0]*rr-Math.cos(q[2])*r*0.13,y+q[1]*rr-Math.sin(q[2])*r*0.13,x+q[0]*rr+Math.cos(q[2])*r*0.13,y+q[1]*rr+Math.sin(q[2])*r*0.13,1.1,'#3f7d50');});
  if(v===3)sd.slice(0,3).forEach((q,i)=>xtal(c,x+q[0]*rr*0.5,y+q[1]*rr*0.5,r*(0.42-0.08*i),q[2]));}
const F=fig('gScreenCv',w=>w<560?0.86:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,D=MODE?B:A;
  const px=narrow?w*0.12:w*0.12,pw=narrow?w*0.83:w*0.46,py=narrow?44:h*0.15,ph=pw*8/12,sp=pw/12,r=sp*0.42;
  c.beginPath();c.roundRect(px-sp*0.3,py-sp*0.3,pw+sp*0.6,ph+sp*0.6,sp*0.4);c.fillStyle='#f6f8fa';c.fill();pen(c,2.2);c.stroke();
  for(let j=0;j<8;j++)for(let i=0;i<12;i++){const x=px+(i+0.5)*sp,y=py+(j+0.5)*sp;if(D[j*12+i]===3)disc(c,x,y,r+sp*0.085,YEL,1.6);well(c,x,y,r,D[j*12+i],SEED[j*12+i]);}
  if(MODE){arrow(c,px,py+ph+sp*0.75,px+pw,py+ph+sp*0.75,INK,2,7);txt(c,narrow?'less acid →':'from more acid to less acid',px+pw/2,py+ph+sp*0.75+(narrow?12:14),fs-1,'center');
    arrow(c,px-sp*0.75,py+ph,px-sp*0.75,py,INK,2,7);c.save();c.translate(px-sp*0.75-(narrow?9:12),py+ph/2);c.rotate(-Math.PI/2);txt(c,'more precipitant',0,0,fs-1,'center');c.restore();}
  // the key
  const K=[[0,'clear'],[1,narrow?'precipitate':'a cloudy solid: precipitate'],[2,narrow?'tiny crystals':'a shower of tiny crystals'],[3,narrow?'crystals':'crystals worth measuring']],kr=narrow?9:13;
  if(narrow){K.forEach(([v,s2],i)=>{const x=w*0.06+(i%2)*w*0.47,y=py+ph+sp*0.9+(MODE?30:8)+Math.floor(i/2)*(kr*2+8)+kr;if(v===3)disc(c,x+kr,y,kr+2.5,YEL,1.4);well(c,x+kr,y,kr,v,SEED[40+i]);txt(c,s2,x+kr*2+7,y,fs-1,'left');});}
  else K.forEach(([v,s2],i)=>{const x=w*0.75,y=h*0.2+i*(kr*2+14);if(v===3)disc(c,x+kr,y,kr+3,YEL,1.6);well(c,x+kr,y,kr,v,SEED[40+i]);txt(c,s2,x+kr*2+9,y,fs-1,'left');});
  cap(c,MODE?(narrow?'96 small changes':'96 small changes to the best recipe'):(narrow?'96 recipes':'96 different recipes, one in each well'),narrow?8:12,narrow?15:19,'left',fs);
},false);
choice('gS',x=>{MODE=+x;const D=MODE?B:A,n=D.filter(v=>v===3).length;setT('gSn',n+' of 96');setT('gSw',MODE?'only the acidity and the amount of precipitant':'everything: the precipitant, the salt, the acidity');F.w&&F.draw(F);});
}

// ---------- stop 4: out of the drop, into the cold, into a puck ----------
if($('gShipCv')){
let MODE=0;
const pin=(c,x,y,L,lr,a)=>{const ux=Math.cos(a),uy=Math.sin(a);line(c,x+ux*lr,y+uy*lr,x+ux*(lr+L),y+uy*(lr+L),Math.max(2,lr*0.22),'#6b7780');pen(c,Math.max(1.6,lr*0.16),'#3b4046');c.beginPath();c.ellipse(x,y,lr,lr*0.72,a,0,7);c.stroke();};
const F=fig('gShipCv',w=>w<560?0.95:2.4,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,cx=w/2,cy=h*0.5,R=Math.min(w*0.38,h*0.33),u=(t%6)/6;
  if(MODE===0){disc(c,cx,cy,R+6,'#3b4046',2);disc(c,cx,cy,R,'#cfe0f0',2);c.save();c.beginPath();c.arc(cx,cy,R-1,0,7);c.clip();
    [[-0.5,0.35,0.5,0.2],[0.15,-0.5,2.1,0.16],[0.55,0.45,1.2,0.13]].forEach(q=>xtal(c,cx+q[0]*R,cy+q[1]*R,q[3]*R,q[2]));
    const X0=cx-R*0.05,ly=cy-R*0.1,lx=u<0.5?cx+R*1.5-R*1.55*smg(u/0.5):X0+R*1.55*smg((u-0.58)/0.42);xtal(c,u<0.58?X0:lx,ly,R*0.2,0.3);pin(c,lx,ly,R*2.4,R*0.3,0);c.restore();
    const sb=R*0.4;line(c,cx-R,cy+R+(narrow?16:20),cx-R+sb,cy+R+(narrow?16:20),3);txt(c,'0.1 mm',cx-R+sb+8,cy+R+(narrow?16:20),fs-1,'left');
    cap(c,narrow?'a loop lifts the crystal':'a small loop lifts one crystal out of the drop',narrow?8:12,narrow?15:19,'left',fs);}
  if(MODE===1){const dw=Math.min(w*0.34,h*0.6),dh=h*0.56,dx=cx-dw/2,dy=h*0.36;c.fillStyle='#d6e9f7';c.fillRect(dx+8,dy+dh*0.22,dw-16,dh*0.78-8);
    pen(c,10,'#9aa7b3');c.lineCap='round';c.beginPath();c.moveTo(dx,dy);c.lineTo(dx,dy+dh);c.lineTo(dx+dw,dy+dh);c.lineTo(dx+dw,dy);c.stroke();
    pen(c,2,BLUE);c.beginPath();for(let i=0;i<=20;i++){const x=dx+8+(dw-16)*i/20,y=dy+dh*0.22+2.5*Math.sin(i*1.3+t*2.4);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
    for(let i=0;i<5;i++){const q=(t*0.25+i*0.2)%1;c.beginPath();c.arc(dx+dw*(0.2+0.15*i),dy+dh*0.2-q*h*0.2,5+6*q,0,7);c.fillStyle='rgba(255,255,255,'+(0.5*(1-q)).toFixed(2)+')';c.fill();}
    const k=smg(u*2.2),py=h*0.1+k*(dy+dh*0.55-h*0.1),lr=Math.max(7,dw*0.07);pin(c,cx,py,h*0.5,lr,-Math.PI/2);xtal(c,cx,py,lr*0.55,0.3);
    tag(c,narrow?'liquid nitrogen':'liquid nitrogen, 196 degrees below zero',cx,dy+dh*0.8,'center',fs-1);
    cap(c,narrow?'plunged into the cold':'plunged into liquid nitrogen, so fast that no ice forms',narrow?8:12,narrow?15:19,'left',fs);}
  if(MODE===2){const pr=Math.min(w*(narrow?0.34:0.17),h*0.36),px=narrow?cx:w*0.32,py=narrow?h*0.42:cy;disc(c,px,py,pr,'#b9c2c9',2.4);disc(c,px,py,pr*0.12,'#8d979e',1.4);
    const H=[];for(let i=0;i<5;i++)H.push([0.42,i*2*Math.PI/5-Math.PI/2]);for(let i=0;i<11;i++)H.push([0.78,i*2*Math.PI/11-Math.PI/2]);
    H.forEach(([q,a],i)=>{const x=px+q*pr*Math.cos(a),y=py+q*pr*Math.sin(a),full=i%7!==3;disc(c,x,y,pr*0.105,full?'#3b4046':'#eef2f5',1.4);if(full)disc(c,x,y,pr*0.045,XT,0.8);});
    txt(c,'a puck: 16 places',px,py+pr+(narrow?14:18),fs-1,'center',GMUT);
    if(!narrow){const bx=w*0.62,bw=w*0.2,bh=h*0.62,by=h*0.22,pw2=bw*0.3,ph2=pw2/3,n=7,sx0=bx+bw/2-pw2/2,sy0=by+bh-18-n*(ph2+3);arrow(c,px+pr+14,py,bx-14,py,INK,2.4,8);
      // an insulated container: thick walls, and a narrow space down the middle that holds a stack of pucks
      c.beginPath();c.roundRect(bx,by,bw,bh,14);c.fillStyle='#dfe7ee';c.fill();pen(c,2.4);c.stroke();rectF(c,bx+bw/2-pw2*0.8,by-12,pw2*1.6,14,'#9aa7b3',2);
      rectF(c,sx0-5,by+10,pw2+10,bh-22,'#f4f7f9',1.4);
      for(let i=0;i<n;i++){const y=sy0+i*(ph2+3);rectF(c,sx0,y,pw2,ph2,'#b9c2c9',1.4);}
      line(c,sx0+pw2+8,sy0+ph2/2,bx+bw+10,sy0+ph2/2,1.2,INK);txt(c,'a stack',bx+bw+14,sy0+ph2/2-(fs-1)*0.55,fs-1,'left',GMUT);txt(c,'of pucks',bx+bw+14,sy0+ph2/2+(fs-1)*0.6,fs-1,'left',GMUT);
      txt(c,'a shipping container,',bx+bw/2,by+bh+16,fs-1,'center',GMUT);txt(c,'kept cold all the way',bx+bw/2,by+bh+16+fs+2,fs-1,'center',GMUT);}
    cap(c,narrow?'packed in a puck':'packed in a puck, and sent to the beamline',narrow?8:12,narrow?15:19,'left',fs);}
});
const SAY=[['one crystal, on a loop a fraction of a millimeter across','about a tenth of a millimeter, often less'],['frozen as a glass in a fraction of a second','196 degrees below zero'],['16 crystals to a puck, 7 pucks to a stack','112 crystals in one stack']];
choice('gH',x=>{MODE=+x;F.t=0;setT('gHa',SAY[MODE][0]);setT('gHb',SAY[MODE][1]);F.w&&F.draw(F);});
}
capK();
})();
