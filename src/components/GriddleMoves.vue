<template lang="pug">
  div
    .row(v-if="!enclosed")
      .col-md-12
        img.full-width(:src="currentImg")
    div(v-else, style="overflow-y: hidden;")
      img(:src="currentImg", style="max-height: 80vh;")
</template>

<script>
  export default {
    props: ['enclosed', 'time'],
    data () {
      return {
        interval: undefined,
        currentImg: undefined,
        images: ['statics/003-master-1.svg', 'statics/003-master-3.svg', 'statics/003-master-2.svg']
      }
    },
    mounted () {
      const _this = this
      let i = 0
      this.currentImg = this.images[0]
      this.interval = setInterval(function () {
        if (i < _this.images.length - 1) i++
        else i = 0
        _this.currentImg = _this.images[i]
      }, this.time || 500)
    },
    beforeDestroy () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .st0
    fill none
    stroke #ffffff
    stroke-width 10px
    stroke-linecap round
    stroke-linejoin round
    stroke-miterlimit 10
</style>
