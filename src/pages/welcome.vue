<template lang="pug">
  .position-relative(style="height: calc(100vh - 50px); overflow-y: hidden;")
    svg(width="100%", height="100%")
      line(v-for="n in 10", :x1="50 * n", y1="0", :x2="50 * n", y2="100%", style="stroke: rgba( 255, 255, 255, .2 ); stroke-width: 1;")
      line(v-for="n in 30", x1="0", :y1="50 * n", x2="100%", :y2="50 * n", style="stroke: rgba( 255, 255, 255, .2 ); stroke-width: 1;")
    // .text-white #digitanz
</template>

<script>
  export default {
  }
</script>
