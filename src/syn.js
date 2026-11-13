// ---------- the guide "What is a synchrotron?" (Introductory level) ----------
// Five stops, one figure and one control at each. The script is the drawing kit, introkit.js and this file.

// ---------- opening figure: the machine from above ----------
if($('synHeroCv')){
fig('synHeroCv',w=>w<560?1.1:2.8,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const cx=w*0.5,cy=h*0.53,R=Math.min(h*0.37,w*0.3),pw=narrow?4:5.5,br=R*0.4,bx=cx,by=cy+R-pw-br-3;
  // X-rays leave along the tangents, each to a beamline
  const Lmax=narrow?w*0.36:w*0.34,mg=narrow?20:26;
  [-108,-90,-72,72,90,108].forEach((deg,i)=>{const a=deg*Math.PI/180,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a),dx=-Math.sin(a),dy=Math.cos(a);
    // each beam stops short of the edge of the picture
    const Lb=Math.min(Lmax,dx>0?(w-mg-x)/dx:(x-mg)/-dx,Math.abs(dy)<0.01?1e9:dy>0?(h-mg-y)/dy:(y-mg)/-dy);
    pen(c,2.6,ORG);c.setLineDash([7,7]);c.lineDashOffset=-t*45;c.beginPath();c.moveTo(x,y);c.lineTo(x+dx*Lb,y+dy*Lb);c.stroke();c.setLineDash([]);c.lineDashOffset=0;
    c.save();c.translate(x+dx*Lb,y+dy*Lb);c.rotate(Math.atan2(dy,dx));rectF(c,0,-7,narrow?14:20,14,WHITE,2);c.restore();});
  // the linac and the booster sit inside the ring
  const lx0=cx-R*0.72,ly=cy-R*0.28,lx1=bx-br*0.72,ly1=by-br*0.7;
  for(let i=0;i<5;i++){const u0=i/5,u1=(i+1)/5;c.save();c.translate(lx0+(lx1-lx0)*u0,ly+(ly1-ly)*u0);c.rotate(Math.atan2(ly1-ly,lx1-lx0));rectF(c,0,-5,Math.hypot(lx1-lx0,ly1-ly)/5,10,LTORG,1.6);c.restore();}
  pipe(c,bx,by,br,narrow?3:3.5);pipe(c,cx,cy,R,pw);
  for(let i=0;i<16;i++){const a=i/16*6.2832+t*0.7;disc(c,cx+R*Math.cos(a),cy+R*Math.sin(a),narrow?2.6:3.4,YEL,1.2);}
  {const a=t*2.2;disc(c,bx+br*Math.cos(a),by+br*Math.sin(a),narrow?2.6:3.4,YEL,1.2);const u=(t*0.5)%1;disc(c,lx0+(lx1-lx0)*u,ly+(ly1-ly)*u,narrow?2.2:2.8,YEL,1.1);}
  cap(c,'storage ring',cx,Math.max(13,cy-R-(narrow?16:20)),'center',fs);
  tag(c,'booster',bx,by,'center',fs);tag(c,'linac',lx0-4,ly-(narrow?14:18),'left',fs);
  cap(c,'x-rays',narrow?w-6:cx+R+Lmax*0.5,narrow?cy-R*0.55:cy-R*0.62,narrow?'right':'center',fs);
  if(!narrow)cap(c,'beamlines',cx-R-Lmax*0.5,cy+R*0.62,'center',fs);
});
}

// ---------- stop 1: how close to the speed of light ----------
if($('sSpdCv')){
let LE=5;
// how far below the speed of light, as a fraction of it, for an electron given 10^le electron-volts
const dOf=le=>{const g=1+Math.pow(10,le)/510999,b=Math.sqrt(1-1/(g*g));return 1/(g*g*(1+b));};
const F=fig('sSpdCv',w=>w<560?1.25:3.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?11:14;
  const x0=w*0.06,x1=w*0.95,y=h*0.56,X=d=>x0+Math.min(9.2,-Math.log10(d))/9.2*(x1-x0),d=dOf(LE),xe=X(d);
  rectF(c,x0,y-10,x1-x0,20,WHITE,2);c.fillStyle=LTYEL;c.fillRect(x0+1,y-9,Math.max(0,xe-x0-1),18);
  for(let n=1;n<=9;n++){const x=x0+n/9.2*(x1-x0);line(c,x,y+10,x,y+17,2);if(!narrow||n%4===1)txt(c,n===1?'90%':'99'+(n>2?'.'+'9'.repeat(n-2):'')+'%',narrow&&n===9?w-4:x,y+(narrow?29:32),fs,narrow&&n===9?'right':'center');}
  txt(c,'of the speed of light',(x0+x1)/2,y+(narrow?48:54),fs+1,'center');
  // where the electrons are when they leave the linac (425 MeV) and the booster (6 GeV)
  [[Math.log10(425e6),'out of the linac'],[Math.log10(6e9),'out of the booster']].forEach(([le,s],i)=>{const x=X(dOf(le)),yy=y-(narrow?(i?58:34):36);
    line(c,x,yy+10,x,y-10,1.6,INK,[3,3]);tag(c,s,Math.min(x,x1-4),yy,i||narrow?'right':'center',fs);});
  electron(c,xe,y,narrow?8:10);
  tag(c,fmtE(LE),Math.max(x0+4,xe-(narrow?8:12)),y-(narrow?86:74),'left',fs+1);
},false);
bind('sE',v=>fmtE(v),()=>{LE=+$('sE').value;const d=dOf(LE),dv=299792458*d;
  setT('sV',(100*(1-d)).toFixed(Math.max(0,Math.ceil(-Math.log10(d))-2))+'% of the speed of light');
  setT('sD',dv>=1e6?Math.round(dv/1e3).toLocaleString('en-US')+' km/s':dv>=1e3?(dv/1e3).toFixed(dv<1e4?1:0)+' km/s':dv.toFixed(dv<10?1:0)+' m/s');F.w&&F.draw(F);});
}

