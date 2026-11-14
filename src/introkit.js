// ---------- helpers shared by the Introductory guides. The script of each is the drawing kit, this file, and the guide's own file ----------
const GDK='#2f7a45';
function tag(c,s,x,y,align='left',size=15,col=INK){c.font=`${size}px ${HAND}`;const tw=c.measureText(s).width,pw=tw+10,ph=size+6,x0=align==='center'?x-pw/2:align==='right'?x-pw:x;
  c.fillStyle=WHITE;c.fillRect(x0,y-ph/2,pw,ph);pen(c,1.6);c.strokeRect(x0,y-ph/2,pw,ph);c.fillStyle=col;c.textAlign='left';c.textBaseline='middle';c.fillText(s,x0+5,y+1);}
// seeded random numbers, so that figures do not flicker
function rng(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
const setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
// a color to stand for an X-ray energy between 6 and 20 keV: red for low, violet for high
const hueE=E=>`hsl(${Math.round(Math.max(0,Math.min(1,(E-6)/14))*270)},78%,50%)`;
function stopNo(c,n,x,y,r=13){disc(c,x,y,r,RED,2);txt(c,String(n),x,y+1,Math.round(r*1.25),'center','#fff');}
function wave(c,x0,x1,y,amp,lam,ph,col,lw=2){if(x1<=x0)return;pen(c,lw,col);c.beginPath();for(let x=x0;x<=x1;x+=2){const yy=y+amp*Math.sin((x-x0)/lam*6.2832-ph);x===x0?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();}
function magnets(c,x0,x1,y,hh,n,flip){const bw=(x1-x0)/n;for(let i=0;i<n;i++)rectF(c,x0+i*bw,y,bw,hh,((i%2)^flip)?RED:BLUE,2);}

const fmtE=le=>{const e=Math.pow(10,le);return e<1e6?(e/1e3).toFixed(e<1e4?1:0)+' keV':e<1e9?(e/1e6).toFixed(e<1e7?1:0)+' MeV':(e/1e9).toFixed(1)+' GeV';};
// the ring's pipe, seen from above
function pipe(c,cx,cy,R,pw){pen(c,pw*2,WHITE);c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();pen(c,2);c.beginPath();c.arc(cx,cy,R+pw,0,7);c.stroke();c.beginPath();c.arc(cx,cy,R-pw,0,7);c.stroke();}
// a made-up diffraction pattern: spots on a lattice. Each spot stands for detail of d ångströms, with dEdge at the edge of the picture
function mkSpots(seed,dEdge){const r=rng(seed),S=[];for(let i=-10;i<=10;i++)for(let j=-10;j<=10;j++){const x=(i+0.3*j)/10.5,y=j*0.95/10.5,rad=Math.hypot(x,y);if(rad>0.97||rad<0.09||Math.abs(x)>0.97||r()<0.4)continue;S.push({x,y,rad,d:dEdge/rad,s:(0.45+r())*(1-0.5*rad)});}return S;}
const ICE=[3.90,3.67,3.44,2.67,2.25,2.07,1.95,1.92,1.88];   // spacings of the rings from ordinary (hexagonal) ice, in ångströms
// draws the pattern in a square of side S. Spots fade with dose by the rule of 10 MGy for each ångström. ice from 0 to 1 adds ice rings
function drawPattern(c,cx,cy,S,spots,dose,dEdge,ice){rectF(c,cx-S/2,cy-S/2,S,S,WHITE,3);
  if(ice>0.01)ICE.forEach((d,i)=>{const R=dEdge/d*S/2*0.95;if(R<S/2-2){pen(c,(i<3?3.2:2)*(0.4+0.6*ice),`rgba(70,80,92,${(0.6*ice).toFixed(3)})`);c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();}});
  spots.forEach(s=>{const k=Math.pow(2,-dose/(10*s.d))*(1-0.55*(ice||0));if(k<0.04)return;c.fillStyle=`rgba(27,27,27,${Math.min(1,0.3+k).toFixed(3)})`;c.beginPath();c.arc(cx+s.x*S/2*0.95,cy+s.y*S/2*0.95,(0.8+1.9*s.s)*Math.sqrt(k),0,7);c.fill();});
  disc(c,cx,cy,Math.max(4,S*0.025),GREY,1.6);}
// a crystal seen side on, as a six-sided shape of half-size s
function xtal(c,x,y,s,fill=GRN,lw=2){poly(c,[[x-s,y-s*0.45],[x-s*0.35,y-s],[x+s*0.8,y-s*0.8],[x+s,y+s*0.3],[x+s*0.3,y+s],[x-s*0.85,y+s*0.7]],fill,lw);}
const mix=(a,b,u)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),A=p(a),B=p(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*u)).join(',')+')';};
// numbers in plain words
const big=n=>n<1e3?String(Math.round(n)):n<1e6?(Math.round(n/Math.pow(10,Math.floor(Math.log10(n))-1))*Math.pow(10,Math.floor(Math.log10(n))-1)).toLocaleString('en-US'):n<1e9?(n/1e6).toFixed(n<1e7?1:0)+' million':n<1e12?(n/1e9).toFixed(n<1e10?1:0)+' billion':(n/1e12).toFixed(n<1e13?1:0)+' trillion';
// the crystal, the cone of rays that the detector catches, and the detector, seen from the side. D is the distance in mm (150 to 1200)
const DET_HALF=155.55, LAMBDA=0.9792;   // half the width of the detector face in mm (EIGER2 X 16M), and the wavelength at 12.662 keV in ångströms
const resAt=D=>LAMBDA/(2*Math.sin(0.5*Math.atan(DET_HALF/D)));
// Adapted from the diffraction figure of How NE-CAT works: the rays that leave the crystal fan out, each carrying detail of one size
// (the wider the angle, the finer the detail). The fan is fixed. The detector catches the part of it that lands on its window:
// the darker wedge and the solid rays. Returns where things are, so that the detector can be dragged (see geoDrag)
function geoDraw(c,w,h,D,fs,narrow,drag){const sc=(w*(narrow?0.62:0.6))/1200,x0=w*(narrow?0.1:0.08),y=h*(narrow?0.44:0.47),xd=x0+D*sc,hb=DET_HALF*sc,top=narrow?30:34,bot=2*y-top,xr=w-4;
  const list=narrow?[8,5,3,2,1.5,1.2]:[12,8,6,4,3,2.5,2,1.6,1.3,1.1],ang=d=>2*Math.asin(LAMBDA/(2*d)),amax=ang(list[list.length-1]);
  const end=(a,sg)=>{const x=Math.min(xr,x0+(y-top)/Math.tan(a));return [x,y-sg*(x-x0)*Math.tan(a)];};
  // the whole fan, pale, and the part the detector catches, darker
  const eu=end(amax,1),ed=end(amax,-1),fan=[[x0,y],eu];if(eu[0]<xr){fan.push([xr,top]);fan.push([xr,bot]);}fan.push(ed);
  c.beginPath();fan.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle='#fff6d9';c.fill();
  const tc=Math.min(Math.atan(DET_HALF/D),amax),yc=(xd-x0)*Math.tan(tc);
  c.beginPath();c.moveTo(x0,y);c.lineTo(xd,y-yc);c.lineTo(xd,y+yc);c.closePath();c.fillStyle=LTORG;c.fill();
  list.forEach(d=>{const a=ang(d),hit=(xd-x0)*Math.tan(a),rec=hit<=hb;[1,-1].forEach(sg=>{const e=end(a,sg);
    line(c,x0,y,e[0],e[1],1.2,'rgba(238,138,43,.75)',[4,5]);if(rec)line(c,x0,y,xd,y-sg*hit,2,ORG);
    if(sg>0){if(e[0]<xr)txt(c,d+' Å',e[0],top-11,fs,'center',rec?'#b85f10':'#52606b');else txt(c,d+' Å',xr-2,e[1]-10,fs,'right',rec?'#b85f10':'#52606b');}});});
  arrow(c,0,y,x0-12,y,ORG,3,9);line(c,x0,y,xd,y,1.4,'rgba(238,138,43,.7)');
  detSide(c,xd,y,sc,drag);
  list.forEach(d=>{const hit=(xd-x0)*Math.tan(ang(d));if(hit<=hb)[1,-1].forEach(sg=>disc(c,xd,y-sg*hit,2.6,ORG,1));});
  disc(c,x0,y,narrow?5:7,GRN,2);
  const yt=h-(narrow?24:28);[150,400,800,1200].forEach(d=>{const x=x0+d*sc;line(c,x,yt-3,x,yt+3,2);txt(c,d===1200?'1.2 m':d+' mm',x,yt+(narrow?12:14),fs,'center','#52606b');});
  line(c,x0,yt,x0+1200*sc,yt,1.6,'#52606b');
  cap(c,'crystal',x0,y+(narrow?22:28),'center',fs);
  tag(c,narrow?'detector: drag it':'detector: drag it left or right',Math.min(w-6,xd+DETG.hd*sc),Math.min(yt-(narrow?14:16),y+DETG.hh*sc/2+(narrow?26:30)),'right',fs);
  if(!narrow)txt(c,'numbers: the detail each ray carries',xr-2,yt+14,fs,'right','#52606b');
  return {x0,sc,xd,y,hh:DETG.hh*sc/2,hd:DETG.hd*sc};}
