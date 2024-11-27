#!/bin/bash
today=$(date +"%Y%m%d")
git pull origin master
#timeout 15 bundle exec jekyll serve
git add .
git commit -m "$today"
git push origin master
