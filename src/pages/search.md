---
title: Search
description: Search
keywords: search
image:
  source: "about-bob.jpg"
  alt: "a picture of Bob from 2009"
permalink: /search/
pagestyle: search
---

# {{ title }}

<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
		window.addEventListener('DOMContentLoaded', (event) => {
				new PagefindUI({ element: "#search", showImages: false, sort: { date: "desc" } });
		});
</script>