// ---------- stop 2: magnets hold the electrons in the ring ----------
if($('sRingCv')){
let B=0.8;
fig('sRingCv',w=>w<560?1.0:2.2,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const cx=w/2,cy=h*0.5,R=Math.min(h*0.39,w*0.4),pw=R*0.07,r=R/B,px=cx,py=cy+R-r;
  for(let i=0;i<20;i++){const a=(i+0.5)/20*6.2832;c.save();c.translate(cx+R*Math.cos(a),cy+R*Math.sin(a));c.rotate(a);rectF(c,-pw*2,-R*0.085,pw*4,R*0.17,LTBLUE,1.6);c.restore();}
  pipe(c,cx,cy,R,pw);
  // the path for this strength: a circle that starts at the bottom of the ring, heading left
  let end=6.2832,lost=null;pen(c,2.4,INK);c.setLineDash([6,5]);c.beginPath();c.moveTo(cx,cy+R);
  for(let u=0.01;u<=6.2832;u+=0.01){const x=px+r*Math.cos(1.5708+u),y=py+r*Math.sin(1.5708+u);if(Math.abs(Math.hypot(x-cx,y-cy)-R)>pw){end=u;lost=[x,y];break;}c.lineTo(x,y);}
  c.stroke();c.setLineDash([]);
  if(lost){const [x,y]=lost;poly(c,[0,1,2,3,4,5,6,7,8,9].map(i=>{const a=i/10*6.2832,q=i%2?5:12;return [x+q*Math.cos(a),y+q*Math.sin(a)];}),RED,1.6);}
  const n=lost?1:6;for(let k=0;k<n;k++){const u=lost?(t*1.6*B)%(end+0.4):(t*0.9+k*6.2832/n)%6.2832;if(u<end)electron(c,px+r*Math.cos(1.5708+u),py+r*Math.sin(1.5708+u),narrow?5:7);}
  arrow(c,cx+R*0.34,cy+R+pw+(narrow?9:12),cx+R*0.06,cy+R+pw+(narrow?9:12),INK,2,7);
  tag(c,'electrons start here',cx+R*0.36+4,cy+R+pw+(narrow?9:12),'left',fs);
  txt(c,lost?(B<1?'too wide':'too tight'):'just right',cx,cy,fs+5,'center',lost?RED:GDK);
  cap(c,'magnets',narrow?6:cx-R-pw*2-10,narrow?13:cy,narrow?'left':'right',fs);
});
bind('sB',v=>Math.round(v*100)+'%',()=>{B=+$('sB').value;setT('sP',Math.abs(1/B-1)<0.035?'closes on itself, and they stay in':B<1?'too wide: they hit the outer wall':'too tight: they hit the inner wall');});
}

