<template>
  <section class="pt-30">
    <IconHeader :item="title">
      <i :is="title.icon" />
    </IconHeader>
    <div class="flex flex-wrap developer-list">
      <GogoLink v-for="usr in dataDevsShow.data" class="developer" :key="'developer-' + usr.id" :target="'/users/' + usr.id">
        <div class="img-wrapp flex center pos-rel">
          <img class="pos-abs" :src="'/img/users/' + usr.id" :alt="usr.name + ' ' + $t('3')" />
        </div>
        <div class="wrap-text text-center name">{{ usr.name }}</div>
      </GogoLink>
    </div>
    <paging class="product-paging mb-40" :cur-page="dataDevsShow.currentPage"
            :total="dataDevsShow.lastPage"
            :from="dataDevsShow.pagingFrom"
            :to="dataDevsShow.pagingTo"
            :has-scroll="true"
            :is-add-url-param="true"
            :origin-url="originUrl"
            theme-class="theme1"
            @pagingclick="onPagingClick"
    />
  </section>
</template>
<script>
import title from '@@/../common/pages/index.js'
import IconHeader from '@/components/systemtrade/IconHeader.vue'
import { calPaging } from '@/utils/client/common'
import i18n from '@@/lang/mobile/system-developers.json'
import GogoLink from '@@/../components/link/GogoLink.vue'
import Paging from '@/components/paging/Paging.vue'
import User2 from '@@/../components/icons/User2.vue'

const obj = Object.assign(
  {
    components: {
      IconHeader,
      GogoLink,
      Paging,
      User2,
    },
    i18n: {
      messages: i18n,
    },
    data() {
      return {
        title: {
          type: 'developer',
          icon: 'User2',
          bgColor: '#bbb9b9',
          url: '/systemtrade/developers',
        },
        dataDevsShow: {
          data: [],
        },
      }
    },
    async asyncData({ app, query, params }) {
      let dataDevs = await app.GoGoHTTP.get(
          '/api/v3/surface/systemtrade/developers'
        ),
        dataDevsShow,
        originUrl = '/systemtrade/developers'

      if (query.q) {
        let tmp = query.q.split(' ')
        for (let i = tmp.length - 1; i >= 0; i--) {
          if (!tmp[i]) {
            continue
          }
          dataDevs = dataDevs.filter(obj => obj.name.indexOf(tmp[i]) !== -1)
        }
      }
      dataDevsShow = calPaging(dataDevs, params.p, 30)
      return {
        dataDevs,
        dataDevsShow,
        titleChunk: i18n[app.i18n.locale][1],
        originUrl,
        linkMeta: [
          {
            rel: 'canonical',
            href: `https://www.gogojungle.co.jp${originUrl}`,
          },
        ],
      }
    },
    methods: {
      onPagingClick(page) {
        this.dataDevsShow = calPaging(this.dataDevs, page, 30)
      },
      descriptionTemplate() {
        return this.$t('2')
      },
    },
  },
  title
)
export default obj
</script>
<style lang="scss" scoped>
.developer-list {
  padding: 4vw 4vw 0;
  .developer {
    border: 1px solid #d2d2d2;
    width: calc(92% / 3);
    padding: 2%;
    margin: 0 4% 4% 0;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .img-wrapp {
      width: 100%;
      height: 0;
      padding-top: 100%;
      background: #eceef1;
      img {
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .name {
      color: #666;
      margin-top: 2vw;
    }
  }
}
@media only screen and (min-width: 600px) {
  .developer-list {
    padding: 4vw 6vw 0;
    .developer {
      width: calc(88% / 4);
      &:nth-child(3n) {
        margin-right: 4%;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>