// lets the detector in a geoDraw figure be dragged along the beam. geo() gives the figure's last geometry, and id is the distance slider
function geoDrag(cvId,id,geo,setDrag){const cv=$(cvId),sl=$(id),pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};let on=false;
  const near=e=>{const g=geo();if(!g)return false;const [x,y]=pos(e);return x>g.xd-18&&x<g.xd+g.hd+10&&Math.abs(y-g.y)<g.hh+12;};
  const set=e=>{const g=geo(),[x]=pos(e),st=+sl.step||5;sl.value=Math.max(+sl.min,Math.min(+sl.max,Math.round((x-g.grab-g.x0)/g.sc/st)*st));sl.dispatchEvent(new Event('input'));};
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{if(!near(e))return;const g=geo();g.grab=pos(e)[0]-g.xd;on=true;setDrag(true);cv.setPointerCapture(e.pointerId);e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(on){const g=geo();const gr=g.grab;set(e);geo().grab=gr;}else cv.style.cursor=near(e)?'ew-resize':'';});
  const stop=()=>{if(on){on=false;setDrag(false);}};cv.addEventListener('pointerup',stop);cv.addEventListener('pointercancel',stop);}
// ---------- the detector on 24-ID-C, an EIGER2 XE 16M, as a cartoon (sizes in millimeters, from the manufacturer's specification) ----------
// Its sensitive area holds 32 sensor modules, 4 across and 8 down. The gaps between them (12 pixels between columns, 38 between rows)
// count nothing. The housing is 400 wide, 430 high and 500 deep: black, with a blue frame around a white window that fills most of the
// front, as in the manufacturer's picture of it. The width of the frame is judged from that picture.
const DETG={fw:311.1,fh:327.2,hw:400,hh:430,hd:500,mw:77.1,mh:38.4,gx:0.9,gy:2.85,body:'#2c2f35',frame:'#3f63ad',gap:'#c3ccd4',rim:0.04};
// face on, with its middle at (cx, cy) and z pixels to the millimeter. Returns the box of the sensitive area, for the spots
function detFace(c,cx,cy,z,housing=true){const G=DETG,W=G.fw*z,H=G.fh*z,x=cx-W/2,y=cy-H/2;
  if(housing){const hw=G.hw*z,hh=G.hh*z,r=Math.min(16,hw*0.05),m=hw*G.rim;
    c.beginPath();c.roundRect(cx-hw/2,cy-hh/2,hw,hh,r);c.fillStyle=G.frame;c.fill();pen(c,Math.min(3,Math.max(1.6,z*3)));c.stroke();
    c.beginPath();c.roundRect(cx-hw/2+m,cy-hh/2+m,hw-2*m,hh-2*m,Math.max(1,r-m));c.fillStyle=WHITE;c.fill();pen(c,1.2);c.stroke();}
  else rectF(c,x,y,W,H,WHITE,2);
  // the sensitive area, and the gaps between its modules
  c.fillStyle=G.gap;for(let i=1;i<4;i++)c.fillRect(x+(i*G.mw+(i-1)*G.gx)*z,y,Math.max(1,G.gx*z),H);
  for(let j=1;j<8;j++)c.fillRect(x,y+(j*G.mh+(j-1)*G.gy)*z,W,Math.max(1.2,G.gy*z));
  pen(c,1.2,'#9aa7b3');c.strokeRect(x,y,W,H);
  return {x,y,w:W,h:H};}
