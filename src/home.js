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
})();
