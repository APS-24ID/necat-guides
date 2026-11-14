// ---------- the guide "A walk down the beamline" (Introductory level) ----------
// Five stops, one figure and one control at each. The script is the drawing kit, introkit.js and this file.
// ---------- opening figure: the whole beamline, five stops ----------
if($('walkHeroCv')){
fig('walkHeroCv',w=>w<560?1.15:3.1,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const y=h*(narrow?0.4:0.5), fy=h*(narrow?0.72:0.84); rectF(c,-4,fy,w+8,h,FLOOR);
  const X=[0.11,0.33,0.52,0.72,0.92].map(v=>v*w), mh=h*0.075, gp=h*0.055, uw=w*0.075;
  [0,1,2].forEach(i=>line(c,X[i],y+h*0.1,X[i],fy,3));
  // 3: two mirrors, one seen on edge and one face on
  rectF(c,X[2]+w*0.008,y-h*0.06,w*0.035,h*0.12,LTBLUE,2);
  // the beam: a thick mix of energies, then one energy, then narrowing to the crystal
  // the light builds up between the magnets: nothing at the way in, full strength at the way out
  {const a0=narrow?4:6,lm=narrow?9:13,xa=X[0]-uw;for(let x=xa;x<X[1]-6;x+=2){const g=u=>Math.min(1,Math.max(0,(u-xa)/(2*uw))),f=u=>y+a0*g(u)*Math.sin((u-xa)/lm*6.2832-t*9);
    if(g(x+2)<=0)continue;pen(c,1+((narrow?4:6)-1)*g(x+1),ORG);c.beginPath();c.moveTo(x,f(x));c.lineTo(x+2,f(x+2));c.stroke();}}
  wave(c,X[1]+6,X[2]-w*0.04,y,narrow?3:5,narrow?9:13,t*9,ORG,2.4);
  line(c,X[2]-w*0.04,y-(narrow?3:5),X[3],y,2,ORG);line(c,X[2]-w*0.04,y+(narrow?3:5),X[3],y,2,ORG);
  rectF(c,X[2]-w*0.045,y+(narrow?5:7),w*0.04,narrow?6:8,GREY,2);
  // 1: the undulator, with an electron going through
  magnets(c,X[0]-uw,X[0]+uw,y-gp-mh,mh,6,0);magnets(c,X[0]-uw,X[0]+uw,y+gp,mh,6,1);
  {const u=(t*0.45)%1,xe=X[0]-uw-10+u*(2*uw+20);electron(c,xe,y+(gp-9)*0.7*Math.sin((xe-X[0]+uw)/(2*uw/3)*6.2832),narrow?4:6);}
  // 2: the silicon crystal
  c.save();c.translate(X[1],y);c.rotate(-0.32);rectF(c,-w*0.03,narrow?3:4,w*0.06,narrow?8:11,STEEL,2);c.restore();
  // 5: the detector, with rays from the crystal
  const dx=X[4]-w*0.012, dw=Math.max(10,w*0.026), d0=h*0.1, d1=fy-h*0.04;
  [-0.34,-0.2,-0.09,0.1,0.22,0.36].forEach((a,i)=>{const yy=y+a*(d1-d0)*1.15;if(yy<d0+4||yy>d1-4)return;line(c,X[3],y,dx,yy,1.3,'rgba(238,138,43,.75)');});
  line(c,X[3],y,X[3]+w*0.05,y,2,ORG);rectF(c,X[3]+w*0.05,y-5,5,10,INK,1);
  rectF(c,dx,d0,dw,d1-d0,WHITE,2.4);
  [-0.34,-0.2,-0.09,0.1,0.22,0.36].forEach((a,i)=>{const yy=y+a*(d1-d0)*1.15;if(yy<d0+4||yy>d1-4)return;const on=Math.sin(t*1.6+i*2.1)>0.2;c.fillStyle=on?ORG:INK;c.beginPath();c.arc(dx+dw/2,yy,on?3.2:1.8,0,7);c.fill();});
  // 4: the crystal
  sampleLoop(c,X[3],y,narrow?0.9:1.25);
  // numbers and names
  const N=['magnets','one energy','mirrors','crystal','detector'];
  X.forEach((x,i)=>{stopNo(c,i+1,x,narrow?h*0.1:h*0.13,narrow?11:14);
    const ly=narrow?fy+(i%2?h*0.19:h*0.08):fy+(h-fy)/2;
    cap(c,N[i],i===4?w-6:i===0&&narrow?6:x,ly,i===4?'right':i===0&&narrow?'left':'center',fs);});
});
}

