<template>
  <a :href="data.detailUrl || '#'" class="aside-item pos-rel">
    <div class="coming-soon" v-if="data.isSoon">Coming soon...</div>
    <div class="flex">
      <div class="aside-item-image">
        <img :src="'/img/products/' + data.id" height="100%" />
      </div>
      <div class="pl-5">
        <div class="aside-item-name wrap-text" :title="data.name">
          {{ data.name }}
        </div>
        <Prices :prices="data.prices" class="aside-item-price" :is-vertical="true" />
      </div>
    </div>
    <div>
      <p class="aside-item-text mb-10" v-wrap-lines="3">{{ data.introduction }}</p>
    </div>
  </a>
</template>
<script>
import Prices from "./Prices.vue"
export default {
  props: {
    data: Object
  },
  components: {
    Prices
  }
}
</script>
<style lang="scss" scoped>
.aside-item {
  padding: 10px;
  transition: 0.3s;
  border-radius: 5px;
  width: 220px;
  display: block;
  cursor: pointer;
  text-decoration: none;
}
a:hover {
  box-shadow: 0 0 20px #ccc;
}
.aside-item-image {
  text-align: center;
  height: 55px;
  width: 55px;
  flex: 0 0 55px;
  margin-bottom: 8px;
}
.aside-item-name {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 0;
  width: 145px;
  flex: 0 0 145px;
}
.aside-item-price /deep/ {
  .co-red {
    font-size: 13px;
  }
  .old-price {
    font-size: 12px;
  }
}
.aside-item-text {
  font-size: 10px;
}
.coming-soon {
  background: #0024a9;
  width: 95%;
  height: 92%;
  position: absolute;
  opacity: 0.95;
  top: 5px;
  left: 5px;
  text-align: center;
  line-height: 100px;
  color: #ebf0ff;
  border-radius: 4px;
  box-shadow: 0 0 5px #0035f7;
  font-size: 14px;
}
</style>