const deepmerge = require("deepmerge")
const fs = require('fs')
const l10nHtml = require("@lxg/l10n/html")

module.exports = {
    initArguments: {},
    configFunction: (eleventyConfig, options = {}) => {
        options = Object.assign({
            // a callback that determines the language of a particular page
            langCallback : () => "en",

            // pass extra translation.json files
            extra : [],

            // do watch for changes in translations
            watch : true,

            // directory to watch; default directory of @lxg/l10n
            watchDir : "l10n"
        }, options)

        // We have a bit of async stuff here. First, because we need to import an ES module
        // as CommonJS, and this only works with dynamic imports. Then, the compileTranslations
        // is also async.
        // As those operations are quite expensive, we only execute them once before the build process,
        // and then they are available during the transform.

        let translations = {}

        eleventyConfig.on('beforeBuild', async () => {
            const l10nLib = await import("@lxg/l10n/lib")
            config = l10nLib.getConfig()
            const catalogs = l10nLib.getCatalogs(config.directory, config.locales)
            translations = await l10nLib.compileTranslations(catalogs)

            if (options.extra.length) {
                options.extra.forEach(file => {
                    const trans = JSON.parse(fs.readFileSync(file).toString())
                    translations = deepmerge(translations, trans)
                })
            }
        })

        eleventyConfig.addTransform("l10n-translate", function(content, path) {
            if (typeof content === "string") {
                const lang = options.langCallback(this, path, content) || "en"
                return l10nHtml(content, translations, lang)
            } else {
                return content
            }
        })

        options.watch &&
            eleventyConfig.addWatchTarget(`${options.watchDir}/**/*.po`)
    }
}
