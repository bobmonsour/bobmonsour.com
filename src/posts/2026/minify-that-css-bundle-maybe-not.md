---
title: Minify those CSS & JS bundles? Maybe not.
description: I saved a ton on site build time by not minifying CSS & JS...YMMV.
date: 2026-01-26
tags:
  - 11ty
  - CSS
pageHasCode: true
image:
  source: minify-css-bundle.jpg
  alt: Code for minifying a CSS bundle
rssid: 926d2baa35df4f46ad58527ab02841c8
---

[[toc]]

## Introduction

When building static sites with 11ty, it can be tempting to minify CSS and Javascript files to reduce their size and improve load times. However, I recently discovered that skipping the minification step can significantly speed up the build process without a noticeable impact on site load times...at least for my specific use case. Your mileage may vary.

TL;DR: In this case, not minifying the CSS and JS bundles reduced build time from over 6 minutes to about 30 seconds.

## My case: the 11ty Bundle redesign

As some of you know, I recently worked with [Damian Walsh](https://damianwalsh.co.uk/) on the redesign of the [11ty Bundle website](https://11tybundle.dev). The CSS for the site is spread across multiple files which are then bundled during the build process using [Eleventy's built in bundling plugin](https://www.11ty.dev/docs/plugins/bundle/). It's a very handy feature and allows you to spread CSS throughout a project without worrying about manually concatenating files or style declarations.

In our case, there are 14 CSS files, each in one of two categories: global styles that are used on every page, and a set of styles used only on selected pages. A front matter variable is set on the "selected" pages to indicate that the "selected" CSS file should be loaded in the page's base layout.

I only describe the details of the CSS bundling here, but the same principles apply to JavaScript files as well.

## Configuring the CSS bundles

The way we went about configuring the CSS bundles was to incorporate the bundling process into the base layout file that is used for every page. Here is the relevant code snippet from the layout file that sets up the two CSS bundles.

```jinja2
  {% raw %}{# bundle the global css files #}{% endraw %}
  {% raw %}{% css "global" %}{% endraw %}
    {% raw %}{% include "public/css/fonts.css" %}{% endraw %}
    {% raw %}{% include "public/css/variables.css" %}{% endraw %}
    {% raw %}{% include "public/css/reset.css" %}{% endraw %}
    {% raw %}{% include "public/css/home.css" %}{% endraw %}
    {% raw %}{% include "public/css/global.css" %}{% endraw %}
    {% raw %}{% include "public/css/site-header.css" %}{% endraw %}
    {% raw %}{% include "public/css/site-footer.css" %}{% endraw %}
    {% raw %}{% include "public/css/pagefind.css" %}{% endraw %}
  {% raw %}{% endcss %}{% endraw %}

  {% raw %}{# load the global css file for all pages #}{% endraw %}
  <link rel="stylesheet" href="{% raw %}{% getBundleFileUrl 'css', 'global' %}{% endraw %}">

  {% raw %}{# bundle the channel-related css files #}{% endraw %}
  {% raw %}{% css "channel" %}{% endraw %}
    {% raw %}{% include "public/css/channels.css" %}{% endraw %}
    {% raw %}{% include "public/css/showcase.css" %}{% endraw %}
    {% raw %}{% include "public/css/blog.css" %}{% endraw %}
    {% raw %}{% include "public/css/prism-okaidia.css" %}{% endraw %}
    {% raw %}{% include "public/css/lite-yt-embed.css" %}{% endraw %}
    {% raw %}{% include "public/css/404.css" %}{% endraw %}
  {% raw %}{% endcss %}{% endraw %}

  {% raw %}{# conditionally load the channel-related css file #}{% endraw %}
  {% raw %}{% if channelsPage %}{% endraw %}
    <link rel="stylesheet" href="{% raw %}{% getBundleFileUrl 'css', 'channel' %}{% endraw %}">
  {% raw %}{%endif %}{% endraw %}
```

Note that this is very straightforward. Note also that we do not have CSS files or styles scattered throughout the project, though that is among the more powerful features of the Eleventy bundle plugin.

## Minification step

One of the other capabilities of the Eleventy bundle plugin is the ability to "transform" the bundled output. This is where you can add minification or other post-processing steps to the bundled CSS or JavaScript files.

In the eleventy.config.js file for the project, we had the following code to minify the CSS bundles using postcss and cssnano.

```js
//adds the {% raw %}{% css %}{% endraw %} paired shortcode
eleventyConfig.addBundle("css", {
  transforms: [
    async function (content) {
      let { type, page } = this;
      let result = await postcss([cssnanoPlugin]).process(content, {
        from: page.inputPath,
        to: null,
      });
      return result.css;
    },
  ],
  toFileDirectory: "dist",
});
```

While this works, I want to point out that the site comprises over 2,000 pages. So, for every page that is built, the two CSS bundles are being minified. This adds a significant amount of time to the overall build process.

Since adding the [Showcase feature of the 11ty Bundle](https://11tybundle.dev/showcase/), I had come to the mistaken belief that it was the addition of the additional 1,400 pages added to the site was the cause of the increase in build time that I was seeing. The build time had increased from around 30 seconds to over 6 minutes.

## CSS & Javascript size considerations

Much has been written about the benefits of minifying CSS & JS files to reduce their size and improve load times. However, in this case, the total size of the CSS bundles is relatively small. The global CSS bundle is around 43KB unminified, and the channel CSS bundle is around 19KB. The size reduction does not justify the additional build time. I'd add that most modern browsers and CDNs can handle unminified CSS files quite efficiently through their use of gzip or brotli compression.

In the case of the Javascript files for the project, there are 10 files for a total of about 172KB unminified.

Other than the Showcase page of the site, there are very few images to add weight to each page. And with browsers caching CSS and Javascript files, the impact on load times for visitors viewing multiple pages is minimal.

## Test results

Here are the build times for minifying and not minifying the CSS and Javascript bundles.

- Minify both: **441 seconds** (7 minutes 21 seconds)
- Minify JS only: **342 seconds** (5 minutes 42 seconds)
- Minify CSS only: **123 seconds** (2 minutes 3 seconds)
- Minify neither: **32 seconds**

Note that the CSS minifying is accomplished using postcss and cssnano, while the Javascript minifying is done using terser.

## Conclusion

By removing the minification step from the CSS bundle and Javascript configuration, the build time was reduced from over 7 minutes to around 30 seconds. This is a significant improvement and has made the development process much more efficient.

Finally, all of this is project dependent. This is what has worked for me in this particular case. Your mileage may vary.
