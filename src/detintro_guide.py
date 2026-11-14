# The guide "How does an X-ray detector work?": the Introductory companion to "Counting photons: inside the detector".
# Read by compose.py. Its figures are in detintro.js.
FIG['p_hero']=_panel('pixHeroCv','Animation of a data collection: the detector seen from the front, a blue frame around a white window, recording one image after another as the crystal turns. On each image the spots lie in curved bands, which move across the window from image to image. A magnified square shows a patch of pixels, each with the number of X-rays it has counted',None,None,
 "A data collection, seen from the front of the detector. The crystal turns a fraction of a degree, the detector records an image, and so on. On each image the spots lie in curved bands called lunes, and the bands move as the crystal turns. The magnified patch shows what the detector really records: a number for every pixel. The thin lines on the window are the gaps between its 32 sensors, where nothing is counted. The crystal is made up, and the patch is not to scale.")
FIG['p_zoom']=_panel('pZoomCv','Interactive: the whole face of the detector with its pattern of spots. A slider zooms in on one spot until the separate pixels show, each with the number of X-rays it counted',
 [_slw('pZ','Zoom in','1.0×',0,1,0.005,0)],
 [('The picture is this wide','pW'),('Pixels across the picture','pP')],
 "Start with the whole detector and zoom in on the orange spot. The detector is drawn as it is built: a black housing 40 centimeters wide, with a blue frame around a white window, and behind the window 32 sensors, with narrow gaps between them that count nothing. First the spot grows. Then the grid of pixels appears, and at the end each pixel shows its count. The spot is drawn a few pixels wide, as real ones are. The pattern of spots is made up.")
FIG['p_thr']=_panel('pThrCv','Interactive: the electrical signal from one pixel over a short time, with twelve tall pulses from X-rays and many small bumps of noise. A slider moves a threshold line up and down. Every pulse or bump that crosses the line is counted and marked',
 [_slw('pT','Height of the threshold','50% of a full pulse',0.05,1.3,0.01,0.5)],
 [('Counted','pCnt'),('Result','pVer')],
 "The signal from one pixel. Each tall pulse is one X-ray, and the small bumps are electrical noise. Everything that rises above the dashed line is counted, and gets a mark at the top: green for an X-ray, red for noise. Put the line too low and noise is counted. Put it too high and X-rays are missed. Halfway up a full pulse, the count is exactly right.")
FIG['p_fast']=_panel('pFastCv','Interactive: a crystal turns steadily while a strip of images is recorded, the newest on the right and the earlier ones moving off to the left. A slider sets how many images are recorded each second, and the crystal and the strip speed up with it',
 [_slw('pR','Images recorded each second','25',1,560,1,25)],
 [('Time to record a full turn of the crystal, in 1,800 images','pTurn'),('Each image takes','pEach')],
 "The crystal on the left turns without stopping, and the detector records one image after another. The image being recorded is on the right, with orange spots, and the finished ones move off to the left. Up to four images a second the animation runs at true speed. Faster settings are slowed down so that they can be followed, though a faster setting always runs faster, and the label under the images says by how much. The numbers below give the real times.")
FIG['p_dist']=_panel('pDistCv','Interactive: the crystal, the rays that fan out from it, and the detector, seen from the side. Each ray is labeled with the size of the detail it carries, from 12 ångströms near the middle to 1.1 at the widest angle. The detector, drawn to scale as a black box with a blue front, can be dragged or moved with a slider from 150 millimeters to 1.2 meters away. The rays that land on its window are drawn solid',
 [_slw('pD','Distance from the crystal to the detector','300 mm',150,1200,5,300)],
 [('Finest detail the detector can catch','pRes'),('Spots of a large molecule are this far apart','pSep')],
 "The crystal and the detector from the side. The rays that leave the crystal fan out, and each one carries detail of one size: the wider its angle, the finer the detail. The number at the end of each ray gives that size. The fan is set by the crystal and does not change. The detector only catches the part that lands on its window, shown darker, with those rays drawn solid. Drag the detector, or use the slider. Close in, it catches the wide rays and so the fine detail. Farther back it loses them, but neighboring spots land farther apart. The detector is drawn to scale. The numbers are for X-rays of 12.66 keV. The large molecule is one whose crystal repeats every 300 ångströms. An ångström, written Å, is a ten-millionth of a millimeter, about the size of an atom.")

