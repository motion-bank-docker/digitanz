<template lang="pug">
  .row.items-center.overflow-hidden(style="height: 52px;")

    q-item.q-pa-none.full-width.bg-grey-3

      //----- play-/stop-button
      q-item-side.q-ml-md.q-pr-xs(style="min-width: auto;")
        q-btn.text-white.q-pa-none.bg-transparent(@click="$emit('clickPlay')", :icon="$props.play ? 'pause' : 'play_arrow'",
        :class="[$props.play ? 'text-grey-9' : 'text-grey-9', {'leave-bottom': states.length <= 0}]", flat,
        size="lg", no-ripple,
        :disabled="states.length === 0")

      //----- state-buttons
      q-item-main.q-pl-sm.center-test(style="height: 52px;")
        .row.items-center
          template(v-for="(state, index) in states")
            div.overflow-hidden.center-test(:class="{'q-mr-sm': index < states.length - 1}", :style="{borderRadius: '3px', height: previewIcon.width + 'px'}")

              //----- SVG
              svg(ref="svgContainer", :width="previewIcon.width", :height="previewIcon.height", @click="handlerStateButton(state, index)",
              :class="[currentState === index ? 'stroke-normal' : 'stroke-normal']")

                // background
                rect(width="100%", height="100%", :fill="[currentState === index ? '#ffffff' : '#e0e0e0']")

                // figure
                g#mr-griddle
                  line(v-for="(line, i) in allSkeletons[index]", :key="`line-${i}`",
                  stroke-width="1", stroke-linecap="round",
                  :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
                  :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")

              //----- "delete"-popover
              q-popover.q-pa-xs.bg-white.no-shadow(anchor="top middle", self="bottom middle", :offset="[0, 20]", ref="popover",
              style="overflow: visible;")
                div.absolute-bottom.full-width.animation(
                  style="align-items: center; display: flex; justify-content: center;")
                  div.bg-white(style="width: 20px; height: 20px; transform: translateY(5px) rotate(45deg);")
                q-btn.text-grey-9(@click="deleteItem({state, index})", icon="delete", round, flat)

          info-button(v-if="states.length > 0 && states.length < 3", :size="'sm'")
            | Wähle eine Pose aus, indem du auf einen Grauen Punkt klickst. Eine ausgewählte Pose erkennt man hier am vergrößerten und dunklen Punkt.
            .q-mt-sm Durch erneutes Tippen: Löschen-Sprechblase zeigen und verstecken.
            button-description.q-mt-sm(:iconName="'delete'")
              | Ausgewählte Pose entfernen.
            .q-mt-sm
              | Tippst du auf die Figur wird die Posen-Auswahl aufgehoben und eine neue Pose generiert, die hinzugefügt werden kann.

      //----- add-butoon
      q-item-side.q-mr-md.absolute.transition(
      :class="{'leave-right': states.length >= 5}",
      style="min-width: auto; right: 0;")
        q-btn.no-padding.bg-grey-9.text-grey-1.transition(size="sm", flat, no-ripple,
        round, @click="$emit('clickAdd')",
        :disabled="states.length >= 5")
          q-icon(name="add", size="16px")

</template>

<script>
  import { mapGetters } from 'vuex'

  import ConfirmModal from '../components/ConfirmModal'
  import infoButton from './InfoButton'
  import buttonDescription from './ButtonDescription'

  export default {
    components: {
      ConfirmModal,
      infoButton,
      buttonDescription
    },
    props: [
      'states',
      'play',
      'currentState',
      'edit'
    ],
    data () {
      return {
        selectedStates: [],
        lines: [],
        skeletonScale: undefined,
        previewIcon: {width: undefined, height: undefined},
        grid: {rows: undefined, columns: undefined},
        allSkeletons: [],
        gridCell: undefined
      }
    },
    computed: {
      ...mapGetters({
        gridStore: 'mrGriddle/getTempGrid',
        svgSizeStore: 'mrGriddle/getSvgSize',
        cellRatio: 'mrGriddle/getCellRatio'
      })
    },
    mounted () {
      this.grid.rows = this.gridStore.rows
      this.grid.columns = this.gridStore.columns

      this.previewIcon.height = 52
      this.previewIcon.width = 52

      this.gridCell = {
        width: ((this.previewIcon.width / this.gridStore.columns) * this.cellRatio),
        height: (this.previewIcon.height / this.gridStore.rows)
      }

      this.skeletonScale = Math.min(1, this.previewIcon.width / 900)
    },
    watch: {
      gridStore: {
        handler (obj) {
          // this.previewIcon.width = this.previewIcon.height / (this.svgSizeStore.height / this.svgSizeStore.width)
          this.previewIcon.height = 52
          this.previewIcon.width = 52

          this.grid.rows = obj.rows
          this.grid.columns = obj.columns
          this.gridCell = {
            width: (this.previewIcon.width / obj.columns) * this.cellRatio,
            height: (this.previewIcon.height / obj.rows)
          }
          this.drawPreviewIcons()
        },
        deep: true
      },
      states () {
        this.drawPreviewIcons()
        this.drawSkeleton()
      }
    },
    methods: {
      handlerStateButton (state, index) {
        this.$emit('clickState', {state, index})
        if (this.$props.play) this.$emit('clickPlay')
      },
      deleteItem (item) {
        this.$refs.popover[item.index].hide()
        this.$emit('deleteItem', item)
      },
      drawPreviewIcons () {
        let skeletonLines = []
        this.allSkeletons = []

        let x = (this.grid.columns * this.cellRatio) / 2
        let y = this.grid.rows / 2
        let w = (this.previewIcon.width / this.grid.columns * this.cellRatio)
        let h = (this.previewIcon.height / this.grid.rows)
        console.log(x, y, w, h)

        for (let i = 0; i < this.states.length; i++) {
          skeletonLines = this.states[i].skeleton
          // let cellWidth = (this.previewIcon.height / this.gridStore.rows) * this.cellRatio
          // let countColumns = this.previewIcon.width / cellWidth

          // let x = countColumns / 2
          // let x = this.gridStore.columns / 2
          /*
          let x = 26 - this.cellRatio
          let y = this.gridStore.rows / 2
          let w = (this.previewIcon.width / this.gridStore.columns * this.cellRatio)
          let h = (this.previewIcon.height / this.gridStore.rows)
           */

          let skel = []
          skeletonLines.map((line) => {
            console.log('x', x)
            console.log('line.x1', line.x1)
            console.log('res', x + (line.x1 * this.skeletonScale / w))
            console.log('----------')
            skel.push({
              x1: x + (line.x1 * this.skeletonScale / w),
              y1: y + (line.y1 * this.skeletonScale / h),
              x2: x + (line.x2 * this.skeletonScale / w),
              y2: y + (line.y2 * this.skeletonScale / h)
            })
          })
          this.allSkeletons.push(skel)
        }
      },
      drawSkeleton () {
        let skeletonLines = []
        if (this.states && this.states.length > 0) {
          skeletonLines = this.states[this.currentState].skeleton
          // skeletonLines = this.states[0].skeleton
          let cellWidth = (this.svgSizeStore.height / this.gridStore.rows) * this.cellRatio
          let countColumns = this.svgSizeStore.width / cellWidth

          let x = countColumns / 2
          let y = this.grid.rows / 2
          let w = this.previewIcon.width / this.grid.columns * this.cellRatio
          let h = this.previewIcon.height / this.grid.rows
          this.lines = skeletonLines.map(line => {
            return {
              x1: x + line.x1 * this.skeletonScale / w,
              y1: y + line.y1 * this.skeletonScale / h,
              x2: x + line.x2 * this.skeletonScale / w,
              y2: y + line.y2 * this.skeletonScale / h
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .scaled
    transform scale(.5)

  // prevents fading of the arrow below the "delete"-popover for whatever reason
  .animation
    animation ease

  #mr-griddle.random
    line
      stroke #757575
  .stroke-light
    line
      /*stroke #eeeeee*/
      stroke #BDBDBD
  .stroke-normal
    line
      stroke #424242
  .center-test
    display flex
    align-items center
    /*justify-content center*/
</style>
