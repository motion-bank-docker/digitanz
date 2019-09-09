<template lang="pug">
  q-page.q-pb-xl.min-height-auto

    // --------------------------------------------------------------------------------------------------- selection-box
    .row.q-px-md
      .col-xs-12.col-sm-10.offset-sm-1.col-md-8.offset-md-2.col-lg-6.offset-lg-3.bg-e4.q-mt-md.round-borders.relative-position
        //----- shapes
        template(v-if="currentShapes.length > 0")
          .row.q-pa-sm.relative-position(:class="[currentShapes.length <= 3 ? 'justify-center' : '']")

            .col-3.q-px-md.q-py-sm.round-borders.relative-position(
            v-for="(shape, index) in currentShapes",
            @click="selectShape(shape, index)",
            :class="[selectedShapeIndex === index ? 'bg-grey-1' : '']")

              //----- number
              .absolute-top-left.q-caption.q-pa-xs.round-borders.inactive(
              v-if="selectedShapeIndex === index")
                | {{ index + 1 }}

              //----- icon
              shape-icon(:shape="shape", :cols="4", style="max-height: 50px;")

        template(v-else)
          .q-pa-sm.text-center.relative-position
            .inactive
              | Noch keine Form ausgewählt.

        template(v-if="selection.length")
          // info-button.absolute-top-right(:size="'sm'", :nr="'2'")
          info-button.absolute-top-right(:size="'md'")
            | Tippe auf eine Form, um sie auszuwählen und dann verschieben oder löschen zu können.
            | Tippe erneut, um die Auswahl aufzuheben.

    //----- buttons
    template
      .row
        .col-xs-12.col-sm-10.offset-sm-1.col-md-8.offset-md-2.col-lg-6.offset-lg-3
          .relative-position.overflow-hidden.q-mx-md(:class="[currentShapes.length > 0 ? 'height-46' : 'height-0']")
            .q-pt-sm.absolute-top-left.transition
              q-btn.shadow-1.text-grey-9(@click="handlerPlayButton()", round, flat, size="sm")
                q-icon(name="play_arrow", size="18px")

              template(v-if="selection.length && selectedShapeIndex === undefined")
                // info-button.q-ml-sm(:size="'sm'", :nr="'4'")
                info-button.q-ml-sm(:size="'sm'")
                  button-description(:iconName="'play_arrow'")
                    | Änderungen übernehmen und weiter in die Tool-Ansicht wechseln.

            .q-pt-sm.absolute-top-right.transition(
            :class="[currentShapes.length > 0 ? '' : 'leave-right']")

              template(v-if="selectedShapeIndex >= 0")
                // info-button.q-mr-sm(:size="'sm'", :nr="'3'")
                info-button.q-mr-sm(:size="'sm'")
                  button-description(:iconName="'keyboard_arrow_left'")
                    | Auswahl nach links verschieben.
                  button-description.q-my-xs(:iconName="'keyboard_arrow_right'")
                    | Auswahl nach rechts verschieben.
                  button-description(:iconName="'delete'")
                    | Auswahl entfernen.

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
      .col-xs-12.col-sm-10.offset-sm-1.col-md-8.offset-md-2.col-lg-6.offset-lg-3.row
        //----- shapes
        .col-3.q-px-sm.q-mt-md.text-center.items-center(v-for="shape in shapes")
          .q-px-md.bg-e4.text-grey-8.round-borders.q-py-sm(@click="addToSelection(shape)")
            shape-icon(:shape="shape", :cols="4", style="max-height: 50px;")

        //----- help-spinner
        template(v-if="selection.length === 0")
          .col-3.q-px-sm.q-mt-md.text-center.items-center
            // info-button.q-mt-sm(:size="'md'", :nr="'1'")
            info-button.q-mt-sm(:size="'md'")
              | Füge eine oder mehrere Formen hinzu indem du auf eines der Symbole klickst.
              | Diese erscheinen in der Box über den Symbolen.

        //----- "shape editor"-button
        //
          .col-3.q-mt-md.items-center.row
            .text-center.full-width
              q-btn.self-center(@click="$router.push('')", round, disabled)
                q-icon(name="edit")
    // --------------------------------------------------------------------------------------------------- buttons below
    .fixed-bottom-left.q-px-md.q-mt-md.q-mb-md
      .relative-position
        .absolute-bottom-left.transition(style="white-space: nowrap;")
          q-btn.bg-grey-9.text-grey-2(@click="$router.push('/space-tool/list')", round, flat)
            q-icon(name="clear")

          template(v-if="selection.length && selectedShapeIndex === undefined")
            info-button(:size="'md'")
              | Vorgang abbrechen, Änderungen werden nicht übernommen.

    .fixed-bottom-right.q-px-md.q-mt-md.q-mb-md
      .relative-position
        .absolute-bottom-right.transition(:class="[currentShapes.length <= 0 ? 'leave-right' : '']")
          div(style="white-space: nowrap;")

            template(v-if="selection.length && selectedShapeIndex === undefined")
              // info-button(:size="'md'", :nr="'5'")
              info-button(:size="'md'")
                | Änderungen übernehmen und zur Übersicht zurückkehren.

            q-btn(
            @click="handlerCreateButton()", round, flat,
            :class="[currentShapes.length <= 0 ? '' : 'bg-grey-9 text-grey-2']",
            :disabled="currentShapes.length <= 0")
              q-icon(name="check")
</template>

<script>
  import { mapGetters } from 'vuex'

  import shapeIcon from '../../components/ShapeIcon'
  import infoButton from '../../components/InfoButton'
  import infoNumber from '../../components/InfoNumber'
  import buttonDescription from '../../components/ButtonDescription'

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
      infoNumber,
      shapeIcon,
      buttonDescription
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
      handlerPlayButton () {
        this.handlerCreateButton()
        this.$router.push('/space-tool')
      },
      handlerCreateButton () {
        if (this.editMode === 'new') this.addSpace()
        else {
          this.saveEditedSpace()
          this.$router.push('/space-tool/list')
        }
      },
      saveEditedSpace () {
        this.tempSpaces.splice(this.spaceIndex, 1, this.selection)
        // this.$router.push('/space-tool/list')
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
