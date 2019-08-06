<template lang="pug">
  q-page.q-pb-xl.min-height-auto

    //----- selection-box
    .shadow-1.round-borders.bg-e4.q-mt-md.q-mx-md
      template(v-if="selectedShapes.length > 0")
        q-item.row.q-pa-sm
          .col-3.q-px-md.q-py-sm.round-borders(v-for="(shape, index) in selectedShapes",
          @click="selectShape(shape, index)",
          :class="[selectedShape === index ? 'bg-grey-1 shadow-1' : '']")
            shape-icon(:shape="shape", :cols="4")
        .q-pa-sm.text-right
          q-btn.bg-grey-3.shadow-1(:disabled="selectedShape === undefined", size="sm", round, flat)
            q-icon(name="keyboard_arrow_left", size="16px")
          q-btn.bg-grey-3.shadow-1.q-ml-sm.q-mr-md(:disabled="selectedShape === undefined", size="sm", round, flat)
            q-icon(name="keyboard_arrow_right", size="16px")
          q-btn.bg-grey-3.shadow-1(@click="removeSelectedShape()",
          :disabled="selectedShape === undefined", size="sm", round, flat)
            q-icon(name="delete", size="16px")
      template(v-else)
        .q-pa-sm
          | Leer

    //----- shapes
    .row.q-px-sm.q-mb-md.q-pb-md
      .col-3.q-px-sm.q-mt-md.text-center.round-borders.items-center(v-for="shape in shapes")

        div.shadow-1.q-px-sm.bg-e4.text-grey-8.round-borders(
        @click="addToSelection(shape)")
          shape-icon(:shape="shape", :cols="4")

    //----- okay-button
    .fixed-bottom-right.q-px-md.q-mt-md.q-mb-md
      q-btn(@click="$router.push('/space-tool')", round, flat,
      :class="[selectedShapes.length <= 0 ? '' : 'bg-grey-9 text-grey-2']",
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
      removeSelectedShape () {
        this.selection.splice(this.selectedShape, 1)
        this.selectedShape = undefined
      },
      selectShape (shape, index) {
        if (this.selectedShape === index) this.selectedShape = undefined
        else this.selectedShape = index
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
</style>
