<template lang="pug">
  q-page.min-height-auto.q-px-md.q-pb-md

    // ---------------------------------------------------------------------------------------------------------- spaces
    .bg-e4.q-mt-md(v-for="(space, index) in tempSpaces")
      .relative-position.overflow-hidden.round-borders

        q-radio.q-mb-none(v-model="optionSpace", :val="index",
        :class="{'bg-grey-1': optionSpace === index}")
          .row.q-pa-md(@click="handlerRadiobutton(index)",
          :class="[space.length <= 3 ? 'justify-center' : '']")
            .col-3.q-px-md.q-py-sm.round-borders.relative-position(v-for="shape in space")
              shape-icon(:shape="shape", :cols="4")

        .absolute-top-right.transition.q-px-sm.q-pt-sm(:class="[optionSpace !== index ? 'leave-right-absolute' : '']")
          //----- "play"-button
          q-btn.bg-grey-3.text-grey-9.shadow-1(@click="handlerSpaceButtons('play', index)", flat, size="sm", round)
            q-icon(name="play_arrow", size="18px")

          //----- "edit"-button
          q-btn.bg-grey-3.text-grey-9.shadow-1.q-mx-sm(@click="handlerSpaceButtons('edit', index, space)", round, size="sm", flat)
            q-icon(name="edit", size="16px")

          //----- "delete"-button
          q-btn.bg-grey-3.text-grey-9.shadow-1(@click="handlerSpaceButtons('delete', index)", round, size="sm", flat)
            q-icon(name="delete", size="16px")

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
              @click="handlerSpaceButtons('add')", round, flat)
                q-icon(name="add")

      q-item.q-pa-none.row.items-center.q-mt-md(v-else)
        q-item-main.text-right
          q-btn.bg-grey-9.text-white(
          @click="handlerSpaceButtons('add')", round, flat)
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
        // selectedShapes: 'spaceTool/getSelectedShapes',
        tempSpaces: 'spaceTool/getTempSpaces',
        spaceIndex: 'space-tool/getSpaceIndex'
      })
    },
    mounted () {
    },
    methods: {
      handlerRadiobutton (index) {
        if (index === this.optionSpace) this.optionSpace = undefined
      },
      handlerSpaceButtons (action, index, space) {
        switch (action) {
        case 'add':
          this.$store.commit('spaceTool/setSelectedShapes', '')
          this.$store.commit('spaceTool/setSpaceIndex')
          this.$router.push('/space-tool/create')
          break
        case 'edit':
          this.$store.commit('spaceTool/setSelectedShapes', space)
          this.$store.commit('spaceTool/setSpaceIndex', index)
          this.$router.push('/space-tool/create')
          break
        case 'delete':
          this.$router.push('/space-tool/list')
          break
        case 'play':
          this.$router.push('/space-tool')
          break
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .height-empty
    height calc(100vh - 52px - 16px)
</style>