// ---------- stop 3: a turning electron gives off light, and a fast one sends it forward ----------
if($('sConeCv')){
let LE=5;
const F=fig('sConeCv',w=>w<560?1.2:2.6,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const g=1+Math.pow(10,LE)/510999,ex=w*(narrow?0.3:0.24),ey=h*0.56,Rp=h*1.7,half=Math.PI*Math.min(1,1.25*Math.pow(g,-0.4)),Lg=Math.max(w,h)*1.3;
  // the path of the electron: it is turning, toward the bottom of the page
  pen(c,2,INK);c.setLineDash([6,5]);c.beginPath();c.arc(ex,ey+Rp,Rp,-1.5708-0.5,-1.5708+0.75);c.stroke();c.setLineDash([]);
  // the light: all around for a slow electron, a narrow beam straight ahead for a fast one
  const gr=c.createRadialGradient(ex,ey,3,ex,ey,Lg*0.7);gr.addColorStop(0,'rgba(238,138,43,.95)');gr.addColorStop(0.5,'rgba(238,138,43,.5)');gr.addColorStop(1,'rgba(238,138,43,0)');
  c.fillStyle=gr;c.beginPath();c.moveTo(ex,ey);c.arc(ex,ey,Lg,-half,half);c.closePath();c.fill();
  if(half<3.1)[-1,1].forEach(sg=>line(c,ex,ey,ex+Lg*0.5*Math.cos(half*sg),ey+Lg*0.5*Math.sin(half*sg),1.4,'rgba(200,100,20,.8)'));
  electron(c,ex,ey,narrow?8:10);
  arrow(c,ex-(narrow?40:60),ey-(narrow?30:40),ex-(narrow?12:16),ey-(narrow?24:30),INK,2,7);tag(c,'electron',ex-(narrow?40:60),ey-(narrow?44:56),'center',fs);
  cap(c,'x-rays',w-8,narrow?14:18,'right',fs);
  tag(c,fmtE(LE),ex,ey+(narrow?28:36),'center',fs+1);
},false);
bind('sG',v=>fmtE(v),()=>{LE=+$('sG').value;const g=1+Math.pow(10,LE)/510999,deg=2/g*57.2958,wd=100/g;
  setT('sA',g<1.6?'almost every direction':deg>=1?'about '+deg.toFixed(deg<10?1:0)+'°':Math.max(1,Math.round(deg*1000))+' thousandths of a degree');
  setT('sW',g<3?'not a beam yet':wd>=1?wd.toFixed(1)+' m':wd>=0.01?(wd*100).toFixed(wd<0.1?1:0)+' cm':(wd*1000).toFixed(1)+' mm');F.w&&F.draw(F);});
}

// ---------- stop 4: bunches of electrons, flashes of X-rays ----------
if($('sBunCv')){
let N=216;
fig('sBunCv',w=>w<560?1.0:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const cx=w*(narrow?0.4:0.34),cy=h*0.55,R=Math.min(h*0.36,w*0.3),pw=narrow?4:5.5,x1=w*0.93,Lb=x1-cx,yb=cy-R,W=0.22,sp=6.2832*R/N,dr=Math.max(1.1,Math.min(3.2,sp*0.32)),dh=Math.max(0.9,Math.min(3,sp*0.22));
  // the beamline leaves from the top of the ring
  line(c,cx,yb,x1,yb,1.6,'rgba(27,27,27,.35)');pipe(c,cx,cy,R,pw);
  let lit=false;
  for(let i=0;i<N;i++){const a=i/N*6.2832+t*W,am=((a+1.5708)%6.2832+6.2832)%6.2832,s=am*R;
    disc(c,cx+R*Math.cos(a),cy+R*Math.sin(a),dr,YEL,dr<2?0.7:1.2);
    if(s<Lb){line(c,cx+s-dh,yb,cx+s+dh,yb,3.2,ORG);if(Lb-s<7)lit=true;}}
  rectF(c,x1,yb-(narrow?13:16),narrow?16:22,narrow?26:32,WHITE,2);disc(c,x1+(narrow?8:11),yb,narrow?4:5.5,lit?ORG:WHITE,1.6);
  cap(c,'flashes of x-rays',Math.min(w-8,x1+(narrow?16:22)),yb-(narrow?28:36),'right',fs);
  cap(c,'bunches of electrons',narrow?6:cx,narrow?h-14:cy,narrow?'left':'center',fs);
});
bind('sN',v=>v.toFixed(0),()=>{N=+$('sN').value;setT('sF',(N*0.272).toFixed(1)+' million');setT('sT',(1e9/(N*272000)).toFixed(0)+' billionths of a second');});
}

// ---------- stop 5: the electron beam before and after the upgrade ----------
if($('sUpgCv')){
let U=0,cur=0;
const F=fig('sUpgCv',w=>w<560?1.25:3.0,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  cur+=(U-cur)*0.12;if(Math.abs(U-cur)<0.003)cur=U;
  const sc=w*0.72/300,bw=280*Math.pow(14.7/280,cur)*sc,bh=10*Math.pow(3.2/10,cur)*sc,cx=w*0.5,cy=h*0.27,hy=h*0.66,hr=35*sc;
  c.fillStyle=ORG;c.beginPath();c.ellipse(cx,cy,bw/2,Math.max(1.2,bh/2),0,0,7);c.fill();pen(c,1.6);c.stroke();
  tag(c,'the electron beam',cx,cy-Math.max(10,bh/2)-(narrow?14:18),'center',fs);
  disc(c,cx,hy,hr,'#c9a27a',2);tag(c,'a human hair, seen end on',cx+hr+10>w*0.62&&narrow?cx:cx+hr+10,narrow?hy+hr+14:hy,narrow?'center':'left',fs);
  const bx=w*0.04,by=h-(narrow?14:18);line(c,bx,by,bx+100*sc,by,4);line(c,bx,by-6,bx,by+6,2);line(c,bx+100*sc,by-6,bx+100*sc,by+6,2);tag(c,'100 µm',bx,by-(narrow?17:21),'left',fs);
});
choice('sU',v=>{U=+v;setT('sS',U?'15 × 3 µm':'280 × 10 µm');setT('sH',U?'about a fifth of a hair':'four hairs wide');if(!playing){cur=U;F.w&&F.draw(F);}});
}

capK();
})();
