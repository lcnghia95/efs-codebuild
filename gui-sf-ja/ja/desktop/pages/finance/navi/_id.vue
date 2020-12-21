<script>
export default {
  async asyncData({ params, redirect }) {
    return redirect(301, `/finance/navi/articles/${params.id}`)
  }
}
</script>
