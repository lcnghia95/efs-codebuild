<template>
  <div class="mt-20 fs-12 text-center pb-40">
    <table class="co-black w-full">
      <thead>
        <tr class="title-table" v-show="headers.length">
          <th class="w-60 text-center pt-5 pb-5" v-for="(item,index) in headers" :key="index">
            <div class="flex center cursor-pointer" @click="onClickSort(index, !up)">
              <span v-html="item" class="fs-11"/>
              <div v-if="index != 7 && index != 0" class="flex layout-col center">
                <AngleUp :class="{ 'deactive': up === false && sortIndex === index }"/>
                <AngleDown :class="{ 'deactive': up === true && sortIndex === index}"/>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="h-50" v-for="(company,i) in sortedList" :key="i" v-if="headers.length">
          <td :style="{ 'min-width': '100px' }">
            <a :href="'/companies/' + company.id">
              <img v-if="company.id" :title="company.name" height="37" width="160" :src="'/img/companies/' + company.id + '/thumbnail'" alt="">
            </a>
          </td>
          <template v-if="company.data">
            <td v-for="(item, i) in company.data" :key="i">{{ intFormat(item) }}</td>
          </template>
          <template v-else>
            <td v-for="item in headers.length" :key="item">-</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import AngleUp from '@@/../components/icons/AngleUp.vue'
import AngleDown from '@@/../components/icons/AngleDown.vue'
export default {
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    data: Array,
  },
  components: {
    AngleUp,
    AngleDown,
  },
  data() {
    return {
      up: false,
      sortIndex: 1,
      sortedList: this.data,
    }
  },
  methods: {
    onClickSort(index, up) {
      if (!index || index == 7) {
        return
      }
      this.up = up
      this.sortIndex = index
      this.sortedList = this.data.slice().sort((a, b) => {
        if (up) {
          return b.data[index - 1] - a.data[index - 1]
        } else {
          return a.data[index - 1] - b.data[index - 1]
        }
      })
    },
    intFormat(item) {
      if ((!item && item !== 0) || item === '-') {
        return '-'
      }
      let n = parseFloat(item)
      if (Number(n) === n && n % 1 === 0) {
        return n.toFixed(1)
      }
      return n ? n.toFixed(1) : 0
    },
  },
}
</script>
<style lang="scss" scoped>
.icon-cls {
  width: 10px;
  height: 10px;
  line-height: 4pt;
}
table {
  border-collapse: collapse;
}
th {
  background-color: #e7e7e7;
  border: 1px solid white;
}
td {
  border: 1px solid white;
  font-size: 14px;
}
tr:nth-child(odd) {
  background-color: #eee;
}
tr:nth-child(even) {
  background-color: #f8f8f8;
}
.co-black {
  color: black;
}
.title-table {
  th {
    &:nth-child(even) {
      background-color: #dddedf;
    }
    span {
      &.fs-11 {
        line-height: 12px;
      }
      &.company-arrow {
        padding: 6px 0 0 5px;
      }
    }
  }
}
.h-50 {
  height: 50px;
}
.deactive {
  color: gray;
}
</style>
