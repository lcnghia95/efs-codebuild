<template>
  <a href="/" class="homepage">
    <svg
      :style="`width:${width || 'auto'}; height: ${height || 'auto'}`"
      id="bfac7965-f18c-4aea-ac15-c812ced6a6ce"
      data-name="レイヤー 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
    >
      <defs>
        <style>
          .a11d9edb-916f-43f3-912a-2b2618d8d6fd {
            fill: #5c5d5e;
          }
        </style>
      </defs>
      <title>icon-home</title>
      <path
        class="a11d9edb-916f-43f3-912a-2b2618d8d6fd"
        d="M41,8.54a1.8,1.8,0,0,0-2.7,0l-34,37.15c-.74.81-.45,1.47.65,1.47H16.37a2,2,0,0,1,2,2V70.93a2,2,0,0,0,2,2H31.49a2,2,0,0,0,2-2V53.35a2,2,0,0,1,2-2h8.27a2,2,0,0,1,2,2V70.93a2,2,0,0,0,2,2H58.89a2,2,0,0,0,2-2V49.16a2,2,0,0,1,2-2H74.36c1.1,0,1.4-.66.65-1.47Z"
      />
    </svg>
  </a>
</template>
<script>
export default {
  name: "home-icon",
  props: {
    width: String,
    height: String
  }
};
</script>
<style scoped lang="scss">
.e7a3dae9-5195-4b3c-b5d3-907a072ef721:hover,
.ea53bee9-2472-41f4-8478-31f9b0c98365:hover {
  stroke: darken(#5d5e5e, 20%);
}
</style>
