# ---------- guide: How APS works (the machine as it runs today) ----------
ACK='The NE-CAT beamlines are funded by the National Institute of General Medical Sciences from the National Institutes of Health (P30 GM124165).'
# who made the guides: shown at the foot of every page
MADE='The text, figures and code of these guides were written with Claude, an AI model made by Anthropic, under the direction of NE-CAT, which reviews them.'

EQ['a_gain']=card('Energy from riding the wave',r"\Delta E=e\,E_0\,L\,\cos\phi",
 [("E_0","The peak electric field of the wave."),("L","The length of the linac."),(r"\phi","How far the bunch sits from the crest of the wave, as an angle. A full wave is 360°.")],
 "The electron keeps pace with the wave, so it feels the same field all the way along. On the crest it gains the most. Off the crest it gains less, and a quarter of a wave away it gains nothing at all.",
 "The APS linac delivers 425 MeV. With the bunch 30° off the crest it would deliver 425 × cos 30° = 368 MeV.")
EQ['a_gamma']=card('How fast is 425 MeV?',r"\gamma=\frac{E}{mc^{2}}\qquad\qquad 1-\frac{v}{c}\approx\frac{1}{2\gamma^{2}}",
 [(r"\gamma","The electron's energy in units of its rest energy, 0.511 MeV."),("v","Its speed. c is the speed of light.")],
 "Once γ is large, the speed is so close to the speed of light that more energy barely changes it. What keeps growing is the electron's momentum, and momentum is what a magnet has to work against.",
 "At 425 MeV, γ = 832 and the electron is slower than light by about 216 m/s. At 6 GeV, γ = 11,742 and the gap is 1.1 m/s.")
EQ['a_charge']=card('Counting electrons',r"Q=N\,e\qquad\qquad 1\ \text{nC}=6.24\times10^{9}\ \text{electrons}",
 [("Q","The charge of a bunch, in nanocoulombs (nC)."),("N","The number of electrons in it."),("e","The charge of one electron, 1.602×10<sup>−19</sup> coulomb.")],
 "The charge of a bunch is a head count. One burst from the linac is about 1 nC. The accumulator ring can collect up to twenty of them into a single bunch.",
 "A fresh bunch for timing mode holds about 12 nC, which is 7.5×10<sup>10</sup> electrons.")
EQ['a_brho']=card('Why the magnets must ramp',r"B\,\rho=\frac{p}{e}\qquad\Longrightarrow\qquad B[\text{T}]\;\rho[\text{m}]=3.336\;E[\text{GeV}]",
 [("B","The field in a bending magnet."),(r"\rho","The radius of the curve the electron follows in that field."),("p","The electron's momentum, which at these energies is its energy divided by c.")],
 "A magnet bends a fast electron into a curve whose radius grows with the electron's momentum. To hold the same curve as the energy climbs, the field has to climb in proportion. In the booster the field rises fourteen-fold while the bunch goes from 425 MeV to 6 GeV.",
 "At 6 GeV, Bρ = 20.0 T·m. A 0.5 T magnet bends the beam on a radius of 40 m.")
EQ['a_lens']=card('A quadrupole is a lens',r"\Delta x'=-\frac{x}{f}\qquad\qquad \frac{1}{f}=\frac{g\,\ell}{B\rho}",
 [("x","The electron's distance from the ideal path."),("x'","The angle of its path to the ideal one. Δx′ is the change the magnet makes to it."),("g","How fast the field grows with distance from the center of the magnet, in tesla per meter."),(r"\ell","The length of the magnet."),(r"B\rho","The beam's stiffness, from {eq:a_brho}.")],
 "The field in a quadrupole is zero on the ideal path and grows with distance from it. An electron on the path is left alone. One that has strayed is turned back by an amount in proportion to how far it strayed, which is what a lens does to a ray of light. Up and down, the same magnet does the opposite and pushes strays further out.",
 "For illustration: a gradient of 80 T/m over 0.25 m at 6 GeV gives f = 20.0 / (80 × 0.25) = 1.0 m.")
EQ['a_stable']=card('When alternating lenses hold the beam',r"0<\frac{L}{2f}<1",
 [("L","The distance from one lens to the next."),("f","The focal length of each lens. They are equally strong and alternate between focusing and defocusing.")],
 "A row of lenses that alternately focus and defocus holds the beam only between two limits. Too weak, and the beam is barely held and grows wide. Too strong, and each lens over-corrects, the swings build up from one lens to the next, and the beam is lost. The figure shows both.")
EQ['a_emit']=card('Why more bends give a smaller beam',r"\varepsilon_x\;\propto\;\gamma^{2}\,\theta^{3}\qquad\Longrightarrow\qquad \varepsilon_x\;\propto\;\frac{E^{2}}{N^{3}}",
 [(r"\varepsilon_x","The horizontal emittance: the beam's width multiplied by the spread in the directions of its electrons."),(r"\theta","The angle through which one bending magnet turns the beam."),("N","The number of bending magnets that share the full turn.")],
 "Halving the angle of each bend cuts the emittance eight times. Lowering the energy helps too. The figure uses this rule, pinned to the APS value at seven bends and 6 GeV. Real rings do better or worse than the simple rule. The APS does better, with its reverse bends and with bending magnets whose field changes along their length.",
 "Seven bends at 6 GeV: 42 pm. The same rule with two bends in each sector at 7 GeV gives about 2,400 pm.")
