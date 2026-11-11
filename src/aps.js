// ---------- the APS guide: shared numbers ----------
const CIRC=1103.609, TREV=CIRC/299.792458, HN=1296, TBK=TREV*1000/HN, ITOT=200, U0=2.935, VRF=4.5;
// fill patterns: bunches, projected lifetime in hours (the 162-bunch value is a guess between the other two)
// fill patterns: bunches, stored current in mA, lifetime in hours. 216 and 48 are the patterns in use (late 2026); their lifetimes here are guesses. 324 is the design pattern.
const MODES={216:{nb:216,I:200,life:6.5,guess:true,name:'216 bunches at 200 mA (normal mode)'},48:{nb:48,I:150,life:4,guess:true,name:'48 bunches at 150 mA (timing mode)'},324:{nb:324,I:200,life:7.5,name:'324 bunches at 200 mA (design)'}};
let MD=MODES[216];
const fresh=m=>qb(m.I,m.nb)*1.054;                // charge of a fresh bunch, swapped once the old one has lost a tenth
const hooks=[], setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
const qb=(I,nb)=>I*TREV/nb;                         // charge per bunch in nC, for I in mA
const sp=nb=>TBK*HN/nb;                             // bunch spacing in ns
const cm=x=>Math.round(x).toLocaleString('en-US');
function tag(c,s,x,y,align='left',size=15,col=INK){c.font=`${size}px ${HAND}`;const tw=c.measureText(s).width,pw=tw+10,ph=size+6,x0=align==='center'?x-pw/2:align==='right'?x-pw:x;
  c.fillStyle=WHITE;c.fillRect(x0,y-ph/2,pw,ph);pen(c,1.6);c.strokeRect(x0,y-ph/2,pw,ph);c.fillStyle=col;c.textAlign='left';c.textBaseline='middle';c.fillText(s,x0+5,y+1);}
function rng(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
const big=x=>x<1e6?cm(x):x<1e9?(x/1e6).toFixed(x<1e7?1:0)+' million':x<1e12?(x/1e9).toFixed(x<1e10?1:0)+' billion':x<1e15?(x/1e12).toFixed(x<1e13?1:0)+' trillion':x<1e18?(x/1e15).toFixed(0)+' thousand trillion':(x/1e18).toFixed(0)+' million trillion';
function ringShape(c,cx,cy,R,wd){pen(c,wd,WHITE);c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();pen(c,2);c.beginPath();c.arc(cx,cy,R+wd/2,0,7);c.stroke();c.beginPath();c.arc(cx,cy,R-wd/2,0,7);c.stroke();}

// ---------- THE SITE (opening figure): the injector sits inside the storage ring ----------
if($('chainCv')){
fig('chainCv',w=>w<560?0.92:1.75,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?11:14;
  const R=nr?Math.min(w*0.39,h*0.4):h*0.43, cx=nr?w*0.5:w*0.5, cy=nr?h*0.52:h*0.5, X=u=>cx+u*R, Y=v=>cy+v*R;
  // positions in units of the ring radius, y downward. The arrangement follows Argonne's own site drawing; sizes are approximate.
  const wS=nr?7:10, wB=nr?5:7, ai=80*Math.PI/180, rb=0.36, dB=1-rb-(wS+wB)/2/R, Bc=[dB*Math.cos(ai),dB*Math.sin(ai)], ao=ai;   // the booster touches the ring from inside, where it injects
  const L0=[-0.76,0.4], Pc=[-0.36,0.29], rp=0.05, Bi=[Bc[0]+rb*Math.cos(-110*Math.PI/180),Bc[1]+rb*Math.sin(-110*Math.PI/180)];
  const Si=[Math.cos(ai),Math.sin(ai)], Pl=[Pc[0]-rp,Pc[1]+0.012], Pr=[Pc[0]+rp,Pc[1]-0.004];
  // beamlines leave along the direction of travel
  for(let i=0;i<40;i++){if(i%8===3)continue;const a=i/40*2*Math.PI+0.05, x0=X(1.035*Math.cos(a)), y0=Y(1.035*Math.sin(a));line(c,x0,y0,x0+R*0.13*(-Math.sin(a)+0.25*Math.cos(a)),y0+R*0.13*(Math.cos(a)+0.25*Math.sin(a)),nr?1.2:1.6,STEEL);}
  ringShape(c,cx,cy,R,wS);
  // linac, accumulator ring, booster and the lines between them
  const nc=nr?6:8, dx=(Pl[0]-L0[0])/nc, dy=(Pl[1]-L0[1])/nc, ang=Math.atan2(dy,dx), cl=Math.hypot(dx,dy)*R;
  for(let i=0;i<nc;i++){c.save();c.translate(X(L0[0]+(i+0.5)*dx),Y(L0[1]+(i+0.5)*dy));c.rotate(ang);rectF(c,-cl/2,-(nr?4:6),cl,nr?8:12,LTORG,1.5);c.restore();}
  c.save();c.translate(X(L0[0]),Y(L0[1]));c.rotate(ang);rectF(c,-(nr?9:13),-(nr?5:7),nr?9:13,nr?10:14,GREY,1.6);c.restore();
  line(c,X(Pr[0]),Y(Pr[1]),X(Bi[0]),Y(Bi[1]),2);
  ringShape(c,X(Pc[0]),Y(Pc[1]),rp*R,nr?3.5:5);ringShape(c,X(Bc[0]),Y(Bc[1]),rb*R,wB);
  // the stored bunches, going around clockwise. A bunch keeps one speed along the transfer line, around the booster and on into the ring.
  const nb=MD.nb, T=13, tt=t%T, d=2*Math.PI/nb, br=nb>200?(nr?1.2:1.7):nb>100?(nr?1.7:2.3):(nr?2.6:3.6);
  const a0=-110*Math.PI/180, dA=4*Math.PI+((ao-a0)+2*Math.PI)%(2*Math.PI), stp=Math.round(1.1*T/d), om=stp*d/T, wb=om/rb;
  const t1=3.6, t2=t1+Math.hypot(Bi[0]-Pr[0],Bi[1]-Pr[1])/om, ta=t2+dA/wb, slot=((-Math.floor(t/T)*stp)%nb+nb)%nb;
  for(let i=0;i<nb;i++){const a=ai+i*d+om*(t-ta), me=i===slot, worn=me&&tt<ta&&tt>ta-2.6, fr=me&&tt>=ta;if(me&&tt<ta&&tt>ta-0.03)continue;
    const rr=fr?1-(wS+wB)/2/R*Math.max(0,1-(tt-ta)/0.5):1;   // the fresh bunch eases outward from the booster's track onto the ring's
    c.beginPath();c.arc(X(rr*Math.cos(a)),Y(rr*Math.sin(a)),fr?(nr?3.2:4.4):br,0,7);c.fillStyle=worn?GREY:YEL;c.fill();if(nb<=162||me){pen(c,1.1);c.stroke();}
    if(fr){c.globalAlpha=Math.max(0,1-(tt-ta)/3);pen(c,3,GRN);c.beginPath();c.arc(X(rr*Math.cos(a)),Y(rr*Math.sin(a)),nr?7:10,0,7);c.stroke();c.globalAlpha=1;}}
  const dot=(p,r,col)=>disc(c,X(p[0]),Y(p[1]),r,col||YEL,1.3), mix=(p,q,u)=>[p[0]+u*(q[0]-p[0]),p[1]+u*(q[1]-p[1])];
  // the worn bunch that was in that place is kicked out as the fresh one arrives
  if(tt>=ta&&tt<ta+0.7){const dt=tt-ta;c.globalAlpha=1-dt/0.7;dot([Si[0]-Math.sin(ai)*om*dt+Math.cos(ai)*0.35*dt,Si[1]+Math.cos(ai)*om*dt+Math.sin(ai)*0.35*dt],br+0.6,GREY);c.globalAlpha=1;}
  // 1: bursts down the linac into the accumulator ring
  let q=0;for(let k=0;k<3;k++){const u=(tt-k*0.8)/1.2;if(u>0&&u<1)dot(mix(L0,Pl,u),nr?2:2.8);if(u>=1)q++;}
  if(tt<t1&&q>0){const a=Math.PI+tt*7;dot([Pc[0]+rp*Math.cos(a),Pc[1]+rp*Math.sin(a)],(nr?1.5:2)+q*(nr?0.5:0.8));}
  // 2: across to the booster, where the energy climbs, and 3: straight on into the storage ring
  if(tt>=t1&&tt<t2)dot(mix(Pr,Bi,(tt-t1)/(t2-t1)),nr?3.2:4.4);
  if(tt>=t2&&tt<ta){const u=(tt-t2)/(ta-t2), a=a0+wb*(tt-t2), E=0.425+(6-0.425)*(1-Math.cos(Math.PI*u))/2;
    dot([Bc[0]+rb*Math.cos(a),Bc[1]+rb*Math.sin(a)],nr?3.2:4.4);tag(c,E<1?(E*1000).toFixed(0)+' MeV':E.toFixed(1)+' GeV',X(Bc[0]),Y(Bc[1])+(nr?18:24),'center',fs);}
  // captions
  cap(c,'storage ring',cx,Y(-0.62),'center',fs+1);txt(c,'6 GeV, '+nb+' bunches, 1.1 km around',cx,Y(-0.62)+(nr?20:26),fs,'center');
  cap(c,'linac',X(-0.58),Y(0.56),'center',fs);cap(c,'accumulator ring',X(-0.22),Y(0.08),'center',fs);line(c,X(-0.3),Y(0.08)+(nr?10:13),X(Pc[0]),Y(Pc[1]-rp)-2,1.4);
  cap(c,'booster',X(Bc[0]),Y(Bc[1])-(nr?6:8),'center',fs);
  const ip=[X(Si[0]*1.04),Y(Si[1]*1.04)], il=nr?[X(0.62),Y(1.06)]:[X(0.62),Y(1.0)];line(c,ip[0],ip[1],il[0]-(nr?30:42),il[1],1.4);cap(c,'injection',il[0],il[1],'center',fs);
  if(!nr){txt(c,'← beamlines',X(1.2),Y(-0.2),fs,'left');cap(c,'Seen from above',12,18,'left',15);}
});
}

