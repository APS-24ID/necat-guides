// ---------- PHOTON PATH (opening figure of the overview) ----------
function rrect(c,x,y,w,h,r,fill,lw=2){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();if(fill){c.fillStyle=fill;c.fill();}pen(c,lw);c.stroke();}
if($('pathCv')){
fig('pathCv',w=>w<560?1.15:2.8,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, k=nr?0.6:1;
  const BASE='#c3ced6', TANK='#eef3f7', PIPE='#f8fbfd', WALL='#d9cba9', DARK='#3b4a59', STAGE='#dbe4eb';
  const fy=h*0.86, y0=h*0.58, gv=h*0.115, y1=y0-gv, pr=11*k;
  const u0=w*(nr?0.02:0.03), u1=w*(nr?0.18:0.215), wx=w*(nr?0.205:0.25), ww=w*(nr?0.028:0.022);
  const tB=(nr?18:15)*Math.PI/180, P1=[w*(nr?0.31:0.37),y0], P2=[P1[0]+gv/Math.tan(2*tB),y1];
  const dM=4*Math.PI/180, K1=[w*(nr?0.565:0.59),y1], K2x=w*(nr?0.665:0.68), y2=y1-(K2x-K1[0])*Math.tan(2*dM), K2=[K2x,y2];
  const S=[w*(nr?0.8:0.815),y2], BS=[S[0]+(nr?10:18),y2], xD=w*(nr?0.915:0.925), dh=h*(nr?0.19:0.215);
  rectF(c,-4,fy,w+8,h,FLOOR);
  // shield wall around the ring, with a port for the beam
  rectF(c,wx,-4,ww,y0-pr+4,WALL);rectF(c,wx,y0+pr,ww,fy-y0-pr,WALL);
  // undulator: a strongback, two girders, two rows of magnets
  const gap=13*k, mh=10*k, gh=15*k, half=gap+mh+gh, nper=nr?5:8, pw=(u1-u0)/(nper*2);
  rectF(c,u0+14*k,y0+half,(u1-u0)-28*k,fy-y0-half,BASE);
  rectF(c,u0-5*k,y0-half-6*k,(u1-u0)+10*k,2*half+12*k,'#e6ecf1',2);
  rectF(c,u0,y0-half,u1-u0,gh,STEEL);rectF(c,u0,y0+gap+mh,u1-u0,gh,STEEL);
  for(let i=0;i<nper*2;i++){rectF(c,u0+i*pw,y0-gap-mh,pw,mh,i%2?BLUE:RED,1.4);rectF(c,u0+i*pw,y0+gap,pw,mh,i%2?RED:BLUE,1.4);}
  // beam pipes
  const mmg=nr?20:46, mkg=nr?22:48, mid=[(P1[0]+P2[0])/2,(P1[1]+P2[1])/2], Rs=Math.hypot(P2[0]-P1[0],P2[1]-P1[1])/2+8*k;
  const mt=[P1[0]-mmg,P2[0]+mmg,mid[1]-Rs-8*k,mid[1]+Rs+8*k], kt=[K1[0]-mkg,K2[0]+mkg,y2-30*k,y1+30*k], xsn=kt[1]+w*(nr?0.028:0.035);
  rectF(c,u1+5*k,y0-pr,mt[0]-u1-5*k,2*pr,PIPE,1.6);rectF(c,mt[1],y1-pr,kt[0]-mt[1],2*pr,PIPE,1.6);rectF(c,kt[1],y2-pr,xsn-kt[1],2*pr,PIPE,1.6);
  // electrons: a slight wiggle through the undulator, then steered away
  const ae=3*k;pen(c,1.8);c.beginPath();c.moveTo(0,y0);c.lineTo(u0,y0);for(let x=u0;x<=u1;x+=1.5)c.lineTo(x,y0+ae*Math.sin((x-u0)/(2*pw)*2*Math.PI));
  const eE=[wx-9*k,y0+pr+22*k];c.quadraticCurveTo(u1+(wx-u1)*0.55,y0,eE[0],eE[1]);c.stroke();
  arrow(c,eE[0]-3*k,eE[1]-7*k,eE[0],eE[1],INK,1.8,7*k);
  const ex=((t*0.14)%1)*u1;electron(c,ex,ex>u0?y0+ae*Math.sin((ex-u0)/(2*pw)*2*Math.PI):y0,nr?4.5:6.5);
  // monochromator tank: a channel-cut crystal on a rotation stage
  rectF(c,mt[0]+12*k,mt[3],mt[1]-mt[0]-24*k,fy-mt[3],BASE);
  rrect(c,mt[0],mt[2],mt[1]-mt[0],mt[3]-mt[2],10*k,TANK);
  disc(c,mid[0],mid[1],Rs,STAGE,1.6);
  const sv=[Math.cos(tB),-Math.sin(tB)], nv=[-Math.sin(tB),-Math.cos(tB)], Pm=(u,v)=>[P1[0]+u*sv[0]+v*nv[0],P1[1]+u*sv[1]+v*nv[1]];
  const g=(P2[0]-P1[0])*nv[0]+(P2[1]-P1[1])*nv[1], u2=(P2[0]-P1[0])*sv[0]+(P2[1]-P1[1])*sv[1], bl=nr?13:24, tb=nr?6:10;
  poly(c,[Pm(-bl,0),Pm(bl,0),Pm(bl,-tb),Pm(-bl,-tb)],STEEL);poly(c,[Pm(u2-bl,g),Pm(u2+bl,g),Pm(u2+bl,g+tb),Pm(u2-bl,g+tb)],STEEL);
  // mirror tank: mirror 1 under the beam, mirror 2 over it
  rectF(c,kt[0]+12*k,kt[3],kt[1]-kt[0]-24*k,fy-kt[3],BASE);
  rrect(c,kt[0],kt[2],kt[1]-kt[0],kt[3]-kt[2],10*k,TANK);
  const ml=nr?15:30, mth=nr?5:8;
  rectF(c,K1[0]-4*k,K1[1]+mth,8*k,kt[3]-K1[1]-mth,BASE,1.6);rectF(c,K2[0]-4*k,kt[2],8*k,K2[1]-mth-kt[2],BASE,1.6);
  c.save();c.translate(K1[0],K1[1]);c.rotate(-dM);rectF(c,-ml,0,2*ml,mth,STEEL);c.restore();
  c.save();c.translate(K2[0],K2[1]);c.rotate(-dM);rectF(c,-ml,-mth,2*ml,mth,STEEL);c.restore();
  // sample on its goniometer, beamstop, detector
  rectF(c,S[0]-26*k,y2+56*k,52*k,fy-y2-56*k,BASE);rectF(c,S[0]-11*k,y2+36*k,22*k,20*k,STEEL);
  rectF(c,xD-8*k,y2+dh,44*k,fy-y2-dh,BASE);
  [0.26,0.52,0.8].forEach(fr=>[1,-1].forEach(sg=>line(c,S[0],S[1],xD,y2-sg*fr*dh,1.4,RED)));
  rectF(c,xD,y2-dh,28*k,2*dh,'#6b7f93');rectF(c,xD,y2-dh,7*k,2*dh,DARK,1.6);
  // the light: a wave that builds up in the undulator and runs along the beam path
  const xw=u0+(u1-u0)*0.45, pts=[[xw,y0],P1,P2,K1,K2,S,BS], A=6*k, lw=nr?10:16, ramp=u1-xw;let s0=0,st=false;
  pen(c,2.4,ORG);c.beginPath();
  for(let i=0;i<pts.length-1;i++){const dx=pts[i+1][0]-pts[i][0],dy=pts[i+1][1]-pts[i][1],Ln=Math.hypot(dx,dy),ux=dx/Ln,uy=dy/Ln;
    for(let q=0;q<=Ln;q+=1.1){const a=A*Math.min(1,(s0+q)/ramp)*Math.sin(2*Math.PI*((s0+q)/lw-t*1.1)),X=pts[i][0]+ux*q-uy*a,Y=pts[i][1]+uy*q+ux*a;st?c.lineTo(X,Y):c.moveTo(X,Y);st=true;}s0+=Ln;}
  c.stroke();
  rectF(c,BS[0],BS[1]-4*k,5*k,8*k,INK,1);
  sampleLoop(c,S[0],S[1],nr?0.7:1);
  const cy=h*(nr?0.08:0.085), cs=nr?11:15;
  cap(c,'Undulator',Math.max((u0+u1)/2,nr?42:0),cy,'center',cs);cap(c,nr?'Mono':'Monochromator',(mt[0]+mt[1])/2,cy,'center',cs);cap(c,nr?'Mirrors':'KB mirrors',(kt[0]+kt[1])/2,cy,'center',cs);
  cap(c,'Sample',S[0],nr?h*0.2:cy,'center',cs);cap(c,'Detector',w-6,cy,'right',cs);
  if(!nr)txt(c,'electrons',eE[0]-4,eE[1]+16,13,'right');
});
}

// ---------- FIVE STATIONS (opening figure of the overview) ----------
function waveAlong(c,pts,t,A,lam,ramp,col=ORG,lw=2.4){let s0=0,st=false;pen(c,lw,col);c.beginPath();
  for(let i=0;i<pts.length-1;i++){const dx=pts[i+1][0]-pts[i][0],dy=pts[i+1][1]-pts[i][1],Ln=Math.hypot(dx,dy),ux=dx/Ln,uy=dy/Ln;
    for(let q=0;q<=Ln;q+=1.1){const a=A*(ramp?Math.min(1,(s0+q)/ramp):1)*Math.sin(2*Math.PI*((s0+q)/lam-t*1.1)),X=pts[i][0]+ux*q-uy*a,Y=pts[i][1]+uy*q+ux*a;st?c.lineTo(X,Y):c.moveTo(X,Y);st=true;}s0+=Ln;}
  c.stroke();}
