# The guide "What is a protein?": an Introductory guide, the first of series 4. It has no In-depth partner.
# Read by compose.py. Its figures are in prot.js. See walk_guide.py for the pattern of an Introductory guide.
_KEY=" Yellow links are oily and avoid water. Pale blue ones are water-loving. Dark blue ones carry a positive electric charge and red ones a negative charge."
FIG['pr_hero']=_panel('protHeroCv','Animation: a chain of 153 colored beads, laid out in rows, folds up into the compact shape of the protein myoglobin, which holds a red heme group. It then stretches out again',None,None,
 "A protein is a chain. This one is myoglobin, drawn with one bead for each of its 153 links. It folds into a compact shape, and only when it is folded can it hold the red heme group that does its work. The folding is drawn as a simple slide from one arrangement to the other. A real chain finds its shape by a far less tidy route.")
FIG['pr_chain']=_panel('pChainCv','Interactive: the 153 links of myoglobin drawn as a row of beads that runs back and forth, colored by the kind of amino acid. Clicking a bead, or moving a slider, chooses a link. Beside the chain a panel shows the atoms of the chosen amino acid and the bonds between them: the backbone that every link shares, and its own side piece above',
 [_slw('pI','Move along the chain','link 64 of 153',1,153,1,64)],
 [('Amino acid at this link','pIn'),('Its kind','pIk'),('How many of it in myoglobin','pIc')],
 "The chain of myoglobin, from its first link to its last, with one bead for each amino acid. Click or tap a bead, or use the slider, to choose a link. The panel shows the atoms of that amino acid and the bonds that join them. The part on the pale band is the backbone, which is the same in every link; the dashed lines lead to the links on either side. The part above it is the side piece, which is different in each of the 20 kinds. A double line is a double bond. Hydrogen atoms are left out, and the molecule is drawn flat."+_KEY+" The 20 kinds of amino acid are sorted into these four groups here to keep the picture simple. Chemists divide them more finely.")
FIG['pr_fold']=_panel('pFoldCv','Interactive: the chain of myoglobin as colored beads. Two buttons switch between the chain stretched out in rows and the chain folded into its compact shape, 45 angstroms across. When it is folded, a dashed circle marks the average distance of the oily links from the middle',
 [_choice('pF','The chain',[('0','Stretched out'),('1','Folded')],'0')],
 [('Size','pFs'),('Where the oily links are','pFo')],
 "The same chain, stretched out and folded. The folded shape is the real one: each bead is where that amino acid sits in myoglobin, seen from one side. The dashed circle marks how far the oily links are from the middle, on average. The charged links are further out."+_KEY+" The stretched chain is drawn in rows to fit the picture. In a straight line it would be more than ten times as long as the folded protein is wide. An ångström, written Å, is a ten-millionth of a millimeter, about the size of an atom.")
FIG['pr_oxy']=_panel('pOxyCv','Interactive: myoglobin drawn as a folded tube, with its heme group in red and the iron atom at the center of the heme. Two buttons choose between the protein empty and the protein holding oxygen. With oxygen, a molecule of two red atoms moves in and sits on the iron, and a patch showing the color of the protein turns from dark purple-red to bright red',
 [_choice('pO','Myoglobin',[('0','Empty'),('1','Holding oxygen')],'0')],
 [('On the iron','pOi'),('Color of the protein','pOc')],
 "Myoglobin, with the chain drawn as a tube. The coiled stretches, called helices, are blue. The heme, myoglobin's cofactor, is red, with its iron atom in orange. An oxygen molecule is two oxygen atoms joined together. One of the two rests on the iron and the other tilts away from it. The molecule sits on the side where link 64 of the chain helps to hold it. The protein is drawn from its measured structure. The oxygen is placed by hand, on the side of the iron where it is known to sit, and the path it takes on its way in is only drawn for the eye.")
FIG['pr_jobs']=_panel('pJobsCv','Interactive: five proteins drawn to one scale as tubes that follow their chains, from small to large: insulin, lysozyme, myoglobin, hemoglobin and an antibody, with a scale bar of 50 angstroms. Buttons choose one, and its job, the number of links in its chains and its size are shown',
 [_choice('pJ','Choose a protein',[('ins','Insulin'),('lys','Lysozyme'),('mb','Myoglobin'),('hb','Hemoglobin'),('igg','Antibody')],'mb')],
 [('Its job','pJj'),('Links in its chains','pJl'),('Size','pJz')],
 "Five proteins to one scale, each drawn from its measured structure in the Protein Data Bank. The chain is shown as a tube. Coiled stretches, called helices, are blue. Strands, which lie side by side in sheets, are green, and the rest is grey. Insulin has two short chains. Lysozyme is one chain with a groove across it, where it holds the molecule it cuts. Hemoglobin is four chains, each much like myoglobin and each with its own red heme as a cofactor. The antibody is four chains made almost wholly of strands, and it grips its target with the tips of its two arms. The structures are entries 4INS, 2LZT, 1MBN, 4HHB and 1IGT. The insulin is from a pig, the lysozyme from a hen's egg, the hemoglobin from a person and the antibody from a mouse.")

