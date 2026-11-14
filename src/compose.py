import re, json
src=open('src-body.v6.html').read()
L=src.split('\n')

# ---------- CSS ----------
css=src[src.index('<style>')+7:src.index('</style>')]
css=css.replace(".eqcard .tag{font-family:var(--f-hand);text-transform:uppercase;letter-spacing:.06em;font-size:.95rem;background:var(--ink);color:var(--paper);padding:1px 12px;display:flex;justify-content:space-between;gap:12px}",
 ".eqcard .tag{font-family:var(--f-hand);text-transform:uppercase;letter-spacing:.06em;font-size:.95rem;background:var(--ink);color:var(--paper);padding:2px 12px;display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px}")
assert 'flex-wrap:wrap;align-items:center' in css
css=css.replace("/* Layout: a comic album page.","/* Three linked guides share this sheet. Layout: a comic album page.")
css=css.replace('.ro .k{font-family:var(--f-hand);font-size:.95rem;text-transform:uppercase;letter-spacing:.04em}','.ro .k{font-family:var(--f-hand);font-size:.95rem;letter-spacing:.04em}')
assert '.ro .k{font-family:var(--f-hand);font-size:.95rem;letter-spacing:.04em}' in css
css+='''
.here{display:block;font-family:var(--f-hand);font-size:1.12rem;line-height:1.4;background:var(--card);border:2.5px solid var(--ink);border-left-width:10px;border-left-color:var(--red);padding:6px 14px}
.remember{font-family:var(--f-display);font-weight:700;font-size:1.35rem;line-height:1.3}
.classroom{border:2.5px solid var(--ink);background:var(--card);padding:8px 14px;margin-top:8px}
.classroom summary{font-family:var(--f-hand);font-size:1.15rem;cursor:pointer}
.classroom ul{margin:8px 0 4px;padding-left:1.2em;display:grid;gap:6px}
.btns button[aria-pressed="true"]{background:var(--red);color:#fff}
.level.lv-intro{background:var(--cap)}
.level.lv-depth{background:var(--ink);color:var(--paper)}
.level{font-family:var(--f-hand);font-size:1rem;letter-spacing:.06em;text-transform:uppercase;border:2px solid var(--ink);padding:0 8px;background:var(--paper)}
details.eqcard>summary{cursor:pointer;list-style:none}
details.eqcard>summary::-webkit-details-marker{display:none}
details.eqcard>summary .eqno{white-space:nowrap}
details.eqcard>summary::after{content:"+ show";background:var(--cap);color:var(--ink);padding:0 8px;margin-left:auto;white-space:nowrap}
details.eqcard[open]>summary::after{content:"\\2212  hide"}
details.eqcard>summary:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
details.eqcard:not([open]) .eqn{display:none}
.eqgroup{display:grid;gap:8px;max-width:78ch;margin-inline:auto;width:100%;min-width:0}
.eqlabel{font-family:var(--f-hand);font-size:1.05rem}
.guides{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-family:var(--f-hand);font-size:1.05rem}
.guides span.lbl{text-transform:uppercase;letter-spacing:.06em}
.guides a{color:var(--ink);text-decoration:none;background:var(--card);border:2.5px solid var(--ink);padding:2px 12px}
.guides a[aria-current="page"]{background:var(--red);color:#fff}
.guides a:hover,.guides a:focus-visible{background:var(--cap);color:var(--ink)}
table.rules{border-collapse:collapse;width:100%;font-size:.95rem;font-variant-numeric:tabular-nums}
table.rules th,table.rules td{border:1.5px solid var(--ink);padding:5px 10px;text-align:right}
table.rules th:first-child,table.rules td:first-child{text-align:left}
table.rules thead th{font-family:var(--f-hand);font-weight:400;font-size:1.05rem;background:var(--ink);color:var(--paper)}
'''

# ---------- extract equation cards and panels ----------
EQKEY={'1.1':'wave','1.2':'hc','1.3':'P','2.1':'erad','2.2':'larmor','3.1':'bfield','3.2':'force','3.3':'path','3.4':'K','4.1':'gamma','4.2':'slip','4.3':'frames','4.4':'undeq','4.5':'work','4.6':'headlight','4.7':'pattern','4.8':'cone','5.1':'fieldmap','5.2':'tilt','5.3':'Pap','5.4':'ebeam','6.1':'bragg','6.2':'ccgeo','6.3':'polfac','6.4':'pout','6.5':'mirror','7.1':'thomson','7.2':'where','7.3':'partial','7.4':'floor','7.5':'fluor','7.6':'measure'}
STEPKEY={'1':'wave','2':'dipole','3':'wiggle','4':'squeeze','5':'purity','6':'optics','7':'thomson'}
def refs(t):
    t=re.sub(r'\b([Ee])quation (\d\.\d)\b',lambda m:'{%s:%s}'%('Eq' if m.group(1)=='E' else 'eq',EQKEY[m.group(2)]),t)
    t=re.sub(r'\b([Ss])tep (\d)\b',lambda m:'{%s:%s}'%('Step' if m.group(1)=='S' else 'step',STEPKEY[m.group(2)]),t)
    return t
def blocks(start):
    out=[];i=0
    while i<len(L):
        if L[i]==start:
            j=i+1
            while L[j]!='    </div>': j+=1
            out.append('\n'.join(L[i:j+1])); i=j
        i+=1
    return out
EQ={}
for b in blocks('    <div class="eqcard">'):
    m=re.search(r'<div class="tag"><span>Equation (\d\.\d)</span><span>(.*?)</span></div>',b)
    key=EQKEY[m.group(1)]; title=m.group(2)
    inner=b[b.index('</div>',b.index('class="tag"'))+6:b.rindex('</div>')]
    EQ[key]=dict(title=title,inner=refs(inner))
assert len(EQ)==32,len(EQ)
FIG={}
for b in blocks('    <div class="panel">'):
    m=re.search(r'<canvas id="(\w+)Cv"',b)
    key=m.group(1) if m else ('calc' if 'Undulator energy calculator' in b else 'measure')
    FIG[key]=refs(b)
assert set(FIG)=={'hero','wave','dip','und','slip','calc','rel','pur','mono','smp','measure'},set(FIG)
FIG['smp']=FIG['smp'].replace('The form-factor and Compton effects are in the snout design study.','The form-factor and Compton effects come in {step:real}.')
assert '{step:real}' in FIG['smp']

def card(title,tex,dl,says,num=None):
    s='\n      <div class="eqn">\\[ '+tex+' \\]</div>\n      <div class="body">\n'
    if dl: s+='        <dl class="read">\n'+''.join('          <dt>\\( %s \\)</dt><dd>%s</dd>\n'%(a,b) for a,b in dl)+'        </dl>\n'
    s+='        <p class="says"><b>What it says</b>'+says+'</p>\n'
    if num: s+='        <p class="num"><b>In numbers</b>'+num+'</p>\n'
    return dict(title=title,inner=s+'      </div>\n')

# ---------- new equation cards ----------
EQ['demag']=card('How a mirror shrinks the source',r"s_{\text{focus}}\approx s_{\text{source}}\times\frac{q}{p}",
 [(r"s_{\text{source}}","Size of the X-ray source, which is the size of the electron beam inside the undulator."),("p","Distance from the source to the mirror."),("q","Distance from the mirror to the focus at the sample.")],
 "A focusing mirror makes an image of the source at the sample, shrunk by the ratio of the two distances. A mirror far from the source and close to the sample gives a small spot. For the same mirrors, a smaller source gives a smaller spot. Real mirrors add a little blur of their own from tiny errors in their shape.",
 "The upgrade shrank the horizontal source size from 280 µm to 14.7 µm, about 19 times, and the vertical size from 10 µm to 3.2 µm.")
EQ['resol']=card('What resolution reaches the detector',r"\lambda=2d\sin\theta\qquad \tan 2\theta=\frac{r}{D}\qquad\Longrightarrow\qquad d_{\min}=\frac{\lambda}{2\sin\!\bigl(\tfrac12\arctan\frac{r}{D}\bigr)}",
 [("d","Spacing of a set of planes in the protein crystal. Small d means fine detail."),(r"2\theta","Angle between a diffracted ray and the direct beam."),("r","Distance from the beam centre to a point on the detector."),("D","Distance from the sample to the detector."),(r"d_{\min}","The finest spacing whose reflection still lands on the detector: the resolution limit.")],
 "The first part is Bragg's law again, this time for the sample. Finer detail diffracts to larger angles. A reflection is recorded only if its ray still hits the detector, so moving the detector closer or using a shorter wavelength brings finer detail onto it.",
 "At 12.662 keV (0.979 Å) with the detector at 300 mm, the edge at r = 155.6 mm sits at 2θ = 27.4°, which is 2.07 Å.")
EQ['comptonE']=card('The Compton energy shift',r"E'=\frac{E}{1+\dfrac{E}{mc^{2}}\,(1-\cos 2\theta)}",
 [("E","Energy of the incoming photon."),("E'","Energy of the photon after it scatters from an electron that recoils."),("mc^{2}","The electron's rest energy, 511 keV."),(r"2\theta","The scattering angle between the beam and the direction to the detector.")],
 "When a photon knocks an electron away, it hands over some energy. The loss grows with the scattering angle: none straight ahead, most straight back. At these energies the loss is a few hundred electron-volts, enough for the detector to see Compton scatter as a separate peak just below the elastic one.",
 "For a 12.66 keV beam: 12.57 keV at 45°, 12.35 keV at 90°, 12.06 keV at 180°. Se Kα is at 11.22 keV, well below all of these. Se Kβ at 12.50 keV is not.")
EQ['elastic']=card('Elastic scatter from real atoms',r"\left.\frac{d\sigma}{d\Omega}\right|_{\text{elastic}}=r_e^{2}\;\mathcal{P}\;\sum_{\text{atoms}}f(x)^{2}\qquad\qquad x=\frac{\sin\theta}{\lambda}",
 [(r"\mathcal{P}","The polarization factor: the square bracket of {eq:partial}."),("f(x)","The atomic form factor: how many of an atom's electrons scatter in step with each other. It equals the atomic number at x = 0 and falls as x grows."),("x","A measure of the scattering angle. θ is half the scattering angle and λ is the wavelength.")],
 "At small angles all the electrons in an atom scatter together, so the intensity goes as the square of their number. At large angles their waves fall out of step and mostly cancel. So elastic scatter is strong toward the beamstop and weak at 90° and beyond. This sum treats atoms one at a time. It leaves out interference between neighbouring molecules and the sharp Bragg spots from the crystal.",
 "At 12.66 keV and 90°, x = 0.72 Å<sup>−1</sup>. Oxygen's form factor has fallen from 8 to about 1.6 there, so its elastic scatter is down about 25 times from the forward direction.")
EQ['compton']=card('Compton scatter from real atoms',r"\left.\frac{d\sigma}{d\Omega}\right|_{\text{Compton}}\approx r_e^{2}\;\mathcal{P}\;\Bigl(\frac{E'}{E}\Bigr)^{2}\sum_{\text{atoms}}S(x)",
 [("S(x)","The incoherent scattering function: how many of an atom's electrons can be knocked free at this angle. It is zero at x = 0 and rises to the atomic number at large x."),("E'/E","The energy ratio from {eq:comptonE}. It is within a few percent of 1 here.")],
 "Compton scatter obeys the same polarization factor as elastic scatter, so the ideal spot suppresses it too. Its dependence on angle is the reverse of elastic scatter. A bound electron cannot recoil from a gentle push, so there is little Compton scatter near the forward direction and a lot at 90° and behind. For light atoms at 90° it is the larger of the two.",
 "For water at 12.66 keV, seen from the ideal spot with a 9° sensor cone: about 74% of the scatter is Compton and 26% is elastic.")

