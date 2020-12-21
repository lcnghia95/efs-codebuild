<template>
  <div class="flex flex-wrap ctn">
    <div class="time-item"
         :class="{selected: selected == index }"
         @click="handleSelectedTime(index, time)"
         v-for="(time, index) in times" :key="time.value"
    >
      {{ time.name }}
    </div>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/markets-charts-time-tab.json'
export default {
  i18n: {messages: i18n},
  model: {
    prop: 't',
    event: 'tChanged',
  },
  props: {
    t: {
      type: [String, Number],
      default: 'M1',
    },
  },
  data() {
    return {
      selected: this.$route.params.t - 1 || 0,
      times: [
        {
          key: 'M1',
          name: this.$t('M1'),
        },
        {
          key: 'M5',
          name: this.$t('M5'),
        },
        {
          key: 'M15',
          name: this.$t('M15'),
        },
        {
          key: 'M30',
          name: this.$t('M30'),
        },
        {
          key: 'H1',
          name: this.$t('H1'),
        },
        {
          key: 'H4',
          name: this.$t('H4'),
        },
        {
          key: 'D1',
          name: this.$t('D1'),
        },
        {
          key: 'W1',
          name: this.$t('W1'),
        },
      ]
    }
  },
  methods: {
    handleSelectedTime(index, time) {
      this.selected = index
      this.$emit('tChanged', {index, key: time.key})

    }
  }
}
</script>

<style lang="scss" scoped>
.ctn {
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
  background: #fff;
  .time-item {
    width: 25%;
    flex: 0 0 25%;
    text-align: center;
    border: 1px solid #e8e5e3;
    color: #b3b3b3;
    line-height: 40px;
    &:nth-child(1) {
      border-top-left-radius: 5px;
    }
    &:nth-child(4) {
      border-top-right-radius: 5px;
    }
    &:nth-child(5) {
      border-bottom-left-radius: 5px;
    }
    &:nth-child(8) {
      border-bottom-right-radius: 5px;
    }
    &.selected {
      background: #434343;
      color: #fff;
    }
  }
}
</style>