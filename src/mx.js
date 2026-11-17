// ---------- the MX guide ("How MX works") ----------
// the drawing kit, introkit.js (helpers, the detector, the data collection) and mbdata.js (myoglobin and its maps) come before this file
const MUT='#52606b';
const fmtLen=m=>m<0.995e-9?(m*1e10).toFixed(m<1e-9/5?2:1)+' Å':m<0.995e-6?(m*1e9).toFixed(m<1e-8?1:0)+' nm':(m*1e6).toFixed(m<1e-5?1:0)+' µm';
// the maps and the chain of myoglobin are in mbdata.js

// ---------- big structures, drawn as cartoons from their known sizes and arrangements (not from deposited coordinates) ----------
// Each structure is a list of groups {col, r, pts}: a chain or domain drawn as a cluster of discs of radius r (angstroms).
const BIG=(()=>{const R=rng(17),PB='#9bbbe3',PG='#7fb08a',PY='#f2c14e',PR='#e07a6c',PP='#b7a3d9',PL='#f0b7ad',RN='#f4b860',RY='#f6d77a';
  const ell=(n,cx,cy,cz,rx,ry,rz)=>{const p=[];while(p.length<n){const x=R()*2-1,y=R()*2-1,z=R()*2-1;if(x*x+y*y+z*z<=1)p.push([cx+x*rx,cy+y*ry,cz+z*rz]);}return p;};
  const inPoly=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){if((P[i][1]>y)!==(P[j][1]>y)&&x<(P[j][0]-P[i][0])*(y-P[i][1])/(P[j][1]-P[i][1])+P[i][0])c=!c;}return c;};
  const fill=(P,n,z,dz=6)=>{const xs=P.map(q=>q[0]),ys=P.map(q=>q[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),p=[];let t=0;
    while(p.length<n&&t++<60000){const x=x0+R()*(x1-x0),y=y0+R()*(y1-y0);if(inPoly(P,x,y))p.push([x,y,z+(R()-0.5)*dz]);}return p;};
  const S={};
  // myoglobin: one compact chain and its heme
  S.mb=[{col:PL,r:6,pts:ell(46,0,0,0,18,14,11)},{col:'#d8412f',r:4,pts:[[5,2,12],[8,3,12],[5,5,12]]}];
  // hemoglobin: two alpha and two beta chains
  S.hb=[[-14,13,9,PL],[14,-13,9,PL],[15,14,-9,PR],[-15,-14,-9,PR]].map(([x,y,z,col])=>({col,r:6,pts:ell(40,x,y,z,16,15,13)}));
  // an antibody: twelve domains in a Y. Heavy chains in blue, light chains in yellow
  S.igg=[];{const dom=(x,y,col,z)=>S.igg.push({col,r:5.5,pts:ell(20,x,y,z,10,12,9)});
    [[-9,62],[9,62],[-13,34],[13,34]].forEach(([x,y],i)=>dom(x,y,PB,i%2?2:-2));
    for(const sg of[-1,1]){const ux=sg*0.82,uy=-0.57,nx=-uy*sg,ny=ux*sg,bx=sg*8,by=4;
      [[24,PB,PY],[53,PB,PY]].forEach(([d,c1,c2])=>{dom(bx+ux*d+nx*9,by+uy*d+ny*9,c1,3);dom(bx+ux*d-nx*9,by+uy*d-ny*9,c2,-3);});
      const hp=[];for(let u=0;u<=1.001;u+=0.125)hp.push([sg*(14-8*u),-4+30*u,-6]);S.igg.push({col:PB,r:3.2,pts:hp});}}
  // nucleosome: eight histones, and 147 base pairs of DNA wound 1.65 times around them, seen down the axis of the winding
  S.ncp=[];{const hc=[PB,PG,PY,PL];for(let i=0;i<8;i++){const a=i*Math.PI/2+(i>3?Math.PI/4:0),z=i>3?-12:12;S.ncp.push({col:hc[i%4],r:6,pts:ell(28,17*Math.cos(a),17*Math.sin(a),z,14,14,11)});}
    for(let st=0;st<2;st++)for(let seg=0;seg<25;seg++){const pts=[];for(let i=seg*6;i<Math.min(148,seg*6+7);i++)for(let f=0;f<2;f++){const u=(i+f*0.5)/146,ph=2*Math.PI*1.65*u-0.6,ps=2*Math.PI*(i+f*0.5)/10.2+st*2.5,
        cx=41.8*Math.cos(ph),cy=41.8*Math.sin(ph),cz=25.9*1.65*u-21;pts.push([cx+9.5*Math.cos(ph)*Math.cos(ps),cy+9.5*Math.sin(ph)*Math.cos(ps),cz+9.5*Math.sin(ps)]);}
      S.ncp.push({col:st?'#ee8a2b':RY,r:3.4,pts});}}
  // GroEL and GroES: two rings of seven, one capped, seen from the side
  S.gro=[];for(let k=0;k<7;k++){const a=k*2*Math.PI/7+0.2,cs=Math.cos(a),sn=Math.sin(a);
    [[38,14,PB],[50,38,PB],[45,60,PB],[38,-14,PG],[48,-42,PG],[52,-66,PG],[27,-90,PY]].forEach(([r,y,col])=>S.gro.push({col,r:6,pts:ell(13,r*cs,y,r*sn,13,13,13)}));}
  S.gro.push({col:PY,r:6,pts:ell(14,0,-99,0,16,7,16)});
  // the ribosome: small subunit on the left, large on the right, three tRNAs between. RNA in orange and yellow, proteins on top
  {const k=0.8,L=[[20,120],[70,105],[105,65],[118,10],[112,-40],[125,-75],[150,-100],[128,-112],[98,-92],[80,-100],[62,-128],[30,-140],[5,-128],[-10,-100],[-30,-95],[-48,-112],[-70,-118],[-78,-100],[-60,-78],[-62,-40],[-70,10],[-58,60],[-30,100]].map(([x,y])=>[(x+40)*k,y*k]),
      Sm=[[-150,115],[-120,125],[-98,95],[-90,50],[-82,5],[-78,-30],[-92,-48],[-80,-70],[-84,-100],[-105,-122],[-135,-125],[-158,-108],[-165,-80],[-150,-55],[-168,-30],[-175,20],[-172,70]].map(([x,y])=>[(x+62)*k,y*k]);
    S.ribo=[{col:RN,r:9,pts:fill(L,520,0)},{col:RY,r:9,pts:fill(Sm,300,14)}];
    fill(L,26,8,2).forEach(p=>S.ribo.push({col:PB,r:7,pts:ell(5,p[0],p[1],p[2],9,9,3)}));
    fill(Sm,15,22,2).forEach(p=>S.ribo.push({col:PP,r:7,pts:ell(5,p[0],p[1],p[2],9,9,3)}));
    [[-14,-18,PR],[-27,-30,PG],[-40,-40,'#c98bd0']].forEach(([x,y,col],i)=>{const pts=[];for(let u=0;u<=1.001;u+=0.1)pts.push([x*k+u*26*k,y*k+u*34*k,30+i],[x*k+26*k-u*20*k,y*k+34*k+u*14*k,30+i]);S.ribo.push({col,r:5,pts});});}
  // a rhinovirus shell: sixty copies of three proteins on the outside, arranged with the symmetry of an icosahedron
  {const ph=(1+Math.sqrt(5))/2,nrm=v=>{const n=Math.hypot(...v);return v.map(q=>q/n);},rot=(u,a)=>{const c=Math.cos(a),s=Math.sin(a),t=1-c,[x,y,z]=u;return [[t*x*x+c,t*x*y-s*z,t*x*z+s*y],[t*x*y+s*z,t*y*y+c,t*y*z-s*x],[t*x*z-s*y,t*y*z+s*x,t*z*z+c]];},
      mul=(A,B)=>A.map(r=>[0,1,2].map(j=>r[0]*B[0][j]+r[1]*B[1][j]+r[2]*B[2][j])),app=(M,v)=>M.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]);
    const gens=[rot(nrm([0,1,ph]),2*Math.PI/5),rot([0,0,1],Math.PI)],G=[[[1,0,0],[0,1,0],[0,0,1]]];
    for(let i=0;i<G.length;i++)for(const g of gens){const M=mul(g,G[i]);if(!G.some(Q=>Q.every((r,a)=>r.every((v,b)=>Math.abs(v-M[a][b])<1e-6))))G.push(M);}
    const v5=nrm([0,1,ph]),v3=nrm([ph,0,2*ph+1]),v2=[0,0,1],mix=(a,b,c)=>nrm([0,1,2].map(i=>a*v5[i]+b*v3[i]+c*v2[i])),tilt=rot(nrm([1,0.3,0]),0.35);
    const VP=[[mix(0.62,0.2,0.18),'#6f9bd6'],[mix(0.13,0.25,0.62),PG],[mix(0.18,0.62,0.2),PR]];S.vir=[];
    G.forEach(M=>VP.forEach(([d,col])=>{const c=app(tilt,app(M,d));if(c[2]<-0.25)return;S.vir.push({col,r:11,pts:ell(8,c[0]*138,c[1]*138,c[2]*138,17,17,17)});}));S.nsym=G.length;}
  // bounding boxes and depth order
  const out={};for(const k of['mb','hb','igg','ncp','gro','ribo','vir']){const g=S[k];let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;g.forEach(q=>{q.z=q.pts.reduce((s,p)=>s+p[2],0)/q.pts.length;q.pts.forEach(p=>{x0=Math.min(x0,p[0]-q.r);x1=Math.max(x1,p[0]+q.r);y0=Math.min(y0,p[1]-q.r);y1=Math.max(y1,p[1]+q.r);});});
    g.sort((a,b)=>a.z-b.z);out[k]={g,x0,x1,y0,y1,w:x1-x0,h:y1-y0};}
  out.nsym=S.nsym;return out;})();
