<template>
  <div class="flex gg-rating fs-13">
    <span class="star cursor-pointer no-rate" v-for="i in 5" :key="'rate' + i" :class="check(i)"></span>
  </div>
</template>

<script>
export default {
  props: {
    stars: Number,
  },
  data() {
    return {
      istars: this.stars || 0,
    }
  },
  methods: {
    buildUrl(val) {
      if (Number.isInteger(val)) {
        return `/review/detail/${val}`
      }
      return val || 'javascript:void(0)'
    },
    check(i) {
      let a = i + this.istars,
        b = i + parseInt(this.istars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
  },
}
</script>


<style lang="scss" scoped>
$active: #fcd605;
$deactive: #c1c1c1;
.gg-rating {
  color: $deactive;
  flex-direction: row-reverse;
  justify-content: flex-end;
}
.gg-rating .star:hover ~ .star {
  color: $active;
}
.star {
  color: $deactive;
  display: inline-block;
  &:hover {
    color: $active;
  }
}
.star::before {
  content: '\2605';
}
.full {
  color: $active;
}
.half {
  position: relative;
}
.half::after {
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
  content: '\2605';
  color: $active;
  width: 50%;
}
.no-rate {
  pointer-events: none;
}
.rate-num /deep/ {
  a {
    color: #04c;
  }
}
</style>
