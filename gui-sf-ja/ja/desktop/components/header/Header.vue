<template>
  <header>
    <div v-if="isMobile" class="back-mobile flex mid center" @click="switchToMobile()">
      モバイル用<span>GogoJungleに戻る</span>
    </div>
    <Header01 />
    <Menu />
    <div class="menu2">
      <div v-for="(menu,index) in menus2" :key="'menubtn' + index">
        <a :href="menu.url" class="pos-rel">
          <button :class="'menu2-item-'+index" class="menu2-item" v-html="menu.title"></button>
          <span v-if="menu.isNew" class="new-blog pos-abs"> <b>New!</b> </span>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import header from './header.js'
export default header
</script>
<style lang="scss" scoped>
.menu2 {
  display: flex;
  justify-content: center;
  min-width: 1000px;
  margin: 20px auto;
  a {
    display: block;
    margin-right: 10px;
    cursor: pointer;
    .menu2-item {
      height: 45px;
      background: #5844ac;
      padding: 3px 10px;
      font-size: 12px;
      color: #fff;
      line-height: 15px;
      border: none;
      border-radius: 5px;
      box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
      outline: none;
      &-0 {
        background: #003567;
      }
      &-2 {
        background: #b436b1;
      }
      &-9 {
        background: #ff1493;
      }
      &-3 {
        background: #e6445d;
      }
      &-4 {
        background: #f1ae4d;
      }
      &-5 {
        background: #16a085;
      }
      &-6 {
        background: #6ac4de;
      }
      &-7 {
        background: #003567;
      }
      &-11 {
        background: #16a085;
      }
    }
  }
}
.back-mobile {
  display: none;
  width: 100%;
  height: 150px;
  background: #0343ce;
  font-size: 55px;
  color: white;
  span {
    text-decoration: underline;
  }
}
.new-blog {
  top: -7px;
  right: -17px;
  color: white;
  background: #ff6901;
  font-size: 10px;
  display: inline-block;
  padding: 3px 4px;
  border-radius: 3px;
  transform: rotate(9deg);
}
@media only screen and (max-width: 1100px) {
  .menu2 a .menu2-item {
    font-size: 12px;
  }
}
</style>