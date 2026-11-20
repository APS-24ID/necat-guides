// ---------- the guide "What is a protein?" (Introductory level) ----------
// The script is the drawing kit, introkit.js, mbdata.js (myoglobin) and this file.
const PN=MB.seq.length,PK=[...MB.seq].map(AAKIND),MUTP='#52606b';
const AANAME={A:'alanine',R:'arginine',N:'asparagine',D:'aspartic acid',C:'cysteine',Q:'glutamine',E:'glutamic acid',G:'glycine',H:'histidine',I:'isoleucine',L:'leucine',K:'lysine',M:'methionine',F:'phenylalanine',P:'proline',S:'serine',T:'threonine',W:'tryptophan',Y:'tyrosine',V:'valine'};
const KINDSAY={oily:'oily: it avoids water',polar:'water-loving',plus:'water-loving, with a positive charge',minus:'water-loving, with a negative charge'};
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// where link i sits when the chain is laid out in rows that run back and forth across a box. The chain is one unbroken line:
// the links are evenly spaced along it, on the straight runs and around the half-circle turns alike
function serpG(B,per){const rows=Math.ceil(PN/per),R=rows>1?B.h/(2*(rows-1)):0,Ls=B.w-2*R,tot=rows*Ls+(rows-1)*Math.PI*R;return {rows,R,Ls,tot,d:tot/(PN-1)};}
function serp(i,B,per){const G=serpG(B,per);let s=i*G.d;for(let r=0;r<G.rows;r++){const y=G.rows>1?B.y+2*G.R*r:B.y+B.h/2,fw=r%2===0;
    if(s<=G.Ls+1e-6||r===G.rows-1){const k=Math.min(s,G.Ls);return [fw?B.x+G.R+k:B.x+B.w-G.R-k,y];}
    s-=G.Ls;const arc=Math.PI*G.R;if(s<arc){const g=s/G.R,cx=fw?B.x+B.w-G.R:B.x+G.R;return [cx+(fw?1:-1)*G.R*Math.sin(g),y+G.R-G.R*Math.cos(g)];}s-=arc;}
  return [B.x,B.y];}
// the heme: its ring and its iron, in the same view as the chain
function hemeAt(c,cx,cy,s,al=1){if(al<=0)return;c.save();c.globalAlpha=al;c.lineCap='round';MB.hemeBonds.forEach(([i,j])=>{const a=MB.heme[i],b=MB.heme[j];line(c,cx+a[0]*s,cy-a[1]*s,cx+b[0]*s,cy-b[1]*s,Math.max(3,0.95*s),RED);});
  const f=MB.heme[MB.heme.length-1];disc(c,cx+f[0]*s,cy-f[1]*s,Math.max(4,1.3*s),ORG,1.6);c.restore();}
// the chain as beads, colored by kind. f: 0 stretched out in the box B, 1 folded about (cx, cy) at s pixels to the ångström. sel: a link to pick out
function beads(c,B,per,f,cx,cy,s,sel=-1){const P=[],dx=serpG(B,per).d,rs=Math.max(2.2,Math.min(dx*0.46,9)),rf=Math.max(2.4,1.75*s);
  for(let i=0;i<PN;i++){const a=serp(i,B,per),q=MB.ca[i],fi=sm(f*1.5-0.5*i/(PN-1));P.push([a[0]+(cx+q[0]*s-a[0])*fi,a[1]+(cy-q[1]*s-a[1])*fi,q[2]*fi,rs+(rf-rs)*fi,i]);}
  pen(c,Math.max(1.2,rs*0.5),'rgba(27,27,27,.55)');c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  P.slice().sort((a,b)=>a[2]-b[2]).forEach(p=>disc(c,p[0],p[1],p[3],AACOL[PK[p[4]]],p[3]>4?1.3:0.8));
  if(sel>=0){const p=P[sel];disc(c,p[0],p[1],p[3]+4,AACOL[PK[sel]],2.6);}
  return P;}
