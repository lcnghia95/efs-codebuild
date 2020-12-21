<template>
  <div class="bg-40 bg-color">
    <TopMenu />
    <div class="w-1000">
      <div class="salon-title mt-40">
        <span>{{ $t('1') }}</span>
      </div>
      <div class="sl-ctn mt-30">
        <select class="salon-select" v-model="sortTypeSelected" @change="onChangeSortType">
          <option value="1">{{ $t('2') }}</option>
          <option value="2">{{ $t('9') }}</option>
        </select>
      </div>
      <div ref="cc" class="salon-container flex space-between mt-20">
        <div>
          <SalonItem class="mb-30" v-for="(item, i) in list1"
                     :key="'ioa21w' + item.id"
                     :index="i"
                     @favorite-change="onFavChange"
                     :item="item"
          />
        </div>
        <div>
          <SalonItem class="mb-30" v-for="(item, i) in list2"
                     :key="'am112sa' + item.id"
                     :index="i"
                     @favorite-change="onFavChange"
                     :item="item"
          />
        </div>
      </div>
      <Loading v-if="isLoading" />
    </div>
  </div>
</template>
<script>
import TopMenu from '@/components/navi/TopMenu.vue'
import Loading from '@@/../components/icons/Loading.vue'
import SalonItem from '@/components/finance/SalonItem.vue'
import i18n from '@@/lang/desktop/salon-mailmagazine.json'
import title from '@@/../common/pages'
const obj = Object.assign(
  {
    components: {
      TopMenu,
      SalonItem,
      Loading,
    },
    i18n: {
      messages: i18n,
    },
    methods: {
      onChangeSortType() {
        if (this.sortType == this.sortTypeSelected) {
          return
        }
        location.href = '/finance/mailmagazine/t/' + this.sortTypeSelected
      },
      divideData(data) {
        return new Promise(resolve => {
          data.forEach(item => {
            let length = this.list1.length + this.list2.length
            length % 2 ? this.list2.push(item) : this.list1.push(item)
          })
          resolve()
        })
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
          },
        })
        if (data && data.length) {
          this.divideData(data)
          this.pages++
        }
        this.isLoading = false
        if (data && !data.length) {
          this.isEndOfPaging = true
        }
      },
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
        for (let i in this.list1 || []) {
          let item = this.list1[i],
            isFav = item.isFavorited,
            star = item.stars
          if (item.productId == productId) {
            this.$set(this.list1[i], 'isFavorited', !isFav)
            if (isFav) {
              this.$set(this.list1[i], 'stars', parseInt(star) - 1)
            } else {
              this.$set(this.list1[i], 'stars', parseInt(star) + 1)
            }
          }
        }
        for (let i in this.list2 || []) {
          let item = this.list2[i],
            isFav = item.isFavorited,
            star = item.stars
          if (item.productId == productId) {
            this.$set(this.list2[i], 'isFavorited', !isFav)
            if (isFav) {
              this.$set(this.list2[i], 'stars', parseInt(star) - 1)
            } else {
              this.$set(this.list2[i], 'stars', parseInt(star) + 1)
            }
          }
        }
      },
    },
    mounted() {
      let me = this
      me.divideData(me.data)
      window.onscroll = function() {
        if (window.scrollY > $(me.$refs.cc).height() - 500) {
          me.getMoreData()
        }
      }
    },
    computed: {
      titleChunk() {
        let titleSortType = {
          1: this.$t('2'),
          2: this.$t('9'),
        }
        return this.sortType
          ? titleSortType[this.sortType] + ' :' + this.$t('8')
          : this.$t('8')
      },
    },
    data() {
      return {
        list1: [],
        list2: [],
        pages: 1,
        isLoading: false,
        isEndOfPaging: false,
      }
    },
    async asyncData({ app, params }) {
      let sortType = params.t,
        data = await app.GoGoHTTP.get('/api/v3/surface/mailmagazine', {
          params: {
            pages: 1,
            sortType: sortType || 1,
          },
        })
      return {
        sortTypeSelected: params.t || 1,
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
  },
  title
)

export default obj
</script>
<style lang="scss" scoped>
.salon-title {
  border-bottom: 1px solid #f2f2f2;
  font-size: 28px;
  color: #2d2d2d;
  padding-bottom: 5px;
  box-shadow: inset 0 -1px 0 0 #d9d9d9;
}
.salon-container {
  min-height: 500px;
}
.sl-ctn {
  position: relative;
  height: 30px;
  width: 120px;
  &::after {
    content: "\25BC";
    color: #d9d9d9;
    font-size: 9px;
    padding: 9px 0;
    position: absolute;
    right: 10px;
    top: 0;
    text-align: center;
    pointer-events: none;
  }
}
.salon-select {
  width: 120px;
  height: 30px;
  border-radius: 2px;
  border: solid 1px #d9d9d9;
  background-color: #fff;
  appearance: none;
  padding: 0 6px;
  option {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: justify;
    color: #2d2d2d;
  }
}
.font-weight-border {
  font-weight: bolder;
}
.salon-item {
  width: 480px;
  border: 1px solid #d9d9d9;
}
.col-11 {
  color: #d9d9d9;
}
.fs-11 {
  font-size: 11px;
}
.fs-18 {
  font-size: 18px;
}
/deep/ .loader {
  height: 70px !important;
}
.bg-color {
  background-color: #fafafa;
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>