if($('stationsCv')){
fig('stationsCv',w=>w<560?2.6:3.5,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const nr=w<560, fs=nr?10:15;
  // the sample and the detector sit on the center line of their tiles; the beam steps up to that line through the mono and the mirrors
  const T=nr?w*0.17:Math.min(w*0.15,h*0.52), cyT=h*(nr?0.36:0.38), cx=i=>w*(0.11+i*0.195), y2=cyT, y1=cyT+T*0.05, y0=cyT+T*0.19;
  const names=[['Undulator','makes the X-rays'],['Monochromator','picks one energy'],['KB mirrors','focus the beam'],['Sample','crystal diffracts'],['Detector','records the spots']];
  for(let i=0;i<5;i++)rrect(c,cx(i)-T/2,cyT-T/2,T,T,T*0.1,WHITE,2.5);
  // 1 undulator: the electron wiggles between the magnet rows and carries straight on to the edge of the tile
  const u0=cx(0)-T*0.4,u1=cx(0)+T*0.4,pw=(u1-u0)/8,g=T*0.12,mh=T*0.09,ae=T*0.025,xl=cx(0)-T/2,xrr=cx(0)+T/2;
  for(let i=0;i<8;i++){rectF(c,u0+i*pw,y0-g-mh,pw,mh,i%2?BLUE:RED,1.2);rectF(c,u0+i*pw,y0+g,pw,mh,i%2?RED:BLUE,1.2);}
  const ey=x=>y0+(x>u0&&x<u1?ae*Math.sin((x-u0)/(2*pw)*2*Math.PI):0);
  pen(c,1.6);c.beginPath();c.moveTo(xl,y0);for(let x=u0;x<=u1;x+=1.5)c.lineTo(x,ey(x));c.lineTo(xrr,y0);c.stroke();
  // 2 monochromator
  const P1=[cx(1)-T*0.18,y0],P2=[cx(1)+T*0.14,y1],tB=Math.atan2(y0-y1,P2[0]-P1[0])/2,bl=T*0.17,tb=T*0.07;
  const blade=(P,under)=>{c.save();c.translate(P[0],P[1]);c.rotate(-tB);rectF(c,-bl,under?0:-tb,2*bl,tb,STEEL);c.restore();};blade(P1,true);blade(P2,false);
  // 3 mirrors
  const K1=[cx(2)-T*0.2,y1],K2=[cx(2)+T*0.2,y2],tM=Math.atan2(y1-y2,K2[0]-K1[0])/2,ml=T*0.19,mt=T*0.06;
  const mir=(P,under)=>{c.save();c.translate(P[0],P[1]);c.rotate(-tM);rectF(c,-ml,under?0:-mt,2*ml,mt,GREY);c.restore();};mir(K1,true);mir(K2,false);
  // 4 sample, 5 detector
  const S=[cx(3),y2],BS=[cx(3)+T*0.2,y2],xD=cx(4)-T*0.07,dh=T*0.38;
  [0.25,0.55,0.85].forEach(fr=>[1,-1].forEach(sg=>line(c,S[0],S[1],xD,y2-sg*fr*dh,1.3,RED)));
  rectF(c,xD,y2-dh,T*0.14,2*dh,'#6b7f93');rectF(c,xD,y2-dh,T*0.04,2*dh,'#3b4a59',1.4);
  waveAlong(c,[[cx(0)-T*0.05,y0],P1,P2,K1,K2,S,BS],t,nr?3:6,nr?9:15,T*0.4);
  const ex=xl+((t*0.2)%1)*T;electron(c,ex,ey(ex),nr?3.5:5.5);
  rectF(c,BS[0],BS[1]-T*0.03,T*0.035,T*0.06,INK,1);
  line(c,S[0],S[1]+T*0.06,S[0],cyT+T/2,2.4);disc(c,S[0],S[1],T*0.065,WHITE,2);poly(c,[[S[0]-T*0.035,S[1]],[S[0],S[1]-T*0.035],[S[0]+T*0.035,S[1]],[S[0],S[1]+T*0.035]],GRN,1.2);
  for(let i=0;i<5;i++){const nx=cx(i)-T/2, ny=cyT-T/2, r=nr?9:13;disc(c,nx,ny,r,RED,2);txt(c,String(i+1),nx,ny+1,nr?12:16,'center',WHITE);
    cap(c,nr&&i===1?'Mono':nr&&i===2?'Mirrors':names[i][0],cx(i),cyT+T/2+(nr?18:24),'center',fs);if(!nr)txt(c,names[i][1],cx(i),cyT+T/2+50,15,'center');}
});
}

// ---------- RING ----------
function packet(c,x,y,dx,dy,amp=6,len=11){pen(c,2.2,ORG);c.beginPath();for(let u=-len;u<=len;u+=1.2){const a=amp*Math.exp(-u*u/(len*len*0.42))*Math.cos(u*0.95),X=x+dx*u-dy*a,Y=y+dy*u+dx*a;u===-len?c.moveTo(X,Y):c.lineTo(X,Y);}c.stroke();}
if($('ringCv')){
fig('ringCv',w=>w<560?0.8:2.1,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const cx=narrow?w*0.5:w*0.24, cy=narrow?h*0.27:h*0.54, R=narrow?Math.min(w*0.3,h*0.2):Math.min(w*0.17,h*0.36), a24=narrow?1.15:-0.35, da=Math.PI/40;
  disc(c,cx,cy,R,WHITE,2.5);
  c.beginPath();c.moveTo(cx+(R-12)*Math.cos(a24-da),cy+(R-12)*Math.sin(a24-da));c.arc(cx,cy,R,a24-da,a24+da);c.arc(cx,cy,R-12,a24+da,a24-da,true);c.closePath();c.fillStyle=RED;c.fill();
  disc(c,cx,cy,R-12,SKY,2);
  for(let i=0;i<40;i++){const a=a24+da+i/40*2*Math.PI;line(c,cx+(R-12)*Math.cos(a),cy+(R-12)*Math.sin(a),cx+R*Math.cos(a),cy+R*Math.sin(a),1);}
  const nb=Math.min(PS.nb,36);for(let i=0;i<nb;i++){const a=i/nb*2*Math.PI+t*0.7;disc(c,cx+(R-6)*Math.cos(a),cy+(R-6)*Math.sin(a),2.6,YEL,1.2);}
  txt(c,'storage ring',cx,cy-22,fs,'center');txt(c,'1.1 km around',cx,cy-4,fs,'center');txt(c,PS.Ee+' GeV, '+PS.I+' mA',cx,cy+14,fs,'center');txt(c,PS.nb+' bunches',cx,cy+32,fs,'center');
  const sx=cx+(R+4)*Math.cos(a24), sy=cy+(R+4)*Math.sin(a24);
  txt(c,'sector 24',sx+10,sy-(narrow?4:16),fs,'left',RED);
  const bx=narrow?w*0.05:w*0.48, by=narrow?h*0.52:h*0.2, bw=narrow?w*0.9:w*0.48, bh=narrow?h*0.42:h*0.66;
  line(c,sx,sy,bx,by,1.6,INK,[4,5]);line(c,sx,sy,bx,by+bh,1.6,INK,[4,5]);
  rectF(c,bx,by,bw,bh,WHITE,2.5);
  // sector 24 straight section: the electron path is kinked between the two undulators, so each one points its light a different way
  const th=narrow?0.15:0.11, d1=[Math.cos(th),-Math.sin(th)], d2=[Math.cos(th),Math.sin(th)], K=[bx+bw*0.42,by+bh*0.5];
  c.font=(fs-2)+'px '+HAND;const xr=bx+bw-c.measureText('TO 24-ID-C').width-30, lh=(fs+8)/2+5;
  const L1=(K[0]-bx-4)/d1[0], L2=bw*0.27, S=[K[0]-L1*d1[0],K[1]-L1*d1[1]], E=[K[0]+L2*d2[0],K[1]+L2*d2[1]];
  const Cq=[E[0]+bw*0.12*d2[0],E[1]+bw*0.12*d2[1]], Q=[E[0]+bw*0.25,E[1]+bh*0.16], Lc=Math.hypot(Q[0]-E[0],Q[1]-E[1])*1.03;
  const B1=[xr,K[1]-(xr-K[0])*Math.tan(th)], B2=[xr,K[1]+(xr-K[0])*Math.tan(th)];
  const post=PKEY.endsWith('post'), lu1=post?'3.0':'3.3', lu2=post?'2.1':'3.3', ul=bw*0.2;
  const U1a=bw*0.31, U2a=bw*0.045;
  line(c,K[0]-U1a*d1[0],K[1]-U1a*d1[1],B1[0],B1[1],1.6,BLUE,[5,5]);line(c,K[0]+U2a*d2[0],K[1]+U2a*d2[1],B2[0],B2[1],1.6,BLUE,[5,5]);
  const und=(u0,d,rot)=>{const ccx=K[0]+(u0+ul/2)*d[0], ccy=K[1]+(u0+ul/2)*d[1];c.save();c.translate(ccx,ccy);c.rotate(rot);const n=8,pw=ul/n;for(let i=0;i<n;i++)rectF(c,-ul/2+i*pw,-11,pw,22,i%2?LTBLUE:LTRED,1.6);c.restore();return [ccx,ccy];};
  const c1=und(-U1a,d1,-th), c2=und(U2a,d2,th);
  pen(c,2.2);c.beginPath();c.moveTo(S[0],S[1]);c.lineTo(K[0],K[1]);c.lineTo(E[0],E[1]);c.quadraticCurveTo(Cq[0],Cq[1],Q[0],Q[1]);c.stroke();
  rectF(c,K[0]-4,K[1]-12,8,24,GREY,1.6);
  // one electron bunch travels through; each undulator sends out light while the bunch is inside it
  const tot=L1+L2+Lc, Tc=5.6, ve=tot/Tc, vp=ve*1.4, tau=(t+0.5*Tc)%Tc, se=ve*tau;
  let ep;if(se<=L1)ep=[S[0]+se*d1[0],S[1]+se*d1[1]];else if(se<=L1+L2)ep=[K[0]+(se-L1)*d2[0],K[1]+(se-L1)*d2[1]];
  else{const q=Math.min(1,(se-L1-L2)/Lc),m=1-q;ep=[m*m*E[0]+2*m*q*Cq[0]+q*q*Q[0],m*m*E[1]+2*m*q*Cq[1]+q*q*Q[1]];}
  // light made inside an undulator: a wave train from the light emitted at the entrance (head) back to the light being emitted now, or at the exit (tail)
  const train=(sA,d)=>{if(se<sA)return;const sT=Math.min(se,sA+ul), head=(sA-L1)+vp*(tau-sA/ve), tail=(sT-L1)+vp*(tau-sT/ve), lim=(xr-12-K[0])/d[0], h2=Math.min(head,lim);
    if(tail>=h2-2)return;const A=narrow?5:6;pen(c,2.2,ORG);c.beginPath();
    for(let o=tail;o<=h2;o+=1.2){const env=Math.min(1,(o-tail)/8,(head-o)/8), a=A*Math.max(0,env)*Math.sin((o-head)*0.95), X=K[0]+o*d[0]-d[1]*a, Y=K[1]+o*d[1]+d[0]*a;o===tail?c.moveTo(X,Y):c.lineTo(X,Y);}c.stroke();};
  train(L1-U1a,d1);train(L1+U2a,d2);
  electron(c,ep[0],ep[1],6);
  arrow(c,B1[0]-14*d1[0],B1[1]-14*d1[1],B1[0],B1[1],BLUE,2.4,8);arrow(c,B2[0]-14*d2[0],B2[1]-14*d2[1],B2[0],B2[1],BLUE,2.4,8);
  cap(c,'to 24-ID-C',xr+6,B1[1]-lh,'left',fs-2);cap(c,'to 24-ID-E',xr+6,B2[1]-lh,'left',fs-2);
  txt(c,'λu = '+lu1+' cm',c1[0],c1[1]+28,fs-1,'center');txt(c,'λu = '+lu2+' cm',c2[0]-ul*0.2,c2[1]+30,fs-1,'center');
  txt(c,'electrons bend away',Q[0],Q[1]+16,fs-1,'right');
  cap(c,narrow?'Sector 24 from above':'Sector 24 from above: two undulators',bx+8,by+16,'left',narrow?12:14);
});
}