// draws one structure centered at (cx, cy) at s pixels to the angstrom: each group as a flat shape with an ink outline, far groups first
function drawBig(c,k,cx,cy,s,lw=1.3){if(k==='mb'){drawMb(c,cx,cy-1.9*s,s);return;}   // myoglobin is drawn from its real chain
  const b=BIG[k],ox=cx-(b.x0+b.x1)/2*s,oy=cy-(b.y0+b.y1)/2*s;
  b.g.forEach(q=>{c.fillStyle=INK;c.beginPath();q.pts.forEach(p=>{const X=ox+p[0]*s,Y=oy+p[1]*s;c.moveTo(X+q.r*s+lw,Y);c.arc(X,Y,q.r*s+lw,0,7);});c.fill();
    c.fillStyle=q.col;c.beginPath();q.pts.forEach(p=>{const X=ox+p[0]*s,Y=oy+p[1]*s;c.moveTo(X+q.r*s,Y);c.arc(X,Y,Math.max(0.5,q.r*s),0,7);});c.fill();});}
const GAL=[['mb','myoglobin','17 kDa','about 1,260','45 Å','It stores oxygen in muscle, and was the first protein whose structure was solved.'],
  ['hb','hemoglobin','64 kDa','about 4,500','65 Å','Four chains that carry oxygen in the blood and pass it on where it is needed.'],
  ['ncp','a nucleosome','200 kDa','about 13,000','100 Å','DNA wound nearly twice around eight histone proteins: the way DNA is packed in the cell.'],
  ['igg','an antibody','150 kDa','about 10,000','150 Å','Two arms that each grip a target, and a stem that calls in the rest of the immune system.'],
  ['gro','GroEL and GroES','870 kDa','about 60,000','185 Å','A chamber with a lid, inside which other proteins are given room to fold.'],
  ['ribo','a ribosome','2.5 MDa','about 150,000','250 Å','The machine that builds every protein: three RNA molecules and more than fifty proteins.'],
  ['vir','the shell of a cold virus','6 MDa','about 400,000','300 Å','The protein coat of a rhinovirus: sixty copies of each of its proteins, arranged with the symmetry of a soccer ball.']];

// ---------- A GALLERY OF STRUCTURES, to one scale ----------
if($('galCv')){
let gSel='ribo',gHit=[],gImg=null,gKey='';
const galFig=fig('galCv',w=>w<560?1.0:2.75,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const rows=narrow?[[0,1,2,3],[4,5,6]]:[[0,1,2,3,4,5,6]],gap=narrow?24:34,mx=w*0.03,top=narrow?40:44,lab=fs*2+16,SH={mb:'myoglobin',hb:'hemoglobin',ncp:'nucleosome',igg:'antibody',gro:'GroEL',ribo:'ribosome',vir:'cold virus'};
  const need=rows.map(r=>r.reduce((s,i)=>s+BIG[GAL[i][0]].w,0)+gap*(r.length-1)),hs=rows.map(r=>Math.max(...r.map(i=>BIG[GAL[i][0]].h)));
  const s=Math.min((w-2*mx)/Math.max(...need),(h-top-rows.length*lab-8)/hs.reduce((a,b)=>a+b,0));
  const key=Math.round(w)+'x'+Math.round(h);
  if(key!==gKey){gImg=document.createElement('canvas');const dpr=Math.min(window.devicePixelRatio||1,2);gImg.width=Math.round(w*dpr);gImg.height=Math.round(h*dpr);const g=gImg.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);gKey=key;gHit=[];
    // each row is spread across the width, so that the names under the small structures have room
    let y=top;rows.forEach((r,ri)=>{const used=r.reduce((a,i)=>a+BIG[GAL[i][0]].w,0)*s,gp=(w-2*mx-used)/r.length;let x=mx+gp/2;const cy=y+hs[ri]*s/2;r.forEach(i=>{const k=GAL[i][0],b=BIG[k];drawBig(g,k,x+b.w*s/2,cy,s,narrow?0.9:1.3);gHit.push({k,i,x:x+b.w*s/2,y:cy,hw:b.w*s/2,yl:y+hs[ri]*s+12});x+=b.w*s+gp;});y+=hs[ri]*s+lab;});}
  c.drawImage(gImg,0,0,w,h);
  // names under the structures, nudged apart where two would run into each other
  c.font=`${fs}px ${HAND}`;const L=gHit.map(q=>{const nm=narrow?SH[q.k]:GAL[q.i][1],tw=c.measureText(nm).width+(q.k===gSel?16:0);return {q,nm,tw,x:Math.min(Math.max(q.x,tw/2+10),w-tw/2-10)};});
  for(let pass=0;pass<2;pass++)for(let i=1;i<L.length;i++){if(Math.abs(L[i].q.yl-L[i-1].q.yl)>1)continue;const ov=L[i-1].x+L[i-1].tw/2+10-(L[i].x-L[i].tw/2);if(ov>0){L[i-1].x=Math.max(L[i-1].tw/2+8,L[i-1].x-ov/2);L[i].x=Math.max(L[i].x+ov/2,L[i-1].x+L[i-1].tw/2+10+L[i].tw/2);}}
  L.forEach(({q,nm,x})=>{if(q.k===gSel)cap(c,nm,x,q.yl,'center',fs);else txt(c,nm,x,q.yl,fs,'center');txt(c,GAL[q.i][2],x,q.yl+fs+(q.k===gSel?8:5),fs-1,'center',MUT);});
  // scale bar
  const bx=narrow?w-mx-100*s:mx+4,by=narrow?top-10:h-16;line(c,bx,by,bx+100*s,by,3);line(c,bx,by-5,bx,by+5,2);line(c,bx+100*s,by-5,bx+100*s,by+5,2);txt(c,'100 Å (10 nm)',narrow?bx-6:bx+100*s+8,by,fs-1,narrow?'right':'left');
  cap(c,narrow?'All to one scale':'Structures solved by crystallography, all to one scale',12,18,'left',narrow?12:15);
},false);
function gaUpd(){const q=GAL.find(v=>v[0]===gSel);$('gSel').value=gSel;$('gM').textContent=q[2];$('gA').textContent=q[3];$('gS').textContent=q[4];$('gW').textContent=q[5];galFig.w&&galFig.draw(galFig);}
$('gSel').addEventListener('input',()=>{gSel=$('gSel').value;gaUpd();});
galFig.cv.style.cursor='pointer';
galFig.cv.addEventListener('click',e=>{const r=galFig.cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=1e9;gHit.forEach(q=>{const d=Math.abs(q.x-x)-q.hw;if(d<bd&&Math.abs(y-q.y)<q.yl-q.y+34){bd=d;best=q.k;}});if(best&&bd<16){gSel=best;gaUpd();}});
gaUpd();
}

