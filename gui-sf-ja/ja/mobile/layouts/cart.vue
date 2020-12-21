<template>
  <section>
    <header>
      <NavMenu />
      <div class="flex">
        <div class="flex layout-col mid center" @click="onShowMenu">
          <Menu class="svg-size" />
        </div>
        <div class="flex mid center w-full">
          <a href="/" class="logo-top text-center">
            <Logo class="logo-height" />
          </a>
        </div>
      </div>
    </header>
    <nuxt class="body" />
    <Footer />
    <no-ssr>
      <ScrollTopButton />
    </no-ssr>
  </section>
</template>

<script>
import Menu from '@@/../components/icons/Menu.vue'
import Logo from '@@/../components/icons/Logo.vue'
import NavMenu from '@/components/NavMenu.vue'
import Footer from '@/components/Footer.vue'
import ScrollTopButton from '@/components/ScrollTopButton.vue'
export default {
  components: {
    Menu,
    Logo,
    NavMenu,
    Footer,
    ScrollTopButton,
  },
  methods: {
    onShowMenu() {
      $('.nav-menu').addClass('active')
      $('body').css('overflow', 'hidden')
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  .logo-top {
    display: block;
    width: 50%;
    max-width: 250px;
    margin: 1vw 7vw 2vw 0;
  }
}
</style>