// ---------- KB MIRRORS ----------
if($('kbCv')){
const M=[{k:1,p:0,r:0,y:0,h:0},{k:1,p:0,r:0,y:0,h:0}];let ksel=0,kres={};
const kbFig=fig('kbCv',w=>w<560?0.6:1.75,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const a0=7*Math.PI/180, dl=2*a0, tn=Math.tan(dl), x0=w*0.02, xm1=w*(narrow?0.22:0.2), xm2=w*(narrow?0.55:0.5), xs=w*(narrow?0.84:0.72), hb=narrow?4.5:8;
  const Lh=hb/Math.sin(a0)*(narrow?1.3:1.6), mth=narrow?7:10, xe=xs+(narrow?14:26), rad=Math.PI/180;
  const view=(yA,xm,m,o,first)=>{ // m: the mirror that focuses in this view, seen edge-on; o: the other mirror, seen face-on
    const al=a0+m.p*rad, uh=[Math.cos(al),-Math.sin(al)], nh=[-Math.sin(al),-Math.cos(al)], hm=m.h*hb/8, C=[xm+hm*nh[0],yA+hm*nh[1]];
    const Sp=[xs,yA-(xs-xm)*tn], q0=Math.hypot(xs-xm,(xs-xm)*tn), qf=q0/m.k*Math.sin(al)/Math.sin(a0), F=[C[0]+qf*Math.cos(2*al),C[1]-qf*Math.sin(2*al)];
    const sag=(narrow?0.5:1.8)*m.k, cq=sag/(Lh*Lh);
    const xo=first?xm2:xm1, yo=first?yA-(xo-xm)*tn:yA, fw=Math.max(3,(hb+7)*Math.cos(o.r*rad));
    c.save();c.translate(xo,yo);c.rotate((first?-dl:0)-o.y*rad);rectF(c,-Lh,-fw,2*Lh,2*fw,'#d6e0ea',1.6);c.restore();
    const thick=mth+4+18*Math.abs(Math.sin(m.r*rad));
    c.save();c.translate(C[0],C[1]);c.rotate(-al);c.beginPath();c.moveTo(-Lh,-sag);c.quadraticCurveTo(0,sag,Lh,-sag);c.lineTo(Lh,thick);c.lineTo(-Lh,thick);c.closePath();c.fillStyle=STEEL;c.fill();pen(c,2);c.stroke();c.restore();
    const ys=[];
    [-1,-0.5,0,0.5,1].forEach(fr=>{const yy=yA+fr*hb, ax=x0-C[0], ay=yy-C[1], au=ax*uh[0]+ay*uh[1], an=ax*nh[0]+ay*nh[1];
      const A=cq*uh[0]*uh[0], B=2*cq*au*uh[0]-nh[0], Cc=cq*au*au-an, tE=(-Lh-au)/uh[0], gE=an+tE*nh[0]-cq*Lh*Lh;let tH=null;
      if(gE<0){line(c,x0,yy,x0+tE,yy,1.8,BLUE);return;}                          // arrives below the upstream end: blocked by the end of the mirror
      if(A<1e-9)tH=-Cc/B;else{const D=B*B-4*A*Cc;if(D>=0)tH=(-B+Math.sqrt(D))/(2*A);}
      const uH=tH===null?1e9:au+tH*uh[0];
      if(uH>Lh){line(c,x0,yy,xe,yy,1.4,BLUE,[4,5]);return;}                      // passes the mirror without touching it
      const H=[x0+tH,yy], ux=F[0]-H[0], uy=F[1]-H[1];line(c,x0,yy,H[0],H[1],1.8,BLUE);line(c,H[0],H[1],xe,H[1]+uy*(xe-H[0])/ux,1.8,BLUE);ys.push(H[1]+uy*(xs-H[0])/ux);});
    line(c,xs,Sp[1]-24,xs,Sp[1]+24,1.6,INK,[3,4]);
    disc(c,Sp[0],Sp[1],narrow?6:8,WHITE,2);poly(c,[[Sp[0]-4,Sp[1]],[Sp[0],Sp[1]-4],[Sp[0]+4,Sp[1]],[Sp[0],Sp[1]+4]],GRN,1.4);
    // the same mirror's bend, greatly magnified, so that changes in the curve can be seen
    const gy=yA+mth+(narrow?34:40), gl=narrow?44:62, gs=(4+9*m.k)*(narrow?0.6:1);
    c.beginPath();c.moveTo(xm-gl,gy-gs);c.quadraticCurveTo(xm,gy+gs,xm+gl,gy-gs);c.lineTo(xm+gl,gy-gs+9);c.quadraticCurveTo(xm,gy+gs+9,xm-gl,gy-gs+9);c.closePath();c.fillStyle=STEEL;c.fill();pen(c,2);c.stroke();
    txt(c,(first?'mirror 1':'mirror 2')+': its bend, magnified',xm,gy+Math.max(gs,8)+(narrow?20:24),fs-1,'center');
    const mean=ys.length?ys.reduce((p,q)=>p+q,0)/ys.length:0, spread=ys.length?Math.max(...ys.map(v=>Math.abs(v-mean))):0;
    return {Sp,xo,yo,n:ys.length,off:mean-Sp[1],spread};};
  const yV=narrow?h*0.22:h*0.4, yH=narrow?h*0.56:h*0.8;
  const v1=view(yV,xm1,M[0],M[1],true), v2=view(yH,xm2,M[1],M[0],false);
  cap(c,'Side view',12,18,'left',narrow?12:15);cap(c,'Top view',12,narrow?h*0.39:h*0.54,'left',narrow?12:15);
  txt(c,'mirror 2, seen from the side',v1.xo-10,v1.yo-hb-(narrow?26:36),fs-1,'center');
  txt(c,'mirror 1, seen from above',v2.xo,v2.yo-hb-(narrow?20:24),fs-1,'center');
  txt(c,'sample',v1.Sp[0],v1.Sp[1]-34,fs-1,'center');txt(c,'sample',v2.Sp[0],v2.Sp[1]-34,fs-1,'center');
  txt(c,'beam from the mono',x0+4,yV-hb-16,fs-1,'left');
  // beam cross-section at the sample, on one scale for size and position
  const bs=narrow?Math.min(w*0.34,h*0.2):Math.min(w*0.2,h*0.5), bx=narrow?w*0.5-bs/2:w*0.985-bs, byy=narrow?h*0.765:h*0.3, sI=bs/(8*hb);
  rectF(c,bx,byy,bs,bs,WHITE,2.5);line(c,bx,byy+bs/2,bx+bs,byy+bs/2,1,GREY);line(c,bx+bs/2,byy,bx+bs/2,byy+bs,1,GREY);
  const dX=-v2.off+(xs-xm1)*Math.tan(dl*Math.sin(M[0].r*rad)), dY=v1.off-(xs-xm2)*Math.tan(dl*Math.sin(M[1].r*rad));
  const some=v1.n>0&&v2.n>0;
  if(some){c.save();c.beginPath();c.rect(bx,byy,bs,bs);c.clip();c.beginPath();c.ellipse(bx+bs/2+dX*sI,byy+bs/2+dY*sI,Math.max(3,v2.spread*sI),Math.max(2.5,v1.spread*sI),(M[0].y+M[1].y)*0.4*rad,0,7);c.fillStyle=ORG;c.fill();pen(c,1.8);c.stroke();c.restore();pen(c,2.5);c.strokeRect(bx,byy,bs,bs);}
  else txt(c,'no beam',bx+bs/2,byy+bs/2-14,fs,'center');
  cap(c,'Beam at the sample',bx+bs/2,byy-14,'center',narrow?12:14);
  kres={v1,v2,dX,dY,hb,sI,some};
},false);
const KL=[['kbK','k',v=>v.toFixed(2)],['kbP','p',v=>(v>0?'+':'')+v.toFixed(2)+'°'],['kbR','r',v=>(v>0?'+':'')+v.toFixed(0)+'°'],['kbY','y',v=>(v>0?'+':'')+v.toFixed(0)+'°'],['kbT','h',v=>(v>0?'+':'')+v.toFixed(0)]];
function kbShow(){kbFig.w&&kbFig.draw(kbFig);const q=kres;if(!q.v1)return;
  const sz=sp=>{const n=Math.max(1,sp*q.sI/3);return n<1.15?'in focus':n.toFixed(1)+'× larger';};
  $('kbV').textContent=q.some?sz(q.v1.spread):'no beam';$('kbH').textContent=q.some?sz(q.v2.spread):'no beam';
  const th=0.12*q.hb,parts=[];if(q.dY<-th)parts.push('up');if(q.dY>th)parts.push('down');if(q.dX>th)parts.push('right');if(q.dX<-th)parts.push('left');
  $('kbPos').textContent=!q.some?'no beam':parts.length?'shifted '+parts.join(' and '):'on the sample';
  const m1=q.v1.n<5,m2=q.v2.n<5;$('kbOn').textContent=!q.some?'none reaches the sample':m1&&m2?'part misses both mirrors':m1?'part misses mirror 1':m2?'part misses mirror 2':'all of it';}