// ---------- CRYSTAL TO STRUCTURE (opening figure) ----------
if($('mxHeroCv')){
// Three panels. The crystal and the images keep step: each image is 0.3 degrees of turn, 20 images a second. The third panel takes 14 s:
// the map of one piece of myoglobin (a helix), then the atoms fitted into it, then the view pulls back to the whole protein.
let hShown=-1,hSpots=[];
fig('mxHeroCv',w=>w<560?0.5:2.6,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?13:15;
  const P=narrow?[[w*0.5,h*0.12,h*0.09],[w*0.5,h*0.44,h*0.135],[w*0.5,h*0.8,h*0.125]]:[[w*0.12,h*0.5,h*0.28],[w*0.415,h*0.52,h*0.37],[w*0.805,h*0.52,h*0.36]];
  const n=Math.floor(t*20);if(n!==hShown){hSpots=rotImage(n);hShown=n;}
  // 1: a crystal turning in the beam
  {const [cx,cy,s]=P[0],th=n*0.3*Math.PI/180,ct=Math.cos(th),st=Math.sin(th),tl=0.42;
    line(c,cx-s*(narrow?2.6:1.5),cy,cx-s*0.2,cy,3,BLUE);arrow(c,cx-s*1.1,cy,cx-s*0.75,cy,BLUE,3,9);
    // the loop that holds the crystal turns with it: its far half is drawn before the crystal and its near half after
    const la=th+0.5,lrx=Math.max(0.05,Math.abs(Math.cos(la)))*s*0.78,rf=Math.sin(2*la)<0,half=front=>{pen(c,2.2);c.beginPath();if(front===rf)c.ellipse(cx,cy,lrx,s*0.58,0,-Math.PI/2,Math.PI/2);else c.ellipse(cx,cy,lrx,s*0.58,0,Math.PI/2,1.5*Math.PI);c.stroke();};
    line(c,cx,cy+s*0.56,cx,cy+s*1.0,3);half(false);
    const V=[];for(const X of[-1,1])for(const Y of[-1,1])for(const Z of[-1,1]){const x=X*0.4,y=Y*0.29,z=Z*0.24,x1=x*ct+z*st,z1=-x*st+z*ct,y2=y*Math.cos(tl)-z1*Math.sin(tl),z2=y*Math.sin(tl)+z1*Math.cos(tl);V.push([cx+x1*s,cy-y2*s,z2]);}
    const F=[[0,1,3,2,GRN],[4,6,7,5,GRN],[0,4,5,1,'#4a8f5a'],[2,3,7,6,LTGRN],[0,2,6,4,'#6fb37e'],[1,5,7,3,'#6fb37e']];
    F.map(q=>({q,z:(V[q[0]][2]+V[q[1]][2]+V[q[2]][2]+V[q[3]][2])/4})).sort((a,b)=>a.z-b.z).slice(3).forEach(({q})=>poly(c,[V[q[0]],V[q[1]],V[q[2]],V[q[3]]],q[4],2));half(true);
    // the turn, drawn around the pin
    pen(c,1.8,MUT);c.beginPath();c.ellipse(cx,cy+s*0.84,s*0.26,s*0.08,0,0.5,5.6);c.stroke();arrow(c,cx+s*0.2,cy+s*0.79,cx+s*0.26,cy+s*0.83,MUT,1.8,6);
    txt(c,narrow?'a crystal turns in the X-ray beam':'a crystal turns in the beam',narrow?cx:Math.max(cx,w*0.125),cy+s*1.3,fs,'center');}
  // 2: the images on the detector, drawn as the real one
  {const [cx,cy,s]=P[1],B=detFace(c,cx,cy,2*s/DETG.hh),k=Math.max(0.7,B.w/230);
    hSpots.forEach(q=>{c.fillStyle=`rgba(27,27,27,${Math.min(1,0.45+2.5*q.a).toFixed(2)})`;c.beginPath();c.arc(cx+q.u*B.w/2,cy+q.v*B.h/2,(0.6+2.3*Math.sqrt(q.a))*k,0,7);c.fill();});
    txt(c,narrow?'thousands of images of spots':'the detector takes thousands of images',cx,cy+s+(narrow?13:16),fs,'center');}
  // 3: from the map to the atoms to the whole protein
  {const [cx,cy,s]=P[2],W=Math.round(narrow?w*0.84:w*0.35),H=Math.round(s*2),X0=cx-W/2,Y0=cy-H/2,u=t%14;
    rectF(c,X0,Y0,W,H,WHITE,2.5);const x=X0+2,y=Y0+2,W2=W-4,H2=H-4;
    if(u<6.4){drawMap(c,x,y,W2,H2,1.5,4);
      if(u>=2.6){if(u>=5.6){c.save();c.globalAlpha=Math.min(1,(u-5.6)/0.7);c.fillStyle=WHITE;c.fillRect(x,y,W2,H2);c.restore();}drawMol(c,x,y,W2,H2,Math.min(1,(u-2.6)/1.2));}}
    else pullBack(f,c,x,y,W2,H2,Math.min(1,(u-6.4)/4),narrow);
    pen(c,2.5);c.strokeRect(X0,Y0,W,H);
    txt(c,u<2.6?'from the spots: a map of the electrons':u<6.4?'atoms are fitted into the map':narrow?'the structure: myoglobin':'the structure: myoglobin, about 1,260 atoms',cx,cy+s+(narrow?13:16),fs,'center');}
  if(narrow){fatArrow(c,w*0.5,h*0.262,w*0.5,h*0.298,YEL,6);fatArrow(c,w*0.5,h*0.612,w*0.5,h*0.648,YEL,6);}
  else{fatArrow(c,w*0.222,h*0.52,w*0.262,h*0.52,YEL,7);fatArrow(c,w*0.572,h*0.52,w*0.618,h*0.52,YEL,7);}
  cap(c,'From crystal to structure',12,18,'left',narrow?12:15);
});
}

// ---------- HOW SMALL: what each kind of light can show ----------
if($('scaleCv')){
const SC=[['bond between two atoms',1.5e-10,'atom'],['DNA double helix, across',2e-9,'dna'],['hemoglobin',6.5e-9,'prot'],['ribosome',2.5e-8,'ribo'],['a virus',1e-7,'virus'],['a bacterium',2e-6,'bact'],['red blood cell',7.5e-6,'cell'],['a protein crystal',5e-5,'xtal']];
let zL=-6.3;
function icon(c,k,x,y,s){
  if(k==='atom'){line(c,x-s*0.45,y,x+s*0.45,y,2.5);disc(c,x-s*0.45,y,s*0.32,'#5d6a73',1.6);disc(c,x+s*0.45,y,s*0.32,RED,1.6);}
  else if(k==='dna'){pen(c,2,BLUE);c.beginPath();for(let u=-1;u<=1.001;u+=0.05){const X=x+s*0.55*Math.sin(u*3.2),Y=y+u*s;u===-1?c.moveTo(X,Y):c.lineTo(X,Y);}c.stroke();pen(c,2,RED);c.beginPath();for(let u=-1;u<=1.001;u+=0.05){const X=x-s*0.55*Math.sin(u*3.2),Y=y+u*s;u===-1?c.moveTo(X,Y):c.lineTo(X,Y);}c.stroke();}
  else if(k==='prot'){[[-0.4,-0.35],[0.4,-0.35],[-0.4,0.4],[0.4,0.4]].forEach(([a,b],i)=>disc(c,x+a*s,y+b*s,s*0.5,i%3?LTRED:RED,1.6));}
  else if(k==='ribo'){c.beginPath();c.ellipse(x,y+s*0.3,s*0.95,s*0.62,0,0,7);c.fillStyle=LTBLUE;c.fill();pen(c,1.8);c.stroke();c.beginPath();c.ellipse(x,y-s*0.45,s*0.7,s*0.45,0,0,7);c.fillStyle=LTORG;c.fill();c.stroke();}
  else if(k==='virus'){const p=[];for(let i=0;i<6;i++)p.push([x+s*Math.cos(i*Math.PI/3+0.52),y+s*Math.sin(i*Math.PI/3+0.52)]);poly(c,p,PUR,1.8);}
  else if(k==='bact'){c.beginPath();c.roundRect(x-s*1.15,y-s*0.5,s*2.3,s,s*0.5);c.fillStyle=LTGRN;c.fill();pen(c,1.8);c.stroke();}
  else if(k==='cell'){disc(c,x,y,s,LTRED,1.8);disc(c,x,y,s*0.42,'#eaa59b',1.2);}
  else if(k==='xtal'){poly(c,[[x,y-s],[x+s*0.8,y-s*0.2],[x+s*0.5,y+s],[x-s*0.5,y+s],[x-s*0.8,y-s*0.2]],GRN,1.8);line(c,x-s*0.8,y-s*0.2,x+s*0.8,y-s*0.2,1.2);}}
const scaleFig=fig('scaleCv',w=>w<560?0.78:2.6,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const La=-10.3,Lb=-4,x0=w*0.035,x1=w*0.965,X=L=>x0+(L-La)/(Lb-La)*(x1-x0),yA=h*(narrow?0.7:0.72),lim=zL-Math.log10(2),xl=X(Math.max(La,lim));
  // the part of the scale this light can show
  c.fillStyle='rgba(255,233,163,0.75)';c.fillRect(xl,h*0.13,x1-xl,yA-h*0.13);
  [[4e-7,7e-7,narrow?'visible light':'wavelengths of visible light','rgba(246,197,46,0.55)'],[0.62e-10,2.07e-10,narrow?'X-rays at NE-CAT':'wavelengths of the X-rays at NE-CAT','rgba(47,109,181,0.35)']].forEach(([a,b,s2,col],i)=>{const xa=X(Math.log10(a)),xb=Math.max(X(Math.log10(b)),xa+5);c.fillStyle=col;c.fillRect(xa,yA+(narrow?34:38),xb-xa,10);pen(c,1.2);c.strokeRect(xa,yA+(narrow?34:38),xb-xa,10);
    txt(c,s2,i?xa:(xa+xb)/2,yA+(narrow?54:59),fs-1,i?'left':'center');});
  line(c,x0,yA,x1,yA,2.5);
  [['1 Å',-10],['1 nm',-9],['10 nm',-8],['100 nm',-7],['1 µm',-6],['10 µm',-5],['100 µm',-4]].forEach(([s2,L])=>{line(c,X(L),yA-5,X(L),yA+5,1.8);txt(c,s2,L===-4?x1+(narrow?4:8):X(L),yA+17,fs-1,L===-4?'right':'center');});
  const SN=['a bond','DNA','hemoglobin','ribosome','virus','bacterium','blood cell','crystal'];
  SC.forEach(([nm0,m,k],i)=>{const nm=narrow?SN[i]:nm0,L=Math.log10(m),x=X(L),ok=L>=lim,s=narrow?9:13,lv=narrow?i%3:i%2,yi=yA-(narrow?26:34),yl=h*0.2+lv*(fs+5);
    c.globalAlpha=ok?1:0.28;icon(c,k,x,yi,s);line(c,x,yi+s+3,x,yA,1,'#7d8b96');c.globalAlpha=1;
    c.font=`${fs-1}px ${HAND}`;const tw=c.measureText(nm).width,xt=Math.min(Math.max(x,x0+tw/2),x1-tw/2);line(c,x,yl+fs*0.6,x,yi-s-3,1,ok?'#7d8b96':'#c3cbd1');txt(c,nm,xt,yl,fs-1,'center',ok?INK:'#8c979f');});
  line(c,xl,h*0.13,xl,yA+8,2.4,RED);tag(c,narrow?'finest detail':'finest detail this light can show',Math.min(Math.max(xl,x0+(narrow?48:112)),x1-(narrow?48:112)),h*0.13,'center',fs,RED);
  cap(c,narrow?'How small can you see?':'How small can you see? It depends on the light',12,18,'left',narrow?12:15);
},false);
function scUpd(){zL=+$('zL').value;const m=Math.pow(10,zL),ev=1239.84e-9/m;$('zLO').textContent=fmtLen(m);
  $('zK').textContent=m>7e-7?'infrared':m>4e-7?'visible light':m>1e-8?'ultraviolet':m>2e-10?'soft X-rays':'hard X-rays';
  $('zE').textContent=ev<1000?ev.toFixed(ev<10?1:0)+' eV':(ev/1000).toFixed(ev<1e4?2:1)+' keV';$('zD').textContent='about '+fmtLen(m/2);scaleFig.w&&scaleFig.draw(scaleFig);}
