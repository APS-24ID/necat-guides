// ---------- the guide "How does a crystal get to the beam?" (Introductory level) ----------
// Four stops, one figure and one control at each. The script is the drawing kit, introkit.js and this file.
const RMUT='#52606b',RXT='#cfe6c9',rsm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// a sample pin seen from the side: base, pin and loop, with the loop at (x, y) and the pin running away at angle a
function rpin(c,x,y,L,a,cold=true){const ux=Math.cos(a),uy=Math.sin(a),lr=Math.max(4,L*0.09);line(c,x+ux*lr,y+uy*lr,x+ux*L,y+uy*L,Math.max(2,L*0.035),'#6b7780');
  c.save();c.translate(x+ux*L,y+uy*L);c.rotate(a);rectF(c,0,-L*0.11,L*0.3,L*0.22,'#b08d57',1.6);c.restore();pen(c,Math.max(1.6,lr*0.3),'#3b4046');c.beginPath();c.ellipse(x,y,lr,lr*0.7,a,0,7);c.stroke();
  c.beginPath();c.arc(x,y,lr*0.42,0,7);c.fillStyle=RXT;c.fill();pen(c,1);c.stroke();}
// the places for 30 pucks in the robot's dewar, in three rings
const PK=(()=>{const P=[];[[0.3,5,0.3],[0.6,10,0],[0.9,15,0.1]].forEach(([r,n,o])=>{for(let i=0;i<n;i++){const a=o+i*2*Math.PI/n;P.push([r*Math.cos(a),r*Math.sin(a)]);}});return P;})();
function puck(c,x,y,r,full,hot){disc(c,x,y,r,full?'#b9c2c9':'#e9eef2',hot?2.6:1.4);if(!full||r<7)return;for(let i=0;i<5;i++){const a=i*1.2566-1.57;disc(c,x+0.42*r*Math.cos(a),y+0.42*r*Math.sin(a),r*0.09,'#3b4046',0);}for(let i=0;i<11;i++){const a=i*0.5712-1.57;disc(c,x+0.78*r*Math.cos(a),y+0.78*r*Math.sin(a),r*0.09,'#3b4046',0);}}
// The robot, its dewar and the goniometer (rstate, rscene and what they need) are in introkit.js, because the index page draws them too.
// the scene with a magnifier that follows the open end of the cylinder, cut open, and moves to the crystal once it is in the beam
function robot(c,w,h,st,narrow,fs,t){const S=Math.min(w*0.94/1500,h*0.84/930),V={ox:narrow?w*0.5:w*0.59,oy:h*0.88,S},R=rscene(c,V,st,t,{labels:!narrow,fs});
  const mr=h*(narrow?0.17:0.23),mx=narrow?w-mr-8:mr+16,my=narrow?mr+8:h*0.42,Z=5,qx=R.tx+(R.gx-R.tx)*st.foc,qy=R.ty+(R.gy-R.ty)*st.foc;
  c.save();c.beginPath();c.arc(mx,my,mr,0,7);c.clip();c.fillStyle=SKY;c.fillRect(mx-mr,my-mr,2*mr,2*mr);rscene(c,{ox:mx-(qx-V.ox)*Z,oy:my+mr*0.45-(qy-V.oy)*Z,S:S*Z},st,t,{labels:false,cut:true});c.restore();
  pen(c,3);c.beginPath();c.arc(mx,my,mr,0,7);c.stroke();const dd=Math.hypot(qx-mx,qy-my);if(dd>mr)line(c,qx,qy,mx+(qx-mx)/dd*mr,my+(qy-my)/dd*mr,1.4,INK,[4,4]);}

// ---------- opening figure: the robot fetches a crystal, holds it in the beam and takes it back ----------
if($('rideHeroCv')){
fig('rideHeroCv',w=>w<560?1.1:2.0,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,st=rstate(t);
  robot(c,w,h,st,narrow,fs,t);cap(c,st.ph,narrow?8:12,narrow?15:19,'left',fs);
});}