function kbLoad(){KL.forEach(([id,key,fm])=>{$(id).value=M[ksel][key];$(id+'O').textContent=fm(+M[ksel][key]);});$('kbTL').textContent=ksel===0?'Up / down':'In / out';}
KL.forEach(([id,key,fm])=>$(id).addEventListener('input',()=>{M[ksel][key]=+$(id).value;$(id+'O').textContent=fm(M[ksel][key]);kbShow();}));
$('kbSel').addEventListener('change',e=>{ksel=+e.target.value;kbLoad();});
$('kbReset').addEventListener('click',()=>{M.forEach(m=>{m.k=1;m.p=0;m.r=0;m.y=0;m.h=0;});kbLoad();kbShow();});
kbLoad();kbShow();new ResizeObserver(()=>setTimeout(kbShow,0)).observe($('kbCv'));
}

// ---------- DIFFRACTION ----------
if($('diffCv')){
let dE=E0,dD=300,dGeo=null,dDrag=false;const HW=155.6,HC=Math.hypot(155.6,163.9),BSR=0.15,BSL=25; // beamstop radius and distance in mm: illustrative values
const lowRes=E=>12.398/E/(2*Math.sin(Math.atan(BSR/BSL)/2));
const diffFig=fig('diffCv',w=>w<560?0.85:1.75,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:14;
  const xs=w*(narrow?0.17:0.1), y0=h*(narrow?0.33:0.36), sc=(w*(narrow?0.76:0.8))/900, xd=xs+dD*sc, hh=HW*sc, top=narrow?50:54, bot=2*y0-top, xr=w*0.985;
  const lam=12.398/dE, list=(narrow?[4,2.5,1.8,1.3,1.0]:[6,4,3,2.5,2,1.6,1.3,1.1,0.95]).filter(d=>lam/(2*d)<0.62);
  const ang=d=>2*Math.asin(lam/(2*d)), a50=ang(50);
  const end=(a,sg)=>{const x=Math.min(xr,xs+(sg>0?(y0-top):(bot-y0))/Math.tan(a));return [x,y0-sg*(x-xs)*Math.tan(a)];};
  const amax=ang(list[list.length-1]), eu=end(amax,1), ed=end(amax,-1), fan=[[xs,y0],eu];
  if(eu[0]<xr)fan.push([xr,top]);if(ed[0]<xr)fan.push([xr,bot]);fan.push(ed);
  c.beginPath();fan.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#fff6d9';c.fill();
  const te=Math.atan(HW/dD), tc=Math.min(te,amax), yc=(xd-xs)*Math.tan(tc);
  poly(c,[[xs,y0],[xd,y0-yc],[xd,y0+yc]],LTYEL,1.2);
  list.forEach(d=>{const a=ang(d), hit=(xd-xs)*Math.tan(a), rec=hit<=hh;[1,-1].forEach(sg=>{const e=end(a,sg);
      line(c,xs,y0,e[0],e[1],1.2,'#e3948a',[4,5]);
      if(rec){line(c,xs,y0,xd,y0-sg*hit,2,RED);disc(c,xd,y0-sg*hit,2.6,RED,1);}
      if(sg>0){if(e[0]<xr)txt(c,d+' Å',e[0],top-11,fs,'center',rec?RED:INK);else txt(c,d+' Å',xr-2,e[1]-10,fs,'right',rec?RED:INK);}});});
  [1,-1].forEach(sg=>line(c,xs,y0,xd,y0-sg*(xd-xs)*Math.tan(a50),1.8,GRN));
  const xb=xs+(narrow?20:32);
  line(c,w*0.015,y0,xb,y0,3,BLUE);rectF(c,xb,y0-3,5,6,INK,1);
  rectF(c,xd,y0-hh,12,2*hh,dDrag?ORG:'#6b7f93');[-8,0,8].forEach(o=>line(c,xd+3,y0+o,xd+9,y0+o,1.4,WHITE));
  dGeo={xs,sc,xd,y0,hh};
  txt(c,'50 Å',xd-8,y0-14,fs,'right',GRN);
  sampleLoop(c,xs,y0,narrow?0.8:1);
  txt(c,'beam',w*0.015,y0-14,fs,'left');txt(c,'sample',xs-10,y0+26,fs,'right');
  cap(c,'beamstop',xb+12,y0+24,'left',narrow?10:11);
  const dmin=lam/(2*Math.sin(te/2));
  cap(c,dmin.toFixed(2)+' Å at the detector edge',Math.min(xd+20,w-10-(narrow?150:190)),Math.max(top+16,y0-hh+2),'left',narrow?11:13);
  txt(c,narrow?'detector: drag it':'area detector: drag it left or right',Math.min(xd+22,w-8-(narrow?100:210)),Math.min(bot+2,y0+hh+14),fs,'left');
  const yd=bot+(narrow?34:40);line(c,xs,yd,xd,yd,2);line(c,xs,yd-5,xs,yd+5,2);line(c,xd,yd-5,xd,yd+5,2);txt(c,'D = '+dD+' mm',(xs+xd)/2,yd-13,fs,'center');
  cap(c,'Side view of the endstation',12,18,'left',narrow?12:15);
  if(!narrow)txt(c,'resolution of each diffracted ray',xr,18,fs,'right');
  // close-up of the first 60 mm behind the sample, with the height stretched, to show what the beamstop hides
  const sh=h*(narrow?0.11:0.1), ys0=h*(narrow?0.855:0.865), zx=w*0.03, zw=w*0.94, xz=zx+zw*0.1, pm=(zw*0.88)/60, vz=sh*0.85/1.3, xbz=xz+BSL*pm, xR=zx+zw;
  rectF(c,zx,ys0-sh,zw,2*sh,WHITE,2.5);
  c.save();c.beginPath();c.rect(zx,ys0-sh,zw,2*sh);c.clip();
  const shE=(xR-xz)/pm*BSR/BSL*vz;
  c.beginPath();c.moveTo(xbz,ys0-BSR*vz);c.lineTo(xR,ys0-shE);c.lineTo(xR,ys0+shE);c.lineTo(xbz,ys0+BSR*vz);c.closePath();c.fillStyle='#d3d9df';c.fill();
  [1,-1].forEach(sg=>{line(c,xz,ys0,xR,ys0-sg*shE,1.4,INK,[4,4]);line(c,xz,ys0,xR,ys0-sg*(xR-xz)/pm*Math.tan(a50)*vz,2.2,GRN);});
  line(c,zx,ys0,xbz,ys0,3,BLUE);rectF(c,xbz,ys0-BSR*vz,6,2*BSR*vz,INK,1);
  disc(c,xz,ys0,6,WHITE,2);poly(c,[[xz-3.5,ys0],[xz,ys0-3.5],[xz+3.5,ys0],[xz,ys0+3.5]],GRN,1.2);
  c.restore();pen(c,2.5);c.strokeRect(zx,ys0-sh,zw,2*sh);
  cap(c,narrow?'Close-up, height stretched':'Close-up behind the sample, height stretched',zx+8,ys0-sh-13,'left',narrow?11:13);
  txt(c,narrow?'50 Å rays clear it':'50 Å rays pass the beamstop',xR-8,ys0-sh+12,fs,'right',GRN);
  txt(c,narrow?'gray: beamstop shadow':'gray: hidden by the beamstop',xR-8,ys0+sh-12,fs,'right');
  txt(c,BSL+' mm',xbz+3,ys0+sh-12,fs-1,'center');
},false);
function dUpd(){dE=+$('dE').value;dD=+$('dD').value;$('dEO').textContent=dE.toFixed(3)+' keV';$('dDO').textContent=dD+' mm';
  const lam=12.398/dE, res=r=>lam/(2*Math.sin(Math.atan(r/dD)/2));
  $('dLam').textContent=lam.toFixed(3)+' Å';$('dEdge').textContent=res(HW).toFixed(2)+' Å';$('dCor').textContent=res(HC).toFixed(2)+' Å';$('dLow').textContent=lowRes(dE).toFixed(0)+' Å';diffFig.w&&diffFig.draw(diffFig);}
