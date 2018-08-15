<template lang="pug">
  .position-relative.row(style="height: calc(100vh - 50px); overflow-y: hidden;")
    img.full-width(:src="currentImg", style="transform: scale(.85) translateY(-5vh);")
</template>

<script>
  export default {
    data () {
      return {
        currentImg: undefined,
        images: ['statics/003-master-1.svg', 'statics/003-master-3.svg', 'statics/003-master-2.svg']
      }
    },
    mounted () {
      const _this = this
      let i = 0
      this.currentImg = this.images[0]
      setInterval(function () {
        if (i < _this.images.length - 1) i++
        else i = 0
        _this.currentImg = _this.images[i]
      }, 1000)
    }
  }
</script>

<style>
  .st0 {
    fill: none;
    stroke: #ffffff;
    stroke-width: 10;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
    }
</style>
