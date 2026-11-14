# The guide "How do we see a protein?": the Introductory companion to "How MX works". Read by compose.py. Its figures are in see.js.
FIG['v_hero']=_panel('seeHeroCv','Animation: a pattern of spots on the left and, on the right, the picture calculated from it. As more of the spots are used the picture sharpens from a blur into the shape of one helix of a protein with its side chains, and a model of the atoms is fitted into it. The view then turns and pulls back, with the atoms staying in place, until the whole protein, myoglobin, is in view as a folded chain with that helix picked out in orange',None,None,
 "On the left, the spots a crystal throws onto the detector. On the right, the picture a computer makes from them. The more spots are used, the sharper the picture, until atoms can be fitted into it. Piece by piece, that gives the whole protein. This one is myoglobin, and the piece in the map is shown in orange.")
FIG['v_scale']=_panel('sScaleCv','Interactive: a slider zooms in from the width of a hair, past a red blood cell, a bacterium and a virus, to a protein, drawn as the folded chain of myoglobin. It then goes on into the protein, to one of its helices and at last to two of its atoms, while a small picture of the whole protein shows where the view is. A wave of green light is drawn to the same scale and becomes far wider than the picture. At the end X-ray waves appear, about as long as the gap between the atoms',
 [_slw('sZ','Zoom in','0%',0,1,0.005,0)],
 [('The picture is this wide','sW'),('Waves of green light','sG'),('In the middle of the picture','sO')],
 "Zoom in from a hair to a protein, and then into the protein until two of its atoms fill the view. The small picture that appears on the right shows where in the protein you are, and the piece whose atoms are drawn is orange in it. Along the bottom is a wave of green light, drawn to the same scale as the picture. By the time a virus fills the picture, one wave of light is wider than the whole view, and nothing smaller can be made out with it. Keep going toward the atoms, and X-ray waves appear at the top. They are the right size. The protein is myoglobin, drawn from its real structure as a tube that follows its chain. A micron is a thousandth of a millimeter. A nanometer, written nm, is a thousandth of a micron, and an ångström, written Å, is a tenth of a nanometer.")
FIG['v_row']=_panel('sRowCv','Interactive: X-rays arrive from above at a row of identical molecules. A slider sets how many molecules are in the row, from one to twenty. Below, a strip of the detector shows a faint smear for one molecule, which gathers into sharp bright spots as molecules are added',
 [_slw('sN','Molecules in the row','1',1,20,1,1)],
 [('Brightest spot, compared with one molecule','sBr'),('The X-rays arrive as','sSh')],
 "X-rays arrive from above and are scattered by the molecules. The strip at the bottom shows what would land on the detector, with a curve above it for how bright each place is. One molecule gives a faint smear. Add copies, evenly spaced, and the same X-rays are gathered into spots that grow sharper and brighter. The spots are not all alike: how bright each one is depends on the molecule. The curve for one molecule is drawn taller than it should be, so that it can be seen.")
FIG['v_map']=_panel('sMapCv','Interactive: a pattern of spots with a dashed circle, and beside it the picture calculated from the spots inside the circle. A slider widens the circle. The picture, of one helix of the protein myoglobin, sharpens from a blob to a helix with side chains, then to rings with holes in them, and finally to separate atoms',
 [_slw('sR','How far out from the middle the spots are used','30% of the way to the edge',0.2,1,0.005,0.3)],
 [('Finest detail in the map','sD'),('What the map shows','sWh')],
 "On the left is a pattern of spots. Only the spots inside the dashed circle are used. On the right is the map they give, with a blue line around the places where there are most electrons. The map is of one piece of myoglobin: thirteen amino acids in a row, wound into a spiral called an alpha helix, with their side chains sticking out. It is seen from the side, flattened onto the page. Widen the circle and the blob grows side chains, the rings in them open, and at last the atoms separate. The blue shape is the outline of the map, calculated from the real positions of the 113 atoms in this piece and blurred to the detail that the spots inside the circle can give. The pattern of spots is made up.")
FIG['v_fit']=_panel('sFitCv','Interactive: the map of one helix of myoglobin. One row of buttons shows the map alone, the map with atoms fitted into it, the atoms alone, or the whole protein with this helix picked out. A second row sets how much detail the map has: coarse, medium or fine',
 [_choice('sM','Show',[('0','The map'),('1','The map with atoms'),('2','The atoms alone'),('3','The whole protein')],'0'),
  _choice('sQ','Detail in the map',[('3.5','Coarse, 3.5 Å'),('2','Medium, 2 Å'),('1.2','Fine, 1.2 Å')],'2')],
 [('Atoms placed','sAt'),('How well the map pins the atoms down','sEase')],
 "The same helix as at the last stop: 113 atoms of carbon, nitrogen and oxygen. Hydrogen atoms are left out, as they usually are, because they scatter X-rays too weakly to show. Put the atoms in, then try the coarse map and the fine one. With fine detail each atom has its own peak. With coarse detail the atoms fit inside the shape, but so would other arrangements, and what is already known about proteins has to settle the matter. The last button turns the view and pulls back to the whole protein, with this piece in orange. Its chain of 153 amino acids is drawn as a tube: blue where it is wound into helices, grey in between. The positions are from entry 1MBN in the Protein Data Bank.")

