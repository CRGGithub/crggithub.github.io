#!/bin/bash
today=$(date +"%Y%m%d")

#git pull origin master
##timeout 15 bundle exec jekyll serve
#git add .
#git commit -m "$today"
#git push origin master

rm -rf .git
git init
git add .
git remote add origin https://github.com/CRGGithub/crggithub.github.io.git
git remote set-url origin https://github.com/CRGGithub/crggithub.github.io.git
#git remote set-url origin git@github.com:CRGGithub/crggithub.github.io.git
git commit -m "$today"
git push --force origin master
