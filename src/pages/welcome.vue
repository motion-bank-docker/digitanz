<template lang="pug">
  .position-relative(style="height: calc(100vh - 50px); overflow-y: hidden;")
    img(:src="changeImg(currentImg)")
    // img(:src="images[0]")
</template>

<script>
  export default {
    data () {
      return {
        currentImg: 1,
        images: ['statics/003-master-1.svg', 'statics/003-master-2.svg', 'statics/003-master-3.svg']
      }
    },
    mounted () {
      // this.changeImg()
      let i = 0
      setInterval(function () {
        if (i < 2) i++
        else i = 0
        this.currentImg = i
        console.log(i)
        return this.currentImg
      }, 1000)
    },
    methods: {
      changeImg (val) {
        console.log(val)
        // let i = 0
        // let imgs = this.images
        /* setInterval(function () {
          if (i < 2) i++
          else i = 0
          this.currentImg = i
          // console.log(imgs[this.currentImg])
          // return imgs[i]
        }, 1000) */
        return this.images[val]
        // console.log(imgs[i])
      }
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
