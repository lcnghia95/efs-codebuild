<template>
  <div class="mailmagazine">
    <TopMenu />
    <div class="p-10" ref="cc">
      <div class="flex mb-10" style="width: 45%;">
        <button class="w-full button-mailmagazine button-mailmagazine-left"
                @click="onChangeSortType(1)"
                :class="{active: sortTypeSelected == 1}"
        >
          {{ $t(4) }}
        </button>
        <button class="w-full button-mailmagazine button-mailmagazine-right"
                @click="onChangeSortType(2)"
                :class="{active: sortTypeSelected == 2}"
        >
          {{ $t(5) }}
        </button>
      </div>
      <SalonItem v-for="item in data"
                 :key="'ioa21w' + item.id"
                 class="mb-10"
                 @favorite-change="onFavChange"
                 :item="item"
      />
      <Loading v-if="isLoading" />
      <div v-else @click="getMoreData">
        <LoadMore class="mb-25" v-if="!isEndOfPaging" />
      </div>
    </div>
  </div>
</template>

<script>
import SalonItem from '@/components/finance/mailmagazine/SalonItem.vue'
import TopMenu from '@/components/finance/TopMenu.vue'
import Loading from '@@/../components/icons/Loading.vue'
import i18n from '@@/lang/mobile/finance-mailmagazine.json'
import LoadMore from "@/components/common/LoadMore.vue"
import title from '@@/../common/pages'
const obj = Object.assign({
  i18n: {
    messages: i18n,
  },
  components: {
    SalonItem,
    TopMenu,
    Loading,
    LoadMore,
  },
  async asyncData({ app, params }) {
    let sortType = params.t,
      pages = 1,
      data = await app.GoGoHTTP.get('/api/v3/surface/mailmagazine', {
        params: {
          pages,
          sortType: sortType || 1,
          limit: 10,
        },
      })
    return {
      sortTypeSelected: params.t || 1,
      pages,
      sortType,
      data,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/finance/mailmagazine`,
        },
      ],
    }
  },
  data() {
    return {
      isLoading: false,
      isEndOfPaging: false,
    }
  },
  computed: {
    titleChunk() {
      let titleSortType = {
        1: this.$t('1'),
        2: this.$t('2'),
      }
      return this.sortType
        ? titleSortType[this.sortType] + ' :' + this.$t('3')
        : this.$t('3')
    },
  },
  methods: {
    descriptionTemplate() {
      let description = {
        1: this.$t('description01'),
        2: this.$t('description02'),
        3: this.$t('description'),
      }
      return description[this.sortType]
        ? description[this.sortType]
        : description[3]
    },
    onFavChange(productId) {
      for (let i in this.data || []) {
        let item = this.data[i],
          isFav = item.isFavorited,
          star = item.stars
        if (item.productId == productId) {
          this.$set(this.data[i], 'isFavorited', !isFav)
          if (isFav) {
            this.$set(this.data[i], 'stars', parseInt(star) - 1)
          } else {
            this.$set(this.data[i], 'stars', parseInt(star) + 1)
          }
        }
      }
    },
    onChangeSortType(sortType) {
      if(sortType == this.sortType) {
        return
      }
      location.href = '/finance/mailmagazine/t/' + sortType
    },
    async getMoreData() {
      if (this.isEndOfPaging || this.isLoading) {
        return
      }
      this.isLoading = true
      let data = await this.GoGoHTTP.get('/api/v3/surface/mailmagazine', {
        params: {
          page: this.pages + 1,
          sortType: this.sortType,
          limit: 10,
        },
      })
      if (data && data.length) {
        this.data = this.data.concat(data)
        this.pages++
      }
      this.isLoading = false
      if (data && !data.length) {
        this.isEndOfPaging = true
      }
    }
  }
}, title)
export default obj
</script>

<style lang="scss" scoped>
.mailmagazine {
  background: #f3f0ef;
  /deep/ .btn-loadmore {
    background: #fff;
    padding: 10px 0;
    .icon-cls {
      width: 20px !important;
      height: 22px !important;
    }
  }
}
/deep/ .nav-wrapper--fi {
  .nav__i--fi {
    border: none;
    background: #fff;
    color: #2d2d2d;
    &.active, &:hover {
      background: #fff;
      color: #2d2d2d;
      border-bottom: 2px solid #2d2d2d;
    }
  }
}
.button-mailmagazine {
  border: 1px solid #c9c9c9;
  color: #b2b2b2;
  background: white;
  height: 35px;
  font-size: 17px;
  min-width: 85px;
  &.button-mailmagazine-left {
    border-right: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &.button-mailmagazine-right {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  &.active {
    color: #fff;
    background: #d9d7d4;
  }
}
</style>
<style lang="scss">
#search-bar-header {
  display: none;
}
</style>