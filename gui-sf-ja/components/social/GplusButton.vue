<template>
  <div class="h-20">
    <div id="gpluscontent">
      <div class="g-plusone" data-size="tall"/>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    if (!$('script[id=st-gplus]').length) {
      let el2 = document.createElement('script')
      el2.setAttribute('id', 'st-gplus')
      el2.setAttribute('src', 'https://apis.google.com/js/platform.js')
      document.getElementsByTagName('head')[0].appendChild(el2)
    }
  },
  methods: {
    onRender() {
      /* eslint-disable no-undef */
      gapi.plusone.go('gpluscontent')
      /* eslint-enable no-undef */
    },
  },
}
</script>

<style lang="scss" scoped>
.h-20 {
  height: 20px;
}
</style>