// the key to the four colors
function kindKey(c,x,y,fs,narrow,w){const K=[['oily','oily'],['polar','water-loving'],['plus',narrow?'+ charge':'positive charge'],['minus',narrow?'− charge':'negative charge']];c.font=`${fs}px ${HAND}`;
  let X=x;K.forEach(([k,s2])=>{disc(c,X+6,y,6,AACOL[k],1.3);txt(c,s2,X+17,y,fs,'left');X+=c.measureText(s2).width+(narrow?30:44);});}
const foldBox=(w,h,narrow,top,bot)=>({x:w*(narrow?0.07:0.04),y:top,w:w*(narrow?0.86:0.92),h:h-top-bot});

// ---------- opening figure: the chain folds into myoglobin, and unfolds again ----------
if($('protHeroCv')){
fig('protHeroCv',w=>w<560?0.95:2.9,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,u=t%17;
  const v=u<2?0:u<7?(u-2)/5:u<13?1:u<16?1-(u-13)/3:0,per=narrow?22:51,B=foldBox(w,h,narrow,narrow?52:h*0.3,narrow?26:h*0.24),s=Math.min(w*0.8,h*0.82)/46,cx=w/2,cy=h*0.53;
  beads(c,B,per,v,cx,cy,s);hemeAt(c,cx,cy,s,u>=7&&u<13?Math.min(1,(u-7)/1.2,(13-u)/0.6):0);
  cap(c,u<2?'a protein is a chain: this one has 153 links':u<7?'the chain folds':u<13?(narrow?'folded: myoglobin':'folded, it is myoglobin, and it can hold its heme (red)'):'stretched out again',narrow?8:12,narrow?15:19,'left',fs);
});
}

// ---------- stop 1: a chain of 153 links, of 20 kinds. A link can be clicked, and its atoms are drawn beside the chain ----------
// The atoms of each amino acid as a flat drawing, in units of one bond length, y upward. Hydrogen atoms are left out.
// Every link has the same backbone: N, the central carbon (CA), C and O. The side piece grows upward from CA.
const AAB=[['N',-0.87,-0.5],['C',0,0],['C',0.87,-0.5],['O',0.87,-1.5]];   // atoms 0 to 3
function ringOn(a,b,n,side){let g=Math.atan2(b[1]-a[1],b[0]-a[0]),q=b;const P=[];for(let i=0;i<n-2;i++){g+=side*2*Math.PI/n;q=[q[0]+Math.cos(g),q[1]+Math.sin(g)];P.push(q);}return P;}
const AAS=(()=>{const Z=[[0,1],[0.87,1.5],[0.87,2.5],[1.73,3],[1.73,4]],L=[-0.87,1.5],R2=[1.73,1],T=[0,3],S={};
  const mk=(els,pts,bonds,ch)=>({a:els.map((e,i)=>[e,pts[i][0],pts[i][1]]),b:bonds,ch:ch||null});   // bonds: [i, j, order], with atom 1 the central carbon and side atoms from 4
  S.G=mk([],[],[]);S.A=mk(['C'],[Z[0]],[[1,4,1]]);
  S.V=mk(['C','C','C'],[Z[0],L,Z[1]],[[1,4,1],[4,5,1],[4,6,1]]);
  S.L=mk(['C','C','C','C'],[Z[0],Z[1],Z[2],R2],[[1,4,1],[4,5,1],[5,6,1],[5,7,1]]);
  S.I=mk(['C','C','C','C'],[Z[0],L,Z[1],Z[2]],[[1,4,1],[4,5,1],[4,6,1],[6,7,1]]);
  S.M=mk(['C','C','S','C'],[Z[0],Z[1],Z[2],Z[3]],[[1,4,1],[4,5,1],[5,6,1],[6,7,1]]);
  S.S=mk(['C','O'],[Z[0],Z[1]],[[1,4,1],[4,5,1]]);S.C=mk(['C','S'],[Z[0],Z[1]],[[1,4,1],[4,5,1]]);
  S.T=mk(['C','O','C'],[Z[0],L,Z[1]],[[1,4,1],[4,5,1],[4,6,1]]);
  S.N=mk(['C','C','O','N'],[Z[0],Z[1],Z[2],R2],[[1,4,1],[4,5,1],[5,6,2],[5,7,1]]);
  S.D=mk(['C','C','O','O'],[Z[0],Z[1],Z[2],R2],[[1,4,1],[4,5,1],[5,6,2],[5,7,1]],[7,'−']);
  S.Q=mk(['C','C','C','O','N'],[Z[0],Z[1],Z[2],T,Z[3]],[[1,4,1],[4,5,1],[5,6,1],[6,7,2],[6,8,1]]);
  S.E=mk(['C','C','C','O','O'],[Z[0],Z[1],Z[2],T,Z[3]],[[1,4,1],[4,5,1],[5,6,1],[6,7,2],[6,8,1]],[8,'−']);
  S.K=mk(['C','C','C','C','N'],Z,[[1,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,1]],[8,'+']);
  S.R=mk(['C','C','C','N','C','N','N'],[Z[0],Z[1],Z[2],Z[3],Z[4],[0.87,4.5],[2.6,4.5]],[[1,4,1],[4,5,1],[5,6,1],[6,7,1],[7,8,1],[8,9,1],[8,10,2]],[10,'+']);
  // rings. Six: a hexagon standing on the carbon at (0, 2). Five: a pentagon standing on it
  const HX=[[0,2],[-0.87,2.5],[-0.87,3.5],[0,4],[0.87,3.5],[0.87,2.5]],PT=[[0,2],[0.81,2.59],[0.5,3.54],[-0.5,3.54],[-0.81,2.59]];
  const hexB=[[1,4,1],[4,5,1],[5,6,2],[6,7,1],[7,8,2],[8,9,1],[9,10,2],[10,5,1]];
  S.F=mk(['C','C','C','C','C','C','C'],[Z[0],...HX],hexB);
  S.Y=mk(['C','C','C','C','C','C','C','O'],[Z[0],...HX,[0,5]],hexB.concat([[8,11,1]]));
  S.H=mk(['C','C','C','N','C','N'],[Z[0],...PT],[[1,4,1],[4,5,1],[5,6,2],[6,7,1],[7,8,2],[8,9,1],[9,5,1]]);   // 5 CG, 6 CD2, 7 NE2, 8 CE1, 9 ND1
  const BZ=ringOn(PT[1],PT[2],6,-1);   // the six-ring of tryptophan, joined to the five-ring along one edge
  S.W=mk(['C','C','C','C','N','C','C','C','C','C'],[Z[0],...PT,...BZ],[[1,4,1],[4,5,1],[5,6,1],[6,7,2],[7,8,1],[8,9,1],[9,5,2],[7,10,1],[10,11,2],[11,12,1],[12,13,2],[13,6,1]]);
  const PR=ringOn([AAB[0][1],AAB[0][2]],[0,0],5,1);   // proline: its side piece comes back to the nitrogen of the backbone
  S.P=mk(['C','C','C'],PR,[[1,4,1],[4,5,1],[5,6,1],[6,0,1]]);
  return S;})();
