# eleventy-plugin-l10n – a localisation plugin for Eleventy based on @lxg/l10n

This plugin allows translating HTML source files through Eleventy.

## Setup

### Basic configuration

First, install the plugin with `npm i eleventy-plugin-l10n`.

Then, add the following entry to your `package.json` file:

```json
"l10n": {
    "locales": [
        "de-DE",
        "fr-FR"
    ],
    "sources": [
        "src/**/*.html"
    ]
}
```

- The `locales` field contains a list of locale codes, in either the `xx-YY` or the `xx` format, where `xx` is a language code and `YY` is a country code.
- The `sources` field contains a glob for all files that should be included for localisation string extraction. NOTE: At the moment, files are only included if their name ends in `.html`.

### Adding translatable strings

Now you can start adding localised strings to your page or template files. For example (the example assumes that the `main.njk.html` file has got some placeholder `block`s):

```html
<h1>
    <l10n:t>Hello World</l10n:t>
</h1>
```

It is recommended to use this with a data file which returns a list of locales, and then use the locales in the URL path (we will later see why).

### Activating the translations

Add the following to your `.eleventy.js` file:

```js
const pluginL10n = require("eleventy-plugin-l10n")
const translations = require("./l10n/translations.json")

module.exports = function(eleventyConfig) {
    // … other stuff …

    eleventyConfig.addPlugin(pluginL10n, {
        translations,
        langCallback : path => path.split("/")[1]
    })
}
```

- the `langCallback` is a callback function which tells the plugin how to determine the language by the path of the page. In the given example, the language code is the first segment of the path.
