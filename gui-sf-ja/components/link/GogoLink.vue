<template>
  <a :href="href" class="cursor-pointer gogo-link">
    <slot />
  </a>
</template>
<script>
export default {
  props: {
    target: {
      type: [String, Object],
      default: '/',
    },
  },
  watch: {
    target(val) {
      if (typeof val === 'string') {
        this.href = val
      }
    },
  },
  data() {
    let href = this.target
    if (typeof href === 'string') {
      return { href }
    }

    href = this.$router.resolve(this.target)
    return {
      href: href.href,
    }
  },
}
</script>

<docs>
  ```vue
  <template>
    <GogoLink target="http://google.com">
      GoGoLink
    </GogoLink>
  </template>
  <script>
  export default {}
  </script>
  ```
</docs>