['dE','dD'].forEach(id=>$(id).addEventListener('input',dUpd));dUpd();
// drag the detector directly on the drawing
{const cv=$('diffCv'), pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
  const near=e=>{if(!dGeo)return false;const [x,y]=pos(e);return Math.abs(x-dGeo.xd-6)<26&&Math.abs(y-dGeo.y0)<dGeo.hh+14;};
  const setD=e=>{const [x]=pos(e), v=Math.max(100,Math.min(900,Math.round((x-6-dGeo.xs)/dGeo.sc/5)*5));$('dD').value=v;dUpd();};
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{if(near(e)){dDrag=true;cv.setPointerCapture(e.pointerId);setD(e);e.preventDefault();}});
  cv.addEventListener('pointermove',e=>{if(dDrag)setD(e);else cv.style.cursor=near(e)?'ew-resize':'default';});
  const stop=()=>{if(dDrag){dDrag=false;dUpd();}};cv.addEventListener('pointerup',stop);cv.addEventListener('pointercancel',stop);}
hooks.push(()=>{$('dE').value=E0;dUpd();});
}

// ---------- scatter model: water, independent atoms (form factors and incoherent functions from xraylib) ----------
const WDX=0.025, WF2=__WF2__, WS=__WS__;
function wI(arr,x){const q=x/WDX,i=Math.min(arr.length-2,Math.max(0,Math.floor(q))),fr=Math.min(1,q-i);return arr[i]*(1-fr)+arr[i+1]*fr;}
function scat2(n,E,P){const cz=Math.max(-1,Math.min(1,n[2])),x=Math.sqrt((1-cz)/2)*E/12.398,e2=n[0]*n[0];
  const pol=P*(1-e2)+(1-P)*(1+cz*cz)/2, k=1/(1+E/511*(1-cz));
  return [wI(WF2,x)*pol, wI(WS,x)*0.5*k*k*(1/k+k-2*(P*e2+(1-P)*(1-cz*cz)/2))];}
function scatCone(az,el,E,P,cone){const b=az*Math.PI/180,e=el*Math.PI/180,a=[Math.cos(e)*Math.sin(b),Math.sin(e),Math.cos(e)*Math.cos(b)];
  const u=[Math.cos(b),0,-Math.sin(b)], v=[a[1]*u[2]-a[2]*u[1],a[2]*u[0]-a[0]*u[2],a[0]*u[1]-a[1]*u[0]], al=cone*Math.PI/180;
  let se=0,sc=0,n=0;const R=5,T=12;
  for(let i=0;i<=R;i++){const r=al*i/R,m=i===0?1:T;for(let j=0;j<m;j++){const ph=j/m*2*Math.PI,du=r*Math.cos(ph),dv=r*Math.sin(ph);
    let d=[a[0]+du*u[0]+dv*v[0],a[1]+du*u[1]+dv*v[1],a[2]+du*u[2]+dv*v[2]];const Ln=Math.hypot(d[0],d[1],d[2]);d=[d[0]/Ln,d[1]/Ln,d[2]/Ln];
    const q=scat2(d,E,P),ww=(i===0?0.25:i)/m;se+=q[0]*ww;sc+=q[1]*ww;n+=ww;}}
  return [se/n,sc/n];}
const comptonE=(E,deg)=>E/(1+E/511*(1-Math.cos(deg*Math.PI/180)));
// Se K-alpha fluorescence from one atom just above its K edge, per steradian, in units of r_e^2 (xraylib: 69.9 cm2/g into 4 pi). K-beta adds 0.158 of that.
const SEKA=9181, SEKB=0.158, WMASS=18.015, RPUP=2.4, D0=15;
// an illustrative selenomethionine-like edge: a step at 12.658 keV with a white line just above it
const seEdge=E=>1/(1+Math.exp(-(E-12.658)/0.0009))+0.5*Math.exp(-0.5*((E-12.6605)/0.002)**2);
const alphaAt=d=>Math.atan(RPUP/d)*180/Math.PI;
function tag(c,s,x,y,align='left',size=15,col=INK){c.font=`${size}px ${HAND}`;const tw=c.measureText(s).width,pw=tw+10,ph=size+6,x0=align==='center'?x-pw/2:align==='right'?x-pw:x;
  c.fillStyle=WHITE;c.fillRect(x0,y-ph/2,pw,ph);pen(c,1.6);c.strokeRect(x0,y-ph/2,pw,ph);c.fillStyle=col;c.textAlign='left';c.textBaseline='middle';c.fillText(s,x0+5,y+1);}
// seeded random numbers, so that figures do not flicker
function rng(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}

// ---------- SPECTRUM ----------
if($('specCv')){
let xAz=90,xE=E0,xP=0.98,xM=20;
function xParts(){const q=scatCone(xAz,0,xE,xP,9), nW=xM*1000/WMASS, fl=SEKA*seEdge(xE);return {el:q[0]*nW,co:q[1]*nW,ka:fl,kb:fl*SEKB};}
const specFig=fig('specCv',w=>w<560?1.2:2.4,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const x0=w*0.07,x1=w*0.97,y0=h*0.2,y1=h*0.84,Ea=10.7,Eb=13.7, X=E=>x0+(E-Ea)/(Eb-Ea)*(x1-x0);
  const p=xParts(), Ec=comptonE(xE,xAz), u=1/SEKA;
  // peak heights from areas: height = area / width
  const pk=[[11.222,p.ka*u,0.058,'Se Kα'],[12.496,p.kb*u,0.06,'Se Kβ'],[Ec,p.co*u*0.058/0.085,0.085,'Compton'],[xE,p.el*u,0.058,'elastic']];
  const val=E=>pk.reduce((s,q)=>s+q[1]*Math.exp(-0.5*((E-q[0])/q[2])**2),0);
  let ym=0.5;for(let i=0;i<=600;i++)ym=Math.max(ym,val(Ea+(Eb-Ea)*i/600)*1.5);
  const Y=v=>y1-(y1-y0)*v/ym;
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  c.fillStyle=LTGRN;c.fillRect(X(11.0),y0+1.5,X(11.45)-X(11.0),y1-y0-3);
  c.beginPath();c.moveTo(x0,y1);for(let i=0;i<=600;i++){const E=Ea+(Eb-Ea)*i/600;c.lineTo(X(E),Y(val(E)));}c.lineTo(x1,y1);c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,2.4);c.stroke();
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  for(let E=11;E<=13.5;E+=0.5){line(c,X(E),y1,X(E),y1+5,1.6);txt(c,E.toFixed(1),X(E),y1+16,fs-1,'center');}
  txt(c,'photon energy (keV)',(x0+x1)/2,y1+34,fs,'center');
  const lev=[0,2,1,3];
  pk.forEach((q,i)=>{if(q[1]<ym*0.004)return;const yy=y0+14+lev[i]*17, col=i<2?GRN:i===2?BLUE:RED, top=Y(val(q[0]));
    if(top>yy+12)line(c,X(q[0]),yy+9,X(q[0]),top-3,1.2,col,[2,3]);
    txt(c,q[3],X(q[0]),yy,fs,i===3?'left':i===2?'right':'center',col);});
  txt(c,'edge-scan window',X(11.47)+4,y0+14,fs-2,'left');
  cap(c,'What the fluorescence detector sees',12,18,'left',narrow?12:15);
  txt(c,'counts',x0-6,y0-12,fs-1,'left');
},false);
function xUpd(){xAz=+$('xAz').value;xE=+$('xE').value;xM=Math.pow(10,+$('xM').value);$('xAzO').textContent=xAz+'°';$('xEO').textContent=xE.toFixed(3)+' keV';
  $('xMO').textContent='1 Se per '+(xM<100?xM.toFixed(0):Math.round(xM/10)*10)+' kDa';
  const id=scatCone(90,0,xE,xP,9), q=scatCone(xAz,0,xE,xP,9), r=(q[0]+q[1])/(id[0]+id[1]), p=xParts(), sh=(p.ka+p.kb)/(p.ka+p.kb+p.el+p.co);
  $('xC').textContent=comptonE(xE,xAz).toFixed(2)+' keV';$('xRel').textContent=r.toFixed(r<10?2:1)+'×';
  $('xF').textContent=xE<12.655?'none: below the Se K edge':(100*sh).toFixed(sh<0.1?1:0)+'% of all counts';specFig.w&&specFig.draw(specFig);}
['xAz','xE','xM'].forEach(id=>$(id).addEventListener('input',xUpd));xUpd();
hooks.push(()=>{xP=CUR.Pout;xUpd();});
}

