---
layout: plain.njk
title: Bob Monsour
description: My personal website. Enjoying building websites with 11ty.
keywords: retired, web development, eleventy, tennis
permalink: /index.html
---

![Bob, circa 2009](/assets/img/about-bob.jpg){.about-img loading="eager" sizes="100px}

{% include 'intro.md' %}

There's more on me on the [About](/about/) page. And you can find me at one of the many "iconic" links in the footer.

Lastly, you can search the entire site from the [Search](/search/) page.

<div class="hometags">
  <h3>Tags across <a href="/blog/">Blog</a>, <a href="/notes/">Notes</a>, and <a href="/til/">TIL</a>:</h3>
	{% include 'alltags.njk' %}
</div>

<article class="homegrid">
	<div>
		<h3>From the <a href="/blog/">Blog...</a></h3>
		<ul>
			{%- set blogposts = collections.posts | reverse -%}
			{%- set last3posts = blogposts.slice(0,3) -%}
			{%- for post in last3posts -%}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a>
					<p class="blogdate">{{ post.date | formatPostDate }}</p>
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
					<a href="{{ post.url }}">{{ post.data.title }}</a>
					<p class="blogdate">{{ post.date | formatPostDate }}</p>
				</li>
			{%- endfor -%}
		</ul>
	</div>
	<div>
		<h3>From the <a href="/til/">TIL...</a></h3>
		<ul>
			{%- set til = collections.til | reverse -%}
			{%- set last3tils = til.slice(0,3) -%}
			{%- for post in last3tils -%}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a>
					<p class="blogdate">{{ post.date | formatPostDate }}</p>
				</li>
			{%- endfor -%}
		</ul>
	</div>
	<div>
		<h3>Currently Reading <a href="/books/">(more books)</a></h3>
		<div class="bklist">
			{%- for book in books.currentBooks.slice(0,1) -%}
				{%- include "bookitem.njk" -%}
			{%- endfor -%}
		</div>
	</div>
<div>

</div>
</article>