// ---------- LINAC: riding the wave ----------
if($('linCv')){
let lnP=0;
const linFig=fig('linCv',w=>w<560?1.15:2.4,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const x0=w*0.1,x1=w*0.95,yc=h*0.34,ch=h*0.3,n=nr?9:14,pw=(x1-x0)/n,lam=pw*3,k=2*Math.PI/lam,A=ch*0.36,ph=lnP*Math.PI/180;
  rectF(c,x0-(nr?20:30),yc-12,nr?20:30,24,GREY,2);txt(c,'gun',x0-(nr?10:15),yc-24,fs-1,'center');
  for(let i=0;i<n;i++){rectF(c,x0+i*pw,yc-ch/2,pw,ch,LTORG,2);}
  line(c,x0,yc,x1,yc,1,GREY);
  const u=(t*0.16)%1, xb=x0+u*(x1-x0), g=Math.cos(ph);
  // the wave keeps step with the bunch: the bunch always sees the same part of it
  pen(c,2.4,BLUE);c.beginPath();for(let x=x0;x<=x1;x+=2){const y=yc-A*Math.cos(k*(x-xb)+ph);x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  const yb=yc-A*g;line(c,xb,yc,xb,yb,1.4,INK,[3,3]);
  if(Math.abs(g)>0.06)fatArrow(c,xb+(g>0?12:-12),yb,xb+(g>0?12:-12)+g*(nr?34:52),yb,ORG,6);
  electron(c,xb,yb,nr?6:8);
  cap(c,'The wave and the bunch travel together',12,18,'left',nr?12:15);
  // energy gained so far
  const py0=h*0.62,py1=h*0.88, Ef=425*g, Y=v=>py1-(py1-py0)*Math.max(-0.15,Math.min(1,v/425));
  rectF(c,x0,py0,x1-x0,py1-py0,WHITE,2.5);
  [0,200,400].forEach(v=>{line(c,x0,Y(v),x1,Y(v),1,GREY);txt(c,String(v),x0-6,Y(v),fs-1,'right');});
  txt(c,'energy (MeV)',x0+6,py0+12,fs-1,'left');txt(c,'distance along the linac →',x1-6,py1+14,fs-1,'right');
  c.save();c.beginPath();c.rect(x0+1.5,py0+1.5,x1-x0-3,py1-py0-3);c.clip();
  line(c,x0,Y(0),x1,Y(Ef),1.6,GREY,[4,4]);line(c,x0,Y(0),xb,Y(Ef*u),3,ORG);c.restore();
  disc(c,xb,Y(Ef*u),nr?5:6,YEL,2);
  tag(c,Math.round(Ef*u)+' MeV',xb+(u>0.8?-10:10),Y(Ef*u)-(nr?16:20),u>0.8?'right':'left',fs);
});
function lnUpd(){lnP=+$('lnPh').value;const g=Math.cos(lnP*Math.PI/180),E=425*g,gam=1+Math.max(E,0)/0.51099895;
  $('lnPhO').textContent=lnP===0?'on the crest':Math.abs(lnP)+'° '+(lnP>0?'ahead of':'behind')+' the crest';
  $('lnE').textContent=E.toFixed(0)+' MeV';$('lnG').textContent=cm(gam)+' times';
  const dv=299792458/(2*gam*gam);$('lnV').textContent=E>20?(dv<100?dv.toFixed(1):cm(dv))+' m/s':'–';linFig.w&&linFig.draw(linFig);}
$('lnPh').addEventListener('input',lnUpd);lnUpd();
}

// ---------- INJECTOR: one second, three lanes ----------
if($('injCv')){
let ijN=3;const TB0=1.0, TRAMP=0.25, TEND=1.3, BTURN=368/299.792458;   // booster: about 368 m around, ramp about a quarter second (both approximate)
const injFig=fig('injCv',w=>w<560?0.85:2.1,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const x0=w*(nr?0.14:0.09),x1=w*0.96,X=s=>x0+s/TEND*(x1-x0), top=64, gap=nr?26:30, lh=(h-top-34-2*gap)/3;
  const L=[top,top+lh+gap,top+2*(lh+gap)], now=(t*0.28)%1*TEND;
  // lane 1: bursts from the linac, thirty a second
  rectF(c,x0,L[0],x1-x0,lh,WHITE,2.5);txt(c,'bursts from the linac',x0+6,L[0]-10,fs,'left');
  for(let k=0;k<ijN;k++){const s=(k+0.5)/30;line(c,X(s),L[0]+lh*0.82,X(s),L[0]+lh*0.22,nr?2.4:3.2,s<=now?ORG:GREY);}
  // lane 2: charge collected in the accumulator
  rectF(c,x0,L[1],x1-x0,lh,WHITE,2.5);txt(c,'charge in the accumulator ring',x0+6,L[1]-10,fs,'left');
  c.fillStyle=LTBLUE;c.fillRect(X(0.77),L[1]+1.5,X(TB0)-X(0.77),lh-3);txt(c,'squeeze',(X(0.77)+X(TB0))/2,L[1]+lh-10,fs-1,'center');
  const Yq=v=>L[1]+lh-6-(lh-16)*v/20;
  pen(c,3,BLUE);c.beginPath();c.moveTo(x0,Yq(0));for(let k=0;k<ijN;k++){const s=(k+0.5)/30;c.lineTo(X(s),Yq(k));c.lineTo(X(s),Yq(k+1));}c.lineTo(X(TB0),Yq(ijN));c.lineTo(X(TB0),Yq(0));c.lineTo(x1,Yq(0));c.stroke();
  txt(c,'20 nC',x0-6,Yq(20),fs-1,'right');txt(c,'0',x0-6,Yq(0),fs-1,'right');
  // lane 3: energy in the booster
  rectF(c,x0,L[2],x1-x0,lh,WHITE,2.5);txt(c,'energy in the booster',x0+6,L[2]-10,fs,'left');
  const Ye=v=>L[2]+lh-6-(lh-16)*v/6, En=s=>s<TB0||s>TB0+TRAMP?null:0.425+(6-0.425)*(1-Math.cos(Math.PI*(s-TB0)/TRAMP))/2;
  pen(c,3,RED);c.beginPath();for(let s=TB0;s<=TB0+TRAMP+1e-6;s+=0.005){const y=Ye(En(Math.min(s,TB0+TRAMP)));s===TB0?c.moveTo(X(s),y):c.lineTo(X(s),y);}c.stroke();
  line(c,X(TB0+TRAMP),Ye(6),X(TB0+TRAMP),Ye(0),1.6,RED,[3,3]);
  txt(c,'6 GeV',x0-6,Ye(6),fs-1,'right');txt(c,'0',x0-6,Ye(0),fs-1,'right');
  txt(c,nr?'then to the storage ring →':'at 6 GeV the bunch goes to the storage ring →',X(TB0)-8,L[2]+14,fs-1,'right');
  // time axis and the moving marker
  for(let s=0;s<=TEND+1e-6;s+=0.25){line(c,X(s),L[2]+lh,X(s),L[2]+lh+5,1.6);txt(c,s.toFixed(2)+(s===0?' s':''),X(s),L[2]+lh+16,fs-1,'center');}
  line(c,X(now),L[0],X(now),L[2]+lh,1.8,INK,[2,4]);
  const kk=Math.min(ijN,Math.floor(now*30+0.5));if(now<TB0)disc(c,X(now),Yq(kk),nr?5:6,YEL,2);
  const e=En(now);if(e!==null){disc(c,X(now),Ye(e),nr?5:6,YEL,2);tag(c,e<1?(e*1000).toFixed(0)+' MeV':e.toFixed(1)+' GeV',X(now)-10,Ye(e)-4,'right',fs);}
  cap(c,'One second in the injector',12,18,'left',nr?12:15);
});
function ijUpd(){ijN=+$('ijN').value;$('ijNO').textContent=ijN+(ijN===1?' burst':' bursts');
  $('ijQ').textContent=ijN+' nC';$('ijE').textContent=(ijN*6.2415).toFixed(0)+' billion';
  const need=Object.values(MODES).filter(m=>ijN>=Math.ceil(fresh(m))).map(m=>m.nb).sort((a,b)=>b-a);
  $('ijF').textContent=need.length?'the '+(need.length>2?need.slice(0,-1).join('-, ')+'- and '+need[need.length-1]:need.join('- and '))+'-bunch pattern'+(need.length>1?'s':''):'none yet: too little charge';
  $('ijT').textContent='about '+cm(Math.round(TRAMP*1e6/BTURN/1000)*1000);injFig.w&&injFig.draw(injFig);}
