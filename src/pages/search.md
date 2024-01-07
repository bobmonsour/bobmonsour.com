---
title: Search
description: Search this site
keywords: search
image:
  source: "young-bob.jpg"
  alt: "a picture of Bob's face as a boy"
permalink: /search/
stylelink: /pagefind/pagefind-ui.css
---

# {{ title }}

{# Let's put the pagefind search stuff here for now #}

<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ element: "#search", showSubResults: true, showImages: false });
    });
</script>
