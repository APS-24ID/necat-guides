# NE-CAT beamline guides

Illustrated, interactive guides to the Advanced Photon Source, the NE-CAT beamlines (24-ID-C and 24-ID-E), and macromolecular crystallography.

**Read them here: https://aps-24id.github.io/necat-guides/**

The guides are grouped in series. Each is marked with its level. Introductory guides take about five minutes and have no equations. In-depth guides include the equations and worked numbers.

| File | Series | Guide | Level |
| --- | --- | --- | --- |
| `index.html` | | Landing page: the list of guides by series | |
| `how-aps-works-intro.html` | 1. The machine | What is a synchrotron? How the APS makes X-rays, in five stops and five minutes | Introductory |
| `how-aps-works.html` | 1. The machine | How APS works: from the electron gun to the stored beam | In-depth |
| `how-necat-works.html` | 2. The beamline | How NE-CAT works: from the storage ring to the detector | In-depth |
| `polarization.html` | 2. The beamline | Why the X-ray beam is polarized | In-depth |
| `fluorescence.html` | 3. The experiment | X-ray fluorescence at NE-CAT: what it is, what it is used for, and where the detector goes | In-depth |

Each page is a single self-contained HTML file. The pages link to each other by file name, so keep the names unchanged and keep them all in the same folder.

The files whose names begin `NE-CAT_` are small redirect pages. They are the addresses the guides had before release 1.3, kept so that existing links still work.

Values that are assumed or calculated, and not taken from a published source, are marked in the notes of each guide. Corrections are welcome: please open an issue.

## Building

The pages are built from the sources in [`src/`](src/). [src/README.md](src/README.md) says how. Nothing in that folder is needed to read the guides.

## Releases

Releases are tagged in this repository (`v1.0`, `v1.1`, ...) and described in [CHANGELOG.md](CHANGELOG.md). Each page shows its release number and the date it was last updated at its foot.

## Acknowledgment

The NE-CAT beamlines are funded by the National Institute of General Medical Sciences from the National Institutes of Health (P30 GM124165).

## License

Copyright (c) 2026 NE-CAT, Cornell University. Released under the [MIT License](LICENSE).
