#!/bin/sh -e

which grep 1>/dev/null

grep -irnHIE '\.?\b(skip|only|fix.?me|todo)\b' src  \
  --exclude-dir=node_modules --exclude-dir=build    \
  --exclude-dir=__snapshots__
