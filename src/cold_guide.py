# The guide "Why are we freezing our crystals?": the Introductory companion to "Radiation damage and the dose limit".
# Read by compose.py. Its figures are in cold.js. See walk_guide.py for the pattern of an Introductory guide.
FIG['c_hero']=_panel('coldHeroCv','Animation: a crystal on a loop sits in the X-ray beam while cold gas streams over it from a nozzle. A label gives its temperature, minus 173 degrees Celsius. The pattern of spots it makes is beside it',None,None,
 "A crystal in the X-ray beam, with cold nitrogen gas streaming over it from the nozzle. The gas keeps it at 173 degrees below zero for as long as it is being measured.")
FIG['c_fade']=_panel('cFadeCv','Interactive: a crystal in the X-ray beam and the pattern of spots it gives. A slider adds to the X-ray energy the crystal has absorbed. The spots at the edge of the pattern, which carry the fine detail, fade first, and the crystal turns brown',
 [_slw('cfT','X-ray energy the crystal has absorbed','0% of the limit',0,200,1,0)],
 [('Detail that is still clear','cfD'),('Spots still easy to see','cfN')],
 "The spots near the middle of the pattern carry the coarse outline of the molecule. The ones toward the edge carry the fine detail. As the crystal absorbs more X-ray energy the outer spots fade first. The slider counts that energy as a share of the limit most experiments keep to. The crystal is drawn turning brown, as real ones often do. An ångström, written Å, is a ten-millionth of a millimeter, about the size of an atom. The fading follows a rule of thumb, and real crystals vary.")
FIG['c_warm']=_panel('cWarmCv','Interactive: a field of green chemical bonds. X-rays land at five places and each leaves a red reactive fragment. At room temperature the fragments wander and break the bonds they pass, which turn red. At minus 173 degrees they stay where they formed and the damage does not spread. Two buttons choose the temperature',
 [_choice('cW','Temperature of the crystal',[('0','Room temperature'),('1','Cold: −173 °C')],'0')],
 [('Bonds broken so far','cwB'),('How long the crystal lasts','cwL')],
 "The green lines are chemical bonds in the crystal. Five X-rays land, and each leaves a reactive fragment, drawn as a red dot. Warm, the fragments wander and break the bonds they pass. Cold, they are stuck where they formed. Switch between the two and watch the count. The picture runs for 16 seconds and starts again. It is a drawing of the idea, not a calculation.")
FIG['c_ice']=_panel('cIceCv','Interactive: a frozen drop holding a crystal, and the pattern on the detector. With no antifreeze the drop is full of ice crystals and the pattern is crossed by dark rings. A slider adds antifreeze: the ice goes, the drop becomes a clear glass and the rings disappear',
 [_slw('cA','Antifreeze added before cooling','0%',0,40,1,0)],
 [('Ice in the sample','ciI'),('Rings on the detector','ciR')],
 "Left: the drop of liquid that surrounds the crystal, after cooling. Right: what the detector sees. Ice in the drop puts dark rings across the pattern and weakens the spots. Add antifreeze and the water sets as a clear glass, with no rings. How much antifreeze a crystal needs depends on the crystal and on how fast it is cooled. The amounts here are only to show the trend.")
FIG['c_therm']=_panel('cThermCv','Interactive: a temperature scale from absolute zero to body temperature, with markers for a warm room, freezing water, dry ice, the coldest air recorded on Earth, the crystal in the beam and liquid nitrogen. A slider moves along the scale',
 [_slw('cK','Temperature','20 °C',-273,40,1,20)],
 [('On the kelvin scale','ctK'),('Nearest marker','ctN')],
 "A scale of temperature from absolute zero, at the left, to body temperature. The crystal in the beam is marked in red. It is colder than anything in everyday life, and still 100 degrees above the coldest temperature there can be.")

