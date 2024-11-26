---
title: Search
description: Search this site
keywords: search
image:
  source: "about-bob.jpg"
  alt: "a picture of Bob from 2009"
permalink: /search/
pagestyle: search
---

# {{ title }}

<div class="popout">
  <script src="/pagefind/pagefind-ui.js"></script>
  <div id="search"></div>
  <script>
      window.addEventListener('DOMContentLoaded', (event) => {
          new PagefindUI({ element: "#search", showImages: false, autofocus: true, sort: { date: "desc" } });
      });
  </script>
</div>