// ---------- stop 1: the undulator ----------
if($('wUndCv')){
let G=11.9;const LU=3.0,GAM=6000/0.51099895;   // period in cm, and the electron's energy over its rest energy
// peak field against gap: the same fit as in the guide "How NE-CAT works"
const Kof=g=>0.934*LU*3.88*Math.exp(-5.07*g/(LU*10)+1.52*Math.pow(g/(LU*10),2));
fig('wUndCv',w=>w<560?1.15:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const K=Kof(G), y=h*0.52, x0=w*0.07, x1=w*(narrow?0.68:0.62), n=narrow?6:8, bw=(x1-x0)/n;
  const gp=h*(0.11+0.17*(G-8.5)/21.5), mh=h*0.11, A=Math.min(gp-7,h*0.03*K), per=2*bw;
  magnets(c,x0,x1,y-gp-mh,mh,n,0);magnets(c,x0,x1,y+gp,mh,n,1);
  // the path of the electrons
  pen(c,1.8,INK);c.setLineDash([5,5]);c.beginPath();c.moveTo(0,y);c.lineTo(x0,y);for(let x=x0;x<=x1;x+=3)c.lineTo(x,y+A*Math.sin((x-x0)/per*6.2832));c.lineTo(x1+14,y);c.stroke();c.setLineDash([]);
  // Each electron gives off a little more light at every wiggle. The light is very slightly faster than the electron, so it gets one wave
  // further ahead for each wiggle, and the burst of X-rays in front of the electron builds as it goes through. A bigger wiggle gives longer waves.
  const lamS=(narrow?5:7)*(1+K*K/2), NP=(x1-x0)/per, span=w+NP*lamS+40;
  for(let k=0;k<3;k++){const xe=((t*110+k*span/3)%span)-6, len=Math.max(0,Math.min(NP,(xe-x0)/per))*lamS;
    if(len>1){pen(c,2.6,ORG);c.beginPath();for(let x=0;x<=len;x+=1.5){const yy=y+(narrow?5:7)*Math.sin(x/lamS*6.2832);x?c.lineTo(xe+x,yy):c.moveTo(xe+x,yy);}c.stroke();}
    if(xe<x1+14)electron(c,xe,y+(xe>x0&&xe<x1?A*Math.sin((xe-x0)/per*6.2832):0),narrow?5:7);}
  // the gap
  const gx=x1+(narrow?10:14);arrow(c,gx,y,gx,y-gp+1,INK,1.8,6);arrow(c,gx,y,gx,y+gp-1,INK,1.8,6);
  cap(c,'magnets',x0,Math.max(13,y-gp-mh-(narrow?14:18)),'left',fs);
  txt(c,'gap',gx+7,y-gp*0.55,fs);
  cap(c,'x-rays',w-8,y-(narrow?24:32),'right',fs);
  cap(c,'electrons',x0,Math.min(h-13,y+gp+mh+(narrow?14:18)),'left',fs);
});
bind('wG',v=>v.toFixed(1)+' mm',()=>{G=+$('wG').value;const amp=Kof(G)*LU/100/(2*Math.PI*GAM)*1e6;
  setT('wAmp',amp.toFixed(2)+' µm');setT('wRat',(Math.round(LU*1e4/amp/1000)*1000).toLocaleString('en-US')+' times smaller');});
}

