<template lang="pug">
  div.row
    svg(ref="svgContainer" :width="svgSize.width" :height="svgSize.height")
      .q-mt-xl.row.justify-end
      defs
        pattern(id="cell-pattern", :width="gridCell.width", :height="gridCell.height", patternUnits="userSpaceOnUse")
          path(:d="`M ${gridCell.width} 0 L 0 0 0 ${gridCell.height}`",
               fill="none", stroke="gray", stroke-width="3")
      g#mr-griddle(:class="{'random': currentState === -1}" @click="handleSkeletonClick")
        rect(width="100%", height="100%", fill="url(#cell-pattern)")
        line(v-for="(line, i) in lines", :key="`line-${i}`",
          :stroke-width="strokeWidth"
          :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
          :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")
        //g#resize-handle(:transform="`translate(${gridCell.width * resizerFactor},${gridCell.height * resizerFactor})`")
          rect(
            x="-12", y="-12", width="24", height="24",
            @mousedown="initResizeCell", :class="{resizing: resizingCell}")
          polygon(points="12,-12 30,0 12,12", @mousedown="handleGridChange(-2,0)")
          polygon(points="-12,-12 -30,0 -12,12", @mousedown="handleGridChange(2,0)")
          polygon(points="-12,-12 0,-30 12,-12", @mousedown="handleGridChange(0,2)")
          polygon(points="-12,12 0,30 12,12", @mousedown="handleGridChange(0,-2)")
    q-slider.q-ma-md(fab,
      v-model="frameLength", :min="minFrameLength", :max="maxFrameLength"
      :step="20", fill-handle-always, color="primary",
      snap, style="width: 50vw")
</template>

<script>
  import Skeleton from '../lib/skeleton'
  import { DateTime } from 'luxon'

  const skeleton = new Skeleton()
  const UI_RESIZER_FACTOR = 2

  export default {
    props: [
      'play'
    ],
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
        currentState: -1,
        timerId: undefined,
        storeStates: false
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
      timerInterval () {
        return (1000 / 60.0) * this.frameLength
      }
    },
    mounted () {
      this.svgSize = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }
      this.gridCell = {
        width: this.svgSize.width / this.grid.columns,
        height: this.svgSize.height / this.grid.rows
      }
      this.updateFrame()
    },
    beforeDestroy () {
      clearInterval(this.timerId)
    },
    watch: {
      // nextFrame () {
      //   this.lastFrameTime = this.$store.state.time
      //   this.updateFrame()
      // }
      frameLength () {
        clearInterval(this.timerId)
        this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
      },
      play (playing) {
        if (playing) {
          this.timerIntervalHandler()
          this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
        }
        else {
          clearInterval(this.timerId)
        }
      }
    },
    methods: {
      timerIntervalHandler () {
        this.updateFrame()
      },
      handleClickLike (which) {
        this.currentState = which === this.currentState ? -1 : which
        this.storeState()
        this.updateSkeleton()
      },
      handleSkeletonClick () {
        clearInterval(this.timerId)
        this.updateFrame()
        this.$emit('stateChanged')
      },
      updateFrame () {
        skeleton.rotate()
        this.storeState()
        this.updateSkeleton()
      },
      storeState () {
        if (this.storeStates) {
          let annotation = {
            body: {
              type: 'MrGriddleSkeleton',
              purpose: 'linking',
              value: JSON.stringify(this.getState())
            },
            target: {
              type: 'Timeline',
              id: `${process.env.TIMELINE_BASE_URI}${process.env.MR_GRIDDLE_TIMELINE_UUID}`,
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
          }
          // console.log(annotation)
          this.$store.dispatch('annotations/post', annotation).then((resp) => {
            console.log(resp)
          })
        }
      },
      getState () {
        return {
          skeleton: skeleton.getEdges(),
          grid: this.grid,
          gridCell: this.gridCell,
          svgSize: this.svgSize
        }
      },
      handleGridChange (columns, rows) {
        this.grid.columns += columns
        this.grid.rows += rows
        this.updateSkeleton()
      },
      initSetFrameLength (event) {
        this.settingFrameLength = true
        this.frameLength = Math.min(180, Math.max(0, event.clientX - (this.svgSize.width - 200 - 20)))
      },
      initResizeCell () {
        this.resizingCell = true
      },
      doDragging (event) {
        if (this.resizingCell) {
          this.grid.columns = Math.round(this.svgSize.width / (event.clientX / UI_RESIZER_FACTOR))
          this.grid.rows = Math.round(this.svgSize.height / (event.clientY / UI_RESIZER_FACTOR))
          this.updateSkeleton()
        }
        if (this.settingFrameLength) {
          this.frameLength = Math.min(180, Math.max(0, event.clientX - (this.svgSize.width - 200 - 20)))
        }
      },
      stopDragging (event) {
        if (this.resizingCell) {
          this.grid.columns = Math.round(this.svgSize.width / (event.clientX / UI_RESIZER_FACTOR))
          this.grid.rows = Math.round(this.svgSize.height / (event.clientY / UI_RESIZER_FACTOR))
        }
        if (this.resizingCell || this.settingFrameLength) {
          this.updateFrame()
        }
        this.resizingCell = false
        this.settingFrameLength = false
      },
      handleStoreState () {
        this.storedStates.push(this.getState())
        // this.currentState = this.storedStates.length - 1
      },
      handleRemoveStoredState (i) {
        if (i >= 0 && i < this.storedStates.length) this.storedStates.splice(i, 1)
      },
      // handleKeyUp (event) {
      //   console.log(event)
      // },
      updateSkeleton () {
        let skeletonLines = []
        if (this.currentState === -1) {
          skeletonLines = skeleton.getEdges()
        }
        else {
          let state = this.storedStates[this.currentState]
          skeletonLines = state.skeleton
          // Vue.set(this, 'grid', state.grid)
          this.grid.columns = state.grid.columns
          this.grid.rows = state.grid.rows
          this.grid.width = state.grid.width
          this.grid.height = state.grid.height
        }
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

  svg
    position absolute
    top 0
    left 0

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
