<template lang="pug">
  div
    svg.bg-primary.q-mb-lg(ref="svgContainer" :width="svgSize.width" :height="svgSize.height")
      .q-mt-xl
      g#mr-griddle(:class="{'random': currentState === -1}")
        rect(width="100%", height="100%", fill="url(#cell-pattern)")
        line(v-for="(line, i) in lines", :key="`line-${i}`",
        :stroke-width="strokeWidth"
        :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
        :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")
    slot(name="customButtons" :video="video")
    // q-btn(flat, size="sm" round, icon="delete" @click="openDeleteModal(video)")

</template>

<script>
  const UI_RESIZER_FACTOR = 2

  export default {
    props: {
      play: {
        type: String
      },
      requestedWidth: {
        type: Number,
        default: null
      },
      requestedHeight: {
        type: Number,
        default: null
      },
      previewSkeleton: undefined
    },
    data () {
      return {
        svgSize: {
          width: 0,
          height: 0
        },
        grid: {
          columns: 10,
          rows: 16
        },
        gridCell: {
          width: 0,
          height: 0
        },
        // previewData: undefined,
        resizerFactor: UI_RESIZER_FACTOR,
        currentTime: 0,
        resizingCell: false,
        frameLength: 80,
        minFrameLength: 60 / 3,
        maxFrameLength: 60 * 6,
        settingFrameLength: false,
        lastFrameTime: -1,
        lines: [],
        storedStates: [],
        currentState: -1
      }
    },
    computed: {
      strokeWidth () {
        return 20 * this.skeletonScale
      },
      skeletonScale () {
        const scale = Math.min(1, this.svgSize.width / 900)
        return scale
      },
      previewData () {
        return JSON.parse(this.previewSkeleton)
      }
    },
    mounted () {
      if (this.requestedWidth && this.requestedHeight) {
        this.svgSize = {
          width: this.requestedWidth,
          height: this.requestedHeight
        }
      }
      else {
        this.svgSize = {
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        }
      }
      this.gridCell = {
        width: this.svgSize.width / this.grid.columns,
        height: this.svgSize.height / this.grid.rows
      }
      this.drawSkeleton()
    },
    methods: {
      drawSkeleton () {
        let skeletonLines = []
        // draw previewData
        skeletonLines = this.previewData.skeleton
        let x = Math.floor(this.grid.columns / 2)
        let y = Math.floor(this.grid.rows / 2)
        let w = this.svgSize.width / this.grid.columns
        let h = this.svgSize.height / this.grid.rows
        this.lines = skeletonLines.map(line => {
          return {
            x1: x + Math.round(line.x1 * this.skeletonScale / w),
            y1: y + Math.round(line.y1 * this.skeletonScale / h),
            x2: x + Math.round(line.x2 * this.skeletonScale / w),
            y2: y + Math.round(line.y2 * this.skeletonScale / h)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">

  #mr-griddle
    line
      stroke mediumvioletred
      stroke-linecap round

  #mr-griddle.random
    line
      stroke white

  #resize-handle
    fill: white
    stroke: gray
    stroke-width: 2

  #resize-handle *:hover,
  #resize-handle.resizing
    fill: gray

</style>
