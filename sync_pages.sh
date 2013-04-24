#!/bin/sh
function sync() {
  git checkout gh-pages && git merge master && git push && git checkout master
}

if [ -n "`git status | grep modified`" ]; then
  echo "Can't sync, repository is dirty :("
  exit 1;
fi

sync && echo "Sync done."
