<template>
  <Common>
    <FixMenu/>
    <nuxt class="body" />
  </Common>
</template>

<script>
import FixMenu from '@/components/systemtrade/FixMenu.vue'
import Common from './common.vue'

export default {
  components: {
    Common,
    FixMenu,
  },
}
</script>