const ELC={C:'#6b7780',N:BLUE,O:RED,S:YEL};
// one amino acid, as it sits in a chain, inside the box (x, y, bw, bh)
function drawAA(c,L,x,y,bw,bh,fs,narrow,title){const S=AAS[L],A=AAB.concat(S.a),u=Math.min(bw/5.6,(bh-(narrow?46:58))/7.4),ox=x+bw*0.44,oy=y+bh-(narrow?10:14)-1.9*u,X=p=>ox+p[1]*u,Y=p=>oy-p[2]*u,r=Math.max(4,u*0.2);
  rectF(c,x,y,bw,bh,WHITE,2.4);cap(c,title,x+10,y+(narrow?12:15),'left',fs);
  // the backbone, on a pale band, with the bonds that lead to the links on either side
  c.fillStyle='#e9eff4';c.fillRect(x+2,oy-0.55*u,bw-4,2.4*u+(oy+1.85*u>y+bh?0:0));
  txt(c,'backbone',x+bw-8,oy+1.5*u,fs-2,'right',MUTP);if(S.a.length)txt(c,'side piece',x+8,oy-0.85*u,fs-2,'left',MUTP);
  [[A[0],[-1.73,0]],[A[2],[1.73,0]]].forEach(([p,q])=>line(c,X(p),Y(p),ox+q[0]*u,oy-q[1]*u,2,MUTP,[4,4]));
  const bond=(p,q,o)=>{const dx=X(q)-X(p),dy=Y(q)-Y(p),l=Math.hypot(dx,dy),nx=-dy/l*u*0.09,ny=dx/l*u*0.09;if(o===2){line(c,X(p)+nx,Y(p)+ny,X(q)+nx,Y(q)+ny,2);line(c,X(p)-nx,Y(p)-ny,X(q)-nx,Y(q)-ny,2);}else line(c,X(p),Y(p),X(q),Y(q),2.4);};
  [[0,1,1],[1,2,1],[2,3,2]].concat(S.b).forEach(([i,k,o])=>bond(A[i],A[k],o));
  A.forEach((p,i)=>disc(c,X(p),Y(p),r,ELC[p[0]],1.4));
  if(S.ch){const p=A[S.ch[0]];tag(c,S.ch[1],X(p)+r+9,Y(p)-r-4,'center',fs);}
  if(!S.a.length)txt(c,narrow?'side piece: one hydrogen':'its side piece is one hydrogen atom',x+bw/2,oy-1.6*u,fs-1,'center',MUTP);
  // the key to the atoms
  let kx=x+10,ky=y+(narrow?32:40);const hasS=A.some(p=>p[0]==='S');[['C','carbon'],['N','nitrogen'],['O','oxygen'],['S','sulfur']].forEach(([e,s2])=>{if(e==='S'&&!hasS)return;disc(c,kx+5,ky,5,ELC[e],1.2);txt(c,s2,kx+14,ky,fs-2,'left');c.font=`${fs-2}px ${HAND}`;kx+=c.measureText(s2).width+(hasS?20:26);if(e==='N'&&hasS&&kx+120>x+bw){kx=x+10;ky+=fs+3;}});}
