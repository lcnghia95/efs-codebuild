<template>
  <div></div>
</template>
<script>
import { filterInt } from "@/utils/client/common"
export default {
  validate({ params }) {
    return !isNaN(filterInt(params.id))
  },
  async asyncData({ params, redirect }) {
    return redirect(301, `/finance/navi/articles/${params.id}`)
  }
}
</script>

<style lang="scss" scoped></style>