// ---------- stop 2: the monochromator ----------
if($('wMonoCv')){
let TH=9;const DS=3.1356,Eof=th=>12.398/(2*DS*Math.sin(th*Math.PI/180));
const F=fig('wMonoCv',w=>w<560?1.05:2.5,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const E=Eof(TH), td=TH*2.2*Math.PI/180, cx=w*0.5, cy=h*(narrow?0.36:0.4), D=h*(narrow?0.065:0.1), T=D*0.75, LA=-3.4*D, LB=0.5*D;   // the first face reaches upstream and the second downstream, so neither beam is blocked
  const R=(x,y)=>[cx+x*Math.cos(td)+y*Math.sin(td),cy-x*Math.sin(td)+y*Math.cos(td)];   // from the crystal's own frame to the page
  const px=-D/(2*Math.tan(td)), P=R(px,D/2), Q=R(-px,-D/2);
  // going in: a mix of energies. The drawing shows five
  [7,9.5,12.7,16,19].forEach((e,i)=>line(c,w*0.02,P[1]+(i-2)*(narrow?2.6:3.4),P[0],P[1]+(i-2)*(narrow?2.6:3.4),narrow?2:2.6,hueE(e)));
  // the one that gets through bounces off both walls of the slot and leaves the way it came
  line(c,P[0],P[1],Q[0],Q[1],3.2,hueE(E));
  poly(c,[R(LA,D/2),R(LB,D/2),R(LB,D/2+T),R(LA,D/2+T)],STEEL,2);poly(c,[R(-LB,-D/2-T),R(-LA,-D/2-T),R(-LA,-D/2),R(-LB,-D/2)],STEEL,2);
  arrow(c,Q[0],Q[1],w*0.97,Q[1],hueE(E),3.2,10);
  cap(c,'many energies in',w*0.02,narrow?h*0.64:Math.min(P[1]+30,h*0.72),'left',fs);
  cap(c,'one energy out',w*0.98,narrow?13:Math.max(13,Q[1]-26),'right',fs);
  tag(c,'silicon',...R(LA*0.5,D/2+T*0.5),'center',fs);tag(c,'silicon',...R(-LA*0.5,-D/2-T*0.5),'center',fs);
  // the range of energies, with a marker on the one in use
  const bx0=w*0.08,bx1=w*0.92,by=h*0.8,bh=h*0.06,xe=bx0+(E-6)/14*(bx1-bx0);
  for(let i=0;i<70;i++){c.fillStyle=hueE(6+14*(i+0.5)/70);c.fillRect(bx0+i*(bx1-bx0)/70,by,(bx1-bx0)/70+1,bh);}
  pen(c,2);c.strokeRect(bx0,by,bx1-bx0,bh);
  [6,10,15,20].forEach(v=>{const x=bx0+(v-6)/14*(bx1-bx0);line(c,x,by+bh,x,by+bh+5,2);txt(c,v+' keV',x,by+bh+(narrow?14:17),fs,v===6?'left':v===20?'right':'center');});
  poly(c,[[xe,by-2],[xe-7,by-13],[xe+7,by-13]],INK,1.5);
  tag(c,E.toFixed(1)+' keV',Math.max(bx0+30,Math.min(bx1-30,xe)),by-(narrow?25:28),'center',fs);
},false);
bind('wA',v=>v.toFixed(1)+'°',()=>{TH=+$('wA').value;setT('wE',Eof(TH).toFixed(1)+' keV');F.w&&F.draw(F);});
}

// ---------- stop 3: a focusing mirror ----------
if($('wKbCv')){
let B=0.3;const kOf=b=>1+30*Math.abs(1-b);   // how many times larger than the best focus: for illustration only
const F=fig('wKbCv',w=>w<560?1.05:2.4,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const al=8*Math.PI/180, ca=Math.cos(al), sa=Math.sin(al), d=[Math.cos(2*al),-Math.sin(2*al)], M=[w*0.3,h*0.74], L=w*0.52, U=narrow?8:13;
  const ms=U/sa+(narrow?12:26), S=[M[0]+L*d[0],M[1]+L*d[1]];
  // the mirror, drawn at a much steeper angle than the real one
  poly(c,[[M[0]-ms*ca,M[1]+ms*sa],[M[0]+ms*ca,M[1]-ms*sa],[M[0]+ms*ca+sa*11,M[1]-ms*sa+ca*11],[M[0]-ms*ca+sa*11,M[1]+ms*sa+ca*11]],LTBLUE,2);
  for(let i=-2;i<=2;i++){const u=i*U/2,s=u/sa,P=[M[0]+s*ca,M[1]-s*sa],k=L-((P[0]-M[0])*d[0]+(P[1]-M[1])*d[1]);let X;
    if(B<0.02)X=[P[0]+k*d[0],P[1]+k*d[1]];
    else{const fl=L/B,vx=M[0]+fl*d[0]-P[0],vy=M[1]+fl*d[1]-P[1],tau=k/(vx*d[0]+vy*d[1]);X=[P[0]+tau*vx,P[1]+tau*vy];}
    line(c,w*0.02,P[1],P[0],P[1],2,ORG);line(c,P[0],P[1],X[0],X[1],2,ORG);}
  sampleLoop(c,S[0],S[1],narrow?1:1.3);
  cap(c,'crystal',Math.min(w-8,S[0]+(narrow?40:70)),S[1]-(narrow?22:28),'right',fs);
  tag(c,'mirror',M[0]+sa*30,M[1]+(narrow?24:30),'center',fs);
  // magnified view: a hair seen end on, and the beam at the crystal
  const Rr=Math.min(h*0.27,narrow?50:82), ix=Rr+12, iy=Rr+12, rh=Rr*0.62, sc=rh/35, k=kOf(B);
  disc(c,ix,iy,Rr,WHITE,2.5);c.save();c.beginPath();c.arc(ix,iy,Rr-1.5,0,7);c.clip();
  disc(c,ix,iy,rh,'#c9a27a',2);
  c.globalAlpha=0.8;c.fillStyle=ORG;c.beginPath();c.arc(ix,iy,Math.max(1.5,5*k*sc),0,7);c.fill();c.globalAlpha=1;
  if(k<4){pen(c,1.4);c.beginPath();c.arc(ix,iy,Math.max(1.5,5*k*sc),0,7);c.stroke();}
  c.restore();disc(c,ix,iy,Rr,null,2.5);
  txt(c,'magnified: a hair',ix+Rr+8,iy-(narrow?8:10),fs);txt(c,'and the beam',ix+Rr+8,iy+(narrow?8:10),fs);
},false);
bind('wB',v=>v<0.02?'flat':Math.round(v*100)+'%',()=>{B=+$('wB').value;const k=kOf(B);
  setT('wS',Math.round(10*k)+' × '+Math.round(10*k)+' µm');setT('wH',10*k<70?'narrower than a hair':'wider than a hair');F.w&&F.draw(F);});
}

