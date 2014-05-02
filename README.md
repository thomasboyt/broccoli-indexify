Moves `pages/foo/bar.html` to `pages/foo/bar/index.html` for prettier routes when served.

### Usage

```js
var pages = pickFiles('pages/', {
  srcDir: '/',
  files: ['**/*.html'],
  destDir: '/'
});

pages = indexifyFilter(pages);

module.exports = pages;
```
