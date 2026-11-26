# The guide "How does a crystal get to the beam?": an Introductory guide in series 2. It has no In-depth partner.
# Read by compose.py. Its figures are in ride.js. See walk_guide.py for the pattern of an Introductory guide.
FIG['rd_hero']=_panel('rideHeroCv','Animation: a jointed robot arm on a pedestal lowers a metal cylinder into a vessel of liquid nitrogen, over a sample pin, lifts the pin out inside the cylinder, swings across and sets it on the goniometer, where it sits in the X-ray beam with the nozzle of a stream of cold gas close beside it. The arm goes back and lowers the cylinder into the liquid nitrogen while the crystal is measured, and then takes the pin back. A magnifier shows the end of the cylinder cut open, with a brass collet holding the pin',None,None,
 "A robot arm lifts a frozen crystal out of liquid nitrogen, sets it in the X-ray beam under a stream of cold gas, and later takes it back. Before each trip, and while the crystal is measured, the end of the cylinder rests in the liquid nitrogen. The arm carries a metal cylinder that slides over the pin and surrounds it, so the crystal stays cold on the way. The circle shows the end of the cylinder cut open and five times larger: a brass collet inside closes on the base of the pin. The arm, the cylinder and the pin are to scale. The dewar and the goniometer are simple shapes.")
FIG['rd_load']=_panel('rLoadCv','Interactive: the robot\'s dewar seen from above, with thirty places for pucks in three rings, and one puck enlarged to show its sixteen places for pins. A slider sets how many pucks are loaded',
 [_slw('rN','Pucks loaded','12 pucks',0,30,1,12)],
 [('Crystals waiting','rNc'),('The dewar is','rNs')],
 "The robot's dewar from above. Each grey disc is a puck, and each puck holds 16 pins. Full, the dewar holds 480 crystals under liquid nitrogen. The arrangement of the thirty places is drawn for the picture; the count is the real one for 24-ID-C.")
FIG['rd_arm']=_panel('rArmCv','Interactive: the robot scene from the side, with a magnifier on the end of the arm. Two buttons send the sample pin to the dewar of liquid nitrogen or to the goniometer, where it stands in the X-ray beam with cold gas blowing over it. The arm carries it between the two inside a metal cylinder',
 [_choice('rA','The crystal is',[('0','In the dewar'),('1','In the beam')],'0')],
 [('Where it is','rAw'),('How cold','rAt')],
 "The trip from the dewar to the beam. The crystal starts under liquid nitrogen. The arm lifts its pin out, carries it across and sets it on the goniometer, where a stream of cold nitrogen gas takes over. On 24-ID-C the goniometer's axis is upright, so the pin stands on end with the crystal at the top. Inside the cold metal cylinder, the crystal does not warm on the way. The dewar and the goniometer are drawn as simple shapes.")
FIG['rd_find']=_panel('rFindCv','Interactive: the view from the beamline camera, with a loop on a pin and a red cross marking where the X-ray beam passes. Three buttons: as mounted, the loop is off to one side; centered by camera, the loop is on the cross; scanned with X-rays, a grid of squares over the loop glows where crystal was found and the brightest square sits on the cross',
 [_choice('rF','The crystal has been',[('0','Mounted'),('1','Centered by camera'),('2','Scanned with X-rays')],'0')],
 [('The loop is','rFl'),('Is the crystal in the beam?','rFx')],
 "What the camera sees. The red cross marks where the beam passes. First the loop is moved onto the cross, by software or by a click on the picture. That is enough when the crystal can be seen. When it cannot, the loop is stepped through the beam square by square, with a brief flash of X-rays at each, and the square that gives the strongest spots is moved onto the cross. The crystal here is drawn faintly on purpose: in frozen liquid a real one can be almost invisible. The grid and its brightness are made up to show the idea.")
FIG['rd_far']=_panel('rFarCv','Interactive: three boxes in a row: the scientist, the computers at NE-CAT, and the beamline with its robot and detector. The scientist and NE-CAT are joined by a green tube with a padlock on it, labeled encrypted, https, one connection kept open, both ways at once, a WebSocket. Dots travel along it in two lanes. Three buttons show the traffic both ways at once, going out only, or coming back only',
 [_choice('rR','Show what is',[('2','Both at once'),('0','Going out'),('1','Coming back')],'2')],
 [('What travels','rRw'),('The connection from outside','rRc')],
 "An experiment run from a distance. The scientist chooses a crystal, centers it and starts the measurement from wherever they are. The camera pictures, the images from the detector and the first analysis come back the other way. Everything from outside travels along one encrypted connection that is opened once and then stays open, with traffic both ways at the same time.")

