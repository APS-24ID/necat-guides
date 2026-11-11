# Building the guides

The HTML pages in the folder above this one are built from the files here. Nothing in this folder is needed to read the guides. It is here so that they can be changed and rebuilt.

## Build

You need Python 3 and Node.js.

```sh
cd src
npm install        # once: fetches KaTeX, which turns the equations into MathML
sh build.sh        # rebuilds index.html and the four guides in the folder above
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

## What each file is

The build has three steps, run in order by `build.sh`.

| Step | File | What it does |
| --- | --- | --- |
| 1 | `compose.py` | Writes the body of each page: text, equation cards and figure panels. It also holds the style sheet tweaks, the landing page, and the release number and dates. |
| | `aps_guide.py` | Guide 1, How APS works. Read by `compose.py`. |
| | `xrf_guide.py` | Guide 4, X-ray fluorescence at NE-CAT. Read by `compose.py`. |
| | `src-body.v6.html` | The original polarization guide. `compose.py` takes the style sheet and the first equation cards and figure panels from it. Do not edit it: change `compose.py` instead. |
| 2 | `refactor.py` | Builds the script shared by guides 2 to 4, with the beamline settings menu and the text that follows it. |
| | `src-script.v6.js` | The original script: the drawing kit and the first figures. Do not edit it: change `refactor.py` instead. |
| | `newfigs.js` | Later figures for guides 2 and 3, and the scatter figures of guide 4. |
| | `xrffigs.js` | The fluorescence figures of guide 4. |
| 3 | `build.js` | Turns the equations into MathML, fills in the links between pages, and writes the finished pages and the redirect pages for old addresses. It also adds the visitor counter. |
| | `aps.js` | The figures of guide 1. |
| | `home.js` | The figures of the landing page. |

Data tables, and the scripts that made them. They only need to be run again to add elements or change the tables, and they need the [xraylib](https://github.com/tschoonj/xraylib) Python package.

| File | Made by | What it holds |
| --- | --- | --- |
| `water.json` | `mkwater.py` | Elastic and Compton scattering of water against angle, for the scatter figures. |
| `xrf.json` | `mkxrf.py` | Absorption edges, emission lines, fluorescence yields and cross-sections of the elements in guide 4. |

## Where things are

- **Text of a section:** guides 2 and 3 are in the list `G` in `compose.py`. Guides 1 and 4 are in `aps_guide.py` and `xrf_guide.py`.
- **An equation card:** `EQ[...]` entries, made with `card(title, tex, symbols, what it says, in numbers)`.
- **A figure:** its panel (controls, read-outs, caption) is a `FIG[...]` entry in the Python files. Its drawing code is in the `.js` file listed above, in a block that starts `if($('...Cv')){`.
- **Beamline settings:** the `PRESETS` table at the top of `src-script.v6.js`, with additions in `refactor.py`.
- **Fill patterns of guide 1:** the `MODES` table at the top of `aps.js`.
- **Spelling:** the text is written in US spelling. `build.js` also converts a short list of UK spellings left in the original files.

## Making a release

1. In `compose.py`, set `RELEASE` to the new number and date, and set the date in `UPDATED` for each guide whose content changed.
2. Add an entry at the top of `CHANGELOG.md` in the folder above.
3. Run `sh build.sh` and `node test.js`.
4. Commit, push, and check the live site.
5. Tag the commit and publish the release:

```sh
git tag -a v1.3 -m 'Release 1.3: ...'
git push origin v1.3
gh release create v1.3 --verify-tag --title 'Release 1.3' --notes '...'
```

If a guide's file name changes, add the old name to its `old` list in `build.js` so that the old address redirects.
