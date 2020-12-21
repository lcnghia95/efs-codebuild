<template>
  <div>
    <RankingListTab :title="$t('1')" :tab-list="articleTabs" :data="articleRanking" />
    <RankingListTab :title="$t('6')" :type="1" :tab-list="seriesTabs" :data="seriesRanking" class="mt-30" />
    <social-links />
  </div>
</template>
<script>
import RankingListTab from './RankingListTab.vue'
import SocialLinks from '@/components/navi/SocialLinks.vue'
import i18n from '@@/lang/components-desktop/navi-right-ranking.json'
export default {
  components: { RankingListTab, SocialLinks },
  props: {
    articleRanking: Array,
    seriesRanking: Array,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      articleTabs: [
        { text: this.$t('2'), tab: '1day' },
        { text: this.$t('3'), tab: 'weekly' },
        { text: this.$t('4'), tab: 'monthly' },
        { text: this.$t('5'), tab: 'synthesis' },
      ],
      seriesTabs: [
        { text: this.$t('11'), tab: 'all' },
        { text: this.$t('7'), tab: 'fx' },
        { text: this.$t('8'), tab: 'stock' },
        { text: this.$t('9'), tab: 'bitcoin' },
      ],
    }
  },
}
</script>
