// ---------- WELCOME BANNER: from the ring to your data ----------
if($('homeCv'))fig('homeCv',w=>w<560?1.25:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?11:14;
  const yb=h*0.5, Rr=h*1.15, rcx=w*0.15, rcy=yb+Rr;
  // the storage ring: only an arc of it fits, because the real one is 1.1 km around
  pen(c,narrow?9:13,WHITE);c.beginPath();c.arc(rcx,rcy,Rr,Math.PI*1.2,Math.PI*1.83);c.stroke();
  pen(c,2.2);c.beginPath();c.arc(rcx,rcy,Rr+(narrow?4.5:6.5),Math.PI*1.2,Math.PI*1.83);c.stroke();c.beginPath();c.arc(rcx,rcy,Rr-(narrow?4.5:6.5),Math.PI*1.2,Math.PI*1.83);c.stroke();
  for(let i=0;i<9;i++){const a=Math.PI*1.2+((i/9+t*0.05)%1)*Math.PI*0.63;disc(c,rcx+Rr*Math.cos(a),rcy+Rr*Math.sin(a),narrow?2.6:3.6,YEL,1.3);}
  // undulator at the top of the arc
  const ux0=rcx-w*0.055, ux1=rcx+w*0.085, n=6, pw=(ux1-ux0)/n, mh=narrow?9:13, gp=narrow?9:13;
  for(let i=0;i<n;i++){rectF(c,ux0+i*pw,yb-gp-mh,pw,mh,i%2?BLUE:RED,1.6);rectF(c,ux0+i*pw,yb+gp,pw,mh,i%2?RED:BLUE,1.6);}
  // the X-ray beam, a wave on its way to the crystal
  const xs=ux1+4, xc=w*0.7, A=narrow?4:7, lam=narrow?11:17;
  pen(c,2.6,ORG);c.beginPath();for(let x=xs;x<=xc-12;x+=1.5){const env=Math.min(1,(x-xs)/30),y=yb+A*env*Math.sin((x-xs)/lam*2*Math.PI-t*6);x===xs?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  // crystal on its pin
  line(c,xc,yb+9,xc,yb+h*0.26,3);rectF(c,xc-9,yb+h*0.26,18,7,GREY,1.6);
  poly(c,[[xc,yb-10],[xc+10,yb],[xc,yb+10],[xc-10,yb]],GRN,2.2);
  // diffracted rays and the detector, with spots that come and go
  const xd=w*0.93, dh=h*0.36;
  [-0.82,-0.5,-0.22,0.3,0.62,0.86].forEach((u,i)=>{const yy=yb+u*dh, on=0.5+0.5*Math.sin(t*1.3+i*1.9);line(c,xc+10,yb,xd-7,yy,1.2,ORG);c.globalAlpha=0.25+0.75*on;disc(c,xd,yy,narrow?3:4.2,INK,0);c.globalAlpha=1;});
  c.fillStyle='#6b7f93';c.fillRect(xd-7,yb-dh-8,5,2*dh+16);pen(c,2);c.strokeRect(xd-7,yb-dh-8,5,2*dh+16);
  rectF(c,xd-2,yb-dh-8,narrow?14:20,2*dh+16,WHITE,2);
  [-0.82,-0.5,-0.22,0.3,0.62,0.86].forEach((u,i)=>{const on=0.5+0.5*Math.sin(t*1.3+i*1.9);c.globalAlpha=0.2+0.8*on;c.fillStyle=INK;c.beginPath();c.arc(xd+(narrow?5:8),yb+u*dh,narrow?2.4:3.4,0,7);c.fill();c.globalAlpha=1;});
  // captions
  cap(c,'electrons',narrow?8:w*0.03,h*0.9,'left',fs);
  cap(c,'undulator',(ux0+ux1)/2,yb-gp-mh-(narrow?14:18),'center',fs);
  cap(c,'X-rays',(xs+xc)/2,yb-(narrow?24:32),'center',fs);
  cap(c,'your crystal',xc,yb+h*0.26+(narrow?22:28),'center',fs);
  cap(c,'your data',xd+(narrow?12:18),narrow?12:16,'right',fs);
});