DETI=dict(key='detintro',title='How Does an X-ray Detector Work?',name='How does an X-ray detector work?',kicker='NE-CAT guides · the detector in five minutes',h1='How does an X-ray detector work?',level='Introductory',deeper='det',
  lede="The detector is the camera of the experiment. It records where each X-ray from the crystal lands, and how many arrive at each place. This guide explains how it does that, in four stops.",
  hero='p_hero',table='none',bar='',
  sections=[
   dict(id='pixels',nav='Pixels',h2='A camera with 18 million pixels',prose=[
     "The X-rays that leave the crystal land on a flat panel of silicon about 31 centimeters wide and 33 high.",
     "The panel is divided into pixels, like the sensor in a phone camera. Each pixel is 75 microns across, about the width of a hair, which is far larger than a phone's. A phone records how bright the light is at each pixel. This detector does something more exact, as the next stop shows.",
     "A spot from the crystal covers only a few pixels. The picture the scientists get is a table of numbers, one for every pixel.",
     _here("The detector on 24-ID-C is an EIGER2 XE 16M, made by the Swiss company DECTRIS. It has 4,148 by 4,362 pixels, about 18 million in all.")],
    items=[('fig','p_zoom')]),
   dict(id='count',nav='Counting',h2='Every X-ray is counted',prose=[
     "When an X-ray stops in the silicon it shakes loose a few thousand electrons. A voltage across the silicon sweeps the charge down to the pixel underneath, where it arrives as a short electrical pulse.",
     "Each pixel has its own tiny circuit that watches for pulses. If a pulse is taller than a set level, called the threshold, the pixel adds one to its count. The small bumps of electrical noise never reach the threshold, so they are never counted.",
     "The result is a picture with no noise from the detector itself. A pixel that no X-ray reached reads exactly zero.",
     _here("Each pixel of the 24-ID-C detector can count up to about 10 million X-rays a second.")],
    items=[('fig','p_thr')]),
   dict(id='fast',nav='Speed',h2='No pause between pictures',prose=[
     "The crystal turns steadily in the beam, and the detector records one image after another as it turns. Earlier kinds of detector had to stop after each picture to be read out, with the beam blocked while they did.",
     "This one never stops. The gap between one image and the next is about a ten-millionth of a second, so the crystal can keep turning and nothing is missed.",
     _here("The 24-ID-C detector can record 560 full images every second. At that rate the 1,800 images of a complete turn of the crystal would take just over three seconds.")],
    items=[('fig','p_fast')]),
   dict(id='distance',nav='Distance',h2='Near for fine detail, far for big molecules',prose=[
     "The finest detail in a structure comes from the rays that leave the crystal at the widest angles. To catch them, the detector is moved close to the crystal.",
     "Big molecules bring the opposite problem. Their spots lie close together, and from close up they would run into each other. Moving the detector back spreads them out, at the price of losing the widest rays off the edge.",
     "So the distance is chosen afresh for each crystal.",
     _here("The detector on 24-ID-C can be set anywhere from 15 centimeters to 1.2 meters from the crystal.")],
    items=[('fig','p_dist')]),
  ],
  remember="The detector is a panel of 18 million pixels. Each pixel counts the X-rays that land on it one by one, with no noise of its own and no pause between images.",
  classroom=["A phone camera measures brightness. This detector counts X-rays one at a time. What does counting gain when a spot is very faint?",
             "Why is the threshold set at half the height of a full pulse, and not just above the noise?",
             "A structure needs both fine detail and well-separated spots. Why can one detector distance not always give both?",
             "Try it: at the last stop, how close must the detector be to catch detail of 1.5 Å?"],
  further='')
# after the polarization guide in its series: before whichever of these comes first in the set
_k=[g['key'] for g in G]
G.insert(_k.index(next(k for k in ('det','hutch','see','mx','scatter') if k in _k)),DETI)
UPDATED['detintro']='November 13, 2026'
