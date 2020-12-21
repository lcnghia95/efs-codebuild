<template>
  <div class="col-r--ni">
    <div class="tit--nh06 fs-13 mb-5">{{ title }}</div>
    <ul class="nav nav-tabs fs-12">
      <li :class="{ active : tab === 0 }"><a class="tab__a" data-toggle="tab" href="#tab0" @click="changeTab(0)">{{ tabList[0].text }}</a></li>
      <li><a class="tab__a" data-toggle="tab" href="#tab1" @click="changeTab(1)">{{ tabList[1].text }}</a></li>
      <li><a class="tab__a" data-toggle="tab" href="#tab2" @click="changeTab(2)">{{ tabList[2].text }}</a></li>
      <li><a class="tab__a" data-toggle="tab" href="#tab3" @click="changeTab(3)" v-if="tabList[3]">{{ tabList[3].text }}</a></li>
    </ul>
    <section class="sec__h06 p-10">
      <navi-horizontal06 v-for="(item, i) in data[tab]" :type="type" :key="i + 'mpUj2'" :item="item" />
    </section>
  </div>
</template>
<script>
import NaviHorizontal06 from '@/components/product/navi/NaviHorizontal06.vue'
export default {
  props: {
    title: String,
    tabList: {
      type: Array,
      default: () => {
        return ['', '', '', '']
      },
    },
    data: Array,
    type: Number,
  },
  components: {
    NaviHorizontal06,
  },
  data() {
    return {
      tab: 0,
    }
  },
  methods: {
    changeTab(_tab) {
      this.tab = _tab
      console.log(`${location.origin}/tab/${this.tabList[_tab].tab}`)
      this.sendPageView()
    },
  },
}
</script>
<style lang="scss" scoped>
.col-r--ni {
  .nav-tabs {
    display: flex;
    & > li {
      flex: 1 0 25%;
    }
  }
  .tit--nh06 {
    margin-top: 8px;
  }
  .sec__h06 {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .tab__a {
    text-align: center;
    border-radius: 0;
    margin-right: 0;
    padding: 7px 0 3px 0;
    color: #2d2d2d;
  }
}
</style>