// ---------- three small pictures, one for each guide ----------
if($('c0Cv'))fig('c0Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const cx=w*0.64,cy=h*0.52,R=h*0.36,bx=w*0.3,by=h*0.6,br=h*0.17;
  pen(c,9,WHITE);c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();pen(c,2);c.beginPath();c.arc(cx,cy,R+4.5,0,7);c.stroke();c.beginPath();c.arc(cx,cy,R-4.5,0,7);c.stroke();
  pen(c,6,WHITE);c.beginPath();c.arc(bx,by,br,0,7);c.stroke();pen(c,1.8);c.beginPath();c.arc(bx,by,br+3,0,7);c.stroke();c.beginPath();c.arc(bx,by,br-3,0,7);c.stroke();
  const lx0=w*0.05,lx1=bx-br-8,ly=by;for(let i=0;i<5;i++)rectF(c,lx0+i*(lx1-lx0)/5,ly-7,(lx1-lx0)/5,14,LTORG,1.6);
  line(c,lx1,ly,bx-br,by,1.8);line(c,bx+br,by,cx-R*0.98,cy+R*0.2,1.8);
  for(let i=0;i<14;i++){const a=i/14*2*Math.PI+t*0.8;disc(c,cx+R*Math.cos(a),cy+R*Math.sin(a),3,YEL,1.2);}
  const a=t*2.4;disc(c,bx+br*Math.cos(a),by+br*Math.sin(a),3.6,YEL,1.2);
  const u=(t*0.5)%1;disc(c,lx0+u*(lx1-lx0),ly,2.6,YEL,1.1);
});
if($('c1Cv'))fig('c1Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const x0=w*0.06,x1=w*0.94,n=8,pw=(x1-x0)/n,yc=h*0.5,gp=h*0.2,mh=h*0.16,k=2*Math.PI/(2*pw),A=h*0.12;
  for(let i=0;i<n;i++){rectF(c,x0+i*pw,yc-gp-mh,pw,mh,i%2?BLUE:RED,1.8);rectF(c,x0+i*pw,yc+gp,pw,mh,i%2?RED:BLUE,1.8);}
  pen(c,2.4);c.beginPath();for(let x=x0;x<=x1;x+=2){const y=yc+A*Math.sin(k*(x-x0));x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  const xe=x0+((t*0.16)%1)*(x1-x0);
  pen(c,2.4,ORG);c.beginPath();for(let x=xe+10;x<=Math.min(x1,xe+70);x+=1.5){const y=yc+A*Math.sin(k*(xe-x0))+5*Math.sin((x-xe)*0.9);x===xe+10?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  electron(c,xe,yc+A*Math.sin(k*(xe-x0)),7);
});
if($('c2Cv'))fig('c2Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const x0=w*0.08,x1=w*0.88,yc=h*0.55,A=h*0.3,k=2*Math.PI/(w*0.26);
  line(c,x0,yc,x1,yc,2.4,BLUE);arrow(c,x1-4,yc,x1+12,yc,BLUE,2.4,9);
  pen(c,1.6,ORG);c.beginPath();for(let x=x0;x<=x1;x+=2){const y=yc-A*Math.sin(k*(x-x0)-t*3);x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  for(let x=x0+6;x<x1;x+=w*0.036){const v=A*Math.sin(k*(x-x0)-t*3);if(Math.abs(v)>5)arrow(c,x,yc,x,yc-v,ORG,2.2,6);}
  txt(c,'E',x0+2,yc-A-6,18,'left',ORG);
});
if($('c3Cv'))fig('c3Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const cx=w*0.5,cy=h*0.6,R=h*0.36;
  c.beginPath();for(let i=0;i<=180;i++){const b=i/180*2*Math.PI,r=R*1.25*(0.98*Math.cos(b)*Math.cos(b)+0.02);const X=cx+r*Math.cos(b),Y=cy-r*Math.sin(b);i?c.lineTo(X,Y):c.moveTo(X,Y);}
  c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,2);c.stroke();
  line(c,w*0.06,cy,w*0.94,cy,2.6,BLUE);arrow(c,w*0.9,cy,w*0.95,cy,BLUE,2.6,9);
  for(let i=0;i<12;i++){const b=i/12*2*Math.PI+0.26,u=(t*0.3+i*0.37)%1,r=12+u*R*1.15;if(Math.sin(b)>0.9&&r>R*0.95)continue;c.globalAlpha=u>0.8?(1-u)/0.2:1;disc(c,cx+r*Math.cos(b),cy-r*Math.sin(b),3.4,GRN,1.3);c.globalAlpha=1;}
  c.save();c.translate(cx,cy-R*1.08);poly(c,[[-5,10],[5,10],[10,-4],[-10,-4]],GREY);rectF(c,-13,-22,26,18,ORG);c.restore();
  poly(c,[[cx,cy-8],[cx+8,cy],[cx,cy+8],[cx-8,cy]],GRN,2);
});
// what is a synchrotron: a ring of electrons with X-rays leaving along the tangents
if($('csCv'))fig('csCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const cx=w*0.5,cy=h*0.52,R=h*0.33;
  [-112,-90,-68,68,90,112].forEach(deg=>{const a=deg*Math.PI/180,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);pen(c,2.4,ORG);c.setLineDash([6,6]);c.lineDashOffset=-t*40;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.sin(a)*w*0.36,y+Math.cos(a)*w*0.36);c.stroke();c.setLineDash([]);c.lineDashOffset=0;});
  pen(c,9,WHITE);c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();pen(c,2);c.beginPath();c.arc(cx,cy,R+4.5,0,7);c.stroke();c.beginPath();c.arc(cx,cy,R-4.5,0,7);c.stroke();
  for(let i=0;i<12;i++){const a=i/12*2*Math.PI+t*0.8;disc(c,cx+R*Math.cos(a),cy+R*Math.sin(a),3,YEL,1.2);}
});
// the walk down the beamline: five numbered stops on a beam
if($('cwCv'))fig('cwCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const y=h*0.56;
  pen(c,2.6,ORG);c.beginPath();for(let x=w*0.06;x<=w*0.94;x+=2){const yy=y+5*Math.sin(x/11-t*7);x===w*0.06?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();
  [0.14,0.32,0.5,0.68,0.86].forEach((u,i)=>{const x=u*w;line(c,x,y-h*0.2,x,y-9,2);disc(c,x,y-h*0.27,h*0.085,RED,2);txt(c,String(i+1),x,y-h*0.27+1,h*0.11,'center','#fff');
    if(i===0){for(let k=0;k<4;k++){rectF(c,x-18+k*9,y+9,9,9,k%2?RED:BLUE,1.4);}}
    else if(i===1){c.save();c.translate(x,y+14);c.rotate(-0.3);rectF(c,-14,-4,28,8,STEEL,1.6);c.restore();}
    else if(i===2)rectF(c,x-16,y+10,32,6,LTBLUE,1.6);
    else if(i===3)poly(c,[[x-7,y+14],[x,y+7],[x+7,y+14],[x,y+21]],GRN,1.6);
    else{rectF(c,x-10,y+8,20,20,WHITE,1.6);[[-4,-3],[3,2],[-2,5],[5,-5]].forEach(([a,b])=>{c.fillStyle=INK;c.beginPath();c.arc(x+a,y+18+b,1.4,0,7);c.fill();});}});
});
// the detector guides: a patch of pixels with their counts, and a sensor in cross-section
if($('cpCv'))fig('cpCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const p=h*0.2,x0=w/2-3.5*p,y0=h/2-2*p;
  for(let i=0;i<7;i++)for(let j=0;j<4;j++){const n=Math.round(160*Math.exp(-((i-3)*(i-3)+(j-1.5)*(j-1.5))/2.2)*(0.8+0.2*Math.sin(t*2+i+j)))+((i*7+j*13)%3);
    c.fillStyle=`rgba(238,138,43,${Math.min(1,n/140).toFixed(2)})`;c.fillRect(x0+i*p,y0+j*p,p,p);pen(c,1.4);c.strokeRect(x0+i*p,y0+j*p,p,p);txt(c,String(n),x0+(i+0.5)*p,y0+(j+0.5)*p,p*0.36,'center');}
});
if($('cqCv'))fig('cqCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x0=w*0.14,x1=w*0.86,yt=h*0.34,yb=h*0.66,pw=(x1-x0)/6,u=(t/1.2)%1,k=Math.floor(t/1.2)%6,hx=x0+((k*2+3)%6+0.5)*pw;
  rectF(c,x0,yt,x1-x0,yb-yt,'#dfe7ee',2.2);for(let i=0;i<6;i++){rectF(c,x0+i*pw+pw*0.1,yb,pw*0.8,h*0.07,YEL,1.8);if(i)line(c,x0+i*pw,yt,x0+i*pw,yb,1.2,'#52606b',[4,5]);}
  if(u<0.4)arrow(c,hx,h*0.06,hx,h*0.06+(yt+12-h*0.06)*(u/0.4),ORG,3,8);else{const v=(u-0.4)/0.6;c.fillStyle='rgba(47,109,181,.55)';c.beginPath();c.ellipse(hx,yt+14+(yb-yt-14)*Math.min(1,v*1.3),4+8*v,4+4*v,0,0,7);c.fill();if(v>0.75)txt(c,'+1',hx,yb+h*0.17,h*0.11,'center',RED);}
});
// the shielded room: beam in, stray X-rays stopped by the walls
if($('chCv'))fig('chCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x=w*0.3,y=h*0.16,W=w*0.44,H=h*0.66,by=y+H*0.45,px=x+W*0.4;
  rectF(c,x,y,W,H,'#f7f3e6',6);line(c,w*0.08,by,px,by,3,ORG);
  [-1.9,-1.2,-0.6,0.5,1.1,1.8,2.6,-2.7].forEach((a,i)=>{const L=W*(0.2+0.06*Math.sin(t*3+i*1.7));line(c,px,by,px+L*Math.cos(a),by+L*Math.sin(a),1.3,'rgba(238,138,43,.6)');});
  disc(c,px,by,4,GRN,1.6);disc(c,x+W*0.8,y+H+12,6,Math.sin(t*6)>-0.3?RED:'#f4c9c2',1.8);
});
// the cold crystal, and the pattern that fades with dose
if($('ccCv'))fig('ccCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x=w*0.42,y=h*0.58,L=h*0.5;
  line(c,w*0.06,y,x-12,y,3,ORG);for(let k=0;k<12;k++){const u=(t*0.9+k/12)%1;c.fillStyle=`rgba(255,255,255,${(0.9-0.6*u).toFixed(2)})`;c.beginPath();c.arc(x+L*0.72*(1-u*1.25)+Math.sin(k*7.3)*6,y-L*0.72*(1-u*1.25)+Math.cos(k*5.1)*6,2+3*u,0,7);c.fill();}
  c.save();c.translate(x+L*0.72,y-L*0.72);c.rotate(Math.PI*0.75);rectF(c,-L*0.34,-L*0.1,L*0.34,L*0.2,STEEL,2);c.restore();
  line(c,x,y+8,x,y+h*0.3,3);poly(c,[[x-11,y-5],[x-4,y-11],[x+9,y-9],[x+11,y+3],[x+3,y+11],[x-9,y+8]],GRN,2);txt(c,'−173 °C',x+20,y+18,h*0.11);
});
if($('cdCv'))fig('cdCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=h*0.78,cx=w/2,cy=h/2,D=Math.max(0,((t*7)%80)-8);
  rectF(c,cx-S/2,cy-S/2,S,S,WHITE,2.2);for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const x=(i+0.3*j)/6.6,y=j*0.95/6.6,r=Math.hypot(x,y);if(r>0.96||r<0.12||Math.abs(x)>0.96||(i*7+j*3+40)%3===0)continue;const k=Math.pow(2,-D/(10*1.5/r));if(k<0.05)continue;
    c.fillStyle=`rgba(27,27,27,${Math.min(1,0.3+k).toFixed(2)})`;c.beginPath();c.arc(cx+x*S/2,cy+y*S/2,(1.2+1.4*((i*5+j*11+60)%4)/3)*Math.sqrt(k),0,7);c.fill();}
  txt(c,D.toFixed(0)+' MGy',cx+S/2+12,cy,h*0.11,'left',D>30?RED:INK);
});
// the five-minute guide to crystallography: spots on the left, and the map and atoms they give
if($('ceCv'))fig('ceCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=h*0.7,px=w*0.24,cy=h*0.5,mx=w*0.7,s=h*0.17,u=(t%8)/8;
  rectF(c,px-S/2,cy-S/2,S,S,WHITE,2.2);for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){const x=(i+0.3*j)/4.6,y=j*0.95/4.6,r=Math.hypot(x,y);if(r>0.95||r<0.15||Math.abs(x)>0.95||(i*7+j*3+40)%3===0)continue;c.fillStyle=r<0.25+u*1.2?INK:'rgba(27,27,27,.15)';c.beginPath();c.arc(px+x*S/2,cy+y*S/2,1.2+1.4*Math.abs(Math.sin(i*12.9+j*78.2)),0,7);c.fill();}
  arrow(c,px+S/2+8,cy,mx-s*2.4,cy,INK,2.2,7);
  const P=[0,1,2,3,4,5].map(i=>[mx-s*0.7+s*Math.cos(i*1.0472),cy+s*Math.sin(i*1.0472)]),T=[[mx+s*0.3,cy],[mx+s*1.2,cy],[mx+s*1.7,cy-s*0.85]];
  c.lineJoin='round';c.lineCap='round';const lw=s*(0.95-0.5*Math.min(1,u*1.6));
  [[BLUE,lw+4],[LTBLUE,lw]].forEach(([col,wd])=>{c.strokeStyle=col;c.lineWidth=wd;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();T.forEach(([x,y])=>c.lineTo(x,y));c.stroke();});c.lineCap='butt';
  if(u>0.6){c.save();c.globalAlpha=Math.min(1,(u-0.6)*6);P.forEach((p,i)=>{const q=P[(i+1)%6];line(c,p[0],p[1],q[0],q[1],2);});line(c,P[0][0],P[0][1],T[1][0],T[1][1],2);line(c,T[1][0],T[1][1],T[2][0],T[2][1],2);P.concat(T.slice(1)).forEach(([x,y],i)=>disc(c,x,y,3.4,i===7?RED:'#5d6a73',1.3));c.restore();}
});
// How do you grow a protein crystal?: a drop seen through a microscope, in which crystals appear and grow
if($('cgCv'))fig('cgCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const cx=w*0.5,cy=h*0.5,R=h*0.4,u=(t%9)/9,g=Math.max(0,u-0.15)/0.7;
  disc(c,cx,cy,R+5,'#3b4046',2);disc(c,cx,cy,R,'#cfe0f0',2);c.save();c.beginPath();c.arc(cx,cy,R-1,0,7);c.clip();
  [[-0.45,0.3,0.5,1],[0.2,-0.42,2.1,0.8],[0.5,0.4,1.2,0.65],[-0.2,-0.1,2.8,0.5],[0.05,0.55,0.2,0.45],[-0.6,-0.4,1.7,0.4]].forEach(([x,y,a,s],i)=>{const r=Math.min(1,Math.max(0,g*1.5-i*0.12))*s*R*0.3;if(r<0.6)return;
    const P=[[-1,-0.31],[-0.55,-0.62],[0.7,-0.62],[1,-0.25],[0.6,0.62],[-0.7,0.62]].map(([p,q])=>[cx+x*R+(p*Math.cos(a)-q*Math.sin(a))*r,cy+y*R+(p*Math.sin(a)+q*Math.cos(a))*r]);poly(c,P,'#cfe6c9',1.4);});c.restore();
});
// How does a crystal get to the beam?: the robot arm carries a pin from the liquid nitrogen to the goniometer and back (the scene of the guide, without its magnifier)
if($('crCv'))fig('crCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=Math.min(w*0.94/1380,h*0.86/830);rscene(c,{ox:w*0.5,oy:h*0.92,S},rstate(t*1.4),t,{labels:false});});
// How do waves add up to a picture?: two waves, and their sum
if($('cwvCv'))fig('cwvCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x0=w*0.06,bw=w*0.88,W=(y,amp,fn,col,lw)=>{pen(c,lw,col);c.beginPath();for(let i=0;i<=120;i++){const u=i/120,X=x0+bw*u,Y=y-amp*fn(u);i?c.lineTo(X,Y):c.moveTo(X,Y);}c.stroke();},p=t*0.5;
  const a=u=>Math.cos(2*Math.PI*(2*u)-p),b=u=>0.6*Math.cos(2*Math.PI*(5*u)+p*0.7);W(h*0.2,h*0.09,a,ORG,2.2);W(h*0.43,h*0.09,b,GRN,2.2);txt(c,'+',x0-2,h*0.31,15,'center');line(c,x0,h*0.58,x0+bw,h*0.58,1.4);W(h*0.78,h*0.1,u=>a(u)+b(u),BLUE,3);
});
// What does resolution mean?: two atoms that merge into one blob and part again
if($('crsCv'))fig('crsCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const cx=w/2,cy=h/2,s=h*(0.12+0.16*(0.5+0.5*Math.sin(t*0.8))),d=h*0.24;rectF(c,w*0.14,h*0.14,w*0.72,h*0.72,WHITE,2.2);
  for(let x=w*0.15;x<w*0.85;x+=2){const v=Math.exp(-((x-cx-d)**2)/(2*s*s))+Math.exp(-((x-cx+d)**2)/(2*s*s));c.fillStyle='rgba(47,109,181,'+Math.min(0.9,0.75*v).toFixed(2)+')';const hh=h*0.26*Math.sqrt(Math.min(1,v));c.fillRect(x,cy-hh,2,2*hh);}
  disc(c,cx-d,cy,3.4,INK,0);disc(c,cx+d,cy,3.4,INK,0);
});
// The phase problem: a wave whose height is known and whose position is not
if($('cphCv'))fig('cphCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x0=w*0.08,bw=w*0.84,my=h*0.52,k=h*0.24,ph=t*0.9;rectF(c,x0,h*0.16,bw,h*0.72,WHITE,2.2);
  [0.25,0.5,0.75].forEach((q,i)=>{pen(c,1.6,'rgba(47,109,181,.3)');c.beginPath();for(let j=0;j<=100;j++){const u=j/100,X=x0+bw*u,Y=my-k*Math.cos(2*Math.PI*3*u-ph-q*6.283);j?c.lineTo(X,Y):c.moveTo(X,Y);}c.stroke();});
  pen(c,3,BLUE);c.beginPath();for(let j=0;j<=100;j++){const u=j/100,X=x0+bw*u,Y=my-k*Math.cos(2*Math.PI*3*u-ph);j?c.lineTo(X,Y):c.moveTo(X,Y);}c.stroke();txt(c,'?',x0+bw-18,h*0.3,22,'center',RED);
});
// Why do we still measure?: a pattern of spots and a string of letters, each leading to the same protein
if($('cyCv'))fig('cyCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=h*0.34,x=w*0.16,y1=h*0.28,y2=h*0.72;rectF(c,x-S/2,y1-S/2,S,S,WHITE,2);for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){if((i*7+j*3+40)%3===0||Math.hypot(i,j)>3.4||(!i&&!j))continue;c.beginPath();c.arc(x+i*S/8,y1+j*S/8,1.6,0,7);c.fillStyle=INK;c.fill();}
  rectF(c,x-S/2,y2-S/2,S,S,WHITE,2);for(let i=0;i<9;i++)txt(c,MB.seq[i],x-S/2+(i%3+0.5)*S/3,y2-S/2+(Math.floor(i/3)+0.5)*S/3,S*0.24,'center');
  arrow(c,x+S/2+8,y1,w*0.58,h*0.44,INK,2.2,7);arrow(c,x+S/2+8,y2,w*0.58,h*0.56,INK,2.2,7);drawMb(c,w*0.8,h*0.5,h*0.78/46);
});
// How does a structure become a medicine?: a small molecule settles into a pocket of a protein
if($('cmdCv'))fig('cmdCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const cx=w*0.5,cy=h*0.56,R=h*0.36,u=(t%6)/6,k=Math.min(1,u*1.8),e=k*k*(3-2*k);
  c.beginPath();c.arc(cx,cy,R,-Math.PI/2+0.42,Math.PI*1.5-0.42);c.arc(cx,cy-R*0.62,R*0.36,Math.PI-0.5,0.5,true);c.closePath();c.fillStyle='#9fc0e8';c.fill();pen(c,2.4);c.stroke();
  disc(c,cx+(1-e)*w*0.3,cy-R*0.62-(1-e)*h*0.2,R*0.27,'#f0913a',2);if(e>0.98)txt(c,'fits',cx+R+14,cy-R*0.62,15,'left');});
