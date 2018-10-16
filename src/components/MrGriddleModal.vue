<template lang="pug">
  q-modal.bg-dark(v-model="showModal", maximized)
    q-window-resize-observable(@resize="onResize")

    q-modal-layout(dark, :content-class="{'bg-dark': true}")
      .flex.items-center.full-height
        mr-griddle-standalone
        // .full-width.text-center
          template(v-if="lines.length > 0")
            svg.bg-dark(ref="svgContainer", :width="screenSize.width", :height="screenSize.width")
              // line(v-for="(col, i) in grid.columns", x1="i * ", :y1="", :x2="screenSize.width", :y2="i * screenSize.width", stroke="white")
              //
                line(v-for="n in grid.columns", :x1="(screenSize.width / grid.columns) * n", y1="screenSize.width", :x2="(screenSize.width / grid.columns) * n", :y2="screenSize.width", stroke="white")
                line(v-for="n in grid.rows", x1="0", :y1="(screenSize.width / grid.rows) * n", :x2="screenSize.width", :y2="(screenSize.width / grid.rows) * n", stroke="white")
              g#mr-griddle.random
                // rect(width="100%", height="100%", fill="#111111")
                // line(x1="0", y1="0", x2="100", y2="100", stroke="white", stroke-width="1")
                line(v-for="(line, i) in lines", :key="`line-${i}`",
                // :stroke-width="strokeWidth",
                stroke="white",
                // :x1="line.x1", :y1="line.y1",
                // :x2="line.x2", :y2="line.y2")
          template(v-else)
            loading-spinner

    q-btn.bg-dark.fixed-top-right.q-ma-md.shadow-4(@click="close", icon="clear", flat, round, size="sm")
</template>

<script>
  // import { VideoPlayer } from 'mbjs-quasar/src/components'
  import LoadingSpinner from './LoadingSpinner'
  import MrGriddleStandalone from './MrGriddleStandalone'

  export default {
    components: {
      LoadingSpinner,
      MrGriddleStandalone
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
        resizeFactor: '',
        // reqHeight: this.requestedHeight,
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
        return 20 * this.skeletonScale / (this.screenSize.width / this.requestedHeight)
      },
      skeletonScale () {
        const scale = Math.min(1, this.screenSize.width / 900) * (this.screenSize.width / this.requestedHeight)
        // console.log('scale', scale)
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
      // console.log('this.gridCell', this.gridCell)
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
        }, 1000)
      },
      drawSkeleton (val) {
        this.modalContent = val
        let skeletonLines = []
        skeletonLines = val.skeleton
        // console.log(skeletonLines)
        /* let x = Math.floor(this.grid.columns / 2)
        let y = Math.floor(this.grid.rows / 2) */
        let x = Math.floor(this.screenSize.width / 2)
        let y = Math.floor(this.screenSize.width / 2)
        // console.log(this.grid.columns, this.grid.rows)
        // console.log(x, y)
        let w = this.screenSize.width / 100
        let h = this.screenSize.width / 100
        // console.log(this.requestedHeight, w, h)
        this.lines = skeletonLines.map(line => {
          // console.log(line)
          // console.log('x1', x + Math.round(line.x1 * this.skeletonScale / w))
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
        // this.resizeFactor = this.screenSize.width / this.requestedHeight
        // this.resizeFactor = 2
        // console.log('this.resizeFactor', this.resizeFactor)
        // console.log('screen size', this.screenSize)
      },
      show (val) {
        this.showModal = true
        this.modalContent = val[0]
        // console.log('this.requestedHeight', this.requestedHeight)
        // this.reqHeight = this.requestedHeight
        // console.log('this.reqHeight', this.reqHeight)
        /* this.svgSize = {
          width: this.requestedHeight * 2,
          height: this.requestedHeight * 2
        } */
        // console.log('this.svgSize.width', this.svgSize.width)
        this.startTimer(val)
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
