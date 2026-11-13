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
function geoDraw(c,w,h,D,fs,narrow){const sc=(w*0.74)/1200,x0=w*0.1,y=h*0.5,xd=x0+D*sc,hb=DET_HALF*sc;
  arrow(c,0,y,x0-12,y,ORG,3,9);
  c.fillStyle='rgba(238,138,43,.22)';c.beginPath();c.moveTo(x0,y);c.lineTo(xd,y-hb);c.lineTo(xd,y+hb);c.closePath();c.fill();
  line(c,x0,y,xd,y-hb,1.6,ORG);line(c,x0,y,xd,y+hb,1.6,ORG);line(c,x0,y,xd-10,y,1.6,'rgba(238,138,43,.7)');rectF(c,xd-12,y-4,5,8,INK,1);
  rectF(c,xd,y-hb,Math.max(8,w*0.014),2*hb,WHITE,2.4);disc(c,x0,y,narrow?5:7,GRN,2);
  [150,400,800,1200].forEach(d=>{const x=x0+d*sc;line(c,x,h-(narrow?26:30),x,h-(narrow?20:24),2);txt(c,d===1200?'1.2 m':d+' mm',x,h-(narrow?11:13),fs,'center','#52606b');});
  line(c,x0,h-(narrow?23:27),x0+1200*sc,h-(narrow?23:27),1.6,'#52606b');
  cap(c,'crystal',x0,y-(narrow?20:26),'center',fs);cap(c,'detector',Math.min(w-6,xd+Math.max(8,w*0.014)+6),Math.max(13,y-hb-(narrow?14:18)),xd>w*0.6?'right':'left',fs);}
// a row of buttons that choose between a few states (made by _choice in walk_guide.py). cb gets the chosen value, at once and on each click
function choice(id,cb){const bs=[...$(id).querySelectorAll('button')];const set=v=>{bs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));cb(v);};
  bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.v)));set((bs.find(b=>b.getAttribute('aria-pressed')==='true')||bs[0]).dataset.v);}
// the end of every guide's script that has equation cards: read-out labels in capitals, and the button that opens every equation
function capK(){document.querySelectorAll('.ro .k').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))n.nodeValue=n.nodeValue.replace(/[a-z]/g,ch=>ch.toUpperCase());});}
function eqButton(){const eqBtn=$('eqAll');if(!eqBtn)return;let eqOpen=false;
  const setEq=o=>{eqOpen=o;document.querySelectorAll('details.eqcard').forEach(d=>d.open=o);eqBtn.textContent=o?'Close all equations':'Open all equations';eqBtn.setAttribute('aria-pressed',String(o));try{localStorage.setItem('necat-guide-eq',o?'1':'0');}catch(e){}};
  eqBtn.addEventListener('click',()=>setEq(!eqOpen));try{if(localStorage.getItem('necat-guide-eq')==='1')setEq(true);}catch(e){}}