// What is protein design?: from a wanted shape to the letters that fold into it
if($('cdsCv'))fig('cdsCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x=w*0.22,cy=h*0.5,R=h*0.26;for(let i=0;i<6;i++){const a=i*Math.PI/3+t*0.25;disc(c,x+R*Math.cos(a),cy+R*Math.sin(a),h*0.11,i%2?'#9fc0e8':'#f6c52e',2);}
  arrow(c,w*0.42,cy,w*0.56,cy,INK,2.4,8);const L='MKEELLRKAIELAKEG',n=Math.floor((t*4)%(L.length+6));for(let i=0;i<Math.min(n,L.length);i++)txt(c,L[i],w*0.62+(i%8)*h*0.15,cy+((i/8|0)-0.5)*h*0.24,h*0.17,'left');});
// What has been found at NE-CAT?: a pattern of spots, and the structures that came from it
if($('cfdCv'))fig('cfdCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=h*0.6,x=w*0.18,cy=h*0.5;rectF(c,x-S/2,cy-S/2,S,S,WHITE,2);for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){if((i*5+j*3+40)%3===0||Math.hypot(i,j)>3.4||(!i&&!j))continue;disc(c,x+i*S/8,cy+j*S/8,1.6,INK,0);}
  arrow(c,x+S/2+8,cy,w*0.44,cy,INK,2.4,8);const n=Math.floor((t/1.5)%4);[['#9fc0e8',0.54],['#f6c52e',0.7],['#bfe0b4',0.86]].forEach(([col,q],i)=>{const r=h*0.17;c.globalAlpha=i<=n-0?1:0.25;if(n===3||i<=n){c.globalAlpha=1;}disc(c,w*q,cy-r*0.25,r,col,2);disc(c,w*q+r*0.5,cy+r*0.55,r*0.7,col,2);c.globalAlpha=1;});});
