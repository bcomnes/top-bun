# Secondary README

If there is a `page.js` or `page.html` in a folder, alongside a `README.md`, the `README.md` will still be rendered, but as a loose page. e.g.

```
${dirname}/README/index.html
```

This still lets you write a README that displays in GitHub inside a `js` or `html` page folder.

If there is no `page.js` or `page.html` in the folder, the `README.md` is used as the primary page source.

