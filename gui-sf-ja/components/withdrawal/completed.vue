<template>
  <div class="mt-20 p-40 border-all content-success w-1000" >
    <div class="withdrawal-success m-ltr-40">
      {{ $t('1') }}
    </div>
    <div class="thank-using m-ltr-40">
      {{ $t('2') }}
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components/withdrawal-completed.json'
import title from '@@/../common/pages'

const obj = Object.assign(
  {
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('Title'),
      }
    },
    async asyncData({ app, req, redirect, store }) {
      let referer = req.headers.referer || ''
      if (!referer.includes('/mypage/withdrawal')) {
        return redirect('/')
      }
      if (['en', 'th', 'vi'].includes(app.i18n.locale)) {
        store.commit('pushBC', {
          name: 'Top',
          path: '/en',
        })
      }
      return {}
    }
  },
  title,
)
export default obj
</script>

<style lang="scss" scoped>
  .content-success {
    border-bottom: 1px #b4b5b6 solid;
    background: #f5f5f5;
    color: #666;
    height: 270px;
    margin-bottom: 180px;
  }
  .withdrawal-success {
    font-size: 26px;
  }
  .thank-using {
    font-size: 16px;
    color: #b4b5b6;
  }
</style>