# ---------- undulator panel: the gap is the control, K follows from it ----------
def _rep(t,old,new):
    assert t.count(old)==1,old[:60]; return t.replace(old,new)
FIG['und']=_rep(FIG['und'],'<div class="ctl"><label for="uK">Deflection parameter K <output id="uKO">1.00</output></label><input id="uK" type="range" min="0.2" max="2.5" step="0.05" value="1"></div>',
 '<div class="ctl"><label for="uG">Gap between the magnet rows <output id="uGO">12.00 mm</output></label><input id="uG" type="range" min="8.5" max="30" step="0.01" value="12"></div>')
FIG['und']=_rep(FIG['und'],'<input id="uL" type="range" min="1.5" max="5" step="0.1" value="3.3">','<input id="uL" type="range" min="1.5" max="4" step="0.1" value="3.3">')
FIG['und']=_rep(FIG['und'],'<div class="ro"><div class="k">Wiggle amplitude</div>','<div class="ro"><div class="k">Deflection parameter K</div><div class="v" id="uKv">–</div></div>\n        <div class="ro"><div class="k">Wiggle amplitude</div>')
FIG['und']=_rep(FIG['und'],'The real amplitude is under a micron against a period of centimetres.','The real amplitude is about a micron against a period of centimetres. Close the gap and the field between the rows gets stronger (thicker purple arrows), so the wiggle grows. The gap is the one thing the beamline changes while it runs. The magnet period is fixed when the undulator is built.')
FIG['calc']=_rep(FIG['calc'],'      <div class="using" data-d="useCalc">','      <div class="figcap">The same sum as in the figure above, with every number open to change. Use it to try another ring energy, magnet period or harmonic. The last box gives the K that would put the chosen harmonic on the selenium edge.</div>\n      <div class="using" data-d="useCalc">')

EQ['gapeq']=card('Field against gap',r"B_0[\text{T}]\approx 3.88\,\exp\!\left[-5.07\,\frac{g}{\lambda_u}+1.52\left(\frac{g}{\lambda_u}\right)^{2}\right]",
 [("g","The gap between the upper and lower magnet rows."),(r"\lambda_u","The undulator period."),("B_0","The peak field on the beam axis, in tesla.")],
 "The field on the axis falls steeply as the rows move apart. It roughly halves each time the gap grows by a fifth of a period. That makes the gap the tuning knob: motors move the rows, B₀ changes, and K follows from {eq:K}. This is a fit for undulators built from neodymium magnets with iron-alloy poles (Elleaume, Chavanne and Faatz, 2000), meant for g/λu between 0.1 and 1. The published fit begins with 3.69. These guides use 3.88, which reproduces the K values the APS quotes for its 3.3, 3.0 and 2.75 cm undulators at their smallest gap to within 2%. It is a general curve, not a measurement of the NE-CAT undulators.",
 '<span data-d="numGap">For 24-ID-C after the upgrade: K = 1.84 needs B₀ = 0.66 T, a gap of about 11.9 mm.</span>')
EQ['odd']=card('Why only odd harmonics on the axis',r"E\!\left(t+\tfrac{T}{2}\right)=-E(t)\qquad\Longrightarrow\qquad E(t)=\sum_{n=1,3,5,\dots}a_n\sin\!\left(\frac{2\pi n\,t}{T}\right)",
 [("E(t)","The electric field arriving at a point on the axis."),("T",r"The time between crests of the fundamental, \( \lambda_1/c \)."),("a_n","How much of harmonic n the wave contains.")],
 "The second half of every magnet period is the mirror image of the first. The electron swings back the other way, so it sends the same shape of field down the axis with the opposite sign. Any repeating wave can be built from sine waves at 1, 2, 3 … times its own rhythm. A wave that flips sign every half cycle needs only the odd ones. Away from the axis the two half periods are no longer seen equally, and the even harmonics appear there.")
EQ['fn']=card('How bright each harmonic is',r"F_n(K)=\frac{n^{2}K^{2}}{\left(1+K^{2}/2\right)^{2}}\left[J_{\frac{n-1}{2}}(\xi)-J_{\frac{n+1}{2}}(\xi)\right]^{2}\qquad\qquad \xi=\frac{nK^{2}}{4+2K^{2}}",
 [("F_n","The brightness of harmonic n on the axis, as a pure number. The number of photons sent along the axis is proportional to N² γ² I Fₙ, for N magnet periods and a ring current I."),("J","Bessel functions. They appear whenever a wave is built from a motion that is itself a sine wave."),("n","The harmonic number, odd.")],
 "These are the thin curves in the figure. For a weak undulator only F₁ matters, and it grows as K². It reaches its largest value near K = 1.2. The third harmonic is brightest near K = 1.9, the fifth near 2.3, and so on: each higher harmonic takes over at a larger K. The same numbers come out if the spiky wave in the figure is split into its sine waves.",
 '<span data-d="numFn">For 24-ID-C after the upgrade at K = 1.84: F₁ = 0.31, F₃ = 0.43, F₅ = 0.38, F₇ = 0.30.</span>')

FIG['harm']='''    <div class="panel">
      <canvas id="harmCv" aria-label="Interactive: the electric field wave from the undulator, and the brightness and energy of each harmonic, as the undulator gap changes"></canvas>
      <div class="controls">
        <div class="ctl"><label for="hG">Gap between the magnet rows <output id="hGO">12.00 mm</output></label><input id="hG" type="range" min="8.5" max="30" step="0.01" value="12"></div>
        <div class="btns"><button id="hSe">Set the gap for 12.662 keV</button></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Deflection parameter K</div><div class="v" id="hKv">–</div></div>
        <div class="ro"><div class="k">Harmonic 1, the fundamental</div><div class="v" id="hE1">–</div></div>
        <div class="ro"><div class="k">Harmonic 3</div><div class="v" id="hE3">–</div></div>
        <div class="ro"><div class="k">Harmonic 5</div><div class="v" id="hE5">–</div></div>
        <div class="ro"><div class="k">Brightest on the axis</div><div class="v" id="hBest">–</div></div>
      </div>
      <div class="key"><span><i style="background:#2f6db5"></i>Harmonic 1</span><span><i style="background:#d8412f"></i>Harmonic 3</span><span><i style="background:#5aa469"></i>Harmonic 5</span><span><i style="background:#8a63c2"></i>Harmonic 7</span><span><i style="background:#b9c2c9"></i>Higher</span><span id="hRg"><i style="background:#ffe9a3"></i>Energies 24-ID-C tunes over</span></div>
      <div class="figcap">Left: a snapshot of the electric field traveling down the axis. At a wide gap it is a weak, smooth sine wave. Close the gap and it grows, its crests move apart, and it sharpens into spikes that point up and down in turn. Right: the energies in that wave. Each bar is one harmonic at this gap, and its height is its brightness on the axis. The thin curve through a bar is that harmonic's tuning curve: where the bar goes as the gap changes. The small hollow dots mark the even harmonics, which are missing on the axis. The dashed line is the selenium edge. In a real beam each bar is a narrow peak, not a line.</div>
      <div class="using" data-d="useHarm">Set for 24-ID-C after the upgrade: 6 GeV, λu = 3.0 cm.</div>
    </div>'''

# ---------- new figure panels ----------
FIG['ring']='''    <div class="panel">
      <canvas id="ringCv" aria-label="Animation: electron bunches circulate in the storage ring; in sector 24 each of two undulators sends out X-rays as the electrons pass through it"></canvas>
      <div class="figcap">Left: the storage ring from above, with bunches of electrons circulating. The ring is divided into 40 sectors, and NE-CAT is at sector 24. Right: the straight section of sector 24, enlarged, with one bunch passing through. The electrons give off X-rays only while they are inside an undulator. The first undulator sends its X-rays to 24-ID-C. A small steering magnet then turns the electrons slightly, so the second undulator points in a slightly different direction and sends its X-rays to 24-ID-E. After that the ring's magnets bend the electrons away, and the X-rays carry straight on down the beamlines. The angle between the two beams is drawn far larger than the real one, which is about a milliradian in the APS design. Only some of the bunches are drawn.</div>
      <div class="using" data-d="useRing">24-ID-C after the upgrade: 6 GeV, 200 mA, 324 bunches.</div>
    </div>'''
FIG['kb']='''    <div class="panel">
      <canvas id="kbCv" aria-label="Interactive: a Kirkpatrick-Baez mirror pair focusing the beam onto the sample, with adjustable curve, pitch, roll, yaw and position for each mirror"></canvas>
      <div class="controls">
        <div class="ctl"><label for="kbSel">Mirror to adjust</label><select id="kbSel"><option value="0">Mirror 1 (focuses in height)</option><option value="1">Mirror 2 (focuses in width)</option></select></div>
        <div class="ctl"><label for="kbK">Curve (bend) <output id="kbKO">1.00</output></label><input id="kbK" type="range" min="0.4" max="2.5" step="0.01" value="1"></div>
        <div class="ctl"><label for="kbP">Pitch <output id="kbPO">0.00°</output></label><input id="kbP" type="range" min="-1.5" max="1.5" step="0.05" value="0"></div>
        <div class="ctl"><label for="kbR">Roll <output id="kbRO">0°</output></label><input id="kbR" type="range" min="-20" max="20" step="1" value="0"></div>
        <div class="ctl"><label for="kbY">Yaw <output id="kbYO">0°</output></label><input id="kbY" type="range" min="-20" max="20" step="1" value="0"></div>
        <div class="ctl"><label for="kbT"><span id="kbTL">Up / down</span> <output id="kbTO">0</output></label><input id="kbT" type="range" min="-10" max="10" step="1" value="0"></div>
        <div class="btns"><button id="kbReset">Reset both mirrors</button></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Beam height at the sample</div><div class="v" id="kbV">–</div></div>
        <div class="ro"><div class="k">Beam width at the sample</div><div class="v" id="kbH">–</div></div>
        <div class="ro"><div class="k">Spot position</div><div class="v" id="kbPos">–</div></div>
        <div class="ro"><div class="k">Beam on the mirrors</div><div class="v" id="kbOn">–</div></div>
      </div>
      <div class="figcap">A KB mirror pair, drawn twice. Top: seen from the side. Mirror 1 lies under the beam and is bent into a shallow curve, so the rays that strike it come together in height at the sample. Mirror 2 stands on edge beside the beam and does nothing in this view. Bottom: seen from above. Now mirror 1 does nothing, and mirror 2 brings the rays together in width. The square shows the beam's cross-section at the sample. Choose a mirror and try each control. <b>Curve</b> moves the focus along the beam, so the spot grows in that mirror's direction only. <b>Pitch</b> changes the angle at which the beam strikes the mirror. It swings the reflected beam and is by far the most sensitive adjustment. <b>Up / down</b> (in / out for mirror 2) slides the mirror across the beam. The spot moves with it, and if the mirror goes too far part of the beam misses it or is blocked by its end. <b>Roll</b> twists the mirror about the beam and nudges the spot in the other mirror's direction. <b>Yaw</b> turns the mirror in its own plane and has almost no effect. The angles are drawn about forty times larger than life, and the effects of roll and yaw appear only in the square. Real mirrors meet the beam at a fraction of a degree and look flat to the eye. At such shallow angles even a magnified bend is too slight to see in the main drawing, so the curved bar under each mirror shows that mirror's bend on its own, magnified much further. The order drawn here, height first, is an assumption.</div>
    </div>'''
