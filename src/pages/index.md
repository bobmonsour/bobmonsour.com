---
layout: plain.njk
title: Bob Monsour
description: The personal website of Bob Monsour. Enjoying building websites with 11ty.
keywords: retired, web development, eleventy, tennis
image:
  source: "about-bob.jpg"
  alt: "a picture of Bob from 2009"
permalink: /index.html
---

![Bob, circa 2009](/assets/img/about-bob.jpg){.about-img loading="eager" sizes="100px}

{% include 'intro.md' %}

There's a little more about me on the [About](/about/) page. And you can find me at one of the many "iconic" links in the footer.

<section class="homegrid">
	<div>
		<h3>From the <a href="/archive/">Blog...</a></h3>
		<ul>
			{%- set blogposts = collections.posts | reverse -%}
			{%- set last3posts = blogposts.slice(0,3) -%}
			{%- for post in last3posts -%}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a> &middot; <span class="blogdate">{{ post.date | formatPostDate }}</span>
				</li>
			{%- endfor -%}
		</ul>
	</div>
	<div>
		<h3>From the <a href="/notes/">Notes...</a></h3>
		<ul>
			{%- set notes = collections.notes | reverse -%}
			{%- set last3notes = notes.slice(0,3) -%}
			{%- for post in last3notes -%}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a> &middot; <span class="blogdate">{{ post.date | formatPostDate }}</span>
				</li>
			{%- endfor -%}
		</ul>
	</div>
	<div>
		<h3>Currently Reading</h3>
		{% set book = books.currentBook[0] %}
		{% include "bookitem.njk" %}
	</div>
</section>
