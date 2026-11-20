import sys,json,numpy as np,collections
F=sys.argv[1]
ca=collections.defaultdict(list);hel=collections.defaultdict(list);sh=collections.defaultdict(list);hem=collections.defaultdict(list)
for l in open(F):
    p=l.rstrip('\n').split('|')
    if p[1]=='CA':
        x,y,z=float(p[5][0:8]),float(p[5][8:16]),float(p[5][16:24]);ca[(p[0],p[2])].append((int(p[3][:4]),[x,y,z]))
    elif p[1]=='HEM':
        x,y,z=float(p[4][0:8]),float(p[4][8:16]),float(p[4][16:24]);hem[(p[0],p[2])].append((p[3].strip(),[x,y,z]))
    elif p[1].startswith('HELIX'):
        r=p[1];hel[(p[0],r[19])].append((int(r[21:25]),int(r[33:37])))
    elif p[1].startswith('SHEET'):
        r=p[1];sh[(p[0],r[21])].append((int(r[22:26]),int(r[33:37])))
def build(e,chains,orient=None,K=None):
    pts=np.array([q for c in chains for _,q in ca[(e,c)]]);cen=pts.mean(0)
    hp=[np.array([q for _,q in hem[(e,c)]]) for c in chains if (e,c) in hem]
    u,s,vt=np.linalg.svd(pts-cen,full_matrices=False);R=vt.copy()
    if np.linalg.det(R)<0:R[2]*=-1
    tf=lambda a:(np.asarray(a)-cen)@R.T
    if orient:
        v=orient(lambda c,lo,hi:tf([q for n,q in ca[(e,c)] if lo<=n<=hi]).mean(0))[:2]
        a=np.arctan2(v[1],v[0]);t=-np.pi/2-a;c_,s_=np.cos(t),np.sin(t);R2=np.array([[c_,-s_,0],[s_,c_,0],[0,0,1]]);R=R2@R
    allp=tf(pts);mn,mx=allp.min(0),allp.max(0);mid=(mn+mx)/2
    out={'w':round(float(mx[0]-mn[0])+4,1),'h':round(float(mx[1]-mn[1])+4,1),'zr':round(float(max(mx[2],-mn[2])),1),'ch':[],'hem':[]}
    for c in chains:
        A=ca[(e,c)];P=tf([q for _,q in A])-mid*[1,1,0];ss=''
        for n,_ in A:
            ss+='H' if any(a<=n<=b for a,b in hel[(e,c)]) else 'E' if any(a<=n<=b for a,b in sh[(e,c)]) else '-'
        # break where the chain has a gap
        seg=[0]
        for i in range(1,len(P)):
            if np.linalg.norm(P[i]-P[i-1])>4.4:seg.append(i)
        out['ch'].append({'p':[int(round(v*10)) for v in P.flatten()],'s':ss,'g':seg[1:]})
    for c in chains:
        if (e,c) in hem:
            H=hem[(e,c)];Q=tf([q for _,q in H])-mid*[1,1,0];names=[n for n,_ in H];b=[]
            for i in range(len(H)):
                for j in range(i+1,len(H)):
                    d=np.linalg.norm(Q[i]-Q[j]);lim=2.25 if 'FE' in (names[i],names[j]) else 1.75
                    if d<lim and not names[i].startswith('O') and not names[j].startswith('O'):b.append([i,j])
            out['hem'].append({'p':[int(round(v*10)) for v in Q.flatten()],'b':b,'fe':names.index('FE')})
    print(e,chains,out['w'],out['h'],out['zr'],[ (len(c['s']),c['s'].count('H'),c['s'].count('E'),c['g']) for c in out['ch']],len(out['hem']),file=sys.stderr)
    return out
PX={'ins':build('4INS',['A','B']),'lys':build('2LZT',['A']),'hb':build('4HHB',['A','B','C','D']),
    'igg':build('1IGT',['A','B','C','D'],orient=lambda cen:(cen('B',350,600)+cen('D',350,600))/2-(cen('A',1,300)+cen('C',1,300))/2)}
open(sys.argv[2],'w').write('// Chains of four proteins for the guide "What is a protein?", from the Protein Data Bank: insulin (entry 4INS, chains A and B),\n// lysozyme (2LZT), hemoglobin (4HHB) and an antibody (1IGT). For each chain: p, the central carbon of every amino acid as x, y, z in tenths of an\n// angstrom, turned so that the widest view faces the reader; s, H for helix, E for strand, from the HELIX and SHEET records; g, where the chain has a gap.\n// hem: the atoms of each heme (oxygen atoms left out), the bonds between them, and which atom is the iron. Made by mkprot.py from the entries.\nconst PX='+json.dumps(PX,separators=(',',':'))+';\n')