FIG['path']='''    <div class="panel">
      <canvas id="pathCv" aria-label="Animation: X-rays travel as a wave from the undulator, reflect from the two faces of the monochromator and from the two mirrors, strike the sample, and diffracted rays reach the detector"></canvas>
      <div class="figcap">The path of the X-rays from source to detector, seen from the side and not to scale. Electrons wiggle through the undulator and give off light, drawn as an orange wave, and are then steered away to carry on around the ring. The light leaves through the ring's shield wall. It reflects from the two faces of the monochromator crystal, which pass only one energy, and then from the two focusing mirrors. It hits the crystal at the sample, where most of it is caught by the beamstop. The diffracted rays fan out to the detector. Both mirrors are drawn turning the beam within the page. In reality the second one turns it sideways.</div>
      <div class="using" data-d="useHero">24-ID-C after the upgrade: 6 GeV ring, 3.0 cm undulator, Si(111) mono, 12.662 keV.</div>
    </div>'''
FIG['stations']='''    <div class="panel">
      <canvas id="stationsCv" aria-label="Animation: the X-ray beam in five steps: undulator, monochromator, KB mirrors, sample, detector"></canvas>
      <div class="figcap">The path of the X-rays in five steps, not to scale. In the undulator, electrons wiggle between two rows of magnets and give off light, drawn as an orange wave. The monochromator reflects the light from two crystal faces and passes only one energy. The KB mirrors reflect it again and focus it. It hits the crystal at the sample, where most of it is caught by the beamstop, and the diffracted rays fan out to the detector. The seven sections below take these steps one at a time.</div>
      <div class="using" data-d="useHero">24-ID-C after the upgrade: 6 GeV ring, 3.0 cm undulator, Si(111) mono, 12.662 keV.</div>
    </div>'''
FIG['monoLite']='''    <div class="panel">
      <canvas id="monoCv" aria-label="Interactive channel-cut monochromator: the crystal rotates as one piece and the beam walks along the second face"></canvas>
      <div class="controls">
        <div class="ctl"><label for="mE">Photon energy <output id="mEO">12.662 keV</output></label><input id="mE" type="range" min="6" max="20" step="0.001" value="12.662"></div>
        <div class="ctl"><label for="mCr">Crystal</label><select id="mCr"><option value="111">Si(111), d = 3.1356 Å</option><option value="220">Si(220), d = 1.9201 Å</option></select></div>
        <div class="ctl"><label for="mB">Reflections</label><select id="mB"><option value="2">2 (channel cut)</option><option value="1">1 (single bounce)</option></select></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Bragg angle θ<sub>B</sub></div><div class="v" id="mTh">–</div></div>
        <div class="ro"><div class="k">Beam walk on the second face</div><div class="v" id="mWalk">–</div></div>
        <div class="ro"><div class="k">Height step of the outgoing beam</div><div class="v" id="mOff">–</div></div>
      </div>
      <div class="figcap">The mono seen from the side. With two reflections it is a channel cut: one piece of silicon with a slot, whose two inner faces do the reflecting. The pale plate behind the two blades is the part that joins them. Move the energy slider and the whole crystal turns about the pivot on the first face, marked with a small crosshair. The two faces stay locked together, the orange dot shows where the beam lands on the second face, and the dashed ticks mark where it lands at 6 and at 20 keV. The orange wiggles are wave packets, one for each photon.</div>
      <div class="using" data-d="useMono">Set for 24-ID-C after the upgrade: Si(111), 2 reflections, vertical deflection (assumed), 12.662 keV.</div>
    </div>'''
FIG['diff']='''    <div class="panel">
      <canvas id="diffCv" aria-label="Interactive: diffraction geometry from the sample to the area detector, with resolution at the detector edge"></canvas>
      <div class="controls">
        <div class="ctl"><label for="dE">Photon energy <output id="dEO">12.662 keV</output></label><input id="dE" type="range" min="6" max="20" step="0.001" value="12.662"></div>
        <div class="ctl"><label for="dD">Sample to detector distance <output id="dDO">300 mm</output></label><input id="dD" type="range" min="100" max="900" step="5" value="300"></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Wavelength</div><div class="v" id="dLam">–</div></div>
        <div class="ro"><div class="k">Resolution at the detector edge</div><div class="v" id="dEdge">–</div></div>
        <div class="ro"><div class="k">Resolution in the corner</div><div class="v" id="dCor">–</div></div>
        <div class="ro"><div class="k">Lowest resolution past the beamstop</div><div class="v" id="dLow">–</div></div>
      </div>
      <div class="figcap">Side view of the endstation. The beam comes from the left and hits the crystal. Most of it carries straight on and is caught by a small beamstop just behind the sample. A small part is diffracted into rays that fan out from the crystal. The dashed lines mark a few of them, each labeled with the resolution it carries: the wider the angle, the finer the detail. This fan is set by the crystal and the X-ray energy. Moving the detector does not change it. The detector simply catches whatever part of the fan lands on it, shown by the darker wedge and the solid red rays. Drag the detector along the beam, or use the slider. Closer in, it takes in more of the fan. Raise the energy and the whole fan narrows, so more of it fits on the detector. The detector is drawn to scale as an EIGER 16M, 311 mm across. The coarsest detail leaves the crystal at very small angles, close to the direct beam, and the beamstop must be small enough to let it past. The green rays carry 50 Å detail. The strip at the bottom is a close-up of the first 60 mm behind the sample with the height stretched several times. The gray wedge is the shadow of the beamstop, and the 50 Å rays pass outside it. The beamstop is drawn 0.3 mm across and 25 mm behind the sample. Those two numbers are illustrative.</div>
    </div>'''
FIG['spec']='''    <div class="panel">
      <canvas id="specCv" aria-label="Interactive: the energy spectrum seen by the fluorescence detector, with fluorescence, Compton and elastic peaks"></canvas>
      <div class="controls">
        <div class="ctl"><label for="xAz">SDD angle from the beam, horizontal <output id="xAzO">90°</output></label><input id="xAz" type="range" min="20" max="160" value="90"></div>
        <div class="ctl"><label for="xE">Beam energy <output id="xEO">12.662 keV</output></label><input id="xE" type="range" min="12.2" max="13.4" step="0.002" value="12.662"></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Compton peak</div><div class="v" id="xC">–</div></div>
        <div class="ro"><div class="k">Scatter vs the ideal spot</div><div class="v" id="xRel">–</div></div>
        <div class="ro"><div class="k">Se fluorescence</div><div class="v" id="xF">–</div></div>
      </div>
      <div class="figcap">What the fluorescence detector (SDD) records from a selenium-containing crystal: counts against photon energy. The green band is the window around Se Kα that an edge scan counts. Move the detector away from 90° and the two scatter peaks grow while the fluorescence peaks stay the same height. The Compton peak also slides in energy. Drop the beam energy below the Se K edge at 12.658 keV and the fluorescence switches off. The height of the fluorescence peaks compared with the scatter is set by hand here. In a real sample it depends on how much selenium there is.</div>
      <div class="using" data-d="useSpec">Set for 24-ID-C after the upgrade: P = 0.982 at the sample.</div>
    </div>'''
FIG['sweep']='''    <div class="panel">
      <canvas id="sweepCv" aria-label="Interactive: elastic, Compton and total scatter into the fluorescence detector against its position"></canvas>
      <div class="controls">
        <div class="btns"><button id="vH" aria-pressed="true">Swing horizontally</button><button id="vV" aria-pressed="false">Lift vertically</button></div>
        <div class="ctl"><label for="vPos">SDD position <output id="vPosO">90°</output></label><input id="vPos" type="range" min="10" max="170" value="110"></div>
        <div class="ctl"><label for="vE">Beam energy <output id="vEO">12.662 keV</output></label><input id="vE" type="range" min="6" max="20" step="0.001" value="12.662"></div>
        <div class="ctl"><label for="vP">Beam polarization P <output id="vPO">0.980</output></label><input id="vP" type="range" min="0.80" max="1" step="0.001" value="0.98"></div>
        <div class="ctl"><label for="vCone">Sensor half-angle α <output id="vConeO">9°</output></label><input id="vCone" type="range" min="1" max="20" value="9"></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Total scatter vs the ideal spot</div><div class="v" id="vTot">–</div></div>
        <div class="ro"><div class="k">Elastic share here</div><div class="v" id="vEl">–</div></div>
        <div class="ro"><div class="k">Compton peak here</div><div class="v" id="vCE">–</div></div>
      </div>
      <div class="figcap">Scatter reaching the fluorescence detector as it moves, compared with the ideal spot. The vertical scale is logarithmic: each grid line is ten times the one below. Swing horizontally: the detector stays in the horizontal plane and its angle from the beam changes. 90° is the ideal spot, smaller angles are toward the beamstop and larger ones toward the source. Lift vertically: the detector stays at 90° to the beam and rises out of the horizontal plane. The sample is treated as water, which is most of what a protein crystal and its surrounding liquid are made of.</div>
      <div class="using" data-d="useSweep">Set for 24-ID-C after the upgrade: 12.662 keV, P = 0.982 at the sample.</div>
    </div>'''
FIG['rules']='''    <div class="panel">
      <div class="tblwrap"><table class="rules" id="rulesTbl"></table></div>
      <div class="figcap">How many times more scatter the fluorescence detector receives than at the ideal spot, for the settings chosen at the top of the page. Calculated with the same water model as the figure above, at 12.662 keV with a 9° sensor cone. Fluorescence is the same in every row.</div>
    </div>'''

# ---------- guides ----------
# ---------- scatter guide: reworked panels ----------
FIG['spec']=_rep(FIG['spec'],'<input id="xE" type="range" min="12.2" max="13.4" step="0.002" value="12.662"></div>','<input id="xE" type="range" min="12.2" max="13.4" step="0.002" value="12.662"></div>\n        <div class="ctl"><label for="xM">Selenium in the sample <output id="xMO">1 Se per 20 kDa</output></label><input id="xM" type="range" min="0.7" max="3.7" step="0.01" value="1.3"></div>')
FIG['spec']=_rep(FIG['spec'],'<div class="k">Se fluorescence</div>','<div class="k">Fluorescence share</div>')
FIG['spec']=_rep(FIG['spec'],"Move the detector away from 90° and the two scatter peaks grow while the fluorescence peaks stay the same height. The Compton peak also slides in energy. Drop the beam energy below the Se K edge at 12.658 keV and the fluorescence switches off. The height of the fluorescence peaks compared with the scatter is set by hand here. In a real sample it depends on how much selenium there is.",
 "Move the detector away from 90° and the two scatter peaks grow while the fluorescence stays the same. The Compton peak also slides in energy. Drop the beam energy below the Se K edge at 12.658 keV and the fluorescence switches off. The third slider sets how much sample there is in the beam for each selenium atom: protein, solvent and the liquid around the crystal together. The peak sizes follow from tabulated cross-sections, with the sample treated as water. Absorption in the sample and in air is left out.")
FIG['sweep']=_rep(FIG['sweep'],'<div class="btns"><button id="vH"','<div class="btns" style="grid-column:1/-1"><button id="vH"')
FIG['stations']=_rep(FIG['stations'],'The seven sections below take these steps one at a time.','The sections below take these steps one at a time.')

FIG['tri']='''    <div class="panel">
      <canvas id="triCv" aria-label="Animation: the beam strikes the sample; fluorescence leaves in every direction, elastic scatter mostly forward, Compton scatter forward and back, and almost no scatter goes sideways toward the fluorescence detector"></canvas>
      <div class="figcap">Looking down on the sample. The beam comes in from the left with its electric field swinging across it. Green dots are fluorescence, which leaves in every direction. Red and blue dots are the two kinds of scatter. Hardly any of them go sideways along the line of the electric field, and that is where the fluorescence detector sits. The dots are drawn in the proportions the calculation gives for each direction. The numbers of each color are not to scale with one another.</div>
    </div>'''

