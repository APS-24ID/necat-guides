# The guide "What is a synchrotron?": the Introductory companion to "How APS works".
# Read by compose.py after walk_guide.py (it uses _here from it). Its figures are in syn.js. See walk_guide.py for the pattern.
def _here_aps(t): return _here(t,'At the APS.')
FIG['s_hero']=_panel('synHeroCv','Animation of the machine from above: electrons travel down a straight linac into a small booster ring, and circle in a large storage ring. Beams of X-rays leave the storage ring in straight lines, each to a beamline',None,None,
 "The machine from above. Electrons are sped up in the linac and the booster, then circle in the storage ring. X-rays leave the ring in straight lines, and each beam goes to a beamline. The drawing is not to scale, and the real ring has many more beamlines than are shown.")
FIG['s_spd']=_panel('sSpdCv','Interactive: a scale of speed from 90 percent to 99.9999999 percent of the speed of light, with an electron on it. A slider gives the electron more energy and it moves along the scale. Markers show where electrons are when they leave the linac and the booster',
 [_slw('sE','Energy given to each electron','100 keV',3,9.778,0.002,5)],
 [('Speed','sV'),('Slower than light by','sD')],
 "Each step to the right on this scale adds another nine: 90%, 99%, 99.9% of the speed of light, and so on. Give the electron more energy and it creeps to the right, but it never reaches the end. The two markers show where the electrons at the APS are when they leave the linac and when they leave the booster. Energies are in electronvolts, the unit used for particles: a keV is a thousand, an MeV a million and a GeV a billion.")
FIG['s_ring']=_panel('sRingCv','Interactive: a ring-shaped pipe seen from above, with magnets around it. Electrons start at the bottom and follow a curved path. A slider sets the strength of the magnets: too weak and the path runs into the outer wall, too strong and it runs into the inner wall, and at the right strength it closes on itself',
 [_slw('sB','Strength of the magnets','80%',0.6,1.4,0.01,0.8)],
 [('The path of the electrons','sP')],
 "The ring from above. The white band is the pipe the electrons travel in, and the blue blocks are magnets. The dashed line is the path the electrons take from their starting point, and the red star is where they are lost. Set the strength to 100% and the path closes on itself, so the electrons go around again and again. The drawing uses one strength for the whole ring and a smooth curve. In the real ring the electrons are turned a little at each magnet, with straight stretches in between, and the pipe is far narrower against the size of the ring.")
FIG['s_cone']=_panel('sConeCv','Interactive: an electron on a curved path gives off light, drawn as an orange glow. A slider gives the electron more energy, and the glow narrows from all around the electron to a thin beam pointing straight ahead',
 [_slw('sG','Energy of the electron','100 keV',3,9.778,0.002,5)],
 [('The X-rays spread over','sA'),('Width of the beam 50 meters away','sW')],
 "The electron is moving to the right along the dashed path, which curves because a magnet is turning it. The orange glow is the light it gives off. At low energy the light goes almost everywhere. Give the electron more energy and the light is swept forward into a beam. The beam is drawn much wider than it really is at high energy: the numbers give its real spread.")
FIG['s_bun']=_panel('sBunCv','Interactive: bunches of electrons circle a ring. Each time a bunch passes the top of the ring a flash of X-rays sets off down a beamline to a detector, which lights up as each flash arrives. A slider sets the number of bunches',
 [_slw('sN','Number of bunches in the ring','216',24,324,12,216)],
 [('Flashes at a beamline each second','sF'),('Time between flashes','sT')],
 "The yellow dots are bunches of electrons, circling the ring. Each time a bunch passes the top of the ring, a flash of X-rays sets off down the beamline, and the lamp at the end lights as it arrives. More bunches give more flashes, closer together. The drawing shows the real number of bunches, evenly spaced, but the motion is slowed down enormously: a real bunch goes around about 272,000 times a second.")
FIG['s_upg']=_panel('sUpgCv','Interactive: the electron beam seen end on, drawn in orange above a human hair seen end on. Two buttons switch between the ring before the upgrade, when the beam was four hairs wide, and after it, when the beam is a fraction of a hair wide',
 [_choice('sU','The ring',[('0','Before the upgrade'),('1','After the upgrade')],'0')],
 [('Electron beam, width × height','sS'),('Against a hair','sH')],
 "The electron beam seen end on, as it passes through NE-CAT's undulators, drawn to the same scale as a human hair. Use the buttons to see it before and after the upgrade. The sizes are the ones these guides use for the ring, from the APS design. A typical hair is 70 microns across.")

