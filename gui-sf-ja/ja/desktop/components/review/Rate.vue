<template>
  <div class="flex gg-rating">
    <span class="rate-num" v-if="number">
      {{ '(' + (number ? (number || 0) : '') + ' ' + this.$t('1') + ')' }}
    </span>
    <span class="star-num pl-5 pr-5">{{ roundedStars }}</span>
    <span class="star no-rate" v-for="i in 5" :key="'rate' + i" :class="check(i)"></span>
  </div>
</template>

<script>
import i18n from '@@/lang/components-desktop/review-rate.json'
export default {
  i18n: {
    messages: i18n,
  },
  props: {
    stars: Number,
    number: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      istars: this.stars || 0,
    }
  },
  methods: {
    check(i) {
      let a = i + this.istars,
        b = i + parseInt(this.istars)
      if (a > 5) {
        return b === 5 ? { half: true } : { full: true }
      }
    },
  },
  computed: {
    roundedStars() {
      return (this.stars || 0).toFixed(1)
    }
  }
}
</script>


<style lang="scss" scoped>
$active: #fcd605;
$deactive: #c1c1c1;
.gg-rating {
  color: $deactive;
  flex-direction: row-reverse;
  justify-content: flex-end;
  font-size: 28px;
}
.gg-rating .star:hover ~ .star {
  color: $active;
}
.star {
  color: $deactive;
  display: inline-block;
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
.rate-num {
  color: #2d2d2d;
  font-size: 13px;
  padding-top: 17px;
}
.star-num {
  color: #f00;
}
</style>