RIDE=dict(key='ride',title='How Does a Crystal Get to the Beam?',name='How does a crystal get to the beam?',kicker='NE-CAT guides · robots and remote work in five minutes',h1='How does a crystal get to the beam?',level='Introductory',
  lede="A frozen crystal, smaller than a grain of salt, has to be set in the path of an X-ray beam no wider than a hair, in a room that nobody may enter, and it must never warm up on the way. A robot does it. This guide follows a crystal from the shipping container to the beam, shows how it is found once it is there, and explains how the whole experiment is run by someone who may be a thousand miles away.",
  hero='rd_hero',table='none',bar='',
  sections=[
   dict(id='load',nav='Loading',h2='The crystals arrive cold and stay cold',prose=[
     "Crystals come to the beamline already frozen, each on the end of a small pin, packed sixteen to a puck. The guide {guide:grow} shows how they got that way.",
     "The pucks are lifted out of their shipping container and lowered into the robot's dewar, a wide vessel of liquid nitrogen beside the beamline. From then on no person touches them.",
     "Each puck and each place in it has a number, and the scientists send a list that says which crystal is where. Keeping that list straight matters as much as keeping the crystals cold.",
     _here("The robot's dewar on 24-ID-C holds thirty pucks, which is 480 crystals. The one on 24-ID-E holds fourteen.")],
    items=[('fig','rd_load')]),
   dict(id='arm',nav='The robot',h2='A robot carries each one to the beam',prose=[
     "When a crystal's turn comes, the robot arm reaches into the liquid nitrogen, takes hold of its pin and carries it to the goniometer, the instrument that holds the crystal in the beam and turns it.",
     "The arm does not pinch the pin between fingers. It carries a metal cylinder about 6 inches long. Between trips the arm rests with the end of the cylinder dipped in the liquid nitrogen, also while the crystal is being measured, so it is always as cold as the crystal. The cylinder slides down over the pin, and a brass collet inside it closes on the pin's base. The crystal travels inside cold metal.",
     "The trip takes a few seconds. On the goniometer a stream of nitrogen gas at 173 degrees below zero blows over it for as long as it is being measured. If it warmed, ice would form and the crystal would be ruined. The guide {guide:cold} explains why.",
     "When the measurement is over, the arm takes the pin back to its place in the puck and fetches the next one.",
     _here("The experiment room is locked while the beam is on, as the guide {guide:hutch} explains, so everything in it has to work without a person: the robot, the goniometer, the cameras and the detector.")],
    items=[('fig','rd_arm')]),
   dict(id='find',nav='Centering',h2='Then the crystal has to be found',prose=[
     "The beam is about a hundredth of a millimeter across, and the crystal is not much larger. The robot sets the pin down to within a fraction of a millimeter, which is not nearly close enough. The crystal has to be moved into the beam, and it has to stay there as it turns.",
     "A camera looks at the loop through a microscope. The loop can be moved onto the mark that shows where the beam passes, either by software that recognizes it or by a click on the picture. The pin is then turned a quarter of a turn and the step is repeated, so that the crystal sits on the axis and does not swing out of the beam.",
     "Often the crystal cannot be seen. It is small and clear, and it sits in a bead of frozen liquid. Then the X-rays do the looking. The loop is stepped through the beam in a grid, with a brief exposure at each step, and the place that gives the strongest pattern of spots is where the crystal is.",
     _here("Both ways are used at NE-CAT: centering from the camera picture, and a scan with X-rays when the crystal is hard to see.")],
    items=[('fig','rd_find')]),
   dict(id='far',nav='From afar',h2='The scientist may be a thousand miles away',prose=[
     "None of this needs the scientist in the building. The crystals travel by courier. The scientist connects over the internet, sees the same camera pictures and controls that someone at the beamline would see, and runs the experiment from an office or a kitchen table.",
     "The connection from outside is made with https, the same encrypted link that protects a bank's web site, so nobody along the way can read it or tamper with it. And it is not a matter of asking for a page and waiting for the answer. The scientist's browser opens one connection, called a WebSocket, and keeps it open. Either end can send to the other at any moment. A command reaches the beamline at once, and a new camera picture or a fresh result appears on the scientist's screen the moment it exists, without the screen having to ask.",
     "For each crystal the steps are the same: mount, center, take a test image, decide, collect, unmount. With a detector that records hundreds of images a second, the measurement itself can take less than a minute. The guide {guide:detintro} shows how.",
     "Software at the beamline starts to analyze the images while the crystal is still in the beam, so a poor crystal can be set aside quickly and a good one measured with care.",
     _here("Most of the scientists who use NE-CAT run their experiments remotely. The staff load the pucks, keep the beamline working and help when something goes wrong.")],
    items=[('fig','rd_far')]),
  ],
  remember="A robot carries each frozen crystal from liquid nitrogen to the beam and back, a camera and the X-rays themselves find it, and the scientist runs it all from a distance.",
  closing="To follow the X-rays to the same spot from the other direction, see the guide {guide:walk}.",
  classroom=["Why must the crystal never be allowed to warm up, even for a few seconds?",
             "The beam is a hundredth of a millimeter across. Why is it not enough for the robot to put the pin in roughly the right place?",
             "Why is the pin turned and centered a second time?",
             "Try it: at the first stop, how many crystals does the robot hold when its dewar is half full?"],
  further='')
# in series 2, after the shielded room
_k=[g['key'] for g in G]
G.insert(_k.index(next(k for k in ('see','mx','scatter') if k in _k)),RIDE)
UPDATED['ride']='November 26, 2026'
