import i18n from "@@/lang/desktop/navi-detail.json"
import titleI18n from "@@/lang/common/navi-title.json"
import title from "@@/../common/pages"
import authorMeta from "@@/../common/pages/author"
import { checkNested, convertToFxonHost, editCss } from "@/utils/client/common"
import { setStoreData } from "@@/../common/js/finance/utils"
import { trackingNaviArticleView } from "@@/../common/js/ga/ecom-enhance"
import generateLDJson from "@@/../common/js/generateLDJson"
import ArticleDetailPage from "@@/../common/pages/navi/article/article-detail-page.vue"

function getData(store, params, data, prefix) {
  store.commit("cart/setInfo", {
    info: data.cartInfo,
    productStatus: data.status,
    isPassword: data.isPassword
  })
  store.commit("pushBC", {
    name: data.title,
    target: { name: "finance-navi-index-articles-id", params: params }
  })

  data.outline = convertToFxonHost(data.outline)
  if (data.outline && data.outline.indexOf('<style type="text/css">') !== -1) {
    data.outline = editCss(data.outline, ".outline-IbBKtrbLMt")
  }

  let titleChunk = data.title
      ? `${data.title} ${
          data.productName ? "- " + data.productName : ""
        } - ${prefix}`
      : prefix,
    keywordsChunk = data.title,
    imgUrl =
      process.env.GOGO_URL +
      "/img/products/" +
      (data.productId || data.seriesProductId)

  if (data.user) {
    data.user.selfIntroduction = (data.user.selfIntroduction || "").replace(
      /<(.|\n)*?>/g,
      ""
    )
  }
  data.freeContent &&
    (data.freeContent = data.freeContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"))
  data.paidContent &&
    (data.paidContent = data.paidContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"))
  let descriptionMeta = (data.paidContent || data.freeContent || "")
    .substr(0, 300)
    .replace(/<(.|\n)*?>/g, "")

  return {
    titleChunk,
    keywordsChunk,
    imgUrl,
    descriptionMeta
  }
}

const obj = Object.assign(
  {
    i18n: {
      messages: i18n
    },
    components: {
      ArticleDetailPage,
    },
    computed: {
      isPassword() {
        return this.$store.getters["cart/isPassword"]
      },
      checkShowPass() {
        let stt = this.$store.state.cart.productStatus
        return this.isPassword === 1 && (!stt || stt === -1)
      },
      intro() {
        return this.data.user.selfIntroduction.replace("<br>", "")
      },
      showPayment() {
        let cartInfo = this.data.cartInfo
        return cartInfo.article.price || cartInfo.serie.price
      }
    },
    validate({ params }) {
      return !isNaN(+params.id)
      // return !isNaN(filterInt(params.sid)) && !isNaN(filterInt(params.id))
    },
    watch: {
      frCo() {
        this.buildTxt = `<iframe src="${
          process.env.FXON_BLOG_URL
        }/parts/navi_article_parts.php?sid=${this.data.seriesId}&aid=${
          this.$route.params.id
        }&fr=${this.frCo.substr(1, 7)}&fo=${this.foCo.substr(
          1,
          7
        )}" style="border: none; overflow: hidden" width="300px" height="251px"></iframe>`
      },
      foCo() {
        this.buildTxt = `<iframe src="${
          process.env.FXON_BLOG_URL
        }/parts/navi_article_parts.php?sid=${this.data.seriesId}&aid=${
          this.$route.params.id
        }&fr=${this.frCo.substr(1, 7)}&fo=${this.foCo.substr(
          1,
          7
        )}" style="border: none; overflow: hidden" width="300px" height="251px"></iframe>`
      }
    },
    async asyncData({ app, params, error, store, req }) {
      let locale = app.i18n.locale,
        prefix = titleI18n[locale].prefix,
        title = titleI18n[locale].title,
        currentUrl = process.env.GOGO_URL + req.originalUrl

      const data = await app.GoGoHTTP.get(`/api/v3/surface/navi/${params.id}`)
      if (!data || !Object.keys(data).length) {
        return error({ statusCode: 404 })
      }

      store.commit('finance/setSelectedArticle', data)
      let { titleChunk, keywordsChunk, imgUrl, descriptionMeta } = getData(
        store,
        params,
        data,
        prefix
      )
      const {
        cartInfo: { serie: { price } = {} } = {},
        review: { count, stars } = {},
        isPassword
      } = data

      return {
        data,
        prefix,
        titleChunk,
        descriptionMeta,
        keywordsChunk,
        localeHead: titleI18n[locale] || titleI18n["ja"],
        meta: [
          {
            name: "og:site_name",
            content: "GogoJungle",
            hid: "og:site_name"
          },
          {
            name: "og:type",
            content: "website",
            hid: "og:type"
          },
          {
            name: "og:title",
            content: `${titleChunk} - ${title}`,
            hid: "og:title"
          },
          {
            name: "og:description",
            content: descriptionMeta,
            hid: "og:description"
          },
          {
            name: "og:url",
            content: currentUrl,
            hid: "og:url"
          },
          {
            name: "og:image",
            content: imgUrl,
            hid: "og:image"
          },
          authorMeta
        ],
        linkMeta: [
          {
            rel: "canonical",
            href: `https://www.gogojungle.co.jp/finance/navi/articles/${params.id}`
          }
        ],
        jsonLDTemplate: generateLDJson({
          title: data.productName,
          id: params.id,
          description: descriptionMeta || data.productName,
          url: currentUrl,
          image_link: imgUrl,
          product_type: 3,
          status: isPassword ? 3 : 1,
          price,
          count,
          rate: stars
        })
      }
    },
    data() {
      return {
        sameSeries: [],
        seriesRank: [],
        articleRank: [],
        relatedArticles: [],
        communities: {},
        isShowModal: false,
        frCo: "#52b800",
        foCo: "#e4e4e4",
        buildTxt: "",
        alsoBought: []
      }
    },
    mounted() {
      if (!this.checkShowPass) {
        this.onGetSubData()

        if (!this.$store.getters["finance/naviCategories"].length)
          this.GoGoHTTP.get(`/api/v3/surface/navi/category`).then(response =>
              this.$store.commit("finance/setNaviCategory", response)
          )
      }
      window.productId = this.data.cartInfo.serie.productId
      trackingNaviArticleView(this.data)

      const html = document.querySelector('html'), body = document.querySelector('body')
      if (html) html.setAttribute('style', 'width: 100% !important; overflow: hidden;')
      if (body) body.setAttribute('style', 'width: 100% !important; overflow-y: auto')
    },
    beforeDestroy() {
      const html = document.querySelector('html'), body = document.querySelector('body')
      if (html) html.removeAttribute('style')
      if (body) body.removeAttribute('style')
    },
    methods: {
      checkNested,
      setStoreData,
      onGetSubData() {
        this.onGetAlsoBoughtProduct()
        // this.onGetDataSameSeries();
        this.onGetDataSeriesRanking()
        this.onGetDataArticleRanking()
        // this.onGetDataRelatedArticles();
        if (!$("script[id=sc-twitter-widget]").length) {
          let el = document.createElement("script")
          el.setAttribute("id", "sc-twitter-widget")
          el.setAttribute("src", "https://platform.twitter.com/widgets.js")
          document.getElementsByTagName("head")[0].appendChild(el)
        }
      },
      onGetDataSameSeries() {
        this.GoGoHTTP.get(`/api/v3/surface/navi/${this.data.id}/sameSeriesEx`, {
          params: {
            limit: 4,
            seriesId: this.data.seriesId
          }
        }).then(data => {
          this.sameSeries = data
          this.setStoreData(data)
        })
      },
      onGetAlsoBoughtProduct() {
        this.GoGoHTTP.get(
          `/api/v3/surface/navi/${this.data.productId}/${this.data.seriesProductId}/also-bought`
        )
          .then(data => {
            this.alsoBought = data
          })
          .catch(() => {
            this.alsoBought = []
          })
      },
      onGetDataRelatedArticles() {
        this.GoGoHTTP.get(
          `/api/v3/surface/navi/${this.data.id}/relatedArticle`,
          {
            params: {
              limit: 4
            }
          }
        ).then(data => {
          this.relatedArticles = data
          this.setStoreData(data)
        })
      },
      onGetDataSeriesRanking() {
        this.GoGoHTTP.get(
          `/api/v3/surface/navi/rank/series?isCombineCategories=1&limit=10`
        ).then(data => {
          this.seriesRank = data
        })
      },
      onGetDataArticleRanking() {
        this.GoGoHTTP.get(`/api/v3/surface/navi/rank/article?limit=10`).then(
          data => {
            this.articleRank = data
          }
        )
      },
      // head fucntions:
      descriptionTemplate() {
        return this.descriptionMeta
      },
      keywordsTemplate() {
        return `${this.localeHead.keywords},${this.keywordsChunk}`
      },
      getArticlePassword(password) {
        return this.GoGoHTTP.post(
          `/api/v3/surface/navi/${this.$nuxt._route.params.id}`,
          {
            pagePassword: password
          }
        ).then(data => {
          if (Object.keys(data).length === 0) {
            data = {}
          }
          if (this.isPassword === 2) {
            this.$store.commit("cart/productStatus", data.status)
          }
          if (this.isPassword === 1 && data.status == 0) {
            this.$store.commit("cart/productStatus", 0)
            this.isError = true
            this.password = null
          }
          if (this.isPassword === 1 && data.status == 1) {
            let {
              titleChunk,
              keywordsChunk,
              imgUrl,
              descriptionMeta
            } = getData(
              this.$store,
              this.$nuxt._route.params,
              data,
              this.prefix
            )

            this.data = data
            this.titleChunk = titleChunk
            this.keywordsChunk = keywordsChunk
            this.imgUrl = imgUrl
            this.descriptionMeta = descriptionMeta
            this.$store.commit("cart/productStatus", 1)
            this.onGetSubData()
          }
        })
      }
    }
  },
  title
)
export default obj
