<template lang="pug">
  svg(width="100vw", height="100vh",
    @mousemove="doDragging", @mouseup="stopDragging")
    defs
      pattern(id="cell-pattern", :width="gridCell.width", :height="gridCell.height", patternUnits="userSpaceOnUse")
        path(:d="`M ${gridCell.width} 0 L 0 0 0 ${gridCell.height}`",
             fill="none", stroke="gray", stroke-width="3")
    g#mr-griddle(:class="{'random': currentState === -1}")
      rect(width="100%", height="100%", fill="url(#cell-pattern)")
      line(v-for="(line, i) in lines", :key="`line-${i}`",
           :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
           :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")
    g#interface
      g#liking(style="display:none")
        ellipse(cx="30", :cy="svgSize.height-30",
          rx="14", ry="14", @mousedown="handleLike", fill="red")
        rect(v-for="(state, k) in storedStates",
          :x="60 + k * 40", :y="svgSize.height - 40", width="20", height="20",
          :fill="currentState === k ? 'black' : 'white'", stroke="black", stroke-width="2",
          @mouseup="handleClickLike(k)")
      g#resize-handle(:transform="`translate(${gridCell.width * resizerFactor},${gridCell.height * resizerFactor})`")
        rect(
          x="-12", y="-12", width="24", height="24",
          @mousedown="initResizeCell", :class="{resizing: resizingCell}")
        polygon(points="12,-12 30,0 12,12", @mousedown="handleGridChange(-2,0)")
        polygon(points="-12,-12 -30,0 -12,12", @mousedown="handleGridChange(2,0)")
        polygon(points="-12,-12 0,-30 12,-12", @mousedown="handleGridChange(0,2)")
        polygon(points="-12,12 0,30 12,12", @mousedown="handleGridChange(0,-2)")
      g#speed-handle
        rect(:x="svgSize.width-20-200", :y="svgSize.height - 40",
          width="200", height="20", fill="white", stroke="grey",
          stroke-width="2", @mousedown="initSetFrameLength")
        rect(:x="svgSize.width-20-200 + frameLength", :y="svgSize.height - 40",
          width="20", height="20", fill="grey", stroke="none")
        rect(:x="svgSize.width-20-200-40", :y="svgSize.height - 40",
          width="20", height="20",
          :fill="storeStates ? 'red' : 'lightgray'", :stroke="storeStates ? 'grey' : 'red'",
          stroke-width="2"
          @mousedown="storeStates = !storeStates")
</template>

<script>
  import Skeleton from '../lib/skeleton'
  import { DateTime } from 'luxon'

  const skeleton = new Skeleton()
  const UI_RESIZER_FACTOR = 2

  export default {
    data () {
      return {
        grid: {
          columns: 9,
          rows: 16
        },
        resizerFactor: UI_RESIZER_FACTOR,
        currentTime: 0,
        resizingCell: false,
        settingFrameLength: false,
        lastFrameTime: -1,
        frameLength: 20,
        lines: [],
        storedStates: [],
        currentState: -1,
        timerId: undefined,
        storeStates: false
      }
    },
    computed: {
      svgSize () {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      gridCell () {
        return {
          width: this.svgSize.width / this.grid.columns,
          height: this.svgSize.height / this.grid.rows
        }
      },
      skeletonScale () {
        return Math.min(1, this.svgSize.width / 900)
      },
      timerInterval () {
        return (1000 / 60.0) * this.frameLength
      }
      // nextFrame () {
      //   let fps = (this.frameLength / 180) * 2
      //   return (this.$store.state.time - this.lastFrameTime) >= 1000 / fps
      // }
    },
    mounted () {
      this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
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
      handleLike () {
        this.storedStates.push(this.getState())
        this.currentState = this.storedStates.length - 1
        this.updateFrame()
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
        let x = Math.round(this.grid.columns / 2)
        let y = Math.round(this.grid.rows / 2)
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
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0

  #mr-griddle
    line
      stroke mediumvioletred
      stroke-width 20px
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