FIG['cone']='''    <div class="panel">
      <canvas id="coneCv" aria-label="Interactive: the cone of directions the sensor accepts at a given distance, and the fluorescence and scatter it collects compared with the design distance"></canvas>
      <div class="controls">
        <div class="ctl"><label for="kD">Sample to sensor distance <output id="kDO">15.0 mm</output></label><input id="kD" type="range" min="8" max="40" step="0.5" value="15"></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Cone half-angle α</div><div class="v" id="kA">–</div></div>
        <div class="ro"><div class="k">Cone covers</div><div class="v" id="kO">–</div></div>
        <div class="ro"><div class="k">Fluorescence collected vs 15 mm</div><div class="v" id="kF">–</div></div>
        <div class="ro"><div class="k">Scatter per fluorescence vs 15 mm</div><div class="v" id="kS">–</div></div>
      </div>
      <div class="figcap">Left, top: the sample, the sensor and the cone between them, with the detector at the ideal spot so that it looks along the electric field. The opening in front of the sensor is 2.4 mm in radius. Left, bottom: the scatter in each direction as seen from the sample, over 22° either side of the dark direction. The solid circle is the patch the sensor covers. As the detector moves in, the circle grows into the brighter bands. Right: what the sensor collects at each distance, compared with 15 mm. The vertical scale is logarithmic. Both curves rise as the detector moves in, and the scatter curve rises faster. The last readout is the gap between the curves: how much scatter arrives with each fluorescence X-ray.</div>
      <div class="using" data-d="useCone">Set for 24-ID-C after the upgrade: 12.662 keV, P = 0.982 at the sample.</div>
    </div>'''

FIG['edge']='''    <div class="panel">
      <canvas id="edgeCv" aria-label="Interactive: a simulated selenium edge scan whose noise depends on where the fluorescence detector sits and how much selenium the sample holds"></canvas>
      <div class="controls">
        <div class="ctl"><label for="gAz">SDD angle from the beam, horizontal <output id="gAzO">90°</output></label><input id="gAz" type="range" min="20" max="160" value="90"></div>
        <div class="ctl"><label for="gM">Selenium in the sample <output id="gMO">1 Se per 300 kDa</output></label><input id="gM" type="range" min="0.7" max="3.7" step="0.01" value="2.48"></div>
        <div class="ctl"><label for="gB">Counts the detector takes per point <output id="gBO">3.0k</output></label><input id="gB" type="range" min="2.5" max="5.5" step="0.01" value="3.48"></div>
      </div>
      <div class="readout">
        <div class="ro"><div class="k">Fluorescence share of the counts</div><div class="v" id="gSh">–</div></div>
        <div class="ro"><div class="k">Kα counts at the peak</div><div class="v" id="gN">–</div></div>
        <div class="ro"><div class="k">Noise on that point</div><div class="v" id="gNo">–</div></div>
        <div class="ro"><div class="k">Beam allowed, vs the ideal spot</div><div class="v" id="gBm">–</div></div>
      </div>
      <div class="figcap">A simulated scan across the selenium K edge. The pale green band is the true curve. The dots are what the detector counts in the Se Kα window, with the noise that goes with that many counts. The beam is turned down so that the detector takes the chosen number of counts, of all kinds, at the top of the edge. Swing the detector away from 90° and scatter takes a larger share, so fewer of the counts are fluorescence. Try 1 Se per 20 kDa, which is like a selenomethionine crystal, and then 1 per 1000 kDa. The edge shape is an illustration, not a measurement, and the same random numbers are used throughout so that only the size of the noise changes.</div>
      <div class="using" data-d="useEdge">Set for 24-ID-C after the upgrade: P = 0.982 at the sample, 9° sensor cone.</div>
    </div>'''

EQ['seyield']=card('How much fluorescence one atom gives',r"\frac{d\sigma_{K\alpha}}{d\Omega}=\frac{\sigma_K\;\omega_K\;p_{K\alpha}}{4\pi}",
 [(r"\sigma_K","How strongly one atom absorbs X-rays by ejecting an electron from its innermost shell. It is zero below the K edge."),(r"\omega_K","The fluorescence yield: the fraction of those events that end with an X-ray being given off."),(r"p_{K\alpha}","The fraction of those X-rays that are Kα and not Kβ."),(r"4\pi","The fluorescence is spread evenly over all directions ({eq:fluor}).")],
 "The strength of the fluorescence from one atom, in the same units as the scatter from one electron. An atom just above its edge is a far stronger source than any single scattering electron. A sample has a great many more electrons than atoms of the element being looked for, and that is the only reason scatter can compete.",
 '<span data-d="numSe">For selenium at 12.7 keV: σK = 1.78×10⁻²⁰ cm², ωK = 0.60 and pKα = 0.86, which give 7.3×10⁻²² cm² per steradian. That is about 9,200 times what one free electron scatters in its brightest direction.</span>')
EQ['solid']=card('The cone the sensor sees',r"\tan\alpha=\frac{r}{d}\qquad\qquad \Omega=2\pi\,(1-\cos\alpha)\approx\frac{\pi r^{2}}{d^{2}}",
 [("r","Radius of the opening in front of the sensor."),("d","Distance from the sample to that opening."),(r"\alpha","Half-angle of the cone of directions the sensor accepts."),(r"\Omega","The solid angle of that cone. The whole sphere is 4π.")],
 "Fluorescence goes out evenly, so the sensor collects the fraction Ω/4π of it. Halve the distance and the fraction is four times as large.",
 "For r = 2.4 mm and d = 15 mm: α = 9.1° and Ω = 0.079, which is 0.63% of all directions. At 8 mm: 16.7° and 2.1%.")
EQ['share']=card('How scatter costs counts',r"N_F=B\,\frac{F}{F+S}\qquad\qquad \frac{\delta N_F}{N_F}=\frac{1}{\sqrt{N_F}}",
 [("B","The number of counts the detector takes at one point of the scan: its working count rate times the time spent on the point."),("F,\\ S","The rates at which fluorescence and scatter reach the sensor."),("N_F","The fluorescence counts recorded at that point."),(r"\delta N_F","The random scatter in that number from one try to the next.")],
 "With the beam turned down until the detector is at its working rate, the counts are shared out between fluorescence and scatter. Whatever scatter takes, fluorescence loses. Counting is random, and the noise on N counts is √N. So the noise on each point of the scan grows as the fluorescence share shrinks.",
 "With B = 3,000 and no scatter: 3,000 counts and 1.8% noise. With scatter equal to the fluorescence: 1,500 counts and 2.6%. With twenty times as much scatter: 143 counts and 8.4%.")