// ---------- stop 4: zooming in on the sample ----------
if($('wZoomCv')){
let Z=0;const VW0=64,vwOf=z=>VW0*Math.pow(0.05/VW0,z);   // width of the picture in millimeters
const F=fig('wZoomCv',w=>w<560?1.0:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const vw=vwOf(Z), z=w/vw, cx=w/2, cy=h*(0.1+0.32*Math.min(1,Z*3)), X=x=>cx+x*z, Y=y=>cy+y*z;
  // the pin and its base (sizes in millimeters, measured from the crystal)
  if(Y(18)<h+4)rectF(c,X(-1.9),Y(18),3.8*z,6*z,'#c98a4b',2);
  if(Y(0.9)<h+4)rectF(c,X(-0.32),Y(0.9),0.64*z,17.1*z,GREY,2);
  if(Y(0.2)<h+4)line(c,cx,Y(0.2),cx,Math.min(h+4,Y(0.9)),Math.max(1.6,0.03*z),INK);
  // the loop
  if(0.2*z<h*3){c.beginPath();c.ellipse(cx,cy,0.14*z,0.2*z,0,0,7);c.fillStyle='rgba(255,255,255,.55)';c.fill();pen(c,Math.max(1.6,Math.min(18,0.02*z)),'#6b5236');c.stroke();}
  // the crystal
  const s=0.05*z;if(s>1.2)poly(c,[[cx-s,cy-s*0.45],[cx-s*0.35,cy-s],[cx+s*0.8,cy-s*0.8],[cx+s,cy+s*0.3],[cx+s*0.3,cy+s],[cx-s*0.85,cy+s*0.7]],GRN,Math.max(1.2,Math.min(3,s*0.06)));
  else{c.fillStyle=GDK;c.beginPath();c.arc(cx,cy,1.5,0,7);c.fill();}
  // the beam, as the crystal sees it: nominally 10 microns across
  if(0.005*z>0.9){c.fillStyle=ORG;c.beginPath();c.arc(cx,cy,0.005*z,0,7);c.fill();if(0.005*z>3){pen(c,1.6);c.stroke();}}
  // names, where the thing is a sensible size on the page
  const pw=0.64*z;if(pw>5&&pw<w*0.3)tag(c,'pin',cx+pw/2+10,Math.min(h*0.8,Y(8)),'left',fs);
  const lr=0.2*z;if(lr>9&&lr<h*0.55)tag(c,'loop',cx+0.14*z*0.75+8,cy+lr*0.72,'left',fs);
  if(s>6&&s<h*0.34)tag(c,'crystal',cx-s-8,cy-s*0.8-10,'right',fs);
  if(0.005*z>4)tag(c,'X-ray beam',cx+0.005*z+10,cy,'left',fs);
  // scale bar
  const bars=[10,5,2,1,0.5,0.2,0.1,0.05,0.02,0.01,0.005],b=bars.find(v=>v<=vw*0.3)||0.005,bx=w*0.04,byy=h-(narrow?16:20);
  line(c,bx,byy,bx+b*z,byy,4);line(c,bx,byy-6,bx,byy+6,2);line(c,bx+b*z,byy-6,bx+b*z,byy+6,2);
  tag(c,b>=1?b+' mm':Math.round(b*1000)+' µm',bx,byy-(narrow?18:22),'left',fs);
},false);
bind('wZ',v=>{const m=VW0/vwOf(v);return (m<10?m.toFixed(1):Math.round(m))+'×';},()=>{Z=+$('wZ').value;const vw=vwOf(Z);
  setT('wW',vw>=1?vw.toFixed(vw<10?1:0)+' mm':Math.round(vw*1000)+' µm');
  setT('wSee',vw>6?'the pin that holds the sample':vw>0.9?'the loop on the end of the pin':vw>0.18?'the crystal in its loop':'the X-ray beam on the crystal');F.w&&F.draw(F);});
}