// Crystallization: a drop climbs through the phase diagram and falls back to the solubility curve
if($('cxtCv'))fig('cxtCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x=w*0.14,y=h*0.1,bw=w*0.72,bh=h*0.76,so=p=>0.9*Math.exp(-3.4*p)+0.03,X=p=>x+p*bw,Y=v=>y+bh-Math.min(1.05,v)*bh;rectF(c,x,y,bw,bh,WHITE,2);
  c.save();c.beginPath();c.rect(x,y,bw,bh);c.clip();[[1,[]],[2.2,[6,5]]].forEach(([m,d])=>{pen(c,2);c.setLineDash(d);c.beginPath();for(let i=0;i<=40;i++){const p=i/40;i?c.lineTo(X(p),Y(m*so(p)+(m>1?0.04:0))):c.moveTo(X(p),Y(m*so(p)+(m>1?0.04:0)));}c.stroke();c.setLineDash([]);});c.restore();
  const u=(t%8)/8,k=Math.min(1,u/0.6),p=0.22*(1+k),v=0.2*(1+k),dd=u<0.6?0:(u-0.6)/0.4,v2=v-(v-so(p))*dd;line(c,X(0.22),Y(0.2),X(p),Y(v),2.2,RED);if(dd>0)line(c,X(p),Y(v),X(p),Y(v2),2.2,RED,[5,4]);disc(c,X(p),Y(v2),6,RED,1.6);});