$('ijN').addEventListener('input',ijUpd);
hooks.push(()=>{$('ijN').value=Math.ceil(fresh(MD));ijUpd();});
}

// ---------- QUADRUPOLES: alternate them and the beam is held ----------
if($('qdCv')){
let qK=1.0;const NQ=12, RAYS=[[0.3,0],[-0.3,0],[0.15,0.18],[-0.15,-0.18],[0,0.28],[0,-0.28],[0.22,-0.12]];
function qTrack(x,xp,K){const pts=[[0,x]];let lost=false;for(let i=0;i<NQ;i++){x+=xp*0.5;pts.push([i+0.5,x]);if(Math.abs(x)>1){lost=true;break;}xp+=(i%2?1:-1)*K*x;x+=xp*0.5;pts.push([i+1,x]);if(Math.abs(x)>1){lost=true;break;}}return {pts,lost};}
const qdFig=fig('qdCv',w=>w<560?1.2:2.5,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const x0=w*0.05,x1=w*0.95,ym=h*0.54,A=h*0.3,X=s=>x0+s/NQ*(x1-x0),Y=v=>ym-v*A;
  c.fillStyle=WHITE;c.fillRect(x0,ym-A,x1-x0,2*A);line(c,x0,ym-A,x1,ym-A,3);line(c,x0,ym+A,x1,ym+A,3);line(c,x0,ym,x1,ym,1,GREY);
  for(let i=0;i<NQ;i++){const xq=X(i+0.5),F=i%2===0,col=F?BLUE:RED,lw=nr?6:9;c.fillStyle=F?LTBLUE:LTRED;c.beginPath();
    if(F){c.ellipse(xq,ym,lw,A*0.92,0,0,7);}else{c.moveTo(xq-lw,ym-A*0.92);c.quadraticCurveTo(xq-lw*0.1,ym,xq-lw,ym+A*0.92);c.lineTo(xq+lw,ym+A*0.92);c.quadraticCurveTo(xq+lw*0.1,ym,xq+lw,ym-A*0.92);c.closePath();}
    c.fill();pen(c,1.8,col);c.stroke();if(!nr||i<2)txt(c,F?'F':'D',xq,ym-A-12,fs,'center',col);}
  let worst=0,anyLost=false;
  RAYS.forEach((r,ri)=>{const q=qTrack(r[0],r[1],qK);anyLost=anyLost||q.lost;pen(c,1.8,q.lost?RED:ORG);c.beginPath();q.pts.forEach((p,i)=>{worst=Math.max(worst,Math.min(1,Math.abs(p[1])));const yy=Y(Math.max(-1,Math.min(1,p[1])));i?c.lineTo(X(p[0]),yy):c.moveTo(X(p[0]),yy);});c.stroke();
    const last=q.pts[q.pts.length-1];if(q.lost){const yy=Y(Math.sign(last[1]));line(c,X(last[0])-6,yy-6,X(last[0])+6,yy+6,3,RED);line(c,X(last[0])-6,yy+6,X(last[0])+6,yy-6,3,RED);}
    // an electron moving along each path
    const s=((t*0.9+ri*0.37)%1)*last[0];let j=0;while(j<q.pts.length-2&&q.pts[j+1][0]<s)j++;const a=q.pts[j],b=q.pts[j+1],u=(s-a[0])/(b[0]-a[0]||1);disc(c,X(s),Y(Math.max(-1,Math.min(1,a[1]+u*(b[1]-a[1])))),nr?3:4,YEL,1.3);});
  qdFig.worst=worst;qdFig.lost=anyLost;
  txt(c,'wall of the vacuum pipe',x1,ym+A+14,fs-1,'right');tag(c,'ideal path',x0+4,ym,'left',fs-1);
  cap(c,'A stretch of the ring, straightened out',12,18,'left',nr?12:15);
},true);
function qdUpd(){qK=+$('qdK').value;$('qdKO').textContent=qK.toFixed(2);let worst=0,lost=false;RAYS.forEach(r=>{const q=qTrack(r[0],r[1],qK);lost=lost||q.lost;q.pts.forEach(p=>worst=Math.max(worst,Math.abs(p[1])));});
  $('qdS').textContent=lost?'lost: electrons hit the wall':'held';$('qdW').textContent=lost?'beyond the wall':(100*worst).toFixed(0)+'% of the way to the wall';
  $('qdF').textContent=qK<0.02?'none':(1/qK).toFixed(2)+' × the spacing';qdFig.w&&qdFig.draw(qdFig);}
$('qdK').addEventListener('input',qdUpd);qdUpd();
}

// ---------- EMITTANCE: more, gentler bends ----------
if($('emCv')){
let eN=7,eE=6;const emit=(N,E)=>42*(E/6)*(E/6)*Math.pow(7/N,3), BX=5.26, BY=2.38;
const emFig=fig('emCv',w=>w<560?0.62:2.1,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const A=nr?{x:w*0.04,y:40,w:w*0.92,h:h*0.44}:{x:w*0.03,y:40,w:w*0.4,h:h-62};
  const cy2=A.y+A.h+26, B=nr?{x:w*0.17,y:cy2+20,w:w*0.79,h:h-cy2-66}:{x:w*0.53,y:40,w:w*0.44,h:h-86};
  rectF(c,A.x,A.y,A.w,A.h,WHITE,2.5);
  // one sector, turning its corner with N bends (the turn is drawn four times too sharp so that it shows)
  const Ls=A.w*0.84, tot=36*Math.PI/180, d=Ls/(2*eN+1);let x=A.x+A.w*0.08,y=A.y+A.h*0.2,a=tot/2;const pts=[[x,y]];
  for(let i=0;i<eN;i++){x+=d*Math.cos(a);y-=d*Math.sin(a);pts.push([x,y]);const a2=a-tot/eN,am=(a+a2)/2;
    c.save();c.translate(x+d/2*Math.cos(am),y-d/2*Math.sin(am));c.rotate(-am);rectF(c,-d/2,-(nr?7:9),d,nr?14:18,i%2?LTBLUE:LTRED,1.6);c.restore();
    x+=d*Math.cos(am);y-=d*Math.sin(am);a=a2;pts.push([x,y]);}
  x+=d*Math.cos(a);y-=d*Math.sin(a);pts.push([x,y]);
  pen(c,2.2);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  txt(c,eN+' bends, each turning the beam '+(9/eN).toFixed(2)+'°',A.x+A.w/2,A.y+A.h*0.2+(nr?22:28),fs-1,'center');
  // the beam at an undulator, to scale
  const e=emit(eN,eE), sx=Math.sqrt(e*BX), sy=Math.sqrt(0.1*e*BY), by=A.y+A.h*0.62, bx=A.x+A.w*0.5, sc=Math.min(A.w*0.42/260,A.h*0.17/56);
  line(c,A.x,A.y+A.h*0.38,A.x+A.w,A.y+A.h*0.38,1.6,INK,[5,5]);
  txt(c,'The beam at an undulator, to scale',A.x+A.w*0.05,A.y+A.h*0.38+14,fs,'left');
  pen(c,1.4,GREY);c.setLineDash([4,4]);c.beginPath();c.arc(bx,by,35*sc,0,7);c.stroke();c.setLineDash([]);
  c.beginPath();c.ellipse(bx,by,Math.max(1.5,2*sx*sc),Math.max(1,2*sy*sc),0,0,7);c.fillStyle=YEL;c.fill();pen(c,2);c.stroke();
  txt(c,sx.toFixed(sx<100?1:0)+' µm wide, '+sy.toFixed(1)+' µm high (1σ; drawn to 2σ)',A.x+A.w/2,A.y+A.h-30,fs-1,'center');
  txt(c,'dashed circle: a human hair, 70 µm across',A.x+A.w/2,A.y+A.h-13,fs-2,'center');
  cap(c,'Bends in a sector, and the beam they give',12,18,'left',nr?12:15);
  // emittance against the number of bends
  rectF(c,B.x,B.y,B.w,B.h,WHITE,2.5);const lo=1,hi=4,X=n=>B.x+(n-1.5)/8*B.w,Y=v=>B.y+B.h-(Math.log10(Math.max(v,1))-lo)/(hi-lo)*B.h;
  [10,100,1000].forEach(v=>{line(c,B.x,Y(v),B.x+B.w,Y(v),1,GREY);txt(c,cm(v),B.x-6,Y(v),fs-1,'right');});txt(c,'pm',B.x-6,B.y+10,fs-1,'right');
  for(let n=2;n<=9;n++){line(c,X(n),B.y+B.h,X(n),B.y+B.h+5,1.6);txt(c,String(n),X(n),B.y+B.h+16,fs-1,'center');}
  txt(c,'bends in each sector',B.x+B.w/2,B.y+B.h+34,fs,'center');
  c.save();c.beginPath();c.rect(B.x+1.5,B.y+1.5,B.w-3,B.h-3);c.clip();pen(c,3,BLUE);c.beginPath();for(let n=1.6;n<=9.4;n+=0.1){const yy=Y(emit(n,eE));n===1.6?c.moveTo(X(n),yy):c.lineTo(X(n),yy);}c.stroke();c.restore();
  disc(c,X(7),Y(42),7,WHITE,2);txt(c,'the APS: 42 pm',X(7)-10,Y(42)+(nr?16:18),fs-1,'right');
  disc(c,X(eN),Y(e),6,ORG,2);tag(c,(e<100?e.toFixed(0):cm(Math.round(e/10)*10))+' pm',X(eN)+(eN>7?-12:12),Y(e)-18,eN>7?'right':'left',fs);
  cap(c,'Emittance, at '+eE.toFixed(1)+' GeV',nr?12:B.x,nr?cy2:18,'left',nr?12:15);
},false);
function emUpd(){eN=+$('emN').value;eE=+$('emE').value;$('emNO').textContent=eN;$('emEO').textContent=eE.toFixed(1)+' GeV';const e=emit(eN,eE);
  $('emV').textContent=(e<100?e.toFixed(0):cm(Math.round(e/10)*10))+' pm';$('emS').textContent=Math.sqrt(e*BX).toFixed(e>400?0:1)+' × '+Math.sqrt(0.1*e*BY).toFixed(1)+' µm';
  const r=e/42;$('emR').textContent=Math.abs(r-1)<0.02?'the same':r>1?(r<10?r.toFixed(1):cm(r))+' times larger':(1/r).toFixed(1)+' times smaller';emFig.w&&emFig.draw(emFig);}
