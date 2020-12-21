<template>
  <div class="like">
    <svg
      v-if="liked"
      @click="$emit('onLike')"
      id="a22ba86a-e842-44f2-8274-74f78ffb0da3"
      :style="`width: ${width}px; ${height}px;`"
      data-name="レイヤー 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
    >
      <path
        class="a56f4ecd-4820-4a83-a739-ea1e65aa8a71"
        d="M63.84,32.4c-2.16,0-17.18.15-17.18.15-2.27,0-3.13,0-3-2.82C43.82,20,43.1,9.51,35.41,9.51,33.56,12.17,35,28,30,31.3a40.71,40.71,0,0,1-6.93,3.45V33.41a3.68,3.68,0,0,0-3.68-3.68H13.27a3.68,3.68,0,0,0-3.68,3.68V66.82a3.67,3.67,0,0,0,3.68,3.67h6.12a3.67,3.67,0,0,0,3.68-3.67V63.33A12.84,12.84,0,0,0,29.12,65h25c4.27,0,7.4-.05,8.26-3.48s5.55-19.88,6.55-24.12C69.78,33.71,68.68,32.4,63.84,32.4Z"
      />
      <rect
        class="a91dc2cd-4932-45f5-a9fa-7d0717a48dc6"
        x="9.59"
        y="29.73"
        width="13.48"
        height="40.76"
        rx="3.22"
      />
    </svg>
    <svg
      v-else
      @click="$emit('onLike')"
      id="f208cf4d-d7cc-4a74-a56a-0522f7c96191"
      data-name="レイヤー 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      :style="`width: ${width}px; ${height}px;`"
    >
      <rect
        class="f12dca3f-f1eb-42b2-8769-431510ea084c"
        x="9.59"
        y="29.73"
        width="13.48"
        height="40.76"
        rx="1.6"
      />
      <path
        class="f12dca3f-f1eb-42b2-8769-431510ea084c"
        d="M63.84,32.4c-2.16,0-17.18.15-17.18.15-2.27,0-3.13,0-3-2.82C43.82,20,43.1,9.51,35.41,9.51,33.56,12.17,35,28,30,31.3a40.71,40.71,0,0,1-6.93,3.45V33.41a3.68,3.68,0,0,0-3.68-3.68H13.27a3.68,3.68,0,0,0-3.68,3.68V66.82a3.67,3.67,0,0,0,3.68,3.67h6.12a3.67,3.67,0,0,0,3.68-3.67V63.33A12.84,12.84,0,0,0,29.12,65h25c4.27,0,7.4-.05,8.26-3.48s5.55-19.88,6.55-24.12C69.78,33.71,68.68,32.4,63.84,32.4Z"
      />
    </svg>
    <span class="like-count ml-5" v-if="count">{{
      formatCountNumber(+count, 1)
    }}</span>
  </div>
</template>
<script>
import Like from "@@/../components/icons/Like.vue";

export default {
  name: "like-count",
  components: {
    Like
  },
  props: {
    count: {
      type: Number,
      default: 0
    },
    liked: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 25
    },
    height: {
      type: [Number, String],
      default: 25
    }
  },
  methods: {
    formatCountNumber(num, digits) {
      const si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      let i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (
        (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.f12dca3f-f1eb-42b2-8769-431510ea084c {
  fill: none;
  stroke: #757575;
  stroke-miterlimit: 10;
  stroke-width: 5.02px;
}
.a56f4ecd-4820-4a83-a739-ea1e65aa8a71,
.a91dc2cd-4932-45f5-a9fa-7d0717a48dc6 {
  fill: #323333;
}
.a91dc2cd-4932-45f5-a9fa-7d0717a48dc6 {
  stroke: #fff;
  stroke-miterlimit: 10;
  stroke-width: 2px;
}
.like {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #757575;
  min-width: 50px;
  svg {
    cursor: pointer;
  }
  .like-count {
    line-height: 30px;
  }
}
</style>
