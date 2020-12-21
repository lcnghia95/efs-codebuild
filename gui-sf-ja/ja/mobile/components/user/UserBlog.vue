<template>
  <LazyComp01 class="wrapper flex mid space-between pt-20 pb-20 pl-20 pr-5 bg-white" min-height="112px">
    <div class="detail">
      <a :href="data.detailUrl" v-wrap-lines="2" class="col-gray title">
        <b 
          :rel="data.isExternal ? 'nofollow' : ''"
        >
          {{ data.title }}
        </b>
      </a>
      <span class="mt-5">
        <b class="col-red" v-if="data.isNew">NEW</b>  
        {{ data.publishedDate ? formatTime(data.publishedDate, 7) : null }} 
        &nbsp; &nbsp; {{ $t(data.categoryId) }}
      </span>
    </div>
    <a target="_blank" :href="data.detailUrl"
       class="cursor-pointer"
       :rel="data.isExternal ? 'nofollow' : ''"
    >
      <i class="col-greyish" is="AngleRight" />
    </a>
  </LazyComp01>
</template>

<script>
import AngleRight from '@@/../components/icons/AngleRight.vue'
import i18n from '@@/lang/common/blog-types.json'
import LazyComp01 from '@@/../components/LazyComp01.vue'

export default {
  i18n: {
    messages: i18n,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    AngleRight,
    LazyComp01,
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  cursor: pointer;
  border: 0.25px solid rgb(243, 240, 239);
}
.detail {
  width: calc(100% - 36px);
  display: flex;
  flex-direction: column;
  span {
    color: rgb(179, 179, 179);
  }
}
.col-red {
  color: rgb(229, 69, 93);
}
.title {
  font-size: 16px;
}
</style>