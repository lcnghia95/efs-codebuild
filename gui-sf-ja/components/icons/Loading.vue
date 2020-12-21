<template>
  <div class="loader pos-rel" />
</template>

<style lang="scss" scoped>
$s: 50px;
$sm: 20px;
.loader {
  height: 200px;
  &.sm::before {
    border-radius: 50%;
    width: $sm;
    height: $sm;
    position: absolute;
    left: calc(50% - #{$sm / 2});
    top: calc(50% - #{$sm / 2});
  }
  &::before {
    content: '';
    animation: spin 1s linear infinite;
    border-radius: 50%;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #555;
    width: $s;
    height: $s;
    position: absolute;
    left: calc(50% - #{$s / 2});
    top: calc(50% - #{$s / 2});
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<docs>
  ```vue
  <template>
    <Loading />
  </template>
  <script>
  export default {}
  </script>
  ```
</docs>
