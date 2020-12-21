<template>
  <div class="err-layout flex layout-col">
    <Header :show-search-box="true" />
    <nuxt class="ml-5" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  components: {
    Header,
  },
}
</script>
