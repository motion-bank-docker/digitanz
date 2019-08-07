<template lang="pug">
  q-page.q-pb-xl.min-height-auto

    //----- selection-box
    .shadow-1.round-borders.bg-e4.q-mt-md.q-mx-md
      template(v-if="selectedShapes.length > 0")
        q-item.row.q-pa-sm
          .col-3.q-px-md.q-py-sm.round-borders.relative-position(v-for="(shape, index) in selectedShapes",
          @click="selectShape(shape, index)",
          :class="[selectedShapeIndex === index ? 'bg-grey-1 shadow-1' : '']")

            //----- number
            .absolute-top-left.q-caption.q-ma-xs.q-px-xs.round-borders.bg-grey-3.shadow-1(
            v-if="selectedShapeIndex !== index")
              | {{ index + 1 }}

            //----- icon
            shape-icon(:shape="shape", :cols="4")

      template(v-else)
        .q-pa-sm.inactive.text-center
          | Noch keine Form ausgewählt.

    //----- buttons
    template
      .relative-position.overflow-hidden.q-mx-md(:class="[selectedShapes.length > 0 ? 'height-46' : 'height-0']")
        .q-pt-sm.absolute-top-right.transition(
        :class="[selectedShapes.length > 0 ? '' : 'leave-right']")

          q-btn.bg-grey-3.shadow-1(@click="moveSelectedShape('left')",
          :disabled="selectedShapeIndex === undefined", size="sm", round, flat)
            q-icon(name="keyboard_arrow_left", size="18px")

          q-btn.bg-grey-3.shadow-1.q-ml-sm.q-mr-md(@click="moveSelectedShape('right')",
          :disabled="selectedShapeIndex === undefined", size="sm", round, flat)
            q-icon(name="keyboard_arrow_right", size="18px")

          q-btn.bg-grey-3.shadow-1(@click="removeSelectedShape()",
          :disabled="selectedShapeIndex === undefined", size="sm", round, flat)
            q-icon(name="delete", size="16px")

    //----- shapes
    .row.q-px-sm.q-mb-md.q-pb-md
      .col-3.q-px-sm.q-mt-md.text-center.round-borders.items-center(v-for="shape in shapes")

        div.shadow-1.q-px-sm.bg-e4.text-grey-8.round-borders(
        @click="addToSelection(shape)")
          shape-icon(:shape="shape", :cols="4")

    //----- okay-button
    .fixed-bottom-right.q-px-md.q-mt-md.q-mb-md
      .relative-position
        q-btn.absolute-bottom-right.transition(@click="$router.push('/space-tool')", round, flat,
        :class="[selectedShapes.length <= 0 ? 'leave-right' : 'bg-grey-9 text-grey-2']",
        :disabled="selectedShapes.length <= 0")
          q-icon(name="check")

</template>

<script>
  import { mapGetters } from 'vuex'

  import shapeIcon from '../../components/ShapeIcon'

  export default {
    data () {
      return {
        selection: [],
        selectedShapeIndex: undefined,
        selectedShape: undefined
      }
    },
    components: {
      shapeIcon
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes',
        selectedShapes: 'spaceTool/getSelectedShapes'
      })
    },
    mounted () {
      if (this.selectedShapes.length > 0) this.selection = this.selectedShapes
    },
    watch: {
      selection () {
        this.$store.commit('spaceTool/setSelectedShapes', this.selection)
      }
    },
    methods: {
      moveSelectedShape (direction) {
        const tempSelection = this.selection
        const targetShape = tempSelection.splice(this.selectedShapeIndex, 1)
        if (direction === 'left') {
          tempSelection.splice(this.selectedShapeIndex - 1, 0, targetShape[0])
          this.selectedShapeIndex -= 1
        }
        else {
          tempSelection.splice(this.selectedShapeIndex + 1, 0, targetShape[0])
          this.selectedShapeIndex += 1
        }
      },
      removeSelectedShape () {
        this.selection.splice(this.selectedShapeIndex, 1)
        this.selectedShapeIndex = undefined
      },
      selectShape (shape, index) {
        if (this.selectedShapeIndex === index) {
          this.selectedShapeIndex = undefined
          this.selectedShape = undefined
        }
        else {
          this.selectedShapeIndex = index
          this.selectedShape = shape
        }
      },
      checkIfSelected (val) {
        return this.checkboxSelectedShapes.includes(val)
      },
      addToSelection (val) {
        this.selection.push(val)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .height-0
    height 0
  .height-46
    height 46px
</style>
