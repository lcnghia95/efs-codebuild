<template>
  <div class="flex flex-wrap fixed-menu">
    <a :href="'/systemtrade/' + item.url" v-for="(item, i) in menu" :key="'fix-menu' + i" class="grow1 flex layout-col mid">
      <p class="m-0" v-if="item.title">{{ item.title }}</p>
      <i :is="item.icon" v-if="item.icon" />
      <span v-if="item.sub" v-html="item.sub" class="flex mid text-center"></span>
    </a>
  </div>
</template>

<script>
import i18n from '@@/lang/components-mobile/fix-menu.json'
import Sync from '@@/../components/icons/Sync.vue'
import Sale from '@@/../components/icons/Sale.vue'
import BalanceScale from '@@/../components/icons/BalanceScale.vue'

export default {
  components: { Sync, Sale, BalanceScale },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      menu: [
        {
          title: this.$t(1),
          url: 'fx',
        },
        {
          title: this.$t(2),
          url: 'stocks',
        },
        {
          title: this.$t(3),
          url: 'newproduct',
          sub: this.$t(4),
        },
        {
          icon: Sale,
          title: null,
          url: 'sell',
          sub: this.$t(6),
        },
        {
          title: '%',
          url: 'profitrate',
          sub: this.$t(7),
        },
        {
          title: '￥',
          url: 'profit',
          sub: this.$t(8),
        },
        {
          icon: BalanceScale,
          title: null,
          url: 'profitfactor',
          sub: this.$t(9),
        },
        {
          icon: Sync,
          title: null,
          url: 'riskreturn',
          sub: this.$t(10),
        },
      ],
    }
  },
  mounted() {
    if (!process.browser) {
      return
    }
    let $win = $(window),
      $main = $('.body'),
      $nav = $(this.$el),
      navHeight = $nav.outerHeight(),
      tmpH = 0,
      navPos = $nav.offset().top,
      fixedClass = 'is-fixed',
      fn = function() {
        if (tmpH) {
          $nav.addClass(fixedClass)
        } else {
          $nav.removeClass(fixedClass)
        }
        $main.css('margin-top', tmpH)
      }

    $win.on('load scroll', function() {
      if ($(this).scrollTop() > navPos) {
        tmpH = navHeight
        window.requestAnimationFrame(fn)
      } else {
        tmpH = 0
        window.requestAnimationFrame(fn)
      }
    })
  },
}
</script>

<style lang="scss" scoped>
$color: #f19149, #e6ae4d, #54c1f2, #7dcbf0, #748fc7, #b87bbd, #db858d, #e2707a;
div {
  span {
    font-size: 1.7vw;
    height: 4.5vw;
    line-height: 2.2vw;
  }
  p {
    font-size: 6vw;
    line-height: 8vw;
  }
  > a {
    color: white;
    padding: 1.2vw 0;
    text-decoration: none;
    &:nth-child(-n + 2) {
      width: 50%;
      height: 10vw;
      i.icon-cls {
        width: 8vw;
        height: 8vw;
      }
    }
    &:nth-child(n + 3) {
      width: calc(100% / 6);
      height: 13vw;
      i.icon-cls,
      p {
        height: 7vw;
      }
      i.icon-cls {
        width: 7vw;
      }
    }
    @for $i from 1 to 9 {
      &:nth-child(#{$i}) {
        background-color: nth($color, $i);
      }
    }
  }
}
.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
}
@media only screen and (min-width: 600px) {
  div {
    p {
      font-size: 3vw;
      line-height: 4.5vw;
    }
    > a {
      &:nth-child(-n + 2) {
        height: 6vw;
        i.icon-cls {
          width: 4vw;
          height: 4vw;
        }
      }
      &:nth-child(n + 3) {
        height: 8vw;
        padding: 0.5vw 0;
        i.icon-cls,
        p {
          height: 4vw;
        }
        i.icon-cls {
          width: 3.5vw;
        }
        span {
          font-size: 1.3vw;
          line-height: 1.5vw;
        }
      }
    }
  }
}
</style>