// ---------- stop 1: pucks into the robot's dewar ----------
if($('rLoadCv')){
let NP=12;
const F=fig('rLoadCv',w=>w<560?1.0:2.4,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,R=Math.min(w*(narrow?0.4:0.2),h*0.4),cx=narrow?w/2:w*0.3,cy=narrow?h*0.42:h*0.52;
  disc(c,cx,cy,R*1.12,'#9aa7b3',2.4);disc(c,cx,cy,R*1.04,'#d6e9f7',1.4);PK.forEach((p,i)=>puck(c,cx+p[0]*R,cy+p[1]*R,R*(i<5?0.105:0.09),i<NP,false));
  txt(c,narrow?'the robot\'s dewar, from above':'the robot\'s dewar, from above: 30 places for pucks',cx,cy+R*1.12+(narrow?13:16),fs-1,'center',RMUT);
  // one puck, enlarged
  if(!narrow){const bx=w*0.74,by=h*0.5,br=h*0.3;puck(c,bx,by,br,true,false);txt(c,'one puck: 16 crystals',bx,by+br+16,fs-1,'center',RMUT);}
  cap(c,NP+(NP===1?' puck: ':' pucks: ')+(NP*16)+' crystals',narrow?8:12,narrow?15:19,'left',fs);
},false);
bind('rN',v=>v.toFixed(0)+(v===1?' puck':' pucks'),()=>{NP=+$('rN').value;setT('rNc',(NP*16)+' crystals');setT('rNs',NP===30?'full':NP===0?'empty':(30-NP)+' places free');F.w&&F.draw(F);});
}

// ---------- stop 2: from the dewar to the beam and back ----------
if($('rArmCv')){
let TO=0,T0=-99,TN=0;
// In the beam: the cycle runs from 0 to 14 s (the pin on the goniometer, the cylinder back in the liquid nitrogen). In the dewar: it runs from 16.8 s to the end.
const F=fig('rArmCv',w=>w<560?1.1:2.0,f=>{const {ctx:c,w,h,t}=f;TN=t;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,el=(t-T0)*1.3,u=!playing||T0<-50?(TO?14:0):TO?Math.min(14,el):Math.min(30.99,16.8+el),st=rstate(u);
  robot(c,w,h,st,narrow,fs,t);cap(c,u<0.01||u>30.9?'in the dewar, under liquid nitrogen':st.ph,narrow?8:12,narrow?15:19,'left',fs);});
choice('rA',x=>{if(+x!==TO){TO=+x;T0=TN;}setT('rAw',TO?'on the goniometer, in the stream of cold gas':'in its puck, under liquid nitrogen');setT('rAt',TO?'173 degrees below zero':'196 degrees below zero');F.w&&F.draw(F);});
}