// from the side, with the middle of its window at (xf, cy): the window faces left and the black housing runs back to the right
function detSide(c,xf,cy,z,lit){const G=DETG,hh=G.hh*z,hd=G.hd*z,r=Math.min(10,hh*0.06),fb=Math.max(4,hd*0.06);
  rectF(c,xf+hd*0.12,cy+hh/2,hd*0.76,Math.max(5,hh*0.07),'#5d6a73',2);                       // the base it stands on
  pen(c,Math.max(2.5,hh*0.035),'#3f6ea8');c.beginPath();c.moveTo(xf+hd,cy-hh*0.2);c.bezierCurveTo(xf+hd*1.18,cy-hh*0.2,xf+hd*1.16,cy+hh*0.5,xf+hd*1.3,cy+hh*0.62);c.stroke();   // a cooling hose at the back
  c.beginPath();c.roundRect(xf,cy-hh/2,hd,hh,r);c.fillStyle=lit?'#3d424b':G.body;c.fill();pen(c,2.4);c.stroke();
  c.save();c.beginPath();c.roundRect(xf,cy-hh/2,hd,hh,r);c.clip();c.fillStyle=G.frame;c.fillRect(xf,cy-hh/2,fb,hh);c.restore();     // the blue frame at the front
  line(c,xf+fb+3,cy-hh/2+Math.max(3,hh*0.04),xf+hd-r,cy-hh/2+Math.max(3,hh*0.04),1.4,'rgba(255,255,255,.28)');
  c.beginPath();c.roundRect(xf,cy-hh/2,hd,hh,r);pen(c,2.4);c.stroke();
  // the maker's name and the model, where they are on the real housing, in plain lettering (not the maker's own lettering)
  if(hh>70){const fz=hh*0.085,tx=xf+hd*0.12,ty=cy+hh*0.12;c.fillStyle='rgba(255,255,255,.5)';c.textAlign='left';c.textBaseline='middle';
    c.font=`600 ${fz.toFixed(1)}px system-ui,-apple-system,"Segoe UI",Arial,sans-serif`;c.fillText('DECTRIS',tx,ty);c.fillText('EIGER2 XE',tx,ty+fz*1.15);
    c.font=`700 ${(fz*1.7).toFixed(1)}px system-ui,-apple-system,"Segoe UI",Arial,sans-serif`;c.fillText('16M',tx,ty+fz*2.75);}
  rectF(c,xf-Math.max(2,hd*0.012),cy-hh*(0.5-G.rim),Math.max(4,hd*0.024),hh*(1-2*G.rim),WHITE,1.6);}                    // the window, edge on
// a row of buttons that choose between a few states (made by _choice in walk_guide.py). cb gets the chosen value, at once and on each click
function choice(id,cb){const bs=[...$(id).querySelectorAll('button')];const set=v=>{bs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));cb(v);};
  bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.v)));set((bs.find(b=>b.getAttribute('aria-pressed')==='true')||bs[0]).dataset.v);}
// the end of every guide's script that has equation cards: read-out labels in capitals, and the button that opens every equation
function capK(){document.querySelectorAll('.ro .k').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))n.nodeValue=n.nodeValue.replace(/[a-z]/g,ch=>ch.toUpperCase());});}
function eqButton(){const eqBtn=$('eqAll');if(!eqBtn)return;let eqOpen=false;
  const setEq=o=>{eqOpen=o;document.querySelectorAll('details.eqcard').forEach(d=>d.open=o);eqBtn.textContent=o?'Close all equations':'Open all equations';eqBtn.setAttribute('aria-pressed',String(o));try{localStorage.setItem('necat-guide-eq',o?'1':'0');}catch(e){}};
  eqBtn.addEventListener('click',()=>setEq(!eqOpen));try{if(localStorage.getItem('necat-guide-eq')==='1')setEq(true);}catch(e){}}