if($('pChainCv')){
let SEL=63,PP=[];
const F=fig('pChainCv',w=>w<560?0.6:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,per=narrow?22:39;
  const B=narrow?{x:w*0.05,y:58,w:w*0.9,h:h*0.5-78}:{x:w*0.035,y:h*0.26,w:w*0.6,h:h*0.42},I=narrow?{x:w*0.04,y:h*0.5+22,w:w*0.92,h:h*0.5-30}:{x:w*0.69,y:h*0.05,w:w*0.285,h:h*0.9};
  PP=beads(c,B,per,0,0,0,1,SEL);const p=PP[SEL],a=MB.seq[SEL];
  txt(c,'start',B.x+serpG(B,per).R,B.y-(narrow?15:19),fs-1,'left',MUTP);cap(c,narrow?'tap a link':'click a link',narrow?8:12,narrow?15:19,'left',fs);
  kindKey(c,narrow?8:w*0.035,narrow?h*0.5+4:h-18,fs-1,narrow,w);
  drawAA(c,a,I.x,I.y,I.w,I.h,fs,narrow,(SEL+1)+': '+AANAME[a]);
},false);
function pick(i){$('pI').value=i+1;$('pI').dispatchEvent(new Event('input'));}
bind('pI',v=>'link '+v.toFixed(0)+' of 153',()=>{SEL=+$('pI').value-1;const a=MB.seq[SEL];setT('pIn',AANAME[a]);setT('pIk',KINDSAY[PK[SEL]]);setT('pIc',[...MB.seq].filter(x=>x===a).length+' of the 153 links');F.w&&F.draw(F);});
// a click or a tap on a link chooses it
{const cv=$('pChainCv'),near=e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let b=-1,bd=1e9;PP.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd){bd=d;b=i;}});return bd<=Math.max(12,PP[0]?PP[0][3]+7:12)?b:-1;};
  cv.addEventListener('click',e=>{const i=near(e);if(i>=0)pick(i);});cv.addEventListener('pointermove',e=>{cv.style.cursor=near(e)>=0?'pointer':'';});}
}

