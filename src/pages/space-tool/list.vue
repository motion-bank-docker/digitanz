<template lang="pug">
  q-page.min-height-auto.q-px-md.q-pb-md

    // ---------------------------------------------------------------------------------------------------------- spaces
    .shadow-1.round-borders.bg-e4.q-mt-md(v-for="(space, index) in tempSpaces")
      q-radio.q-mb-none.round-borders(v-model="optionSpace", :val="index",
      :class="{'bg-grey-1': optionSpace === index}")

        .row(@click="handlerRadiobutton(index)")
          .col-3.q-px-md.q-py-sm.round-borders.relative-position(v-for="shape in space")
            shape-icon(:shape="shape", :cols="4")

    // --------------------------------------------------------------------------------------------------- buttons below
    template
      div.row.items-center.height-empty(v-if="tempSpaces.length <= 0")
        q-item.text-center.q-ma-none.full-width
          q-item-main.q-mb-xl
            q-item-tile.inactive.q-title.text-weight-light
              | Noch keine Einträge,
              br
              | füge einen hinzu.
            q-item-tile.q-pt-sm.q-mt-xs
              q-btn.bg-grey-9.text-white(
              @click="$router.push('/space-tool/create')", round, flat)
                q-icon(name="add")
      q-item.q-pa-none.row.items-center.q-mt-md(v-else)
        q-item-main.text-right
          q-btn.bg-grey-9.text-white(
          @click="$router.push('/space-tool/create')", round, flat)
            q-icon(name="add")
</template>

<script>
  import { mapGetters } from 'vuex'

  import shapeIcon from '../../components/ShapeIcon'

  export default {
    components: {
      shapeIcon
    },
    data () {
      return {
        optionSpace: undefined
      }
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes',
        selectedShapes: 'spaceTool/getSelectedShapes',
        tempSpaces: 'spaceTool/getTempSpaces'
      })
    },
    methods: {
      handlerRadiobutton (index) {
        if (index === this.optionSpace) this.optionSpace = undefined
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .height-empty
    height calc(100vh - 52px - 16px)
</style>
