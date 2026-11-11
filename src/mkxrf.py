# builds xrf.json: edges, lines, yields and fitted fluorescence cross-sections (barn per atom, into all directions) from xraylib
import xraylib as x, math, json, numpy as np
NA=6.02214076e23
AIR='Air, Dry (near sea level)'; RHO_AIR=1.205e-3
def pa(Z,cs): return cs*x.AtomicWeight(Z)/NA*1e24
def mu_air(E): return x.CS_Total_CP(AIR,E)*RHO_AIR/10      # per mm
def mu_wat(E): return x.CS_Total_CP('H2O',E)*1.0/1e4       # per micron
def cs(Z,line,E):
    try: return pa(Z,x.CS_FluorLine_Kissel(Z,line,E))
    except Exception: return 0.0
K=[('C','carbon'),('N','nitrogen'),('O','oxygen'),('P','phosphorus'),('S','sulfur'),('Cl','chlorine'),('K','potassium'),('Ca','calcium'),
   ('Mn','manganese'),('Fe','iron'),('Co','cobalt'),('Ni','nickel'),('Cu','copper'),('Zn','zinc'),('As','arsenic'),('Se','selenium'),('Br','bromine'),('Kr','krypton'),('Rb','rubidium'),('Sr','strontium'),('Y','yttrium'),('Mo','molybdenum')]
L=[('I','iodine'),('Xe','xenon'),('Sm','samarium'),('Eu','europium'),('Gd','gadolinium'),('Tb','terbium'),('Ho','holmium'),('Yb','ytterbium'),('Lu','lutetium'),('Ta','tantalum'),('W','tungsten'),('Os','osmium'),('Ir','iridium'),('Pt','platinum'),('Au','gold'),('Hg','mercury'),('Pb','lead'),('U','uranium')]
out={}
grid=np.arange(5.0,21.01,0.05)
for sym,name in K:
    Z=x.SymbolToAtomicNumber(sym); ek=x.EdgeEnergy(Z,x.K_SHELL)
    Es=grid[grid>ek+0.05]
    lines=[]
    for nm,ln in (('Kα',x.KA_LINE),('Kβ',x.KB_LINE)):
        try: el=x.LineEnergy(Z,ln)
        except Exception: continue
        v=np.array([cs(Z,ln,e) for e in Es])
        if v.max()<=0: continue
        # power law referenced to the edge
        ref=ek if ek>5 else 10.0
        A=np.vstack([np.ones(len(Es)),-np.log(Es/ref)]).T; c,n=np.linalg.lstsq(A,np.log(v),rcond=None)[0]
        fit=np.exp(c)*(Es/ref)**(-n); err=np.abs(fit/v-1).max()
        d=dict(nm=nm,E=round(el,4),th=[round(ek,4)],c=[float('%.4g'%np.exp(c))],n=round(float(n),3),ma=round(mu_air(el),5),mw=round(mu_wat(el),6),err=round(float(err),3))
        if ref!=ek: d['r']=[ref]
        lines.append(d)
    out[sym]=dict(Z=Z,name=name,sh='K',ed=round(ek,4),w=round(x.FluorYield(Z,x.K_SHELL),3),lines=lines)
for sym,name in L:
    Z=x.SymbolToAtomicNumber(sym); e3,e2,e1=[x.EdgeEnergy(Z,s) for s in (x.L3_SHELL,x.L2_SHELL,x.L1_SHELL)]
    lines=[]
    for nm,ln,ln1 in (('Lα',x.LA_LINE,x.LA1_LINE),('Lβ',x.LB_LINE,x.LB1_LINE)):
        el=x.LineEnergy(Z,ln1)
        Es=np.array([e for e in grid if e>e3+0.05 and min(abs(e-e2),abs(e-e1))>0.05])
        v=np.array([cs(Z,ln,e) for e in Es])
        best=None
        for n in np.arange(2.2,3.3,0.02):
            A=np.vstack([(Es/th)**(-n)*(Es>th) for th in (e3,e2,e1)]).T
            keep=[i for i,th in enumerate((e3,e2,e1)) if (Es>th).any()]
            c=np.zeros(3); sol=np.linalg.lstsq(A[:,keep]/v[:,None],np.ones(len(Es)),rcond=None)[0]; c[keep]=sol
            c=np.maximum(c,0); fit=A@c; err=np.abs(fit/v-1).max()
            if best is None or err<best[0]: best=(err,n,c)
        err,n,c=best
        lines.append(dict(nm=nm,E=round(el,4),th=[round(e3,4),round(e2,4),round(e1,4)],c=[round(float(q),1) for q in c],n=round(float(n),3),ma=round(mu_air(el),5),mw=round(mu_wat(el),6),err=round(float(err),3)))
    out[sym]=dict(Z=Z,name=name,sh='L',ed=round(e3,4),w=round(x.FluorYield(Z,x.L3_SHELL),3),lines=lines)
json.dump({k:dict(v,lines=[{a:b for a,b in l.items() if a!='err'} for l in v['lines']]) for k,v in out.items()},open('xrf.json','w'),ensure_ascii=False,separators=(',',':'))
for k,v in out.items(): print(k,v['sh'],v['ed'],v['w'],[(l['nm'],l['E'],l['c'],l['n'],l['ma'],l['mw'],l['err']) for l in v['lines']])
# anchors for the text
se=out['Se']['lines'][0]
def sig(sym,i,E):
    l=out[sym]['lines'][i]; return sum(c*(E/(l['r'][j] if 'r' in l else t))**(-l['n']) for j,(c,t) in enumerate(zip(l['c'],l['th'])) if E>t)
print('Se Ka at 12.662',sig('Se',0,12.662),'xraylib',cs(34,x.KA_LINE,12.662))
for s in ['S','P','Cl','Ca','Fe','Zn']:
    l=out[s]['lines'][0]; e=sig(s,0,12.662)/sig('Se',0,12.662); print(s,'emitted rel Se %.4g'%e,'air15 T=%.3g'%math.exp(-l['ma']*15),'water50um T=%.3g'%math.exp(-l['mw']*50),'net %.3g'%(e*math.exp(-l['ma']*15-l['mw']*50)))
l=se;print('Se air15 T',math.exp(-l['ma']*15),'water50',math.exp(-l['mw']*50))
print('Se f',[(E,round(x.Fi(34,E),2),round(x.Fii(34,E),2)) for E in (12.0,12.5,12.64,12.68,12.8,13.2,13.5)])
print('Se K width eV',x.AtomicLevelWidth(34,x.K_SHELL)*1000)
print('mu water 12.66 (1/um)',mu_wat(12.662),'air 12.66 per mm',mu_air(12.662))
