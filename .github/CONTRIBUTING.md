# Contributing to the NE-CAT beamline guides

These are illustrated, interactive guides to the Advanced Photon Source, the NE-CAT beamlines and macromolecular crystallography. They are read at https://aps-24id.github.io/necat-guides/. Corrections and suggestions are welcome from anyone.

## Report an error

This is the most useful contribution. [Open an issue](https://github.com/APS-24ID/necat-guides/issues/new/choose) and choose "Report an error in a guide". Say which guide, where in it, what is wrong and, if you know, what is right. A source helps: a paper, a manufacturer's specification, a facility page. If you have no GitHub account, write to necat@cornell.edu instead.

Each guide's notes mark the values that are assumed or calculated and not taken from a published source. Those are the ones most in need of a check by someone who knows the real number.

## Suggest a topic

Open an issue and choose "Suggest a topic". Put the question the way a visitor or a student would ask it. Topics are ranked on how many readers want them, whether NE-CAT is the right one to explain them, whether other guides depend on them, and how much existing material they can reuse.

## Change a guide yourself

1. The pages in the top folder are built from the sources in [`src/`](../src/). Change the sources, not the built pages. [`src/README.md`](../src/README.md) says how the build works and where each guide's text and figures are.
2. Rebuild and test:
   ```sh
   cd src
   npm install        # once
   sh build.sh
   npm install --no-save playwright && npx playwright install chromium   # once
   node test.js
   ```
   The build is repeatable, so a pull request should contain the changed sources and the pages rebuilt from them.
3. Open a pull request and fill in its checklist.

## What a guide has to meet

- **One question.** The title asks it or names it, and the first screen answers it in a sentence.
- **Two levels.** A five-minute guide has no equations, one idea and one figure at each stop, and a note tying each stop to NE-CAT. An in-depth guide has equation cards that give each formula in symbols, in words and in numbers.
- **Figures that do something.** Each control changes the picture and a sentence beside it.
- **Real numbers.** Energies, beam sizes and distances are those of 24-ID-C and 24-ID-E. A number with no source is marked as assumed or calculated in the guide's notes.
- **Honest simplification.** A caption says when a drawing is a cartoon or a model is simplified. A simplified statement must still be true.
- **Plain language.** Short sentences, terms defined where they first appear, US spelling.
- **Works everywhere.** Readable at phone width, usable by touch, with a text description on each figure for screen readers.

## Review and release

Every change is reviewed by NE-CAT before it is published. Releases are numbered and described in [`CHANGELOG.md`](../CHANGELOG.md). Please do not change the release number, the changelog or the tags in a pull request.

## Credit and license

The guides are released under the [MIT License](../LICENSE), and contributions are accepted under the same license. The text, figures and code were written with Claude, an AI model made by Anthropic, under the direction of NE-CAT, which reviews them.

## Code of conduct

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
