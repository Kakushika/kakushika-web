#!/bin/bash

git config --global user.email "hostmaster@kksk.io"
git config --global user.name "CircleCI"

cd dist
git add .
git commit -m "Circle CI #$CIRCLE_BUILD_NUM"
git push origin master