// ---------- SWEEP ----------
if($('sweepCv')){
let vMode='h',vPos=110,vE=E0,vP=0.98,vCone=9,curve=[];
function vCalc(){const id=scatCone(90,0,vE,vP,vCone),T0=id[0]+id[1];curve=[];
  const a=vMode==='h'?10:0,b=vMode==='h'?170:90;for(let i=0;i<=80;i++){const x=a+(b-a)*i/80,q=vMode==='h'?scatCone(x,0,vE,vP,vCone):scatCone(90,x,vE,vP,vCone);curve.push([x,q[0]/T0,q[1]/T0]);}}
const sweepFig=fig('sweepCv',w=>w<560?1.0:2.0,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const x0=w*(narrow?0.14:0.08),x1=w*0.96,y0=h*0.14,y1=h*0.82,a=vMode==='h'?10:0,b=vMode==='h'?170:90,lo=-1,hi=3;
  const X=v=>x0+(v-a)/(b-a)*(x1-x0), Y=v=>y1-(Math.log10(Math.max(v,1e-3))-lo)/(hi-lo)*(y1-y0);
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  for(let d=lo;d<=hi;d++){if(d>lo&&d<hi)line(c,x0,Y(10**d),x1,Y(10**d),1,GREY);txt(c,d<0?'0.1×':(10**d)+'×',x0-6,Y(10**d),fs-1,'right');}
  line(c,x0,Y(1),x1,Y(1),1.6,INK,[5,5]);
  for(let v=vMode==='h'?30:0;v<=b;v+=vMode==='h'?30:15){line(c,X(v),y1,X(v),y1+5,1.6);txt(c,v+'°',X(v),y1+16,fs-1,'center');}
  txt(c,vMode==='h'?'SDD angle from the beam, in the horizontal plane':'SDD elevation above the horizontal plane, at 90° to the beam',(x0+x1)/2,y1+34,fs,'center');
  if(vMode==='h'&&!narrow){txt(c,'← toward the beamstop',x0+8,y1-12,fs-1,'left');txt(c,'toward the source →',x1-8,y1-12,fs-1,'right');}
  c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
  [[1,BLUE,2.4],[2,RED,2.4],[0,INK,3.4]].forEach(([k,col,lw])=>{pen(c,lw,col);c.beginPath();curve.forEach((p,i)=>{const v=k===0?p[1]+p[2]:k===1?p[2]:p[1];i?c.lineTo(X(p[0]),Y(v)):c.moveTo(X(p[0]),Y(v));});c.stroke();});
  c.restore();
  const ix=vMode==='h'?90:0;line(c,X(ix),y0,X(ix),y1,1.6,GRN,[3,4]);txt(c,'ideal spot',X(ix)+(vMode==='h'?0:6),y0-10,fs-1,vMode==='h'?'center':'left',GRN);
  const q=vMode==='h'?scatCone(vPos,0,vE,vP,vCone):scatCone(90,vPos,vE,vP,vCone),id=scatCone(90,0,vE,vP,vCone),r=(q[0]+q[1])/(id[0]+id[1]);
  line(c,X(vPos),y0,X(vPos),y1,1.6,INK,[2,4]);disc(c,X(vPos),Y(r),6,ORG,2);
  tag(c,r.toFixed(r<10?1:0)+'×',X(vPos)+(X(vPos)>x1-70?-12:12),Y(r)-22,X(vPos)>x1-70?'right':'left',fs+1);
  const lx=narrow?x0+8:x0+14, ly=y0+16;
  [['total',INK],['Compton',BLUE],['elastic',RED]].forEach(([nm,col],i)=>{const xx=lx+i*(narrow?78:96);line(c,xx,ly,xx+20,ly,3,col);txt(c,nm,xx+26,ly,fs-1,'left');});
  cap(c,'Scatter into the fluorescence detector',12,18,'left',narrow?12:15);
},false);
function vUpd(){vE=+$('vE').value;vP=+$('vP').value;vCone=+$('vCone').value;const el=$('vPos');vPos=+el.value;
  $('vPosO').textContent=vPos+'°';$('vEO').textContent=vE.toFixed(3)+' keV';$('vPO').textContent=vP.toFixed(3);$('vConeO').textContent=vCone+'°';vCalc();
  const q=vMode==='h'?scatCone(vPos,0,vE,vP,vCone):scatCone(90,vPos,vE,vP,vCone),id=scatCone(90,0,vE,vP,vCone),r=(q[0]+q[1])/(id[0]+id[1]);
  $('vTot').textContent=r.toFixed(r<10?2:1)+'×';$('vEl').textContent=(100*q[0]/(q[0]+q[1])).toFixed(0)+'% elastic, '+(100*q[1]/(q[0]+q[1])).toFixed(0)+'% Compton';
  $('vCE').textContent=comptonE(vE,vMode==='h'?vPos:90).toFixed(2)+' keV';sweepFig.w&&sweepFig.draw(sweepFig);}
function vSet(m){vMode=m;$('vH').setAttribute('aria-pressed',String(m==='h'));$('vV').setAttribute('aria-pressed',String(m==='v'));const el=$('vPos');
  if(m==='h'){el.min=10;el.max=170;el.value=110;}else{el.min=0;el.max=90;el.value=20;}vUpd();}
$('vH').addEventListener('click',()=>vSet('h'));$('vV').addEventListener('click',()=>vSet('v'));
['vPos','vE','vP','vCone'].forEach(id=>$(id).addEventListener('input',vUpd));vUpd();
hooks.push(()=>{$('vE').value=E0;$('vP').value=CUR.Pout.toFixed(3);vUpd();});
}

// ---------- RULES TABLE ----------
if($('rulesTbl')){
hooks.push(()=>{const P=CUR.Pout,id=scatCone(90,0,E0,P,9),T0=id[0]+id[1],r=(az,el)=>{const q=scatCone(az,el,E0,P,9),v=(q[0]+q[1])/T0;return v.toFixed(v<10?1:0)+'×';};
  let html='<thead><tr><th>Angle away from the ideal spot</th><th>Swung toward the source</th><th>Lifted</th><th>Swung toward the beamstop</th></tr></thead><tbody>';
  [3,5,8,10,15,20,30,45].forEach(d=>{html+=`<tr><td>${d}°</td><td>${r(90+d,0)}</td><td>${r(90,d)}</td><td>${r(90-d,0)}</td></tr>`;});
  $('rulesTbl').innerHTML=html+'</tbody>';});
}

// ---------- HARMONICS ----------
if($('harmCv')){
let hG=12,hK=1.5;
const HC={1:BLUE,3:RED,5:GRN,7:PUR};
const harmFig=fig('harmCv',w=>w<560?0.66:1.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const E1m=CUR.E1max, Kmax=CUR.Kmax, F=1+hK*hK/2, E1=E1m/F, EM=32, FM=0.56;
  const A=narrow?{x:w*0.04,y:40,w:w*0.92,h:h*0.25}:{x:w*0.03,y:40,w:w*0.37,h:h-62};
  const cy2=A.y+A.h+26;
  const B=narrow?{x:w*0.13,y:cy2+20,w:w*0.83,h:h-cy2-66}:{x:w*0.47,y:40,w:w*0.5,h:h-86};
  // the wave: E(tau) and its arrival time t(tau) for an electron on a sine path, seen on the axis
  rectF(c,A.x,A.y,A.w,A.h,WHITE,2.5);
  const ym=A.y+A.h*0.46, amp=A.h*0.36*Math.min(1,hK/Kmax), T=2*Math.PI*F, Wt=3.2*2*Math.PI*(1+Kmax*Kmax/2), sh=((t*34/A.w)*Wt)%T, K2=hK*hK;
  line(c,A.x,ym,A.x+A.w,ym,1,GREY);
  c.save();c.beginPath();c.rect(A.x+1.5,A.y+1.5,A.w-3,A.h-3);c.clip();
  pen(c,2.4,ORG);c.beginPath();const q1=(Wt+T)/F+0.5;
  for(let q=-0.5,i=0;q<=q1;q+=0.03,i++){const cs=Math.cos(q),u=K2*cs*cs,E=Math.sin(q)*(u-1)/Math.pow(1+u,3),tt=F*q+K2/4*Math.sin(2*q);
    const xx=A.x+(tt+sh-T)/Wt*A.w,yy=ym-amp*E;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}
  c.stroke();c.restore();
  const pT=A.w*T/Wt, yb=A.y+A.h-16, xb=A.x+12;
  line(c,xb,yb,xb+pT,yb,2);line(c,xb,yb-5,xb,yb+5,2);line(c,xb+pT,yb-5,xb+pT,yb+5,2);
  txt(c,'λ₁ = '+(12.398/E1).toFixed(2)+' Å',xb+pT+8,yb,fs-1,'left');
  txt(c,'K = '+hK.toFixed(2),A.x+A.w-10,A.y+15,fs,'right');
  if(!narrow||pT<A.w*0.2)txt(c,'to the sample →',A.x+A.w-10,yb,fs-1,'right');
  cap(c,'The wave on the axis',12,18,'left',narrow?12:15);
  // the energies in that wave
  rectF(c,B.x,B.y,B.w,B.h,WHITE,2.5);
  const X=e=>B.x+e/EM*B.w, Y=v=>B.y+B.h-v/FM*B.h;
  const rg=PS.bl==='24-ID-C'?(PS.Ee===7?[6.5,19]:[6,20]):null;
  if(rg){c.fillStyle=LTYEL;c.fillRect(X(rg[0]),B.y+1.5,X(rg[1])-X(rg[0]),B.h-3);}
  [0.2,0.4].forEach(v=>{line(c,B.x,Y(v),B.x+B.w,Y(v),1,GREY);txt(c,v.toFixed(1),B.x-6,Y(v),fs-1,'right');});txt(c,'0',B.x-6,Y(0),fs-1,'right');
  for(let e=0;e<=EM;e+=5){line(c,X(e),B.y+B.h,X(e),B.y+B.h+5,1.6);if(!narrow||e%10===0)txt(c,String(e),X(e),B.y+B.h+16,fs-1,'center');}
  txt(c,'photon energy (keV)',B.x+B.w/2,B.y+B.h+34,fs,'center');
  c.save();c.beginPath();c.rect(B.x+1.5,B.y+1.5,B.w-3,B.h-3);c.clip();
  [13,11,9,7,5,3,1].forEach(n=>{pen(c,2,HC[n]||GREY);c.beginPath();let st=true;
    for(let k=Kmax;k>=0.02;k-=0.02){const e=n*E1m/(1+k*k/2);if(e>EM+1)break;const xx=X(e),yy=Y(Fn(n,k));st?c.moveTo(xx,yy):c.lineTo(xx,yy);st=false;}c.stroke();});
  line(c,X(E0),B.y,X(E0),B.y+B.h,1.8,GRN,[4,4]);
  const rd=narrow?8.5:10;
  for(let n=1;n*E1<=EM;n+=2){const xx=X(n*E1),v=Fn(n,hK),col=HC[n]||GREY;
    line(c,xx,Y(0),xx,Y(v),narrow?4:5,col);disc(c,xx,Y(v),rd,col,2);txt(c,String(n),xx,Y(v)+1,n>9?fs-3:fs-1,'center',HC[n]?WHITE:INK);}
  c.restore();pen(c,2.5);c.strokeRect(B.x,B.y,B.w,B.h);
  for(let n=2;n*E1<EM;n+=2)disc(c,X(n*E1),Y(0),3.5,WHITE,1.6);
  const sl=X(E0)<B.x+B.w*0.6;txt(c,'12.662 keV',X(E0)+(sl?6:-6),B.y+13,fs-1,sl?'left':'right',GRN);
  cap(c,'How bright each harmonic is',narrow?12:B.x,narrow?cy2:18,'left',narrow?12:15);
});
function hUpd(){hG=+$('hG').value;hK=Math.abs(hG-CUR.gap)<0.006?CUR.K:0.934*B0fit(hG,PS.lu)*PS.lu;const E1=CUR.E1max/(1+hK*hK/2);
  $('hGO').textContent=hG.toFixed(2)+' mm';$('hKv').textContent=hK.toFixed(2);
  $('hE1').textContent=E1.toFixed(2)+' keV';$('hE3').textContent=(3*E1).toFixed(2)+' keV';$('hE5').textContent=(5*E1).toFixed(2)+' keV';
  let best=1,bf=0;for(let n=1;n<=15;n+=2){const v=Fn(n,hK);if(v>bf){bf=v;best=n;}}$('hBest').textContent='harmonic '+best;
  harmFig.w&&harmFig.draw(harmFig);}
