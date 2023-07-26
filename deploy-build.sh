#!/bin/sh
npm install --arch=x64 --platform=linux --libc=musl sharp@^0.32.0

npm ci --no-audit

npm run build

npm prune --omit=dev --no-audit

echo 'Copying...'

rm -rf ./build && mkdir ./build

cp package*.json ./build/

cp next.config.js ./build/

cp -r public ./build/

mkdir ./build/.next

cp -r .next/static ./build/.next/

cp -r .next/standalone ./build/.next/

echo 'Copying Done.'