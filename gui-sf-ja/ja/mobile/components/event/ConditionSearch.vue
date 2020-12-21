<template>
  <div class="p-10 w-full" style="border-bottom: 1px solid #bdbdbd;">
    <div class="flex space-between mid date-input-ctn mb-10 pb-10">
      <div class="flex date-input-item space-between pos-rel">
        <input type="date" v-model="mDateFrom" />
        <div class="date-txt" :style="{ color:mDateFrom ? '#000' : '#b2b2b2' }">{{ mDateFrom ? formatTime(new Date(mDateFrom)/1000, 7) : $t(4) }}</div>
        <div class="date-btn flex mid center">
          <CalendarAlt />
        </div>
      </div>
      <div style="font-size: 0.8em; font-weight: bold;">-</div>
      <div class="flex date-input-item space-between pos-rel">
        <input type="date" v-model="mDateTo" />
        <div class="date-txt" :style="{ color:mDateTo ? '#000' : '#b2b2b2' }">{{ mDateTo ? formatTime(new Date(mDateTo)/1000, 7) : $t(4) }}</div>
        <div class="date-btn flex mid center">
          <CalendarAlt />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap space-between" style="border-bottom: 1px solid #bdbdbd;">
      <div class="event-rule-item wrap-text"
           :class="{ selected: item.selected }"
           v-for="(item, id) in events" 
           @click="events[id].selected = !events[id].selected"
           :key="item.text"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="pos-rel">
      <input ref="input" type="text" class="event-search-input"
             v-model="w" 
             @focus="isInputFocus = true" 
             :style="{'padding-right': isInputFocus ? '35px' : ''}" 
             @blur="isInputFocus = false" 
             :placeholder="$t(7)" 
             @keyup.enter="searchHandler"
      />
      <transition name="clean-btn">
        <strong class="pos-abs clean-btn" @click="handleCleanInput" v-if="isInputFocus">⨉</strong>
      </transition>
    </div>
    <div class="event-search-btn mb-10" @click="searchHandler">{{ $t(8) }}</div>
    <div @click="$emit('back')" class="mt-25 text-center" style="font-size: 16px; margin-bottom: 8px;">{{ $t(5) }}</div>
  </div>
</template>

<script>
import CalendarAlt from '@@/../components/icons/CalendarAlt.vue'
import i18n from '@@/lang/components-mobile/event-condition-search.json'

export default {
  i18n: {
    messages: i18n,
  },
  components: {
    CalendarAlt,
  },
  props: {
    selectedCondition: {
      type: Object,
      default() { return {} },
    },
  },
  computed: {
    categoriesQuery() {
      return Object.keys(this.events).filter(key => {
        return this.events[key].selected === true
      })
    },
  },
  data() {
    return {
      mDateFrom: this.selectedCondition.from || null,
      mDateTo: this.selectedCondition.to || null,
      w: this.selectedCondition.keywords || '',
      isInputFocus: false,
      events: Object.keys(this.$t('categories')).reduce((result, value) => {
        let selected = (this.selectedCondition.categories || '').split(',').includes(value)
        result[value] = {
          text: this.$t('categories')[value],
          selected: selected || false,
        }
        return result
      }, {}),
    }
  },
  methods: {
    searchHandler() {
      this.$emit('onSearch', {
        dateFrom: this.mDateFrom,
        dateTo: this.mDateTo,
        w: this.w,
        cat: this.categoriesQuery,
      })
    },
    handleCleanInput() {
      this.w = ''
      $(this.$refs.input).focus()
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 40px;
.date-input-ctn {
  border-bottom: 1px solid #dfdfdf;
  .date-input-item {
    border-radius: 5px;
    width: calc(50% - 10px);
    overflow: hidden;
    background: #fff;
  }
  input {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    height: $size;
    width: calc(100% - 40px);
    font-size: 15px;
    border: 1px solid #b2b2b2;
    background: #fff;
    position: absolute;
    opacity: 0;
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .date-txt {
    line-height: 40px;
    font-size: 14px;
    text-align: left;
    width: 100%;
    box-shadow: inset 0 0 5px #b2b2b2;
    color: #000;
    padding-left: 10px;
  }
  .date-btn {
    height: $size;
    width: $size;
    flex: 0 0 $size;
    background: #bdbdbd;
    color: #fff;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    .icon-cls {
      height: 29px;
      width: 29px;
      margin: auto;
    }
  }
}
.event-rule-item {
  height: 40px;
  width: 30%;
  min-width: 90px;
  line-height: 40px;
  padding: 0 8px;
  border-radius: 5px;
  background: #fff;
  color: #ff8400;
  box-shadow: inset 0 -3px 4px 0 #d1bcbc,
    0 0 5px 0 #dcdcdc;
  border: 1px solid #bdbdbd;
  transition: all 0.3s;
  margin-bottom: 7px;
  font-size: 16px;
  font-weight: bold;
  &:active, &.selected {
    background: #ff8400;
    color: #fff;
    box-shadow: inset 2px 2px 5px 3px #da7100;
  }
}
.event-search-input {
  width: 100%;
  margin: 10px 0;
  height: 45px;
  border-radius: 5px;
  box-shadow: inset 0 0 5px #ababab;
  border: 1px solid #dbdbdb;
  padding: 10px;
  color: #000;
  transition: all 0.3s;
  &::placeholder {
    color: #b2b2b2;
  }
}
.clean-btn {
  top: calc(50% - 10px);
  right: 12px;
  color: #ff3b3b;
}
.event-search-btn {
  height: 45px;
  background: #ff8400;
  border-radius: 8px;
  line-height: 45px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 5px 0 0 #b84d03;
  &:active {
    box-shadow: 0 1px 0 0;
    transform: translateY(5px);
  }
}
.clean-btn-enter-active, .clean-btn-leave-active {
  transition: opacity 0.8s ease;
}
.clean-btn-enter-to, .clean-btn-leave-to {
  opacity: 1;
}
.clean-btn-enter, .clean-btn-leave {
  opacity: 0;
}
</style>