# NWU Lekwena GitPages

This is the official page for the NWU Lekwena Radar. The site is deployed here
using jekyll and GitPages.

# Important
The page is updated everyday using a cron tab to deploy the newest synoptic
forecasts and any other changes that may have taken place.

Some practical considerations, in no specific order:
+ The site is static, this has a couple of advantages, but most important of
  all it is reliable. Keep it that way.
+ It would be wise to contact @h-havenga before doing anything else as he setup
  the original page and scripts
+ Be aware that there is a couple of cron scripts running in the background to:
    + Get the synoptic data and make the maps in a timely manner
    + Update the website with the newest synoptic maps daily
        + Look at the push_site.sh to get an idea of the github deployment
          process
+ DO NOT CHANGE the github username unnecessarily as this effects the page and
  you'll have trouble figuring out the redeployment.
+ IF you DID NOT follow my advice in the previous point:
    + Good for you
    + Change everything in the **layouts/default.html** from
      crggithub.github.io to <newusername.github.io>
    + Go to settings in the repository and change the page deployment to
      <newusername.github.io>
    + Go to web host and change crggithub.github.io to <newusername.github.io> 
+ **Always make sure there's unwilling willing grad student to maintain this.**

# The Cayman theme

[![Build
Status](https://travis-ci.org/pages-themes/cayman.svg?branch=master)](https://travis-ci.org/pages-themes/cayman)
[![Gem
Version](https://badge.fury.io/rb/jekyll-theme-cayman.svg)](https://badge.fury.io/rb/jekyll-theme-cayman)

*Cayman is a Jekyll theme for GitHub Pages. You can [preview the theme to see
what it looks like](http://pages-themes.github.io/cayman), or even [use it
today](#usage).*