$('zL').addEventListener('input',scUpd);
[['zBV',-6.3],['zBX',-10.01]].forEach(([id,v])=>$(id).addEventListener('click',()=>{$('zL').value=v;scUpd();}));scUpd();
}

// ---------- WHY A CRYSTAL: many copies in step ----------
if($('latCv')){
const LM=[0,1.5,3.9,5.2];let lN=3,lA=14;
const lEnv=q=>{let re=0,im=0;LM.forEach(x=>{re+=Math.cos(2*Math.PI*q*x);im+=Math.sin(2*Math.PI*q*x);});return (re*re+im*im)/16*Math.exp(-3*q*q);};
const lInt=(q,N,a)=>{const s=Math.sin(Math.PI*q*a);return Math.abs(s)<1e-6?1:Math.pow(Math.sin(N*Math.PI*q*a)/(N*s),2);};
const latFig=fig('latCv',w=>w<560?0.95:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const x0=w*(narrow?0.06:0.05),x1=w*0.97,ys=h*0.2,y0=h*0.36,y1=h*0.82,QM=0.5,X=q=>x0+q/QM*(x1-x0),Y=v=>y1-(y1-y0)*Math.min(1.04,v)/1.04;
  // the row of molecules
  const L=x1-x0,pa=Math.min(narrow?5:8,L/(lN*lA)),xs=(x0+x1)/2-lN*lA*pa/2,rd=Math.max(1.3,Math.min(4.5,pa*0.75));
  for(let n=0;n<=lN;n++)line(c,xs+n*lA*pa,ys-10,xs+n*lA*pa,ys+10,1,'#7d8b96');
  for(let n=0;n<lN;n++)LM.forEach((x,i)=>{c.fillStyle=i===2?RED:GRN;c.beginPath();c.arc(xs+(n*lA+x+1.2)*pa,ys+(i%2?-1:1)*rd*0.8,rd,0,7);c.fill();if(rd>2.5){pen(c,1.2);c.stroke();}});
  txt(c,lN===1?'one molecule':lN+' copies in a row, each '+lA+' Å from the next',(x0+x1)/2,ys-(narrow?24:28),fs,'center');
  // what they scatter
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);
  const n=narrow?900:2000;c.beginPath();c.moveTo(x0,y1);for(let i=0;i<=n;i++){const q=QM*i/n;c.lineTo(X(q),Y(lEnv(q)*lInt(q,lN,lA)));}c.lineTo(x1,y1);c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,1.8);c.stroke();
  pen(c,1.8,RED);c.setLineDash([5,4]);c.beginPath();for(let i=0;i<=300;i++){const q=QM*i/300;i?c.lineTo(X(q),Y(lEnv(q))):c.moveTo(X(q),Y(lEnv(q)));}c.stroke();c.setLineDash([]);
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  [[0.1,'10 Å'],[0.2,'5 Å'],[0.3,'3.3 Å'],[0.4,'2.5 Å'],[0.5,'2 Å']].forEach(([q,s2])=>{line(c,X(q),y1,X(q),y1+5,1.6);txt(c,s2,X(q),y1+16,fs-1,q===0.5?'right':'center');});
  txt(c,'scattering angle →   (labeled by the size of detail it reports on)',x0,y1+34,fs-1,'left');
  txt(c,narrow?'brightness (strongest spot = full height)':'brightness, with the strongest spot drawn full height',x0,y0-11,fs-1,'left');
  line(c,x1-(narrow?150:190),y0+13,x1-(narrow?128:165),y0+13,1.8,RED,[5,4]);txt(c,narrow?'one molecule alone':'the pattern of one molecule',x1-8,y0+13,fs-1,'right',RED);
  cap(c,'Why a crystal',12,18,'left',narrow?12:15);
},false);
function laUpd(){lN=+$('lN').value;lA=+$('lA').value;$('lNO').textContent=String(lN);$('lAO').textContent=lA+' Å';
  $('lB').textContent=lN===1?'the same':(lN*lN).toLocaleString('en-US')+' times';$('lW').textContent=lN===1?'no spots yet: a smooth blur':'1/'+lN+' of the gap between spots';
  $('lS').textContent=Math.floor(0.5*lA)+' out to 2 Å';latFig.w&&latFig.draw(latFig);}
['lN','lA'].forEach(id=>$(id).addEventListener('input',laUpd));laUpd();
}