['emN','emE'].forEach(id=>$(id).addEventListener('input',emUpd));emUpd();
}

// ---------- RF: the push that finds its own timing ----------
if($('rfCv')){
let rV=VRF;
const rfFig=fig('rfCv',w=>w<560?1.1:2.4,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const x0=w*(nr?0.14:0.09),x1=w*0.96,y0=h*0.16,y1=h*0.8,VM=7.5,X=p=>x0+p/(2*Math.PI)*(x1-x0),Y=v=>(y0+y1)/2-v/VM*(y1-y0)/2;
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);line(c,x0,Y(0),x1,Y(0),1,GREY);
  [-4,4].forEach(v=>{line(c,x0,Y(v),x1,Y(v),1,GREY);});[-4,0,4].forEach(v=>txt(c,(v>0?'+':'')+v+' MV',x0-6,Y(v),fs-1,'right'));
  line(c,x0,Y(U0),x1,Y(U0),1.8,RED,[5,4]);txt(c,nr?'lost per turn: 2.9 MeV':'energy lost each turn: 2.9 MeV',x1-6,Y(U0)+12,fs-1,'right',RED);
  pen(c,3,BLUE);c.beginPath();for(let p=0;p<=2*Math.PI+0.01;p+=0.03){const yy=Y(rV*Math.sin(p));p===0?c.moveTo(X(p),yy):c.lineTo(X(p),yy);}c.stroke();
  for(let ns=0;ns<=2.8;ns+=0.5){const p=ns/TBK*2*Math.PI;line(c,X(p),y1,X(p),y1+5,1.6);txt(c,ns.toFixed(1),X(p),y1+16,fs-1,'center');}
  txt(c,'arrival time (billionths of a second)',(x0+x1)/2,y1+34,fs,'center');
  if(rV>U0*1.01){const ps=Math.PI-Math.asin(U0/rV), amp=Math.min(0.5,(ps-Math.PI/2)*0.8);
    line(c,X(ps),y0,X(ps),y1,1.4,GRN,[3,4]);
    [[1,0],[0.6,2.1],[0.3,4.2]].forEach(([a,d],i)=>{const p=ps+amp*a*Math.cos(t*1.6+d), v=rV*Math.sin(p);disc(c,X(p),Y(v),nr?5:6.5,YEL,2);
      if(i===0){const late=p>ps;tag(c,late?'late: gets less':'early: gets more',X(p)+(late?14:-14),Y(v)-(nr?22:26),late?'left':'right',fs-1);}});
    txt(c,'on time',X(ps),y0+12,fs-1,'center',GRN);
  }else{txt(c,'Not enough voltage: the electrons cannot be paid back and are lost.',(x0+x1)/2,y0+18,fs,'center',RED);}
  cap(c,'The voltage in the RF cavities during one swing',12,18,'left',nr?12:15);
});
function rfUpd(){rV=+$('rfV').value;$('rfVO').textContent=rV.toFixed(1)+' MV';
  if(rV>U0*1.01){const ps=Math.PI-Math.asin(U0/rV);$('rfP').textContent=((ps-Math.PI/2)/(2*Math.PI)*TBK*1000).toFixed(0)+' ps after the peak';$('rfO').textContent=(rV/U0).toFixed(2)+' times what is needed';}
  else{$('rfP').textContent='none';$('rfO').textContent='too little';}
  rfFig.w&&rfFig.draw(rfFig);}
$('rfV').addEventListener('input',rfUpd);rfUpd();
}

// ---------- FILL PATTERNS ----------
if($('flCv')){
let fI=ITOT;hooks.push(()=>{$('flI').value=MD.I;});
const flFig=fig('flCv',w=>w<560?0.78:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15, nb=MD.nb;
  const R=nr?Math.min(w*0.3,h*0.2):Math.min(w*0.15,h*0.36), cx=nr?w*0.5:w*0.2, cy=nr?44+R+10:h*0.54;
  ringShape(c,cx,cy,R,nr?10:13);
  const rr=nb>200?(nr?1.3:1.7):nb>100?(nr?1.8:2.3):(nr?3:3.8);for(let i=0;i<nb;i++){const a=i/nb*2*Math.PI+t*0.25;c.beginPath();c.arc(cx+R*Math.cos(a),cy+R*Math.sin(a),rr,0,7);c.fillStyle=YEL;c.fill();if(nb<=162){pen(c,1);c.stroke();}}
  txt(c,nb+' bunches',cx,cy-10,fs+1,'center');txt(c,'in 1,296 buckets',cx,cy+10,fs-1,'center');
  cap(c,'The ring',12,18,'left',nr?12:15);
  // what a fast detector at a beamline would see
  const ty=nr?cy+R+40:18, B=nr?{x:w*0.06,y:ty+20,w:w*0.9,h:h-ty-20-46}:{x:w*0.43,y:40,w:w*0.54,h:h-86}, WIN=400, X=ns=>B.x+ns/WIN*B.w;
  rectF(c,B.x,B.y,B.w,B.h,WHITE,2.5);const s=sp(nb), q=qb(fI,nb), hh=(B.h-24)*Math.min(1,q/16);
  c.save();c.beginPath();c.rect(B.x+1.5,B.y+1.5,B.w-3,B.h-3);c.clip();
  const off=(t*30)%s;for(let ns=-off;ns<WIN+s;ns+=s){if(ns<0)continue;line(c,X(ns),B.y+B.h-2,X(ns),B.y+B.h-2-hh,nb>300?(nr?1.4:2):(nr?2.2:3),ORG);}
  c.restore();pen(c,2.5);c.strokeRect(B.x,B.y,B.w,B.h);
  for(let ns=0;ns<=WIN;ns+=WIN>200?100:20){line(c,X(ns),B.y+B.h,X(ns),B.y+B.h+5,1.6);txt(c,String(ns),X(ns),B.y+B.h+16,fs-1,'center');}
  txt(c,'time (billionths of a second)',B.x+B.w/2,B.y+B.h+34,fs,'center');
  tag(c,s.toFixed(1)+' ns apart',B.x+B.w-8,B.y+16,'right',fs);
  cap(c,'X-ray flashes at a beamline',nr?12:B.x,ty,'left',nr?12:15);
});
function flUpd(){fI=+$('flI').value;$('flIO').textContent=fI+' mA';const q=qb(fI,MD.nb);
  $('flN').textContent=MD.nb+' of 1,296 buckets';$('flS').textContent=sp(MD.nb).toFixed(1)+' ns';$('flQ').textContent=q.toFixed(q<10?2:1)+' nC';
  $('flE').textContent=(q*6.2415).toFixed(q*6.2415<20?1:0)+' billion';flFig.w&&flFig.draw(flFig);}
$('flI').addEventListener('input',flUpd);hooks.push(flUpd);
[['flM216','216'],['flM48','48'],['flM324','324']].forEach(([id,k])=>{$(id).addEventListener('click',()=>setMode(k));});
hooks.push(()=>{[['flM216',216],['flM48',48],['flM324',324]].forEach(([id,n])=>$(id).setAttribute('aria-pressed',String(MD.nb===n)));});
}

