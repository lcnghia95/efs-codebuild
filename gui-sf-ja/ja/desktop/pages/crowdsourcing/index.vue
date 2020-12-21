<template>
  <div>
    <div class="w-full crowd-title text-center p-40" :style="{'background-image': 'url(/img/assets/pc/crowdsourcing/Crowdsourcing_mainvisual.jpg)'}">
      <button class="btn-request mt-150 fs-18" @click="onGoToCreate">{{ $t('4') }}</button>
      <div class="mt-10">
        <a class="mt-10 no-underlying" href="/crowdsourcing/developers">
          {{ $t('5') }}
        </a>
      </div>
    </div>
    <div class="w-full">
      <div class="w-1000 pt-50 pb-50">
        <div class="title-01">{{ $t('6') }}</div>
        <div class="flex flex-wrap list-crowd">
          <CrowdsourcingItem v-for="item in crowdsourcings.data" :key="'sKLuW'+item.id" :item="item" />
        </div>
        <div class="text-center mt-15">
          <paging :cur-page="crowdsourcings.currentPage"
                  :total="crowdsourcings.lastPage"
                  :from="crowdsourcings.pagingFrom"
                  :to="crowdsourcings.pagingTo"
                  :has-scroll="true"
                  theme-class="theme1"
                  @pagingclick="onPagingClick"
          />
        </div>
      </div>
    </div>
    <div class="w-full bg-border">
      <div class="w-1000 p-40">
        <div class="text-center w-full fs-26 co-grey">
          {{ $t('7') }}
        </div>
        <div class="flex space-around mt-30">
          <div class="handshake text-center p-20 bg-white border-radius-5">
            <a href="/crowdsourcing/guide1" class="cursor-pointer no-underlying">
              <HandShake class="i-handshake" :fill-co="'#9c3'" />
              <div class="fs-25">{{ $t('8') }}</div>
              <div>{{ $t('9') }}</div>
              <AngleDown class="i-angle-down mt-10" />
            </a>
          </div>
          <div class="paper-plane text-center p-20 bg-white border-radius-5">
            <a href="/crowdsourcing/guide2" class="cursor-pointer no-underlying">
              <PaperPlane class="i-paper-plane" />
              <div class="fs-25">{{ $t('10') }}</div>
              <div>{{ $t('11') }}</div>
              <AngleDown class="i-angle-down mt-10" />
            </a>
          </div>
          <div class="cogs text-center p-20 bg-white border-radius-5">
            <a href="/crowdsourcing/guide3" class="cursor-pointer no-underlying">
              <Cogs class="i-cogs" />
              <div class="fs-25">{{ $t('12') }}</div>
              <div>{{ $t('13') }}</div>
              <AngleDown class="i-angle-down mt-10" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="w-1000 pt-50 pb-50">
        <div class="flex space-between">
          <div class="title-01">{{ $t('14') }}</div>
          <a class="mt-10 no-underlying" href="/crowdsourcing/developers">
            {{ $t('15') }}
          </a>
        </div>
        <div class="flex space-between flex-wrap mt-10">
          <CrowdsourcingDev
            v-for="item in developers"
            :key="'kBNIh'+item.userId"
            :item="item"
          />
        </div>
        <div class="text-center mt-40">
          <button class="btn-request fs-18" @click="onGoToCreate">{{ $t('4') }}</button>
        </div>
      </div>
    </div>
    <div class="w-full bg-border">
      <div class="w-1000 pt-50 pb-50">
        <div class="title-01">{{ $t('16') }}</div>
        <div class="flex flex-wrap">
          <CrowdsourcingItem v-for="item in finishedCrowdsourcings.data" :key="'sKLuW'+item.id" :item="item" />
        </div>
        <div class="text-center mt-15">
          <paging :cur-page="finishedCrowdsourcings.currentPage"
                  :total="finishedCrowdsourcings.lastPage"
                  :from="finishedCrowdsourcings.pagingFrom"
                  :to="finishedCrowdsourcings.pagingTo"
                  :has-scroll="false"
                  theme-class="theme1"
                  @pagingclick="onPagingClickFinish"
          />
        </div>
        <div class="text-center mt-50 mb-30">
          <button class="btn-request fs-18" @click="onGoToCreate">{{ $t('4') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/crowdsourcing-index.json'
import title from '@@/../common/pages'
import Paging from '@@/../components/paging/Paging.vue'
import HandShake from '@@/../components/icons/HandShake.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import PaperPlane from '@@/../components/icons/PaperPlane.vue'
import Cogs from '@@/../components/icons/Cogs.vue'
import CrowdsourcingItem from '@/components/crowdsourcing/CrowdsourcingItem.vue'
import CrowdsourcingDev from '@/components/crowdsourcing/CrowdsourcingDev.vue'

const obj = Object.assign(
  {
    components: {
      Paging,
      HandShake,
      AngleDown,
      PaperPlane,
      Cogs,
      CrowdsourcingItem,
      CrowdsourcingDev,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        titleChunk: this.$t('2'),
        keywordsChunk: this.$t('2'),
        descriptionChunk: this.$t('2'),
      }
    },
    async asyncData({ app, params }) {
      let page = params.isFinish == '0' ? params.page : 1,
        fPage = params.isFinish == '1' ? params.page : 1,
        [
          crowdsourcings,
          developers,
          finishedCrowdsourcings,
          isCrowdsourcing,
        ] = await Promise.all([
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing`, {
            params: {
              page: page,
            },
          }),
          app.GoGoHTTP.get('/api/v3/surface/crowdsourcing/developers?limit=7'),
          app.GoGoHTTP.get(`/api/v3/surface/crowdsourcing`, {
            params: {
              page: fPage,
              isFinish: 1,
            },
          }),
          app.GoGoHTTP.get('/api/v3/surface/crowdsourcing/user'),
        ])
      return {
        crowdsourcings,
        developers,
        finishedCrowdsourcings,
        isCrowdsourcing,
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing`,
          },
        ],
      }
    },
    methods: {
      onGoToCreate() {
        if (this.isCrowdsourcing === 1) {
          location.href = '/mypage/crowdsourcing/input'
        } else {
          location.href = '/mypage/crowdsourcing?u=/mypage/crowdsourcing/input'
        }
      },
      onPagingClick(page) {
        location.href = `/crowdsourcing/finish/0/p/${page}`
      },
      onPagingClickFinish(page) {
        location.href = `/crowdsourcing/finish/1/p/${page}`
      },
      descriptionTemplate() {
        return this.$t('17')
      },
    },
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.co-grey {
  color: #4d4539;
}
.co-pink {
  color: #dc1c39;
}
.bg-border {
  background: #f5f6f5;
  border-top: 2px solid #e6e6e6;
}
.crowd-title {
  background-size: 1400px 300px;
  background-repeat: no-repeat;
  background-position: center 0;
  height: 300px;
}
.title-01 {
  font-size: 22px;
  color: grey;
}
.fs-25 {
  font-size: 25px;
}
.mt-150 {
  margin-top: 150px;
}
.btn-request {
  border-radius: 5px;
  background-color: #00a400;
  color: white;
  width: 400px;
  height: 60px;
  border: none;
  position: relative;
  font-size: 18px;
  &::after {
    content: '＞';
    position: absolute;
    top: 20px;
    right: 10px;
    font-size: 15px;
  }
  &:hover {
    background: #08b308;
  }
}
.fs-26 {
  font-size: 26px;
}
.handshake,
.paper-plane,
.cogs {
  width: 270px;
}
.handshake {
  border: 1px solid #9c3;
  .i-handshake {
    color: #9c3;
  }
}
.paper-plane {
  border: 1px solid #00b7ee;
  .i-paper-plane {
    color: #00b7ee;
  }
}
.cogs {
  border: 1px solid #f29c9f;
  .i-cogs {
    color: #f29c9f;
  }
}
.icon-cls {
  width: 86px;
  height: 86px;
  padding-bottom: 20px;
}
.i-angle-down {
  width: 20px;
  height: 20px;
}
.grey-title {
  background-color: grey;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>