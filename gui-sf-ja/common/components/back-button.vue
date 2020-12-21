<template>
  <a class="inline-flex mid" :href="link">
    <svg
      id="a41465e2-d306-416a-bce5-2c6911a02b41"
      data-name="レイヤー 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
    >
      <defs>
        <style>
          .fb923db6-104d-4093-a76c-1ab455ed6fbe {
          fill: #777778;
          }
        </style>
      </defs>
      <title>icon</title>
      <path
        class="fb923db6-104d-4093-a76c-1ab455ed6fbe"
        d="M20.6,15.91H9.79a.94.94,0,0,1,0-1.88H20.6a.94.94,0,1,1,0,1.88Z"
      />
      <path
        class="fb923db6-104d-4093-a76c-1ab455ed6fbe"
        d="M15.19,20.38a1,1,0,0,1-.58-.2L9.06,15.84a1,1,0,0,1-.36-.7.93.93,0,0,1,.3-.72l5.55-5.25a.94.94,0,1,1,1.29,1.37L11.08,15l4.69,3.67a.94.94,0,0,1-.58,1.68Z"
      />
    </svg>
    {{ label }}
  </a>
</template>
<script>
export default {
  name: "navi-back-btn",
  props: {
    link: {
      type: String,
      default: '/'
    },
    label: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped>
a {
  color: #767777;
}
svg {
  width: 38px;
  cursor: pointer;
}
</style>
