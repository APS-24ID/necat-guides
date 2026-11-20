# The guide "How do you grow a protein crystal?": an Introductory guide in series 3. Its In-depth partner is not yet written.
# Read by compose.py. Its figures are in grow.js. See walk_guide.py for the pattern of an Introductory guide.
FIG['gr_hero']=_panel('growHeroCv','Animation: a small well seen from the side, sealed at the top, with a pool of liquid at the bottom and a drop sitting on a post above it. Beside it is the same drop seen through a microscope. Over ten days the drop shrinks as water leaves it for the pool, and crystals appear in it and grow',None,None,
 "Ten days in a drop, played in a few seconds. The drop holds the protein. Water slowly leaves it for the pool below, the protein is crowded closer together, and after a few days crystals appear and grow. The times and sizes are chosen to show the idea, not measured.")
FIG['gr_order']=_panel('gOrderCv','Interactive: twenty-four molecules of the protein myoglobin, each drawn as its folded chain, and beside them the pattern X-rays would give. Three buttons choose between molecules spread out in solution, molecules stuck together in a clump, and molecules in the neat rows of a crystal. Only the crystal gives sharp spots',
 [_choice('gO','The protein is',[('0','Dissolved'),('1','A clump'),('2','A crystal')],'0')],
 [('The molecules are','gOm'),('What X-rays show','gOx')],
 "Twenty-four molecules of myoglobin, each drawn as its folded chain with the heme in red. In solution they drift apart, each turned its own way. In a clump they touch, but each still faces its own way. In a crystal they sit in rows, layer upon layer, and all face the same way. The square on the right shows what X-rays would give in each case. Only the crystal gives spots. A real crystal of myoglobin a tenth of a millimeter across has tens of thousands of molecules along each edge, and about thirty trillion in all. The crystal is drawn as a small block, two layers deep, with the layer behind shown fainter. The molecules are only turned on the page, where real ones tumble every way, and the square stacking is for the picture: it is not how myoglobin packs. The patterns are drawn, not calculated.")
FIG['gr_drop']=_panel('gDropCv','Interactive: a sealed well seen from the side, with a drop on a post above a pool of liquid, and the same drop seen through a microscope. A slider runs time from the day the drop is set up to ten days later. The drop shrinks toward half its size, dots of water vapor drift from it to the pool, and from the third day crystals appear in it and grow',
 [_slw('gT','Time since the drop was set up','day 0.0',0,10,0.1,0)],
 [('Size of the drop','gTv'),('Protein left in solution','gTc'),('In the drop','gTs')],
 "Left: one well of a crystallization plate, cut through. This is the sitting-drop method, one of several in use. The drop on the post is half protein solution and half recipe. The pool below, called the reservoir, is the recipe alone, so it is more concentrated than the drop. The well is sealed, and water passes from the drop to the reservoir as vapor, drawn as blue dots, until the two match. Right: the drop from above, through a microscope. The crystals are drawn larger than life. The ten days, the day the crystals appear and their number are chosen to show the idea. A real drop can take hours or months.")
FIG['gr_screen']=_panel('gScreenCv','Interactive: a plate of 96 wells, twelve across and eight down, each showing what happened in its drop: clear, a cloudy solid, a shower of tiny crystals, or crystals worth measuring. Two buttons choose between a first plate of 96 different recipes, where three wells have crystals, and a second plate of small changes around the best recipe, where many more do',
 [_choice('gS','The plate',[('0','First try: 96 different recipes'),('1','Second try: around the best one')],'0')],
 [('Wells with crystals worth measuring','gSn'),('What changes from well to well','gSw')],
 "A plate of 96 wells, each with its own recipe, seen from above some days after it was set up. Most drops stay clear or turn to a cloudy solid, the precipitate. A few give crystals. The second plate takes the best recipe from the first and changes it a little at a time: more or less acid from left to right, more or less precipitant from bottom to top. The good crystals lie in one patch, with showers of tiny ones around it. The results are made up to show the pattern. Real plates are less tidy.")
FIG['gr_ship']=_panel('gShipCv','Interactive: three pictures chosen by buttons. First, a drop seen through a microscope, where a small loop on the end of a pin moves in and lifts out one crystal. Second, the pin and its crystal plunging into a vessel of liquid nitrogen. Third, a round puck seen from above with sixteen places for pins, beside the container it is shipped in',
 [_choice('gH','The step',[('0','Fish it out'),('1','Plunge it'),('2','Pack it')],'0')],
 [('What happens','gHa'),('The number to remember','gHb')],
 "The last three steps in the laboratory. A crystal is lifted out of its drop in a loop of fiber or plastic on the end of a metal pin. The pin is plunged into liquid nitrogen. The cold pins are loaded into a puck, and the pucks travel to the beamline in a container that keeps them cold. The drawings are not to one scale. The pin is about 18 mm long and the puck is about the width of a hand.")