EQ['a_size']=card('From emittance to beam size',r"\sigma=\sqrt{\varepsilon\,\beta}\qquad\qquad \sigma'=\sqrt{\varepsilon/\beta}",
 [(r"\sigma","The beam's size (1σ)."),(r"\sigma'","The spread in the directions of its electrons (1σ)."),(r"\beta","The beta function. The focusing magnets set it at every point of the ring. Where it is large the beam is wide and nearly parallel. Where it is small the beam is narrow and its electrons fan out.")],
 "Size multiplied by angular spread is the emittance, and it is the same all around the ring. The focusing magnets only decide how it is shared between the two at each place.",
 "At an APS undulator, from the machine model: 40 pm with β = 5.3 m gives 14.5 µm and 2.7 µrad across. Up and down, 4 pm with β = 2.4 m gives 3.1 µm and 1.3 µrad.")
EQ['a_loss']=card('Energy lost to X-rays each turn',r"U_0[\text{keV}]=88.5\;\frac{E^{4}[\text{GeV}]}{\rho[\text{m}]}",
 [("U_0","The energy one electron radiates away in one turn."),(r"\rho","The radius of its path in the bending magnets.")],
 "The loss climbs as the fourth power of the energy. That is why storage rings do not simply run at ever higher energy. Undulators add to the loss when their gaps are closed.",
 "The APS bending magnets take 2.94 MeV per turn at 6 GeV, as if the ring were bent on one radius of 39 m. At 200 mA that is 2.94 MV × 0.2 A = 590 kW of X-rays, before any undulator is counted.")
EQ['a_phase']=card('The electron that is on time',r"U_0=e\,V\sin\phi_s",
 [("V","The total voltage of the RF cavities."),(r"\phi_s","The point in the RF swing at which an electron on schedule arrives.")],
 "The on-time electron gets back exactly what it lost. There are two moments in each swing with the right voltage, one while it rises and one while it falls. Only the falling one is stable, because there a late electron gets less and an early one gets more.",
 "V = 4.5 MV and U₀ = 2.94 MeV give sin φs = 0.65. The on-time electron arrives about 0.39 billionths of a second after the peak.")
EQ['a_harm']=card('Buckets',r"f_{\text{rf}}=h\,f_{\text{rev}}\qquad\qquad T_{\text{rev}}=\frac{C}{c}",
 [("C","The length of the ring."),("T_{\\text{rev}}","The time for one turn."),("h","The harmonic number: how many RF swings fit in one turn. Each is a bucket that can hold a bunch.")],
 "The RF must swing a whole number of times per turn, so that a bunch meets the same voltage every time it comes around.",
 "C = 1,103.6 m gives 3.681 µs per turn, or 271,647 turns a second. With h = 1,296 the RF frequency is 352 MHz and the buckets are 2.84 billionths of a second apart.")
EQ['a_qb']=card('Charge in a bunch',r"Q_b=\frac{I\;T_{\text{rev}}}{N_{\text{bunches}}}",
 [("I","The current stored in the ring."),("Q_b","The charge of one bunch, if all are equal.")],
 "Current is charge passing a point each second. Every bunch passes once per turn, so the current is the total charge divided by the time for one turn.",
 '<span data-d="numQb">For 216 bunches at 200 mA: 3.41 nC.</span>')
EQ['a_life']=card('Lifetime',r"I(t)=I_0\,e^{-t/\tau}",
 [(r"\tau","The lifetime: the time for the current to fall to 37% of where it started, if nothing were added.")],
 "Most of the loss comes from electrons colliding with each other inside a bunch. It goes faster when the bunch holds more charge and when it is smaller, so the bright, dense bunches of this ring have short lives. Stretching the bunches makes them last longer.",
 "Projected lifetimes at 200 mA: about 7.5 hours with 324 bunches and 3.5 hours with 48. These are design figures, not measurements.")
EQ['a_swapint']=card('How often to swap',r"t_{\text{swap}}=\frac{\tau}{N_{\text{bunches}}}\,\ln\frac{1}{1-\delta}\;\approx\;\frac{\delta\,\tau}{N_{\text{bunches}}}\qquad\qquad \frac{\Delta I}{I}\approx\frac{\delta}{N_{\text{bunches}}}",
 [(r"\delta","The fraction of its charge a bunch is allowed to lose before it is replaced."),("t_{\\text{swap}}","The time from one swap to the next."),(r"\Delta I/I","The step in the total current at each swap.")],
 "Bunches are replaced in turn, so each one waits while all the others are done. The more bunches there are, the more often a swap is needed, and the smaller the step each swap makes in the total current.",
 '<span data-d="numSwap">For 324 bunches: about 8 s between swaps.</span>')

def _panel(cv,aria,controls,readouts,cap,using=None,key=None):
    s='    <div class="panel">\n      <canvas id="%s" aria-label="%s"></canvas>\n'%(cv,aria)
    if controls: s+='      <div class="controls">\n'+''.join('        '+x+'\n' for x in controls)+'      </div>\n'
    if readouts: s+='      <div class="readout">\n'+''.join('        <div class="ro"><div class="k">%s</div><div class="v" id="%s">–</div></div>\n'%(k,i) for k,i in readouts)+'      </div>\n'
    if key: s+='      <div class="key">'+key+'</div>\n'
    s+='      <div class="figcap">%s</div>\n'%cap
    if using: s+='      <div class="using" data-d="%s">%s</div>\n'%using
    return s+'    </div>'
