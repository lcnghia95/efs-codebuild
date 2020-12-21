<template>
  <div v-if="stars" class="flex gg-rating fs-13">
    <span :key="i" class="star cursor-pointer" v-for="i in 5" :class="[check(i)]"/>
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
</style>