// ---------- THE ROTATION METHOD: the lattice, the sphere and the detector ----------
if($('ewCv')){
const EMAX=16,DD=2.2,DH=1.17;                     // detector distance and half-height, in units of the sphere radius at the highest energy
let eA=10,eE=12.66,pts=null,gprev=null,phi=0,turned=0,nrec=0,img=null,imgG=null,imgKey='',lastT=0,flash=[];
const hashI=(h,k,l)=>{if(h<0||(h===0&&(k<0||(k===0&&l<0)))){h=-h;k=-k;l=-l;}let a=(h*73856093)^(k*19349663)^(l*83492791);a=(a^(a>>>13))>>>0;a=Math.imul(a,1274126177)>>>0;return ((a^(a>>>16))>>>0)/4294967296;};
function eInit(){const lam=12.398/eE,pm=2*Math.sin(0.5*Math.atan(DH*Math.SQRT2/DD))/lam,n=Math.ceil(pm*eA);pts=[];
  for(let h=-n;h<=n;h++)for(let k=-n;k<=n;k++)for(let l=-n;l<=n;l++){const p=Math.hypot(h,k,l)/eA;if(p<1e-9||p>pm)continue;pts.push({x:h/eA,y:k/eA,z:l/eA,k,I:Math.pow(hashI(h,k,l),2)*Math.exp(-6*p*p),a:false,b:false});}
  gprev=new Float32Array(pts.length).fill(NaN);nrec=0;turned=0;flash=[];imgKey='';}
const ewFig=fig('ewCv',w=>w<560?0.58:2.0,f=>{const {ctx:c,w,h,t}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  if(!pts)eInit();
  const U=narrow?w*0.3:w*0.17,S=U/(EMAX/12.398),lam=12.398/eE,R=S/lam,Cx=narrow?w*0.09:w*0.07,Cy=narrow?h*0.27:h*0.53,Ox=Cx+R,xd=Cx+DD*U,hd=DH*U;
  const fx=narrow?w*0.5:w*0.775,fy=narrow?h*0.74:h*0.53,fh=narrow?Math.min(w*0.42,h*0.22):hd,ks=fh/hd;
  // the kept image of the detector, face on
  const key=Math.round(fh)+'|'+eA+'|'+eE;if(key!==imgKey){img=document.createElement('canvas');const dpr=Math.min(window.devicePixelRatio||1,2);img.width=img.height=Math.round(2*fh*dpr);imgG=img.getContext('2d');imgG.setTransform(dpr,0,0,dpr,0,0);imgKey=key;pts.forEach(p=>{p.a=p.b=false;});nrec=0;turned=0;gprev.fill(NaN);}
  const g=imgG,dt=t-lastT;lastT=t;const adv=dt>0&&dt<0.2;if(adv){const dp=dt*0.21;phi+=dp;turned=Math.min(360,turned+dp*180/Math.PI);}
  const cp=Math.cos(phi),sp=Math.sin(phi),il=1/lam,lit=[];
  for(let i=0;i<pts.length;i++){const p=pts[i],x=p.x*cp+p.z*sp,z=-p.x*sp+p.z*cp,gz=z+il,gv=x*x+p.y*p.y+gz*gz-il*il;
    if(adv&&gprev[i]===gprev[i]&&(gv>0)!==(gprev[i]>0)&&gz>0){const X=DD*U*x/gz,Y=DD*U*p.y/gz;
      if(Math.abs(X)<hd&&Math.abs(Y)<hd){const up=x>0;if(!(up?p.a:p.b)){if(up)p.a=true;else p.b=true;nrec++;const r=0.8+2.4*Math.sqrt(p.I);g.fillStyle=INK;g.beginPath();g.arc(fh+X*ks,fh-Y*ks,r*(narrow?0.8:1),0,7);g.fill();}
        flash.push({X,Y,t,eq:p.k===0,x,z});}}
    gprev[i]=gv;if(p.k===0)lit.push([x,z]);}
  flash=flash.filter(q=>t-q.t<0.35);
  // seen from above: the beam, the crystal, the sphere, one layer of the lattice, the detector edge on
  line(c,Cx-(narrow?18:36),Cy,xd,Cy,2,BLUE,[6,5]);arrow(c,Cx-(narrow?18:36),Cy,Cx-8,Cy,BLUE,3,9);
  pen(c,2,'#7d8b96');c.beginPath();c.arc(Cx,Cy,R,0,7);c.stroke();
  c.fillStyle='rgba(27,27,27,0.55)';lit.forEach(([x,z])=>{c.beginPath();c.arc(Ox+z*S,Cy-x*S,narrow?1.3:1.9,0,7);c.fill();});
  flash.forEach(q=>{if(!q.eq)return;c.globalAlpha=1-(t-q.t)/0.35;line(c,Cx,Cy,xd,Cy-q.X,2,ORG);disc(c,Ox+q.z*S,Cy-q.x*S,narrow?3.5:5,ORG,1.4);c.globalAlpha=1;});
  rectF(c,xd-3,Cy-hd,6,2*hd,'#6b7f93',1.6);
  c.save();c.translate(Cx,Cy);c.rotate(-phi);poly(c,[[0,-8],[8,0],[0,8],[-8,0]],GRN,2);c.restore();
  disc(c,Ox,Cy,3,INK,1);
  txt(c,'crystal',Cx,Cy+(narrow?20:22),fs-1,'center');txt(c,narrow?'detector':'detector, edge on',xd,Cy+hd+13,fs-1,narrow?'right':'center');
  txt(c,narrow?'its lattice of spots':'its lattice of spots, turning with it',narrow?Cx:Ox,Cy+(narrow?hd-6:R+17),fs-1,narrow?'left':'center',MUT);
  // the detector, face on
  rectF(c,fx-fh,fy-fh,2*fh,2*fh,WHITE,2.5);c.drawImage(img,fx-fh,fy-fh,2*fh,2*fh);
  flash.forEach(q=>{c.globalAlpha=1-(t-q.t)/0.35;disc(c,fx+q.X*ks,fy-q.Y*ks,narrow?3.5:5,ORG,1.2);c.globalAlpha=1;});
  line(c,fx-fh,fy,fx-3,fy,narrow?2:3,'#8c979f');disc(c,fx,fy,narrow?3:4,'#8c979f',1);pen(c,2.5);c.strokeRect(fx-fh,fy-fh,2*fh,2*fh);
  txt(c,'the detector, face on: every spot recorded so far',fx,fy+fh+14,fs-1,'center');
  cap(c,narrow?'Seen from above':'Seen from above: only spots on the circle diffract',12,18,'left',narrow?12:15);
  setT('eN',nrec.toLocaleString('en-US'));setT('eT',turned>=360?'a full turn':Math.floor(turned)+'°');
});
function ewUpd(){eA=+$('eA').value;eE=+$('eE').value;$('eAO').textContent=eA+' Å';$('eEO').textContent=eE.toFixed(2)+' keV';
  $('eD').textContent=(12.398/eE/(2*Math.sin(0.5*Math.atan(DH/DD)))).toFixed(2)+' Å';eInit();ewFig.w&&ewFig.draw(ewFig);}
['eA','eE'].forEach(id=>$(id).addEventListener('input',ewUpd));$('eR').addEventListener('click',ewUpd);ewUpd();
}

// ---------- EACH SPOT IS ONE WAVE: building the density from its waves ----------
if($('fouCv')){
const FA=20,FH=20,FAT=[[3.0,6],[4.5,8],[8.0,6],[11.2,7],[15.5,16]],FOT=[[2.2,8],[6.4,6],[9.6,16],[13.0,6],[17.1,7]];
const sf=at=>{const F=[];for(let h=0;h<=FH;h++){let re=0,im=0;at.forEach(([x,z])=>{const g=z*Math.exp(-2*(h/FA)*(h/FA));re+=g*Math.cos(2*Math.PI*h*x/FA);im+=g*Math.sin(2*Math.PI*h*x/FA);});F.push([Math.hypot(re,im),Math.atan2(im,re)]);}return F;};
const FT=sf(FAT),FO=sf(FOT),FR=(()=>{const r=rng(77);return FT.map(()=>r()*2*Math.PI);})();
let fN=4,fMode='true';
const fPh=h=>fMode==='true'?FT[h][1]:fMode==='zero'?0:fMode==='rand'?FR[h]:FO[h][1];
const fRho=(x,N,ph)=>{let s=FT[0][0]/FA;for(let h=1;h<=N;h++)s+=2/FA*FT[h][0]*Math.cos(2*Math.PI*h*x/FA-ph(h));return s;};
const fouFig=fig('fouCv',w=>w<560?0.8:2.1,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const x0=w*0.05,x1=w*0.97,y0=h*0.14,y1=h*0.56,b0=h*0.68,b1=h*0.88,X=x=>x0+x/FA*(x1-x0),n=narrow?240:500;
  let mx=0;for(let i=0;i<=n;i++)mx=Math.max(mx,fRho(FA*i/n,FH,h2=>FT[h2][1]));const Y=v=>y1-(y1-y0)*(0.13+0.66*v/mx);
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);line(c,x0,Y(0),x1,Y(0),1,GREY);
  // the true density, the newest wave, and the density built so far
  c.beginPath();c.moveTo(x0,Y(0));for(let i=0;i<=n;i++){const x=FA*i/n;c.lineTo(X(x),Y(fRho(x,FH,h2=>FT[h2][1])));}c.lineTo(x1,Y(0));c.closePath();c.fillStyle=LTGRN;c.fill();
  if(fN>0){pen(c,1.6,ORG);c.beginPath();for(let i=0;i<=n;i++){const x=FA*i/n,v=2/FA*FT[fN][0]*Math.cos(2*Math.PI*fN*x/FA-fPh(fN));i?c.lineTo(X(x),Y(v)):c.moveTo(X(x),Y(v));}c.stroke();}
  pen(c,2.4);c.beginPath();for(let i=0;i<=n;i++){const x=FA*i/n,v=fRho(x,fN,fPh);i?c.lineTo(X(x),Math.max(y0+2,Math.min(y1-2,Y(v)))):c.moveTo(X(x),Math.max(y0+2,Math.min(y1-2,Y(v))));}c.stroke();
  (fMode==='other'?FOT:FAT).forEach(([x,z])=>{if(fMode==='other'){pen(c,2,PUR);c.beginPath();c.arc(X(x),y1+9,narrow?4:5,0,7);c.stroke();}});
  FAT.forEach(([x,z])=>disc(c,X(x),y1+9,narrow?3+z/6:4+z/5,z===16?YEL:z===8?RED:z===7?BLUE:'#5d6a73',1.5));
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  txt(c,narrow?'green: true density.  black: built so far':'green: the true density.   black: built from the spots so far.   orange: the last wave added',x0+8,y0+13,fs-1,'left');
  // the spots: one bar each
  const bw=(x1-x0)/FH,am=Math.max(...FT.slice(1).map(q=>q[0]));
  for(let hh=1;hh<=FH;hh++){const bx=x0+(hh-1)*bw+bw*0.18,bh=(b1-b0)*FT[hh][0]/am;rectF(c,bx,b1-bh,bw*0.64,bh,hh===fN?ORG:hh<=fN?'#5d6a73':WHITE,1.5);
    if(!narrow||hh%2===0||hh===1)txt(c,(FA/hh).toFixed(FA/hh<10&&FA%hh?1:0),bx+bw*0.32,b1+13,fs-2,'center');}
  txt(c,'strength of each spot, labeled by the spacing of its wave (Å)',x0,b0-12,fs-1,'left');
  cap(c,'Every spot adds one wave',12,18,'left',narrow?12:15);
},false);
function foUpd(){fN=+$('fN').value;$('fNO').textContent=fN===0?'none':fN+(fN===1?' spot':' spots');$('fR').textContent=fN===0?'no detail at all':(FA/fN).toFixed(FA/fN<10?1:0)+' Å';
  let sxy=0,sxx=0,syy=0,mx2=0,my=0;const N=200,a=[],b=[];for(let i=0;i<N;i++){const x=FA*i/N;a.push(fRho(x,FH,h=>FT[h][1]));b.push(fRho(x,fN,fPh));mx2+=a[i];my+=b[i];}mx2/=N;my/=N;
  for(let i=0;i<N;i++){sxy+=(a[i]-mx2)*(b[i]-my);sxx+=(a[i]-mx2)**2;syy+=(b[i]-my)**2;}const cc=syy<1e-12?0:sxy/Math.sqrt(sxx*syy);
  $('fC').textContent=(100*cc).toFixed(0).replace('-','−')+'%';$('fP').textContent={true:'the right ones',zero:'all set to zero',rand:'random',other:'from a different molecule'}[fMode];fouFig.w&&fouFig.draw(fouFig);}
