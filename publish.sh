#!/bin/bash

timestamp=$(date +"%Y%m%d%H%M")

gulp clean
gulp build --lang da

# Gzip files{html,css,js,svg}
echo -n "Gzipping"
for file in $(find www -name '*.css' -or -name '*.js' -or -name '*.svg' -or -name '*.html'); do
   if [ -z "$(which zopfli)" ]; then
      gzip -9 < $file > $file.gz
   else
      echo -n "."
      zopfli --i1000 $file;
   fi
done
echo ""

## Create tar.xz
tar -Jcf $timestamp.tar.xz www

## Upload and untar
rsync --remove-source-files --progress -e ssh $timestamp.tar.xz scanpay.dk:/srv/kortgebyr.dk/
ssh scanpay.dk "cd /srv/kortgebyr.dk; rm -rf www; tar xfJ $timestamp.tar.xz"