def _sl(i,label,out,mn,mx,st,val): return '<div class="ctl"><label for="%s">%s <output id="%sO">%s</output></label><input id="%s" type="range" min="%s" max="%s" step="%s" value="%s"></div>'%(i,label,i,out,i,mn,mx,st,val)

FIG['a_chain']=_panel('chainCv','Animation of the APS seen from above: the linac, the accumulator ring and the booster sit inside the storage ring. Bursts of electrons travel down the linac, collect in the accumulator ring, gain energy in the booster and are passed into the storage ring',None,None,
 'The APS seen from above, with its parts where they really are: the linac, the accumulator ring and the booster all sit inside the storage ring. Bursts of electrons from the gun are sped up in the linac, collected into one bunch in the accumulator ring, taken to full energy in the booster, and passed into the storage ring in place of a worn bunch. The stored bunches circle clockwise, and the short gray lines are beamlines. The arrangement follows Argonne\'s own site drawing. Sizes are approximate, and the accumulator ring is drawn larger than life so that it shows.')
FIG['a_gun']=_panel('gunCv','Interactive: a heated cathode inside a copper cavity. Electrons jostle inside the hot metal, some escape, and the radio-frequency field pulls them away in bunches toward the linac',
 [_sl('gnT','Temperature of the cathode','1000 °C',700,1300,10,1000)],
 [('Current leaving the cathode','gnJ'),('Electrons escaping, compared with 1,000 °C','gnR'),('A new bunch leaves every','gnB')],
 'The cathode is the glowing block on the left, heated from behind. The yellow dots inside it are electrons, jostling faster the hotter it gets. The few with enough energy escape from its surface. The field in the cavity swings back and forth: for half of each swing it pulls the escaped electrons away toward the linac, and for the other half it pushes them back. So the electrons leave as a string of bunches, one for each swing. Turn the temperature up and far more escape. The numbers are for a typical cathode of this kind, not measurements of the one in the APS gun.')
FIG['a_gun']=FIG['a_gun'].replace('<div class="v" id="gnB">–</div>','<div class="v" id="gnB">350 trillionths of a second</div>')
EQ['a_rich']=card('How many electrons escape',r"J=A\,T^{2}\,e^{-W/kT}",
 [("J","The current leaving each square centimeter of the hot surface."),("T","The temperature, counted from absolute zero."),("W","The work function: the energy an electron needs to get out of the metal."),("k","Boltzmann's constant, which turns a temperature into an energy."),("A","A constant, about 120 amperes per square centimeter per kelvin squared.")],
 "Only electrons with energy above W can leave, and the share of them that have it rises very steeply with temperature. A lower W helps just as steeply, which is why cathodes are made of tungsten treated with barium compounds and not of plain metal.",
 "With W = 2 eV, a typical value for such a cathode: about 2 amperes per square centimeter at 1,000 °C, and about four times as much for every 100 °C more. These are illustrative numbers, not those of the APS gun.")
FIG['a_linac']=_panel('linCv','Interactive: an electron bunch riding a traveling radio wave down the linac, with the energy it has gained so far',
 [_sl('lnPh','Where the bunch rides on the wave','on the crest',-90,90,1,0)],
 [('Energy at the end of the linac','lnE'),('Energy, compared with an electron at rest','lnG'),('Slower than light by','lnV')],
 'Top: the copper cavities of the linac, with the radio wave in blue and one bunch of electrons. The orange arrow is the push on the bunch. The wave and the bunch move at the same speed, so the bunch stays on the same part of the wave. Bottom: the energy it has gained. Slide the bunch off the crest and it gains less. At 90° it gains nothing, and beyond that the wave would slow it down.')
FIG['a_inj']=_panel('injCv','Interactive timeline of one second in the injector: bursts from the linac, charge building up in the accumulator ring, and the energy ramp in the booster',
 [_sl('ijN','Bursts collected from the linac','4 bursts',1,20,1,4)],
 [('Charge in the bunch','ijQ'),('Electrons in the bunch','ijE'),('Enough to refill','ijF'),('Turns around the booster','ijT')],
 'One cycle of the injector, slowed down. Top: bursts arrive from the linac thirty times a second, each about 1 nC. Middle: the accumulator ring adds them into one bunch, then squeezes it in the blue interval. Bottom: the booster takes that bunch to 6 GeV and hands it to the storage ring. The whole cycle repeats once a second. The length of the booster ramp, a quarter of a second here, and the count of turns are approximate.',
 ('injSumB','The slider starts at the number of bursts needed for the fill pattern chosen at the top of the page.'))
FIG['a_quad']=_panel('qdCv','Interactive: electron paths through a row of alternating focusing and defocusing magnets, held or lost depending on the magnet strength',
 [_sl('qdK','Strength of the focusing magnets','1.00',0,2.4,0.01,1)],
 [('Beam','qdS'),('Widest swing','qdW'),('Focal length of each magnet','qdF')],
 'A stretch of the ring drawn straight. Blue magnets focus the beam in this plane and red ones defocus it. The orange lines are electrons that start a little off the ideal path. At a middling strength they weave back and forth and are held. Turn the magnets down and the electrons drift into the wall. Turn them up past the limit and the swings grow until they hit it. The sideways scale is greatly stretched.')
