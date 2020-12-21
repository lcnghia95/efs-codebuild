export default function() {
  // anchor link, scroll into element for reloading page
  process.browser && location.hash && this.$nextTick(() => {
    try {
      document.querySelector(location.hash).scrollIntoView()
    } catch(e) {}
  })
}