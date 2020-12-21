<template>
  <div class="pb-30">
    <Header />
    <div class="page-title">{{ $t(4) }}</div>
    <div class="p-15 mt-15" style="background: #f3f0f0;">
      <div class="user-info flex space-between mb-10">
        <div class="flex">
          <a :href="'/users/' + id" class="user-img mr-10">
            <img :src="'/img/users/' + id + '/small'" alt="" />
          </a>
          <div>
            <a :href="'/users/' + id" class="user-name">{{ developer.name }}</a>
            <Rate :stars="developer.star" />
          </div>
        </div>
        <span @click="onClickExpand" v-if="developer.introduction">
          <AngleDown v-if="!isExpanded" />
          <AngleUp v-else />
        </span>
      </div>
      <div ref="devIntro"
           v-if="developer.introduction"
           class="dev-intro panel-collapse collapse"
           v-html="developer.introduction"
      ></div>
      <div class="flex space-between mt-10">
        <div @click="current = 'reviews'" class="type-btn" :class="{ active: current === 'reviews'}">{{ $t(5, { n: (dataTabs.reviews || []).length }) }}</div>
        <div @click="current = 'all'" class="type-btn" :class="{ active: current === 'all' }">{{ $t(6, { n: (dataTabs.all || []).length }) }}</div>
      </div>
    </div>
    <transition-group name="rv-all" class="flex layout-col w-full pos-rel">
      <div key="g1" class="w-full" v-if="current === 'reviews'">
        <template v-if="(dataTabs.reviews || []).length">
          <ReviewItem v-for="item in (dataTabs.reviews || []).slice(0, limitReview)" :item="item" :key="item.id + 'rv'" />
          <div @click="limitReview = limitReview + 10" v-if="limitReview < (dataTabs.reviews || []).length">
            <LoadMore class="mb-25 mt-20" style="border-bottom: 1px solid #e0dedc;" />
          </div>
        </template>
        <div class="notify-text" v-else>{{ $t(7) }}</div>
      </div>
      <div key="g2" class="w-full" v-if="current === 'all'">
        <template v-if="(dataTabs.all || []).length">
          <AcceptItem v-for="item in dataTabs.all.slice(0, limitAll - 1)" :item="item" :key="item.id + 'rv'" />
          <div @click="limitAll = limitAll + 10" v-if="limitAll < (dataTabs.all || []).length">
            <LoadMore class="mb-25 mt-20" style="border-bottom: 1px solid #e0dedc;" />
          </div>
        </template>
        <div class="notify-text" v-else>{{ $t(7) }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import i18n from '@@/lang/mobile/crowdsorcing-devs-detail.json'
import title from '@@/../common/pages'
import Rate from '@@/../components/product/Rate.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
import AngleUp from '@@/../components/icons/AngleUp.vue'
import Header from '@/components/crowdsourcing/Header.vue'
import ReviewItem from '@/components/crowdsourcing/developers/ReviewItem.vue'
import AcceptItem from '@/components/crowdsourcing/developers/AcceptItem.vue'
import LoadMore from "@/components/common/LoadMore.vue"
import { filterInt, replaceLinkUrl } from '@/utils/client/common'

const obj = Object.assign(
  {
    components: {
      Header,
      ReviewItem,
      AcceptItem,
      Rate,
      AngleDown,
      AngleUp,
      LoadMore,
    },
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        current: 'reviews',
        isExpanded: false,
        limitReview: 10,
        limitAll: 10,
      }
    },
    async asyncData({ app, params, error }) {
      let locale = app.i18n.locale,
        titleSuf = i18n[locale][3],
        [developer, dataTabs] = await Promise.all([
          app.GoGoHTTP.get(
            `/api/v3/surface/crowdsourcing/developers/${params.id}`
          ),
          app.GoGoHTTP.get(
            `/api/v3/surface/crowdsourcing/developers/${params.id}/tab`
          ),
        ]),
        des = ((developer || {}).introduction || '').substr(0, 300),
        devName = `${(developer || {}).name || i18n[locale]['2']} - ID : ${
          params.id
        }`

      developer.introduction = replaceLinkUrl(developer.introduction)
      if (!Object.keys(developer).length) {
        return error({ statusCode: 404 })
      }

      return {
        id: params.id,
        developer,
        dataTabs,
        titleChunk: `${devName} - ${titleSuf}`,
        descriptionTemplate() {
          return des
        },
        linkMeta: [
          {
            rel: 'canonical',
            href: `${process.env.GOGO_URL}/crowdsourcing/developers/${
              params.id
            }`,
          },
        ],
      }
    },
    methods: {
      onClickExpand() {
        this.isExpanded = !this.isExpanded
        if(this.isExpanded) {
          $(this.$refs.devIntro).delay(5000).collapse('show')
        } else {
          $(this.$refs.devIntro).delay(5000).collapse('hide')
        }
      },
    }
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.user-info {
  .user-img {
    display: block;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .user-name {
    font-size: 16px;
    font-weight: bold;
    background-color: #f3f0f0;
    color: #434343;
  }
  .icon-cls {
    width: 20px;
    height: 20px;
  }
}
.type-btn {
  width: 49%;
  height: 35px;
  border-radius: 15px;
  line-height: 35px;
  text-align: center;
  background: #e8e5e3;
  color: #707070;
  &.active {
    background: #00a300;
    color: #fff;
  }
}
.page-title {
  background: #f3f0f0;
  height: 40px;
  line-height: 20px;
  padding: 10px;
  color: #434343;
  font-size: 16px;
  font-weight: bold;
}
.dev-intro {
  white-space: pre-line;
  word-break: break-all;
  background-color: #f3f0f0;
  color: #2d2d2d;
  text-align: justify;
}
.rv-all-enter-active {
  transition: opacity 0.2s ease;
  transition-delay: 0.3s;
}
.rv-all-leave-active {
  transition: opacity 0.4s ease;
}
.rv-all-enter-to, .rv-all-leave {
  opacity: 1;
}
.rv-all-enter, .rv-all-leave-to {
  opacity: 0;
}
.notify-text {
  color: red;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #f3f0f0;
}
</style>
