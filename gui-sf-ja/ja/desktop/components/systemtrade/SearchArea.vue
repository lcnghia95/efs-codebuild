<template>
  <div class="flex space-between">
    <div class="search-content flex mid center">
      <form class="flex mid w-full" action="/systemtrade/search/">
        <input type="text" name="name"
               class="pl-15 pr-15 w-full"
               :placeholder="placeText || $t('1')"
               maxlength="80"
        >
        <button class="flex mid center" type="submit">
          <span class="glyphicon glyphicon-search" />
        </button>
      </form>
    </div>
    <div class="link-search-wrapper flex center mid">
      <a class="link-search" href="/systemtrade/search">{{ $t('2') }} <span class="right-arrow">＞</span></a>
    </div>
  </div>
</template>
<script>
import i18n from '@@/lang/components-desktop/systemtrade-searcharea.json'
export default {
  model: {
    prop: 'valueModel',
    event: 'input',
  },
  props: {
    placeText: String,
    valueModel: [Number, String],
  },
  i18n: {
    messages: i18n,
  },
}
</script>

<style lang="scss" scoped>
.right-arrow {
  font-size: 10px;
  margin-left: 20px;
}
.link-search-wrapper {
  background: rgb(240, 240, 240);
  width: 188px;
  height: 50px;
  border-radius: 4px;
}
.link-search {
  color: #fff;
  background: rgb(160, 160, 160);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 176px;
  height: 38px;
  border-radius: 4px;
  &:hover {
    text-decoration: none;
  }
}
.search-content {
  background: rgb(240, 240, 240);
  width: 472px;
  height: 50px;
  padding: 0 7px;
  border-radius: 4px;
  input {
    border-radius: 4px 0 0 4px;
    border: 1px solid #cecdce;
    border-right: 0;
    outline: none;
    overflow: hidden;
    height: 38px;
    &::placeholder {
      font-size: 15px;
      color: #bfbfbf;
    }
  }
  button {
    width: 48px;
    height: 38px;
    color: #fff;
    font-size: 15px;
    outline: none;
    border-radius: 0 4px 4px 0;
    border: 1px solid #cecdce;
    background: rgb(160, 160, 160);
    border-left: 0;
    &:hover {
      color: #777;
      background-color: #eee;
    }
  }
}
</style>