PROT=dict(key='prot',title='What Is a Protein?',name='What is a protein?',kicker='NE-CAT guides · proteins in five minutes',h1='What is a protein?',level='Introductory',
  lede="Proteins do most of the work in every living thing. Each one is a long chain that folds into a shape of its own, and the shape is what lets it do its job. This guide shows what the chain is made of, how it folds, what one protein does with its shape, and why scientists go to such lengths to see that shape.",
  hero='pr_hero',table='none',bar='',
  sections=[
   dict(id='chain',nav='A chain',h2='A protein is a chain',prose=[
     "Proteins digest your food, carry oxygen in your blood, fight infections, make your muscles pull and pass signals from one cell to another. Your DNA holds the instructions for about 20,000 kinds of them.",
     "Every one is a chain. The links are small molecules called amino acids, and there are 20 kinds. They work like letters. With 20 letters and chains hundreds of links long, there is no end to the words that can be written. The order of the links in each protein is spelled out in a gene.",
     "The 20 kinds differ in the side piece that each one carries. Some side pieces are oily and avoid water. Some are water-loving. Some carry an electric charge. These differences decide everything that comes next.",
     _here("The protein in these guides is myoglobin, from the muscle of the sperm whale. Its chain has 153 links.",'In these guides.')],
    items=[('fig','pr_chain')]),
   dict(id='fold',nav='Folding',h2='The chain folds into a shape',prose=[
     "A chain of amino acids does not stay loose. In the water of a cell most chains fold up, often in less than a second, into one compact shape. A given chain folds into the same shape each time, because the order of its links decides how it folds. There are exceptions. Some large proteins need helper proteins to fold correctly, some chains fold the wrong way, and some proteins keep parts that stay loose.",
     "Water does much of the work. The oily links are pushed together, away from the water, and end up mostly inside. The water-loving links stay mostly on the outside. Along the way stretches of the chain wind into coils called helices, or run as straight strands that lie side by side in flat sheets. Myoglobin has eight helices and no sheets.",
     "The result is small. Myoglobin's chain, pulled straight, would be more than 500 Å long. Folded, it is a lump about 45 Å across.",
     _here("A folded protein is far too small to see with any microscope that uses light. Finding its shape is what the X-rays at NE-CAT are for. The guide {guide:see} shows how it is done.")],
    items=[('fig','pr_fold')]),
   dict(id='job',nav='A job',h2='The shape is what does the job',prose=[
     "Folded, myoglobin has a pocket, and in the pocket sits a flat ring called a heme, with an atom of iron at its center. A molecule of oxygen can settle on the iron and stay there. That is myoglobin's main job: it holds oxygen in muscle until the muscle needs it.",
     "The heme is not part of the chain. It is a cofactor: a helper that a protein holds in order to do its job. Amino acids alone cannot grip oxygen, so myoglobin borrows an iron atom to do it. A great many proteins rely on a cofactor. Some hold a single atom of a metal such as zinc, copper or iron. Others hold a small molecule, and many of those are made in the body from vitamins.",
     "The pocket matters as much as the iron. It lets oxygen in and out, and it shields the iron so that it goes on working. A heme floating loose in water cannot do this. The stretched-out chain cannot do it either. Only the folded protein can.",
     "Animals that dive pack their muscles with myoglobin. A sperm whale can stay under water for more than an hour on the oxygen it carries down. Myoglobin is also what makes red meat red.",
     "Lose the shape and the job is lost. Heat unfolds proteins, which is why an egg white sets when it is cooked and does not go back. Sometimes one wrong link is enough. In sickle cell disease a single link out of 146 in one chain of hemoglobin, the oxygen carrier of the blood, is of the wrong kind. The proteins then stick to one another in stiff fibers, which bend the red blood cells out of shape.",
     _here("Myoglobin was the first protein whose shape was ever seen. John Kendrew and his colleagues worked it out with X-rays and crystals in the late 1950s. It was this same myoglobin, from the sperm whale, and the structure drawn in these guides, entry 1MBN in the Protein Data Bank, comes from that work.",'A first.')],
    items=[('fig','pr_oxy')]),
   dict(id='kinds',nav='Many kinds',h2='Different shapes for different jobs',prose=[
     "Each kind of protein has its own chain, its own shape and its own job. Some are small and made of one chain. Some are built from several chains that fit together. The largest machines in a cell are assemblies of dozens of proteins.",
     "To understand how a protein works, scientists need to see its shape, down to the atoms. More than 250,000 structures of proteins and other large molecules have been measured so far and placed in a public library, the Protein Data Bank, where anyone can look at them. Many proteins are in it more than once, measured under different conditions or with different molecules bound.",
     "The shapes are useful as well as interesting. Most medicines work by fitting into a pocket on one particular protein and changing what it does. Knowing the shape of the pocket shows what would fit.",
     _here("Scientists bring crystals of proteins of all these kinds to the beamlines, and take home the measurements from which their shapes are worked out.")],
    items=[('fig','pr_jobs')]),
  ],
  remember="A protein is a chain of amino acids that folds into one particular shape, and the shape is what lets it do its job. To understand a protein, or to design a medicine that acts on it, we need to see that shape.",
  closing='How can anyone see a shape this small? Go on to the guide {guide:see}. The protein first has to be grown into a crystal, and the guide {guide:grow} shows how that is done. For much more about proteins and what they do, visit <a href="https://pdb101.rcsb.org/" target="_blank" rel="noopener">PDB-101</a>, the teaching site of the Protein Data Bank.',
  classroom=["There are 20 kinds of amino acid. How many different chains of just three links can be made? What does that suggest about chains of 153?",
             "An egg white turns solid and white when it is cooked, and stays that way when it cools. What has happened to its proteins?",
             "Why would a whale need more myoglobin in its muscles than a person does?",
             "Myoglobin uses 19 of the 20 kinds of amino acid. The one it lacks is cysteine. Try it: at the first stop, which kind does it use most often?",
             "Try it: at the first stop, find links 64 and 93. What amino acid are they? In the folded protein they sit on either side of the iron."],
  further='')
# the first guide of series 4, after every guide of the earlier series
G.append(PROT)
UPDATED['prot']='November 20, 2026'
