<template lang="pug">
  q-page.min-height-auto.q-pa-md

    div(v-for="space in tempSpaces") {{ space }}

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
      q-item.q-pa-none.row.items-center(v-else)
        q-item-main.text-right
          q-btn.bg-grey-9.text-white(
          @click="$router.push('/space-tool/create')", round, flat)
            q-icon(name="add")
</template>

<script>
  import { mapGetters } from 'vuex'

  // import LostInSpace from '../../components/LostInSpace'
  export default {
    components: {
      // LostInSpace
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes',
        selectedShapes: 'spaceTool/getSelectedShapes',
        tempSpaces: 'spaceTool/getTempSpaces'
      })
    }
  }
</script>

<style lang="stylus" scoped>
  .height-empty
    height calc(100vh - 52px - 16px)
</style>