// ---------- stop 3: finding the crystal ----------
if($('rFindCv')){
let MODE=0,FROM=[0.27,-0.16],CUR=[0.27,-0.16],T0=-9,TN=0;
// where the crystal is in the loop, and the grid of the X-ray scan: how strongly each square diffracts
const XO=[-0.06375,0.10625],NX=10,NY=14,GS=0.0425,HOT=(i,j)=>{const x=(i-(NX-1)/2)*GS,y=(j-(NY-1)/2)*GS;return Math.exp(-((x-XO[0])**2+(y-XO[1])**2)/(2*0.075*0.075));};
const TGT=[[0.27,-0.16],[0,0],[-XO[0],-XO[1]]];
const F=fig('rFindCv',w=>w<560?1.0:2.4,f=>{const {ctx:c,w,h,t}=f;TN=t;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,S=Math.min(w*(narrow?0.84:0.42),h*0.78),cx=narrow?w/2:w*0.34,cy=h*(narrow?0.5:0.54),e=playing?rsm((t-T0)/1.6):1;
  CUR=[FROM[0]+(TGT[MODE][0]-FROM[0])*e,FROM[1]+(TGT[MODE][1]-FROM[1])*e];
  rectF(c,cx-S/2,cy-S/2,S,S,'#10161c',2.4);c.save();c.beginPath();c.rect(cx-S/2,cy-S/2,S,S);c.clip();
  const lx=cx+CUR[0]*S,ly=cy+CUR[1]*S,lr=S*0.26;
  // the pin comes up from below, as on 24-ID-C, with the loop at its top
  line(c,lx,ly+lr,lx,cy+S,S*0.03,'#8d979e');c.beginPath();c.ellipse(lx,ly,lr*0.68,lr,0,0,7);c.fillStyle='rgba(120,160,190,.28)';c.fill();pen(c,S*0.022,'#c9d3da');c.stroke();
  // the crystal: faint, because a small clear crystal in frozen liquid is hard to see
  c.save();c.globalAlpha=0.45;xtalR(c,lx+XO[0]*S,ly+XO[1]*S,S*0.06,0.5);c.restore();
  if(MODE===2){const a=playing?rsm((t-T0)/1.2):1;for(let i=0;i<NX;i++)for(let j=0;j<NY;j++){const x=lx+(i-(NX-1)/2)*GS*S,y=ly+(j-(NY-1)/2)*GS*S,v=HOT(i,j);c.fillStyle='rgba(246,197,46,'+(0.85*v*a).toFixed(2)+')';c.fillRect(x-GS*S/2,y-GS*S/2,GS*S,GS*S);pen(c,0.6,'rgba(255,255,255,'+(0.3*a).toFixed(2)+')');c.strokeRect(x-GS*S/2,y-GS*S/2,GS*S,GS*S);}}
  c.restore();
  // the cross that marks where the X-ray beam passes
  line(c,cx-S*0.09,cy,cx+S*0.09,cy,1.6,RED);line(c,cx,cy-S*0.09,cx,cy+S*0.09,1.6,RED);pen(c,1.6,RED);c.beginPath();c.arc(cx,cy,S*0.03,0,7);c.stroke();
  txt(c,narrow?'the camera view':'the view from the beamline camera',cx,cy-S/2-(narrow?11:13),fs-1,'center',RMUT);
  if(!narrow){const x=w*0.62;[['red cross','where the X-ray beam passes'],['pale ring','the loop, on its pin'],['yellow squares','places where X-rays found crystal']].forEach(([a,b],i)=>{txt(c,a+':',x,h*0.3+i*(2*fs+16),fs,'left');txt(c,b,x,h*0.3+i*(2*fs+16)+fs+3,fs-1,'left',RMUT);});}
});
function xtalR(c,x,y,r,a){const P=[[-1,-0.31],[-0.55,-0.62],[0.7,-0.62],[1,-0.25],[0.6,0.62],[-0.7,0.62]].map(([u,v])=>[x+(u*Math.cos(a)-v*Math.sin(a))*r,y+(u*Math.sin(a)+v*Math.cos(a))*r]);poly(c,P,RXT,1.2);}
const SAY=[['off to one side','not yet'],['centered on the cross','only if it sits in the middle of the loop'],['scanned: 63 squares, each tested with a flash of X-rays','yes: the brightest square is moved onto the cross']];
choice('rF',x=>{FROM=CUR.slice();MODE=+x;T0=TN;setT('rFl',SAY[MODE][0]);setT('rFx',SAY[MODE][1]);F.w&&F.draw(F);});
}

