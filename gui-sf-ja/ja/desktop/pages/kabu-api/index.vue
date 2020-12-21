<template>
  <section class="w-1000 mb-200">
    <div class="mt-20 mb-10">
      <div class="flex flex-wrap content-howto">
        <a v-for="item in relatedArticles" :href="item.detailUrl" :key="'related-articles-' + item.id">
          <ImgWrapper class="articles-img" :src="`/img/articles/${item.id}/small`" :alt="'banner ' + item.id" />
          <div class="mt-10 item-title-howto">{{ item.title }}</div>
        </a>
      </div>
    </div>
    <section class="clearfix pt-10">
      <div class="content-title">
        <span class="english">{{ $t('1') }}</span>
        <span class="japanese">{{ $t('2') }}</span>
      </div>
      <div class="flex space-between">
        <div class="left-content">
          <div class="flex flex-wrap large-item">
            <PlatformVertical
              v-for="item in (top3 || [])"
              :data="item"
              :is-large="true"
              :key="'platform_tools-' + item.id"
            />
          </div>
          <div class="flex flex-wrap">
            <PlatformVertical
              v-for="item in (platformData || [])"
              :data="item"
              :key="'platform_tools-' + item.id"
            />
          </div>
          <ShowMore02 class="mt-20" :on-show-more="onPlatformShowMore" v-if="(platformData || []).length < (topData.platform_tools || []).length - 3" />
        </div>
        <div class="right-content pt-20 pb-20">
          <TopContent
            :data="{title: $t('23'), subtitle: $t('24'), rightTitle: $t('27'), time: (topData.new_products || {}).updated_at}"
          />
          <PlatformHorizontal
            v-for="(item) in (topData.new_products.data || [])"
            :data="item"
            :key="'platform_new_products-'+item.id"
          />
          <TopContent class="mt-20"
                      :data="{title: $t('25'), subtitle: $t('26'), rightTitle: $t('27'), time: (topData.rank_products || {}).updated_at}"
          />
          <PlatformHorizontal
            v-for="(item) in (topData.rank_products.data || [])"
            :data="item"
            :key="'platform_rank_products-'+item.id"
          />
        </div>
      </div>
    </section>
    <section class="mb-60 mt-50">
      <div class="content-title">
        <span class="english">{{ $t('3') }}</span>
        <span class="japanese">{{ $t('4') }}</span>
        <!-- <a href="#" target="_blank" rel="noopener" class="link-strategy">{{ $t('5') }}</a> -->
      </div>
      <nav id="two_select" class="clearfix">
        <ul class="flex mid">
          <li v-for="(item, key) in strategyList" :key="'strategy'+ item">
            <a @click="selectStrategy(key)" :class="{'active': selectedTab == key}">{{ item }}</a>
          </li>
        </ul>
      </nav>
      <div v-if="loadingStrategy[selectedTab]" class="flex mid center strategy-loading">
        <Loading class="ml-10" style="width: 50px; height: 50px;" />
      </div>
      <div class="flex flex-wrap pr-20 pl-20" v-else>
        <StrategyItem
          v-for="item in dataStrategy[selectedTab]"
          :item="item"
          :key="'strategy-'+selectedTab+item.id"
        />
      </div>
    </section>
    <section>
      <div class="content-title">
        <span class="english">{{ $t('14') }}</span>
        <span class="japanese">{{ $t('15') }}</span>
      </div>
      <div class="clearfix">
        <div class="text-center">
          <p class="title">{{ $t('16') }}</p>
          <p class="title2">{{ $t('17') }} </p>
        </div>
        <div class="text-center" style="font-size: 16px;">{{ $t('30') }}</div>
        <div class="text-center mt-20">
          <img src="/img/assets/pc/kabu/Labo.png" class="img-labo" />
        </div>
        <div class="flex space-between labo-list">
          <a
            :href="'https://labo.gogojungle.co.jp/articles/' + item.id"
            v-for="(item,index) in laboArticles"
            v-if="index < 4"
            :key="'labo-article-' + item.id"
          >
            <LaboArticle :item="item" />
          </a>
        </div>
      </div>
      <div class="clearfix mt-50">
        <div class="text-center">
          <p class="title">{{ $t('18') }}</p>
          <p class="title2">{{ $t('29') }} </p>
        </div>
        <div class="text-center" style="font-size: 16px;">{{ $t('21') }}</div>
        <div class="text-center mt-20">
          <img src="/img/assets/pc/kabu/Crowdsourcing.png" class="img-crowd" />
        </div>
        <div class="flex space-between labo-list">
          <!-- <CrowdsourcingItem v-for="item in (crowdData.data || [])" :key="'sKLuW'+item.id" :item="item" /> -->
          <a href="/crowdsourcing">
            <img src="/img/assets/pc/kabu/sample_crowd.png?12312312" class="img-crowd-item" />
          </a>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import i18n from '@@/lang/desktop/kabu.json'