SYN=dict(key='syn',title='What Is a Synchrotron?',name='What is a synchrotron?',kicker='NE-CAT guides · the synchrotron in five minutes',h1='What is a synchrotron?',level='Introductory',deeper='aps',
  lede="A synchrotron light source is a machine that makes X-rays from electrons. It gets the electrons moving at almost the speed of light and steers them around a ring. Every time their path bends, X-rays fly off, and the experiments built around the ring put them to use. The Advanced Photon Source, at Argonne National Laboratory near Chicago, is one of these machines. It was built by the U.S. Department of Energy, which runs it for scientists from all over the country. This guide explains how it works in five stops.",
  hero='s_hero',table='none',bar='',
  sections=[
   dict(id='speed',nav='Speed',h2='First, get the electrons moving',prose=[
     "The electrons start in a piece of hot metal. Heat shakes some of them loose, much as hot water gives off steam.",
     "A straight accelerator called the linac pushes them along with radio waves, the way a wave carries a surfer. Then a ring called the booster pushes them further still.",
     "Something odd happens on the way. The electrons soon reach almost the speed of light, and nothing can go faster than that. After that, more pushing barely changes their speed. It makes them harder to turn instead, and that matters at the next stop.",
     _here_aps("The electrons leave the linac at 99.99993% of the speed of light. When they leave the booster they are slower than light by only about one meter per second.")],
    items=[('fig','s_spd')]),
   dict(id='ring',nav='The ring',h2='Magnets hold them in a ring',prose=[
     "From the booster the electrons pass into the storage ring. It is a pipe with the air pumped out, running in a circle through a long chain of magnets. A magnet pushes a moving electron sideways, so each magnet turns the electrons a little. All the turns together bring them back to where they started.",
     "The magnets have to be exactly strong enough. Too weak and the electrons run wide, into the wall of the pipe. Too strong and they cut the corner.",
     "The word synchrotron comes from synchronized. The faster an electron goes, the harder it is to turn. So in a ring that is speeding electrons up, the magnets have to grow stronger at exactly the same pace, or the electrons would run wide. The booster is a ring of this kind. People now use the word for the whole machine.",
     _here_aps("The storage ring is 1,104 meters around, and the electrons lap it about 272,000 times a second. The pipe they travel in is about 22 millimeters across on the inside.")],
    items=[('fig','s_ring')]),
   dict(id='light',nav='X-rays',h2='Turning electrons give off X-rays',prose=[
     "An electron that is made to turn gives off light. A slow electron sends out feeble light in almost every direction.",
     "A fast electron is different. Its speed sweeps nearly all of the light forward into a narrow beam, like the headlight of a train. It also raises the energy of the light, all the way up to X-rays. The beam leaves the ring in a straight line, like mud flying off a spinning wheel, and a beamline is built along that line.",
     _here_aps("The X-rays from a turning electron in this ring spread over about a hundredth of a degree. Fifty meters away the beam is still less than a centimeter wide. The undulators that NE-CAT uses make it narrower still.")],
    items=[('fig','s_cone')]),
   dict(id='bunches',nav='Flashes',h2='The X-rays come in flashes',prose=[
     "Every X-ray an electron gives off takes away a little of its energy. To keep the electrons going, the ring gives each one a push once a lap, enough to make up for what it lost.",
     "The push comes from a radio wave, and a wave rises and falls. Only an electron that arrives at the right moment in the wave gets the right push. The ones that arrive at the wrong moment are lost. So the electrons that remain travel in bunches, each timed to the wave, and not as a steady stream.",
     "Each time a bunch passes a beamline, the beamline gets a flash of X-rays. The flashes come so quickly that for most experiments the beam is as good as steady.",
     "A bunch slowly loses electrons. In this ring a worn bunch is not topped up. It is swapped whole for a fresh one, while the others keep circling.",
     _here_aps("The ring normally runs with 216 bunches, which gives each beamline about 59 million flashes a second.")],
    items=[('fig','s_bun')]),
   dict(id='upgrade',nav='A new ring',h2='A new ring made the beam much smaller',prose=[
     "The smaller the beam of electrons, the smaller and brighter the beam of X-rays it makes. A small, bright X-ray beam can be put onto a very small sample.",
     "The first APS ring ran for more than 25 years. In April 2023 it was shut down and its magnets were replaced with a new arrangement, which turns the electrons in more and gentler steps. Gentler turns shake the beam up less, so it settles to a much smaller size.",
     _here_aps("Where the electrons pass through NE-CAT's undulators, the beam went from 280 microns wide to about 15. A micron is a thousandth of a millimeter, and a human hair is about 70 microns across.")],
    items=[('fig','s_upg')]),
  ],
  remember="A synchrotron gets electrons to almost the speed of light, holds them in a ring with magnets, and collects the X-rays they give off every time they turn.",
  classroom=["A faster electron is harder to turn. What has to happen to the magnets of the booster while the electrons speed up?",
             "A beamline gets about 59 million flashes of X-rays a second. Why can most experiments treat the beam as steady?",
             "Why would a smaller, brighter beam of X-rays help when the sample is a crystal a tenth of a millimeter across?",
             "Try it: at the first stop, find the energy at which the electron reaches 99% of the speed of light. How many times more energy does it take to reach 99.99%?"],
  further='')
G.insert([g['key'] for g in G].index('aps'),SYN)
[g for g in G if g['key']=='aps'][0]['short']='syn'
UPDATED['syn']='November 13, 2026'
