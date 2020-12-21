<template>
  <div class="calendar-ZSi02"></div>
</template>

<script>
import { Calendar } from '@fullcalendar/core'
import daygrid from '@fullcalendar/daygrid'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/core/main.css'
import jaLocale from '@fullcalendar/core/locales/ja'
import thLocale from '@fullcalendar/core/locales/th'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import zhTwLocale from '@fullcalendar/core/locales/zh-tw'
import viLocale from '@fullcalendar/core/locales/vi'

const localeMap = {
  en: 'en',
  ja: 'ja',
  th: 'th',
  ch: 'zh-cn',
  tw: 'zh-tw',
  vi: 'vi',
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
  mounted() {
    let me = this,
      loc = this.$i18n.locale,
      to,
      cal = new Calendar(this.$el, {
        plugins: [daygrid],
        defaultView: 'dayGridMonth',
        displayEventTime: false,
        height: 400,
        header: {
          left: null,
          center: 'prev title next',
          right: null,
        },
        // https://fullcalendar.io/docs/date-formatting
        titleFormat: {
          year: 'numeric',
          month: 'long',
        },
        locales: [viLocale, jaLocale, thLocale, zhCnLocale, zhTwLocale],
        locale: localeMap[loc],
        contentHeight: 'auto',
        eventRender(info) {
          let start = info.event.start,
            d = `${start.getFullYear()}-${('0' + (start.getMonth() + 1)).slice(
              -2
            )}-${('0' + start.getDate()).slice(-2)}`
          $(`.fc-day-top[data-date=${d}] .fc-day-number`).css('color', 'white')
        },
        eventDataTransform(e) {
          e = Object.assign({}, e, me.eventOption, {
            className: 'evt-cls evt-type' + (parseInt(e.title) > 0 ? 1 : 2),
          })
          return e
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
            ).then(e =>
              success((e || []).map(e => Object.assign({}, e, me.eventOption)))
            )
          }, 500)
        },
      })
    if (loc == 'ja') {
      let fn = cal.dateEnv.format
      cal.dateEnv.format = function() {
        let res = fn.call(this, ...arguments)
        if (arguments[1].standardDateProps.day) {
          return res.replace('日', '')
        }
        return res
      }
    }
    cal.render()
  },
  data() {
    return {
      eventOption: {
        color: 'white',
        overlap: false,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.calendar-ZSi02 /deep/ {
  .fc-day {
    border: 0 solid #ddd;
  }
  .fc-today {
    background: white;
  }
  .fc-title {
    display: none;
  }
  .fc-day-header {
    border-bottom-width: 1px;
    border-right-width: 0;
    border-left-width: 0;
    padding: 4vw 0 1.5vw;
    font-size: 3vw;
    font-weight: normal;
  }
  .fc-header-toolbar {
    margin-bottom: 0;
  }
  .fc-center {
    background: #393939;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-size: 4.5vw;
      margin-left: 0;
      color: white;
    }
  }
  .fc-prev-button {
    border-radius: 0;
    border: none;
    border-right: 1px solid;
  }
  .fc-next-button {
    border-radius: 0;
    border: none;
    border-left: 1px solid;
    margin-left: 0;
  }
  .fc-prev-button,
  .fc-next-button {
    background: #393939;
    font-size: 6vw;
    color: #969696;
    &:hover,
    &:active,
    &:focus {
      background: transparent;
      outline: none;
      box-shadow: none;
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
    height: 50px;
    vertical-align: middle;
  }
  .fc-day-number {
    float: none !important;
    width: 8vw;
    height: 8vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4vw;
    margin: 0 auto;
    border-radius: 50%;
  }
  .fc-day-grid-event {
    margin-top: 0;
  }
  .fc-scroller {
    overflow-y: hidden !important;
  }
  .evt-cls {
    opacity: 1;
    border-top: 1px solid #ddd;
    &.evt-type1::before {
      background: #489dff;
    }
    &.evt-type2::before {
      background: #e55567;
    }
    &::before {
      content: '';
      width: 10vw;
      height: 10vw;
      display: flex;
      margin-left: 1vw;
      margin-top: -12.5vw;
      border-radius: 50%;
      position: absolute;
      z-index: -9;
    }
    @media screen and (orientation: landscape) {
      &::before {
        margin-top: -21.1vh;
      }
    }
  }
}
</style>
<docs>
  ```vue
  <template>
    <FullCalendar />
  </template>
  <script>
  export default {
    data() {
      return {
        events: [{
          start: 1535875125000,
          title: '+1000'
        }, {
          start: 1535961525000,
          title: '-500'
        }, {
          start: 1536047926000,
          title: '200'
        }],
      }
    },
  }
  </script>
  ```
</docs>
