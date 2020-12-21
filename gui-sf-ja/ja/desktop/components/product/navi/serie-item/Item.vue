<template>
  <div class="o-item">
    <span class="o-item__rank">{{ rank }}</span>
    <img class="o-item__img" :src="`/img/products/${data.id}/small`">
    <p v-wrap-lines="2" class="o-item__tit">{{ data.title }}</p> 
    <span class="o-item__au"><edit class="o-item__icon wrap-text"/>{{ data.author }}</span>
  </div>
</template>
<script>
import Edit from '@@/../components/icons/Edit.vue'
/**
 * The Serie Item.
 */
export default {
  props: ['data', 'rank'],
  components: {
    Edit,
  },
}
</script>
<docs>
  ```vue
  <template>
    <div>
      <serie-item :data="item" :rank="rank"/>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        item: {
          "id": 4224,
          "title": "1740【動画】新規と決済が一撃で分かるベガストンネル＆いいだっちラインのトレード手法",
          "author": "3422シンプリフィ"
        },
        rank: 1
      }
    },
  }
  </script>
  ```
</docs>
