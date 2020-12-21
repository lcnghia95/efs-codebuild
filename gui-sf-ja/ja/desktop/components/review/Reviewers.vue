<template>
  <div class="reviewers">
    <div class="simple-product p-10" v-for="(reviewer, key) in reviewers" :key="key">
      <a :href="'/review/detail/'+reviewer.productId" :title="reviewer.reviewTitle" class="review-title wrap-text" v-if="reviewer.reviewTitle">{{ reviewer.reviewTitle }}</a>
      <title02 class="mt-5" :href="'/users/'+reviewer.reviewUserId+'/review'" :image-src="'/img/users/'+reviewer.reviewUserId+'/tiny'" :c-style="{ marginRight: '10px', color: '#999999' }" :title="reviewer.reviewNickName" />
    </div>
  </div>
</template>

<script>
import Title02 from '@/components/review/Title02.vue'
export default {
  components: {
    Title02,
  },
  props: ['reviewers'],
}
</script>

<style lang="scss" scoped>
$color9: #eee;
$color64: #f5f5f5;
.reviewers {
  min-height: 650px;
}
.simple-product {
  display: block;
  min-height: 55px;
  text-decoration: none;
  &:not(:last-child) {
    border-bottom: 1px solid $color9;
  }
  &:hover {
    background: $color64;
  }
  .review-title {
    font-size: 14px;
    display: block;
    color: #0343ce;
    text-decoration: underline;
  }
}
</style>
