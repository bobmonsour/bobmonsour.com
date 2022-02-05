---
layout: default
title: Archives of Bob Monsour's Personal Site
description: These are the archive posts of the personal website of Bob Monsour.
keywords: retired, web development, eleventy, tennis, archives
permalink: /archives/
---

{% from "macros.njk" import postExcerpt %}

<div class="container">
  {% set latest_posts = collections.post | reverse %}
  {%- for post in latest_posts -%}
    {{ postExcerpt(post) }}
  {%- endfor -%}
</div>