SEE=dict(key='see',title='How Do We See a Protein?',name='How do we see a protein?',kicker='NE-CAT guides · crystallography in five minutes',h1='How do we see a protein?',level='Introductory',deeper='mx',
  lede="Proteins do most of the work in a living cell, and each one works because of its shape. They are far too small to see with any microscope that uses light. This guide explains, in four stops, how X-rays and a crystal are used to find where every atom in a protein is.",
  hero='v_hero',table='none',bar='',
  sections=[
   dict(id='small',nav='Too small',h2='Too small for light',prose=[
     "A protein is a molecule made of thousands of atoms. Neighboring atoms in it are about one and a half ångströms apart. An ångström is a ten-millionth of a millimeter. To understand how a protein works, we need to know where each of its atoms is.",
     "A microscope cannot show anything much smaller than the waves of the light it uses. The waves of visible light are thousands of times longer than the gap between two atoms, so no microscope that uses light will ever show them.",
     "The protein in the figures of this guide is myoglobin, which stores oxygen in muscle. In the late 1950s it became the first protein to have its structure found, by the method described here.",
     "X-rays are light too, with waves about as long as that gap. But there is a catch. Nobody can make a lens that focuses X-rays well enough to form a picture of atoms. The picture has to be made in another way.",
     _here("The X-rays used most at NE-CAT have waves 0.98 ångströms long.")],
    items=[('fig','v_scale')]),
   dict(id='crystal',nav='A crystal',h2='A crystal turns a whisper into a signal',prose=[
     "X-rays that meet a molecule are scattered by it in all directions. One protein molecule scatters far too few to measure, and a beam strong enough to help would destroy it first.",
     "So the protein is grown into a crystal. In a crystal the same molecule is repeated in neat rows, every copy facing the same way, billions of times over.",
     "Growing the crystal is a craft of its own. A drop of very pure protein in water is mixed with salts or other chemicals that make the protein a little less willing to stay dissolved. The drop is then left to lose water slowly. As it shrinks, the molecules are crowded together, and with the right recipe they settle into a crystal instead of a shapeless clump. Finding the recipe can take hundreds of trials, and the crystal can take hours or months to grow.",
     "A protein crystal is not hard and dry like a grain of salt. About half of it is water, which fills the gaps between the molecules, so the protein in a crystal keeps the shape it has in the cell.",
     "Each copy scatters the same faint wave. In most directions the waves from the different copies cancel one another. In a few directions they line up and add, and in those directions the crystal sends out a thin, bright ray. Each ray makes one spot on the detector.",
     _here("A crystal a twentieth of a millimeter across holds about a hundred billion copies of a protein of ordinary size.")],
    items=[('fig','v_row')]),
   dict(id='map',nav='Spots to map',h2='A computer does the work of the lens',prose=[
     "Each spot carries one ingredient of the picture. The ingredient is a simple pattern of stripes running across the molecule. Spots near the middle of the detector stand for broad stripes, which give the overall shape. Spots near the edge stand for fine stripes, which give the detail.",
     "A computer adds all the stripes together, each one as strong as its spot is bright. This is what a lens does in a microscope, done here by calculation. The result is a map that shows where the electrons are, and the electrons are where the atoms are.",
     "One thing cannot be read from the spots: how far each set of stripes has to be shifted sideways before it is added. Scientists have several ways to find that out, and it is often the hardest part of the work.",
     _here("The images recorded from one crystal at NE-CAT can hold hundreds of thousands of spots. Software at the beamline starts to analyze them while the crystal is still in the beam.")],
    items=[('fig','v_map')]),
   dict(id='model',nav='Atoms',h2='Atoms are fitted into the map',prose=[
     "The map is a shape, and a shape is not yet a list of atoms. A protein is a chain of building blocks called amino acids, and their order along the chain is known from the gene for the protein. The job is to thread that chain through the map, so that every atom lies inside the shape.",
     "Software does most of the threading, and a scientist checks it. The model is then adjusted until the spots it would give match the spots that were measured.",
     "The finished structure is a list of every atom and where it is. It can be turned around on a screen, compared with other proteins, and used to design a medicine that fits into it.",
     _here("Structures measured at NE-CAT are placed in the Protein Data Bank, a public archive that anyone can use. It holds more than 250,000 structures.")],
    items=[('fig','v_fit')]),
  ],
  remember="X-rays have waves small enough to show atoms, but there is no lens for them. A crystal gathers the faint scatter of one molecule into bright spots, and a computer turns the spots into a map of where the atoms are.",
  classroom=["Why can a microscope that uses visible light never show the atoms in a protein, however well it is made?",
             "In a crystal every copy of the molecule faces the same way. What would happen to the spots if the copies pointed in random directions?",
             "The spots at the edge of the detector carry the finest detail. What would the map look like if only the spots near the middle were measured?",
             "Try it: at the third stop, how fine must the detail be before the rings in the side chains show their holes?"],
  further='')
# before How MX works, its In-depth partner, when that guide is in the set; otherwise first in its series
_k=[g['key'] for g in G]
G.insert(_k.index('mx' if 'mx' in _k else 'scatter'),SEE)
for _g in G:
    if _g['key']=='mx': _g['short']='see'
UPDATED['see']='November 13, 2026'
