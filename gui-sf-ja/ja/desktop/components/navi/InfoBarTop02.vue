<template>
  <div class="infobar-t w-full">
    <div class="main--ib-t w-1000 flex mid space-between">
      <a href="/finance/videos" class="link--p flex mid">
        <youtube class="mr-10"/>
        <span>{{ $t('1') }}</span>
      </a>
      <div class="links--ib-t flex">
        <div class="link--i pos-rel">
          <a class="flex mid cursor-pointer">
            <desktop-alt class="mr-10"/>
            <span class="link-tit mr-5">{{ $t('2') }}</span>
            <div class="text-center number-style fs-12">{{ purchased.length }}</div>
          </a>
          <div class="nav-sub p-20">
            <ul class="sub-list">
              <li class="flex" v-for="item in purchased" :key="'purchased-' + item.id">
                <desktop-alt class="mr-10"/>
                <a :href="'/finance/videos/' + item.id" class="fs-13 pl-5" v-wrap-lines="1">{{ item.title }}</a>
              </li>
            </ul>
            <a class="btn-close flex layout-col-mid">×</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Youtube from '@@/../components/icons/Youtube.vue'
import DesktopAlt from '@@/../components/icons/DesktopAlt.vue'
import i18n from '@@/lang/components-desktop/infor-top-bar02.json'
/**
 * The Information Bar Top 02.
 */
export default {
  props: {
    purchased: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  components: {
    Youtube,
    DesktopAlt,
  },
  i18n: {
    messages: i18n,
  },
  mounted() {
    let me = this
    $('.link--i a').click(function(e) {
      if (!me.purchased.length) {
        e.preventDefault()
        return
      }
      if (
        $(this)
          .parent()
          .hasClass('active')
      ) {
        $(this)
          .parent()
          .toggleClass('active')
        return
      }
      $('.link--i').removeClass('active')
      $(this)
        .parent()
        .toggleClass('active')
    })
    $('.btn-close').click(function() {
      $('.link--i').removeClass('active')
    })
  },
}
</script>
<style lang="scss" scoped>
/deep/ .icon-cls {
  width: 19px;
  height: auto;
}
.infobar-t {
  background: #000034;
}
.main--ib-t {
  height: 40px;
  font-size: 14px;
}
.link--i .icon-cls {
  width: 15px;
  margin-top: -2px;
}
.link--i {
  margin-left: 22px;
}
.main--ib-t a {
  color: #fff;
}
.number-style {
  width: 15px;
  height: 20px;
  line-height: 20px;
  background-color: white;
  border-radius: 3px;
  color: #000034;
}
.link--i > a::before {
  display: none;
  z-index: 9999;
  content: '';
  width: 0;
  height: 0;
  border-width: 0 10px 15px;
  border-style: solid;
  border-color: #010034 transparent;
  position: absolute;
  bottom: -21px;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.link--i.active {
  > a {
    &::after,
    &::before {
      display: block;
    }
  }
  .nav-sub {
    display: block;
  }
}
.nav-sub {
  display: none;
  z-index: 999;
  position: absolute;
  top: 40px;
  right: 0;
  background: #010030;
  width: 415px;
  height: 155px;
  border: 1px solid white;
  .sub-list {
    width: 350px;
    height: 115px;
    padding: 0;
    list-style: none;
    overflow-y: scroll;
    li {
      margin-bottom: 6px;
      margin-right: 10px;
      i {
        color: #fcf101;
        margin-top: 1px;
      }
      a {
        display: block;
        text-decoration: underline;
        &:hover {
          color: #fdf774;
        }
      }
    }
    &::-webkit-scrollbar {
      width: 5px;
      background: #474747;
    }
    &::-webkit-scrollbar-thumb {
      background: #b2b2b2;
    }
  }
  .btn-close {
    width: 17px;
    height: 17px;
    font-size: 15px;
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    border: 1px solid white;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      color: #fdf774;
      border: 1px solid #fdf774;
    }
  }
}
</style>
