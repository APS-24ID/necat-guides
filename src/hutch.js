// ---------- the guide "Why is the experiment in a shielded room?" (Introductory level) ----------
// The script is the drawing kit, introkit.js and this file.
function person(c,x,y,s=1,col=BLUE){disc(c,x,y-13*s,5.5*s,LTYEL,1.8);poly(c,[[x-6*s,y-6*s],[x+6*s,y-6*s],[x+5*s,y+12*s],[x-5*s,y+12*s]],col,1.8);}
// the room from above. state 0: door open, shutter closed. 1: searched and locked, shutter still closed. 2: shutter open, beam on
function room(c,x,y,W,H,state,t,fs,labels){const wt=Math.max(6,W*0.022),by=y+H*0.42,dx=x+W*0.66,dw=W*0.16,sx=x-W*0.1;
  rectF(c,x,y,W,H,'#f7f3e6',2);
  // walls
  c.fillStyle=STEEL;[[x,y,W,wt],[x,y,wt,H],[x+W-wt,y,wt,H],[x,y+H-wt,W,wt]].forEach(r=>c.fillRect(...r));pen(c,2);c.strokeRect(x,y,W,H);c.strokeRect(x+wt,y+wt,W-2*wt,H-2*wt);
  // the door, in the bottom wall
  c.fillStyle=SKY;c.fillRect(dx,y+H-wt-1,dw,wt+2);
  if(state===0){line(c,dx,y+H-wt/2,dx+dw*0.75,y+H+dw*0.62,5,STEEL);line(c,dx,y+H-wt/2,dx+dw*0.75,y+H+dw*0.62,1.5);}else{c.fillStyle=state===2?RED:STEEL;c.fillRect(dx,y+H-wt,dw,wt);pen(c,2);c.strokeRect(dx,y+H-wt,dw,wt);}
  // the pipe that brings the beam, and the shutter in it
  c.fillStyle=SKY;c.fillRect(x-1,by-5,wt+2,10);rectF(c,sx-W*0.14,by-5,W*0.14+W*0.1,10,WHITE,2);
  if(state===2){line(c,sx-W*0.14,by,x+W*0.4,by,3,ORG);rectF(c,sx-8,by-26,16,16,GREY,2);}else{line(c,sx-W*0.14,by,sx-8,by,3,ORG);rectF(c,sx-8,by-9,16,18,RED,2);}
  // the experiment: sample, beamstop, detector
  const px=x+W*0.4;
  if(state===2){[-1.9,-1.2,-0.6,0.5,1.1,1.8,2.6,-2.7].forEach((a,i)=>{const L=W*(0.16+0.05*Math.sin(t*3+i*1.7));line(c,px,by,px+L*Math.cos(a),by+L*Math.sin(a),1.3,'rgba(238,138,43,.55)');});line(c,px,by,px+W*0.08,by,2.4,ORG);}
  rectF(c,px+W*0.08,by-5,5,10,INK,1);rectF(c,x+W*0.72,by-H*0.2,W*0.03,H*0.4,WHITE,2);disc(c,px,by,Math.max(4,W*0.012),GRN,1.8);
  // the lamp over the door
  const on=state===2&&Math.sin(t*6)>-0.3;disc(c,dx+dw/2,y+H+ (state===0?-wt-12:14),7,on?RED:state===2?'#f4c9c2':WHITE,2);
  // people: inside while the door is open, outside otherwise
  if(state===0)person(c,x+W*0.56,y+H*0.72,Math.max(0.8,W/420));person(c,x+W*0.9,y+H+ (labels?34:26),Math.max(0.8,W/420),state===0?GREY:BLUE);
  if(labels){tag(c,state===2?'shutter open':'shutter closed',sx,by-(state===2?40:24),'center',fs);tag(c,state===0?'door open':state===1?'door locked':'door locked, lamp on',dx+dw+10,y+H+16,'left',fs);
    if(state===2)tag(c,'stray X-rays stop at the walls',x+W*0.5,y+H*0.16,'center',fs);}
}

// ---------- opening figure ----------
if($('hutchHeroCv')){
fig('hutchHeroCv',w=>w<560?1.15:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const W=narrow?w*0.66:w*0.5,H=narrow?h*0.56:h*0.62,st=Math.floor((t/3.2)%3);
  room(c,narrow?w*0.26:w*0.3,h*0.1,W,H,st,t,fs,false);
  cap(c,['door open: no beam','room searched and locked','beam on'][st],w*0.03,narrow?14:20,'left',fs);
});
}