G=[
 dict(key='overview',title='How NE-CAT Works',name='How NE-CAT works',kicker='NE-CAT · Sector 24 · Advanced Photon Source',h1='How NE-CAT works',
  lede="NE-CAT runs two X-ray beamlines, 24-ID-C and 24-ID-E, at the Advanced Photon Source. Electrons circling the storage ring pass through rows of magnets and give off a narrow beam of X-rays. A silicon crystal picks out one energy, mirrors focus the beam to a few microns, and it lands on a protein crystal. This guide follows the X-rays from the ring to the detector.",
  hero='stations',table=True,
  sections=[
   dict(id='ring',nav='The ring',h2='It starts with electrons in a ring',prose=[
     "The APS storage ring is a 1.1 km circle of magnets that holds a beam of electrons moving at almost the speed of light. The electrons travel in bunches, and each bunch goes round about 270,000 times a second. The guide {guide:aps} follows the electrons from the gun to the ring and explains how the ring holds them.",
     '<span data-d="ringSum">With the 24-ID-C after the upgrade settings, the ring holds 200 mA of electrons at 6 GeV. Each electron carries 11,742 times its rest energy.</span>',
     "The electrons give off X-rays wherever their path is bent. NE-CAT is at sector 24 of the ring. In the straight part of that sector the electrons pass through two undulators, one after the other. Each undulator makes X-rays while the electrons are inside it, and each feeds one beamline: the first 24-ID-C, the second 24-ID-E.",
     "The APS Upgrade replaced the ring's magnets with a new arrangement. The old ring shut down in April 2023. The energy came down from 7 to 6 GeV and the current doubled from 100 to 200 mA. The biggest change is to the electron beam itself: it went from 280 µm wide to about 15 µm, and its electrons now travel far more nearly parallel. A smaller, straighter electron beam makes a smaller, brighter X-ray beam."],
    items=[('fig','ring'),('eqs',['gamma'])]),
   dict(id='undulator',nav='Undulator',h2='The undulator makes the electrons wiggle',prose=[
     "An undulator is two rows of permanent magnets, one above and one below the electron beam, with poles that alternate every half period. Between the rows the magnetic field points up, then down, then up again along the device.",
     "A magnetic field pushes a moving charge sideways. So as an electron flies through, it is pushed left, then right, then left, and traces a gentle wiggle in the horizontal plane. Every time its path bends, it gives off light.",
     '<span data-d="undSum">For 24-ID-C after the upgrade, each magnet period is 3.0 cm long. The wiggle is only 0.75 µm to either side.</span>',
     "The two rows can be moved toward or away from each other. The space between them is called the gap, and it sets how strong the field is on the beam. A smaller gap gives a stronger field and a bigger wiggle. In the figure, the gap is the first slider."],
    items=[('fig','und'),('eqs',['bfield','force','path','K','gapeq'])]),
   dict(id='xrays',nav='X-rays',h2='Why centimetre magnets make Ångström X-rays',prose=[
     "A wiggle a few centimetres long should give off radio waves a few centimetres long. It gives off X-rays because the electron is travelling almost as fast as the light it emits.",
     "Picture a race. Each time the electron starts a new magnet period it sends out a new wave crest. The light is only very slightly faster than the electron, so by the time the next crest is launched, the first one is only a tiny distance ahead. The crests end up packed close together, and closely packed crests are short-wavelength light.",
     '<span data-d="xraySum">For 24-ID-C after the upgrade, a 3.0 cm magnet period comes out as light of about 1.09 Å.</span>',
     "The beamline tunes the energy by opening and closing the gap between the magnet rows. A smaller gap means a stronger field and a bigger wiggle. A bigger wiggle slows the electron's forward progress a little, the crests spread out, and the photon energy drops."],
    items=[('fig','slip'),('eqs',['slip','frames','undeq'])]),
   dict(id='harmonics',nav='Harmonics',h2='Harmonics: one undulator, a ladder of energies',prose=[
     "So far the undulator has made light of one wavelength. In fact it makes a ladder of energies at the same time. The lowest is called the fundamental, or first harmonic. Above it comes light at 3, 5, 7 … times that energy. These are the higher harmonics.",
     "They come from the shape of the wave. When the field is weak the electron sways gently, and the electric field arriving on the axis is a smooth sine wave. A sine wave is a single energy. When the field is strong the electron swings through an angle wider than its own narrow cone of light. Someone on the axis is then lit only in a brief flash each time the electron points straight at them, which happens twice in every magnet period. The wave becomes a row of sharp spikes. A spiky wave is a smooth wave with faster ripples added at exact multiples of its rhythm, and those ripples are the harmonics.",
     "Each flash points the opposite way to the one before, because the electron is swinging back. For that reason only the odd multiples survive on the axis. The even ones cancel there and show up only off to the side.",
     "Closing the gap does two things. It slows the electron's forward progress, so every harmonic slides down in energy together. It also makes the wave spikier, which moves brightness out of the fundamental and into the higher harmonics. Opening the gap does the reverse. A beamline chooses the harmonic that is bright at the energy it wants.",
     '<span data-d="harmSum">For 24-ID-C after the upgrade, 12.662 keV is taken from harmonic 3 with K = 1.84.</span>',
     "All the harmonics travel down the beamline together. The monochromator of {step:mono} passes the one that is wanted. Light at a whole multiple of the chosen energy can also satisfy Bragg's law in the same crystal. The mirrors of {step:focus} reflect only below a cutoff energy, and that removes most of it."],
    items=[('fig','harm'),('eqs',['odd','fn']),('fig','calc'),('eqs',['work'])]),
   dict(id='cone',nav='The beam',h2='Relativity also makes the beam narrow',prose=[
     "The electron gives off light in all directions, as it sees things. Seen from the lab, the electron's speed sweeps nearly all of that light forward into a narrow cone, like the headlight of a fast train. The faster the electron, the narrower the cone.",
     "An undulator narrows it further. Light from every one of its periods adds up in step only very close to the axis, so the bright centre of the beam is much narrower than the cone from a single wiggle.",
     '<span data-d="coneSum">For 24-ID-C after the upgrade, the cone from one wiggle is about 85 µrad wide and the bright centre about 10 µrad.</span>',
     "The electrons in the bunch are not all pointing in exactly the same direction, and that spread blurs the X-ray beam. This is where the upgrade shows most. In the old ring the horizontal spread was as large as the bright centre of the beam. In the new ring it is several times smaller."],
    items=[('fig','rel'),('eqs',['headlight','pattern','cone','ebeam'])]),
   dict(id='mono',nav='Monochromator',h2='A silicon crystal picks one energy',prose=[
     "The light from the undulator is bright but not a single energy. The monochromator, or mono, selects one. It is a perfect crystal of silicon. X-rays bounce off the layers of atoms inside it, and the reflections from all the layers add up only when the wavelength and the angle match. Turn the crystal and a different energy gets through.",
     "24-ID-C uses a channel-cut crystal: a single block of silicon with a slot cut in it. The beam bounces off one wall of the slot and then the other, and leaves travelling in its original direction. Because both walls are part of one crystal they are always exactly parallel, which makes the mono very stable. 24-ID-C can be tuned across a wide range of energies. 24-ID-E uses a different cut of silicon and stays at one energy, 12.662 keV, which suits selenium.",
     '<span data-d="monoSum">For 24-ID-C after the upgrade: Si(111), set to a Bragg angle of 8.98° for 12.662 keV.</span>'],
    items=[('fig','monoLite'),('eqs',['bragg','ccgeo'])]),
   dict(id='focus',nav='Mirrors',h2='Mirrors focus the beam onto the crystal',prose=[
     "X-rays pass straight through ordinary lenses and mirrors. They do reflect from a very smooth surface if they strike it at a very shallow angle, a fraction of a degree. A gently curved mirror used this way can focus them.",
     "24-ID-C uses a pair of such mirrors, one behind the other. One focuses the beam in height and the other in width. This arrangement is called a Kirkpatrick-Baez pair, or KB mirrors. Together the mirrors form a small image of the X-ray source on the sample.",
     '<span data-d="focusSum">Published focus for 24-ID-C after the upgrade: 23 × 5 µm (h × v).</span>',
     "Apertures just before the sample can then trim the beam to match the size of the crystal."],
    items=[('fig','kb'),('eqs',['demag'])]),
   dict(id='endstation',nav='The sample',h2='At the sample',prose=[
     "The protein crystal is a fraction of a millimetre across. It sits in a small loop on the end of a pin, held at about 100 K in a stream of cold nitrogen gas. A goniometer holds the pin and rotates the crystal in the beam. 24-ID-C has an MD3-UP goniometer, which turns the crystal about a vertical axis. 24-ID-E has an MD2.",
     "Most of the beam passes straight through the crystal and is caught by a small beamstop. A small part is diffracted by the ordered molecules in the crystal into thousands of separate rays. A large area detector behind the sample records where they land: an EIGER2 XE 16M on 24-ID-C and an EIGER 16M on 24-ID-E. As the crystal rotates, the detector collects the pattern of spots from which the structure is worked out.",
     "A second, much smaller detector sits beside the sample. It measures the energy of each X-ray it receives, and is used to find which elements are in the crystal and to scan across an absorption edge. The beam's polarization decides where that detector should go. The guide {guide:polarization} explains where the polarization comes from, and the guide {guide:scatter} explains how to use it."],
    items=[('fig','diff'),('eqs',['resol'])]),
  ],
  further='''        <li><a href="https://xdb.lbl.gov/Section2/Sec_2-1.html" target="_blank" rel="noopener">X-ray Data Booklet, section 2.1: Characteristics of synchrotron radiation (K.-J. Kim)</a>. Undulator equations and cones in four pages.</li>
        <li>D. Attwood and A. Sakdinawat, <i>X-Rays and Extreme Ultraviolet Radiation</i>, chapter 5. Undulator radiation, derived by changing frames, and harmonics.</li>
        <li>P. Elleaume, J. Chavanne and B. Faatz, <i>Nucl. Instrum. Methods A</i> 455, 503 (2000). The fit of undulator field against gap.</li>
        <li>J. Als-Nielsen and D. McMorrow, <i>Elements of Modern X-ray Physics</i>. Sources, mirrors, perfect-crystal reflection.</li>
        <li><a href="https://www.aps.anl.gov/sites/www.aps.anl.gov/files/APS-Uploads/Aps-Upgrade/FDR/Chapter%201%20-%20Executive%20Summary%20and%20Project%20Overview.pdf" target="_blank" rel="noopener">APS Upgrade Final Design Report, chapter 1</a>. Ring parameters before and after the upgrade.</li>
        <li><a href="https://necat.chem.cornell.edu/wp-content/uploads/2026/05/2022-winter.pdf" target="_blank" rel="noopener">NE-CAT Communications, Winter 2022</a> and the <a href="https://necat.chem.cornell.edu/facilities/" target="_blank" rel="noopener">NE-CAT facilities page</a>. Undulators, energy ranges, beam sizes, goniometers and detectors.</li>
        <li>APS beamline directory entries for <a href="https://www.aps.anl.gov/Beamlines/Beamline-Directory/86" target="_blank" rel="noopener">24-ID-C</a> and <a href="https://www.aps.anl.gov/Beamlines/Beamline-Directory/93" target="_blank" rel="noopener">24-ID-E</a>.</li>'''),

 dict(key='polarization',title='APS Beam Polarization',name='Why the beam is polarized',kicker='NE-CAT guides · beam polarization',h1='Why the X-ray beam is polarized',
  lede="The undulator makes each electron wiggle sideways. A charge that wiggles sideways gives off light whose electric field also points sideways. Relativity squeezes that light into a narrow beam without turning the field, and the beamline optics leave it alone. So the beam reaches the sample with its electric field horizontal and across the beam. This guide follows that one property from the source to the sample.",
  hero='hero',table=False,
  sections=[
   dict(id='wave',nav='Polarization',h2='Polarization is the direction the electric field swings',prose=[
     "Light is a wave of electric and magnetic field. The electric field <b>E</b> swings back and forth at right angles to the direction the light is travelling. Polarization is the name for the direction of that swing.",
     "If the field swings along one fixed line, the light is <i>linearly polarized</i>. If it has two perpendicular swings that are out of step, the tip of the field traces an ellipse, or a circle. The beam at NE-CAT is linearly polarized, and the line is horizontal."],
    items=[('fig','wave'),('eqs',['wave','hc','P'])]),
   dict(id='dipole',nav='Radiating charge',h2='A wiggling charge radiates along its wiggle',prose=[
     "Light is given off whenever an electric charge is shaken. Two facts about that light are all this guide needs.",
     "First, the electric field of the light points along the direction the charge is being shaken, as seen from where you stand. Shake a charge left and right, and someone in front of it receives light whose field swings left and right.",
     "Second, no light goes out along the line of the shaking itself. Someone standing exactly to the left or right of that charge sees nothing. The light goes out in the shape of a doughnut, with the hole along the direction of the shaking."],
    items=[('fig','dip'),('eqs',['erad','larmor'])]),
   dict(id='wiggle',nav='Undulator',h2='The undulator shakes the electrons horizontally',prose=[
     "In the undulator the magnetic field points up and down. A vertical magnetic field pushes a moving electron sideways, never up or down. So the electron's wiggle lies entirely in the horizontal plane.",
     "By {step:dipole}, a charge shaken horizontally gives off light whose field is horizontal. That is the whole origin of the beam's polarization. The guide {guide:overview} has more on how the undulator works and how its energy is tuned."],
    items=[('fig','und'),('eqs',['force'])]),
   dict(id='squeeze',nav='Relativity',h2='Relativity squeezes the light forward but keeps its direction',prose=[
     "The electron is moving at almost the speed of light, and that sweeps the doughnut of {step:dipole} forward into a narrow cone. The squeeze acts only along the direction of travel. It does not turn the electric field. On the axis of the beam the field is still exactly horizontal.",
     "The hole of the doughnut is still there too. It ends up as a dark ring around the beam in the horizontal plane, at an angle of 1/γ from the axis."],
    items=[('fig','rel'),('eqs',['headlight','pattern'])]),
   dict(id='purity',nav='Why not 100%',h2="Why it isn't quite 100%: off-axis light twists",prose=[
     "Exactly on the axis the field is exactly horizontal. A little way off the axis, the rule of {step:dipole} still applies, but the geometry has changed: the direction of the shaking, seen from an angle, now has a small vertical part. That part is largest on the diagonals, and it gives a four-leaf pattern of light with the wrong polarization.",
     "A beamline accepts only a small patch of light around the axis, and the mono selects the energy that belongs to the axis, so most of the twisted light never reaches the sample. What arrives is typically 95 to 99% linearly polarized.",
     '<span data-d="usePur">For 24-ID-C after the upgrade: 1/γ = 85 µrad.</span>'],
    items=[('fig','pur'),('eqs',['fieldmap','tilt','Pap','ebeam'])]),
   dict(id='optics',nav='Mono and mirrors',h2='The mono and mirrors keep it, and can even purify it',prose=[
     "A crystal treats the two polarization directions differently. The part of the field that sticks out of the plane in which the beam is turned is called σ, and it reflects fully. The part that lies in that plane is called π, and it is weakened. The reason is {step:dipole} again: the crystal's electrons are being shaken along the field, and they cannot radiate well in a direction close to their own shaking.",
     "So what the mono does to the polarization depends on which way it turns the beam. If it turns the beam up or down, the wanted horizontal field is σ and passes untouched, and the small unwanted vertical part is trimmed. If it turns the beam sideways, the wanted field is the one that is weakened.",
     "24-ID-C uses Si(111) with two reflections. 24-ID-E uses Si(220) at a fixed 12.662 keV. This guide assumes that 24-ID-C turns the beam vertically and that 24-ID-E uses a single sideways reflection. Both are assumptions to check against the real optics, and the figure lets you switch them. The focusing mirrors turn the beam through such a small angle that they make no difference."],
    items=[('fig','mono'),('eqs',['bragg','polfac','pout','mirror'])]),
   dict(id='arrive',nav='At the sample',h2='What arrives at the sample, and how to check it',prose=[
     '<span data-d="useSmp">Set for 24-ID-C after the upgrade: P = 0.982 at the sample.</span>',
     "That number rests on an assumed 0.98 from the source and on the assumed mono geometry, so it is worth measuring. The polarization shows up directly in how the sample scatters: a polarized beam sends almost no scatter along its own field direction. Comparing the scatter seen from the side with the scatter seen from above gives the polarization.",
     "The guide {guide:scatter} uses the same effect to decide where the fluorescence detector should sit."],
    items=[('fig','measure'),('eqs',['measure'])]),
  ],
  further='''        <li><a href="https://xdb.lbl.gov/Section2/Sec_2-1.html" target="_blank" rel="noopener">X-ray Data Booklet, section 2.1: Characteristics of synchrotron radiation (K.-J. Kim)</a>. Undulator cones and polarization.</li>
        <li>J. D. Jackson, <i>Classical Electrodynamics</i>, chapter 14. Radiation from an accelerated charge and its relativistic pattern.</li>
        <li>J. Als-Nielsen and D. McMorrow, <i>Elements of Modern X-ray Physics</i>, chapters 1–2 (polarization factor) and 6 (perfect-crystal reflection).</li>
        <li>J. A. Clarke, <i>The Science and Technology of Undulators and Wigglers</i>. Polarization control.</li>'''),

 dict(key='scatter',title='Scatter and Fluorescence',name='Scatter and the fluorescence detector',kicker='NE-CAT guides · scatter at the sample',h1='Where to put the fluorescence detector',
  lede="When the beam hits a crystal, three kinds of X-ray come out. There is fluorescence from the element you are looking for, and there is elastic and Compton scatter from everything else. The fluorescence detector counts all three. Because the beam is polarized, there is one direction that receives almost no scatter: horizontal, at 90° to the beam. This guide shows why, how close the detector should sit, and what it costs to put it anywhere else.",
  hero='tri',table=False,
  sections=[
   dict(id='three',nav='Three signals',h2='What comes off the sample',prose=[
     "<b>Fluorescence.</b> An atom absorbs an X-ray, and a moment later gives off one of its own at an energy that identifies the element. This is the signal you want. The atom keeps no memory of where the first X-ray came from, so fluorescence goes out equally in all directions.",
     "<b>Elastic scatter.</b> An X-ray bounces off the electrons in the sample and keeps all its energy. It shows up at the energy of the beam.",
     "<b>Compton scatter.</b> An X-ray bounces off an electron and knocks it away, losing a little energy as it does. It shows up just below the energy of the beam.",
     "The detector in this guide is the fluorescence detector: the small SDD beside the sample, which measures the energy of every X-ray it receives. It is not the large area detector downstream that records the diffraction pattern. The SDD can tell the three kinds apart by their energies. What it cannot do is count without limit. When too many X-rays arrive, the beam has to be turned down, and from then on every scatter count takes the place of a fluorescence count.",
     '<span data-d="seSum">One selenium atom just above its edge gives off as much Kα as the scatter from a large amount of protein and water.</span>'],
    items=[('fig','spec'),('eqs',['fluor','seyield','comptonE'])]),
   dict(id='thomson',nav='The ideal spot',h2='A polarized beam leaves one direction dark',prose=[
     "The beam's electric field is horizontal and across the beam. It shakes every electron in the sample along that line. A shaken electron gives off light in the shape of a doughnut, with no light at all along the line of the shaking.",
     "So there is a direction that receives almost no scatter: along the field, which is horizontal and at 90° to the beam. A fluorescence detector placed there still receives its full share of fluorescence. The guide {guide:polarization} explains why the beam is polarized this way."],
    items=[('fig','smp'),('eqs',['thomson','where','partial'])]),
   dict(id='real',nav='Real samples',h2='Real samples: elastic and Compton scatter',prose=[
     "The polarization rule of {step:thomson} applies to both kinds of scatter. On top of it, each kind has its own dependence on angle, which comes from how the electrons in an atom act together.",
     "For elastic scatter, the electrons of an atom scatter in step with each other when the X-ray is turned through a small angle, and their contributions add up strongly. At large angles they fall out of step. So elastic scatter is very strong toward the beamstop and weak at 90° and behind.",
     "Compton scatter is the other way round. An electron can only be knocked free by a hard enough push, and a small-angle scatter is a gentle push. So Compton scatter is weak near the forward direction and strong at 90° and behind. At the ideal spot most of the little scatter that remains is Compton.",
     "Together these mean that moving the detector toward the beamstop is worse than moving it the same amount toward the source."],
    items=[('fig','sweep'),('eqs',['elastic','compton'])]),
   dict(id='cone',nav='How close',h2='How close? The sensor sees a cone, not a line',prose=[
     "The sensor is a small disc, not a point. Seen from the sample it covers a cone of directions. Only the middle of that cone looks straight along the dark direction. Its edges look a few degrees to one side, where there is some scatter.",
     "Moving the detector closer widens the cone. The fluorescence collected goes up with the area of the cone: at half the distance, four times as much. The scatter goes up faster, because a wider cone reaches further into the bright lobes. A close detector collects more of everything, in a less clean mix. A distant one sees a cleaner mix and little of it.",
     "There is a limit to how clean the mix can get. The beam is not perfectly polarized, and the unpolarized part scatters in every direction. Once the cone is narrow enough for that part to dominate, backing away loses fluorescence and gains nothing.",
     "Which end to favor depends on the sample. More fluorescence collected means less beam, and so less radiation damage, for the same counts. A cleaner mix matters when the fluorescence is weak. The design study for the new detector on 24-ID-C settled on about 15 mm from the sample to the sensor, behind an opening 2.4 mm in radius. That gives a cone of 9° half-angle, which the other figures in this guide use. These are design values, not measurements of the installed detector."],
    items=[('fig','cone'),('eqs',['solid','floor'])]),
   dict(id='cost',nav='What it costs',h2='What it costs: a noisier edge scan',prose=[
     "The usual job of this detector is an edge scan. The beam energy is stepped across the absorption edge of an element, and at each step the detector counts the fluorescence in a narrow window around that element's line. The scan shows where the edge is, and the energies for a SAD or MAD experiment are chosen from it.",
     "Scatter does not land in that window, because its energy is too high. What it does is fill the detector. The beam is turned down until the detector is counting at a rate it can handle, and if most of what it counts is scatter, most of that rate is wasted. The fluorescence counts are then few and the scan is noisy.",
     "How much this matters depends on how strong the fluorescence is to begin with. A selenomethionine crystal gives so much that the detector can be badly placed and the scan still looks fine. With one metal atom in a large complex, or a small crystal in a large drop of liquid, the placement can decide whether the edge is seen at all.",
     "If the beam is so weak that the detector never reaches its working rate, scatter costs almost nothing. The figure shows the usual case at an undulator beamline, where the beam is strong and has to be turned down."],
    items=[('fig','edge'),('eqs',['share'])]),
   dict(id='rules',nav='Rules of thumb',h2='Rules of thumb',prose=[
     "<b>Direction.</b> Put the detector in the horizontal plane at 90° to the beam. The first few degrees away from that cost little, and after that the cost climbs quickly. Staying within about 5° keeps the scatter under one and a half times its minimum, and within about 8° keeps it under twice. A small error sideways and a small error upward do not simply add: the detector's total angle from the ideal direction is what counts.",
     "<b>If it cannot go there.</b> Moving it in the horizontal plane toward the source costs the least. Lifting it costs slightly more for the same angle, and moving it toward the beamstop costs the most.",
     "<b>Distance.</b> Closer collects more fluorescence, and farther collects a cleaner mix. For a sensor opening of 2.4 mm radius, about 15 mm is a reasonable middle. Go closer for the lowest dose, and farther back when the fluorescence is weak.",
     "<b>What this guide leaves out.</b> The sample is treated as water, with every atom scattering on its own. A real sample also sends sharp reflections and diffuse scatter toward the area detector, and the loop, the pin and any ice add scatter of their own. The air along the beam path scatters too, and the detector sees some of that path unless it is shielded. Metal parts near the sample fluoresce at their own energies. None of this moves the ideal spot. It does add to the totals."],
    items=[('fig','rules')]),
  ],
  further="""        <li>J. Als-Nielsen and D. McMorrow, <i>Elements of Modern X-ray Physics</i>, chapter 1. Thomson and Compton scattering and the polarization factor.</li>
        <li>J. H. Hubbell et al., "Atomic form factors, incoherent scattering functions, and photon scattering cross sections", <i>J. Phys. Chem. Ref. Data</i> 4, 471 (1975). The tables behind the water model, taken here from the xraylib library.</li>
        <li>T. Schoonjans et al., "The xraylib library for X-ray–matter interactions", <i>Spectrochim. Acta B</i> 66, 776 (2011). The selenium absorption and fluorescence values.</li>
        <li>R. Jenkins, R. W. Gould and D. Gedcke, <i>Quantitative X-ray Spectrometry</i>. Fluorescence detection and scatter background.</li>"""),
]
exec(open('aps_guide.py').read())
G.insert(0,APS)
exec(open('xrf_guide.py').read())
# ---------- releases: update RELEASE and the date of every page that changed, and add an entry to CHANGELOG.md ----------
RELEASE=('1.6.1','November 13, 2026')
UPDATED={'aps':'November 13, 2026','overview':'November 13, 2026','polarization':'November 13, 2026','scatter':'November 13, 2026'}
CHLOG='https://github.com/APS-24ID/necat-guides/blob/main/CHANGELOG.md'
def stamp(when): return 'Last updated %s. Release %s. <a href="%s" target="_blank" rel="noopener">What changed</a>.'%(when,RELEASE[0],CHLOG)
# helpers for the Introductory guides
def _here(t,label='Here at NE-CAT.'): return '<span class="here"><b>'+label+'</b> '+t+'</span>'
# a choice between a few named states, as a row of buttons. choice() in introkit.js wires them up
def _choice(i,label,pairs,sel): return '<div class="ctl" style="grid-column:1/-1"><label id="%sL">%s</label><div class="btns" id="%s" role="group" aria-labelledby="%sL">'%(i,label,i,i)+''.join('<button type="button" data-v="%s" aria-pressed="%s">%s</button>'%(v,'true' if v==sel else 'false',t) for v,t in pairs)+'</div></div>'
# The later guides each have a file of their own. A guide whose file is not in this folder is simply left out, so the
# same scripts build the published set and a larger working set that includes guides still in draft.
import os
for _f in ['walk','syn','mx','hutch','see','detintro','det','cold','damage']:
    if os.path.exists(_f+'_guide.py'): exec(open(_f+'_guide.py').read())
