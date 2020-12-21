<template>
  <div class="calendar-cFjTE" ref="fullCalendar"></div>
</template>

<script>
import { Calendar } from '@fullcalendar/core'
import daygrid from '@fullcalendar/daygrid'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/core/main.css'

const localeMap = {
  en: 'en',
  ja: 'ja',
  th: 'th',
  ch: 'zh-cn',
  tw: 'zh-tw',
}
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    formatData(item) {
      if (parseInt(item.title)) {
        item.title = this.formatNumber(item.title)
      }
      return Object.assign({}, item, this.eventOption)
    },
    replaceTitle() {
      let hiddenEl = $('.fc-center h2'),
        curMonth = hiddenEl.text(),
        el = $('.fc-center p')

      if (el.length) {
        el.text(curMonth)
        return
      }

      hiddenEl.css('display', 'none')
      $(`<p>${curMonth}</p>`).insertAfter(hiddenEl)
    },
  },
  mounted() {
    let me = this,
      to,
      cal = new Calendar(me.$refs.fullCalendar, {
        plugins: [daygrid],
        defaultView: 'dayGridMonth',
        displayEventTime: false,
        height: 400,
        header: {
          left: null,
          center: 'prev title next',
          right: null,
        },
        locale: localeMap[this.$i18n.locale],
        contentHeight: 'auto',
        eventDataTransform(e) {
          return Object.assign({}, e, me.eventOption)
        },
        events(range, success) {
          to && clearTimeout(to)
          to = setTimeout(() => {
            let d = cal.getDate()
            me.GoGoHTTP.get(
              `/api/v3/surface/systemtrade/${me.type}/${
                me.id
              }/calendar`,
              {
                params: {
                  year: d.getFullYear(),
                  month: d.getMonth() + 1,
                },
              }
            ).then(e => {
              success((e || []).map(e => me.formatData(e)))
            })
          }, 500)
        },
      })
    cal.render()
    $('.fc-button').click(() => {
      this.replaceTitle()
    })
    this.replaceTitle()
  },
  data() {
    return {
      eventOption: {
        backgroundColor: 'transparent',
        color: 'red',
        textColor: '#333',
        borderColor: 'transparent',
        overlap: false,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar-cFjTE /deep/ {
  .fc-header-toolbar {
    margin-bottom: 0;
  }
  .fc-center {
    display: flex;
    align-items: center;
    p {
      font-size: 16px;
      line-height: 45px;
      margin-left: 0;
      margin-bottom: 0;
      font-weight: bold;
    }
  }
  .fc-prev-button,
  .fc-next-button {
    border: none;
    width: 28px;
    height: 28px;
    color: white;
    padding: 0;
    font-size: 18px;
    margin: 0 10px;
    &:hover {
      background: transparent;
      outline: none;
      box-shadow: none;
      color: #2c3e50;
    }
  }
  .fc-content-skeleton {
    height: 100%;
    table {
      height: 100%;
      td {
        text-align: center;
      }
    }
    .fc-title {
      font-weight: bold;
    }
  }
  .fc-day-top {
    padding-left: 5px;
  }
  .fc-day-number {
    width: 100%;
    text-align: left;
  }
  .fc-day-grid-event {
    margin-top: 0;
  }
  .fc-sun {
    background-color: #ffeef4;
  }
  .fc-sat {
    background-color: #d9edf7;
  }
  .fc-scroller {
    overflow-y: hidden !important;
  }
  .fc-today {
    background-color: #fff7e6;
  }
}
</style>
<docs>
  ```vue
  <template>
    <FullCalendar type="fx"/>
  </template>
  <script>
  export default {
    data() {
      return {
        events: [{
          start: 1535875125000,
          title: 'test title 01'
        }, {
          start: 1535961525000,
          title: 'test title 01'
        }, {
          start: 1536047926000,
          title: 'test title 01'
        }],
      }
    },
  }
  </script>
  ```
</docs>