// ---------- stop 4: run from anywhere ----------
if($('rFarCv')){
let DIR=2;
const F=fig('rFarCv',w=>w<560?1.0:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,y=h*0.5,N=[[w*0.12,'the scientist','anywhere with a connection'],[w*0.54,'NE-CAT\'s computers','at the beamline'],[w*0.88,'the beamline','robot, goniometer, detector']],s=narrow?w*0.11:h*0.17,lane=narrow?7:9;
  // from outside: one encrypted connection, opened once and kept open, with messages passing both ways along it. Inside the beamline: its own network
  const x0=N[0][0]+s,x1=N[1][0]-s,pw=lane*4;c.beginPath();c.roundRect(x0-4,y-pw/2,x1-x0+8,pw,pw/2);c.fillStyle='#eef5e6';c.fill();pen(c,2.2,GDK);c.stroke();line(c,x0,y,x1,y,1,'rgba(47,122,69,.35)',[4,4]);
  line(c,N[1][0]+s,y,N[2][0]-s,y,3,'#9aa7b3');
  const out=DIR!==1,back=DIR!==0;
  for(let i=0;i<5;i++){const u=(t*0.3+i/5)%1;if(out){const x=N[0][0]+(N[2][0]-N[0][0])*u;disc(c,x,y-(x<x1+s?lane:0)*(DIR===2||x<x1+s?1:1),narrow?4.5:6,ORG,1.4);}if(back){const x=N[2][0]+(N[0][0]-N[2][0])*((u+0.1)%1);disc(c,x,y+(x<x1+s?lane:0),narrow?4.5:6,YEL,1.4);}}
  // a padlock on the connection
  const lx=(x0+x1)/2,ly=y-pw/2-(narrow?13:16),lw=narrow?14:18;pen(c,2.4,GDK);c.beginPath();c.arc(lx,ly-lw*0.25,lw*0.3,Math.PI,0);c.stroke();rectF(c,lx-lw/2,ly-lw*0.25,lw,lw*0.72,'#cfe6c9',2);
  if(!narrow){txt(c,'encrypted: https',lx,ly-lw-6,fs-1,'center',GDK);txt(c,'one connection, kept open,',lx,y+pw/2+fs+2,fs-1,'center',GDK);txt(c,'both ways at once: a WebSocket',lx,y+pw/2+2*fs+6,fs-1,'center',GDK);}else txt(c,'https, kept open',lx,y+pw/2+fs,fs-1,'center',GDK);
  N.forEach(([x,a,b],i)=>{c.beginPath();c.roundRect(x-s,y-s*0.75,2*s,s*1.5,8);c.fillStyle=i===1?'#dfe7ee':WHITE;c.fill();pen(c,2.2);c.stroke();
    if(i===0){rectF(c,x-s*0.5,y-s*0.42,s,s*0.62,'#cfe0f0',1.6);line(c,x-s*0.7,y+s*0.34,x+s*0.7,y+s*0.34,3);}
    if(i===1){[-0.3,0,0.3].forEach(k=>rectF(c,x-s*0.55,y+k*s-s*0.1,s*1.1,s*0.2,'#b9c2c9',1.2));}
    if(i===2){disc(c,x-s*0.35,y,s*0.3,'#aeb8c0',1.6);disc(c,x-s*0.35,y,s*0.17,'#5aa0d8',1.2);rectF(c,x+s*0.1,y-s*0.4,s*0.5,s*0.8,'#2c2f35',1.4);}
    txt(c,a,x,y+s*0.75+(narrow?26:34),fs,'center');if(!narrow)txt(c,b,x,y+s*0.75+34+fs+3,fs-1,'center',RMUT);});
  cap(c,DIR===2?(narrow?'both ways, all the time':'both ways at once, for as long as the experiment lasts'):DIR?(narrow?'pictures and data come back':'coming back: camera pictures, images from the detector, results'):(narrow?'commands go out':'going out: mount this crystal, center it, collect'),narrow?8:12,narrow?15:19,'left',fs);
});
choice('rR',x=>{DIR=+x;setT('rRw',DIR===2?'commands one way, pictures and results the other, at the same moment':DIR?'camera pictures, detector images, the first results':'commands: which crystal, where to center, how to collect');setT('rRc','encrypted (https), opened once and kept open (a WebSocket)');F.w&&F.draw(F);});
}
capK();
})();
