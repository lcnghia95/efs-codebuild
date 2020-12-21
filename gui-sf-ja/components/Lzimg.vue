<template>
  <img class="lazy" :alt="alt" style="display: inline-block;" @click="$emit('click')" />
</template>

<script>
export default {
  props: {
    alt: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (this.$el.dataset.src == undefined) {
      return
    }
    if ('IntersectionObserver' in window) {
      let observer = new IntersectionObserver(
        entries => {
          let e = entries[0]
          if (e.isIntersecting) {
            e.target.src = e.target.dataset.src
            e.target.classList.remove('lazy')
            observer.unobserve(this.$el)
          }
        },
        {
          root: null,
          rootMargin: '50px',
          threshold: 0,
        }
      )
      observer.observe(this.$el)
    } else {
      this.$el.src = this.$el.dataset.src
      this.$el.classList.remove('lazy')
    }
  },
}
</script>

<style scoped lang="scss">
img {
  border: none; 
}
.lazy {
  visibility: hidden;
}
</style>

<docs>
  ```vue
  <template>
    <Lzimg data-src="/img/assets/pc/common/footer/img01.jpg" style="width: 124px; height: 45px" alt="金融庁"></Lzimg>
  </template>
  ```
</docs>
