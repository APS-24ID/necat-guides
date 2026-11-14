# The guide "Why is the experiment in a shielded room?" (Introductory). Read by compose.py. Its figures are in hutch.js.
FIG['h_hero']=_panel('hutchHeroCv','Animation of the experiment room seen from above, in three states that repeat: the door open with a person inside and the beam blocked, the door locked with the room empty, and the beam on with a red lamp lit over the door',None,None,
 "The room seen from above, in the three states it can be in. The beam is let in only after the room has been checked and the door is locked.")
FIG['h_scat']=_panel('hScatCv','Interactive: stray X-rays spread out in all directions from the sample. A slider moves a small square away from the sample, and fewer and fewer rays cross it',
 [_slw('hD','Distance from the sample','1.0 m',0.1,3,0.05,1)],
 [('Stray X-rays, compared with 10 cm from the sample','hRel')],
 "The beam comes in from the left and meets the sample. The orange lines are stray X-rays, scattered by the sample and the air around it. They spread out as they go, so the same small area catches fewer of them the farther away it is. Twice as far away, they are four times weaker. The drawing shows them much stronger than they are, next to the beam.")
FIG['h_wall']=_panel('hWallCv','Interactive: forty X-rays arrive from the left at a sheet of steel. A slider makes the steel thicker, from nothing to three tenths of a millimeter. Fewer and fewer rays come out the other side. A human hair is drawn to the same scale',
 [_slw('hT','Thickness of the steel','0 µm',0,300,1,0)],
 [('X-rays that get through','hThru'),('Thickness, against a human hair','hHair')],
 "Forty X-rays arrive from the left. Each one that is stopped in the steel ends in a red dot. The steel is drawn to the same scale as the hair on the right, which is 70 microns across. A micron, written µm, is a thousandth of a millimeter. The numbers are for X-rays of 12.66 keV, the energy NE-CAT uses most, and come from standard tables.")
FIG['h_lock']=_panel('hLockCv','Interactive: the experiment room from above, with its door, the pipe that brings the beam and a shutter in the pipe. Three buttons step through three states: door open and shutter closed, room searched and locked with the shutter still closed, and shutter open with the beam on and a red lamp lit',
 [_choice('hS','The three states of the room',[('0','1. Door open'),('1','2. Searched and locked'),('2','3. Beam on')],'0')],
 [('Door','hDoor'),('Shutter','hShut'),('X-rays in the room','hBeam')],
 "The room from above. The beam arrives through the pipe on the left, and the shutter in the pipe blocks it until the room is safe. Step through the three states. There is no step with the door open and the shutter open, because the safety system does not allow one.")

HUTCH=dict(key='hutch',title='Why Is the Experiment in a Shielded Room?',name='Why is the experiment in a shielded room?',kicker='NE-CAT guides · the hutch in five minutes',h1='Why is the experiment in a shielded room?',level='Introductory',deeper='walk',
  more='To follow the X-rays through this room, from the pipe that brings them to the detector, see the guide %s.',
  lede="The experiment at NE-CAT happens inside a closed steel room called a hutch, and nobody is in it while the X-rays are on. This guide explains why the room is there, how little it takes to stop these X-rays, and how the beam and the door are tied together.",
  hero='h_hero',table='none',bar='',
  sections=[
   dict(id='stray',nav='Stray X-rays',h2='A few X-rays go astray',prose=[
     "The X-ray beam is narrower than a hair. It travels in a straight line from the pipe that brings it to a small metal stop just behind the sample, and nearly all of it ends there.",
     "A little does not. Wherever the beam meets something, whether the crystal, the loop that holds it or the air itself, a small part is scattered in all directions. These stray X-rays are the same kind as the ones used in a hospital, and they come from a beam far more intense than a hospital's.",
     "They thin out quickly with distance, and they cannot turn corners. Even so, the rule is simple: nobody is in the room while the beam is on.",
     _here("Each of the two NE-CAT beamlines ends in its own hutch, which holds the sample, the robot that changes samples, and the detector.")],
    items=[('fig','h_scat')]),
   dict(id='walls',nav='Walls',h2='Thin steel is enough',prose=[
     "X-rays of the energy NE-CAT uses pass easily through air, plastic and skin. Metal stops them. In steel, half of them are gone within a hundredth of a millimeter, and half of the rest within the next hundredth.",
     "So a sheet of steel thinner than a coin stops these X-rays completely. The walls of a hutch are a good deal thicker than that. They are built for the worst that could happen, not for an ordinary day.",
     _here("At 12.66 keV, the energy used most at NE-CAT, steel as thick as one human hair lets through about 1 X-ray in 150.")],
    items=[('fig','h_wall')]),
   dict(id='lock',nav='Interlock',h2='The beam and the door are tied together',prose=[
     "A heavy shutter in the pipe blocks the beam before it reaches the hutch. The shutter and the door are linked by a safety system, called an interlock, so that the two can never be open together.",
     "Before the beam is let in, someone walks through the hutch to check that nobody is inside, pressing buttons along the way to show that they looked. They leave and close the door, and it locks. Only then will the shutter open.",
     "If the door is opened while the beam is on, the shutter closes at once. A lamp by the door shows when there are X-rays in the room.",
     _here("Every hutch at the Advanced Photon Source is protected in this way, by a system that is kept separate from the controls used to run the experiment.",'At the APS.')],
    items=[('fig','h_lock')]),
   dict(id='outside',nav='From outside',h2='Everything is run from outside',prose=[
     "Since nobody can be inside, the experiment is built to be run from outside. Cameras show the crystal. Motors line it up with the beam. A robot takes each sample from its store in liquid nitrogen and puts it in place.",
     "Outside can mean the next room or the other side of the country. Many of the scientists who use NE-CAT send their crystals by courier and run the experiment over the internet.",
     _here("The sample robot on 24-ID-C holds thirty pucks of crystals at a time, so a long run of samples can be measured without anyone opening the door.")],
    items=[]),
  ],
  remember="The hutch keeps stray X-rays in and people out. Its door and the beam shutter are locked together, so the beam can be on only when the room is empty.",
  classroom=["Stray X-rays are four times weaker at twice the distance. How much weaker are they at ten times the distance, and why?",
             "The walls are far thicker than these X-rays need. Why might an engineer design them that way?",
             "Why is it safer to tie the shutter to the door than to rely on a warning sign?",
             "Try it: at the second stop, how thick does the steel have to be before fewer than 1 X-ray in a million gets through?"],
  further='')
# last in the beamline series: before the first guide of the next series that is in the set
_k=[g['key'] for g in G]
G.insert(_k.index(next(k for k in ('mx','scatter') if k in _k)),HUTCH)
UPDATED['hutch']='November 14, 2026'
