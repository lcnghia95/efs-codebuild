<template>
  <table class="w-full economics">
    <thead>
      <tr class="header w-full co-white">
        <th width="13%">{{ $t('1') }}</th>
        <th width="20%">
          {{ $t('2') }}
          <div class="break-line"></div>
          {{ $t('3') }}
        </th>
        <th width="25%">{{ $t('4') }}</th>
        <th width="14%">{{ $t('5') }}</th>
        <th width="14%">{{ $t('6') }}</th>
        <th width="14%">{{ $t('7') }}</th> 
      </tr>
    </thead>
    <tbody>
      <tr v-if="!Object.keys(data).length"><td colspan="6" class="bottom-left border-bottom no-data p-10">{{ $t('8') }}</td></tr>
      <template v-for="(item, index, i) in data" v-else>
        <tr :key="'trrowspan' + index" :id="'tr-scroll-' + data[index][0].CheckDate" :class="{'border-bottom' : Object.keys(data[index]).length == 1}">
          <td
            style="background: #fff;"
            :rowspan=" data[index].length"
            class="text-center pl-10 pr-10 border-bottom"
            :class="{'bottom-left' : Object.keys(data).length - 1 == i}"
          >
            {{ formatTime(index,22) }}
          </td>
          <td class="text-center">
            {{ formatTime( data[index][0].CheckDate, 17) }}
            <div class="flex mid center">
              <star
                v-for="i in (parseInt( data[index][0].Value) || 0)"
                :key="'star-' + index + '0' + i"
              />
            </div>
          </td>
          <td class="p-5">
            <div style="height: 2.8em; overflow: hidden;" v-wrap-lines="2">
              <a :href="'/markets/economics/' + data[index][0].ID" class="no-dec pos-rel economic-img-text">
                <span class="pos-abs">
                  <img
                    :src="'https://fx-on.com/img/flags/' + data[index][0].Country + '.gif'"
                    style="width: 17px;"
                    alt=""
                  />
                </span>
                <span class="co-black ho-change no-dec ml-5" style="white-space: pre-wrap;">&nbsp;&nbsp;&nbsp;{{ data[index][0].Name }}</span>
              </a>
            </div>
          </td>
          <td class="text-center">{{ data[index][0].LastTime || '-' }}</td>
          <td class="text-center">{{ data[index][0].ThisTime || '-' }}</td>
          <td class="text-center">{{ data[index][0].Result || '-' }}</td>
        </tr>
        <template v-for="(row, idx) in data[index]">
          <tr v-if="idx > 0" :key="row.ID" :id="'tr-scroll-' + row.CheckDate" :class="{'border-bottom' : Object.keys(data[index]).length - 1 == idx}">
            <td class="text-center">
              {{ formatTime(row.CheckDate, 17) }}
              <div class="flex mid center">
                <star v-for="i in parseInt(row.Value || 0)" :key="'star-' + index + idx + i" />
              </div>
            </td>
            <td class="p-5">
              <div style="height: 2.8em; overflow: hidden;" v-wrap-lines="2">
                <a :href="'/markets/economics/' + row.ID" class="no-dec pos-rel">
                  <span class="pos-abs">
                    <img :src="'https://fx-on.com/img/flags/' + row.Country + '.gif'" alt="" style="width: 17px;" />
                  </span>
                  <span class="co-black ho-change no-dec ml-5" style="white-space: pre-wrap;">&nbsp;&nbsp;&nbsp;{{ row.Name }}</span>
                </a>
              </div>
            </td>
            <td class="text-center">{{ row.LastTime || '-' }}</td>
            <td class="text-center">{{ row.ThisTime || '-' }}</td>
            <td class="text-center">{{ row.Result || '-' }}</td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
<script>
import i18n from '@@/lang/components-mobile/market-economic-table.json'
import Star from '@@/../components/icons/Star.vue'
export default {
  components: {
    Star,
  },
  i18n: {
    messages: i18n
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    markScroll: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  mounted() {
    if (this.markScroll) {
      $('html, body').animate(
        {
          scrollTop: $('#tr-scroll-' + this.markScroll).offset().top - 10,
        },
        800
      )
    }
  },
}
</script>
<style lang="scss" scoped>
$star: #f90;
.break-line {
  height: 1px;
  background-color: #700000;
  margin-top: 2px;
  margin-bottom: 2px;
}
.economics {
  table-layout: fixed;
  border-collapse: separate !important;
  font-size: 1.4rem;
  th {
    word-break: break-word;
    background-color: #a40000;
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    min-width: 15px;
    font-weight: normal;
    font-size: 1.2rem;
    &:last-child {
      border-top-right-radius: 5px;
    }
    &:first-child {
      border-top-left-radius: 5px;
    }
    &:not(:first-child) {
      border-left: 1px solid #700000;
    }
  }
  td {
    word-break: break-all;
    border-left: 1px solid #d0d0d0;
    &:last-child {
      border-right: 1px solid #d0d0d0;
    }
    /deep/ .icon-cls {
      color: $star;
      height: 20px;
      width: 17px;
    }
  }
  .w-110 {
    width: 110px;
  }
  tr {
    background: #fff;
    &:last-child {
      td {
        border-bottom: 1px solid #d0d0d0;
        &:last-child {
          border-bottom-right-radius: 5px;
        }
      }
    }
  }
  tr:nth-child(odd) {
    background: #f2f2f2;
  }
  .bottom-left {
    border-bottom-left-radius: 5px;
  }
  .border-bottom {
    border-bottom: 1px solid #d0d0d0;
    td {
      border-bottom: 1px solid #d0d0d0;
    }
  }
  .no-data {
    text-align: center;
  }
}
.co-black {
  color: #000;
}
</style>