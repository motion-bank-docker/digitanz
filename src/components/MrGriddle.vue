<template lang="pug">
  div
    div.row(style="margin-top: -1px;")
      svg(ref="svgContainer", :width="svgSize.width", :height="svgSize.height")
        .q-mt-xl.row.justify-end
        defs
          pattern(id="cell-pattern", :width="gridCell.width", :height="gridCell.height", patternUnits="userSpaceOnUse")
            path(:d="`M ${gridCell.width} 0 L 0 0 0 ${gridCell.height}`",
            fill="none", stroke="gray", :stroke-width="gridStrokeWidth")
        g#mr-griddle(:class="{'random': currentState === -1}", @click="handleSkeletonClick")
          rect(width="100%", height="100%", fill="url(#cell-pattern)")
          line(v-for="(line, i) in lines", :key="`line-${i}`",
          :stroke-width="strokeWidth",
          :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
          :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")
          //
            g#resize-handle(v-if="editSettings", :transform="`translate(${gridCell.width * resizerFactor},${gridCell.height * resizerFactor})`")
              rect(
              x="-12", y="-12", width="24", height="24")
                // @mousedown="initResizeCell", :class="{resizing: resizingCell}")
              polygon(points="12,-12 30,0 12,12", @mousedown="handleGridChange(-2,0)")
              polygon(points="-12,-12 -30,0 -12,12", @mousedown="handleGridChange(2,0)")
              polygon(points="-12,-12 0,-30 12,-12", @mousedown="handleGridChange(0,2)")
              polygon(points="-12,12 0,30 12,12", @mousedown="handleGridChange(0,-2)")
        g#time-to-next-update
          rect(v-if="timerId", x="0", y="0", :width="`${timeToNextFrame * 100}%`", height="3", fill="white")

      // slider
      .bg-dark.fixed-bottom.row.items-center(v-if="editSettings", style="border-top: 1px solid #666; height: 52px;")
        q-list.no-border.full-width
          q-item.q-pa-none(style="min-height: auto;")

            q-item-side.text-center(style="min-width: auto;",
            :class="{'hidden': states.length === 0}")

              q-btn.q-ml-md(@click="$emit('clickPlay')", :icon="$props.play ? 'stop' : 'play_arrow'",
              :class="[$props.play ? 'bg-white text-grey-10' : 'border']",
              round, size="sm", :disabled="states.length === 0")

            q-item-main.q-px-md
              q-slider(
              v-model="frameLength", color="white", :min="minFrameLength", :max="maxFrameLength",
              :step="20", fill-handle-always, snap)

      // edit-button
      q-page-sticky(expand position="top-right")
        q-btn.q-mr-md.q-mt-sm(@click="handleModeChange", icon="settings",
        round, size="sm", :class="[editSettings ? 'bg-white text-grey-10' : 'bg-dark border']")

    // "resize grid"-buttons
    q-page-sticky.text-center.q-mx-md.q-my-sm(v-if="editSettings", position="top-left")
      div
        q-btn.border.bg-dark(@click="handleGridChange(0,-1)", round, size="sm", icon="remove")
      div
        q-btn.border.bg-dark(@click="handleGridChange(-1,0)", round, size="sm", icon="remove")
        q-btn.border.invisible(round, size="sm")
        q-btn.border.bg-dark(@click="handleGridChange(1,0)", round, size="sm", icon="add")
      div
        q-btn.border.bg-dark(@click="handleGridChange(0,1)", round, size="sm", icon="add")

</template>

<script>
  import Skeleton from '../lib/skeleton'
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'

  const skeleton = new Skeleton()
  const UI_RESIZER_FACTOR = 2

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
        resizerFactor: UI_RESIZER_FACTOR,
        currentTime: 0,
        resizingCell: false,
        frameLength: 300,
        minFrameLength: 60 / 3,
        maxFrameLength: 60 * 6,
        lastFrameTime: undefined,
        timeToNextFrame: 1,
        settingFrameLength: false,
        lines: [],
        storedStates: [],
        currentState: -1,
        timerId: undefined,
        storeStates: false,
        map: undefined,
        editSettings: false,
        gridStrokeWidth: 0
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
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
      this.loadData()

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
      async user (val) {
        if (val) await this.loadData()
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
      async loadData () {
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        if (this.$route.params.uuid) {
          this.map = await this.$store.dispatch('maps/get', this.$route.params.uuid)
          if (this.map) {
            const query = {
              'target.id': this.map.id
            }
            const annotations = await this.$store.dispatch('annotations/find', query)
            if (annotations && annotations.items) {
              const states = annotations.items.map(a => {
                return JSON.parse(a.body.value)
              })
              this.storedStates = states
              this.setCurrentState(0)
            }
          }
        }
        this.$q.loading.hide()
      },
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
        if (this.editSettings) this.gridStrokeWidth = 1
        else this.gridStrokeWidth = 0
        this.$emit('editModeChanged', this.editSettings)
      },
      updateFrame () {
        skeleton.rotate()
        let nextState = (this.currentState + 1) % this.storedStates.length
        this.setCurrentState(nextState)
      },
      async saveSequence () {
        this.$q.loading.show({ message: this.$t('messages.saving_sequence') })
        if (!this.map) {
          const prefix = 'GriddleSequence '
          let newMap = {
            type: ['Timeline'],
            title: prefix + Date.now()
          }
          this.map = await this.$store.dispatch('maps/post', newMap)
          await this.$store.dispatch('acl/set', {uuid: this.map.uuid, role: 'digitanz', permissions: ['get']})
        }
        const oldStates = await this.$store.dispatch('annotations/find', {'target.id': this.map.id})
        if (oldStates && oldStates.items) {
          for (let oState of oldStates.items) {
            await this.$store.dispatch('annotations/delete', oState.uuid)
            await this.$store.dispatch('acl/delete', {uuid: oState.uuid, role: 'digitanz', permissions: ['get']})
          }
        }
        for (let state of this.storedStates) {
          let annotation = {
            body: {
              type: 'MrGriddleSkeleton',
              purpose: 'linking',
              value: JSON.stringify(state)
            },
            target: {
              type: 'Timeline',
              id: this.map.id,
              selector: {
                type: 'Fragment',
                value: state.timeStamp
              }
            }
          }
          const annot = await this.$store.dispatch('annotations/post', annotation)
          await this.$store.dispatch('acl/set', {uuid: annot.uuid, role: 'digitanz', permissions: ['get']})
        }
        // this.$router.push('/mr-griddles')
        this.$router.push('/profile')
        this.$q.loading.hide()
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
  @import '~variables'
  svg
    position absolute
    top 0
    left 0

  #mr-griddle
    line
      // griddle color
      // stroke $primary
      stroke white
      stroke-linecap round

  #mr-griddle.random
    line
      // stroke white
      stroke gray

  #resize-handle
    fill: white
    stroke: gray
    stroke-width: 2

  #resize-handle *:hover,
  #resize-handle.resizing
    fill: gray
</style>
