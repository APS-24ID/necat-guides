# builds water.json: the elastic and Compton scattering strength of one water molecule against x = sin(theta)/lambda,
# from the atomic form factors and incoherent scattering functions in xraylib. Atoms are treated as scattering independently.
#   F2(x) = 2 f_H(x)^2 + f_O(x)^2      S(x) = 2 S_H(x) + S_O(x)
# tabulated every 0.025 per angstrom (the step WDX in newfigs.js)
import xraylib as x, json
import os
old=json.load(open('water.json')) if os.path.exists('water.json') else None
n=71
xs=[i*0.025 for i in range(n)]
F2=[round(2*x.FF_Rayl(1,q)**2+x.FF_Rayl(8,q)**2,4) for q in xs]
S=[round(2*x.SF_Compt(1,q)+x.SF_Compt(8,q),4) if q>0 else 0.0 for q in xs]
if old:
    print('points',n,'max difference from the existing file',max(abs(a-b) for a,b in zip(F2+S,old['F2']+old['S'])))
json.dump({'F2':F2,'S':S},open('water.json','w'))
