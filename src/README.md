# Building the guides

The HTML pages in the folder above this one are built from the files here. Nothing in this folder is needed to read the guides. It is here so that they can be changed and rebuilt.

## Build

You need Python 3 and Node.js.

```sh
cd src
npm install        # once: fetches KaTeX, which turns the equations into MathML
sh build.sh        # rebuilds index.html and the guides in the folder above
```

To build somewhere else and leave the published pages alone:

```sh
OUTDIR=/tmp/guides sh build.sh
```

The build is repeatable: with no changes to the sources it writes pages identical, byte for byte, to the ones in the repository.

## Test

```sh
npm install --no-save playwright && npx playwright install chromium   # once
node test.js
```

This loads every page at desktop and phone width, steps through the Settings and Fill pattern menus, and reports script errors, sideways scrolling, and any read-out or sentence left empty. Set `SHOTS=1` to save full-page screenshots in `shots/`.

## Link previews and icons

Each page carries tags that Messages, LinkedIn, Slack and other apps use to show a card when its link is shared: a title, a description and a picture. `build.js` writes the tags. The pictures are files in `og/`, one for each page, made from the opening figures:

```sh
npm install --no-save playwright && npx playwright install chromium   # once
node ogimages.js
```

Run it after `build.sh` whenever an opening figure or a title changes, and commit the pictures with the pages. It also makes `apple-touch-icon.png` and `favicon-32.png` from `favicon.svg`. The apps keep their own copies of a card: after a change, LinkedIn's Post Inspector fetches a fresh one, and in Messages adding `?v=2` to the link does the same.

## What each file is

The build has three steps, run in order by `build.sh`.

| Step | File | What it does |
| --- | --- | --- |
| 1 | `compose.py` | Writes the body of each page: text, equation cards and figure panels. It also holds the style sheet tweaks, the list of series, the landing page, and the release number and dates. |
| | `aps_guide.py` | How APS works. Read by `compose.py`. |
| | `syn_guide.py` | What is a synchrotron?, Introductory. Read by `compose.py`. |
| | `walk_guide.py` | A walk down the beamline, Introductory. Read by `compose.py`. |
| | `xrf_guide.py` | X-ray fluorescence at NE-CAT. Read by `compose.py`. |
| | `src-body.v6.html` | The original polarization guide. `compose.py` takes the style sheet and the first equation cards and figure panels from it. Do not edit it: change `compose.py` instead. |
| 2 | `refactor.py` | Builds the script shared by the three guides with a Settings menu (How NE-CAT works, polarization, fluorescence), and the text that follows the menu. |
| | `src-script.v6.js` | The original script: the drawing kit and the first figures. Do not edit it: change `refactor.py` instead. |
| | `newfigs.js` | Later figures for How NE-CAT works and the polarization guide, and the scatter figures of the fluorescence guide. |
| | `xrffigs.js` | The fluorescence figures of the fluorescence guide. |
| 3 | `build.js` | Turns the equations into MathML, fills in the links between pages, and writes the finished pages and the redirect pages for old addresses. It also adds the visitor counter. |
| | `aps.js` | The figures of How APS works. |
| | `syn.js` | The figures of What is a synchrotron? |
| | `walk.js` | The figures of A walk down the beamline. |
| | `introkit.js` | Drawing helpers for the guides added from release 1.3 on. |
| | `home.js` | The figures of the landing page. |
| | `ogimages.js` | Not part of the build. Makes the link-preview pictures and the icons from the built pages. |
| | `favicon.svg` | The site icon. Copied to the site by `build.js`. |

Data tables, and the scripts that made them. They only need to be run again to add elements or change the tables, and they need the [xraylib](https://github.com/tschoonj/xraylib) Python package.

| File | Made by | What it holds |
| --- | --- | --- |
| `water.json` | `mkwater.py` | Elastic and Compton scattering of water against angle, for the scatter figures. |
| `xrf.json` | `mkxrf.py` | Absorption edges, emission lines, fluorescence yields and cross-sections of the elements in the fluorescence guide. |

## Where things are

- **Text of a section:** How NE-CAT works and the polarization guide are in the list `G` in `compose.py`. The others are in `aps_guide.py`, `syn_guide.py` and `xrf_guide.py`.
- **Series, levels and order:** the order of `G` is the reading order. `SERIES` in `compose.py` says which series each guide is in, and each guide's `level` (In-depth unless set) is shown on its page and its card. To add a guide, give it a `<key>_guide.py` file that inserts it into `G`, name that file in the list in `compose.py`, and add the guide to `SERIES`, to `CARDS`, to `OUT` in `build.js` and to the page lists in `test.js` and `ogimages.js`. A guide named in those lists whose file is not in this folder is left out of the build.
- **An Introductory guide:** set `level='Introductory'` in its entry, give it `remember` (one sentence), `classroom` (a list of questions) and `deeper` (the key of its In-depth guide), and leave out equation cards. Give each section a `_here(...)` note and one figure with one control. Set `short` on the In-depth guide to the key of its short version. `syn_guide.py` is the pattern to copy. `_here` and `_choice` in `compose.py` make the note in each section and a row of buttons for a choice between named states. Its address is the In-depth guide's with `-intro` added.
- **Addresses:** `OUT` in `build.js` gives each guide's file name. Names carry no numbers, so adding a guide never changes another guide's address.
- **An equation card:** `EQ[...]` entries, made with `card(title, tex, symbols, what it says, in numbers)`.
- **A figure:** its panel (controls, read-outs, caption) is a `FIG[...]` entry in the Python files. Its drawing code is in the `.js` file listed above, in a block that starts `if($('...Cv')){`.
- **Beamline settings:** the `PRESETS` table at the top of `src-script.v6.js`, with additions in `refactor.py`.
- **Fill patterns of How APS works:** the `MODES` table at the top of `aps.js`.
- **Spelling:** the text is written in US spelling. `build.js` also converts a short list of UK spellings left in the original files.

## Making a release

1. In `compose.py`, set `RELEASE` to the new number and date, and set the date in `UPDATED` for each guide whose content changed.
2. Add an entry at the top of `CHANGELOG.md` in the folder above.
3. Run `sh build.sh` and `node test.js`. If a title or an opening figure changed, run `node ogimages.js` too.
4. Commit, push, and check the live site.
5. Tag the commit and publish the release:

```sh
git tag -a v1.4 -m 'Release 1.4: ...'
git push origin v1.4
gh release create v1.4 --verify-tag --title 'Release 1.4' --notes '...'
```

File names should not need to change. If one ever does, add the old name to its `old` list in `build.js` so that the old address redirects.