// ---------- stop 2: stretched out, and folded ----------
if($('pFoldCv')){
// how far, on average, the links of each kind sit from the middle of the folded protein
const CEN=[0,1,2].map(k=>MB.ca.reduce((a,p)=>a+p[k],0)/PN),DST=MB.ca.map(p=>Math.hypot(p[0]-CEN[0],p[1]-CEN[1],p[2]-CEN[2])),avg=K=>{const d=DST.filter((x,i)=>K.includes(PK[i]));return d.reduce((a,b)=>a+b,0)/d.length;},DO=avg(['oily']),DC=avg(['plus','minus']);
let TO=0,FROM=0,T0=-9,TN=0,CUR=0;
const F=fig('pFoldCv',w=>w<560?0.9:2.4,f=>{const {ctx:c,w,h,t}=f;TN=t;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,per=narrow?22:51,B=foldBox(w,h,narrow,narrow?56:h*0.3,narrow?48:h*0.32);
  const v=playing?FROM+(TO-FROM)*sm((t-T0)/3.2):TO;CUR=v;const s=Math.min(w*0.8,(h-(narrow?112:118)))/46,cx=w/2,cy=h*0.42;
  beads(c,B,per,v,cx,cy,s);
  if(v>0.98){[[5,'rgba(255,255,255,.85)',null],[2.2,INK,[7,6]]].forEach(([lw,col,d])=>{pen(c,lw,col);if(d)c.setLineDash(d);c.beginPath();c.arc(cx+CEN[0]*s,cy-CEN[1]*s,DO*s,0,7);c.stroke();c.setLineDash([]);});
    const y=cy+24*s+(narrow?12:14);line(c,cx-22.5*s,y,cx+22.5*s,y,2);line(c,cx-22.5*s,y-5,cx-22.5*s,y+5,2);line(c,cx+22.5*s,y-5,cx+22.5*s,y+5,2);tag(c,'45 Å',cx,y,'center',fs);}
  cap(c,v<0.02?'stretched out':v>0.98?'folded':'folding',narrow?8:12,narrow?15:19,'left',fs);
  kindKey(c,narrow?8:w*0.04,h-(narrow?14:18),fs-1,narrow,w);
});
choice('pF',x=>{FROM=CUR;TO=+x;T0=TN;setT('pFs',TO?'about 45 Å across':'more than 500 Å from end to end');
  setT('pFo',TO?'nearer the middle: '+DO.toFixed(0)+' Å from it on average, against '+DC.toFixed(0)+' Å for the charged links':'spread along the whole chain');F.w&&F.draw(F);});
}

// ---------- stop 3: the folded chain holds oxygen ----------
if($('pOxyCv')){
let TO=0,FROM=0,T0=-9,TN=0,CUR=0;
// oxygen sits on the iron, on the side of histidine 64
const FE=MB.heme[MB.heme.length-1],H64=MB.ca[63],DV=[0,1,2].map(k=>H64[k]-FE[k]),DL=Math.hypot(DV[0],DV[1]),UN=[DV[0]/DL,DV[1]/DL];   // the direction on the page from the iron toward histidine 64
const F=fig('pOxyCv',w=>w<560?0.95:2.4,f=>{const {ctx:c,w,h,t}=f;TN=t;bg(c,w,h);const narrow=w<560,fs=narrow?12:15;
  const v=playing?FROM+(TO-FROM)*sm((t-T0)/2.6):TO;CUR=v;const s=Math.min(w*(narrow?0.9:0.5),h*0.86)/46,cx=narrow?w/2:w*0.4,cy=h*(narrow?0.46:0.52);
  drawMb(c,cx,cy,s);const fx=cx+FE[0]*s,fy=cy-FE[1]*s;disc(c,fx,fy,Math.max(4,1.0*s),ORG,1.6);
  // the oxygen molecule: far away when v = 0, on the iron when v = 1
  const far=21,d=2.0+(far-2.0)*(1-v),ox=fx+UN[0]*d*s,oy=fy-UN[1]*d*s,r=Math.max(4,1.25*s),px=-UN[1],py=UN[0];
  if(v>0.01||TO===0){c.save();c.globalAlpha=v<0.02?0.9:1;const ro=Math.max(3.6,0.85*s),bl=Math.max(ro*1.5,1.3*s),g=Math.atan2(-UN[1],UN[0])+1.05,o2x=ox+bl*Math.cos(g),o2y=oy+bl*Math.sin(g);line(c,ox,oy,o2x,o2y,Math.max(2,0.4*s));disc(c,o2x,o2y,ro,RED,1.5);disc(c,ox,oy,ro,RED,1.5);c.restore();
    tag(c,v>0.98?(narrow?'oxygen':'oxygen, held on the iron'):'an oxygen molecule',ox+r*2.6,oy+(v>0.98?(narrow?22:28):0),'left',fs);}
  const hp=mbAt(64,cx,cy,s);if(!narrow||v>0.98){disc(c,hp[0],hp[1],3,INK,0);tag(c,narrow?'link 64':'link 64, a histidine',hp[0]+8,hp[1]-(narrow?14:17),'left',fs-1);}
  tag(c,narrow?'heme':'heme, with its iron',fx-8,fy+(narrow?20:26),'right',fs-1,RED);
  // the color of the protein
  const sw=narrow?w*0.2:w*0.13,sx=narrow?w*0.76:w*0.78,sy=narrow?h*0.84:h*0.36,sh=narrow?h*0.1:h*0.26,mixc=(a,b,k)=>'rgb('+a.map((x,i)=>Math.round(x+(b[i]-x)*k)).join(',')+')';
  rectF(c,sx,sy,sw,sh,mixc([108,36,62],[214,48,40],v),2.4);txt(c,narrow?'color':'color of the protein',sx+sw/2,sy-(narrow?10:13),fs-1,'center',MUTP);
  cap(c,v>0.98?'holding oxygen':v<0.02?'empty':'oxygen arrives',narrow?8:12,narrow?15:19,'left',fs);
});
choice('pO',x=>{FROM=CUR;TO=+x;T0=TN;setT('pOi',TO?'one oxygen molecule':'nothing');setT('pOc',TO?'bright red':'dark purple-red');F.w&&F.draw(F);});
}

