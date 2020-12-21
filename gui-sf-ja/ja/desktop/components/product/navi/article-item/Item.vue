<template>
  <div class="o-item">
    <img class="o-item__img" :src="`/img/articles/${data.id}`" />
    <div class="o-item__info">
      <a :href="`/finance/navi/articles/${data.id}`" :title="data.title" class="o-item__tit" v-wrap-lines="2">
        {{ data.title }}
      </a>
      <div class="o-item__cont-w">
        <div class="o-item__cont">
          <span class="o-item__cont-free" v-if="!data.isPaidContent">{{ $t('labels')['0'] }}</span>
          <span class="o-item__cont-no-free" v-else>{{ $t('labels')['1'] }}</span>
          <span>{{ formatTime(data.publishedDate, 1) }}</span>
        </div>
        <a :href="'/users/' + (data.user || {}).id" class="o-item__name-w wrap-text">
          <Edit class="o-item__icon" />
          <span class="wrap-text o-item__name">{{ (data.user || {}).name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import Edit from '@@/../components/icons/Edit.vue'
import i18n from '@@/lang/desktop/navi-detail.json'
/**
 * The Article Item.
 */
export default {
  i18n: {
    messages: i18n,
  },
  props: ['data'],
  components: {
    Edit,
  },
}
</script>
<docs>
  ```vue
  <template>
    <div>
      <article-item :data="item"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "id": 4136,
          "title": "4875【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
          "publishedDate": 1536973965,
          "user": {
              "id": 337083,
              "name": "4670FX攻略.com"
          },
          "isCampaign": 0,
          "isPaidContent": 0
        }
      }
    },
  }
  </script>
  ```
</docs>