FIG['a_emit']=_panel('emCv','Interactive: the number of bending magnets in each sector, the size of the electron beam that results, and a plot of emittance against the number of bends',
 [_sl('emN','Bending magnets in each sector','7',2,9,1,7),_sl('emE','Electron energy','6.0 GeV',3,8,0.1,6)],
 [('Emittance','emV'),('Beam at an undulator, wide × high','emS'),('Compared with the APS','emR')],
 'Left, top: one sector turning its corner, with the turn drawn four times too sharp so that it shows. The reverse bends are left out. Left, bottom: the electron beam at an undulator, to scale against a human hair. Right: the emittance for each number of bends, on a scale where each grid line is ten times the one below. The curve is the simple rule of {eq:a_emit}, pinned to the APS value. It is a guide to the trend, not a design calculation.')
FIG['a_rf']=_panel('rfCv','Interactive: the RF voltage during one swing, the energy lost per turn, and electrons rocking around the on-time arrival point',
 [_sl('rfV','Total RF voltage','4.5 MV',2.5,7,0.1,4.5)],
 [('On-time electron arrives','rfP'),('Voltage available','rfO')],
 'The blue curve is the voltage an electron meets, depending on when it arrives. The dashed red line is what it must get back each turn. They cross twice. The crossing on the falling side is the stable one, marked in green. The yellow dots are electrons rocking around it: a late one gets less and catches up, an early one gets more and falls back. Lower the voltage toward the red line and the room to rock disappears.')
FIG['a_fill']=_panel('flCv','Interactive: bunches circulating in the ring for the chosen fill pattern, and the train of X-ray flashes a beamline receives',
 ['<div class="btns" style="grid-column:1/-1"><button id="flM216" aria-pressed="true">Normal mode: 216 bunches, 200 mA</button><button id="flM48" aria-pressed="false">Timing mode: 48 bunches, 150 mA</button><button id="flM324" aria-pressed="false">Design: 324 bunches, 200 mA</button></div>',_sl('flI','Current stored in the ring','200 mA',20,200,5,200)],
 [('Buckets filled','flN'),('Time between bunches','flS'),('Charge in each bunch','flQ'),('Electrons in each bunch','flE')],
 'Left: the ring with its bunches, evenly spaced. Right: the flashes of X-rays that reach a beamline over 400 billionths of a second. The height of each flash stands for the charge of the bunch that made it. The buttons switch between the normal pattern and timing mode: in timing mode the flashes are fewer, further apart and each much stronger. The same choice can be made with the menu at the top of the page. Real patterns also leave a few buckets empty or fill a few more heavily, which is left out here.',
 ('useFill','Set for 216 bunches at 200 mA (normal mode).'))
FIG['a_swap']=_panel('swCv','Interactive: the charge in every bunch as bunches are swapped one at a time, and the resulting fine sawtooth in the total stored current',
 [_sl('swT','Lifetime of the beam','6.5 h',1,12,0.5,6.5),_sl('swD','Swap a bunch when it has lost','10%',2,25,1,10)],
 [('Time between swaps','swI'),('Every bunch replaced once in','swC'),('Step in the total current','swR'),('Charge of a fresh bunch','swQ')],
 'Top: every bunch in the ring as a bar. Bunches lose charge as they age. At each swap the most worn bunch is replaced by a full one (green), and the next in line (red) is the one that will go next. Bottom: the total current, which drops slightly between swaps and steps back up at each one. Time is greatly speeded up. The lifetime depends on the fill pattern and is a design figure, so try other values.',
 ('useSwap','Set for 216 bunches at 200 mA (normal mode).'))
FIG['a_swan']=_panel('swanCv','Animation of swap-out injection: stored bunches pass a kicker; as one worn bunch reaches it a fresh bunch arrives from the booster, the kicker switches on for that one bunch, the fresh bunch joins the stored beam and the worn bunch is deflected into an absorber',None,
 [('A bunch passes the kicker every','swnS'),('The kicker is on for about','swnK')],
 'Swap-out as it happens, enormously slowed down. Stored bunches pass through the kicker from left to right. Most go straight through, because the kicker is off. When a worn bunch (gray) is due to be replaced, a fresh bunch from the booster arrives along the green path so that the two reach the kicker at the same instant. The kicker switches on for just that long. Its kick bends the fresh bunch onto the path of the stored beam, and bends the worn bunch off it and into the absorber. The bunches before and after pass with the kicker off. The angle of the kick is drawn far too large. In the ring it is a small fraction of a degree.')
FIG['a_swan']=FIG['a_swan'].replace('<div class="v" id="swnK">–</div>','<div class="v" id="swnK">15 billionths of a second</div>')
FIG['a_kick']=_panel('kkCv','Interactive: bunches passing the swap-out kicker and the kicker pulse, which must cover one bunch without touching its neighbors',
 [_sl('kkW','Length of the kicker pulse','14.9 ns',6,200,0.1,14.9)],
 [('Time between bunches','kkS'),('Neighboring bunches','kkN'),('Pulse must be','kkM')],
 'Bunches passing the kicker, with the kicker pulse in orange. The bunch in green is the one being swapped. The pulse has to rise, hold and fall without reaching the bunches on either side. Lengthen it and the neighbors turn red: they would be disturbed or thrown out too. The closer the bunches, the faster the kicker has to be.',
 ('useKick','Set for 216 bunches: bunches 17.0 ns apart.'))

