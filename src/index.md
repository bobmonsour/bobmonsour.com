---
layout: default
title: Bob Monsour's Personal Site
description: The personal website of Bob Monsour, a retired tech developer and executive. Enjoying learning more HTML/CSS/JS and eleventy.
keywords: retired, web development, eleventy, tennis
permalink: /
---

{% from "macros.njk" import postFull %}

<div class="container">
  {% set latest_posts = collections.post | reverse %}
  {%- for post in latest_posts.slice(0,3) -%}
    {{ postFull(post) }}
  {%- endfor -%}
</div>
