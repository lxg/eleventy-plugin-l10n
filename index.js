const l10nHtml = require("@lxg/l10n/html")

module.exports = {
    initArguments: {},
    configFunction: (eleventyConfig, options = {}) => {
        options = Object.assign({
            translations: {},
            langCallback : () => "en",
            watchDir : "l10n"
        }, options)

        eleventyConfig.addTransform("l10n-translate", (content, path) => {
            const lang = options.langCallback(path)

            return (path.endsWith(".html")) ?
                l10nHtml(content, options.translations, lang) :
                content
        })

        options.watchDir && eleventyConfig.addWatchTarget(`${options.watchDir}/**/*.*`)
    }
}