GROW=dict(key='grow',title='How Do You Grow a Protein Crystal?',name='How do you grow a protein crystal?',kicker='NE-CAT guides · growing crystals in five minutes',h1='How do you grow a protein crystal?',level='Introductory',
  lede="Before X-rays can show the shape of a protein, the protein has to be coaxed into a crystal. Nobody can predict the recipe that will do it. This guide shows what a crystal is, how a drop of protein solution is left to shrink until crystals form, why hundreds of recipes are tried at once, and how a crystal smaller than a grain of salt travels to the beamline.",
  hero='gr_hero',table='none',bar='',
  sections=[
   dict(id='order',nav='Order',h2='A crystal is molecules in regular order',prose=[
     "In solution, protein molecules drift about on their own, each tumbling and facing its own way. In a crystal they are stacked in neat rows, every one facing the same way, like bricks in a wall.",
     "That order is the whole point, and no real crystal has it perfectly. One molecule scatters X-rays far too weakly to measure. A crystal holds a vast number of molecules, all in step, and their weak signals add up to sharp spots. The guide {guide:see} explains how the spots become a picture of the molecule.",
     "Salt and sugar make crystals readily. Proteins do not. A protein molecule is large, lumpy and a little flexible, and it touches its neighbors at only a few points. A protein crystal is soft, and about half water, which fills the spaces between the molecules.",
     "If the molecules are pushed together too fast they do not have time to line up. They stick anyhow and fall out as a useless clump, called a precipitate.",
     _here("The crystals measured on the beamlines are small. Most are a tenth of a millimeter across or less, smaller than a grain of table salt.")],
    items=[('fig','gr_order')]),
   dict(id='drop',nav='A drop',h2='Let a drop shrink, slowly',prose=[
     "The work starts long before the drop. The protein has to be made, usually in bacteria or other cells grown for the purpose, and then purified until almost nothing else is left. A few thousandths of a gram is enough to begin. To make crystals, the protein then has to be eased out of solution gently, so that the molecules have time to find their places. The usual way is to crowd them, a little at a time.",
     "A small drop of protein solution is mixed with an equal drop of a recipe: salt, a buffer that sets the acidity, and other chemicals, dissolved in water. The ingredient that pushes the protein out of solution is called the precipitant. The drop is placed in a sealed well, beside a larger pool of the recipe alone. The pool is more concentrated than the drop, so water slowly leaves the drop as vapor and settles in the pool.",
     "As the drop shrinks, the protein in it grows more crowded. Past a certain point the solution can no longer hold it all. If the recipe is right, a few molecules come together in order and make a seed, and more settle onto it, layer by layer. A crystal can appear overnight or take months.",
     "The arrangement in the figure, with the drop sitting on a small post, is called a sitting drop. It is one method among several. In a hanging drop the drop hangs from a cover above the reservoir and loses water in the same way. In other methods the protein and the recipe are mixed in a tiny volume under oil, or are left to meet slowly through a membrane or along a thin tube. Which one works best differs from protein to protein.",
     _here("Crystals are not grown at the beamline. They are grown in the laboratories of the scientists who use it, and shipped to NE-CAT already frozen.")],
    items=[('fig','gr_drop')]),
   dict(id='screen',nav='Many tries',h2='Nobody knows the recipe, so try hundreds',prose=[
     "Which recipe works for a given protein cannot be worked out in advance. It depends on the shape of the molecule and on the charges on its surface, in ways that are still not understood well enough to predict.",
     "So the search is done by trial. A robot sets out hundreds of drops, each a ten-thousandth of a milliliter or so, each with a different recipe, in plates of 96 wells. Over the following days and weeks every drop is looked at under a microscope.",
     "Most drops stay clear, or turn cloudy with precipitate, the solid without order that forms when the protein falls out too fast. With luck a few show crystals. The first ones are often too small or too flawed to use. Their recipe becomes the starting point for a second round that changes it a little at a time, until the crystals are large and well ordered.",
     "For some proteins good crystals are grown within a week. Some take years, and some have never been crystallized at all. Growing the crystal is often the hardest part of finding a structure.",
     _here("How well a crystal is ordered cannot be judged by eye. The real test is how far out its spots reach on the detector.")],
    items=[('fig','gr_screen')]),
   dict(id='ship',nav='To the beam',h2='From the drop to the beam',prose=[
     "A crystal is fished out of its drop with a tiny loop of fiber or plastic on the end of a metal pin. The film of liquid in the loop holds it in place.",
     "Often it is first dipped for a moment in an antifreeze, such as glycerol. It is then plunged straight into liquid nitrogen. The cooling is so fast that the water in and around the crystal sets as a glass, not as ice. The guide {guide:cold} explains why the crystal has to be cold, and why ice would ruin it.",
     "The frozen pins are loaded into pucks, round holders with places for 16 pins. The pucks are stacked seven at a time and shipped to the beamline in a container that keeps them cold on the way.",
     _here("The pucks go into the sample robot, which holds thirty of them on 24-ID-C. The robot places each pin in the beam in turn, and the scientists who grew the crystals usually run the experiment over the internet. The guide {guide:walk} follows the X-rays to the crystal.")],
    items=[('fig','gr_ship')]),
  ],
  remember="A protein crystal is grown by letting a drop of protein solution lose water slowly, until the molecules settle into order. Nobody can predict the recipe, so hundreds are tried, and the best crystals are frozen and sent to the beamline.",
  classroom=["Salt crystals form when salt water dries in a dish. In what ways is growing a protein crystal like that, and in what ways is it harder?",
             "Why does it matter that every molecule in the crystal faces the same way?",
             "Why is the water drawn out of the drop slowly, and not all at once?",
             "Try it: at the third stop, how many of the first 96 recipes gave crystals worth measuring? How many did after the recipe was adjusted?"],
  further='')
# in series 3, after How MX works and before the guides about cold and damage
_k=[g['key'] for g in G]
G.insert(_k.index(next(k for k in ('cold','damage','scatter') if k in _k)),GROW)
UPDATED['grow']='November 20, 2026'