// ---------- stop 5: the detector ----------
if($('wDetCv')){
const r=rng(24),SP=[];
for(let i=-10;i<=10;i++)for(let j=-10;j<=10;j++){const x=(i+0.3*j)/10.5,y=j*0.95/10.5,rad=Math.hypot(x,y);if(rad>0.97||rad<0.1||Math.abs(x)>0.97||r()<0.45)continue;
  SP.push({x,y,a:r()*90,s:(0.45+r())*(1-0.55*rad),seen:false});}
let PH=0,prev=0;
const F=fig('wDetCv',w=>w<560?0.8:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const S=narrow?Math.min(w*0.86,h*0.64):Math.min(h*0.86,w*0.42), dc=narrow?[w/2,h-S/2-h*0.035]:[w*0.72,h/2], xc=narrow?[w*0.5,h*0.12]:[w*0.15,h*0.5];
  arrow(c,w*0.01,xc[1],xc[0]-(narrow?16:22),xc[1],ORG,3,9);
  const B=detFace(c,dc[0],dc[1],S/DETG.hh);
  line(c,xc[0],xc[1],dc[0],dc[1],2,'rgba(238,138,43,.85)');
  SP.forEach(s=>{const x=dc[0]+s.x*B.w/2*0.95,y=dc[1]+s.y*B.h/2*0.95,on=Math.abs(PH-s.a)<1.6;
    if(on){line(c,xc[0],xc[1],x,y,1.1,'rgba(238,138,43,.5)');c.fillStyle=ORG;c.beginPath();c.arc(x,y,2.2+3*s.s,0,7);c.fill();}
    else if(s.seen){c.fillStyle=INK;c.beginPath();c.arc(x,y,0.9+1.7*s.s,0,7);c.fill();}});
  disc(c,dc[0],dc[1],Math.max(5,S*0.03),GREY,2);
  // the crystal, turning
  const a=PH*Math.PI/180,bw=narrow?20:30,wa=bw*Math.abs(Math.cos(a)),wb=bw*0.75*Math.abs(Math.sin(a)),x0=xc[0]-(wa+wb)/2;
  line(c,xc[0],xc[1]+bw*0.55,xc[0],xc[1]+bw*0.55+(narrow?12:h*0.2),3);
  if(wa>0.5)rectF(c,x0,xc[1]-bw*0.55,wa,bw*1.1,GRN,2);if(wb>0.5)rectF(c,x0+wa,xc[1]-bw*0.55,wb,bw*1.1,GDK,2);
  cap(c,'crystal',narrow?xc[0]+bw+8:xc[0],narrow?xc[1]:xc[1]-bw*0.55-(narrow?16:22),narrow?'left':'center',fs);
  cap(c,'detector',dc[0]+S/2-6,dc[1]-S/2+(narrow?14:18),'right',fs);
  tag(c,'beamstop',dc[0]+Math.max(5,S*0.03)+6,dc[1]+(narrow?14:16),'left',fs);
},false);
bind('wR',v=>v.toFixed(0)+'°',()=>{const v=+$('wR').value,lo=Math.min(prev,v)-1.6,hi=Math.max(prev,v)+1.6;SP.forEach(s=>{if(s.a>=lo&&s.a<=hi)s.seen=true;});prev=v;PH=v;
  setT('wN',SP.filter(s=>s.seen).length+' of '+SP.length);F.w&&F.draw(F);});
}

capK();
})();
