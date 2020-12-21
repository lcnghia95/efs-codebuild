<template>
  <div class="navi-left-menu-mobile p-15 flex w-full">
    <div class="plan-tab btn-group mb-20 mr-20" role="group">
      <button type="button" class="all btn" @click="handleSelectPlan( -1)" :class="{selected: selectedPlan === -1}">すべて</button>
      <button type="button" class="all btn" @click="handleSelectPlan( 1)" :class="{selected: selectedPlan === 1}">有料</button>
      <button type="button" class="all btn" @click="handleSelectPlan( 0)" :class="{selected: selectedPlan === 0}">無料</button>
    </div>
    <div class="dropdown mb-20">
      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ currentCategory.categoryName || 'すべてのカテゴリ' }}
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dLabel">
        <li :class="{selected: !selectedCategory}" @click="handleSelectCategory(0)">すべて</li>
        <li v-for="category in categories" :key="category.id" @click="handleSelectCategory(category.id)" :class="{selected: selectedCategory === category.id}">
          {{ category.categoryName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navi-left-menu-mobile',
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
    currentCategory() {
      return this.categories.find(cg => cg.id === this.selectedCategory) || {}
    }
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
.navi-left-menu-mobile {
  padding-top: 35px;
  background-color: #F5F5F5;
  flex-wrap: wrap;
  display: none;
  button {
    outline: none;
    &:active {
      outline-offset: unset;
    }
  }
  .plan-tab {
    button {
      border: 1.5px solid #A9A9A9;
      color: #BFBFBF;
      background: white;
      &.selected {
        background-color: #A9A9A9;
        color: white;
      }
    }
  }
  .dropdown {
    button {
      width: 177px;
      height: 34px;
      color: #595959;
      border: 1px solid #A9A9A9;
      background: white;
      border-radius: 4px;
    }
    ul {
      width: 177px;
      li {
        line-height: 30px;
        padding-left: 15px;
        &.selected {
          background: #c9c9c9;
          color: white;
        }
      }
    }
  }
}
</style>