// ---------- SWAP-OUT ----------
if($('swCv')){
let sT=7.5,sD=10;
const sw=()=>{const x=-Math.log(1-sD/100), ts=x*sT*3600/MD.nb;return {x,ts,cyc:MD.nb*ts,q0:qb(MD.I,MD.nb)*x/(sD/100),rip:100*(sD/100)/MD.nb*(x/(sD/100))};};
const swFig=fig('swCv',w=>w<560?0.95:2.1,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15, nb=MD.nb, m=sw();
  const x0=w*(nr?0.14:0.09),x1=w*0.96, A={y:74,h:h*0.32}, B={y:74+h*0.32+(nr?52:58),h:h-(74+h*0.32+(nr?52:58))-40}, FL=0.6;
  // every bunch in the ring, drawn as a bar: its charge now
  rectF(c,x0,A.y,x1-x0,A.h,WHITE,2.5);
  const per=1.6, k=Math.floor(t/per), u=(t%per)/per, bwd=(x1-x0-8)/nb, Yc=v=>A.y+A.h-4-(A.h-22)*Math.max(0,(v-FL)/(1-FL));
  for(let i=0;i<nb;i++){const age=((k-i)%nb+nb)%nb+u, v=Math.exp(-m.x*age/nb), xx=x0+4+i*bwd, fresh=((k-i)%nb+nb)%nb===0, next=((k+1-i)%nb+nb)%nb===0;
    c.fillStyle=fresh?GRN:next?RED:STEEL;c.fillRect(xx,Yc(v),Math.max(1,bwd-(nb>200?0.4:1)),A.y+A.h-2-Yc(v));}
  line(c,x0,Yc(1),x1,Yc(1),1,GREY,[4,4]);txt(c,'full',x0-6,Yc(1),fs-1,'right');txt(c,(100-sD)+'%',x0-6,Yc(1-sD/100),fs-1,'right');line(c,x0,Yc(1-sD/100),x1,Yc(1-sD/100),1,GREY,[2,4]);
  const xi=x0+4+(((k%nb)+nb)%nb+0.5)*bwd, xn=x0+4+((((k+1)%nb)+nb)%nb+0.5)*bwd;
  if(u<0.5){arrow(c,xi,A.y-18,xi,A.y-3,GRN,2.6,8);tag(c,'fresh bunch in',Math.min(Math.max(xi,x0+60),x1-60),A.y-29,'center',fs-1,GRN);}
  else{arrow(c,xn,A.y-3,xn,A.y-18,RED,2.6,8);tag(c,'next to go',Math.min(Math.max(xn,x0+50),x1-50),A.y-29,'center',fs-1,RED);}
  cap(c,'Charge in each of the '+nb+' bunches',12,18,'left',nr?12:15);
  // the total current: a fine sawtooth
  rectF(c,x0,B.y,x1-x0,B.h,WHITE,2.5);
  const NS=nr?7:12, rp=Math.max(m.rip,1e-4), yr=Math.max(0.1,rp*2.2), stp=yr>0.4?0.2:yr>0.2?0.1:0.05, Yi=p=>B.y+B.h/2-p/yr*(B.h/2-6), Xs=s=>x0+s/NS*(x1-x0);
  [-stp,0,stp].forEach(p=>{line(c,x0,Yi(p),x1,Yi(p),1,GREY);txt(c,(p>0?'+':'')+p+'%',x0-6,Yi(p),fs-1,'right');});
  c.save();c.beginPath();c.rect(x0+1.5,B.y+1.5,x1-x0-3,B.h-3);c.clip();pen(c,2.6,BLUE);c.beginPath();
  for(let s=-1;s<NS+1;s++){const xa=Xs(s-u+1-1), xb=Xs(s-u+1);if(s===-1)c.moveTo(xa,Yi(rp/2));else c.lineTo(xa,Yi(rp/2));c.lineTo(xb,Yi(-rp/2));}c.stroke();c.restore();
  pen(c,2.5);c.strokeRect(x0,B.y,x1-x0,B.h);
  txt(c,'one swap every '+(m.ts<100?m.ts.toFixed(1):m.ts.toFixed(0))+' s',x1-6,B.y+B.h+14,fs-1,'right');txt(c,'time →',x0+4,B.y+B.h+14,fs-1,'left');
  cap(c,'Total current in the ring, around '+MD.I+' mA',12,B.y-22,'left',nr?12:15);
});
function swUpd(){sT=+$('swT').value;sD=+$('swD').value;$('swTO').textContent=sT.toFixed(1)+' h';$('swDO').textContent=sD+'%';const m=sw();
  $('swI').textContent=(m.ts<100?m.ts.toFixed(1):m.ts.toFixed(0))+' s';$('swC').textContent=(m.cyc/60).toFixed(m.cyc<600?1:0)+' min';
  $('swR').textContent=m.rip.toFixed(m.rip<0.1?3:2)+'%';$('swQ').textContent=m.q0.toFixed(m.q0<10?2:1)+' nC';swFig.w&&swFig.draw(swFig);}
['swT','swD'].forEach(id=>$(id).addEventListener('input',swUpd));
hooks.push(()=>{$('swT').value=MD.life;swUpd();});
}

// ---------- SWAP-OUT IN MOTION: one bunch in, one bunch out ----------
if($('swanCv')){
const KON=14.9, DEL=15*Math.PI/180;                    // kicker pulse in ns; the angle of the kick, drawn far too large
const swanFig=fig('swanCv',w=>w<560?1.15:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?12:15;
  const pxns=nr?2.3:4.1, v=nr?70:120, S=sp(MD.nb)*pxns, y0=h*0.66, xk=w*0.42, Lk=nr?34:54, M=Math.max(3,Math.round(5.5*v/S)), on=KON*pxns/2;
  const Li=xk-w*0.04, Lo=w*(nr?0.34:0.3), ux=Math.cos(DEL), uy=Math.sin(DEL), xd=xk+Lo*ux, yd=y0-Lo*uy;
  // the paths: the stored beam, the way in from the booster, and the way out to the absorber
  line(c,xk-Li*ux,y0-Li*uy,xk,y0,2,GRN,[6,5]);line(c,xk,y0,xd,yd,2,RED,[6,5]);line(c,0,y0,w,y0,2.4);
  rectF(c,xd-4,yd-(nr?16:22),nr?16:22,nr?26:36,GREY,2);for(let i=0;i<3;i++)line(c,xd-4,yd-(nr?16:22)+(i+1)*(nr?6.5:9),xd+(nr?12:18),yd-(nr?16:22)+i*(nr?6.5:9),1.2);
  // where is the bunch that is being swapped?
  const nNow=Math.floor((v*t-xk)/S/M+0.5)*M, tk=(xk+nNow*S)/v, dt=t-tk, live=Math.abs(dt)*v<on;
  // the kicker: two plates, live only while the one bunch is between them
  [-1,1].forEach(sg=>{rectF(c,xk-Lk/2,y0+sg*(nr?13:17)-(nr?3:4),Lk,nr?6:8,live?ORG:GREY,2);});
  if(live){[-1,1].forEach(sg=>{for(let i=0;i<3;i++){const xx=xk-Lk/2+(i+0.5)*Lk/3;line(c,xx,y0+sg*(nr?9:12),xx,y0+sg*(nr?4:5),2,ORG);}});}
  txt(c,live?'kicker ON':'kicker off',xk,y0+(nr?30:38),fs,'center',live?ORG:INK);
  // the stored bunches, all at the same speed
  const n0=Math.ceil((v*t-w-20)/S), n1=Math.floor((v*t+20)/S);
  for(let n=n0;n<=n1;n++){const x=v*t-n*S;if(n%M===0){const tn=(xk+n*S)/v, d=t-tn;
      if(d<0){disc(c,x,y0,nr?4:5,GREY,1.6);if(x>w*0.03&&x<xk-(nr?70:110))tag(c,'worn',x,y0-(nr?16:20),'center',fs-2);
        const p=-d*v;if(p<Li){const xf=xk-p*ux,yf=y0-p*uy;disc(c,xf,yf,nr?6:7.5,YEL,2);pen(c,2.4,GRN);c.beginPath();c.arc(xf,yf,nr?9:11,0,7);c.stroke();if(p>(nr?70:110))tag(c,'fresh',xf+(nr?12:16),yf-(nr?10:12),'left',fs-2,GRN);}}
      else{disc(c,x,y0,nr?6:7.5,YEL,2);if(d<2.2){c.globalAlpha=1-d/2.2;pen(c,2.4,GRN);c.beginPath();c.arc(x,y0,nr?9:11,0,7);c.stroke();c.globalAlpha=1;}
        const p=d*v;if(p<Lo){disc(c,xk+p*ux,y0-p*uy,nr?4:5,GREY,1.6);}else if(p<Lo+50){const a=1-(p-Lo)/50;c.globalAlpha=a;for(let k=0;k<8;k++){const g=k/8*2*Math.PI;line(c,xd+4+4*Math.cos(g),yd+4*Math.sin(g),xd+4+12*Math.cos(g),yd+12*Math.sin(g),2,RED);}c.globalAlpha=1;}}}
    else disc(c,x,y0,nr?5:6.2,YEL,1.8);}
  txt(c,'stored bunches →',8,y0+(nr?30:38),fs-1,'left');txt(c,'from the booster',xk-Li*ux+4,y0-Li*uy-(nr?12:14),fs-1,'left',GRN);
  txt(c,'absorber',xd+(nr?4:8),yd-(nr?24:32),fs-1,'center');txt(c,'kicker',xk,y0-(nr?28:34),fs-1,'center');
  cap(c,'Swap-out, slowed down about '+Math.round(pxns/v*1e3)+' million times',12,18,'left',nr?12:15);
});
hooks.push(()=>{setT('swnS',sp(MD.nb).toFixed(1)+' ns');});
}

