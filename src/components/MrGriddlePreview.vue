<template lang="pug">
  svg.bg-primary.q-mb-lg(ref="svgContainer" :width="svgSize.width" :height="svgSize.height")
    .q-mt-xl
    g#mr-griddle(:class="{'random': currentState === -1}")
      rect(width="100%", height="100%", fill="url(#cell-pattern)")
      line(v-for="(line, i) in lines", :key="`line-${i}`",
      :stroke-width="strokeWidth"
      :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
      :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")

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
        previewData: undefined,
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
      }
    },
    mounted () {
      this.loadData()
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
      loadData: function () {
        this.previewData = {
          'skeleton': [
            {
              'id': 'spine',
              'x1': 0,
              'y1': 0,
              'x2': -23.991685625564216,
              'y2': -54.994536281744345
            },
            {
              'id': 'center-shoulder',
              'x1': -23.991685625564216,
              'y1': -54.994536281744345,
              'x2': -130.32021229158863,
              'y2': -160.79739265638358
            },
            {
              'id': 'head',
              'x1': -130.32021229158863,
              'y1': -160.79739265638358,
              'x2': -209.14276293698146,
              'y2': -204.23706933283324
            },
            {
              'id': 'left-shoulder',
              'x1': -130.32021229158863,
              'y1': -160.79739265638358,
              'x2': -175.12693052872385,
              'y2': -82.74383411599432
            },
            {
              'id': 'left-elbow',
              'x1': -175.12693052872385,
              'y1': -82.74383411599432,
              'x2': -181.68637602238306,
              'y2': 7.016812465989005
            },
            {
              'id': 'left-wrist',
              'x1': -181.68637602238306,
              'y1': 7.016812465989005,
              'x2': -135.05419457495918,
              'y2': 83.99368986079203
            },
            {
              'id': 'left-hand',
              'x1': -135.05419457495918,
              'y1': 83.99368986079203,
              'x2': -96.65920823238646,
              'y2': 130.1003599178852
            },
            {
              'id': 'right-shoulder',
              'x1': -130.32021229158863,
              'y1': -160.79739265638358,
              'x2': -85.51349405445342,
              'y2': -238.85095119677285
            },
            {
              'id': 'right-elbow',
              'x1': -85.51349405445342,
              'y1': -238.85095119677285,
              'x2': -50.55876829792654,
              'y2': -321.78566737332943
            },
            {
              'id': 'right-wrist',
              'x1': -50.55876829792654,
              'y1': -321.78566737332943,
              'x2': 36.897803946582634,
              'y2': -343.03061903815905
            },
            {
              'id': 'right-hand',
              'x1': 36.897803946582634,
              'y1': -343.03061903815905,
              'x2': 96.88124388846765,
              'y2': -341.62103302153133
            },
            {
              'id': 'left-hip',
              'x1': 0,
              'y1': 0,
              'x2': -49.859990565634426,
              'y2': 33.37635901045597
            },
            {
              'id': 'left-knee',
              'x1': -49.859990565634426,
              'y1': 33.37635901045597,
              'x2': -169.38911993243326,
              'y2': 124.00078856901966
            },
            {
              'id': 'left-ankle',
              'x1': -169.38911993243326,
              'y1': 124.00078856901966,
              'x2': -235.02232364822387,
              'y2': 258.8795584699997
            },
            {
              'id': 'left-foot',
              'x1': -235.02232364822387,
              'y1': 258.8795584699997,
              'x2': -288.3565572599716,
              'y2': 286.3651824404959
            },
            {
              'id': 'right-hip',
              'x1': 0,
              'y1': 0,
              'x2': 51.96152422706631,
              'y2': 30
            },
            {
              'id': 'right-knee',
              'x1': 51.96152422706631,
              'y1': 30,
              'x2': 107.14040397185143,
              'y2': 169.48222549884463
            },
            {
              'id': 'right-ankle',
              'x1': 107.14040397185143,
              'y1': 169.48222549884463,
              'x2': 151.71318613132115,
              'y2': 312.70675932794967
            },
            {
              'id': 'right-foot',
              'x1': 151.71318613132115,
              'y1': 312.70675932794967,
              'x2': 142.40198714272765,
              'y2': 371.97986936441407
            }
          ],
          'grid': {
            'columns': 10,
            'rows': 16
          },
          'gridCell': {
            'width': 20,
            'height': 12.5
          },
          'svgSize': {
            'width': 200,
            'height': 200
          }
        }
        this.previewData = JSON.parse(this.previewSkeleton)
        // console.log(this.previewSkeleton)
      },
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
