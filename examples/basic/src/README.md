---
md-files: support yaml frontmatter!
---
# Minimal siteup example

This example demonstrates a example of a minimal website, no customization.

It's just a `src` folder with a few markdown files that link to each other. Markdown files can link directly to their markdown counterparts so navigation works inside GitHub's built in markdown source navigator.

- [loose-file.md](./loose-file.md)
- [nested-md](./md-page/README.md)
- [sub-page](./md-page/sub-page/README.md)

Also notice how the title of this document set the `title` variable for the page, and renders in the title `<head>` properly.
Page builders can implement variable extraction based on assumptions like this for a given document type.
More automatic variable extraction is planned, like `git` metadata (first commit date, last commit date that touched the file. etc).
