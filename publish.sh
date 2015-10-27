#!/bin/bash

hostname=scanpay.dk
folder=kortgebyr.dk
filename=$(date +"%Y%m%d%H%M")

#  Build website
gulp clean
gulp build --lang da

#  Gzip: css, js, html
echo -n "Gzipping"
for f in $(find www -name '*.css' -or -name '*.js' -or -name '*.svg' -or -name '*.html'); do
   if [ -z "$(which zopfli)" ]; then
      gzip -9 < $f > $f.gz
   else
      echo -n "."
      zopfli --i1000 $f;
   fi
done; echo ""

#  Make tarball of 'www' folder
tar -Jcf $filename.tar.xz www

#  Upload to server and untar at /srv/$folder/
rsync --remove-source-files --progress -e ssh $filename.tar.xz $hostname:/srv/$folder
ssh $hostname "cd /srv/$folder; rm -rf old; mv www old; tar xfJ $filename.tar.xz"
