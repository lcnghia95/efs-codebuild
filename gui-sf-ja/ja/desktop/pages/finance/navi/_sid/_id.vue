<template>
  <div></div>
</template>
<script>
export default {
  asyncData({redirect, params}) {
    return redirect(301, `/finance/navi/articles/${params.id}`)
  }
}
</script>
