<template lang="pug">
  q-modal.bg-dark(v-model="showModal", maximized)
    q-window-resize-observable(@resize="onResize")

    q-modal-layout.flex.items-center(dark, :content-class="{'bg-dark': true}")
      div
        svg.bg-grey-10(ref="svgContainer", :width="screenSize.width", :height="screenSize.width")
          g#mr-griddle.random
            rect(width="100%", height="100%", fill="#444444")
            // line(x1="0", y1="0", x2="100", y2="100", stroke="white", stroke-width="1")
            line(v-for="(line, i) in lines", :key="`line-${i}`",
            :stroke-width="strokeWidth",
            stroke="white",
            :x1="line.x1", :y1="line.y1",
            :x2="line.x2", :y2="line.y2")

            <!--line(v-for="(line, i) in lines", :key="`line-${i}`",-->
            <!--:stroke-width="strokeWidth",-->
            <!--:x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",-->
            <!--:x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")-->
      //
        .bg-green {{ requestedHeight }}
        .bg-primary {{ gridCell.width }}
        .bg-red
          p(v-for="line in lines") {{ typeof line.y2 }}

      // .bg-green
        // p(v-for="line in lines") {{ line }}
        p(v-for="line in lines") {{ line }} {{ gridCell.width }}

      // .q-caption.text-white {{ modalContent }}

    q-btn.bg-dark.fixed-top-right.q-ma-md.shadow-4(@click="close", icon="clear", flat, round, size="sm")
</template>

<script>
  // import { VideoPlayer } from 'mbjs-quasar/src/components'

  export default {
    components: {
    },
    props: ['requestedHeight'],
    data () {
      return {
        device: {
          width: '',
          height: ''
        },
        distance: {
          left: '',
          top: ''
        },
        grid: {
          columns: 10,
          rows: 16
        },
        gridCell: {
          width: 0,
          height: 0
        },
        index: -1,
        lines: [],
        modalContent: undefined,
        modalInterval: undefined,
        playerHeight: '',
        playerWidth: '',
        preview: undefined,
        scaleQuotient: '',
        screenSize: {
          height: 0,
          width: 0
        },
        showModal: false,
        src: '',
        video: undefined
      }
    },
    computed: {
      strokeWidth () {
        return (20 / this.scaleQuotient) * this.skeletonScale
      },
      skeletonScale () {
        const scale = Math.min(1, this.screenSize.width / (900 / this.scaleQuotient))
        console.log('scale', scale)
        return scale
      }
    },
    watch: {
    },
    mounted () {
      this.gridCell = {
        width: this.screenSize.width / this.grid.columns,
        height: this.screenSize.height / this.grid.rows
      }
      console.log('this.gridCell', this.gridCell)
    },
    methods: {
      startTimer (val) {
        // this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
        console.log('START')
        let i = 0
        this.modalInterval = setInterval(() => {
          // console.log(i, val[i].skeleton[0].id, val[i].skeleton[0].x2)
          i++
          if (i >= val.length) i = 0
          this.drawSkeleton(val[i])
        }, 500)
      },
      drawSkeleton (val) {
        this.modalContent = val
        let skeletonLines = val
        skeletonLines = val.skeleton
        // console.log(skeletonLines)
        let x = Math.floor(this.grid.columns / 2)
        let y = Math.floor(this.grid.rows / 2)
        // console.log(x, y)
        let w = this.requestedHeight / this.grid.columns
        let h = this.requestedHeight / this.grid.rows
        // console.log(this.requestedHeight, w, h)
        this.lines = skeletonLines.map(line => {
          // console.log(line)
          return {
            x1: x + Math.round(line.x1 * this.skeletonScale / w),
            y1: y + Math.round(line.y1 * this.skeletonScale / h),
            x2: x + Math.round(line.x2 * this.skeletonScale / w),
            y2: y + Math.round(line.y2 * this.skeletonScale / h)
          }
        })
        // console.log(this.lines)
      },
      onResize (size) {
        this.screenSize = {
          height: size.height,
          width: size.width
        }
        // this.scaleQuotient = this.screenSize.width / this.requestedHeight
        this.scaleQuotient = 9
        console.log('this.scaleQuotient', this.scaleQuotient)
        console.log('screen size', this.screenSize)
        if (this.preview !== undefined) {
          this.device.width = size.width
          this.device.height = size.height
          let videoX = this.preview.metadata.width
          let videoY = this.preview.metadata.height
          if (this.device.width > this.device.height) { // DEVICE LANDSCAPE
            if (videoX < videoY) {
              this.playerWidth = this.device.height / (videoY / videoX)
              // this.playerHeight = this.playerWidth * (videoY / videoX)
            } // video hochformat
            if (videoX > videoY) this.playerWidth = this.device.width // video querformat
          }
          else if (size.width < size.height) { // DEVICE PORTRAIT
            if (videoX < videoY) this.playerWidth = this.device.width // video hochformat
            if (videoX > videoY) this.playerWidth = this.device.width // video querformat
            this.playerHeight = this.device.height * (videoY / videoX)
          }
          this.distance.left = (this.device.width - this.playerWidth) / 2
          // this.distance.top = (size.width - this.playerHeight) / 2
        }
      },
      show (val) {
        this.showModal = true
        this.modalContent = val[0]
        console.log('this.requestedHeight', this.requestedHeight)
        this.svgSize = {
          width: this.requestedHeight * 2,
          height: this.requestedHeight * 2
        }
        console.log('this.svgSize.width', this.svgSize.width)

        this.startTimer(val)
        /* if (preview.annotation !== undefined) this.src = preview.annotation
        else if (preview.portrait !== undefined) this.src = preview.portrait
        else this.src = preview.response
        // console.log(this.src)
        this.preview = preview
        this.showModal = true */
      },
      close () {
        this.showModal = false
        this.modalContent = undefined
        clearInterval(this.modalInterval)
        console.log('STOP')
      }
    }
  }
</script>

<style scoped lang="stylus">

  #mr-griddle
    line
      stroke-linecap round

</style>
