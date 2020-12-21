<template>
  <div class="flex space-between product-review-02 border-radius-5 p-15 pr-0 mt-10 mb-10">
    <div class="flex w-full">
      <template v-if="isChart && data.chart && data.chart.length != 0">
        <div class="border-left border-bottom size-90">
          <a :href="data.detailUrl">
            <image-chart :chart="{ data: data.chart || []}" :option="{width: 89, height: 89}" />
          </a>
        </div>
      </template>
      <template v-else>
        <a :href="data.detailUrl" class="size-90">
          <img v-if="data.productId" class="size-90 shadow w-full" :src="'/img/products/'+data.productId+'/small'" alt="" />
        </a>
      </template>
      <div class="ml-15">
        <div class="w-full">
          <a :href="'/review/detail/'+data.productId" class="review-title-link">
            <p :title="data.reviewTitle" class="short-des wrap-text cursor-pointer m-b-5">
              <b>{{ data.reviewTitle }}</b>
            </p> 
          </a>
          <rate :stars="data.reviewStars || 0" class="rate" />
        </div>
        <a :href="'/review/detail/'+data.productId" class="review-title-link">
          <p v-if="data.reviewContent" :title="data.reviewContent" class="short-content wrap-text">{{ data.reviewContent }}</p>
        </a>
        <div class="user-date">
          <div class="flex" v-if="data.reviewUserId">
            <Title02 :href="'/users/'+data.reviewUserId+'/review'" :image-src="'/img/users/'+data.reviewUserId+'/tiny'" :c-style="{ marginRight: '10px', fontSize: '20px', color: '#999999', background: 'none'}" :title="data.reviewNickName" />
            <time-indicator class="ml-40" :time="data.reviewPublishedDate" />
          </div>
        </div>
      </div>
    </div>
    <a :href="'/review/detail/'+data.productId" class="flex mid fs-25 glyphicon glyphicon-menu-right" aria-hidden="true"></a>
  </div>
</template>

<script>
import Title02 from '@/components/review/Title02.vue'
import TimeIndicator from '@/components/review/TimeIndicator.vue'
import Rate from '@@/../components/product/Rate.vue'
export default {
  components: {
    Title02,
    TimeIndicator,
    Rate,
  },
  props: {
    showTitleImg: {
      type: Boolean,
      default: true,
    },
    isChart: {
      type: Boolean,
      default: true,
    },
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
$color64: #f5f5f5;
$color69: #fcfcfc;
.fs-25 {
  font-size: 25px;
}
.border-radius-5 {
  border-radius: 5px;
}
.product-review-02 {
  background: $color69;
  border: solid 4px #edf2f2;
  height: 145px;
  text-decoration: none;
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
    color: $color24;
    margin-top: 12px;
    margin-bottom: 10px;
    width: 490px;
  }
  &:hover {
    border: solid 4px #85bed4;
    background-color: $color64;
  }
  .review-title-link {
    text-decoration: none;
    /deep/ .short-des {
      color: #6ac4de;
      margin-bottom: 5px;
    }
    &:hover {
      /deep/ .short-des {
        text-decoration: underline;
      }
    }
  }
  .user-date {
    text-decoration: none;
  }
}
</style>
