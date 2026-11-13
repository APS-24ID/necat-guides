# The guide "A walk down the beamline": the Introductory companion to "How NE-CAT works".
# Read by compose.py after aps_guide.py and xrf_guide.py (it uses _panel, _sl and _slw from them). Its figures are in walk.js.
# An Introductory guide has no equation cards. Each section is one stop: a few short paragraphs, a "Here at NE-CAT" note
# and one figure with one control. It ends with one sentence to remember, a link to the In-depth guide and notes for a class.
# _here and _choice are defined in compose.py


FIG['w_hero']=_panel('walkHeroCv','Animation of the beamline from left to right in five numbered stops: magnets that make the X-rays, a silicon crystal that keeps one energy, mirrors that focus the beam, the protein crystal, and the detector with spots on it',None,None,
 "The beamline from end to end. X-rays build up as the electrons pass between the magnets on the left, and travel to the right. The drawing is not to scale: the real beamline is tens of meters long, and the crystal is too small to see.")
FIG['w_und']=_panel('wUndCv','Interactive: electrons fly between two rows of magnets and wiggle from side to side. A burst of X-rays builds up ahead of each electron, one wave longer for each wiggle, and leaves to the right. A slider moves the rows closer together or farther apart',
 [_slw('wG','Gap between the two rows of magnets','11.9 mm',8.5,30,0.1,11.9)],
 [('Wiggle to each side','wAmp'),('Against the length of one wiggle','wRat')],
 "The yellow dots are electrons, flying from left to right between the two rows of magnets. Red and blue are the two kinds of magnet pole, and they alternate, so the electrons are pushed first one way and then the other. Each electron gives off a little more light at every wiggle. The light travels very slightly faster than the electron, so the burst of X-rays ahead of it grows by one wave for each wiggle, and leaves at full length. Move the rows closer and the push is stronger, so the wiggle is bigger. The orange wave is the longest X-ray wave the undulator makes, and it gets longer as the wiggle grows. That is not the whole story. The undulator also makes X-rays with waves 3 and 5 times shorter, and closing the gap makes those stronger. The beamline usually works with one of them, and picks the gap to put it at the energy that is wanted. The wiggle is drawn far larger than it is, and so is the distance the light gets ahead: the numbers give the real size of the wiggle.")
FIG['w_mono']=_panel('wMonoCv','Interactive: X-rays of many energies, drawn as lines of different colors, meet two faces of silicon that are set one above the other and a little apart along the beam. Only one energy bounces off the first face and then the second, and leaves. A slider tilts the block and changes which energy gets through',
 [_slw('wA','Tilt of the silicon block','9.0°',5.7,19.2,0.1,9)],
 [('Energy that gets through','wE')],
 "X-rays have no color. The colors here stand for their energies, from red for the lowest to violet for the highest. Many energies arrive from the left. The one energy that fits the tilt bounces off the lower face and then the upper one, and leaves in the direction it came, a little higher up. The two faces are cut from a single block of silicon, joined behind the plane of the drawing, so they always stay exactly parallel. Tilt the block and watch the marker move along the scale. The drawing shows five energies going in, where the real beam holds every energy in between, and the tilt is drawn larger than it is.")
FIG['w_kb']=_panel('wKbCv','Interactive: parallel X-rays graze a long mirror and are sent toward the crystal. A slider bends the mirror, which brings the rays together. A magnified circle shows the size of the beam at the crystal against a human hair seen end on',
 [_slw('wB','Bend of the mirror','30%',0,1.5,0.01,0.3)],
 [('Beam at the crystal','wS'),('Compared with a hair','wH')],
 "The X-rays come in from the left, graze the mirror and head for the crystal. With the mirror flat they stay as far apart as they started. Bend it and they come together. Bend it too far and they cross before they reach the crystal and spread out again. The circle is a magnified view of the beam where it meets the crystal, drawn over a human hair seen end on. Only one of the two mirrors is shown, and its angle is drawn much steeper than the real one. The smallest size is the nominal beam at NE-CAT, 10 microns across. The other sizes are for illustration, and 70 microns is a typical hair.")
FIG['w_zoom']=_panel('wZoomCv','Interactive: a metal pin with a small loop on its end, a green crystal in the loop, and an orange spot on the crystal where the X-ray beam lands. A slider zooms in from the whole pin to the beam',
 [_slw('wZ','Zoom in','1.0×',0,1,0.005,0)],
 [('The picture is this wide','wW'),('What fills it','wSee')],
 "The sample as the X-rays see it on their way in. Zoom in from the pin to the loop, to the crystal, and at last to the orange spot where the beam lands. The bar at the bottom left shows the scale. The pin, loop and crystal are drawn at typical sizes: a pin 18 millimeters long, a loop about a third of a millimeter across and a crystal a tenth of a millimeter across. The beam is the nominal size at NE-CAT, 10 microns across.")
FIG['w_det']=_panel('wDetCv','Interactive: X-rays reach a crystal, and thin rays leave it for a square detector where each makes a spot. A slider turns the crystal, new spots flash up, and the ones already seen stay marked',
 [_slw('wR','Turn the crystal','0°',0,90,0.5,0)],
 [('Spots caught so far','wN')],
 "The X-rays arrive at the crystal, and the thin rays it sends out land on the detector. The orange spots are the ones lit at this moment. Turn the crystal and they go out while others flash up. The black dots are spots already caught. The gray disc in the middle is the beamstop, which blocks the X-rays that went straight through. The drawing has far fewer spots than a real crystal gives, and they are placed to look right, not calculated from a real molecule.")