import PlatformVertical from '@/components/kabu/PlatformVertical.vue'
import PlatformHorizontal from '@/components/kabu/PlatformHorizontal.vue'
import StrategyItem from '@/components/kabu/StrategyItem.vue'
import LaboArticle from '@/components/kabu/LaboArticle.vue'
import TopContent from '@/components/kabu/TopContent.vue'
import CrowdsourcingItem from '@/components/crowdsourcing/CrowdsourcingItem.vue'
import Loading from '@@/../components/icons/Loading.vue'
import ShowMore02 from '@/components/common/ShowMore02.vue'
import ImgWrapper from '@@/../components/ImgWrapper.vue'
import title from '@@/../common/pages'

export default Object.assign(
  {
    components: {
      PlatformVertical,
      StrategyItem,
      LaboArticle,
      TopContent,
      CrowdsourcingItem,
      Loading,
      PlatformHorizontal,
      ShowMore02,
      ImgWrapper,
    },
    i18n: {
      messages: i18n
    },
    data() {
      return {
        titleChunk: this.$t('title'),
        loadingStrategy: {
          'new-arrival': false,
          popularity: false,
          'rate-of-return': false,
          earnings: false,
          drawdown: false,
          pf: false,
          'risk-return': false,
          platform: false
        },
        strategyList: {
          'new-arrival': this.$t('6'),
           'popularity' : this.$t('7'),
           'rate-of-return' : this.$t('8'),
           'earnings' : this.$t('9'),
           'drawdown' : this.$t('10'),
           'pf' : this.$t('11'),
           'risk-return' : this.$t('12'),
           'platform' : this.$t('13'),
        },
        dataStrategy: {
          'new-arrival': [],
          popularity: null,
          'rate-of-return': null,
          earnings: null,
          drawdown: null,
          pf: null,
          'risk-return': null,
          platform: null
        },
        laboArticles: []
      }
    },
    mounted() {
      this.GoGoHTTP.get('/api/kabu/strategy/new-arrival').then(data => {
        this.dataStrategy['new-arrival'] = data
      })
      this.GoGoHTTP.get('/api/v3/labo/articles/top?limit=4').then(data => {
        this.laboArticles = data
      })
    },
    async asyncData({ app }) {
      let [topData, relatedArticles] = await Promise.all([
          app.GoGoHTTP.get('/api/kabu/top'),
          app.GoGoHTTP.get('/api/kabu/related/articles'),
        ]),
        top3 = (topData.platform_tools || []).slice(0, 3),
        curIdx = 1,
        platformData = (topData.platform_tools || []).slice(3, 11)
      return {
        top3,
        platformData,
        topData,
        relatedArticles,
        curIdx,
        selectedTab: 'new-arrival',
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp/kabu-api`,
          },
        ],
      }
    },
    methods: {
      selectStrategy(tab) {
        this.selectedTab = tab
        if (!this.dataStrategy[tab]) {
          this.loadingStrategy[tab] = true
          this.GoGoHTTP.get(`/api/kabu/strategy/${tab}`)
            .then(data => {
              this.dataStrategy[tab] = data || []
            })
            .finally(() => {
              this.loadingStrategy[tab] = false
            })
        }
      },
      onPlatformShowMore() {
        let from = 3 + this.curIdx * 8,
          to = from + 8
        this.curIdx += 1
        this.platformData = this.platformData.concat((this.topData.platform_tools || []).slice(from, to))
      },
      descriptionTemplate() {
        return this.$t('description')
      }
    }
  },
  title
)
</script>

<style lang="scss" scoped>
.content-howto {
  a {
    display: block;
    width: 233px;
    margin-right: 22px;
    margin-bottom: 15px;
    .articles-img {
      width: 100%;
      height: 108px;
    }
    .item-title-howto {
      margin-top: 5px;
      max-width: 100%;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    &:hover {
      opacity: 0.8;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
.left-content {
  width: 780px;
  padding: 10px 20px;
  .large-item /deep/ {
    .logo-api {
      margin-bottom: 20px;
    }
    .pf-box {
      width: 230px;
      height: 370px;
      padding: 10px 20px;
    }
    .pf-name {
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .top-img {
      width: 32px;
      height: 32px;
    }
    .pf-img {
      height: 110px;
      margin-bottom: 10px;
    }
    .pf-text {
      font-size: 14px;
      line-height: 22px;
    }
    .pf-price {
      font-size: 20px;
    }
  }
  /deep/ .old-price {
    line-height: 14px;
  }
  .pf-box:hover {
    box-shadow: 0 0 10px #999;
  }
}
.right-content {
  width: 220px;
  .banner-ctn {
    display: block;
    height: 155px;
    width: 220px;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}
.content-title {
  background: #f2f2f2;
  padding: 30px 0 20px 40px;
  height: 80px;
  margin-bottom: 20px;
  color: #666;
  position: relative;
}
.english {
  font-family: "Ubuntu", sans-serif;
  font-size: 26px;
  margin-right: 20px;
}
.japanese {
  font-size: 16px;
}
.clearfix::after {
  clear: both;
  content: "";
  display: block;
}
ul {
  list-style: none;
  padding-inline-start: 0;
}
#two_select {
  width: 960px;
  margin: 0 auto 20px;
}
#two_select li a {
  position: relative;
  display: inline-block;
  float: left;
  font-size: 13px;
  color: #616161;
  text-align: center;
  text-decoration: none;
  height: 34px;
  line-height: 34px;
  border-radius: 6px;
  padding: 0 29px;
  transition: 0.1s;
  margin-left: 5px;
  cursor: pointer;
}
#two_select li a:hover {
  background: #f2f2f2;
}
#two_select li a.active {
  background: #e0f22f;
  color: #2e4f00;
  font-size: 16px;
  border-radius: 2px;
}
#strategy {
  padding: 0 20px;
}
.title {
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  color: #6b6b6b;
  padding: 40px 0 30px;
}
.title2 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #929292;
  margin-bottom: 10px;
}
.text {
  color: #0b9082;
  font-size: 14px;
}
.text2 {
  color: #969205;
  font-size: 14px;
  padding: 10px 50px;
}
.img-labo {
  width: 673px;
  height: 148px;
}
.img-crowd {
  width: 377px;
  height: 148px;
}
.labo-list {
  margin-top: 30px;
  padding: 0 50px;
}
.labo-list a {
  width: 24%;
  display: block;
  text-decoration: none;
}
.labo-list .crowd-box {
  width: 19%;
  margin: 10px 10px 0 0;
}
.strategy-loading {
  min-height: 380px;
}
.mb-60 {
  margin-bottom: 60px;
}
.mb-200 {
  margin-bottom: 200px;
}
.img-crowd-item {
  width: 900px;
  height: 264px;
}
</style>
