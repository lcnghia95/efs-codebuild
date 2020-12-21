<template>
  <div class="flex space-between w-1000" style="align-items: flex-start;">
    <div style="width: 65%;">
      <template v-if="list.data && list.data.length">
        <ListItem v-for="(item, index) in list.data"
                  class="mb-10"
                  :item="item"
                  :key="item.productId + 'ls121s'"
                  :rank="(list.currentPage - 1)*20 + index + 1"
        />
        <Paging class="text-center mt-20"
                :cur-page="list.currentPage"
                :total="list.lastPage"
                :from="list.pagingFrom"
                :to="list.pagingTo"
                theme-class="theme4"
                @pagingclick="handlePagingClick"
        />
      </template>
    </div>
    <div style="width: 300px;" class="right">
      <div v-for="(obj, index) in rightData" :key="index">
        <h4><strong v-html="obj.title"></strong></h4>
        <ReviewHorizontal01 :item="item" v-for="item in obj.list" :key="item.productId + index + 'it'" />
        <ShowMore01 class="mt-20" :target="obj.url" />
      </div>
      <SocialLinks class="mt-20" />
    </div>
  </div>
</template>

<script>
import ReviewHorizontal01 from '@/components/review/index/ReviewHorizontal01.vue'
import ShowMore01 from '@/components/common/ShowMore01.vue'
import ListItem from '@/components/review/list/ListItem.vue'
import Paging from '@@/../components/paging/Paging.vue'
import SocialLinks from '@/components/review/SocialLinks.vue'

export default {
  components: {
    ListItem,
    ReviewHorizontal01,
    Paging,
    ShowMore01,
    SocialLinks,
  },
  props: {
    list: {
      type: Object,
      default() {
        return {}
      },
    },
    rightData: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    handlePagingClick(p) {
      this.$emit('pagingClick', p)
    }
  },
}
</script>
<style lang='scss' scoped>
.right {
  .rv-hori-item /deep/ {
    width: 300px;
    .item-content {
      width: 220px;
    }
  }
}
/deep/.btn-loadmore:hover {
  opacity: 0.7;
}
</style>
<docs>
  ```vue
  <template>
    <ListA :list="list"
           :right-data="rightData"
           @pagingClick="pagingClick"
    />
  </template>
  <script>
  export default {
    data() {
      return {
        list: {
          "total": 135,
          "currentPage": 1,
          "lastPage": 7,
          "pagingFrom": 1,
          "pagingTo": 5,
          "data": [
            {
              "productId": 14352,
              "typeId": 1,
              "categoryId": 1,
              "review": {
                "stars": 1.6875,
                "count": 32
              },
              "productUrl": "/systemtrade/fx/14352",
              "reviewTitle": "運ゲーの領域で使えない",
              "reviewContent": "★１つ付与しないとレビューできないので★１つ付けました。月曜日の定時にエントリーし、あとは１週間のうち、上にいくか下にいくか、まさに運ゲーの領域です。これがたまたま当たればOK、そうでなければ大損。他のEAにロットを配分して安定運用した方がよいですね。",
              "userId": 159587,
              "publishedAt": 1573305429,
              "name": "Beatrice DELTA2",
              "nickName": "festa"
            },
          ]
        },
        rightData: [
          {
            "title": "電子書籍",
            "list": [
              {
                "productId": 21332,
                "typeId": 2,
                "review": {
                  "stars": 4.77027027027027,
                  "count": 74
                },
                "productUrl": "/tools/indicators/21332",
                "reviewTitle": "がっかり",
                "reviewContent": "指定の口座を開設したのに\n確認ができないとかで特典を拒否された\nその特典が欲しくて購入したのにもらえないなら\n購入した意味がない\nバカみたいだ\n二度とGogoJungleでの購入はしない‼️",
                "userId": 44532,
                "publishedAt": 1573967896
              }
            ],
            "url": "/review/highpost/tools/12"
          },
        ]
      }
    },
    methods: {
      pagingClick() {

      }
    }
  }
  </script>
  ```
</docs>