$('fN').addEventListener('input',foUpd);
[['fBt','true'],['fBz','zero'],['fBr','rand'],['fBo','other']].forEach(([id,m])=>$(id).addEventListener('click',()=>{fMode=m;['fBt','fBz','fBr','fBo'].forEach(q=>$(q).setAttribute('aria-pressed',String(q===id)));foUpd();}));foUpd();
}

// ---------- THE MAP AND THE MODEL ----------
if($('mapCv')){
let pD=2,pS=0.4,pM=true,pWire=true;
const mapFig=fig('mapCv',w=>w<560?1.05:2.2,f=>{const {ctx:c,w,h}=f;bg(c,w,h,WHITE);const narrow=w<560,y0=narrow?26:8,H=h-y0-8;
  drawMap(c,0,y0,w,H,pD,narrow?3:4,pS,pWire);if(pM)drawMol(c,0,y0,w,H);cap(c,'The map at '+pD.toFixed(1)+' Å',12,18,'left',narrow?12:15);
},false);
// the slider runs from low resolution on the left (6 Å) to high on the right (1 Å), so its own value is minus the resolution
function mpUpd(){pD=-$('pD').value;$('pD').setAttribute('aria-valuetext',pD.toFixed(1)+' ångströms');pS=+$('pS').value/100;$('pDO').textContent=pD.toFixed(1)+' Å';$('pSO').textContent=Math.round(pS*100)+'% of the highest peak';
  $('pW').textContent=pD<=1.3?'separate atoms':pD<=2.0?'the rings, with holes in them':pD<=3.0?'the shape of each side chain':pD<=4.2?'the helix, with lumps for its side chains':'a blob the size of the helix';
  mapFig.w&&mapFig.draw(mapFig);}
['pD','pS'].forEach(id=>$(id).addEventListener('input',mpUpd));
[['pWm',true],['pWo',false]].forEach(([id,v])=>$(id).addEventListener('click',()=>{pWire=v;$('pWm').setAttribute('aria-pressed',String(v));$('pWo').setAttribute('aria-pressed',String(!v));mpUpd();}));
$('pB').addEventListener('click',()=>{pM=!pM;$('pB').setAttribute('aria-pressed',String(pM));mpUpd();});mpUpd();
}

// ---------- A WRONG MODEL AND ITS DIFFERENCE MAP ----------
// The same piece of myoglobin as in the map figure, at 2 Å, with one amino acid of the model built wrongly: a ring or a whole side chain
// turned about one of its bonds, or atoms left out. The difference density is the map of the true atoms less the map of the model's atoms.
// Atoms the two share cancel exactly, so only the atoms that differ are summed: the true ones with their weight, the model's with the opposite sign.
if($('difCv')){
const H=MB.hel;
// turn a point about the line from a to b
const spin=(p,a,b,ang)=>{const k=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],n=Math.hypot(k[0],k[1],k[2]),u=k.map(v=>v/n),v=[p[0]-a[0],p[1]-a[1],p[2]-a[2]],cs=Math.cos(ang),sn=Math.sin(ang),d=u[0]*v[0]+u[1]*v[1]+u[2]*v[2],
  cr=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];return [0,1,2].map(i=>a[i]+v[i]*cs+cr[i]*sn+u[i]*d*(1-cs)).concat(p[3]);};
// the amino acids of the piece: name, number, and how many atoms each has. In the file each starts N, CA, C, O, CB, and the side chain follows
const RES=[['glutamate',4,9],['glycine',5,4],['glutamate',6,9],['tryptophan',7,14],['glutamine',8,9],['leucine',9,8],['valine',10,7],['leucine',11,8],['histidine',12,10],['valine',13,7],['tryptophan',14,14],['alanine',15,5],['lysine',16,9]];
{let s=0;RES.forEach(r=>{r.push(s);s+=r[2];});}
const byNo=n=>RES.find(r=>r[1]===n);
// which amino acids each kind of mistake can be made in, and the one shown first
const KIND={flip:{ok:r=>r[0]==='tryptophan',first:7,val:180,ax:[4,5],from:6},     // about the bond from CB to CG: the ring turns over
  turn:{ok:r=>r[2]>5,first:12,val:120,ax:[1,4],from:5},                                              // about the bond from CA to CB: the whole side chain swings
  miss:{ok:r=>r[2]>5,first:16,val:0,from:5}};                                                          // atoms past CB left out
let dKind='flip',dRes=7,dVal=180,dDrag=false,dGeo=null;
const toAt=p=>({x:p[0],y:-p[1],w:p[2],z:p[3]});
// the model for the present choice, the atoms that differ, and whether anything is wrong
function dModel(){const r=byNo(dRes),K=KIND[dKind],s=r[3],ids=[];for(let i=s+K.from;i<s+r[2];i++)ids.push(i);
  const model=H.slice(),pos=[];let wrong=false;
  if(dKind==='miss'){ids.forEach((i,n)=>{if(n>=dVal){model[i]=null;pos.push(toAt(H[i]));wrong=true;}});return {model,pos,neg:null,wrong,ax:null};}
  const ang=dVal*Math.PI/180,a=H[s+K.ax[0]],b=H[s+K.ax[1]];wrong=dVal%360!==0;
  if(wrong)ids.forEach(i=>{model[i]=spin(H[i],a,b,ang);pos.push(toAt(H[i]));const m=toAt(model[i]);m.z=-m.z;pos.push(m);});
  return {model,pos,neg:pos.map(q=>({x:q.x,y:q.y,w:q.w,z:-q.z})),wrong,ax:[a,b]};}
