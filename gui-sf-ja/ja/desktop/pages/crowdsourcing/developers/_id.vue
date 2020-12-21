<template>
  <div class="w-1000">
    <div class="border-grey w-full flex mt-20">
      <div class="left-side text-center">
        <a :href="'/users/' + id" class="dev-ava">
          <img :src="'/img/users/' + id + '/small'" alt="" />
        </a>
        <a :href="'/users/' + id" class="dev-name fs-14">{{ (developer || {}).name }}</a>
        <div class="fs-14 mt-5 dev-stt">
          {{ $t('3') }}: {{ (developer || {}).total || 0 }}{{ $t('4') }}
        </div>
        <rate class="text-center fs-16" :stars="(developer || {}).star" :number="(developer || {}).count" :target="'/users/'+id" />
      </div>
      <div class="p-30 w-820 pre-wrap">
        {{ (developer || {}).introdution }}
      </div>
    </div>
    <div class="mt-50 mb-50">
      <ul class="nav nav-tabs" v-if="developer">
        <li class="active">
          <a href="#reviews" data-toggle="tab" class="fs-16"><b>{{ (developer || {}).name }}{{ $t('5') + ' (' + ((developer || {}).count || 0) + ')' }}</b></a>
        </li>
        <li>
          <a href="#orders" data-toggle="tab" class="fs-16"><b>{{ (developer || {}).name }}{{ $t('6') + ' (' + ((developer || {}).total || 0) + ')' }}</b></a>
        </li>
      </ul>
      <div class="tab-content mt-10">
        <div class="tab-pane active" id="reviews">
          <div v-if="(dataTabs || {}).reviews">
            <div class="reviews-tab pt-20 pb-20" v-for="item in (dataTabs || {}).reviews" :key="'ryMPj'+item.id">
              <a :to="'/crowdsourcing/' + item.id" class="reviews-title fs-15"><b>{{ item.title }}</b></a>
              <div class="reviews-detail flex mt-15">
                <div class="reviews-rate" :style="{width: isML ? '215px' : '150px', flex: isML ? '0 0 215px' : '0 0 150px'}">
                  <div class="title-rv flex mid content-end">
                    {{ $t('7') }}：
                    <rate class="text-center fs-16" :stars="item.rvQuality" />
                  </div>
                  <div class="title-rv flex mid content-end">
                    {{ $t('8') }}：
                    <rate class="text-center fs-16" :stars="item.rvSpeed" />
                  </div>
                  <div class="title-rv flex mid content-end">
                    {{ $t('9') }}：
                    <rate class="text-center fs-16" :stars="item.rvCommunication" />
                  </div>
                </div>
                <div class="reviews-des pl-15">
                  {{ item.rvContent }}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="reviews-tab h-145 p-20" v-for="i in 4" :key="'ryMPj'+i"></div>
          </div>
        </div>
        <div class="tab-pane" id="orders">
          <a :to="'/crowdsourcing/' + item.id" class="orders-tab no-underlying" v-for="item in (dataTabs || {}).all" :key="item.id">
            <p class="fs-15"><b>{{ item.title }}</b></p>
            <div class="flex">
              <p class="fs-12 w-330 mr-10">{{ $t('10') }}：{{ item.template }}</p>
              <p class="fs-12">{{ $t('11') }}：{{ item.period }}{{ $t('12') }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/crowdsourcing-devs.json'
import { filterInt } from '@/utils/client/common'
import Rate from '@@/../components/product/Rate.vue'
import title from '@@/../common/pages'

const obj = Object.assign(
  {
    validate({ params }) {
      return !isNaN(filterInt(params.id))
    },
    components: {
      Rate,
    },
    i18n: {
      messages: i18n,
    },
    computed: {
      isML() {
        return this.langSupported().includes(this.$i18n.locale)
      }
    },
    async asyncData({ app, params, store, error }) {
      let locale = app.i18n.locale,
        titleSuf = i18n[locale]['19'] || '開発者 : 投資クラウドソーシング',
        [developer, dataTabs] = await Promise.all([
          app.GoGoHTTP.get(
            `/api/v3/surface/crowdsourcing/developers/${params.id}`
          ),
          app.GoGoHTTP.get(
            `/api/v3/surface/crowdsourcing/developers/${params.id}/tab`
          ),
        ]),
        des = ((developer || {}).introdution || '').substr(0, 300),
        devName = `${(developer || {}).name || i18n[locale]['2']} - ID : ${
          params.id
        }`

      if (!Object.keys(developer).length) {
        return error({ statusCode: 404 })
      }

      store.commit('pushBC', {
        name: `${(developer || {}).name || i18n[locale]['2']}`,
        target: { name: 'crowdsourcing-developers-id', params: params },
      })
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
  },
  title
)
export default obj
</script>

<style lang="scss" scoped>
.w-820 {
  width: 820px;
}
.border-grey {
  border: 1px solid #dadada;
}
.left-side {
  width: 180px;
  margin: 20px 0;
  border-right: 1px dotted #dadada;
  a {
    color: #009cef;
  }
  .dev-ava {
    display: block;
    width: 100px;
    height: 100px;
    margin: 0 auto 10px;
    border: 1px solid #ececec;
    img {
      width: 100%;
      height: auto;
    }
  }
  .dev-stt {
    margin-bottom: 3px;
  }
  .gg-rating {
    align-items: center;
    justify-content: center !important;
    /deep/ a {
      font-size: 13px;
      color: #009cef;
    }
  }
}
.nav-tabs {
  border-bottom: 4px solid #039def;
  overflow: hidden;
  li {
    margin-right: 2px;
    a {
      border: 1px solid #dadada;
      border-bottom: none;
      color: #666;
      padding: 15px 70px 12px;
    }
    &.active,
    &:hover {
      a {
        background: #039def;
        border: 1px solid #039def;
        border-bottom: none;
        color: white;
      }
    }
  }
}
.fs-16 {
  font-size: 16px;
}
.reviews-tab {
  border-bottom: 1px solid #dadada;
  .reviews-title {
    color: #666;
    &:hover {
      color: #039def;
    }
  }
  .reviews-detail {
    .reviews-rate {
      border-right: 1px dotted #dadada;
      .title-rv {
        margin-right: 5px;
      }
    }
    .reviews-des {
      p {
        margin-top: 3px;
      }
    }
    p {
      color: #666;
    }
  }
  &:last-child {
    border-bottom: none;
  }
}
.orders-tab {
  display: block;
  border-top: 1px solid #dadada;
  padding: 20px 20px 10px;
  p {
    color: #666;
  }
  &:hover {
    background: #eef7fc;
  }
  &:first-child {
    border-top: none;
  }
}
.pre-wrap {
  white-space: pre-line;
}
.h-145 {
  height: 145px;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>
