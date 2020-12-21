<template>
  <div class="flex layout-col navi-left-menu">
    <div class="status-list flex mid">
      <span @click="handleSelectPlan( -1)" :class="{selected: selectedPlan === -1}">すべて</span>
      <span @click="handleSelectPlan(1)" :class="{selected: selectedPlan === 1}">有料</span>
      <span @click="handleSelectPlan(0)" :class="{selected: selectedPlan === 0}">無料</span>
    </div>
    <div class="divider"></div>
    <div class="category inline-flex mt-30">
      <span>カテゴリ:</span>
      <div class="flex layout-col list-item">
        <span :class="{selected: !selectedCategory}" @click="handleSelectCategory(0)">すべて </span>
        <span v-for="category in categories" :key="category.id" @click="handleSelectCategory(category.id)" :class="{selected: selectedCategory === category.id}">
          {{ category.categoryName }}
        </span>
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
export default {
  name: 'navi-left-menu',
  data() {
    const query = this.$route.query || {},
        plan = +query.plan
    return {
      selectedPlan: plan == 0 ? 0 : (plan || -1),
      selectedCategory: +query.category || 0
    }
  },
  computed: {
    categories() {
      return this.$store.getters['finance/naviCategories'] || []
    },
  },
  methods: {
    handleSelectPlan(value) {
      const {plan} = this.$route.query || {}
      if (value === plan) return
      this.selectedPlan = value
      this.$emit('set-plan', value)
    },
    handleSelectCategory(value) {
      const {category} = this.$route.query || {}
      if (value === category) return
      this.selectedCategory = value
      this.$emit('set-category', value)
    }
  }
}
</script>

<style scoped lang="scss">
.navi-left-menu {
  font-size: 15px;
  padding-left: 50px;
  .divider {
    height: 1px;
    width: 100%;
    margin: 10px 0;
    background-color: #F5F5F5;
  }
  * {
    color: #777777;
    &.selected {
      font-weight: bold;
    }
  }
  .status-list {
    margin-top: 40px;
    span {
      margin-right: 10px;
      height: 36px;
      cursor: pointer;
      width: 52px;
      text-align: center;
      &:hover {
        color: #2C2C2C;
      }
    }
  }
  .category {
    .list-item {
      padding-left: 10px;
      span {
        cursor: pointer;
        height: 2em;
        &:hover {
          color: #2C2C2C;
        }
      }
    }
  }
}
</style>
