# Base OG image for blog posts on post titles

This document outlines an idea for generating the OG images for blog posts on the website such that they inlcude the post title along with an image of me.

## Desired outcome

Whenever I share a blog post from this site to social media, I would like it to be automatically generated and show the title of the post along with the same image of me that I use on the home page of the website (round in shape) with a back ground color that is the same as the dark mode of site. It should use the same IBM Plex fonts as used on the site, using the one that is used for the page headers.

## Workflow

I would like the generation of the image to take place during build time of the site. It should happen regardless of whether I'm building locally or deploying the site. Once it is generated, it should not be re-generated on subsequent rebuilds, unless I change the title during development mode.
