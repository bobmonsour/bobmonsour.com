---
layout: plain.njk
title: Bob Monsour
description: The personal website of Bob Monsour. Enjoying learning and deploying websites with 11ty and Netlify.
keywords: retired, web development, eleventy, tennis
image:
  source: "about-bob.jpg"
  alt: "a picture of Bob from 2009"
permalink: /index.html
---

![Bob, circa 2009](/assets/img/about-bob.jpg){.about-img loading="eager" sizes="100px}

{% include 'intro.md' %}

There's a little more about me on the [About](/about/) page. And you can find me at one of the many iconic links in the footer.

<section>
	<div>
		<h3><a href="/archive/">The Blog</a></h3>
		<ul>
			{%- set blogposts = collections.posts | reverse -%}
			{%- set last3posts = blogposts.slice(0,3) -%}
			{%- for post in last3posts -%}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a> &middot;<span class="blogdate">{{ post.date | formatPostDate }}</span>
				</li>
			{%- endfor -%}
		</ul>
	</div>
	<div>
		<h3><a href="/microblog/">The microBlog</a></h3>
		<ul>
			{%- set microblogposts = collections.microblog | reverse -%}
			{%- set last3microposts = microblogposts.slice(0,3) -%}
			{%- for post in last3microposts -%}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a> &middot;
					<span class="blogdate">{{ post.date | formatPostDate }}</span>
				</li>
			{%- endfor -%}
		</ul>
	</div>
</section>
