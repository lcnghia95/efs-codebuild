<template>
  <div class="w-1000 flex mid bread-crumb" id="breadcrumb">
    <div v-for="(item, idx) in $store.state.bcRoutes" :key="'bread-crumb-' + idx"
         itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb">
      <GogoLink :target="getTarget(item)" itemprop="url" class="flex mid">
        <span itemprop="title">{{ $t(item.name || item.path ) }}</span>
        <AngleRight v-if="idx < $store.state.bcRoutes.length - 1" class="icon-sz" />
      </GogoLink>
    </div>
  </div>
</template>

<script>
import GogoLink from '@@/../components/link/GogoLink.vue'
import AngleRight from '@@/../components/icons/AngleRight.vue'
import i18n from '@@/lang/common/breadcrumbs02.json'
export default {
  components: {
    GogoLink,
    AngleRight,
  },
  i18n: {
    messages: i18n,
  },
  methods: {
    getTarget(item) {
      return item.target
        ? item.target
        : item.path
          ? item.path
          : { name: item.name }
    },
  },
}
</script>
<style lang="scss" scoped>
.bread-crumb {
  /deep/ .gogo-link {
    color: #333;
    font-size: 12px;
  }
  > div {
    flex: 0 0 auto;
    &:last-child {
      font-weight: bold;
      flex: 0 1 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .icon-sz {
    width: 12px;
    height: 13px;
  }
}
</style>