WALK=dict(key='walk',title='A Walk Down the Beamline',name='A walk down the beamline',kicker='NE-CAT guides · the beamline in five minutes',h1='A walk down the beamline',level='Introductory',deeper='overview',
  lede="NE-CAT uses X-rays to find the shapes of the molecules of life. On the way to the experiment the X-rays are made, sorted and squeezed, until they land on a crystal smaller than a grain of salt. A detector then catches what the crystal sends out. This guide walks down the beamline in five stops.",
  hero='w_hero',table='none',bar='',
  sections=[
   dict(id='magnets',nav='Magnets',h2='Wiggling electrons make the X-rays',prose=[
     "The Advanced Photon Source is a ring of magnets about 1.1 kilometers around. Electrons fly around it at almost the speed of light, about 270,000 laps every second.",
     "On each lap they pass between two rows of magnets called an undulator. The magnets push the electrons to one side, then the other, then back again. Every time an electron is pushed sideways it gives off X-rays. Because the electron is moving so fast, the X-rays all go forward in a narrow beam.",
     "Moving the two rows closer together or farther apart changes the wiggle, and with it the energies of the X-rays that come out. This is the first of the controls the beamline uses to tune its X-rays.",
     _here("The ring has one undulator for each of NE-CAT's two beamlines, 24-ID-C and 24-ID-E. Their magnets repeat every 2 to 3 centimeters. The wiggle is less than a thousandth of a millimeter to each side.")],
    items=[('fig','w_und')]),
   dict(id='energy',nav='One energy',h2='A block of silicon keeps one energy',prose=[
     "The beam that leaves the undulator is a mix of X-rays of many energies, much as white light is a mix of colors. The experiment needs just one.",
     "A block of pure silicon does the sorting. X-rays bounce off the layers of atoms inside it, but at any one tilt only one energy bounces cleanly. The rest are lost in the block. Tilt the block a little and a different energy gets through. The device is called a monochromator, which means one color.",
     _here("24-ID-C can be set anywhere from 6 to 20 keV. The keV, or kiloelectronvolt, is the unit X-ray energies are measured in. 24-ID-E always runs at 12.662 keV, an energy that suits crystals that contain selenium.")],
    items=[('fig','w_mono')]),
   dict(id='focus',nav='Mirrors',h2='Mirrors squeeze the beam',prose=[
     "X-rays go straight through an ordinary mirror. They will bounce off a very smooth surface if they only just graze it, at a fraction of a degree, like a flat stone skipping off water.",
     "A grazing mirror that is bent very slightly brings the X-rays together. One mirror squeezes the beam in height, and a second one squeezes it in width. In the figure, bend the mirror until the beam is at its smallest on the crystal.",
     _here("The beam at NE-CAT is nominally 10 microns wide and 10 microns high. A micron is a thousandth of a millimeter. A human hair is about 70 microns across.")],
    items=[('fig','w_kb')]),
   dict(id='sample',nav='The crystal',h2='A frozen crystal on the end of a pin',prose=[
     "The sample is a crystal of protein, usually about a tenth of a millimeter across. It is scooped up in a tiny loop on the end of a metal pin.",
     "The crystal is kept at about 173 degrees below zero Celsius in a stream of cold nitrogen gas. The cold slows the damage that the X-rays do to it. A robot takes each pin from storage in liquid nitrogen and sets it in place, so nobody needs to be in the room while the X-rays are on.",
     "The beam is smaller than the crystal, so it can be aimed at the best part.",
     _here("A machine called a goniometer holds the pin and turns the crystal in the beam. The one on 24-ID-C turns the crystal about an upright axis.")],
    items=[('fig','w_zoom')]),
   dict(id='detector',nav='Detector',h2='The detector catches the spots',prose=[
     "Most of the X-rays go straight through the crystal and are stopped by a small piece of metal called a beamstop. A small share are sent off in new directions by the rows of molecules in the crystal.",
     "They do not spread out evenly. They leave as thousands of separate thin rays, and each ray makes a spot on the detector. As the crystal turns, spots go out and new ones flash up.",
     "Where the spots fall, and how bright each one is, depends on how the atoms are arranged in the molecule. Computers work backward from the spots to the position of every atom.",
     _here("The detector on 24-ID-C has more than 16 million pixels, and it counts the X-rays that land on each one.")],
    items=[('fig','w_det')]),
  ],
  remember="A beamline makes X-rays by wiggling electrons, keeps one energy, squeezes the beam until it is narrower than a hair, and records the spots that a frozen crystal sends out.",
  classroom=["Why might the experiment need X-rays of just one energy? Think about what a mix of energies would do to the spots.",
             "The beam is narrower than a hair. Why is a small beam useful when the crystal is small too?",
             "Why is the crystal turned while the detector records?",
             "Try it: at the second stop, find the tilt that lets 12.7 keV through. Which way do you tilt the block for a higher energy?"],
  further='')
G.insert([g['key'] for g in G].index('overview'),WALK)
GK_OVERVIEW=[g for g in G if g['key']=='overview'][0]; GK_OVERVIEW['short']='walk'
UPDATED['walk']='November 13, 2026'