// ---------- stop 4: five proteins, five jobs, one scale ----------
if($('pJobsCv')){
const J=[['ins','insulin',PX.ins.w,PX.ins.h,'A signal. It tells cells to take sugar out of the blood.','51, in two short chains','about 30 Å'],
 ['lys','lysozyme',PX.lys.w,PX.lys.h,'A cutting tool. It breaks open the walls of bacteria, and is found in tears and in egg white.','129','about 45 Å long'],
 ['mb','myoglobin',45,42,'Storage. It holds oxygen in muscle until it is needed.','153','about 45 Å'],
 ['hb','hemoglobin',PX.hb.w,PX.hb.h,'Transport. It carries oxygen in the blood, from the lungs to the rest of the body.','574, in four chains','about 65 Å'],
 ['igg','antibody',PX.igg.w,PX.igg.h,'Defense. It sticks to a virus or a bacterium and marks it for destruction.','about 1,300, in four chains','about 160 Å']];
let JS='mb';
// Each protein as a tube through its chain, in the manner of drawMb: helices blue, strands green, the rest grey, far parts drawn first.
// The pieces are made once for each protein, from protdata.js
const TUBE={};
function tube(k){if(TUBE[k])return TUBE[k];const D=PX[k],S=[],K=k==='igg'?3:5;
  D.ch.forEach(ch=>{const n=ch.s.length,A=[];for(let i=0;i<n;i++)A.push([ch.p[3*i]/10,ch.p[3*i+1]/10,ch.p[3*i+2]/10]);
    const cuts=[0,...ch.g,n];for(let q=0;q<cuts.length-1;q++){const P=A.slice(cuts[q],cuts[q+1]),m=P.length,ss=ch.s.slice(cuts[q],cuts[q+1]);if(m<2)continue;const Q=[P[0]];
      for(let i=0;i<m-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(m-1,i+2)];
        for(let e=1;e<=K;e++){const t=e/K,t2=t*t,t3=t2*t;Q.push([0,1,2].map(d=>0.5*(2*p1[d]+(-p0[d]+p2[d])*t+(2*p0[d]-5*p1[d]+4*p2[d]-p3[d])*t2+(-p0[d]+3*p1[d]-3*p2[d]+p3[d])*t3)));}}
      for(let i=0;i<m;i++){const a=Math.max(0,Math.round(i*K-K/2)),b=Math.min(Q.length-1,Math.round(i*K+K/2)),t=ss[i],lo=i>0&&ss[i-1]===t?3:0,up=i<m-1&&ss[i+1]===t?3:0;
        S.push({core:Q.slice(a,b+1),ext:Q.slice(Math.max(0,a-lo),Math.min(Q.length,b+1+up)),z:P[i][2],t});}}});
  D.hem.forEach(H=>{const A=[];for(let i=0;i<H.p.length/3;i++)A.push([H.p[3*i]/10,H.p[3*i+1]/10,H.p[3*i+2]/10]);
    H.b.forEach(([i,m])=>S.push({core:[A[i],A[m]],ext:[A[i],A[m]],z:(A[i][2]+A[m][2])/2,t:'X'}));S.push({fe:A[H.fe],z:A[H.fe][2]+0.5,t:'F'});});
  return TUBE[k]={S:S.sort((u,v)=>u.z-v.z),zr:D.zr};}
