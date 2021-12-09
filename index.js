const l10nHtml = require("@lxg/l10n/html")

module.exports = {
    initArguments: {},
    configFunction: (eleventyConfig, options = {}) => {
        options = Object.assign({
            langCallback : () => "en",
            watch : true,
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
        })

        eleventyConfig.addTransform("l10n-translate", function(content, path) {
            const lang = options.langCallback(this, path, content) || "en"

            return this.templateData.config.templateFormats.some(ext => path.endsWith(`.${ext}`))
                ? l10nHtml(content, translations, lang)
                : content
        })

        options.watch &&
            eleventyConfig.addWatchTarget(`${options.watchDir}/**/*.po`)
    }
}