// ---------- THE KICKER: one bunch and not its neighbors ----------
if($('kkCv')){
let kW=14.9;const KR=4.5;
const kkFig=fig('kkCv',w=>w<560?1.3:2.6,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15, s=sp(MD.nb);
  const x0=w*0.06,x1=w*0.96,y0=h*0.2,y1=h*0.76,WIN=s>40?(nr?200:260):(nr?60:90),TK=WIN>150?50:10,X=ns=>(x0+x1)/2+ns/WIN*(x1-x0),flat=Math.max(0.5,kW-2*KR);
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  const amp=ns=>{const a=Math.abs(ns);return a<=flat/2?1:a>=flat/2+KR?0:1-(a-flat/2)/KR;}, Yk=v=>y1-4-(y1-y0-34)*v;
  c.beginPath();c.moveTo(X(-flat/2-KR),Yk(0));c.lineTo(X(-flat/2),Yk(1));c.lineTo(X(flat/2),Yk(1));c.lineTo(X(flat/2+KR),Yk(0));c.closePath();c.fillStyle=LTORG;c.fill();pen(c,2.4,ORG);c.stroke();
  txt(c,'kicker pulse',X(flat/2+KR)+8,Yk(0.75),fs,'left',ORG);
  c.save();c.beginPath();c.rect(x0+1.5,y0+1.5,x1-x0-3,y1-y0-3);c.clip();
  let hit=0;for(let i=-12;i<=12;i++){const ns=i*s;if(Math.abs(ns)>WIN/2+2)continue;const a=amp(ns),col=i===0?GRN:a>0.02?RED:INK;if(i!==0&&a>0.02)hit=Math.max(hit,a);
    line(c,X(ns),y1-3,X(ns),y1-3-(y1-y0)*0.42,nr?3:4,col);disc(c,X(ns),y1-3-(y1-y0)*0.42,nr?4:5,i===0?GRN:a>0.02?RED:YEL,1.6);}
  c.restore();pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  for(let ns=-Math.floor(WIN/2/TK)*TK;ns<=WIN/2;ns+=TK){line(c,X(ns),y1,X(ns),y1+5,1.6);txt(c,String(ns),X(ns),y1+16,fs-1,'center');}
  txt(c,'time (billionths of a second)',(x0+x1)/2,y1+34,fs,'center');
  txt(c,'green: the bunch being swapped',x0+8,y0+14,fs-1,'left',GRN);
  kkFig.hit=hit;
  cap(c,'Bunches passing the kicker',12,18,'left',nr?12:15);
},false);
function kkUpd(){kW=+$('kkW').value;$('kkWO').textContent=kW.toFixed(1)+' ns';const s=sp(MD.nb),flat=Math.max(0.5,kW-2*KR),a=Math.abs(s),hit=a<=flat/2?1:a>=flat/2+KR?0:1-(a-flat/2)/KR;
  $('kkS').textContent=s.toFixed(1)+' ns';$('kkN').textContent=hit<0.02?'untouched':hit>0.98?'kicked out as well':'disturbed: '+(100*hit).toFixed(0)+'% of a full kick';
  $('kkM').textContent='shorter than '+(2*s).toFixed(1)+' ns';kkFig.w&&kkFig.draw(kkFig);}
$('kkW').addEventListener('input',kkUpd);hooks.push(kkUpd);
}

// ---------- THE GUN: electrons boil off a hot cathode ----------
if($('gunCv')){
let gT=1000;                                           // cathode temperature in degrees C
// Richardson's law with a work function of 2 eV, a typical value for the treated tungsten used in such cathodes (illustrative)
const rich=T=>{const K=T+273.15;return 120*K*K*Math.exp(-2/(8.617e-5*K));};
const GJ=(()=>{const r=rng(21),a=[];for(let i=0;i<40;i++)a.push([r(),r(),r()]);return a;})();
const hot=T=>{const u=Math.max(0,Math.min(1,(T-700)/600)),m=(a,b)=>Math.round(a+(b-a)*u);return 'rgb('+m(140,255)+','+m(47,209)+','+m(34,92)+')';};
const gunFig=fig('gunCv',w=>w<560?1.15:2.5,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const xa=w*(nr?0.2:0.16), xb=w*0.86, yc=h*0.52, ch=h*0.44, wl=nr?9:12, kw=nr?20:28, kh=ch*0.5, TP=2.0;
  // the copper cavity, with an opening toward the linac
  rectF(c,xa,yc-ch/2-wl,xb-xa,wl,LTORG,2);rectF(c,xa,yc+ch/2,xb-xa,wl,LTORG,2);rectF(c,xa-wl,yc-ch/2-wl,wl,ch+2*wl,LTORG,2);
  rectF(c,xb,yc-ch/2-wl,wl,ch/2-ch*0.16+wl,LTORG,2);rectF(c,xb,yc+ch*0.16,wl,ch/2-ch*0.16+wl,LTORG,2);
  c.fillStyle=WHITE;c.fillRect(xa,yc-ch/2,xb-xa,ch);
  // heater behind the cathode, and the cathode itself, glowing according to its temperature
  pen(c,2.4,RED);c.beginPath();for(let i=0;i<=8;i++){const yy=yc-kh*0.4+i*kh*0.1,xx=xa-wl-(nr?10:16)+(i%2?(nr?6:9):0);i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();
  rectF(c,xa-wl*0.4,yc-kh/2,kw,kh,hot(gT),2.2);
  // electrons inside the metal, jostling faster the hotter it is
  const jig=1.5+3.5*(gT-700)/600;GJ.slice(0,10).forEach((p,i)=>{const x=xa-wl*0.4+4+p[0]*(kw-8)+jig*Math.sin(t*(9+7*p[2])+i),y=yc-kh/2+5+p[1]*(kh-10)+jig*Math.cos(t*(8+9*p[0])+2*i);disc(c,x,y,nr?2:2.6,YEL,1);});
  // the RF field: half the time it pulls electrons away, half the time it pushes them back
  const ph=(t%TP)/TP, pull=Math.cos(2*Math.PI*(ph-0.22));
  if(Math.abs(pull)>0.08)fatArrow(c,(xa+xb)/2-pull*(nr?26:44),yc-ch*0.34,(xa+xb)/2+pull*(nr?26:44),yc-ch*0.34,ORG,nr?5:7);
  txt(c,pull>0?'field pulls electrons away':'field pushes them back',(xa+xb)/2,yc-ch*0.34+(nr?16:20),fs-1,'center',ORG);
  // electrons that got over the barrier leave during the pulling half of each swing, as one bunch per swing
  const J=rich(gT), n=Math.max(0,Math.min(12,Math.round(12*(Math.log10(J)+2.3)/4.4))), k0=Math.floor(t/TP), x0e=xa-wl*0.4+kw;
  for(let k=k0-3;k<=k0;k++)for(let j=0;j<n;j++){const p=GJ[10+((j+k*5)%30+30)%30], te=k*TP+(0.02+0.42*(j+0.5)/Math.max(n,1))*TP, dt=t-te;if(dt<0)continue;
    const x=x0e+(w*0.035)*dt+(w*0.09)*dt*dt, y=yc+(p[1]-0.5)*Math.min(kh*0.8,ch*0.26);if(x>w+10)continue;if(x>xb&&Math.abs(y-yc)>ch*0.16-3)continue;disc(c,x,y,nr?2.6:3.4,YEL,1.2);}
  txt(c,'heater',xa-wl-(nr?8:12),yc+kh/2+(nr?16:20),fs-1,'center',RED);txt(c,'hot cathode',xa+kw*0.2,yc-kh/2-12,fs-1,'left');txt(c,Math.round(gT)+' °C',xa+kw+8,yc+kh/2+2,fs,'left');
  txt(c,'to the linac →',nr?w-4:xb+wl+6,nr?yc+ch/2+wl+14:yc+ch*0.16+16,fs-1,nr?'right':'left');
  txt(c,'copper cavity',(xa+xb)/2,yc+ch/2+wl+14,fs-1,'center');
  cap(c,'Inside the electron gun',12,18,'left',nr?12:15);
});
function gunUpd(){gT=+$('gnT').value;$('gnTO').textContent=gT+' °C';const J=rich(gT),r=J/rich(1000);
  $('gnJ').textContent=(J<0.1?J.toFixed(3):J<10?J.toFixed(1):J.toFixed(0))+' A per cm²';$('gnR').textContent=Math.abs(r-1)<0.03?'the same':r>1?(r<10?r.toFixed(1):r.toFixed(0))+' times more':(1/r<10?(1/r).toFixed(1):(1/r).toFixed(0))+' times fewer';gunFig.w&&gunFig.draw(gunFig);}
$('gnT').addEventListener('input',gunUpd);gunUpd();
}

