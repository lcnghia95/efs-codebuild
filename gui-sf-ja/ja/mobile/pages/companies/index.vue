<template>
  <div class="mb-50 mt-15">
    <div class="head-title flex mid center">
      {{ $t('Title') }}
    </div>
    <div v-for="category in campaign" :key="'category-' + category.categoryId">
      <div class="flex campaign-name p-10" style="color: #747474;">
        <div class="arrow-right mr-10"></div> 
        <b>{{ category.categoryName }}</b>
      </div>
      <div class="mb-20 campaign" v-for="company in category.companies" :key="'company-'+ category.categoryId + company.companyId">
        <div class="item-title p-10">
          {{ company.companyName }}
        </div>
        <div class="flex layout-col">
          <a v-for="aff in (company.affiliates || [])" class="flex campaign-item" :key="'aff-list-' + aff.id" :href="aff.redirectUrl">
            <img :src="`/img/affiliates/${aff.id}/1`" alt="" />
            <div>
              <div class="tag-new" v-if="aff.isNew">NEW!</div>
              <div class="link-redirect mt-5">{{ aff.name }}</div>
              <div style="color: #000; margin-top: 5px;">{{ aff.description }}</div>                
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/mobile/companies-new.json'
import title from '@@/../common/pages'
const obj = Object.assign({
  i18n: {
    messages: i18n,
  },
  async asyncData({ app }) {
    const campaign = await app.GoGoHTTP.get('/api/v3/surface/company/campaign-v2')
    return {
      campaign,
      linkMeta: [
        {
          rel: 'canonical',
          href: `https://www.gogojungle.co.jp/companies`,
        },
      ]
    }
  },
  data() {
    return {
      titleChunk: this.$t('Title')
    }
  },
  methods: {
    descriptionTemplate() {
      return this.$t('Des')
    }
  }
},
title
)
export default obj
</script>
<style lang="scss" scoped>
.head-title {
  font-size: 18px;
  height: 35px;
  font-weight: bold;
  color: #fff;
  background-color: #3195cc;
}
.arrow-right {
  border-left: 10px solid #7db00f;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  height: 15px;
  margin-top: 3px;
}
.campaign-name {
  font-size: 16px;
  font-weight: bold;
}
.item-title {
  border: 1px solid #d3d3d3;
  background: linear-gradient(to bottom, #fcf2ce, #f4d666);
  font-size: 15px;
  font-weight: bold;
}
.campaign {
  .campaign-item {
    padding: 10px 15px;
    border-bottom: 1px solid #d3d3d3;
    font-size: 14px;
    img {
      width: 70px;
      height: 70px;
      flex: 0 0 70px;
      margin-right: 10px;
    }
    .link-redirect {
      color: #3372d1;
    }
    .tag-new {
      color: #f13300;
      font-size: 12px;
      line-height: 12px;
      height: 12px;
      font-weight: bold;
      background-color: transparent;
    }
    &:nth-child(even) {
      background: #f5f5f5;
    }
  }
}
</style>