<template lang="pug">
  q-page.q-pb-xl.min-height-auto

    // --------------------------------------------------------------------------------------------------- selection-box
    .bg-e4.q-mt-md.q-mx-md.round-borders.relative-position

      // shapes
      template(v-if="currentShapes.length > 0")
        .row.q-pa-sm(:class="[currentShapes.length <= 3 ? 'justify-center' : '']")
          .col-3.q-px-md.q-py-sm.round-borders.relative-position(v-for="(shape, index) in currentShapes",
          @click="selectShape(shape, index)",
          :class="[selectedShapeIndex === index ? 'bg-grey-1' : '']")

            //----- number
            .absolute-top-left.q-caption.q-ma-xs.q-px-xs.round-borders.inactive(
            v-if="selectedShapeIndex !== index")
              | {{ index + 1 }}

            //----- icon
            shape-icon(:shape="shape", :cols="4")

          info-button.absolute-top-right(:size="'sm'", :nr="'4'")
            | Markiere eine Form um sie zu verschieben oder zu löschen.

      template(v-else)
        .q-pa-sm.text-center.relative-position
          .inactive
            | Noch keine Form ausgewählt.

          //
            .absolute-left.full-height.row.items-center
              info-button.q-ml-xs(:size="'sm'", :nr="'2'")
                | Ausgewählte Formen werden hier angezeigt, die Reihenfolge lässt sich hier bearbeiten.

    //----- buttons
    template
      .relative-position.overflow-hidden.q-mx-md(:class="[currentShapes.length > 0 ? 'height-46' : 'height-0']")
        .q-pt-sm.absolute-top-left.transition
          q-btn.shadow-1.text-grey-9(@click="$router.push('/space-tool')", round, flat, size="sm")
            q-icon(name="play_arrow", size="18px")
          info-button.q-ml-sm(:size="'sm'", :nr="'3'")
            | Geht zum Tool.

        .q-pt-sm.absolute-top-right.transition(
        :class="[currentShapes.length > 0 ? '' : 'leave-right']")

          info-button.q-mr-sm(:size="'sm'", :nr="'2'")
            | Die Reihenfolge lässt sich hier bearbeiten.

          q-btn.bg-grey-3.transition(@click="moveSelectedShape('left')",
          :disabled="checkIfDisabled('left')", size="sm", round, flat,
          :class="[checkIfDisabled('left') ? '' : 'shadow-1']")
            q-icon(name="keyboard_arrow_left", size="20px")

          q-btn.bg-grey-3.q-ml-sm.q-mr-md.transition(@click="moveSelectedShape('right')",
          :disabled="checkIfDisabled('right')", size="sm", round, flat,
          :class="[checkIfDisabled('right') ? '' : 'shadow-1']")
            q-icon(name="keyboard_arrow_right", size="20px")

          q-btn.bg-grey-3(@click="removeSelectedShape()",
          :disabled="selectedShapeIndex === undefined", size="sm", round, flat,
          :class="[this.selectedShapeIndex === undefined ? '' : 'shadow-1']")
            q-icon(name="delete", size="16px")

    // ---------------------------------------------------------------------------------------------------------- shapes
    .row.q-px-sm.q-mb-md.q-pb-sm

      //----- shapes
      .col-3.q-px-sm.q-mt-md.text-center.items-center(v-for="shape in shapes")
        .q-px-md.bg-e4.text-grey-8.round-borders(@click="addToSelection(shape)")
          shape-icon(:shape="shape", :cols="4")

      //----- help-spinner
      .col-3.q-px-sm.q-mt-md.text-center.items-center
        info-button.q-mt-sm(:size="'md'", :nr="'1'")
          | Füge eine oder mehrere Formen hinzu indem du auf eines der Symbole klickst.

      //----- "shape editor"-button
      //
        .col-3.q-mt-md.items-center.row
          .text-center.full-width
            q-btn.self-center(@click="$router.push('')", round, disabled)
              q-icon(name="edit")
    // --------------------------------------------------------------------------------------------------- buttons below
    .fixed-bottom-left.q-px-md.q-mt-md.q-mb-md
      .relative-position
        .absolute-bottom-left.transition
          q-btn.q-mr-sm.bg-grey-9.text-grey-2(@click="$router.push('/space-tool/list')", round, flat)
            q-icon(name="clear")

    .fixed-bottom-right.q-px-md.q-mt-md.q-mb-md
      .relative-position
        .absolute-bottom-right.transition(:class="[currentShapes.length <= 0 ? 'leave-right' : '']")
          div(style="white-space: nowrap;")

            q-btn.q-ml-sm(
            @click="handlerCreateButton()", round, flat,
            :class="[currentShapes.length <= 0 ? '' : 'bg-grey-9 text-grey-2']",
            :disabled="currentShapes.length <= 0")
              q-icon(name="check")
</template>

<script>
  import { mapGetters } from 'vuex'

  import shapeIcon from '../../components/ShapeIcon'
  import infoButton from '../../components/InfoButton'

  export default {
    data () {
      return {
        selection: [],
        selectedShapeIndex: undefined,
        selectedShape: undefined,
        editMode: undefined
      }
    },
    components: {
      infoButton,
      shapeIcon
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes',
        currentShapes: 'spaceTool/getCurrentShapes',
        spaceIndex: 'spaceTool/getSpaceIndex',
        tempSpaces: 'spaceTool/getTempSpaces'
      })
    },
    mounted () {
      if (this.currentShapes) {
        this.currentShapes.forEach(item => this.selection.push(item))
        this.editMode = 'edit'
      }
      else {
        this.editMode = 'new'
      }
    },
    watch: {
      selection () {
        this.$store.commit('spaceTool/setCurrentShapes', this.selection)
      }
    },
    methods: {
      handlerCreateButton () {
        if (this.editMode === 'new') this.addSpace()
        else this.saveEditedSpace()
      },
      saveEditedSpace () {
        this.tempSpaces.splice(this.spaceIndex, 1, this.selection)
        this.$router.push('/space-tool/list')
      },
      addSpace () {
        this.$store.commit('spaceTool/setTempSpaces', this.selection)
        this.$router.push('/space-tool/list')
      },
      checkIfDisabled (direction) {
        let position
        if (direction === 'left') position = this.selectedShapeIndex === 0
        if (direction === 'right') position = this.selectedShapeIndex === this.currentShapes.length - 1
        return this.selectedShapeIndex === undefined || position
      },
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
