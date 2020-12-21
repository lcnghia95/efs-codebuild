<template>
  <div class="favourite-button" v-if="$store.state.user.id" :class="{'icon-only': !!iconOnly}">
    <button class="flex mid" @click="$emit('favourite')" :style="`height: ${height}`">
      <svg
        id="fa69165e-e29d-4ed0-8537-62d30bc5822b"
        data-name="レイヤー 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 80 80"
      >
        <title>icon</title>
        <path
          :style="`fill: ${marked ? '#dccf30' : 'lightgray'}`"
          d="M39.07,13.43c.51-1.57,1.35-1.57,1.86,0L46.38,30.2a4.4,4.4,0,0,0,3.92,2.85H67.94c1.65,0,1.91.8.57,1.77L54.24,45.18a4.43,4.43,0,0,0-1.5,4.62l5.45,16.77c.51,1.57-.16,2.06-1.5,1.09L42.43,57.29a4.42,4.42,0,0,0-4.86,0L23.31,67.66c-1.34,1-2,.48-1.5-1.09L27.26,49.8a4.43,4.43,0,0,0-1.5-4.62L11.49,34.82c-1.34-1-1.08-1.77.57-1.77H29.7a4.4,4.4,0,0,0,3.92-2.85Z"
        />
      </svg>
      <span>{{ $t(1) }}</span>
    </button>
  </div>
</template>
<script>
import i18n from '@@/lang/common/socials.json'
export default {
  name: "navi-favourite-button",
  props: {
    label: {
      type: String,
      default() {return ''}
    },
    marked: {
      type: Boolean,
      default() {return false}
    },
    height: {
      type: String,
      default() {return '32px'}
    },
    iconOnly: {
      type: Boolean,
      default() {return false}
    }
  },
  i18n: {
    messages: i18n
  }
}
</script>
<style scoped lang="scss">
.favourite-button {
  align-self: center;
  &.icon-only {
    svg {
      width: 28px;
      height: 28px;
    }
    button {
      span {display: none}
      border: none;
      margin-bottom: 5px;
    }
  }
}
button {
  background-color: white;
  outline: none;
  border: 1px solid #757575;
  border-radius: 2px;
  color: #757575;
  height: 32px;
  &:hover {
    opacity: 0.8;
  }
  svg {
    width: 24px;
    margin-top: -1px !important;
  }
  span {
    margin-left: 2px;
  }
}
</style>
