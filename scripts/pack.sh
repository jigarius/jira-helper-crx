#!/usr/bin/env bash

chromePath="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -f "$chromePath" ]; then
  echo "Missing: $chromePath"
  echo "Aborting."
  exit 1
fi

extPath=$PWD
if [ ! -f "$extPath/manifest.json" ]; then
  echo "Missing: $extPath"
  echo "Execute the script from the unpacked extension's root."
  echo "Aborting."
  exit 1
fi

keyPath="/Users/$USER/.secret/JiraHelper.pem"
if [ ! -f "$keyPath" ]; then
  echo "Missing: $keyPath"
  echo "Aborting."
  exit 1
fi

"$chromePath" --pack-extension="$extPath" --pack-extension-key="$keyPath"