FIG['a_vac']=_panel('vacCv','Interactive: an electron traveling down the vacuum pipe among gas molecules, with a pressure scale from air down to the working pressure of the ring',
 [_sl('vcP','Pressure in the pipe','2.0 billionths of a torr',-12.5,2.88,0.02,-8.7)],
 [('Compared with a familiar place','vcR'),('Compared with air','vcX'),('Gas molecules in each cubic centimeter','vcN'),('An electron lasts about','vcT'),('and travels about','vcD')],
 'Top: a length of the pipe with an electron passing through. Bottom: the pressure, on a scale where each mark is ten times less than the one to its right, with some familiar places marked. Drag the orange marker, or use the slider. All the way right, in air, the electron is lost almost at once. At the working pressure of the ring it lasts for hours. The ring is emptier than the space the Space Station flies through, though not as empty as the surface of the Moon. Even so, every cubic centimeter of it still holds tens of millions of molecules. The pressures of the familiar places are round textbook values, and the one for the Space Station varies several-fold with the activity of the Sun. The lifetime is a rough estimate for nitrogen-like gas and counts only collisions with gas.')
FIG['a_mba']=_panel('mbaCv','Interactive: the magnets of one sector of the ring and the sideways path of an electron with a different energy, which is carried aside inside the sector and returns to the ideal path at the undulator straights',
 [_sl('mbD','Energy of the electron','1.5% more energy',-3,3,0.1,1.5)],
 [('Off to the side at the two bumps','mbP'),('In the middle of the sector','mbC'),('At the undulators','mbU')],
 'Top: the magnets of one sector in order, with half an undulator straight at each end. The numbers of each kind are those of the APS: seven bending magnets of two kinds, six reverse bends, eight quadrupoles and six sextupoles. Their exact order and spacing are schematic. Bottom: where an electron with a different energy travels, measured sideways from the ideal path. The bends carry it off to one side, most of all at the two bumps where the sextupoles sit, and it is back on the ideal path at the straights. The height of the bumps and the small remainder at the undulators come from the APS machine model. The shape in between is drawn by hand.',
 None,'<span><i style="background:#2f6db5"></i>Bend, field changes along it</span><span><i style="background:#c6d9f0"></i>Bend that also focuses</span><span><i style="background:#d8412f"></i>Reverse bend</span><span><i style="background:#ffffff"></i>Quadrupole</span><span><i style="background:#5aa469"></i>Sextupole</span>')
EQ['a_gas']=card('How long the beam lasts in gas',r"\frac{1}{\tau_{\text{gas}}}=n\,\sigma\,c\qquad\qquad n=\frac{P}{kT}",
 [("n","The number of gas molecules in each unit of volume. It is proportional to the pressure P."),(r"\sigma","The target area one molecule offers for knocking an electron out of the beam."),("c","The speed of the electron, which is the speed of light.")],
 "An electron sweeps past molecules at the speed of light, and each one is a small chance of being lost. Halve the pressure and the beam lasts twice as long, as far as gas is concerned.",
 "For nitrogen-like gas σ is about 5×10<sup>−24</sup> cm². At a billionth of a torr there are 32 million molecules in each cubic centimeter and the lifetime comes to about 57 hours. This is a rough estimate made for this guide. Hydrogen, which is most of what remains in a clean system, is much gentler.")
EQ['a_disp']=card('Different energy, different path',r"x_\delta(s)=\eta(s)\,\delta\qquad\qquad \delta=\frac{E-E_0}{E_0}",
 [(r"\delta","How far an electron's energy is from the ideal energy, as a fraction."),(r"\eta(s)","The dispersion at the point s along the ring: how far apart the paths lie for each unit of δ."),(r"x_\delta","The sideways distance of that electron's path from the ideal one.")],
 "Bending magnets create dispersion, because they bend a low-energy electron more than a high-energy one. Focusing magnets steer it. An achromat is a run of magnets that begins and ends with almost none.",
 "The APS model gives η = 90 mm at the bumps and 0.39 mm at the undulators. The electrons in the beam differ in energy by about 0.135%. That is 0.12 mm at the bumps and half a micron at the undulators, where the beam is 15 µm wide.")

_rows=[('Electron energy in the storage ring','6 GeV'),('Stored current','200 mA, first reached in February 2025'),('Length of the ring','1,103.6 m, in 40 sectors, with 35 straights for undulators'),
 ('Time for one turn','3.681 µs, which is 271,647 turns a second'),('Bending magnets in each sector','7, plus 6 reverse bends'),
 ('Emittance','42 pm by design. Measured: 44 ± 3 pm across and 3.3 ± 2 pm up and down'),('Beam size at an undulator (1σ)','14.5 × 3.1 µm §'),
 ('Spread of paths with energy (dispersion)','90 mm at its largest, 0.39 mm at the undulators §'),('Vacuum','about 2 billionths of a torr at full current §. Pipe about 22 mm across inside'),
 ('Energy lost per turn in the bending magnets','2.94 MeV'),('RF system','352 MHz, 1,296 buckets, 4.5 MV'),('Bunch-lengthening cavity','1,408 MHz, superconducting. Stretches the bunches two to four times'),
 ('Fill patterns in use, late 2026','Normal mode: 216 bunches, evenly spaced, 200 mA. Timing mode: 48 bunches, 77 ns apart, 150 mA ¶'),('Charge per bunch','3.4 nC in normal mode, 11.5 nC in timing mode ‡'),
 ('Lifetime','Design figures at 200 mA: about 7.5 h for 324 bunches and 3.5 h for 48 §. For the two patterns in use, 2 to 4 h was reported in October 2025, and this guide starts from 3 h'),('Linac','425 MeV, 30 bursts a second of about 1 nC'),
 ('Accumulator ring','425 MeV. Collects up to 20 bursts into one bunch of up to 20 nC, once a second. 30.7 m around'),
 ('Booster','425 MeV to 6 GeV, once a second. About 368 m around †, with a ramp of about a quarter of a second †'),
 ('Swap-out kicker pulse','under 4.5 ns to rise, 5.9 ns flat, under 4.5 ns to fall §')]