// ---------- VACUUM: how far an electron gets ----------
if($('vacCv')){
const VMIN=-12.5, VMAX=2.88;let vP=-8.7;               // log10 of the pressure in torr
const VD=(()=>{const r=rng(5),a=[];for(let i=0;i<140;i++)a.push([r(),r()]);return a;})();
// familiar places, as log10 of the pressure in torr (round textbook values): [value, long name, short name, label row]
const VREF=[[2.88,'air at sea level','air',0,'sea-level air'],[2.4,'the top of Everest','Everest',1,'top of Everest'],[0.7,'the surface of Mars','Mars',0,'Mars'],[-3.6,'the edge of space, 100 km up','100 km up',0,'edge of space, 100 km up'],[-8,'where the Space Station flies','Space Station',1,'Space Station orbit'],[-8.7,'the APS ring','APS ring',0,'the APS ring'],[-11.7,'the surface of the Moon at night','the Moon',0,'the Moon at night']];
// rough estimate for nitrogen-like gas: an electron lasts about 57 hours at a billionth of a torr, and in proportion less at higher pressure
const vLife=P=>57*3600*1e-9/P, vDens=P=>3.2e16*P;
const fT=s=>s<1e-6?(s*1e9).toFixed(0)+' billionths of a second':s<1e-3?(s*1e6).toFixed(0)+' millionths of a second':s<1?(s*1e3).toFixed(0)+' thousandths of a second':s<90?s.toFixed(0)+' seconds':s<5400?(s/60).toFixed(0)+' minutes':s<172800?(s/3600).toFixed(0)+' hours':s<6.3e7?(s/86400).toFixed(0)+' days':big(s/3.156e7)+' years';
const fD=m=>m<1000?m.toFixed(0)+' m':m<1e6?(m/1e3).toFixed(m<1e4?1:0)+' km':big(m/1e3)+' km';
const fP=P=>P>=1?P.toFixed(0)+' torr':P>=1e-3?(P*1e3).toFixed(P<0.01?1:0)+' thousandths of a torr':P>=1e-6?(P*1e6).toFixed(P<1e-5?1:0)+' millionths of a torr':P>=1e-9?(P*1e9).toFixed(P<1e-8?1:0)+' billionths of a torr':(P*1e12).toFixed(P<1e-11?1:0)+' trillionths of a torr';
const geo=f=>{const w=f.w,h=f.h;return {x0:w*0.05,x1:w*0.95,sy:h*0.8};}, vX=(g,l)=>g.x0+(l-VMIN)/(VMAX-VMIN)*(g.x1-g.x0);
const vacFig=fig('vacCv',w=>w<560?1.0:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?12:15, g=geo(f), x0=g.x0, x1=g.x1, sy=g.sy;
  const py=h*0.27,ph=h*0.2,fr=Math.max(0,(vP+10)/12.88);
  rectF(c,x0,py-ph/2-9,x1-x0,9,GREY,2);rectF(c,x0,py+ph/2,x1-x0,9,GREY,2);c.fillStyle=WHITE;c.fillRect(x0,py-ph/2,x1-x0,ph);
  const nd=Math.round(1+139*Math.pow(fr,1.6));for(let i=0;i<nd;i++){const p=VD[i];disc(c,x0+6+p[0]*(x1-x0-12),py-ph/2+6+p[1]*(ph-12),nr?2:2.6,STEEL,1);}
  line(c,x0,py,x1,py,1,GREY);
  const sp2=0.3,pass=Math.floor(t*sp2),u=(t*sp2)%1,r=rng(pass*7+3),hit=r()<Math.pow(fr,2.2),xh=x0+(0.12+0.7*r())*(x1-x0),xe=x0+u*(x1-x0);
  if(hit&&xe>=xh){for(let k=0;k<8;k++){const a=k/8*2*Math.PI;line(c,xh+5*Math.cos(a),py+5*Math.sin(a),xh+14*Math.cos(a),py+14*Math.sin(a),2.2,RED);}tag(c,'hit a gas molecule: lost',xh+(xh>w*0.6?-18:18),py-ph/2+12,xh>w*0.6?'right':'left',fs-1,RED);}
  else{line(c,Math.max(x0,xe-30),py,xe,py,2.6,ORG);electron(c,xe,py,nr?6:7);}
  txt(c,'gas molecules (not to scale)',x1,py+ph/2+22,fs-1,'right');
  // the pressure, on a scale where each mark is ten times less than the one to its right, with familiar places marked
  line(c,x0,sy,x1,sy,2);for(let l=-12;l<=2;l++)line(c,vX(g,l),sy-(l%3===0?6:3),vX(g,l),sy+(l%3===0?6:3),1.6);
  [[-12,'a trillionth of a torr',nr?'10⁻¹²':null],[-9,'a billionth',nr?'10⁻⁹':null],[-6,'a millionth',nr?'10⁻⁶':null],[-3,'a thousandth',nr?'10⁻³':null],[0,'1 torr','1 torr']].forEach(([l,s2,s3])=>txt(c,s3||s2,vX(g,l),sy+18,fs-1,'center'));
  VREF.forEach(([l,ln,sn,row,wn])=>{const x=vX(g,l),aps=l===-8.7,yy=sy-(aps&&nr?64:row?(nr?44:50):(nr?24:28)),col=aps?GRN:INK,al=aps?'right':nr&&l===-8?'left':x>x1-(nr?40:90)?'right':x<x0+(nr?30:60)?'left':'center';
    line(c,x,sy-8,x,yy+9,aps?2.6:1.4,col);txt(c,nr?sn:wn,aps?x+(nr?6:10):al==='right'?(l>2.5?x1:x+4):al==='left'?(l===-8?x-3:x0):x,yy,aps?fs+1:fs-1,al,col);});
  // the marker: drag it
  const xm=vX(g,vP);disc(c,xm,sy,nr?9:10,ORG,2.2);line(c,xm-3,sy-4,xm-3,sy+4,1.6);line(c,xm+3,sy-4,xm+3,sy+4,1.6);
  if(!vacFig.used)txt(c,'← drag →',xm,sy+(nr?36:38),fs-1,'center',ORG);
  cap(c,'Inside the vacuum pipe',12,18,'left',nr?12:15);
});
function vacUpd(){vP=+$('vcP').value;const P=Math.pow(10,vP),tl=vLife(P),dm=tl*299792458;$('vcPO').textContent=fP(P);
  $('vcN').textContent=big(vDens(P));$('vcT').textContent=fT(tl);
  $('vcD').textContent=fD(dm)+(dm<CIRC?' ('+(100*dm/CIRC).toFixed(0)+'% of one turn)':'');
  $('vcX').textContent=P>1e-3?(P>700?'this is air':(760/P).toFixed(760/P<10?1:0)+' times thinner'):big(760/P)+' times thinner';
  let best=VREF[0];VREF.forEach(v=>{if(Math.abs(v[0]-vP)<Math.abs(best[0]-vP))best=v;});const dd=vP-best[0];
  $('vcR').textContent=Math.abs(dd)<0.15?'about the same as '+best[1]:(dd>0?big(Math.pow(10,dd)).replace(/\.0$/,'')+' times the pressure of ':big(Math.pow(10,-dd))+' times thinner than ')+best[1];
  vacFig.w&&vacFig.draw(vacFig);}
$('vcP').addEventListener('input',()=>{vacFig.used=true;vacUpd();});vacUpd();
// dragging the marker along the scale
{const cv=$('vacCv');let drag=false;cv.style.touchAction='pan-y';
 const at=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];}, zone=y=>y>vacFig.h*0.52;
 const put=x=>{const g=geo(vacFig),l=Math.max(VMIN,Math.min(VMAX,VMIN+(x-g.x0)/(g.x1-g.x0)*(VMAX-VMIN)));$('vcP').value=l.toFixed(2);vacFig.used=true;vacUpd();};
 cv.addEventListener('pointerdown',e=>{const [x,y]=at(e);if(zone(y)){drag=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}put(x);e.preventDefault();}});
 cv.addEventListener('pointermove',e=>{const [x,y]=at(e);if(drag)put(x);cv.style.cursor=zone(y)?'ew-resize':'default';});
 ['pointerup','pointercancel','lostpointercapture'].forEach(n=>cv.addEventListener(n,()=>{drag=false;}));}
}