_keys={g['key'] for g in G}
for g in G:
    for _k in ('short','deeper'):
        if g.get(_k) not in _keys: g.pop(_k,None)
GK={g['key']:g for g in G}
# every guide so far is written at the In-depth level; SERIES, further down, says which series each belongs to
for g in G: g.setdefault('level','In-depth')

TABLE='''  <section id="settings">
    <div class="sec-head prose">
      <h2>Beamline settings used in these guides</h2>
      <p>The Settings menu at the top of the page stays in view as you scroll. Choose 24-ID-C or 24-ID-E, before or after the APS Upgrade, and every figure, readout and worked number that depends on the ring or the beamline switches to those values. The highlighted column below is the one in use. The choice carries over when you follow a link to one of the other guides.</p>
    </div>
    <div class="tblwrap"><table class="settings" id="setTbl"></table></div>
    <div class="notes">
      <p><b>Sources.</b> Ring values: APS Upgrade Final Design Report, chapter 1, table 1.1. The after-upgrade column is the brightness mode (324 bunches). Undulator periods and energy ranges: NE-CAT Communications, Winter 2022, the NE-CAT facilities page and the APS beamline directory. Monochromator crystals: APS beamline directory. Smallest undulator gaps (10.5 mm before the upgrade, 8.5 mm after): APS Upgrade Preliminary Design Report, chapter 5, table 5.3.</p>
      <p><b>† Assumed, not taken from a published source.</b> The undulator length (2.1 m, the APS-U canted design), and from it the number of periods. The plane in which each mono turns the beam, and that 24-ID-E uses a single reflection. A polarization of 0.98 arriving at the mono. Please correct any of these that differ on the real beamlines.</p>
      <p><b>‡ Calculated in these guides</b> from the other rows. These are not machine or beamline readings. The undulator gap comes from a general fit of field against gap ({eq:gapeq}), not from the measured field of the NE-CAT undulators, so treat it as approximate.</p>
      <p><b>§ As published by NE-CAT.</b> Before the upgrade: NE-CAT Communications, Winter 2022 (1σ sizes). After: the NE-CAT facilities page. The two sources may not define beam size the same way.</p>
    </div>
  </section>
'''
SHORTNOTE='''    <div class="notes"><p>The Settings menu at the top chooses 24-ID-C or 24-ID-E, before or after the APS Upgrade. The full table of values, with their sources and the assumptions behind them, is in the guide {guide:overview}.</p></div>
'''