COLD=dict(key='cold',title='Why Are We Freezing Our Crystals?',name='Why are we freezing our crystals?',kicker='NE-CAT guides · cold crystals in five minutes',h1='Why are we freezing our crystals?',level='Introductory',deeper='damage',
  lede="X-rays show us the atoms in a crystal, and at the same time they slowly destroy it. Cooling the crystal to 173 degrees below zero makes it last far longer. This guide explains what the X-rays do, why cold helps, and how a crystal that is half water is cooled without turning to ice.",
  hero='c_hero',table='none',bar='',
  sections=[
   dict(id='damage',nav='Damage',h2='X-rays wear the crystal out',prose=[
     "Most X-rays pass straight through the crystal. A few are absorbed, and each of those knocks an electron out of an atom with great force. That electron tears through its neighbors and breaks chemical bonds as it goes.",
     "Broken bonds mean that the molecules in the crystal are no longer all alike. The crystal still gives spots, but the spots that carry the finest detail fade first. Keep going and only a coarse picture is left.",
     "So every crystal has a budget. Once it has absorbed a certain amount of X-ray energy, the fine detail is gone for good.",
     _here("The beam on 24-ID-C carries about 15 trillion X-rays a second into a spot smaller than the crystal. At full strength it would use up a crystal's budget in less than a second, so the strength of the beam and the time spent in it are chosen with care.")],
    items=[('fig','c_fade')]),
   dict(id='cold',nav='Cold',h2='Cold stops the damage from spreading',prose=[
     "The first hit is only the start. Each broken bond leaves fragments that react with almost anything. A warm crystal is about half water, and in it these fragments drift about and attack whatever they meet. One X-ray ends up harming molecules far from where it landed.",
     "Cold changes that. At 173 degrees below zero the water in the crystal is solid, and the fragments are stuck where they formed. The first hit still happens. The spreading does not.",
     _here("The crystal sits in a stream of nitrogen gas at 100 kelvin, which is 173 degrees below zero Celsius. A cold crystal lasts roughly 70 times longer in the beam than a warm one.")],
    items=[('fig','c_warm')]),
   dict(id='ice',nav='No ice',h2='The trick is to cool it without making ice',prose=[
     "A protein crystal is about half water. If that water freezes into ordinary ice, the ice crystals grow, push the protein molecules out of line and ruin the crystal. Ice also puts rings of its own on the detector, and they hide the spots underneath.",
     "The answer is to cool the crystal so fast that the water has no time to form ice crystals. It stays as disordered as a liquid, but solid. That is a glass. The crystal is plunged into liquid nitrogen, often after a soak in an antifreeze such as glycerol, which makes the glass easier to form.",
     "So freezing is not quite the right word. People in the field say the crystal is cryocooled, or vitrified, which means turned to glass.",
     _here("Crystals arrive at NE-CAT already cooled, in liquid nitrogen at 196 degrees below zero. A robot moves each one from its store to the beam quickly enough that it stays cold all the way.")],
    items=[('fig','c_ice')]),
   dict(id='scale',nav='How cold',h2='How cold is that?',prose=[
     "173 degrees below zero is colder than the air has ever been anywhere on Earth. It is about 20 degrees warmer than liquid nitrogen, which is what does the cooling.",
     "Scientists usually call it 100 kelvin. The kelvin scale counts up from absolute zero, the temperature at which there is no heat left to take away.",
     _here("The gas stream holds the crystal at 100 kelvin for as long as it is in the beam, whether that is a few seconds or several hours.")],
    items=[('fig','c_therm')]),
  ],
  remember="X-rays slowly destroy the crystal they measure. Keeping it at 173 degrees below zero stops the damage from spreading, so it lasts about 70 times longer, as long as it was cooled fast enough that no ice formed.",
  classroom=["Food keeps longer in a freezer. In what way is that like the crystal in the cold stream, and in what way is it different?",
             "Why does ordinary ice harm a crystal when a glass does not?",
             "A bigger crystal can soak up more X-ray energy in total. Why does that not let it last longer in the same beam?",
             "Try it: at the first stop, how much of the limit can the crystal absorb before detail finer than 2 Å is lost?"],
  further='')
G.insert([g['key'] for g in G].index('scatter'),COLD)
UPDATED['cold']='November 13, 2026'
