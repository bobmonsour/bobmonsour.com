---
title: Who knew that '/' does 'search in page' on Firefox?
description: Since I implemented pressing the '/' key to put focus in the search bard on on the 11ty Bundle site, I learned something.
date: 2025-05-18
tags:
  - 11ty
  - learned
rssid: aeae857d5e683a15dccc9ea7e1a610fc
---

> UPDATE: After several rounds of feedback and conversation, I've decided to keep the '/' key for placing focus in the search bar on the 11ty Bundle site. No need to comment on this question.

Since I implemented [pressing the '/' key to put focus in the search bar](/blog/a-keystroke-to-place-focus-in-the-search-box/) on on the [11ty Bundle](https://11tybundle.dev), I learned something about Firefox.

A visitor to the site wrote to me to note that on Firefox, the '/' key is a shortcut to open a 'search in page' dialog at the bottom of the page. My implementation of the '/' key to focus the search bar was interfering with that shortcut. Needless to say, the visitor was not thrilled with this.

I have written back and suggested two possible solutions:

1. I could change the key that is used for search, perhaps using the '\' key. However, in my research, I'm finding that the '\' key may require use of the shift key on some international keyboards. I'm also considering using the '?' as the key to trigger focus. That would also require a shift key, but it feels that a question mark would be a better semantic fit for the search function.

2. I could detect if the user is visiting the site with Firefox and use an alternate key. While possible, I'm not a fan of having two different keys depending on what browser the visitor is running.

If you have any thoughts on this, please let me know. I would love to hear your feedback. And who knows, perhaps there's an even better solution that I haven't thought of yet.
