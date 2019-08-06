<template lang="pug">
  q-page.q-pb-xl.min-height-auto
    .shadow-1.round-borders.bg-e4.q-mt-md.row.q-mx-md.q-pa-sm(v-if="selectedShapes.length > 0")
      .col-3.q-px-md.q-py-sm.round-borders(v-for="(shape, index) in selectedShapes",
      @click="selectShape(shape, index)",
      :class="[selectedShape === index ? 'bg-grey-1' : '']")
        shape-icon(:shape="shape", :cols="4")

    .row.q-px-sm.q-mb-md.q-pb-md
      .col-3.q-px-sm.q-mt-md.text-center.round-borders.items-center(v-for="shape in shapes")

        div.shadow-1.q-px-sm.bg-e4.text-grey-8.round-borders(
        @click="addToSelection(shape)")
          shape-icon(:shape="shape", :cols="4")

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
    },
    methods: {
      selectShape (shape, index) {
        if (this.selectedShape === index) this.selectedShape = undefined
        else this.selectedShape = index
      },
      checkIfSelected (val) {
        return this.checkboxSelectedShapes.includes(val)
      },
      addToSelection (val) {
        this.selection.push(val)
        this.$store.commit('spaceTool/setSelectedShapes', this.selection)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