// From images to a structure: a lattice is found through the spots, and each spot is boxed and measured
if($('cprCv'))fig('cprCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=h*0.8,cx=w*0.5,cy=h*0.5,st=Math.floor((t/1.6)%3),a=0.3,U=S/9;rectF(c,cx-S*0.9,cy-S/2,S*1.8,S,WHITE,2);c.save();c.beginPath();c.rect(cx-S*0.9,cy-S/2,S*1.8,S);c.clip();
  if(st>=1)for(let i=-12;i<=12;i++){const dx=Math.cos(a)*U,dy=Math.sin(a)*U;line(c,cx+i*dx-dy*20,cy+i*dy+dx*20,cx+i*dx+dy*20,cy+i*dy-dx*20,1,'rgba(47,109,181,.5)');line(c,cx-i*dy-dx*20,cy+i*dx-dy*20,cx-i*dy+dx*20,cy+i*dx+dy*20,1,'rgba(47,109,181,.5)');}
  for(let i=-9;i<=9;i++)for(let j=-5;j<=5;j++){if((i*7+j*5+90)%3===0||(!i&&!j))continue;const X=cx+(i*Math.cos(a)-j*Math.sin(a))*U,Y=cy+(i*Math.sin(a)+j*Math.cos(a))*U;disc(c,X,Y,2,INK,0);if(st===2){pen(c,1.2,RED);c.strokeRect(X-5,Y-5,10,10);}}c.restore();});
