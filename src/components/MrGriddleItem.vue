<template lang="pug">

  // div.q-mb-lg.text-center.shadow-2(@click="openModal")
  // div.q-mb-lg.text-center.shadow-2
  q-card.relative-position.q-mb-lg.relative-position.bg-dark
    q-window-resize-observable(@resize="onResize")
    // | {{ typeof buttonVisibility }}

    // mr-griddle-modal(ref="mrGriddleModal", :requestedHeight="requestedHeight", :screenSize="screenSize")
    // | {{ requestedHeight }}
    svg.bg-grey-10(ref="svgContainer", v-if="states && item", :width="requestedHeight", :height="requestedHeight")
      g#mr-griddle.random
        rect(width="100%", height="100%", fill="url(#cell-pattern)")
        line(v-for="(line, i) in lines", :key="`line-${i}`",
        :stroke-width="strokeWidth",
        :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
        :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")

    .row.bg-grey-10.items-center(v-else, :style="{height: requestedHeight + 'px'}")
      .full-width.q-px-md.q-mb-none.text-center Keine Vorschau verfügbar

    // div
      // slot(name="customButtons", :item="item")

    // .row.bg-blue.justify-around(slot="customButtons", slot-scope="{ item }")
    q-card-actions.row.justify-around
      slot(name="customButtons", :video="video")

      slot(v-if="displayMoreButton", name="moreButton", :video="video")
        q-btn.q-px-none(flat, size="sm", round, icon="more_vert", @click="showActionButton = !showActionButton")
          q-popover.bg-dark(:offset="[10, 0]")
            q-list
              slot(name="customMoreButtons", :video="video")
              q-item(v-if="displayMoreVisibility()").q-px-sm
                q-btn(round, flat, size="sm", icon="group", v-close-overlay, @click="toggleVisibility(video)")
              q-item(v-if="displayMoreDownload()").q-px-sm
                q-btn(round, flat, size="sm", icon="cloud_download", v-close-overlay, @click="downloadItem(video)")
              q-item(v-if="displayMoreDelete()").q-px-sm
                q-btn(round, flat, size="sm", icon="delete", v-close-overlay, @click="openDeleteModal(video)")

</template>

<script>
  import MrGriddleModal from './MrGriddleModal'

  const UI_RESIZER_FACTOR = 2

  export default {
    components: {
      MrGriddleModal
    },
    props: {
      buttons: Array,
      play: {
        type: Boolean
      },
      buttonVisibility: {
        type: String
      },
      requestedWidth: {
        // type: Number,
        default: null
      },
      requestedHeight: {
        // type: Number,
        default: null
      },
      states: {
        type: Array,
        default () {
          return []
        }
      },
      item: undefined
    },
    data () {
      return {
        currentState: -1,
        currentTime: 0,
        frameLength: 300,
        grid: {
          columns: 10,
          rows: 16
        },
        gridCell: {
          width: 0,
          height: 0
        },
        lastFrameTime: -1,
        lines: [],
        maxFrameLength: 60 * 6,
        minFrameLength: 60 / 3,
        resizingCell: false,
        resizerFactor: UI_RESIZER_FACTOR,
        showActionButton: false,
        settingFrameLength: false,
        svgSize: {
          width: 0,
          height: 0
        },
        timerId: -1
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
        return (1000 / 60.0) * (this.minFrameLength + (this.maxFrameLength - this.frameLength))
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
      this.currentState = -1
      if (this.states && this.states.length > 0) {
        this.currentState = 0
        this.frameLength = this.states[0].frameLength || Math.round(250 + Math.random() * 100)
      }
      this.drawSkeleton()
      if (this.play) this.startTimer()
    },
    watch: {
      states () {
        this.currentState = -1
        if (this.states && this.states.length > 0) {
          this.currentState = 0
          this.frameLength = this.states[0].frameLength || Math.round(250 + Math.random() * 100)
        }
        this.drawSkeleton()
      },
      play (playing) {
        if (playing) {
          this.startTimer()
        }
        else {
          clearInterval(this.timerId)
          this.timerId = undefined
        }
      }
    },
    methods: {
      openModal () {
        // console.log('bla')
        this.$refs.mrGriddleModal.show(this.states)
      },
      onResize () {
        this.gridCell = {
          width: this.requestedHeight / this.grid.columns,
          height: this.requestedHeight / this.grid.rows
        }
        // this.strokeWidth()
        // this.skeletonScale()
      },
      startTimer () {
        this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
        this.lastFrameTime = Date.now()
      },
      timerIntervalHandler () {
        this.currentState = (this.currentState + 1) % this.states.length
        this.drawSkeleton()
        this.lastFrameTime = Date.now()
      },
      displayMoreButton () {
        if (typeof this.buttons !== 'undefined') {
          for (let btn of this.buttons) {
            if (btn.includes('more')) {
              return true
            }
          }
          return false
        }
        else return false
      },
      displayMoreVisibility () {
        console.log('xxxxx', this.buttons)
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-visibility') > -1)
        else return false
      },
      displayMoreDelete () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-delete') > -1)
        else return false
      },
      displayMoreDownload () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-download') > -1)
        else return false
      },
      drawSkeleton () {
        let skeletonLines = []
        // draw previewData
        if (this.states && this.states.length > 0) {
          skeletonLines = this.states[this.currentState].skeleton
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
