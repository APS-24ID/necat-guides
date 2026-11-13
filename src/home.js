// ---------- WELCOME BANNER: from the ring to your data ----------
fig('homeCv',w=>w<560?1.25:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?11:14;
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
fig('c0Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const cx=w*0.64,cy=h*0.52,R=h*0.36,bx=w*0.3,by=h*0.6,br=h*0.17;
  pen(c,9,WHITE);c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();pen(c,2);c.beginPath();c.arc(cx,cy,R+4.5,0,7);c.stroke();c.beginPath();c.arc(cx,cy,R-4.5,0,7);c.stroke();
  pen(c,6,WHITE);c.beginPath();c.arc(bx,by,br,0,7);c.stroke();pen(c,1.8);c.beginPath();c.arc(bx,by,br+3,0,7);c.stroke();c.beginPath();c.arc(bx,by,br-3,0,7);c.stroke();
  const lx0=w*0.05,lx1=bx-br-8,ly=by;for(let i=0;i<5;i++)rectF(c,lx0+i*(lx1-lx0)/5,ly-7,(lx1-lx0)/5,14,LTORG,1.6);
  line(c,lx1,ly,bx-br,by,1.8);line(c,bx+br,by,cx-R*0.98,cy+R*0.2,1.8);
  for(let i=0;i<14;i++){const a=i/14*2*Math.PI+t*0.8;disc(c,cx+R*Math.cos(a),cy+R*Math.sin(a),3,YEL,1.2);}
  const a=t*2.4;disc(c,bx+br*Math.cos(a),by+br*Math.sin(a),3.6,YEL,1.2);
  const u=(t*0.5)%1;disc(c,lx0+u*(lx1-lx0),ly,2.6,YEL,1.1);
});
fig('c1Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const x0=w*0.06,x1=w*0.94,n=8,pw=(x1-x0)/n,yc=h*0.5,gp=h*0.2,mh=h*0.16,k=2*Math.PI/(2*pw),A=h*0.12;
  for(let i=0;i<n;i++){rectF(c,x0+i*pw,yc-gp-mh,pw,mh,i%2?BLUE:RED,1.8);rectF(c,x0+i*pw,yc+gp,pw,mh,i%2?RED:BLUE,1.8);}
  pen(c,2.4);c.beginPath();for(let x=x0;x<=x1;x+=2){const y=yc+A*Math.sin(k*(x-x0));x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  const xe=x0+((t*0.16)%1)*(x1-x0);
  pen(c,2.4,ORG);c.beginPath();for(let x=xe+10;x<=Math.min(x1,xe+70);x+=1.5){const y=yc+A*Math.sin(k*(xe-x0))+5*Math.sin((x-xe)*0.9);x===xe+10?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  electron(c,xe,yc+A*Math.sin(k*(xe-x0)),7);
});
fig('c2Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const x0=w*0.08,x1=w*0.88,yc=h*0.55,A=h*0.3,k=2*Math.PI/(w*0.26);
  line(c,x0,yc,x1,yc,2.4,BLUE);arrow(c,x1-4,yc,x1+12,yc,BLUE,2.4,9);
  pen(c,1.6,ORG);c.beginPath();for(let x=x0;x<=x1;x+=2){const y=yc-A*Math.sin(k*(x-x0)-t*3);x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
  for(let x=x0+6;x<x1;x+=w*0.036){const v=A*Math.sin(k*(x-x0)-t*3);if(Math.abs(v)>5)arrow(c,x,yc,x,yc-v,ORG,2.2,6);}
  txt(c,'E',x0+2,yc-A-6,18,'left',ORG);
});
fig('c3Cv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
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
// guide 3: a crystal, its spots, and the density they give
if($('cmCv'))fig('cmCv',2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);
  const cy=h*0.52,x1=w*0.15,x2=w*0.45,x3=w*0.79,s=h*0.26;
  line(c,w*0.03,cy,x1-s*0.5,cy,2.6,BLUE);
  poly(c,[[x1,cy-s],[x1+s*0.8,cy-s*0.25],[x1+s*0.5,cy+s],[x1-s*0.5,cy+s],[x1-s*0.8,cy-s*0.25]],GRN,2.2);line(c,x1-s*0.8,cy-s*0.25,x1+s*0.8,cy-s*0.25,1.4);
  rectF(c,x2-s*1.25,cy-s*1.25,s*2.5,s*2.5,WHITE,2.2);
  for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const x=i+0.5*(j&1),y=j*0.87,d=Math.hypot(x,y);if(d<0.6||d>3.4)continue;const on=Math.sin(t*1.4+i*1.7+j*2.3)>0.86;
    c.fillStyle=on?ORG:INK;c.beginPath();c.arc(x2+x*s*0.34,cy+y*s*0.34,(on?3.4:1.2+1.6*Math.abs(Math.sin(i*12.9+j*78.2)))*(1-d*0.12),0,7);c.fill();}
  const P=[[-0.96,0.33],[-0.48,-0.3],[0,0.33],[0.48,-0.3],[0.96,0.33]];
  c.lineJoin='round';c.lineCap='round';c.strokeStyle=INK;c.lineWidth=s*0.95;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x3+x*s,cy+y*s):c.moveTo(x3+x*s,cy+y*s));c.stroke();
  c.strokeStyle=LTBLUE;c.lineWidth=s*0.95-5;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x3+x*s,cy+y*s):c.moveTo(x3+x*s,cy+y*s));c.stroke();
  pen(c,2.6);c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x3+x*s,cy+y*s):c.moveTo(x3+x*s,cy+y*s));c.stroke();P.forEach(([x,y],i)=>disc(c,x3+x*s,cy+y*s,4.2,i===2?RED:i===4?BLUE:'#5d6a73',1.6));
  fatArrow(c,x1+s*1.05,cy,x2-s*1.45,cy,YEL,6);fatArrow(c,x2+s*1.45,cy,x3-s*1.6,cy,YEL,6);
});
// the chooser at the top of the index: show every guide, the five-minute ones or the in-depth ones. ?level=intro or ?level=depth in the address sets it
const ts=$('trackSel');if(ts){const bs=[...ts.querySelectorAll('button')];
  const set=v=>{bs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));document.querySelectorAll('.card[data-level]').forEach(el=>{el.hidden=v!=='all'&&el.dataset.level!==v;});
    document.querySelectorAll('section.series').forEach(s=>{const e=s.querySelector('.nonehere');if(e)e.hidden=s.querySelectorAll('.card:not([hidden])').length>0;});
    try{history.replaceState(null,'',v==='all'?location.pathname:'?level='+v);}catch(e){}};
  bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.v)));let q=null;try{q=new URLSearchParams(location.search).get('level');}catch(e){}set(q==='intro'||q==='depth'?q:'all');}
})();
