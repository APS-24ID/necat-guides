#!/bin/sh
# Rebuilds every page of the guides. Needs Python 3 and Node.js, and "npm install" run once in this folder.
# The pages are written to the folder above this one unless OUTDIR says otherwise.
set -e
cd "$(dirname "$0")"
python3 compose.py > /dev/null     # page bodies: text, equation cards, figure panels
python3 refactor.py > /dev/null    # the script shared by guides 2 to 4
node build.js                      # equations to MathML, links, finished pages