const difFig=fig('difCv',w=>w<560?0.84:2.2,f=>{const {ctx:c,w,h}=f;bg(c,w,h,WHITE);const narrow=w<560,fs=narrow?12:15,y0=narrow?26:8,Hh=h-y0-8,q=dModel(),key=dKind+dRes+'_'+dVal;
  const m=drawMap(c,0,y0,w,Hh,2,narrow?3:4,0.4,true,{atoms:MOL.at,key:'pale',col:'#a9c4e6',lw:1}),L=0.3*m.top;
  if(q.wrong){drawMap(c,0,y0,w,Hh,2,narrow?3:4,0.4,true,{atoms:q.pos,key:key+'+',col:'#1f9d55',L,lw:1.5});
    if(q.neg)drawMap(c,0,y0,w,Hh,2,narrow?3:4,0.4,true,{atoms:q.neg,key:key+'-',col:RED,L,lw:1.5});}
  // the model
  const sc=mapScale(w,Hh),cx=w/2-MAPC[0]*sc,cy=y0+Hh/2+MAPC[1]*sc,X=p=>[cx+p[0]*sc,cy-p[1]*sc],P=q.model.map(p=>p&&X(p).concat(p[3]));
  MB.helBonds.forEach(([i,j])=>{if(P[i]&&P[j])line(c,P[i][0],P[i][1],P[j][0],P[j][1],Math.max(1.6,sc*0.09));});
  P.forEach(p=>{if(p)disc(c,p[0],p[1],Math.max(2.2,sc*0.17),atomCol(p[2]),1.2);});
  // the dial on the bond that the atoms turn about: drag its knob
  dGeo=null;
  if(q.ax){const A=X(q.ax[0]),B=X(q.ax[1]),mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2,R=narrow?20:27,ang=dVal*Math.PI/180-Math.PI/2,kx=mx+R*Math.cos(ang),ky=my+R*Math.sin(ang);
    line(c,A[0],A[1],B[0],B[1],Math.max(3,sc*0.16),ORG);
    pen(c,dDrag?2.6:1.8,ORG);c.setLineDash([5,4]);c.beginPath();c.arc(mx,my,R,0,7);c.stroke();c.setLineDash([]);
    line(c,mx,my-R-5,mx,my-R+5,2,ORG);                                    // the mark for the right position, at the top
    disc(c,kx,ky,narrow?7:8.5,ORG,2);
    dGeo={mx,my,R};
}
  cap(c,'The model, and the difference map',12,18,'left',narrow?12:15);
  // the key
  const kx=narrow?w*0.03:w*0.025,ky=h-(narrow?46:54)-(q.ax?fs+5:0),row=(i,col,s)=>{line(c,kx,ky+i*(fs+5),kx+22,ky+i*(fs+5),2.4,col);txt(c,s,kx+29,ky+i*(fs+5)+1,fs,'left');};
  row(0,'#1f9d55','green: the data want more here');row(1,RED,'red: the data want less here');row(2,'#a9c4e6','pale blue: the map');if(q.ax)row(3,ORG,'orange: drag the knob to turn');
},false);
const dCtl=id=>$(id).closest('.ctl');
function dfUpd(){const r=byNo(dRes),miss=dKind==='miss',n=r[2]-5,q=dModel();
  dCtl('dfT').style.display=miss?'none':'';dCtl('dfN').style.display=miss?'':'none';
  if(miss){$('dfN').max=n;$('dfN').value=dVal;setT('dfNO',dVal+' of '+n);}else{$('dfT').value=dVal;setT('dfTO',dVal+'°');}
  setT('dfS',!q.wrong?'nothing: the model accounts for the density':dKind==='flip'?'the ring is in the right place but turned. Turn it until the red and green are gone':dKind==='turn'?'the side chain points the wrong way. Swing it into the green':'atoms are missing from the model. Build them into the green');
  setT('dfW',r[0]+' '+r[1]);
  difFig.w&&difFig.draw(difFig);}
function dfKind(k){dKind=k;const K=KIND[k],sel=$('dfR');sel.innerHTML='';RES.filter(K.ok).forEach(r=>{const o=document.createElement('option');o.value=r[1];o.textContent=r[0][0].toUpperCase()+r[0].slice(1)+' '+r[1];sel.appendChild(o);});
  if(!K.ok(byNo(dRes)))dRes=K.first;sel.value=dRes;dVal=K.val;
  [['dfA','flip'],['dfB','turn'],['dfC','miss']].forEach(([id,v])=>$(id).setAttribute('aria-pressed',String(v===k)));dfUpd();}
[['dfA','flip'],['dfB','turn'],['dfC','miss']].forEach(([id,k])=>$(id).addEventListener('click',()=>{dRes=KIND[k].first;dfKind(k);}));
$('dfR').addEventListener('change',()=>{dRes=+$('dfR').value;dVal=KIND[dKind].val;dfUpd();});
$('dfT').addEventListener('input',()=>{dVal=+$('dfT').value;dfUpd();});
$('dfN').addEventListener('input',()=>{dVal=+$('dfN').value;dfUpd();});
$('dfD').addEventListener('click',()=>{dVal=dKind==='miss'?byNo(dRes)[2]-5:0;dfUpd();});
// dragging the knob of the dial
{const cv=$('difCv'),pos=e=>{const b=cv.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top];},near=e=>{if(!dGeo)return false;const [x,y]=pos(e);return Math.abs(Math.hypot(x-dGeo.mx,y-dGeo.my)-dGeo.R)<16||Math.hypot(x-dGeo.mx,y-dGeo.my)<dGeo.R;};
  const set=e=>{const [x,y]=pos(e);let d=Math.round((Math.atan2(y-dGeo.my,x-dGeo.mx)*180/Math.PI+90+360)%360/5)*5;if(d>=360)d=0;dVal=d;dfUpd();};
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{if(!near(e))return;dDrag=true;cv.setPointerCapture(e.pointerId);set(e);e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(dDrag)set(e);else cv.style.cursor=near(e)?'grab':'';});
  const stop=()=>{if(dDrag){dDrag=false;dfUpd();}};cv.addEventListener('pointerup',stop);cv.addEventListener('pointercancel',stop);}
dfKind('flip');
}

// ---------- REFINEMENT: move the atoms until the model explains the spots ----------
if($('refCv')){
const RA=20,RH=15,RZ=[8,6,7,6],RT=[3.2,7.9,12.4,16.1],FREE=[3,8,12],RS=[2.6,8.6,11.8,16.8];
let rx=RS.slice(),rDrag=-1,rAuto=false,rIt=0;
const rsf=xs=>{const F=[];for(let h=1;h<=RH;h++){let re=0,im=0;xs.forEach((x,i)=>{const g=RZ[i]*Math.exp(-4*(h/RA)*(h/RA));re+=g*Math.cos(2*Math.PI*h*x/RA);im+=g*Math.sin(2*Math.PI*h*x/RA);});F.push([Math.hypot(re,im),Math.atan2(im,re)]);}return F;};
// the measured strengths: those of the true structure, with a few percent of noise
const RFO=(()=>{const r=rng(5);return rsf(RT).map(q=>Math.max(0,q[0]*(1+0.046*(r()+r()+r()-1.5))));})();
// distance of the model from the truth. The spots cannot tell a structure from the same one slid along the line or mirrored,
// or with its two carbon atoms exchanged, so those are allowed for
function rErr(xs){let best=1e9;for(const sg of[1,-1])for(const pm of[[0,1,2,3],[0,3,2,1]]){const d=xs.map((x,i)=>(x-sg*RT[pm[i]])*2*Math.PI/RA),s0=Math.atan2(d.reduce((a,v)=>a+Math.sin(v),0),d.reduce((a,v)=>a+Math.cos(v),0));
  best=Math.min(best,Math.sqrt(d.reduce((a,v)=>{const u=Math.atan2(Math.sin(v-s0),Math.cos(v-s0))*RA/(2*Math.PI);return a+u*u;},0)/xs.length));}return best;}
// the scale of the difference map is held at half the size it has for the opening model, so that a good model shows as a flat map
const RDM=(()=>{const F=rsf(RS);let m=0;for(let i=0;i<=200;i++){const x=RA*i/200;let v=0;F.forEach((q,j)=>{v+=2/RA*(RFO[j]-q[0])*Math.cos(2*Math.PI*(j+1)*x/RA-q[1]);});m=Math.max(m,Math.abs(v));}return m*0.5;})();
function rStat(xs){const F=rsf(xs);let a=0,b=0,fa=0,fb=0;F.forEach((q,i)=>{const d=Math.abs(RFO[i]-q[0]);if(FREE.includes(i+1)){fa+=d;fb+=RFO[i];}else{a+=d;b+=RFO[i];}});
  return {F,R:a/b,Rf:fa/fb,err:rErr(xs)};}
const rTarget=xs=>{const F=rsf(xs);let s=0;F.forEach((q,i)=>{if(!FREE.includes(i+1))s+=(RFO[i]-q[0])**2;});return s;};
const refFig=fig('refCv',w=>w<560?0.85:2.1,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15,st=rStat(rx);
  if(rAuto){for(let it=0;it<3;it++){const g=rx.map((x,i)=>{const a=rx.slice(),b=rx.slice();a[i]+=0.01;b[i]-=0.01;return (rTarget(a)-rTarget(b))/0.02;}),gm=Math.hypot(...g);if(gm<0.02||++rIt>1500){rAuto=false;break;}rx=rx.map((x,i)=>x-Math.min(0.03,0.003*gm)*g[i]/gm);}rShow();}
  const x0=w*0.05,x1=w*0.97,y0=h*0.17,y1=h*0.5,ya=y1+(narrow?14:17),b0=h*0.7,b1=h*0.88,X=x=>x0+x/RA*(x1-x0),n=narrow?220:420;
  refFig.geo={x0,x1,ya};
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);const ym=(y0+y1)/2,dif=x=>{let s=0;st.F.forEach((q,i)=>{s+=2/RA*(RFO[i]-q[0])*Math.cos(2*Math.PI*(i+1)*x/RA-q[1]);});return s;};
  let dm=RDM;const dv=[];for(let i=0;i<=n;i++){const v=dif(RA*i/n);dv.push(v);dm=Math.max(dm,Math.abs(v));}
  const Y=v=>ym-(y1-y0)*0.44*v/dm;
  [[1,GRN,LTGRN],[-1,RED,LTRED]].forEach(([sg,col,fill])=>{c.beginPath();c.moveTo(x0,ym);for(let i=0;i<=n;i++)c.lineTo(x0+(x1-x0)*i/n,Y(sg>0?Math.max(0,dv[i]):Math.min(0,dv[i])));c.lineTo(x1,ym);c.closePath();c.fillStyle=fill;c.fill();pen(c,1.6,col);c.stroke();});
  line(c,x0,ym,x1,ym,1.2,'#7d8b96');pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);
  txt(c,narrow?'difference map: green, add; red, remove':'difference map.   green: the data want more density here.   red: less',x0,y0-11,fs-1,'left');
  // the model atoms, which can be dragged
  line(c,x0,ya,x1,ya,2);rx.forEach((x,i)=>{disc(c,X(x),ya,narrow?8:10,RZ[i]===8?RED:RZ[i]===7?BLUE:'#5d6a73',2);});
  txt(c,narrow?'drag the atoms':'the model: drag the atoms along the line',x0,ya+(narrow?20:24),fs-1,'left');
  // observed against calculated
  const bw=(x1-x0)/RH,am=Math.max(...RFO);
  for(let hh=1;hh<=RH;hh++){const bx=x0+(hh-1)*bw,fr=FREE.includes(hh),ho=(b1-b0)*RFO[hh-1]/am,hc=(b1-b0)*Math.min(1.25,st.F[hh-1][0]/am);
    rectF(c,bx+bw*0.14,b1-ho,bw*0.36,ho,fr?LTORG:LTBLUE,1.5);rectF(c,bx+bw*0.5,b1-hc,bw*0.36,hc,'#5d6a73',1.5);if(fr)txt(c,narrow?'f':'free',bx+bw*0.5,b1+12,fs-2,'center','#b8641a');}
  txt(c,narrow?'spots: measured (pale), from model (dark)':'each spot: measured (pale) beside calculated from the model (dark).   orange: set aside for R-free',x0,b0-12,fs-1,'left');
  cap(c,'Refinement by hand',12,18,'left',narrow?12:15);
});
function rShow(){const st=rStat(rx);setT('rR',(100*st.R).toFixed(1)+'%');setT('rF',(100*st.Rf).toFixed(1)+'%');setT('rE',st.err.toFixed(2)+' Å');}
{const cv=refFig.cv,at=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];},toX=px=>{const g=refFig.geo;return Math.max(0.3,Math.min(RA-0.3,(px-g.x0)/(g.x1-g.x0)*RA));};
  const near=(x,y)=>{const g=refFig.geo;if(!g||Math.abs(y-g.ya)>26)return -1;let b=-1,bd=24;rx.forEach((v,i)=>{const d=Math.abs(g.x0+v/RA*(g.x1-g.x0)-x);if(d<bd){bd=d;b=i;}});return b;};
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{const [x,y]=at(e),i=near(x,y);if(i>=0){rDrag=i;rAuto=false;try{cv.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();}});
  cv.addEventListener('pointermove',e=>{const [x,y]=at(e);if(rDrag>=0){rx[rDrag]=toX(x);rShow();refFig.draw(refFig);}cv.style.cursor=rDrag>=0||near(x,y)>=0?'ew-resize':'default';});
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>cv.addEventListener(n,()=>{rDrag=-1;}));}
$('rBa').addEventListener('click',()=>{rAuto=true;rIt=0;refFig.draw(refFig);});
$('rBs').addEventListener('click',()=>{const r=rng(Date.now()&0xffff);rAuto=false;rx=RT.map(x=>Math.max(0.5,Math.min(RA-0.5,x-0.4+(r()-0.5)*1.2)));rShow();refFig.draw(refFig);});
$('rBw').addEventListener('click',()=>{rAuto=false;rx=[RT[1]+0.3,RT[0]-0.4,RT[3]+0.2,RT[2]-0.3];rShow();refFig.draw(refFig);});
rShow();
}