// ---------- stop 1: stray X-rays thin out with distance ----------
if($('hScatCv')){
let R=1;
const F=fig('hScatCv',w=>w<560?1.1:2.6,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const sx=w*0.12,sy=h*0.5,sc=(w*0.82)/3,x=sx+R*sc;   // 3 meters across the picture
  arrow(c,0,sy,sx-10,sy,ORG,3,9);
  for(let i=0;i<28;i++){const a=-1.45+i/27*2.9,L=w*0.9;const g=c.createLinearGradient(sx,sy,sx+L*Math.cos(a),sy+L*Math.sin(a));g.addColorStop(0,'rgba(238,138,43,.9)');g.addColorStop(1,'rgba(238,138,43,0)');pen(c,1.6,g);c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+L*Math.cos(a),sy+L*Math.sin(a));c.stroke();}
  [0.5,1,1.5,2,2.5,3].forEach(d=>{pen(c,1.2,'rgba(27,27,27,.3)');c.setLineDash([4,5]);c.beginPath();c.arc(sx,sy,d*sc,-1.5,1.5);c.stroke();c.setLineDash([]);if(d%1===0)txt(c,d+' m',sx+d*sc,h-(narrow?10:12),fs,'center','#52606b');});
  disc(c,sx,sy,6,GRN,2);cap(c,'sample',sx,sy-(narrow?22:28),'center',fs);
  // a square of fixed size at the chosen distance: fewer rays cross it the farther away it is
  const q=narrow?26:40;rectF(c,x-3,sy-q/2,6,q,WHITE,2);tag(c,'the same area, farther out',Math.min(w-6,x+10),sy-q/2-(narrow?14:18),x>w*0.6?'right':'left',fs);
},false);
bind('hD',v=>v<1?Math.round(v*100)+' cm':v.toFixed(1)+' m',()=>{R=+$('hD').value;const k=(R/0.1)*(R/0.1);setT('hRel',k<1.05?'the same':big(k)+' times weaker');F.w&&F.draw(F);});
}

// ---------- stop 2: how much steel it takes ----------
if($('hWallCv')){
let TK=0;const LEN=14.03,r=rng(8),RAYS=[];for(let i=0;i<40;i++)RAYS.push(-Math.log(1-r()*0.999999));   // depth at which each ray stops, in absorption lengths
const F=fig('hWallCv',w=>w<560?1.2:2.8,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const sc=(w*0.5)/300,x0=w*0.2,xw=x0+TK*sc,y0=h*0.16,y1=h*0.84;   // 300 microns of steel span half the picture
  if(TK>0)rectF(c,x0,y0,Math.max(2,TK*sc),y1-y0,STEEL,2);
  RAYS.forEach((d,i)=>{const y=y0+(i+0.5)/40*(y1-y0),stop=d*LEN;if(stop<TK){line(c,w*0.02,y,x0+stop*sc,y,1.5,ORG);c.fillStyle=RED;c.beginPath();c.arc(x0+stop*sc,y,2,0,7);c.fill();}else arrow(c,w*0.02,y,w*0.96,y,ORG,1.5,6);});
  cap(c,'x-rays in',w*0.02,narrow?13:17,'left',fs);cap(c,'x-rays through',w*0.98,narrow?13:17,'right',fs);
  if(TK>0)tag(c,'steel',x0+Math.max(2,TK*sc)/2,y1+(narrow?12:14),'center',fs);
  // a hair, for scale
  const hr=35*sc;disc(c,w*0.86,h*0.5,hr,'#c9a27a',2);tag(c,'a hair',w*0.86,h*0.5+hr+(narrow?12:14),'center',fs);
},false);
bind('hT',v=>v.toFixed(0)+' µm',()=>{TK=+$('hT').value;const fr=Math.exp(-TK/LEN);setT('hThru',fr>=0.995?'all of them':fr>=0.01?(100*fr).toFixed(fr<0.1?1:0)+'%':'1 in '+big(1/fr));setT('hHair',TK<1?'no steel':(TK/70).toFixed(TK<70?2:1)+' of a hair');F.w&&F.draw(F);});
}

// ---------- stop 3: the interlock ----------
if($('hLockCv')){
let ST=0;
fig('hLockCv',w=>w<560?1.0:2.3,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  room(c,narrow?w*0.26:w*0.3,h*0.08,narrow?w*0.64:w*0.46,narrow?h*0.6:h*0.66,ST,t,fs,true);
});
choice('hS',v=>{ST=+v;setT('hDoor',ST===0?'open':'closed and locked');setT('hShut',ST===2?'open':'closed');setT('hBeam',ST===2?'yes: nobody is inside':'none');});
}
capK();
})();
