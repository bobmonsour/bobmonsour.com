---
title: Test page to list items from an Airtable database
description: These are the archives of the personal website of Bob Monsour.
keywords: retired, web development, eleventy, tennis, archives
image:
  source: "bob.small.jpg"
  alt: "a picture of Bob's face"
permalink: /items/
---

{% for item in bundleitems %}
{% if item.Type === "0 - release" %}

  <p>Issue #{{ item.Issue }}, {{ item.Type }}, <a href="{{ item.Link }}">{{ item.Title }}</a>, {{ item.Date }}</p>
{% elseif item.Type === "1 - blog post" %}
  <p>Issue #{{ item.Issue }}, {{ item.Type }}, <a href="{{ item.Link }}">{{ item.Title }}</a> by {{ item.Author }}, {{ item.Date }}</p>
{% elseif item.Type === "2 - site" %}
  <p>Issue #{{ item.Issue }}, {{ item.Type }}, <a href="{{ item.Link }}">{{ item.Title }}</a></p>
{% endif %}
{% endfor %}