// What the APS upgrade changed: the electron beam before and after, to one scale
if($('cupCv'))fig('cupCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const u=(t%8)/8,k0=u<0.25?0:u<0.5?(u-0.25)*4:u<0.75?1:1-(u-0.75)*4,k=k0*k0*(3-2*k0),S=w*0.8/600,sx=275+(14.5-275)*k,sy=10+(3.1-10)*k,cx=w*0.5,cy=h*0.5;
  c.fillStyle='rgba(120,90,60,.22)';c.fillRect(w*0.05,cy-35*S,w*0.9,70*S);c.beginPath();c.ellipse(cx,cy,2*sx*S,Math.max(1,2*sy*S),0,0,7);c.fillStyle='rgba(47,109,181,.35)';c.fill();c.beginPath();c.ellipse(cx,cy,sx*S,Math.max(1,sy*S),0,0,7);c.fillStyle=BLUE;c.fill();txt(c,k<0.5?'before':'after',w*0.07,h*0.14,15,'left');});
// Fourier series: a few waves and their sum
if($('cfoCv'))fig('cfoCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const x=w*0.08,bw=w*0.84,n=1+Math.floor((t/1.2)%6),A=[1,0.7,0.9,0.5,0.6,0.4],P=[0.3,1.9,4.1,2.5,5.3,0.8];
  for(let k=1;k<=n;k++){pen(c,1.4,'rgba(47,109,181,.4)');c.beginPath();for(let i=0;i<=120;i++){const u=i/120,Y=h*0.3-h*0.09*A[k-1]*Math.cos(2*Math.PI*k*u-P[k-1]);i?c.lineTo(x+bw*u,Y):c.moveTo(x+bw*u,Y);}c.stroke();}
  pen(c,3,BLUE);c.beginPath();for(let i=0;i<=160;i++){const u=i/160;let s=0;for(let k=1;k<=n;k++)s+=A[k-1]*Math.cos(2*Math.PI*k*u-P[k-1]);const Y=h*0.72-h*0.07*s;i?c.lineTo(x+bw*u,Y):c.moveTo(x+bw*u,Y);}c.stroke();});
