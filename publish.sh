#!/bin/bash
set -e

rm -rf www/*
export PATH="$PATH:$(pnpm bin)"

IP="kortgebyr.dk"
FOLDER="/var/www/kortgebyr.dk/"

# Timestamp of the last modified file in a folder.
gitstamp() {
    git log --pretty=format:%cd -n 1 --date=format:%s "$1"
}

compress() {
    echo -n "compressing $1..."
    zopfli --i100 "$1"
    brotli --best -w 0 -o "$1.br" "$1"
    touch -r "$1" -c "$1".{br,gz}
    [[ $(stat -c%s "$1.gz") -ge $(stat -c%s "$1.br") ]] || rm "$1.br"
    printf '\033[0;32mOK\033[0m\n'
}

# Check for outdated NPM modules
pnpm outdated --depth=0 || echo

if [[ -n "$(git status --porcelain 2>&1)" ]]; then
    printf '\033[0;31mWARNING: Uncommitted changes\033[0m\n' >&2
    read -p 'Do you want to continue? [y/N]: ' res
    [[ "$res" == y ]] || exit 0
fi

git fetch
if [[ "$(git rev-parse master)" != "$(git rev-parse origin/master)" ]]; then
    printf '\033[0;31mWARNING: Not synced to upstream\033[0m\n' >&2
    read -r -p 'Do you want to continue? (y/N): ' res
    [[ "$res" == y ]] || exit 0
fi

# Steal modification time from git
find src -type f | while read f; do
    t=$(git log --pretty=format:%cd -n 1 --date=format:%Y%m%d%H%M.%S "$f")
    [[ -n "$t" ]] && touch -t "$t" "$f"
done

IMG=$(gitstamp src/assets/img)
CSS=$(gitstamp src/css)
JS=$(gitstamp src/js)

gulp build --publish --cssStamp "$CSS" --gitStamp "$JS"

# Minify JavaScript
find -L www -iname '*.js' | while read f; do
    compress "$f"
done

# Minify CSS
find -L www -iname '*.css' | while read f; do
    compress "$f"
done

# Minify HTML
find -L www -iname '*.html' | while read f; do
    sed 's! xmlns="http://www\.w3\.org/2000/svg"!!g' "$f" > "$f.tmp" || exit 1
    touch -r "$f" "$f.tmp" && mv "$f.tmp" "$f"
    compress "$f"
done

# Compress SVG's
find -L www -iname '*.svg' | while read f; do
    sed 's/^[ \t]*//;s/[ \t]*$//' < "$f" | tr '\n' ' ' | sed 's/>[ \t]*</></g;s/[ \t]*$//' | tr -d '\n' > "$f.tmp" || exit 1
    touch -r "$f" "$f.tmp" && mv "$f.tmp" "$f"
    compress "$f"
done

printf "\033[0;31mWARNING: Production environment\033[0m\n" >&2
read -p "Push to $FOLDER? (y/N): " res

[[ "$res" =~ [yY] ]] || exit 0

rsync -rtOvp --chmod=ug=rw,o=r,Dugo+x,Dg+s --delete-after --progress -e ssh www/ "$IP:$FOLDER"