// ---------- RADIATION DAMAGE: the finest detail fades first ----------
if($('doseCv')){
const DSP=(()=>{const r=rng(4),s=[];for(let i=-13;i<=13;i++)for(let j=-13;j<=13;j++){const x=i+0.5*(j&1),y=j*0.87,q=Math.hypot(x,y)/13;if(q<0.1||q>1)continue;s.push({x:x/13,y:y/13,q,I:Math.pow(r(),2)*Math.exp(-2.2*q*q)});}return s;})();
const DE=1.5;let dD=0;                                  // resolution at the edge of the picture, in angstroms
const dHalf=d=>10*d, dKeep=(d,D)=>Math.pow(0.5,D/dHalf(d));
const doseFig=fig('doseCv',w=>w<560?0.95:2.3,f=>{const {ctx:c,w,h}=f;bg(c,w,h);const narrow=w<560, fs=narrow?12:15;
  const cx=narrow?w*0.5:w*0.27,cy=narrow?h*0.39:h*0.54,R=narrow?Math.min(w*0.4,h*0.27):h*0.4;
  disc(c,cx,cy,R,WHITE,2.5);
  [6,3,2,1.5].forEach(d=>{const r=R*DE/d;pen(c,1,'#aab4bb');c.setLineDash([3,4]);c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();c.setLineDash([]);txt(c,d+' Å',cx+r*0.707+3,cy-r*0.707-3,fs-2,'left',MUT);});
  DSP.forEach(s=>{const d=DE/s.q,k=dKeep(d,dD),v=s.I*k;if(v<0.004)return;c.fillStyle=`rgba(27,27,27,${Math.min(1,0.25+2.2*Math.sqrt(v))})`;c.beginPath();c.arc(cx+s.x*R,cy+s.y*R,(narrow?0.7:1)*(0.8+3*Math.sqrt(v)),0,7);c.fill();});
  disc(c,cx,cy,narrow?3:4,'#8c979f',1);
  // what is left at each resolution
  const x0=narrow?w*0.12:w*0.58,x1=w*0.96,y0=narrow?h*0.74:h*0.2,y1=narrow?h*0.92:h*0.8,X=q=>x0+q*(x1-x0),Y=v=>y1-(y1-y0)*v;
  rectF(c,x0,y0,x1-x0,y1-y0,WHITE,2.5);c.beginPath();c.moveTo(x0,y1);for(let i=1;i<=100;i++){const q=i/100;c.lineTo(X(q),Y(dKeep(DE/q,dD)));}c.lineTo(x1,y1);c.closePath();c.fillStyle=LTYEL;c.fill();pen(c,2);c.stroke();
  line(c,x0,Y(0.5),x1,Y(0.5),1,'#7d8b96',[4,4]);txt(c,'half',x0-5,Y(0.5),fs-1,'right');txt(c,'all',x0-5,y0+4,fs-1,'right');
  [6,3,2,1.5].forEach(d=>{line(c,X(DE/d),y1,X(DE/d),y1+5,1.6);txt(c,d+' Å',X(DE/d),y1+15,fs-1,d===1.5?'right':'center');});
  pen(c,2.5);c.strokeRect(x0,y0,x1-x0,y1-y0);txt(c,narrow?'brightness left, by detail':'brightness left in the spots, by the detail they carry',x0,y0-12,fs-1,'left');
  cap(c,'The pattern after '+dD.toFixed(0)+' MGy',12,18,'left',narrow?12:15);
},false);
function dsUpd(){dD=+$('dD').value;$('dDO').textContent=dD.toFixed(0)+' MGy';$('dH').textContent=dD<1?'none yet':'everything finer than '+(dD/10).toFixed(1)+' Å';
  $('d2').textContent=(100*dKeep(2,dD)).toFixed(0)+'%';$('dL').textContent=dD<=30?Math.round(dD/30*100)+'% of it':'past it, by '+(dD/30).toFixed(1)+' times';doseFig.w&&doseFig.draw(doseFig);}
$('dD').addEventListener('input',dsUpd);dsUpd();
}

// ---------- shared: read-out labels in capitals, and the button that opens every equation ----------
function capK(){document.querySelectorAll('.ro .k').forEach(el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))n.nodeValue=n.nodeValue.replace(/[a-z]/g,ch=>ch.toUpperCase());});}
capK();
const eqBtn=$('eqAll');let eqOpen=false;
function setEq(o){eqOpen=o;document.querySelectorAll('details.eqcard').forEach(d=>d.open=o);eqBtn.textContent=o?'Close all equations':'Open all equations';eqBtn.setAttribute('aria-pressed',String(o));try{localStorage.setItem('necat-guide-eq',o?'1':'0');}catch(e){}}
eqBtn.addEventListener('click',()=>setEq(!eqOpen));
try{if(localStorage.getItem('necat-guide-eq')==='1')setEq(true);}catch(e){}
})();
