<script>
import { filterInt } from '@/utils/client/common'

const obj = Object.assign({
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  async asyncData({ params, redirect }) {
    return redirect(301, `/finance/navi/articles/${params.id}`)
  },
})
export default obj
</script>
