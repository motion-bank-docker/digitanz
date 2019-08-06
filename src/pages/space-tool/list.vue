<template lang="pug">
  q-page.q-pb-xl.min-height-auto
    .q-mt-md.row(v-if="selectedShapes.length > 0")
      .col-3.q-px-md.q-py-sm(v-for="(shape, index) in selectedShapes")
        shape-icon(:shape="shape", :cols="4")

    .row.q-px-sm.q-mb-md.q-pb-md
      .col-3.q-px-sm.q-mt-md.text-center.round-borders.items-center(v-for="shape in shapes")

        input.hidden(v-model="checkboxSelectedShapes", type="checkbox", :id="shape.id", :value="shape.id")

        label.full-width.full-height.self-center(:for="shape.id")
          div.shadow-1.q-px-sm.bg-e4.text-grey-8.round-borders(
          @click="addToSelection(shape)")
            shape-icon(:shape="shape", :cols="4")

    .fixed-bottom-right.q-px-md.q-mt-md.q-mb-md
      q-btn(@click="$router.push('/space-tool')", round, flat,
      :class="[checkboxSelectedShapes.length <= 0 ? '' : 'bg-grey-9 text-grey-2']",
      :disabled="checkboxSelectedShapes.length <= 0")
        q-icon(name="check")

</template>

<script>
  import { mapGetters } from 'vuex'

  import shapeIcon from '../../components/ShapeIcon'

  export default {
    data () {
      return {
        checkboxSelectedShapes: [],
        selection: []
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
      if (this.selectedShapes.length > 0) this.checkboxSelectedShapes = this.selectedShapes
    },
    watch: {
      // checkboxSelectedShapes (val) {
      //   this.$store.commit('spaceTool/setSelectedShapes', val)
      // }
    },
    methods: {
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
