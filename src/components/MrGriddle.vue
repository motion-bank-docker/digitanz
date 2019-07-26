<template lang="pug">
  div
    div.row(style="margin-top: -1px;")
      //----- mr griddle
      svg(ref="svgContainer", :width="svgSize.width", :height="svgSize.height")
        .q-mt-xl.row.justify-end
        defs
          pattern(id="cell-pattern", :width="gridCell.width", :height="gridCell.height", patternUnits="userSpaceOnUse")
            path.transition-200(:d="`M ${gridCell.width} 0 L 0 0 0 ${gridCell.height}`",
            fill="none", stroke="#bdbdbd", :stroke-width="gridStrokeWidth", :opacity="patternOpacity")
        g#mr-griddle(:class="{'random': currentState === -1}", @click="handleSkeletonClick")
          rect(width="100%", height="100%", fill="url(#cell-pattern)")
          line(v-for="(line, i) in lines", :key="`line-${i}`",
          :stroke-width="strokeWidth",
          :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
          :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")
        g#time-to-next-update
          rect(v-if="timerId", x="0", y="0", :width="`${timeToNextFrame * 100}%`", height="3", fill="e0e0e0")
        line.transition-200(x1="0", y1="0", x2="0", :y2="svgSize.height", stroke="#eeeeee", :stroke-width="gridStrokeWidth * 2",
        :opacity="patternOpacity")
        line.transition-200(:x1="svgSize.width", :y1="0", :x2="svgSize.width", :y2="svgSize.height", stroke="#eeeeee",
        :stroke-width="gridStrokeWidth * 2", :opacity="patternOpacity")
        //----- line above slider
        line.transition-200(x1="0", :y1="svgSize.height", :x2="svgSize.width", :y2="svgSize.height", stroke="#bdbdbd",
        :stroke-width="gridStrokeWidth", :opacity="patternOpacity")

      //----- slider
      .fixed-bottom.row.items-center.transition(
      style="height: 52px;",
      :class="{'leave-bottom' : !editSettings}")
        q-item.q-pa-none.full-width(style="min-height: auto;")

          q-item-side.q-ml-md(style="min-width: auto;",
          :class="{'hidden': states.length === 0}")

            q-btn.text-white.q-pa-none.text-grey-9(@click="$emit('clickPlay')", :icon="$props.play ? 'pause' : 'play_arrow'",
            :class="{'leave-bottom': states.length <= 0}", flat,
            size="lg", no-ripple,
            :disabled="states.length === 0")

          q-item-main.q-px-md
            q-slider(
            v-model="frameLength", color="grey-9", :min="minFrameLength", :max="maxFrameLength",
            :step="20", fill-handle-always, snap)

      //----- edit-button
      q-page-sticky(position="top-right")
        .relative-position
          q-btn.absolute-top-right.q-mr-sm.q-mt-sm.text-grey-9.transition(@click="handleModeChange", icon="edit",
          round, flat, no-ripple,
          :class="{'leave-right': editSettings}")
          q-btn.absolute-top-right.q-mr-md.q-mt-md.text-grey-2.bg-grey-9.transition(@click="handleModeChange", icon="clear",
          round, flat, no-ripple, size="sm",
          :class="{'leave-right': !editSettings}")

    //----- "resize grid"-buttons
    // q-page-sticky.text-center.q-mx-md.q-my-sm.bg-red(v-if="editSettings", position="top-left")
    q-page-sticky.text-center.q-mx-md.q-my-sm.transition(position="top-left", :class="{'leave-left-absolute' : !editSettings}")
      div
        q-btn.border.bg-grey-9.text-grey-1(@click="handleGridChange(0,-1)", round, size="sm", icon="remove", flat)
      div
        q-btn.border.bg-grey-9.text-grey-1(@click="handleGridChange(-1,0)", round, size="sm", icon="remove", flat)
        q-btn.border.invisible(round, size="sm")
        q-btn.border.bg-grey-9.text-grey-1(@click="handleGridChange(1,0)", round, size="sm", icon="add", flat)
      div
        q-btn.border.bg-grey-9.text-grey-1(@click="handleGridChange(0,1)", round, size="sm", icon="add", flat)

</template>

<script>
  import Skeleton from '../lib/skeleton'
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'

  const skeleton = new Skeleton()

  export default {
    props: [
      'play',
      'states'
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
        frameLength: 300,
        minFrameLength: 60 / 3,
        maxFrameLength: 60 * 6,
        lastFrameTime: undefined,
        timeToNextFrame: 1,
        settingFrameLength: false,
        lines: [],
        currentState: -1,
        timerId: undefined,
        editSettings: false,
        gridStrokeWidth: 0,
        patternOpacity: 0
      }
    },
    computed: {
      ...mapGetters({
        storedStates: 'mrGriddle/getTempPoses'
      }),
      strokeWidth () {
        return 20 * this.skeletonScale
      },
      skeletonScale () {
        const scale = Math.min(1, this.svgSize.width / 900)
        return scale
      },
      timerInterval () {
        return (1000 / 60.0) * (this.minFrameLength + (this.maxFrameLength - this.frameLength))
      }
    },
    mounted () {
      const _this = this

      this.svgSize = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }
      this.gridCell = {
        width: this.svgSize.width / this.grid.columns,
        height: this.svgSize.height / this.grid.rows
      }
      this.updateFrame()

      // this is a "driver" for the "time to update bar"
      setInterval(function () {
        const diff = Date.now() - _this.lastFrameTime
        const rel = diff / _this.timerInterval
        _this.timeToNextFrame = rel
      }, 1000 / 60)
    },
    beforeDestroy () {
      clearInterval(this.timerId)
      this.timerId = undefined
    },
    watch: {
      frameLength () {
        const wasPlaying = this.timerId
        clearInterval(this.timerId)
        if (wasPlaying) this.startTimer()
      },
      play (playing) {
        if (playing) {
          if (this.currentState === -1) {
            this.setCurrentState(0)
            skeleton.rotate()
            this.lastFrameTime = Date.now()
          }
          this.startTimer()
        }
        else {
          clearInterval(this.timerId)
          this.timerId = undefined
        }
      }
    },
    methods: {
      startTimer () {
        this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
        this.lastFrameTime = Date.now()
      },
      timerIntervalHandler () {
        this.updateFrame()
        this.lastFrameTime = Date.now()
      },
      handleSkeletonClick () {
        clearInterval(this.timerId)
        this.timerId = undefined
        this.updateFrame()
        this.setCurrentState(-1)
      },
      handleModeChange () {
        this.editSettings = !this.editSettings
        if (this.editSettings) {
          this.gridStrokeWidth = 1
          this.patternOpacity = 1
        }
        else {
          this.gridStrokeWidth = 0
          this.patternOpacity = 0
        }
        this.$emit('editModeChanged', this.editSettings)
      },
      updateFrame () {
        skeleton.rotate()
        let nextState = (this.currentState + 1) % this.storedStates.length
        this.setCurrentState(nextState)
      },
      getState () {
        return {
          skeleton: skeleton.getEdges(),
          grid: this.grid,
          gridCell: this.gridCell,
          svgSize: this.svgSize,
          frameLength: this.frameLength,
          timeStamp: DateTime.local().toISO()
        }
      },
      setCurrentState (nextState) {
        this.currentState = nextState >= 0 && nextState < this.storedStates.length ? nextState : -1
        this.updateSkeleton()
        this.$emit('stateChanged', this.currentState)
      },
      handleGridChange (columns, rows) {
        this.grid.columns += columns
        this.grid.rows += rows
        this.gridCell = {
          width: this.svgSize.width / this.grid.columns,
          height: this.svgSize.height / this.grid.rows
        }
        this.updateSkeleton()
      },
      handleStoreState () {
        if (this.storedStates.length < 5) {
          this.storedStates.push(this.getState())
          this.setCurrentState(this.storedStates.length - 1)
        }
      },
      handleRemoveStoredState (i) {
        if (i >= 0 && i < this.storedStates.length) {
          this.storedStates.splice(i, 1)
          if (i <= this.currentState) {
            this.setCurrentState(this.currentState - 1)
          }
          this.updateSkeleton()
        }
      },
      updateSkeleton () {
        let skeletonLines = []
        if (this.currentState === -1) {
          skeletonLines = skeleton.getEdges()
        }
        else {
          let state = this.storedStates[this.currentState]
          skeletonLines = state.skeleton
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
  @import '~variables'
  svg
    position absolute
    top 0
    left 0

  #mr-griddle
    line
      /*stroke white*/
      stroke $grey-9
      stroke-linecap round

  #mr-griddle.random
    line
      // stroke gray
      /*stroke #757575*/
      // stroke $ce
      stroke $d4

  /*
  #resize-handle
    fill: white
    stroke: gray
    stroke-width: 2

  #resize-handle *:hover,
  #resize-handle.resizing
    fill: gray
  */
</style>