$('hG').addEventListener('input',hUpd);
$('hSe').addEventListener('click',()=>{$('hG').value=CUR.gap.toFixed(2);hUpd();});
hooks.push(()=>{const el=$('hG');el.min=PS.gmin;el.max=Math.floor(gapFor(0.25,PS.lu));el.value=CUR.gap.toFixed(2);$('hRg').style.display=PS.bl==='24-ID-C'?'':'none';hUpd();});
}

// ---------- THREE SIGNALS (opening figure of the scatter guide) ----------
if($('triCv')){
// directions in the horizontal plane, drawn once: fluorescence is uniform, the two kinds of scatter follow the water model
const TRI=[];(function(){const rnd=rng(11), P=0.98;
  const pick=k=>{for(let n=0;n<4000;n++){const b=rnd()*2*Math.PI;if(k===0)return b;const q=scat2([Math.sin(b),0,Math.cos(b)],E0,P),v=k===1?q[0]/66:q[1]/9;if(rnd()<v)return b;}return 0;};
  [[0,30],[1,26],[2,26]].forEach(([k,n])=>{for(let i=0;i<n;i++)TRI.push({k,b:pick(k),ph:rnd(),sp:0.85+0.3*rnd()});});})();
fig('triCv',w=>w<560?0.9:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const cx=narrow?w*0.45:w*0.44, cy=narrow?h*0.45:h*0.54, R=narrow?Math.min(w*0.36,h*0.29):Math.min(w*0.2,h*0.34), sl=narrow?1.05:0.8;
  const px=narrow?w*0.93:cx+R*1.85, phh=R*0.62, bx0=narrow?6:cx-R*2.0;
  // beam in, with its electric field
  line(c,bx0,cy,cx,cy,3,BLUE);arrow(c,cx-R*0.8,cy,cx-R*0.55,cy,BLUE,3,9);
  line(c,cx,cy,px-9,cy,2,BLUE,[5,5]);
  const ex=bx0+R*0.32, sw=Math.cos(t*4);line(c,ex,cy-R*0.3,ex,cy+R*0.3,1,GREY);arrow(c,ex,cy,ex,cy-sw*R*0.3,ORG,2.6,7);txt(c,'E',ex-13,cy-R*0.24,fs+3,'center',ORG);
  txt(c,'X-ray beam',bx0+2,cy+R*0.3+14,fs,'left');
  // area detector and beamstop downstream
  rectF(c,px-6,cy-phh,12,2*phh,'#6b7f93');rectF(c,px-22,cy-5,10,10,INK);
  txt(c,narrow?'area detector':'diffraction detector',narrow?w-6:px,cy+phh+15,fs,narrow?'right':'center');
  // fluorescence detector in the quiet direction
  const dR=R*1.02;
  c.save();c.translate(cx,cy-dR);poly(c,[[-5,10],[5,10],[10,-4],[-10,-4]],GREY);rectF(c,-13,-24,26,20,ORG);c.restore();
  txt(c,'fluorescence detector (SDD)',cx,cy-dR-36,fs,'center');
  // the three kinds of X-ray leaving the sample, each with a short tail to show its direction
  const COL=[GRN,RED,BLUE];
  TRI.forEach(p=>{const u=(t*0.2*p.sp+p.ph)%1, r=18+u*(R*1.25-18), dx=Math.sin(p.b), dz=Math.cos(p.b), x=cx+r*dz, y=cy-r*dx;
    if(dx>0.94&&r>dR-8)return;                               // caught by the SDD
    if(Math.abs(y-cy)<phh&&x>px-8)return;                    // caught by the area detector
    if(Math.abs(y-cy)<6&&x>px-24)return;                     // caught by the beamstop
    c.globalAlpha=u>0.85?(1-u)/0.15:1;line(c,x-9*dz,y+9*dx,x,y,1.8,COL[p.k]);disc(c,x,y,p.k===0?4.2:3.6,COL[p.k],1.4);c.globalAlpha=1;});
  // sample, with its label below on a leader
  line(c,cx,cy,cx,cy+R*sl,1.4,INK);cap(c,'sample',cx,cy+R*sl+10,'center',fs-2);
  poly(c,[[cx,cy-9],[cx+9,cy],[cx,cy+9],[cx-9,cy]],GRN,2.2);
  // key
  const kx=narrow?10:w*0.72, ky=narrow?h-3*(fs+8)+4:h*0.14, kl=[['fluorescence: every direction',GRN],['elastic scatter: mostly forward',RED],['Compton scatter: forward and back',BLUE]];
  kl.forEach(([s2,col],i)=>{disc(c,kx+7,ky+i*(fs+8),5,col,1.6);txt(c,s2,kx+20,ky+i*(fs+8),fs,'left');});
  if(!narrow)cap(c,'Seen from above',12,18,'left',15);
});
}

