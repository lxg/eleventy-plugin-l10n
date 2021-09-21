# eleventy-plugin-l10n – a localisation plugin for Eleventy based on @lxg/l10n

This plugin allows translating HTML source files through Eleventy.

## Installation

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

Then add the following to your `.eleventy.js` file:

```js
const pluginL10n = require("eleventy-plugin-l10n")

module.exports = function(eleventyConfig) {
    // … other stuff …

    eleventyConfig.addPlugin(pluginL10n, {
        // langCallback tells the plugin how to determine the language from the path of a given file.
        // In this case, it is the first path segment.
        langCallback : path => path.split("/")[1]
    })
}
```

Important: the `langCallback` is a callback function which tells the plugin how to determine the language by the path of the page. In the given example, the language code is the first segment of the path. This will work nicely with the permalink from the example below.

## Adding translatable strings

Now you can start adding localised strings to your page or template files. For example, you could have a page file like the following:

```html
---
permalink: "de-DE/hello-world"
title: <l10n:t>Hello World</l10n:t>
---
<h1>
    <l10n:t>Hello, beautiful world!</l10n:t>
</h1>
```

## Creating language version files from a data source

Obviously, you don’t want to create all language version files manually, but instead use a data source which provides languages as an array, and then auto-generate those files:

```js
// This file should be stored as locales.js in your data folder. It will create an array of
// locale codes. en-GB is added as well, because this is usually not a translation target language.

module.exports = async () => {
    const { getConfig } = await import("@lxg/l10n/lib")
    return [ "en-GB", ...getConfig().locales ]
}
```

Your page file would then look as follows:

```html
---
title: <l10n:t>Hello World</l10n:t>
pagination:
    data: locales
    size: 1
    alias: locale
permalink: "{{ locale }}/hello-world"
---

<h1>
    <l10n:t>Hello World!</l10n:t>
</h1>
```

This will create all localised pages automatically from one source file.

## Extracting translations

After you have added translatable strings to your code, you can have them automatically extracted to `.po` files. This is a file format known from the Gettext tool, and it will allow your translators to edit one file per language/locale. If you have no experience with this kind of files, please look for a Gettext editor online.

To create/regenerate the `.po` files, run `npx l10n -ec` from the command line in the root folder of your project. After the files have been created/updated, you can edit them. The modifications to the `.po` files will be instantly visible in your code, even if you use Eleventy in *watch* mode.


## Translating in JavaScript

Let’s assume you also want to translate something in JavaScript, for example in the data source file. This can be done with the underlying @lxg/l10n library. For example:
