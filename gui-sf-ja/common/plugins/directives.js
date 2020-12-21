import Vue from 'vue'
import 'jquery.dotdotdot'

let applyDots = (el, binding) => {
  let e = $(el),
    lineHeight = parseInt(e.css('line-height'), 10),
    margin =
      parseInt(e.css('margin-top'), 10) + parseInt(e.css('margin-bottom'), 10),
    padding =
      parseInt(e.css('padding-top'), 10) +
      parseInt(e.css('padding-bottom'), 10),
    dot,
    title

  dot = e
    .dotdotdot({
      height: lineHeight * (binding.value || 1) + margin + padding + 1,
      watch: true,
      truncate: 'letter',
    })
    .data('dotdotdot')

  title = e.attr('title') || e.parent().attr('title')

  if (
    title + dot.getInstance().opts.ellipsis.textContent === e.text() ||
    binding.value < 0
  ) {
    dot.restore()
  }
  e.css('word-break', 'break-all')
}
const WrapLines = {
  inserted(el, binding) {
    applyDots(el, binding)
  },
  update(el, binding) {
    if (el.attributes['wrap-update-disabled']) {
      return
    }
    applyDots(el, binding)
  },
}

Vue.directive('wrap-lines', WrapLines)
