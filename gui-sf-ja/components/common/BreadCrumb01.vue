<template>
  <ol class="w-1000 flex mid bread-crumb p-0" itemscope itemtype="https://schema.org/BreadcrumbList" v-if="bcRoutes.length">
    <li v-for="(item, idx) in bcRoutes" :key="'bread-crumb-' + idx"
        itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a :href="`${url}${getHref(item)}`" class="flex mid" itemtype="https://schema.org/Thing" itemprop="item">
        <span itemprop="name">{{ $t(item.name || item.path ) }}</span>
        <AngleRight v-if="idx < bcRoutes.length - 1" class="icon-sz" />
      </a>
      <meta itemprop="position" :content="idx + 1" >
    </li>
  </ol>
</template>

<script>
import AngleRight from '@@/../components/icons/AngleRight.vue'
import i18n from '@@/lang/common/breadcrumbs02.json'

export default {
  components: {
    AngleRight,
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      url: process.env.GOGO_URL,
    }
  },
  computed: {
    bcRoutes() {
      return this.$store.state.bcRoutes || []
    }
  },
  methods: {
    getHref(item) {
      let href = item.target
        ? item.target
        : item.path
          ? item.path
          : { name: item.name }
      if (typeof href === 'string') {
        return href
      }
      href = this.$router.resolve(href)
      return href.href
    }
  }
}
</script>

<style lang="scss" scoped>
.bread-crumb {
  list-style-type: none;
  a {
    color: #333;
    font-size: 12px;
  }
  > li {
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
