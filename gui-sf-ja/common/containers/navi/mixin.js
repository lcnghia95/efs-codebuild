export default {
    computed: {
        isArticleDetailPage() {
            return /finance\/navi\/articles\/\d/g.test(this.$route.path)
        },
        isSeriesDetailPage() {
            return /finance\/navi\/series\/\d/g.test(this.$route.path)
        },
        isAuthorPage() {
            const auth =
                /finance\/navi\/authors\/$/g.test(this.$route.path) ||
                /finance\/navi\/authors$/g.test(this.$route.path) || 
                /finance\/navi\/authors\/st\/\d/g.test(this.$route.path)
            return auth
        },
        isSearchPage() {
            return /finance\/navi\/(series|articles)\/searchresult/g.test(this.$route.path)
        },
        isNaviTop() {
            return this.$route.path === '/finance/navi' || this.$route.path === '/finance/navi/'
        },
        isSeriesListPage() {
            return this.$route.path === '/finance/navi/series' || this.$route.path === '/finance/navi/series/'
        },
        isArticleListPage() {
            return this.$route.path === '/finance/navi/articles' || this.$route.path === '/finance/navi/articles/'
        },
        isPageDone() {
            return this.isArticleDetailPage || this.isSearchPage || this.isSeriesDetailPage || this.isNaviTop || this.isSeriesListPage || this.isAuthorPage || this.isArticleListPage
        }
    },
}