function drawTube(c,k,cx,cy,s){const T=tube(k);c.save();c.lineCap='round';c.lineJoin='round';
  const path=pts=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(cx+p[0]*s,cy-p[1]*s):c.moveTo(cx+p[0]*s,cy-p[1]*s));c.stroke();},ow=Math.max(0.5,Math.min(2.2,s*0.4));
  T.S.forEach(g=>{const u=Math.max(0,Math.min(1,0.5+0.5*g.z/T.zr));
    if(g.t==='F'){c.restore();disc(c,cx+g.fe[0]*s,cy-g.fe[1]*s,Math.max(2.2,1.1*s),ORG,1.2);c.save();c.lineCap='round';c.lineJoin='round';return;}
    const lw=Math.max(1.1,(g.t==='X'?0.5:g.t==='H'?2.3:g.t==='E'?1.9:1.1)*s);
    c.strokeStyle=INK;c.lineWidth=lw+2*ow;path(g.core);
    c.strokeStyle=g.t==='X'?RED:g.t==='H'?mbMix('#7ea3d6','#c6d9f0',u):g.t==='E'?mbMix('#5f9f6e','#cfe6c9',u):mbMix('#8d979e','#d5dbdf',u);c.lineWidth=lw;path(g.ext);});
  c.restore();}
function drawJ(c,k,x,y,s){if(k==='mb')drawMb(c,x,y,s);else drawTube(c,k,x,y,s);}
const F=fig('pJobsCv',w=>w<560?1.0:2.2,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560,fs=narrow?12:15,rows=narrow?[[0,1,2,3],[4]]:[[0,1,2,3,4]],gap=narrow?16:34,mx=w*0.04,top=narrow?40:46,lab=fs+18;
  const need=rows.map(r=>r.reduce((a,i)=>a+J[i][2],0)),hs=rows.map(r=>Math.max(...r.map(i=>J[i][3])));
  const s=Math.min(...rows.map((r,ri)=>(w-2*mx-gap*(r.length-1))/need[ri]),(h-top-rows.length*lab-8)/hs.reduce((a,b)=>a+b,0));
  let y=top;rows.forEach((r,ri)=>{const used=need[ri]*s,gp=(w-2*mx-used)/r.length;let x=mx+gp/2;const cy=y+hs[ri]*s/2;
    r.forEach(i=>{const q=J[i],xc=x+q[2]*s/2;drawJ(c,q[0],xc,cy,s);if(q[0]===JS)cap(c,q[1],xc,y+hs[ri]*s+lab*0.55,'center',fs);else txt(c,q[1],xc,y+hs[ri]*s+lab*0.55,fs,'center');x+=q[2]*s+gp;});y+=hs[ri]*s+lab;});
  const bx=narrow?w-mx-50*s:w-mx-50*s,by=narrow?top-14:top-12;line(c,bx,by,bx+50*s,by,3);line(c,bx,by-5,bx,by+5,2);line(c,bx+50*s,by-5,bx+50*s,by+5,2);txt(c,'50 Å',bx-8,by,fs-1,'right');
  cap(c,narrow?'all to one scale':'five proteins, all to one scale',narrow?8:12,narrow?15:19,'left',fs);
},false);
choice('pJ',x=>{JS=x;const q=J.find(v=>v[0]===x);setT('pJj',q[4]);setT('pJl',q[5]);setT('pJz',q[6]);F.w&&F.draw(F);});
}
capK();
})();
