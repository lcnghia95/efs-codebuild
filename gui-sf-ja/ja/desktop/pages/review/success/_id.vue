<template>
  <div class="w-1000">
    <div class="title">{{ $t('5') }}</div>
    <div class="flex layout-col mid success-content mt-10">
      <div class="flex mid">
        <Check class="icon-check" />
        <span class="content">{{ $t('18') }}</span>
      </div>
      <a :href="detailUrl" class="detail-url">
        {{ $t('19') }}
      </a>
    </div>
  </div>
</template>

<script>
import title from '@@/../common/pages'
import i18n from '@@/lang/desktop/review-input-new.json'
import Check from '@@/../components/icons/Check.vue'

const obj = Object.assign({
  components: {
    Check,
  },
  i18n: {
    messages: i18n,
  },
  computed: {
    titleChunk() {
      return this.$t('3', {name: this.myReview.productName})
    }
  },
  async asyncData({ app, params, store, req, redirect, error }) {
    let referer = req.headers.referer || ''
    if (!referer.includes(`/review/input/${params.id}`)) {
      return redirect(`/review/input/${params.id}`)
    }
    let myReview = await app.GoGoHTTP.get(`/api/v3/surface/review/myreview/${params.id}`)
    if (!myReview || !Object.keys(myReview).length) {
      return error({ statusCode: 404 })
    }
    store.commit('pushBC', {
      name: i18n[app.i18n.locale][5],
      target: { path: `/review/success/${params.id}` },
    })
    return {
      myReview,
      detailUrl: `/review/detail/${params.id}`,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/review/success/${params.id}`,
        },
      ],
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('4', {name: this.myReview.productName})
    },
  }
}, title)

export default obj
</script>

<style lang="scss" scoped>
.title {
  color: #2d2d2d;
  font-size: 22px;
}
.success-content {
  padding: 100px 250px;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  text-align: center;
  margin-bottom: 150px;
  .icon-check {
    color: #a0a0a0;
    width: 36px;
    height: 40px;
  }
  .content {
    color: #a0a0a0;
    font-size: 24px;
  }
  .detail-url {
    display: inline-block;
    border: 1px solid #2d2d2d;
    border-radius: 18px;
    padding: 10px 30px;
    font-size: 13px;
    color: #2d2d2d;
    text-decoration: none;
    margin-top: 20px;
  }
}
</style>
<style lang='scss'>
body {
  background: #f7faf9;
}
#menu {
  background: #fff;
}
#header-01 {
  background: #fff;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>