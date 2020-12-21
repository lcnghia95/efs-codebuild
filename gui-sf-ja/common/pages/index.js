import titleI18n from '@@/lang/common/title.json'

const langAttrs = {
  vi: 'vi',
  ja: 'ja',
  en: 'en',
  th: 'th',
  ch: 'ja',
  tw: 'ja',
}

export default Object.freeze({
  head() {
    let locale = this.$i18n.locale,
      titleI18nL = titleI18n[locale] || titleI18n['ja'],
      title = titleI18nL.title,
      description = titleI18nL.description,
      keywords = titleI18nL.keywords,
      descriptionFn = this.descriptionTemplate,
      keywordsFn = this.keywordsTemplate,
      meta = (this.meta || []).concat([
        {
          name: 'description',
          content: descriptionFn
            ? descriptionFn.call(this)
            : this.descriptionChunk
              ? `『${this.descriptionChunk}』 ${description}`
              : description,
          hid: 'description',
        },
        {
          name: 'keywords',
          content: keywordsFn
            ? keywordsFn.call(this)
            : this.keywordsChunk
              ? `${this.keywordsChunk}：${keywords}`
              : keywords,
          hid: 'keywords',
        },
      ]),
      link = this.linkMeta || [],
      fn = this.titleTemplate,
      htmlAttrs = {
        lang: langAttrs[locale] || 'ja',
      },
      jsonLD = this.jsonLDTemplate
    return {
      titleTemplate: titleChunk => {
        if (fn) {
          return fn.call(this, titleI18nL)
        }
        return titleChunk ? `${titleChunk} - ${title}` : `${title}`
      },
      titleChunk: this.titleChunk || null,
      meta,
      link,
      htmlAttrs,
      script: [...(this.script || []), jsonLD ? {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLD),
        charset: 'utf-8'
      } : {} ],
      __dangerouslyDisableSanitizers: jsonLD ? ['script'] : undefined,
    }
  },
})
