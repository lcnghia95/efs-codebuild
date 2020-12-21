<template>
  <div class="w-1000">
    <div class="head-title">
      {{ $t('Title') }}
    </div>
    <div class="sub-title">
      {{ $t('1') }}
    </div>
    <div v-for="category in campaign" :key="'category-' + category.categoryId">
      <div class="category-name mt-30 mb-10">
        {{ category.categoryName }}
      </div>
      <div class="flex flex-wrap space-between">
        <div class="w-50">
          <div class="mb-20" v-for="company in category.companiesLeft" :key="'company-' + category.categoryId + company.companyId">
            <div class="item-title">
              {{ company.companyName }}
            </div>
            <div class="flex layout-col">
              <div v-for="aff in (company.affiliates || [])" class="flex campaign" :key="'aff-list-' + aff.id">
                <img :src="`/img/affiliates/${aff.id}/1`" alt="" />
                <div class="ml-10">
                  <div class="tag-new" v-if="aff.isNew">NEW!</div>
                  <a :href="aff.redirectUrl" class="link-redirect">{{ aff.name }}</a>
                  <div>{{ aff.description }}</div>                
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-50">
          <div class="mb-20" v-for="company in category.companiesRight" :key="'company-' + category.categoryId + company.companyId">
            <div class="item-title">
              {{ company.companyName }}
            </div>
            <div class="flex layout-col">
              <div v-for="aff in (company.affiliates || [])" class="flex campaign" :key="'aff-list-' + aff.id">
                <img :src="`/img/affiliates/${aff.id}/1`" alt="" />
                <div class="ml-10">
                  <div class="tag-new" v-if="aff.isNew">NEW!</div>
                  <a :href="aff.redirectUrl" class="link-redirect">{{ aff.name }}</a>
                  <div>{{ aff.description }}</div>                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/desktop/companies-new.json'
import title from '@@/../common/pages'
const obj = Object.assign({
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
  i18n: {
    messages: i18n,
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
  text-align: center;
  font-size: 26px;
  color: white;
  background: linear-gradient(to right, #4fcdf2, #5179ec);
  border-radius: 5px;
  margin-bottom: 30px;
  font-weight: bold;
  height: 42px;
  line-height: 45px;
}
.sub-title {
  margin: 0 20%;
  font-size: 15px;
}
.category-name {
  font-size: 22px;
  font-weight: bold;
  height: 30px;
  line-height: 32px;
  padding-left: 10px;
  color: #5a5a5a;
}
.w-50 {
  width: 48%;
  max-width: 48%;
}
.item-title {
  width: 100%;
  background: #e6e6e6;
  font-size: 18px;
  font-weight: bold;
  height: 30px;
  line-height: 32px;
  padding-left: 10px;
  color: #5a5a5a;
}
.campaign {
  font-size: 14px;
  padding: 10px;
  img {
    width: 70px;
    height: 70px;
    flex: 0 0 70px;
  }
  .link-redirect {
    display: block;
    margin-top: 6px;
    color: #3372d1;
    line-height: 15px;
  }
  .tag-new {
    color: red;
    font-size: 12px;
    font-weight: bold;
  }
  &:nth-child(even) {
    background: #f5f5f5;
  }
}
</style>
<style lang="scss">
/* stylelint-disable */
.back-mobile {
  display: flex !important;
}
/* stylelint-enable */
</style>