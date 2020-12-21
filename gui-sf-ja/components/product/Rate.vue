<template>
  <div v-if="stars || alwayShow" class="flex gg-rating fs-13">
    <a class="rate-num cursor-pointer" @click="goReview" v-if="number || alwayShow">
      {{ (number || alwayShow) ? '(' + (number || 0) + ')' : '' }}
    </a>
    <span class="star cursor-pointer" v-for="i in 5" :key="'rate' + i" @click="onRate(i)" :class="[check(i), { 'no-rate': options.readOnly }]"/>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'valueModel',
    event: 'input',
  },
  props: {
    stars: Number,
    number: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => ({
        readOnly: true,
      }),
    },
    target: [String, Number],
    alwayShow: {
      type: Boolean,
      default: false,
    },
    valueModel: Number,
  },
  watch: {
    valueModel(val) {
      this.istars = val
    },
    stars(val) {
      this.istars = val
    },
  },
  data() {
    return {
      istars: this.stars || 0,
    }
  },
  methods: {
    buildUrl(val) {
      if (Number.isInteger(Number(val))) {
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
    onRate(i) {
      if (!this.stars) {
        this.istars = 5 - i + 1
      }
      this.$emit('input', this.istars)
    },
    goReview() {
      if (!this.langSupported().includes(this.$i18n.locale)) {
        location.href = this.buildUrl(this.target)
      }
    }
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