// Reciprocal space: a lattice of points turning through the Ewald circle
if($('crcCv'))fig('crcCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const S=h*0.3,ox=w*0.56,oy=h*0.5,R=1.25,ccx=ox-R*S,a=t*0.15,ca=Math.cos(a),sa=Math.sin(a);line(c,w*0.04,oy,w*0.96,oy,2,ORG);pen(c,2.2,BLUE);c.beginPath();c.arc(ccx,oy,R*S,0,7);c.stroke();
  for(let i=-7;i<=7;i++)for(let j=-7;j<=7;j++){if(!i&&!j)continue;const X=(i*ca-j*sa)*0.3,Y=(i*sa+j*ca)*0.3;if(Math.hypot(X,Y)>1.7)continue;const on=Math.abs(Math.hypot(X+R,Y)-R)<0.02;if(on)line(c,ccx,oy,ccx+(X+R)*S*3,oy-Y*S*3,1.4,'rgba(216,65,47,.7)');disc(c,ox+X*S,oy-Y*S,on?4:2,on?RED:'#8c98a4',on?1:0);}disc(c,ccx,oy,3.5,BLUE,1);});
// Symmetry in crystals: one shape and its copies about an axis
if($('csyCv'))fig('csyCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const NS=[2,3,4,6],n=NS[Math.floor((t/2.5)%4)],cx=w*0.5,cy=h*0.52,s=h*0.2;for(let i=0;i<n;i++){c.save();c.translate(cx,cy);c.rotate(i*2*Math.PI/n);c.translate(h*0.04,-s*1.3);c.scale(s,s);c.beginPath();c.moveTo(0.25,0.1);c.lineTo(0.25,1);c.lineTo(0.95,1);c.lineTo(0.95,0.76);c.lineTo(0.52,0.76);c.lineTo(0.52,0.62);c.lineTo(0.8,0.62);c.lineTo(0.8,0.4);c.lineTo(0.52,0.4);c.lineTo(0.52,0.1);c.closePath();c.fillStyle=i?LTBLUE:YEL;c.fill();c.lineWidth=2/s;c.strokeStyle=INK;c.stroke();c.restore();}disc(c,cx,cy,5,INK,0);});
// What is a protein?: a chain of amino acids on the left, and the folded protein (myoglobin) it becomes
if($('cxCv'))fig('cxCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const cy=h*0.5,n=26,x0=w*0.05,x1=w*0.5,s=h*0.8/46,r=Math.min(6,(x1-x0)/n*0.48);
  const P=[];for(let i=0;i<n;i++)P.push([x0+(x1-x0)*i/(n-1),cy+h*0.16*Math.sin(i*0.55+t*0.9)]);
  pen(c,2.2,'rgba(27,27,27,.55)');c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  P.forEach((p,i)=>disc(c,p[0],p[1],r,AACOL[AAKIND(MB.seq[i])],1.2));
  arrow(c,x1+10,cy,w*0.62,cy,INK,2.2,7);drawMb(c,w*0.81,cy,s);
});
// How MX works: a crystal turning in the beam, the images on the detector, and the structure (myoglobin), as in the guide's opening figure
if($('cmCv')){let cmN=-1,cmS=[];
fig('cmCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const cy=h*0.5,x1=w*0.105,x2=w*0.405,x3=w*0.815,s=h*0.21,n=Math.floor(t*10);if(n!==cmN){cmS=rotImage(n);cmN=n;}
  // the crystal in its loop, on a pin
  const th=n*0.3*Math.PI/180*4,ct=Math.cos(th),st=Math.sin(th),tl=0.42,la=th+0.5,lrx=Math.max(0.05,Math.abs(Math.cos(la)))*s*0.78,rf=Math.sin(2*la)<0;
  const half=front=>{pen(c,1.8);c.beginPath();if(front===rf)c.ellipse(x1,cy,lrx,s*0.58,0,-Math.PI/2,Math.PI/2);else c.ellipse(x1,cy,lrx,s*0.58,0,Math.PI/2,1.5*Math.PI);c.stroke();};
  line(c,w*0.02,cy,x1-s*0.3,cy,2.6,BLUE);line(c,x1,cy+s*0.56,x1,cy+s*1.05,2.4);half(false);
  const V=[];for(const X of[-1,1])for(const Y of[-1,1])for(const Z of[-1,1]){const x=X*0.4,y=Y*0.29,z=Z*0.24,xa=x*ct+z*st,za=-x*st+z*ct,yb=y*Math.cos(tl)-za*Math.sin(tl),zb=y*Math.sin(tl)+za*Math.cos(tl);V.push([x1+xa*s,cy-yb*s,zb]);}
  [[0,1,3,2,GRN],[4,6,7,5,GRN],[0,4,5,1,'#4a8f5a'],[2,3,7,6,LTGRN],[0,2,6,4,'#6fb37e'],[1,5,7,3,'#6fb37e']].map(q=>({q,z:(V[q[0]][2]+V[q[1]][2]+V[q[2]][2]+V[q[3]][2])/4})).sort((a,b)=>a.z-b.z).slice(3).forEach(({q})=>poly(c,[V[q[0]],V[q[1]],V[q[2]],V[q[3]]],q[4],1.8));
  half(true);
  // the detector, with the spots of this image
  const B=detFace(c,x2,cy,h*0.8/DETG.hh),k=Math.max(0.55,B.w/230);
  cmS.forEach(q=>{c.fillStyle=`rgba(27,27,27,${Math.min(1,0.5+2.5*q.a).toFixed(2)})`;c.beginPath();c.arc(x2+q.u*B.w/2,cy+q.v*B.h/2,(0.7+2.3*Math.sqrt(q.a))*k,0,7);c.fill();});
  // the structure
  const W=w*0.31,H=h*0.8;rectF(c,x3-W/2,cy-H/2,W,H,WHITE,2.2);const sm=Math.min(W/56,H/52);c.save();c.beginPath();c.rect(x3-W/2,cy-H/2,W,H);c.clip();drawMb(c,x3,cy-1.9*sm,sm);c.restore();
  arrow(c,w*0.19,cy,w*0.232,cy,INK,2.2,7);arrow(c,w*0.585,cy,w*0.648,cy,INK,2.2,7);
});}
// the chooser at the top of the index: show every guide, the five-minute ones or the in-depth ones. ?level=intro or ?level=depth in the address sets it
const ts=$('trackSel');if(ts){const bs=[...ts.querySelectorAll('button')];
  const set=v=>{bs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));document.querySelectorAll('.card[data-level]').forEach(el=>{el.hidden=v!=='all'&&el.dataset.level!==v;});
    document.querySelectorAll('section.series').forEach(s=>{const e=s.querySelector('.nonehere');if(e)e.hidden=s.querySelectorAll('.card:not([hidden])').length>0;});
    try{history.replaceState(null,'',v==='all'?location.pathname:'?level='+v);}catch(e){}};
  bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.v)));let q=null;try{q=new URLSearchParams(location.search).get('level');}catch(e){}set(q==='intro'||q==='depth'?q:'all');}
})();
