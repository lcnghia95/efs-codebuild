<script>
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    async asyncData({ store, redirect, error }) {
      const advertiseBanners =
        store.getters['getAdvertisements']['advertiseBanners']['0']

      if (
        !advertiseBanners ||
        !advertiseBanners.length ||
        !advertiseBanners[0].landingPageUrl
      ) {
        return error({ statusCode: 404 })
      }

      return redirect(301, advertiseBanners[0].landingPageUrl)
    },
  },
  title
)

export default obj
</script>