// ---------- ONE SECTOR: what "achromat" means ----------
if($('mbaCv')){
let mD=1.5;                                            // energy difference in percent
// dispersion along one sector, as a fraction of its peak. The two ends (0.39 mm) and the peak (90 mm) are from the APS parameters page; the shape between is schematic.
const ETA=[[0,0.0043],[0.12,0.0043],[0.2,0.93],[0.245,1],[0.29,0.93],[0.37,0.24],[0.42,0.2],[0.455,0.3],[0.5,0.22]], EPK=90, EID=0.388;
function eta(u){if(u>0.5)u=1-u;for(let i=0;i<ETA.length-1;i++){const a=ETA[i],b=ETA[i+1];if(u<=b[0]){const q=(u-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*(1-Math.cos(Math.PI*q))/2;}}return 0.22;}
// magnets in half a sector, from the middle of a straight: Q quadrupole, L and T bending magnets, R reverse bend, S sextupole
const HALF=[['Q',0.085,0.1],['Q',0.105,0.12],['L',0.13,0.185],['Q',0.195,0.21],['S',0.215,0.226],['R',0.231,0.243],['S',0.248,0.259],['R',0.264,0.276],['S',0.281,0.292],['L',0.3,0.355],['Q',0.363,0.378],['T',0.388,0.44],['R',0.448,0.462]];
const MAG=HALF.concat([['T',0.47,0.53]],HALF.map(m=>[m[0],1-m[2],1-m[1]]));
const MC={Q:WHITE,L:BLUE,T:LTBLUE,R:RED,S:GRN}, MH={Q:0.5,L:1,T:1,R:0.7,S:0.5};
const mbaFig=fig('mbaCv',w=>w<560?1.05:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?13:15;
  const x0=w*(nr?0.15:0.08),x1=w*0.97,X=u=>x0+u*(x1-x0),my=h*0.24,mh=nr?24:32;
  // the magnets of one sector, with half an undulator straight at each end
  line(c,x0,my,x1,my,1.6);
  [[0,0.07],[0.93,1]].forEach(([a,b])=>{const n=3,pw=(X(b)-X(a))/n;for(let i=0;i<n;i++){rectF(c,X(a)+i*pw,my-mh*0.55,pw,mh*0.3,i%2?LTORG:FLOOR,1.4);rectF(c,X(a)+i*pw,my+mh*0.25,pw,mh*0.3,i%2?FLOOR:LTORG,1.4);}});
  MAG.forEach(m=>{const hh=mh*MH[m[0]];rectF(c,X(m[1]),my-hh/2,Math.max(3,X(m[2])-X(m[1])),hh,MC[m[0]],1.5);});
  txt(c,'undulator',x0,my-mh*0.55-10,fs-2,'left');txt(c,'undulator',x1,my-mh*0.55-10,fs-2,'right');
  cap(c,'One sector of the ring, straightened out',12,18,'left',nr?12:15);
  // the path of an electron with a different energy, measured from the ideal path
  const py0=h*0.42,py1=h*0.88,ym=(py0+py1)/2,RG=3,Y=mm=>ym-mm/RG*(py1-py0)/2;
  rectF(c,x0,py0,x1-x0,py1-py0,WHITE,2.5);
  [-2,2].forEach(v=>{line(c,x0,Y(v),x1,Y(v),1,GREY);});[-2,0,2].forEach(v=>txt(c,(v>0?'+':'')+v+' mm',x0-6,Y(v),fs-1,'right'));
  MAG.filter(m=>m[0]==='L'||m[0]==='T').forEach(m=>{c.fillStyle='rgba(47,109,181,0.10)';c.fillRect(X(m[1]),py0+1.5,X(m[2])-X(m[1]),py1-py0-3);});
  line(c,x0,Y(0),x1,Y(0),2.2);
  pen(c,3,ORG);c.beginPath();for(let u=0;u<=1.0001;u+=0.004){const yy=Y(eta(u)*EPK*mD/100);u===0?c.moveTo(X(u),yy):c.lineTo(X(u),yy);}c.stroke();
  const u=(t*0.16)%1;disc(c,X(u),Y(0),nr?4.5:5.5,YEL,1.6);disc(c,X(u),Y(eta(u)*EPK*mD/100),nr?4.5:5.5,ORG,1.6);
  tag(c,'ideal path',X(0.5),Y(0)+(mD>=0?16:-16),'center',fs-1);
  if(Math.abs(mD)>0.05)tag(c,(EPK*mD/100).toFixed(2)+' mm',X(0.245),Y(EPK*mD/100)+(mD>0?-16:16),'center',fs-1,ORG);
  txt(c,'together again',x0,py1+14,fs-1,'left');txt(c,'together again',x1,py1+14,fs-1,'right');
  if(!nr)txt(c,'sideways position of an electron with '+Math.abs(mD).toFixed(1)+'% '+(mD>=0?'more':'less')+' energy',X(0.5),py1+14,fs-1,'center',ORG);
});
function mbaUpd(){mD=+$('mbD').value;$('mbDO').textContent=Math.abs(mD)<0.05?'the same energy':Math.abs(mD).toFixed(1)+'% '+(mD>0?'more':'less')+' energy';
  $('mbP').textContent=Math.abs(EPK*mD/100).toFixed(2)+' mm';$('mbC').textContent=Math.abs(0.22*EPK*mD/100).toFixed(2)+' mm';$('mbU').textContent=Math.abs(EID*mD/100*1000).toFixed(1)+' µm';mbaFig.w&&mbaFig.draw(mbaFig);}
$('mbD').addEventListener('input',mbaUpd);mbaUpd();
}

// ---------- words and numbers that follow the fill pattern ----------
function fillText(){const nb=MD.nb,I=MD.I,q=qb(I,nb),s=sp(nb),x=-Math.log(0.9),ts=x*MD.life*3600/nb,q0=q*x/0.1,nB=Math.ceil(fresh(MD)),gs=MD.guess?' (a guess: there is no published figure for this pattern)':'';
  const T={
    fillSum:`With ${nb} bunches sharing ${I} mA, each bunch holds ${q.toFixed(q<10?2:1)} nC, which is about ${(q*6.2415).toFixed(0)} billion electrons, and a flash of X-rays reaches each beamline every ${s.toFixed(1)} billionths of a second. A 10 ms exposure on a detector adds up about ${cm(Math.round(nb*0.01/(TREV*1e-6)/1000)*1000)} of them.`,
    swapSum:`With ${nb} bunches and a lifetime of about ${MD.life} hours${gs}, swapping a bunch once it has lost a tenth of its charge means one swap about every ${ts.toFixed(ts<10?1:0)} seconds. Each fresh bunch carries about ${q0.toFixed(q0<10?1:0)} nC, and every bunch in the ring is replaced about every ${(nb*ts/60).toFixed(0)} minutes.`,
    injSum:`For ${nb} bunches at ${I} mA the ring needs about ${fresh(MD).toFixed(fresh(MD)<10?1:0)} nC in each fresh bunch, so the accumulator collects about ${nB} bursts before passing the bunch on.`,
    useFill:`Set for ${MD.name}.`,
    useSwap:`Set for ${MD.name}: lifetime ${MD.life} h${MD.guess?', which is a guess: no published figure for this pattern':', the design figure'}.`,
    useKick:`Set for ${MD.name}: bunches ${s.toFixed(1)} ns apart. The pulse starts at 14.9 ns, the published design: 4.5 ns up, 5.9 ns flat, 4.5 ns down.`,
    numQb:`For ${nb} bunches at ${I} mA: ${I} mA × 3.681 µs / ${nb} = ${q.toFixed(q<10?2:1)} nC. Bunch spacing: 1,296 / ${nb} = ${HN/nb} buckets, or ${s.toFixed(1)} ns.`,
    numSwap:`For ${nb} bunches, τ = ${MD.life} h and a loss of 10% before the swap: ${ts.toFixed(ts<10?1:0)} s between swaps. The total current then steps by about 10% / ${nb} = ${(10/nb).toFixed(nb>100?3:2)}% at each swap.`
  };
  document.querySelectorAll('[data-d]').forEach(el=>{const k=el.dataset.d;if(k in T)el.textContent=T[k];});}
function capK(){document.querySelectorAll('.ro .k').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))n.nodeValue=n.nodeValue.replace(/[a-z]/g,ch=>ch.toUpperCase());});}
function setMode(k){if(!MODES[k])k='216';MD=MODES[k];$('mode').value=k;hooks.forEach(fn=>fn());fillText();capK();redrawAll();try{localStorage.setItem('necat-guide-fill3',k);}catch(e){}}
$('mode').addEventListener('change',e=>setMode(e.target.value));
let sv=null;try{sv=localStorage.getItem('necat-guide-fill3');}catch(e){}
setMode(sv||'216');
const eqBtn=$('eqAll');let eqOpen=false;
function setEq(o){eqOpen=o;document.querySelectorAll('details.eqcard').forEach(d=>d.open=o);eqBtn.textContent=o?'Close all equations':'Open all equations';eqBtn.setAttribute('aria-pressed',String(o));try{localStorage.setItem('necat-guide-eq',o?'1':'0');}catch(e){}}
eqBtn.addEventListener('click',()=>setEq(!eqOpen));
try{if(localStorage.getItem('necat-guide-eq')==='1')setEq(true);}catch(e){}
})();
