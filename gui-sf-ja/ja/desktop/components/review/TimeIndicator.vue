<template>
  <title02 fa="clock-o" :c-style="{ marginRight: '10px', fontSize: '20px', color: '#999999', background: 'none', width: '20px', height: '20px' }" :title="formatTime(time || 0)" :href="href"/>
</template>

<script>
import Title02 from '@/components/review/Title02.vue'
export default {
  components: {
    Title02,
  },
  props: {
    time: Number,
    href: String,
  },
}
</script>