FIG['a_numbers']='''    <div class="panel">
      <div class="tblwrap"><table class="settings" style="min-width:560px"><thead><tr><th>Quantity</th><th>Value used in this guide</th></tr></thead><tbody>
'''+''.join('        <tr><th>%s</th><td>%s</td></tr>\n'%r for r in _rows)+'''      </tbody></table></div>
      <div class="notes">
        <p><b>Sources.</b> The APS storage ring parameters page (model values, August 2024). Conference papers on the upgraded ring and its injector: NAPAC 2025 MOXP02 (commissioning and measured emittance), IPAC 2021 MOXA02 (design overview), IPAC 2019 THYYPLM3 and a 2024 I.FAST workshop talk (linac, accumulator ring and booster), IPAC 2015 TUPJE067 (swap-out kicker), MEDSI 2018 TUPH04 and NAPAC 2019 TUYBB3 (vacuum system). APS News, February 2025 (200 mA). The APS accumulator ring parameters page (November 2024: circumference 30.666 m, one cycle a second). A talk on the first year of operation at the Low Emittance Rings workshop, October 2025 (beam lifetime of 2 to 4 hours in both patterns in use). </p>
        <p><b>¶ From NE-CAT,</b> as the ring was running in late 2026.</p>
        <p><b>† Not taken from those sources.</b> The length of the booster and the duration of its ramp are approximate values that were not checked against a published source. The lifetime of the beam in gas is a rough estimate made for this guide. The numbers for the cathode, and the pressures of the familiar places on the vacuum scale are round or typical values. Please correct any of these that are wrong.</p>
        <p><b>‡ Calculated in this guide</b> from the other rows.</p>
        <p><b>§ Design or model values,</b> not measurements of the ring as it runs. The fill patterns in use change from run to run, so check the APS operating schedule for the current one.</p>
      </div>
    </div>'''

