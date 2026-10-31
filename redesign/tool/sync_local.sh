#!/bin/bash
# Refresh Gabi's double-click local copy of the redesign after any change.
S=/private/tmp/claude-502/-Users-Gabi/999c6394-ead1-4bde-8b52-d23580c1a3f3/scratchpad/site
D="/Users/Gabi/Desktop/Boost Club/Website/Boost Club NEW website/site"
cd $S && printf '%s' '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' > _home_local.html && cat index.html >> _home_local.html && echo '</body></html>' >> _home_local.html
rsync -a --delete --exclude '_home_local.html' --exclude '*.bak*' --exclude '*.py' --exclude 'i18n/*.json' --exclude 'i18n/*.md' --exclude 'lab/' --exclude '__pycache__' $S/ "$D/" && cp $S/_home_local.html "$D/index.html"
# cache-bust every local stylesheet and script so a refresh always picks up the newest files
V=$(date +%s)
find "$D" -name '*.html' -exec perl -pi -e 's/((?:href|src)="(?:\.\.\/)?(?:site|kit\/[a-z]+|anim\/anim|results\/results|reviews\/reviews|i18n\/[a-z-]+)\.(?:css|js))(?:\?v=\d+)?"/$1?v='"$V"'"/g' {} +
find "$D" -name '*.html' -exec perl -pi -e 's/((?:src|href|poster)="(?:\.\.\/)?(?:img|brand|video|results\/img|cups)\/[^"?]+\.(?:png|jpe?g|webp|svg|ico|mp4))(?:\?v=\d+)?"/$1?v='"$V"'"/g' {} +