APSNOTE='''    <div class="notes"><p>The Fill pattern menu at the top chooses how many bunches of electrons the ring holds. The figures and worked numbers in the sections on bunches and swap-out follow it. The values used throughout, with their sources, are in the table at the end.</p></div>
'''

def compose(g):
    # numbering
    eqnum={};stepnum={}
    for si,s in enumerate(g['sections'],1):
        stepnum[s['id']]=si;k=0
        for kind,val in s['items']:
            if kind=='eqs':
                for e in val: k+=1; eqnum[e]=f'{si}.{k}'
    g['eqnum']=eqnum; g['stepnum']=stepnum
for g in G: compose(g)
def glink(k,text=None): return '<a class="guidelink" data-guide="%s" href="{{link:%s}}">%s</a>'%(k,k,text or GK[k]['name'])
def resolve(html,g):
    def eq(m):
        cap=m.group(1)=='Eq';key=m.group(2)
        if key in g['eqnum']: return ('Equation ' if cap else 'equation ')+g['eqnum'][key]
        for o in G:
            if key in o['eqnum']: return ('Equation ' if cap else 'equation ')+o['eqnum'][key]+' in the guide '+glink(o['key'])
        raise KeyError(key)
    def st(m):
        cap=m.group(1)=='Step';key=m.group(2)
        if key in g['stepnum']: return ('Step ' if cap else 'step ')+str(g['stepnum'][key])
        for o in G:
            if key in o['stepnum']: return ('Step ' if cap else 'step ')+str(o['stepnum'][key])+' in the guide '+glink(o['key'])
        raise KeyError(key)
    html=re.sub(r'\{(Eq|eq):(\w+)\}',eq,html)
    html=re.sub(r'\{(Step|step):(\w+)\}',st,html)
    html=re.sub(r'\{guide:(\w+)\}',lambda m:glink(m.group(1)),html)
    return html

# The series a guide belongs to, in reading order, and the level it is written at. A series with no guides yet is listed with a note.
SERIES=[(1,'The machine','Where do the X-rays come from?',['syn','aps'],None),
        (2,'The beamline','What does NE-CAT do with them?',['walk','overview','polarization','detintro','det','hutch'],None),
        (3,'The experiment','How does a crystal become a structure?',['see','mx','cold','damage','scatter'],None),
        (4,'The science','Why do structures matter?',[],'Guides for this series are being written. They will start with what a protein is and why its shape matters.')]
DEPTH_NOTE='Each section has a plain explanation and a figure you can adjust. The equations are folded away under the figures. Open any of them, or all of them with the button at the top, if you want the detail.'
INTRO_NOTE='Each stop has one idea and one figure to try. It takes about five minutes, and there are no equations.'
SOF={k:(num,sname) for num,sname,ask,keys,note in SERIES for k in keys}
def page(g):
    o=[]
    o.append('<title>%s</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Patrick+Hand&family=Noto+Sans+Math&display=swap">\n<style>%s</style>\n'%(g['title'],css))
    o.append('<div class="wrap">\n  <div class="bar">'+g.get('bar','<label for="preset">Settings<select id="preset"><option value="Cpost">24-ID-C · after the upgrade</option><option value="Cpre">24-ID-C · before the upgrade</option><option value="Epost">24-ID-E · after the upgrade</option><option value="Epre">24-ID-E · before the upgrade</option></select></label>')+('' if g['level']=='Introductory' else '<button id="eqAll" aria-pressed="false">Open all equations</button>')+'<button id="motionBtn" aria-pressed="false">Pause motion</button></div>\n')
    o.append('  <header class="hero">\n    <div class="kicker">%s</div>\n    <h1>%s</h1>\n    <p class="lede">%s</p>\n    <p class="lede" style="font-size:1.05rem">%s</p>\n'%(g['kicker'],g['h1'],g['lede'],INTRO_NOTE if g['level']=='Introductory' else DEPTH_NOTE+(' Short on time? '+glink(g['short'])+' is the five-minute version, with no equations.' if g.get('short') else '')))
    if g['hero']: o.append(FIG[g['hero']]+'\n')
    gi=G.index(g)+1
    o.append('    <nav class="guides" aria-label="Back to the list of guides"><a class="homelink" href="{{home}}">← Home</a><span class="lbl">Series %d · %s</span><span class="level %s">%s</span></nav>\n'%(SOF[g['key']][0],SOF[g['key']][1],'lv-intro' if g['level']=='Introductory' else 'lv-depth','5 minutes' if g['level']=='Introductory' else 'In depth'))
    o.append('    <nav class="chain" aria-label="Sections">'+('<a href="#settings">Settings</a>' if g['table'] is True else '')+''.join('<a href="#%s">%d %s</a>'%(s['id'],i,s['nav']) for i,s in enumerate(g['sections'],1))+'</nav>\n  </header>\n')
    o.append('' if g['table']=='none' else APSNOTE if g['table']=='aps' else TABLE if g['table'] else SHORTNOTE)
    for si,s in enumerate(g['sections'],1):
        o.append('\n  <section id="%s">\n    <div class="sec-head prose">\n      <div class="stepno">%d</div>\n      <h2>%s</h2>\n'%(s['id'],si,s['h2'])+''.join('      <p>%s</p>\n'%p for p in s['prose'])+'    </div>\n')
        for kind,val in s['items']:
            if kind=='fig': o.append(FIG[val]+'\n')
            else:
                o.append('    <div class="eqgroup">\n      <div class="eqlabel">The maths, if you want it</div>\n')
                for e in val:
                    o.append('    <details class="eqcard" id="eq-%s">\n      <summary class="tag"><span class="eqno">Equation %s</span><span class="eqtitle">%s</span></summary>%s    </details>\n'%(e,g['eqnum'][e],EQ[e]['title'],EQ[e]['inner']))
                o.append('    </div>\n')
        o.append('  </section>\n')
    o.append(('\n  <section id="further">\n    <div class="sec-head prose">\n      <h2>One thing to remember</h2>\n      <p class="remember">'+g['remember']+'</p>\n      <p>'+('A longer guide to this subject, with the equations and the real numbers, is being written.' if not g.get('deeper') else g['more']%glink(g['deeper'],GK[g['deeper']]['h1']) if g.get('more') else 'Want the details, with the equations and the real numbers? Go deeper with the guide '+glink(g['deeper'],GK[g['deeper']]['h1'])+'.')+'</p>\n      <details class="classroom"><summary>For a class</summary><ul>'+''.join('<li>%s</li>'%q for q in g['classroom'])+'</ul></details>\n    </div>\n' if g['level']=='Introductory' else '\n  <section id="further">\n    <div class="sec-head prose">\n      <h2>Where to go deeper</h2>\n      <ul class="refs">\n'+g['further']+'\n      </ul>\n    </div>\n')+'    <nav class="guides" aria-label="Where to go next" style="justify-content:center;margin-top:28px"><a class="homelink" href="{{home}}">← Home</a>'+('<a class="guidelink" data-guide="%s" href="{{link:%s}}">Next: %s →</a>'%(G[gi]['key'],G[gi]['key'],G[gi]['name']) if gi<len(G) else '')+'</nav>\n    <div class="notes" style="text-align:center;margin-top:18px"><p>'+stamp(UPDATED[g['key']])+'<br>'+ACK+'<br>© 2026 NE-CAT, Cornell University. Released under the <a href="https://github.com/APS-24ID/necat-guides/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>.</p></div>\n  </section>\n</div>\n')
    html=resolve(''.join(o),g)
    # a label holding a subscript is wrapped so that it stays one piece in the flex row
    html=re.sub(r'(<label for="\w+">)((?:(?!<output|</label>).)*<sub>(?:(?!<output|</label>).)*?)(\s*<output|</label>)',lambda m:m.group(1)+'<span>'+m.group(2)+'</span>'+m.group(3),html)
    return html
for g in G:
    html=page(g)
    left=re.findall(r'\{(?:eq|Eq|step|Step|guide):\w+\}',html); assert not left,left
    open('body-%s.html'%g['key'],'w').write(html)
    print(g['key'],len(html),'eqs',len(g['eqnum']))
json.dump({g['key']:dict(title=g['title'],name=g['name']) for g in G},open('guides.json','w'))

# ---------- the landing page ----------
open('style.css','w').write(css)
CARDS=[('syn','csCv','Five minutes','How a synchrotron makes X-rays, in five stops and five minutes, with no equations. Electrons at almost the speed of light, the magnets that hold them in a ring, the light they give off when they turn, and what the APS Upgrade changed.',['Speed','The ring','X-rays','Flashes','A new ring']),
       ('aps','c0Cv','Go deeper','Where the electrons come from and how the ring holds on to them. The gun and the linac, the accumulator ring and the booster, the magnets that keep the beam small, the RF that pays back its energy, and swap-out injection.',['Gun and linac','Booster','Seven-bend lattice','RF and bunches','Swap-out']),
       ('walk','cwCv','Five minutes','The whole beamline in five stops and five minutes, with no equations. Where the X-rays come from, how one energy is picked out, how the beam is squeezed, what the sample is, and what the detector sees.',['Magnets','One energy','Mirrors','The crystal','The detector']),
       ('overview','c1Cv','Then the beamline','From the storage ring to the detector. How the electrons make X-rays, how the undulator gap and its harmonics set the energy, and what the monochromator, the mirrors and the sample station each do.',['The storage ring','Undulator and harmonics','Monochromator','KB mirrors','Diffraction']),
       ('polarization','c2Cv','Go deeper',"The beam's electric field swings from side to side, and almost never up and down. This guide follows that one property from the wiggling electron to the sample, and shows why it is not quite 100%.",['A shaken charge','Relativity','Off-axis light','Mono and mirrors','Measuring it']),
       ('detintro','cpCv','Five minutes','How the detector records the spots, in four stops and five minutes, with no equations. Eighteen million pixels, each counting X-rays one at a time, with no pause between images, at a distance chosen for each crystal.',['Pixels','Counting','Speed','Distance']),
       ('det','cqCv','Go deeper','What happens between an X-ray entering the detector and a counter going up by one, and what it means for the data: how much of the beam is caught, charge sharing and the threshold, count rates, counting statistics, and the choice of detector distance.',['Silicon sensor','Charge sharing','Dead time','Counting statistics','Geometry']),
       ('hutch','chCv','Five minutes','Why the experiment sits in a closed steel room, how little steel it takes to stop these X-rays, and how the door and the beam shutter are locked together. Four stops, no equations.',['Stray X-rays','Steel walls','The interlock','Working from outside']),
       ('see','ceCv','Five minutes','How X-rays and a crystal show where every atom in a protein is, in four stops and five minutes, with no equations. Why light cannot do it, what the crystal is for, how the spots become a map, and how atoms are fitted into it. The protein in the figures is myoglobin.',['Too small','A crystal','Spots to map','Atoms']),
       ('mx','cmCv','Then the experiment','What macromolecular crystallography is, and how it gets from a crystal to a structure. Why a crystal is needed, what the spots are, the phase problem, the electron density map, and how a model is refined and judged.',['Why structures','Why a crystal','Spots as waves','The phase problem','Map and model']),
       ('cold','ccCv','Five minutes','What X-rays do to a crystal, why keeping it at 173 degrees below zero makes it last, and how a crystal that is half water is cooled without turning to ice. Four stops, no equations.',['Damage','Cold','No ice','How cold']),
       ('damage','cdCv','Go deeper','From the absorption of one photon to the fading of the pattern. Dose and how to estimate it, the 30 MGy limit, the groups that are damaged first, why 100 K, and how to spend the dose a crystal can take.',['Absorption','Dose','The 30 MGy limit','Specific damage','Why 100 K']),
       ('scatter','c3Cv','Put it to work','What X-ray fluorescence is, which atoms in a protein crystal give it, and what it is used for: edge scans for phasing, and finding out which metal is there. Then where the fluorescence detector has to sit to see it clearly.',['How an atom fluoresces','Which atoms','Edges and lines','The edge scan','Where the detector goes'])]
