<template>
  <div class="flex product-review-03 border-radius-5 p-15 mt-10 mb-10">
    <div class="w-full">
      <div class="flex w-full">
        <a :href="data.detailUrl" v-if="isChart" class="border-left border-bottom size-90">
          <image-chart :chart="{ data: data.chart }" :option="{width: 89, height: 89}"/>
        </a>
        <a :href="data.detailUrl" v-if="!isChart" class="size-90">
          <img v-if="data.productId" class="size-90 shadow w-full" :src="'img/products/'+data.productId+'/small'" alt="">
        </a>
        <div class="ml-15 short-content">
          <a :href="'/review/detail/'+data.productId">
            <p class="short-des wrap-text cursor-pointer mb-5" :title="data.reviewTitle"><b>{{ data.reviewTitle }}</b></p>
          </a>
          <rate :stars="data.reviewStars" class="mb-10"/>
          <a :href="'/review/detail/'+data.productId">
            <p class="content" v-if="data.reviewContent" v-wrap-lines="3" :title="data.reviewContent">{{ data.reviewContent }}</p>
          </a>
        </div>
      </div>
      <TimeIndicator :time="data.reviewPublishedDate" :href="'/users/'+data.reviewUserId"/>
    </div>
    <a :href="'/review/detail/'+data.productId" class="flex mid fs-25 glyphicon glyphicon-menu-right" aria-hidden="true"/>
  </div>
</template>

<script>
import Rate from '@@/../components/product/Rate.vue'
import TimeIndicator from '@/components/review/TimeIndicator.vue'
export default {
  components: {
    Rate,
    TimeIndicator,
  },
  props: {
    isChart: Boolean,
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
$color24: #999;
$color37: #6ac4de;
$color64: #f5f5f5;
$color69: #fcfcfc;
.fs-25 {
  font-size: 25px;
}
.border-radius-5 {
  border-radius: 5px;
}
.product-review-03 {
  background: $color69;
  border: solid 4px #edf2f2;
  text-decoration: none;
  height: 192px;
  width: 330px;
  .size-90 {
    flex: 0 0 90px;
    height: 90px;
  }
  .glyphicon-menu-right {
    color: #50a1c0;
    text-decoration: none;
  }
  .glyphicon-menu-right::before {
    cursor: pointer;
  }
  .short-content {
    flex-grow: 0;
    flex-shrink: 0;
    width: 160px;
    text-decoration: none;
    .short-des {
      margin-bottom: 3px;
    }
    a {
      color: #999;
    }
    &:hover {
      .short-des {
        text-decoration: underline;
      }
    }
    .content {
      width: 160px;
      height: 60px;
      overflow: hidden;
    }
  }
  &:hover {
    border: solid 4px #85bed4;
    background-color: $color64;
  }
  .short-des {
    color: $color37;
    width: 100%;
  }
}
</style>