// ---------- THE CONE: distance against cleanliness ----------
if($('coneCv')){
let kD=15,kP=0.98,kc=[],kmap=[];
const KN=33, KSPAN=22, KLEV=[1.5,3,6,12], KCOL=[WHITE,LTYEL,LTORG,ORG,'#d9722a'];
const omega=d=>2*Math.PI*(1-Math.cos(Math.atan(RPUP/d)));
function kCalc(){const s0=scatCone(90,0,E0,kP,alphaAt(D0)), S0=(s0[0]+s0[1])*omega(D0);kc=[];
  for(let d=8;d<=40.01;d+=1){const q=scatCone(90,0,E0,kP,alphaAt(d));kc.push([d,omega(d)/omega(D0),(q[0]+q[1])*omega(d)/S0]);}
  // scatter per unit solid angle around the dark direction: across = toward the beamstop (+) or the source (-), up = elevation
  const c0=scat2([1,0,0],E0,kP), C0=c0[0]+c0[1];kmap=[];
  for(let j=0;j<KN;j++)for(let i=0;i<KN;i++){const du=(i/(KN-1)*2-1)*KSPAN*Math.PI/180, dv=(j/(KN-1)*2-1)*KSPAN*Math.PI/180;
    let d=[1,dv,du];const L=Math.hypot(d[0],d[1],d[2]);d=[d[0]/L,d[1]/L,d[2]/L];const q=scat2(d,E0,kP),v=(q[0]+q[1])/C0;
    kmap.push(v<KLEV[0]?0:v<KLEV[1]?1:v<KLEV[2]?2:v<KLEV[3]?3:4);}}
const coneFig=fig('coneCv',w=>w<560?0.6:2.1,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const A=narrow?{x:w*0.04,y:40,w:w*0.92,h:h*0.46}:{x:w*0.03,y:40,w:w*0.4,h:h-62};
  const cy2=A.y+A.h+26;
  const B=narrow?{x:w*0.15,y:cy2+20,w:w*0.81,h:h-cy2-66}:{x:w*0.52,y:40,w:w*0.45,h:h-86};
  rectF(c,A.x,A.y,A.w,A.h,WHITE,2.5);
  // scale drawing, looking along the beam
  const sc=A.w*0.84/50, sx=A.x+A.w*0.1, sy=A.y+A.h*0.2, dx=sx+kD*sc, rp=RPUP*sc, bw=7*sc;
  c.beginPath();c.moveTo(sx,sy);c.lineTo(dx,sy-rp);c.lineTo(dx,sy+rp);c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,1.8);c.stroke();
  line(c,sx,sy,dx,sy,1.4,INK,[3,5]);
  rectF(c,dx,sy-rp*2.2,4,rp*1.2,GREY,1.6);rectF(c,dx,sy+rp,4,rp*1.2,GREY,1.6);rectF(c,dx+4,sy-rp*2.2,bw,rp*4.4,ORG,2);
  arrow(c,sx,sy,sx-A.w*0.06,sy,ORG,2.6,7);arrow(c,sx,sy,sx+A.w*0.06,sy,ORG,2.6,7);
  poly(c,[[sx,sy-7],[sx+7,sy],[sx,sy+7],[sx-7,sy]],GRN,2);
  txt(c,'E',sx-A.w*0.04,sy-15,fs+2,'center',ORG);
  const yd=sy+rp*2.2+16;line(c,sx,yd,dx,yd,2);line(c,sx,yd-5,sx,yd+5,2);line(c,dx,yd-5,dx,yd+5,2);
  txt(c,kD.toFixed(1)+' mm',(sx+dx)/2,yd+13,fs,'center');
  txt(c,'SDD, α = '+alphaAt(kD).toFixed(1)+'°',dx+4+bw+8,sy,fs,'left');
  txt(c,'to scale, looking along the beam',A.x+A.w-8,A.y+13,fs-2,'right');
  // the view from the sample
  const my=yd+50, big=A.y+A.h-my>170, ms=Math.min(A.y+A.h-my-(big?22:10),A.w*0.5), mx=A.x+A.w*0.08, cell=ms/KN;
  txt(c,'The view from the sample',mx,my-12,fs,'left');
  for(let j=0;j<KN;j++)for(let i=0;i<KN;i++){c.fillStyle=KCOL[kmap[j*KN+i]||0];c.fillRect(mx+i*cell-0.3,my+(KN-1-j)*cell-0.3,cell+0.6,cell+0.6);}
  pen(c,2);c.strokeRect(mx,my,ms,ms);
  const mcx=mx+ms/2, mcy=my+ms/2, ppd=ms/(2*KSPAN);
  line(c,mcx-5,mcy,mcx+5,mcy,1.4);line(c,mcx,mcy-5,mcx,mcy+5,1.4);
  c.setLineDash([4,4]);pen(c,1.6,INK);c.setLineDash([4,4]);c.beginPath();c.arc(mcx,mcy,alphaAt(D0)*ppd,0,7);c.stroke();c.setLineDash([]);
  pen(c,3,INK);c.beginPath();c.arc(mcx,mcy,Math.min(alphaAt(kD),KSPAN)*ppd,0,7);c.stroke();
  if(big){txt(c,'← source',mx+2,my+ms+11,fs-2,'left');txt(c,'beamstop →',mx+ms-2,my+ms+11,fs-2,'right');}
  const tx=mx+ms+12, tl=fs+5;let ty=my+8;
  [['least scatter',0],['3× to 6×',2],['12× and more',4]].forEach(([s2,k])=>{rectF(c,tx,ty-6,14,12,KCOL[k],1.4);txt(c,s2,tx+20,ty,fs-1,'left');ty+=tl;});
  pen(c,3);c.beginPath();c.arc(tx+7,ty,6,0,7);c.stroke();txt(c,'sensor now',tx+20,ty,fs-1,'left');ty+=tl;
  pen(c,1.6);c.setLineDash([3,3]);c.beginPath();c.arc(tx+7,ty,6,0,7);c.stroke();c.setLineDash([]);txt(c,'sensor at 15 mm',tx+20,ty,fs-1,'left');if(!big){ty+=tl;txt(c,'beamstop to the right',tx,ty,fs-1,'left');}
  cap(c,'The cone the sensor sees',12,18,'left',narrow?12:15);
  // what is collected, against distance
  rectF(c,B.x,B.y,B.w,B.h,WHITE,2.5);
  const lo=-1.5,hi=1.5, X=d=>B.x+(d-8)/32*B.w, Y=v=>B.y+B.h-(Math.log10(Math.max(v,1e-4))-lo)/(hi-lo)*B.h;
  [0.1,1,10].forEach(v=>{line(c,B.x,Y(v),B.x+B.w,Y(v),v===1?1.6:1,v===1?INK:GREY,v===1?[5,5]:undefined);txt(c,(v<1?'0.1':String(v))+'×',B.x-6,Y(v),fs-1,'right');});
  for(let d=10;d<=40;d+=5){line(c,X(d),B.y+B.h,X(d),B.y+B.h+5,1.6);if(!narrow||d%10===0)txt(c,String(d),X(d),B.y+B.h+16,fs-1,'center');}
  txt(c,'sample to sensor (mm)',B.x+B.w/2,B.y+B.h+34,fs,'center');
  c.save();c.beginPath();c.rect(B.x+1.5,B.y+1.5,B.w-3,B.h-3);c.clip();
  [[2,INK,3],[1,GRN,3]].forEach(([k,col,lw])=>{pen(c,lw,col);c.beginPath();kc.forEach((p,i)=>i?c.lineTo(X(p[0]),Y(p[k])):c.moveTo(X(p[0]),Y(p[k])));c.stroke();});
  c.restore();
  const q=scatCone(90,0,E0,kP,alphaAt(kD)),s0=scatCone(90,0,E0,kP,alphaAt(D0)),fr=omega(kD)/omega(D0),sr=(q[0]+q[1])*omega(kD)/((s0[0]+s0[1])*omega(D0));
  line(c,X(kD),B.y,X(kD),B.y+B.h,1.6,INK,[2,4]);disc(c,X(kD),Y(sr),6,GREY,2);disc(c,X(kD),Y(fr),6,GRN,2);
  const lx=B.x+B.w*(narrow?0.36:0.5), ly=B.y+16;
  line(c,lx,ly,lx+20,ly,3,GRN);txt(c,'fluorescence collected',lx+26,ly,fs-1,'left');
  line(c,lx,ly+fs+6,lx+20,ly+fs+6,3,INK);txt(c,'scatter collected',lx+26,ly+fs+6,fs-1,'left');
  cap(c,'What it collects, compared with 15 mm',narrow?12:B.x,narrow?cy2:18,'left',narrow?12:15);
},false);
function kUpd(){kD=+$('kD').value;$('kDO').textContent=kD.toFixed(1)+' mm';
  const al=alphaAt(kD),q=scatCone(90,0,E0,kP,al),s0=scatCone(90,0,E0,kP,alphaAt(D0)),fr=omega(kD)/omega(D0),pr=(q[0]+q[1])/(s0[0]+s0[1]);
  $('kA').textContent=al.toFixed(1)+'°';$('kO').textContent=(100*omega(kD)/(4*Math.PI)).toFixed(2)+'% of all directions';
  $('kF').textContent=fr.toFixed(fr<10?2:1)+'×';$('kS').textContent=pr.toFixed(2)+'×';coneFig.w&&coneFig.draw(coneFig);}
$('kD').addEventListener('input',kUpd);
hooks.push(()=>{kP=CUR.Pout;kCalc();kUpd();});
}

// ---------- EDGE SCAN: what scatter costs ----------
if($('edgeCv')){
let gAz=90,gM=300,gB=3000,gP=0.98;
const GE=[];for(let i=0;i<=60;i++)GE.push(12.63+i*0.001);
const GZ=(()=>{const r=rng(7),z=[];for(let i=0;i<=60;i++){z.push(Math.sqrt(-2*Math.log(r()+1e-12))*Math.cos(2*Math.PI*r()));}return z;})();
const GFM=Math.max(...GE.map(seEdge));
// beam turned down until the detector takes gB counts per point at the top of the edge
function gModel(az){const q=scatCone(az,0,E0,gP,9), S=(q[0]+q[1])*gM*1000/WMASS, top=SEKA*(1+SEKB)*GFM, C=gB/(top+S);
  return {C,share:top/(top+S),peak:C*SEKA*GFM};}
const edgeFig=fig('edgeCv',w=>w<560?1.05:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const x0=w*(narrow?0.16:0.09),x1=w*0.97,y0=h*0.16,y1=h*0.8, m=gModel(gAz), ym=Math.max(m.peak*1.35,4);
  const X=E=>x0+(E-12.63)/0.06*(x1-x0), Y=v=>y1-(y1-y0)*Math.min(v,ym)/ym;
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  [[12.658,'inflection'],[12.6605,'peak']].forEach(([e,s2],i)=>{line(c,X(e),y0,X(e),y1,1.4,GREY,[3,4]);txt(c,s2,X(e)+(i?5:-5),y0+13,fs-1,i?'left':'right');});
  // the scan with no noise, then the scan as counted
  pen(c,5,LTGRN);c.beginPath();GE.forEach((e,i)=>{const v=m.C*SEKA*seEdge(e);i?c.lineTo(X(e),Y(v)):c.moveTo(X(e),Y(v));});c.stroke();
  const obs=GE.map((e,i)=>{const v=m.C*SEKA*seEdge(e);return Math.max(0,Math.round(v+Math.sqrt(v)*GZ[i]));});
  pen(c,1.8);c.beginPath();obs.forEach((v,i)=>i?c.lineTo(X(GE[i]),Y(v)):c.moveTo(X(GE[i]),Y(v)));c.stroke();
  obs.forEach((v,i)=>disc(c,X(GE[i]),Y(v),narrow?2.2:3,GRN,1.2));
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  for(let e=12.63;e<12.6905;e+=0.01){line(c,X(e),y1,X(e),y1+5,1.6);if(!narrow||Math.round(e*100)%2===1)txt(c,e.toFixed(2),X(e),y1+16,fs-1,'center');}
  txt(c,'beam energy (keV)',(x0+x1)/2,y1+34,fs,'center');
  const tk=v=>v>=10000?(v/1000).toFixed(0)+'k':v>=1000?(v/1000).toFixed(1)+'k':String(Math.round(v));
  [0,0.5,1].forEach(u=>{const v=u*m.peak;if(u)line(c,x0,Y(v),x1,Y(v),1,GREY);txt(c,tk(v),x0-6,Y(v),fs-1,'right');});
  cap(c,'An edge scan: counts in the Se Kα window',12,18,'left',narrow?12:15);txt(c,'counts',x0-6,y0-12,fs-1,'right');
},false);
function gUpd(){gAz=+$('gAz').value;gM=Math.pow(10,+$('gM').value);gB=Math.pow(10,+$('gB').value);
  $('gAzO').textContent=gAz+'°';$('gMO').textContent='1 Se per '+(gM<100?gM.toFixed(0):Math.round(gM/10)*10)+' kDa';$('gBO').textContent=gB>=10000?(gB/1000).toFixed(0)+'k':gB>=1000?(gB/1000).toFixed(1)+'k':String(Math.round(gB/10)*10);
  const m=gModel(gAz),id=gModel(90);
  $('gSh').textContent=(100*m.share).toFixed(m.share<0.1?1:0)+'%';$('gN').textContent=Math.round(m.peak).toLocaleString('en-US');
  $('gNo').textContent='±'+(100/Math.sqrt(Math.max(m.peak,1))).toFixed(1)+'%';$('gBm').textContent=(100*m.C/id.C).toFixed(0)+'%';
  edgeFig.w&&edgeFig.draw(edgeFig);}
['gAz','gM','gB'].forEach(id=>$(id).addEventListener('input',gUpd));
hooks.push(()=>{gP=CUR.Pout;gUpd();});
}
