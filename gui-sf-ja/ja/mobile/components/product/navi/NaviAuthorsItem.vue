<template>
  <div class="rank-wrapper flex layout-col">
    <div class="top-content w-full flex space-between">
      <div class="rank-left">
        <ImgWrapper :href="`/finance/navi/authors/${item.id}`" :src="`/img/users/${item.id}`"/>
      </div>
      <div class="rank-right">
        <a :href="`/finance/navi/authors/${item.id}`" :title="item.name" class="rank-title" v-wrap-lines="2">
          <b>{{ item.name }}</b>
        </a>
        <a :href="`/finance/navi/authors/${item.id}`" >
          <div class="rank-des" :title="item.introduction" v-wrap-lines="2">
            {{ item.introduction }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/navi-rank-horiz.json'
import ImgWrapper from '@@/../components/ImgWrapper.vue'

export default {
  props: {
    item: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    ImgWrapper,
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.rank-wrapper {
  margin-bottom: 12px;
  border: 1px solid rgb(217, 217, 217);
  background: #fff;
  a {
    font-size: 3vw;
    color: #8e8e8e;
    &:hover,
    &:active,
    &:visited,
    &:focus {
      text-decoration: none;
    }
  }
  .top-content {
    overflow: hidden;
  }
  .rank-right {
    flex: 0 0 80%;
    padding: 1.5vw 3vw;
    .rank-title {
      font-size: 4vw;
      color: rgb(45, 45, 45);
      max-height: 11vw;
      overflow: hidden;
    }
    .rank-des {
      margin-top: 3px;
      font-size: 3.2vw;
      line-height: 4.5vw;
      max-height: 8.5vw;
      overflow: hidden;
    }
  }
  .rank-left {
    flex: 0 0 20%;
    .img-wrapp {
      width: 100%;
      padding-bottom: 100%;
      overflow: hidden;
    }
  }
}
</style>
