import Loading from '@@/../components/icons/Loading.vue'

export default function({ componentFactory, loading = Loading }) {
  if (!process.browser) {
    return
  }
  let resolveComponent
  return () => ({
    component: new Promise(resolve => {
      resolveComponent = resolve
    }),
    loading: {
      mounted() {
        componentFactory.call(this).then(resolveComponent)
      },
      render(createElement) {
        return createElement(loading)
      },
    },
  })
}
