---
title: Pagination in a Javascript template with Eleventy
date: 2023-10-31
tags:
  - 11ty
description: Here I use a javascript template to generate json data files for selected categories of the 11tybundle.dev site.
keywords: Javascript template, eleventy, 11tybundle.dev
image:
  source: "pagination-in-a-javacsript-template-with-eleventy.jpg"
  alt: "A notebook of pages"
pageHasCode: true
---

## Table of Contents

<div class='toc'>

1. [Introduction](#section1)
2. [Pagination in a javascript template](#section2)

</div>

---

<section id='section1'></section>

## 1. Introduction

In [Issue 20](https://11tybundle.dev/blog/11ty-bundle-20/) of the 11ty Bundle blog, I wrote about Zach asking me to generate an API for the [new CMS page in the Eleventy docs](https://www.11ty.dev/docs/cms/). What he wanted was a json file that included the basic post information for all the [posts in that category](https://11tybundle.dev/categories/cms/).

While I was delighted to receive the request, here was my response:

> I’m definitely willing. Ability is another thing. If you could point me in the right direction on how to do this kind of thing, I’d love to. I’ll do some of my own research into it. Do you want the full firehose or the ability to choose by category?

Zach was kind enough to share [some code](https://github.com/11ty/11ty-website/blob/main/src/api/urls.11ty.js) of his that did a similar thing for the 11ty website...so I was off to the races.

<section id='section2'></section>

## 2. Pagination in a javascript template

Since Zach had only asked for a single category, my first cut at it was hard-coded. When I suggested a second category, I ended up duplicating the file and changing the category name. I knew that this was not the way to go.

The answer was to use 11ty's pagination feature where I could have a list of categories, each of which would result in the appropriate json file output. Then, when we wanted to add a category to the list, we would simply add it to the list and the next build would include it.

The biggest struggle I had, and this _might_ be an 11ty bug, was figuring out how to access the category inside of the render function. I tried using an [alias](https://www.11ty.dev/docs/pagination/#aliasing-to-a-different-variable), but I was unable to get that to work.

As of this writing, only the CMS category and the Getting Started categories have their posts included on the 11ty docs site, [here](https://www.11ty.dev/docs/cms/#from-the-community), and [here](https://www.11ty.dev/docs/get-started/), respectively. I've suggested to Zach that the remaining ones in the categories array seem like good candidates for inclusion.

_[UPDATE: 11-1-2023]: All of the listed categories are now included in their respective "From the Community" sections of their respective docs pages on the 11ty docs site._

Here's the javascript template that does the work, and a [link to the file in the GitHub repo](https://github.com/bobmonsour/11tybundle.dev/blob/main/src/api/category-json-files.11ty.js).

```js
// Create json files for the listed set of categories
// Files are created in the /api folder off the root of the site
// The file name is the category name in kebab case
const _ = require("lodash");
class CategoryJsonFiles {
  data() {
    return {
      pagination: {
        data: "categories",
        size: 1,
      },
      // These are the categories that generate json files in the api directory
      // For example, "CMS" in this list causes the file cms.json to be created
      categories: [
        "CMS",
        "Data Cascade",
        "Dates",
        "Deployment",
        "Filters",
        "Front Matter",
        "Getting Started",
        "Global Data",
        "Images",
        "Pagination",
        "WebC",
      ],
      // Construct the permalink for the json file of the category
      permalink: (data) => `/api/${_.kebabCase(data.pagination.items[0])}.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    // Filter the firehose posts for the paginated category
    // "Categories" is the key in the json file for the array
    // of categories for the post
    function isCategory(item) {
      return item["Categories"].includes(data.pagination.items[0]);
    }
    // The source data comes from the bundledata.js file that
    // returns the firehose, a json array of all the posts on
    // the site
    const sortedPosts = data.bundledata.firehose
      .filter(isCategory)
      .sort((a, b) => {
        return a.Date > b.Date ? -1 : 1;
      });
    // Return the json string of the posts in this category
    return JSON.stringify(sortedPosts, null, 2);
  }
}

module.exports = CategoryJsonFiles;
```

And here's a segment of what the json output looks like at [https://11tybundle.dev/api/cms.json](https://11tybundle.dev/api/cms.json). For reference, the Issue field in some of the posts simply refers to the issue where the blog post was first published on the [11ty Bundle blog](https://11tybundle.dev/blog/).

```json
[
  {
    "Issue": "19",
    "Type": "blog post",
    "Title": "TinaCMS + 11ty",
    "Link": "https://claytonerrington.com/blog/implementing-tinacms-with-11ty/",
    "Categories": [
      "Blogging",
      "CMS",
      "Configuration",
      "Deployment",
      "How to..."
    ],
    "Date": "2023-10-17",
    "Author": "Clayton Errington"
  },
  {
    "Issue": "19",
    "Type": "blog post",
    "Title": "CloudCannon as a git based headless CMS for static site generators",
    "Link": "https://rkblog.dev/posts/programming-general/cloudcannon-git-headless-cms/",
    "Categories": ["CMS", "How to..."],
    "Date": "2023-10-14",
    "Author": "Piotr Maliński"
  },
  {
    "Issue": "20",
    "Type": "blog post",
    "Title": "Headless kiosk application (with Kirby CMS)",
    "Link": "https://getkirby.com/docs/cookbook/setup/headless-kiosk-application",
    "Categories": ["CMS", "How to...", "Images"],
    "Date": "2023-10-01",
    "Author": "James Steel"
  },
  {
    "Issue": "16",
    "Type": "blog post",
    "Title": "From Zero to CMS in 2 Minutes with CloudCannon and Eleventy",
    "Link": "https://www.youtube.com/watch?v=yXcxvBJuULU",
    "Categories": ["CMS", "YouTube", "Deployment"],
    "Date": "2023-08-29",
    "Author": "CloudCannon"
  },
  {
    "Issue": "3",
    "Type": "blog post",
    "Title": "Working with CloudCannon and Eleventy - My Experience",
    "Link": "https://www.raymondcamden.com/2023/04/06/working-with-cloudcannon-and-eleventy-my-experience",
    "Categories": ["CMS"],
    "Date": "2023-04-06",
    "Author": "Raymond Camden"
  }
]
```
