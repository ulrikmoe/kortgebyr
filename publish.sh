#!/bin/bash

if [[ $UID = 0 ]]; then
    echo "[Error] Please don't run this script as sudo."
    exit 1
fi

hostname=kortgebyr.dk
folder=/srv/kortgebyr.dk/www/

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

#  Build website
gulp clean
gulp build --lang da

#  Gzipping content
echo -n "Compress..."
for fil in $(find www -name '*.css' -or -name '*.js' -or -name '*.svg' -or -name '*.html'); do

   # Gzip
   if [ -z "$(which zopfli)" ]; then
      gzip -9 < $fil > $fil.gz
   else
      zopfli --i100 $fil;
   fi
   touch -r $fil $fil.gz

   # Brotli here.

   # Check if $fil.gz >= $fil.
   if [[ $(wc -c <"$fil.gz") -ge $(wc -c <"$fil") ]]; then
      rm $fil.gz
   fi

   echo -n "."
done; echo ""

#  Upload to Frankfurt (46.101.235.233)
echo "Uploading to Frankfurt..."
rsync -atrv --delete-after --progress -e ssh www/ 46.101.235.233:$folder

#  Upload to Ireland (212.71.253.48)
echo "Uploading to London..."
rsync -atrv --delete-after --progress -e ssh www/ 212.71.253.48:$folder