APS=dict(key='aps',title='How APS Works',name='How APS works',kicker='NE-CAT guides · the Advanced Photon Source',h1='How APS works',
  lede="The Advanced Photon Source makes X-rays from electrons. It boils the electrons off a hot piece of metal, drives them to within about a meter per second of the speed of light, and keeps them circling in a ring 1.1 km around. Wherever their path bends they give off X-rays, and the beamlines around the ring put those to use. This guide follows the electrons from the gun to the ring and shows how the ring holds on to them. It describes the machine as it runs today.",
  hero='a_chain',table='aps',
  bar='<label for="mode">Fill pattern<select id="mode"><option value="216">216 bunches · normal</option><option value="48">48 bunches · timing</option><option value="324">324 bunches · design</option></select></label>',
  sections=[
   dict(id='gun',nav='Gun and linac',h2='A hot cathode and a straight line',prose=[
     "Electrons are easy to come by. In any metal some of them are free to wander about, held in only by a barrier at the surface. Heat the metal and they jostle faster, until some have enough energy to get over the barrier and boil off. The hotter the metal, the more escape, and the number climbs very steeply with temperature. The piece of hot metal is called the cathode.",
     "The APS gun has its cathode in the wall of a small copper cavity with a strong radio-frequency field inside. The field pulls the escaped electrons away and sends them on as a string of tightly spaced bunches. The gun fires thirty such bursts a second.",
     "The linear accelerator, or linac, comes next. It is a long row of copper cavities with a radio wave traveling down the middle. Electrons that set off at the right moment ride near the crest of that wave like a surfer, and its electric field pushes them the whole way. They leave with an energy of 425 MeV.",
     "At that energy an electron is already moving at 99.99993% of the speed of light. From here on, more energy hardly changes its speed. What it does is make the electron's path harder to bend, and that turns out to be the thing that matters."],
    items=[('fig','a_gun'),('eqs',['a_rich']),('fig','a_linac'),('eqs',['a_gain','a_gamma'])]),
   dict(id='injector',nav='Accumulator and booster',h2='Collect, squeeze, ramp: one second in the injector',prose=[
     "One burst from the linac holds about a nanocoulomb of charge, roughly six billion electrons. The storage ring can need a bunch with a dozen times that. So the bursts are first collected in a small ring called the particle accumulator ring. Each new burst is dropped in beside the electrons already circulating there, and they settle into a single bunch.",
     "Electrons circling in a ring give off light, and the light carries away the sideways jitter they arrived with. So the bunch shrinks while it waits. In the last quarter of a second a second radio-frequency system squeezes it shorter still. Then the whole bunch is passed to the booster.",
     "The booster is a ring about a third the size of the storage ring. It takes the bunch from 425 MeV to 6 GeV in a fraction of a second. As the electrons gain energy their path gets harder to bend, so the booster's magnets are strengthened in step to keep them on the same path. A ring that works this way is called a synchrotron.",
     '<span data-d="injSum">For 324 bunches the ring needs about 2.5 nC in each fresh bunch, so the accumulator collects three bursts or so before passing the bunch on.</span> Once a second, a finished bunch is ready at 6 GeV.'],
    items=[('fig','a_inj'),('eqs',['a_charge','a_brho'])]),
   dict(id='ring',nav='The ring',h2='The storage ring: magnets that bend and magnets that focus',prose=[
     "The storage ring is where the electrons stay. It is 1,104 m around, and an electron circles it about 272,000 times a second. Nothing in the ring speeds the electrons up. Its job is to hold them on the same closed path for hours.",
     "Three kinds of magnet do the holding. Bending magnets turn the beam, a little at each one, until the path closes on itself. Focusing magnets, called quadrupoles, act on electrons that stray from the ideal path and turn them back toward it. A third kind, called sextupoles, makes sure that electrons with a little more or a little less energy than the rest are focused just as well.",
     "A quadrupole has a quirk. If it focuses the beam from side to side, it spreads it up and down, and the other way around. The cure is to alternate them. A focusing magnet followed by a defocusing one, at the right spacing, focuses in both directions overall, much as a pair of glass lenses can. The ring is a long chain of such pairs.",
     "The ring is made of 40 sectors, each with the same set of magnets, joined by straight stretches. Thirty-five of the straights hold the undulators that make X-rays for the beamlines. The two NE-CAT undulators share the straight in sector 24."],
    items=[('fig','a_quad'),('eqs',['a_lens','a_stable'])]),
   dict(id='vacuum',nav='Vacuum',h2='An empty pipe: the vacuum',prose=[
     "The electrons travel inside a metal pipe with almost all the air pumped out of it. They have to. In ordinary air an electron at this energy would hit a gas molecule and be knocked out of the beam within about a hundred meters, less than a tenth of one turn.",
     "A stored electron covers about a billion kilometers every hour. To last, it must meet almost nothing on the way. The pressure in the pipe is kept near two billionths of a torr, hundreds of billions of times thinner than the air around us. That is a better vacuum than the one outside the Space Station.",
     "Getting there is harder in this ring than in most. The pipe is narrow, about 22 mm across on the inside, because the magnets have to sit close to the beam to be strong enough. A long, narrow pipe is hard to pump out from its ends. So about half the pipe in each sector is lined with a thin metal film that traps gas molecules when they touch it, which turns the wall itself into a pump. Ion pumps along the ring do the rest.",
     "The X-rays make it harder still. Wherever they strike the wall they heat it and knock gas loose from the metal. Water-cooled copper absorbers take most of the heat. The gas cures itself with time: as the beam runs, the X-rays scrub the walls clean and the vacuum keeps improving. The design called for two billionths of a torr at full current once the ring had stored 1,000 ampere-hours of beam.",
     "At that pressure, gas removes electrons far more slowly than their collisions with each other do, as {step:swap} describes. The vacuum has done its job when it is no longer what limits the beam."],
    items=[('fig','a_vac'),('eqs',['a_gas'])]),
   dict(id='lattice',nav='A small beam',h2='Seven gentle bends: why the beam is so small',prose=[
     "For a beamline, what matters most about the electron beam is how small it is and how nearly parallel its electrons travel. One number, the emittance, measures both together. A small emittance means a small, bright source of X-rays.",
     "What sets it is a tug of war. Each time an electron gives off an X-ray inside a bending magnet, it loses a little energy all at once. An electron with less energy is bent more sharply, so it finds itself on the wrong path for its new energy and starts to swing from side to side about the right one. Countless such jolts keep the beam stirred up. Against them, the steady loss and return of energy calms the swinging down. The beam settles at the width where the two balance.",
     "The jolt is small if each bending magnet turns the beam only slightly, because then the paths for different energies have little room to move apart. So the way to a small beam is to turn each corner with more, gentler bends. The emittance falls as the cube of the number of bends.",
     "Each sector of the APS ring turns its corner with seven bending magnets, where most earlier rings use two or three. The layout is called a multi-bend achromat. <b>Multi-bend</b> is the seven bends. <b>Achromat</b> is a word borrowed from lenses that bring every color to the same focus. Here it means that electrons of different energies, which travel on slightly different paths inside the sector, are back on the same path by the time they reach the straight at its end. The undulators sit in those straights, so the spread of energies in the beam does not make the X-ray source any wider.",
     "The APS version is a <b>hybrid</b>. In two places in each sector the paths for different energies are deliberately let apart, by about a millimeter for an electron that is one percent off in energy. The sextupoles, which correct the focusing for electrons of the wrong energy, can only tell those electrons from the rest where their paths differ. Placing them at these two bumps lets them do their work with much weaker fields.",
     "Two more refinements trim the emittance further. Four of the seven bends have a field that changes along their length, so that the hardest bending is done where the paths for different energies lie closest together. And six small magnets bend the beam slightly the wrong way. That sounds like a mistake and is not: they hold those paths closer together inside the main bends, and they strengthen the calming effect of the energy loss on the side-to-side motion. The result is an emittance of 42 picometers, and a beam at the undulators about 15 µm wide and 3 µm high.",
     "The price is paid in room to move. With so much focusing between so many bends, electrons survive only within a couple of millimeters of the ideal path. That one fact decides how the ring has to be filled, as {step:swap} shows."],
    items=[('fig','a_mba'),('eqs',['a_disp']),('fig','a_emit'),('eqs',['a_emit','a_size'])]),
   dict(id='rf',nav='RF',h2='Paying back the energy on every turn',prose=[
     "The electrons give off X-rays all the way around, in every bending magnet and every undulator. On each turn an electron loses about 2.9 MeV in the bending magnets alone, one part in two thousand of its energy. Left alone it would be lost within a thousandth of a second.",
     "The energy is paid back by radio-frequency cavities. These are metal chambers in which an electric field swings back and forth 352 million times a second, and an electron passing through at the right moment gets a push. The cavities can give 4.5 million volts per turn, which is more than is needed. The surplus is put to use.",
     "The field is timed so that an electron on schedule arrives while the voltage is falling and gets back exactly what it lost. An electron with too much energy takes a slightly longer way around, arrives late, meets a lower voltage and gets less. One with too little arrives early and gets more. So each electron is steered back toward the right energy and the right timing, and rocks gently around both.",
     "This is why the beam comes in bunches. Only electrons that arrive near the right moment are held. There are 1,296 such moments, called buckets, in each turn of the ring: one for every swing of the field."],
    items=[('fig','a_rf'),('eqs',['a_loss','a_phase','a_harm'])]),
   dict(id='bunches',nav='Bunches',h2='Bunches and fill patterns',prose=[
     "Not every bucket is filled. The choice of which ones to fill is called the fill pattern, and it is a compromise between two kinds of experiment. Most want the smallest, steadiest beam and do not care about timing. Some use the flashes of X-rays as a stopwatch, and want them strong and well separated.",
     "With many bunches the charge is spread thin. Each bunch is small, its electrons disturb each other little, and the beam is at its smallest. With few bunches each one holds a great deal of charge, and the flashes are far apart.",
     "At present the APS runs with two patterns. The normal one has 216 bunches, evenly spaced, and a current of 200 mA. Timing mode has 48 bunches, 77 billionths of a second apart, and a current of 150 mA. The ring was designed for patterns of up to 324 bunches. The menu at the top of this page switches between them.",
     '<span data-d="fillSum">With 216 bunches sharing 200 mA, each bunch holds 3.41 nC.</span>',
     "Each bunch is short: a few centimeters long, gone past in about a tenth of a billionth of a second. The ring has one extra cavity whose only job is to stretch the bunches to two to four times their natural length. In a longer bunch the electrons are further apart and collide with each other less often, and the beam lasts longer.",
     "For a diffraction experiment at NE-CAT the pattern makes no difference. The detector adds up an enormous number of flashes in every image."],
    items=[('fig','a_fill'),('eqs',['a_qb'])]),
   dict(id='swap',nav='Swap-out',h2='Keeping the ring full: lifetime and swap-out',prose=[
     "The stored beam does not last. Electrons packed into a tiny bunch bump into one another, and now and then a collision throws two of them so far off in energy that both are lost. A few more are lost to stray gas atoms in the vacuum pipe. The smaller and denser the bunches, the faster it goes. Left alone, the current in the ring would fall by half in a few hours.",
     "Many rings top themselves up by adding a few fresh electrons to each bunch now and then. The newcomers arrive a few millimeters to one side of the stored beam and take thousands of turns to settle in. The APS ring cannot do this. Its electrons survive only within a couple of millimeters of the ideal path, so there is no room at the side for newcomers.",
     "So the APS swaps whole bunches. A fresh, full bunch from the booster is steered straight onto the ideal path, into the place of a worn one, and on the same turn the old bunch is kicked out into a block of metal that absorbs it. This is called swap-out injection, and the ring was designed around it.",
     "The hard part is the kick. Bunches follow each other billionths of a second apart, and the kicker has to switch on, deflect one bunch and switch off again before the next one arrives. The APS kickers were designed to do it in about 15 billionths of a second. Shortly before a bunch is swapped out, another small kick makes it swell, so that its electrons are spread out when they hit the absorber and do not damage it.",
     '<span data-d="swapSum">With 324 bunches, a bunch is swapped about every 8 seconds.</span>',
     "For the beamlines the result is a current that never sags. It holds steady to within about a percent, hour after hour."],
    items=[('fig','a_swap'),('eqs',['a_life','a_swapint']),('fig','a_swan'),('fig','a_kick')]),
   dict(id='numbers',nav='Numbers',h2='The APS in numbers',prose=[
     "These are the values this guide uses, and where they come from. The guide {guide:overview} picks up where this one stops, with what an undulator does to the beam and what a beamline does with the X-rays."],
    items=[('fig','a_numbers')]),
  ],
  further='''        <li><a href="https://ops.aps.anl.gov/SRparameters/SRparameters.html" target="_blank" rel="noopener">APS Storage Ring Parameters</a>. The machine model: lattice, emittance, beam sizes, RF.</li>
        <li><a href="https://prebys.physics.ucdavis.edu/NAPAC-25/proceedings/pdf/MOXP02.pdf" target="_blank" rel="noopener">NAPAC 2025, paper MOXP02</a>. Commissioning and first operation of the upgraded ring.</li>
        <li><a href="https://epaper.kek.jp/ipac2021/papers/moxa02.pdf" target="_blank" rel="noopener">IPAC 2021, paper MOXA02</a>. Overview of the design, including swap-out injection and the fill patterns.</li>
        <li><a href="https://epaper.kek.jp/ipac2019/papers/thyyplm3.pdf" target="_blank" rel="noopener">IPAC 2019, paper THYYPLM3</a>. Getting high-charge bunches through the accumulator ring and the booster.</li>
        <li>H. Wiedemann, <i>Particle Accelerator Physics</i>, or the lecture notes of the U.S. Particle Accelerator School. Focusing, emittance and RF, derived properly.</li>''')
