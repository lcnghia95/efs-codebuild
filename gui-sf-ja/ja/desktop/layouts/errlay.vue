<template>
  <div class="err-layout flex layout-col">
    <Header01 />
    <Menu />
    <nuxt class="w-1000" />
  </div>
</template>

<script>
import Header01 from '@@/../components/header/Header01.vue'
import Menu from '@/components/Menu.vue'

export default {
  components: { Header01, Menu },
}
</script>
