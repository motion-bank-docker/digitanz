<template lang="pug">
  div
    div.row(style="margin-top: -1px;")

      //----- mr griddle
      svg(ref="svgContainer", :width="svgSize.width", :height="svgSize.height")

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
      .fixed-bottom.row.items-center.transition.bg-grey-3(
      style="height: 52px; border-top: 1px solid #dadada;",
      :class="{'leave-bottom' : !editSettings}")
        q-item.q-pa-none.full-width(style="min-height: auto;")

          q-item-side.q-ml-md(style="min-width: auto;",
          :class="{'hidden': states.length === 0}")

            q-btn.text-white.q-pa-none.text-grey-9.bg-transparent(@click="$emit('clickPlay')", :icon="$props.play ? 'pause' : 'play_arrow'",
            :class="{'leave-bottom': states.length <= 0}", flat,
            size="lg", no-ripple,
            :disabled="states.length === 0")

          q-item-main.q-px-md
            q-slider(
            v-model="frameLengthSlider", color="grey-9", :min="minFrameLength", :max="maxFrameLength",
            :step="20", fill-handle-always, snap)

      //----- edit-button (top right)
      .absolute-top-right
        .relative-position

          .absolute-top-right.q-mr-md.q-mt-md.transition(:class="{'leave-right': editSettings}")
            .no-wrap
              info-button.q-mr-sm(v-if="!editSettings", :size="'sm'")
                button-description(:iconName="'edit'")
                  | Zum Edit-Modus: Änderungen am Grid oder an der Geschwindigkeit werden hier vorgenommen.

              q-btn.text-grey-9.shadow-1(@click="handleModeChange", round, flat, no-ripple, size="sm")
                q-icon(name="edit", size="16px")

          .absolute-top-right.q-mr-md.q-mt-md.transition(:class="{'leave-right': !editSettings}")
            q-btn.text-grey-9.shadow-1.bg-grey-3(@click="handleModeChange", round, flat, no-ripple, size="sm")
              q-icon(name="clear", size="16px")

    //----- "resize grid"-buttons (top left)
    .absolute-top-left.text-center.q-mx-md.q-mt-md.transition(:class="{'leave-left-absolute' : !editSettings}")
      div
        q-btn.shadow-1.bg-grey-3.text-grey-9(@click="handleGridChange(0,-1)", round, size="sm", flat)
          q-icon(name="remove", size="16px")
      div
        q-btn.shadow-1.bg-grey-3.text-grey-9(@click="handleGridChange(-1,0)", round, size="sm", flat)
          q-icon(name="remove", size="16px")

        q-btn.border.invisible(v-if="!statusInfoBox", round, size="sm")
        info-button(v-else, :size="'sm'")
          | Bearbeite hier das Grid.

        q-btn.shadow-1.bg-grey-3.text-grey-9(@click="handleGridChange(1,0)", round, size="sm", flat)
          q-icon(name="add", size="16px")
      div
        q-btn.shadow-1.bg-grey-3.text-grey-9(@click="handleGridChange(0,1)", round, size="sm", flat)
          q-icon(name="add", size="16px")

    .absolute-bottom.text-center.full-width.q-mb-xl(v-if="editSettings")
      info-button(:size="'sm'")
        | Stelle hier die Geschwindigkeit ein.

    .absolute-bottom-left.q-ml-md.q-mb-xl(v-if="storedStates.length")
      info-button(:size="'sm'")
        button-description(:iconName="'play_arrow'")
          | Starte und pausiere hier die Sequenz.
        .q-mt-sm Ändere die Geschwindigkeit im Edit-Mode (Button rechts oben).

    .absolute-bottom-right.q-mr-md.q-mb-xl(v-if="!editSettings && !storedStates.length")
      info-button(:size="'sm'")
        | Du befindest dich im Posen-Editor. Tippe auf die Fläche um eine neue Pose zu generieren.
        button-description.q-mt-sm(:iconName="'add'")
          | Füge die Pose der Sequenz hinzu.
        .q-mt-sm Du kannst maximal 5 Posen hinzufügen.

</template>

<script>
  import Skeleton from '../lib/skeleton'
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'

  import infoButton from './InfoButton'
  import buttonDescription from './ButtonDescription'

  const skeleton = new Skeleton()

  export default {
    components: {
      infoButton,
      buttonDescription
    },
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
        /*
        grid: {
          columns: 10,
          rows: 16
        },
        */
        gridCell: {
          width: 0,
          height: 0
        },
        // frameLength: 300,
        frameLengthSlider: undefined,
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
        storedStates: 'mrGriddle/getTempPoses',
        grid: 'mrGriddle/getTempGrid',
        frameLength: 'mrGriddle/getTempFrameLength',
        statusInfoBox: 'globalSettings/getStatusInfoBox'
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
      this.frameLengthSlider = this.frameLength
      this.svgSize = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      }
      console.log(this.$el.offsetHeight, this.$el)
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
      frameLengthSlider (val) {
        this.$store.commit('mrGriddle/setTempFrameLength', val)
      },
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
      stroke $grey-9
      stroke-linecap round

  #mr-griddle.random
    line
      // stroke $d4
      stroke $grey-9
</style>