CARDS=[c for c in CARDS if c[0] in GK]
SERIES=[(n,sn,ask,[k for k in keys if k in GK],note) for n,sn,ask,keys,note in SERIES]
CK={c[0]:c for c in CARDS}
def home(variant='A'):
    o=['<title>NE-CAT Beamline Guides</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Patrick+Hand&display=swap">\n<style>%s'%css]
    o.append('''
.balloon{font-family:var(--f-hand);font-size:1.2rem;line-height:1.35;background:var(--card);border:2.5px solid var(--ink);border-radius:18px;padding:10px 18px;max-width:60ch;position:relative;justify-self:start}
.balloon::before{content:"";position:absolute;left:34px;top:-14px;border:7px solid transparent;border-bottom-color:var(--ink)}
.balloon::after{content:"";position:absolute;left:36px;top:-8.5px;border:5px solid transparent;border-bottom-color:var(--card)}
.series{padding-block:26px 6px}
.serieshead{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;border-top:2.5px solid var(--ink);padding-top:14px}
.serieshead h2{font-size:1.7rem;margin:0}
.serieshead .ask{font-family:var(--f-hand);font-size:1.25rem;color:var(--muted);flex-basis:100%;margin:0 0 0 calc(2.4rem + 14px)}
.card[hidden]{display:none}
/* the color of a guide's level: yellow for the five-minute guides, black for the in-depth ones. Used on the cards, the chooser and the guide pages */
.band{font-family:var(--f-hand);font-size:1.1rem;letter-spacing:.1em;text-transform:uppercase;padding:3px 16px;border-bottom:2.5px solid var(--ink)}
.lv-intro .band{background:var(--cap)}
.lv-depth .band{background:var(--ink);color:var(--paper)}
.card.lv-intro,.card.lv-depth{grid-template-rows:auto auto 1fr}
.sw{display:inline-block;width:.85em;height:.85em;border:2px solid var(--ink);margin-right:8px;vertical-align:-1px}
.sw-intro{background:var(--cap)}
.sw-depth{background:var(--ink);border-color:var(--paper)}
.tracks{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-top:22px;font-family:var(--f-hand);font-size:1.2rem}
.tracks .lbl{text-transform:uppercase;letter-spacing:.06em;margin-right:4px}
.tracks button{font-size:1.2rem;padding:4px 16px}
.tracks button[aria-pressed="true"]{background:var(--red);color:#fff}
.tracks ~ section .cards{grid-template-columns:repeat(auto-fill,minmax(min(400px,100%),1fr))}
.shelf{font-family:var(--f-hand);font-weight:400;font-size:1.2rem;letter-spacing:.06em;text-transform:uppercase;margin:18px 0 0}
.shelf+.cards{padding-top:10px}
.cards.topic{padding-block:14px 4px}
.soon{font-family:var(--f-hand);font-size:1.15rem;line-height:1.4;border:2.5px dashed var(--ink);padding:10px 16px;max-width:62ch;margin:16px 0 0}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr));gap:22px;padding-block:18px 12px}
.cards.one{grid-template-columns:minmax(0,min(100%,calc(50% - 11px)))}
@media (max-width:860px){.cards.one{grid-template-columns:1fr}}
.card{background:var(--card);border:2.5px solid var(--ink);display:grid;grid-template-rows:auto 1fr;box-shadow:6px 6px 0 var(--ink);transition:transform .12s,box-shadow .12s}
.card:hover,.card:focus-within{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--ink)}
.card canvas{width:100%;display:block;background:var(--sky);border:0;border-bottom:2.5px solid var(--ink)}
.cardbody{padding:14px 16px 16px;display:grid;gap:10px;align-content:start}
.cardhead{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.cardhead .tagline{font-family:var(--f-hand);font-size:1rem;letter-spacing:.06em;text-transform:uppercase;background:var(--cap);border:2px solid var(--ink);padding:0 8px}
.card h2{font-size:1.5rem}
.card h2 a{color:inherit;text-decoration:none}
.card h2 a::after{content:"";position:absolute;inset:0}
.card{position:relative}
.card p{font-size:1rem;line-height:1.5;margin:0}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px;font-family:var(--f-hand);font-size:.95rem}
.chips li{border:2px solid var(--ink);padding:0 8px;background:var(--paper)}
.go{font-family:var(--f-hand);font-size:1.1rem;justify-self:start;background:var(--red);color:#fff;border:2.5px solid var(--ink);padding:2px 14px;margin-top:4px}
.card:hover .go{background:var(--ink)}
.tips{display:grid;grid-template-columns:repeat(auto-fit,minmax(176px,1fr));gap:16px;padding-block:10px 8px}
.tip{border-top:2.5px solid var(--ink);padding-top:10px}
.tip h3{font-size:1.1rem;margin-bottom:6px}
.tip p{font-size:.98rem;line-height:1.5;margin:0}
.foot{margin-top:36px;padding-block:16px 40px;border-top:2.5px solid var(--ink);font-size:.93rem;color:var(--muted);max-width:78ch}
@media (prefers-reduced-motion:reduce){.card{transition:none}}
</style>
<div class="wrap">
  <div class="bar"><button id="motionBtn" aria-pressed="false">Pause motion</button></div>
  <header class="hero">
    <div class="kicker">NE-CAT · Sector 24 · Advanced Photon Source</div>
    <h1>Welcome to the <span style="white-space:nowrap">NE-CAT</span> beamline guides</h1>
    <p class="lede">Illustrated guides, with figures you can operate, to what happens between the electron gun and your structure. They are grouped in series that follow the experiment: the machine that makes the X-rays, the beamline that delivers them, the experiment itself, and the science it serves.</p>
    <div class="panel">
      <canvas id="homeCv" aria-label="Animation: electrons circle the storage ring, an undulator turns their motion into X-rays, the X-rays strike a crystal, and diffraction spots appear on the detector"></canvas>
    </div>
    <p class="balloon">New here? Start at the top and read straight through. Back for one thing? Each guide stands on its own, so jump in anywhere.</p>
  </header>

  <main>
''')
    def cardhtml(key):
        key,cv,tagline,desc,chips=CK[key]; g=GK[key]; intro=g['level']=='Introductory'
        if not variant:
            head='<div class="cardhead"><span class="tagline">%s</span><span class="level">%s</span></div>'%(tagline,g['level']); rib=''; cls=''
        else:
            head=''; rib='<div class="band">%s</div>'%('5 minutes' if intro else 'In depth'); cls=' lv-intro" data-level="intro' if intro else ' lv-depth" data-level="depth'
        return '''    <article class="card%s">%s
      <canvas id="%s" aria-hidden="true"></canvas>
      <div class="cardbody">
        %s
        <h2><a href="{{link:%s}}">%s</a></h2>
        <p>%s</p>
        <ul class="chips">%s</ul>
        <span class="go">Open the guide →</span>
      </div>
    </article>
'''%(cls,rib,cv,head,key,g['h1'],desc,''.join('<li>%s</li>'%x for x in chips))
    def grid(keys,extra=''): return '    <div class="cards%s%s">\n'%(' one' if len(keys)==1 else '',extra)+''.join(cardhtml(k) for k in keys)+'    </div>\n'
    if variant=='A': o.append('  <div class="tracks" id="trackSel" role="group" aria-label="Which guides to show"><span class="lbl">Show</span><button type="button" data-v="all" aria-pressed="true">Everything</button><button type="button" data-v="intro" aria-pressed="false"><span class="sw sw-intro"></span>Five-minute guides</button><button type="button" data-v="depth" aria-pressed="false"><span class="sw sw-depth"></span>In-depth guides</button></div>\n')
    for num,sname,ask,keys,note in SERIES:
        o.append('''  <section class="series" aria-label="Series %d: %s">
    <div class="serieshead"><div class="stepno">%d</div><h2>%s</h2><p class="ask">%s</p></div>
'''%(num,sname,num,sname,ask))
        if variant=='B':
            # option B: two shelves in each series, the short guides first
            for lvl,name in (('Introductory','Five-minute guides'),('In-depth','In-depth guides')):
                ks=[k for k in keys if GK[k]['level']==lvl]
                if ks: o.append('    <h3 class="shelf">%s</h3>\n'%name+grid(ks))
        elif variant=='C':
            # option C: one row for each topic, the short guide beside its in-depth partner
            done=set()
            for k in keys:
                if k in done: continue
                p=GK[k].get('deeper') if GK[k]['level']=='Introductory' else GK[k].get('short')
                pair=[k,p] if p in keys and (GK[p].get('short')==k or GK[p].get('deeper')==k) and GK[p]['level']!=GK[k]['level'] else [k]
                pair.sort(key=lambda q:GK[q]['level']!='Introductory'); done.update(pair)
                o.append(grid(pair,' topic'))
        elif keys:
            o.append(grid(keys))
            if variant=='A': o.append('    <p class="soon nonehere" hidden>No guide of this kind in this series yet.</p>\n')
        if note: o.append('    <p class="soon">%s</p>\n'%note)
        o.append('  </section>\n')
    o.append('''
  <section aria-label="How to use the guides" style="padding-top:26px">
    <div class="sec-head prose"><h2>How the guides work</h2></div>
    <div class="tips">
      <div class="tip"><h3>Two levels</h3><p>Yellow marks the five-minute guides, which have no equations. Black marks the in-depth guides, which include the equations and worked numbers. The buttons at the top of this page show one kind or the other.</p></div>
      <div class="tip"><h3>Pick your beamline</h3><p>The Settings menu at the top of %s switches the figures and the worked numbers between 24-ID-C and 24-ID-E, before and after the APS Upgrade. Your choice follows you from one guide to the next.</p></div>
      <div class="tip"><h3>Play with the figures</h3><p>Most figures have sliders, and many of them move. Drag things around and see what changes. Nothing here can break.</p></div>
      <div class="tip"><h3>Open the math if you want it</h3><p>Every equation is folded away under its figure, with a plain reading of what it says and a worked number. One button opens them all.</p></div>
      <div class="tip"><h3>Check the fine print</h3><p>Values that are assumed or calculated, and not taken from a published source, are marked in the tables of %s. Corrections are welcome.</p></div>
    </div>
  </section>
  </main>

  <footer class="foot">NE-CAT, the Northeastern Collaborative Access Team, operates beamlines 24-ID-C and 24-ID-E for macromolecular crystallography at the Advanced Photon Source, Argonne National Laboratory. These guides were written for its users and staff. They work on a phone, but the figures are easier to explore on a larger screen.<br>'''%(names([g['key'] for g in G if g['table'] in (True,False)]),names(['aps','overview']))+stamp(RELEASE[1])+'''<br>'''+ACK+'''<br>© 2026 NE-CAT, Cornell University. Released under the <a href="https://github.com/APS-24ID/necat-guides/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>.</footer>
</div>
''')
    return ''.join(o)
def names(keys):
    n=['<i>%s</i>'%GK[k]['h1'] for k in keys]
    return n[0] if len(n)==1 else ', '.join(n[:-1])+' and '+n[-1]
GK={g['key']:g for g in G}
open('body-home.html','w').write(home())
# what build.js needs to know about each page for its link-preview tags
json.dump({key:dict(title=GK[key]['title'],name=GK[key]['name'],h1=GK[key]['h1'],desc=desc) for key,cv,tag,desc,chips in CARDS},open('guides.json','w'))
print('home ok')
