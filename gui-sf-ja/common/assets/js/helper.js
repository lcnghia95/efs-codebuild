export function urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + "</a>";
    });
}

/**
 * Get translated messages from parent. Support getting messages from 2 parent levels
 * @param key
 * @returns {string}
 */
export function t(key) {
    // back to level 1
    let messages =  this.$parent.$i18n.messages
    // back to level 2
    if (!messages.ja) messages = this.$parent.$parent.$i18n.messages
    const localeMessages = messages[this.$i18n.locale || 'ja'] || {}
    return localeMessages[key] || key
}