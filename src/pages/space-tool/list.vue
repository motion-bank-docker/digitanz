<template lang="pug">
  q-page.min-height-auto.q-pb-md

    // ---------------------------------------------------------------------------------------------------------- spaces
    .row.q-px-md(v-for="(space, index) in tempSpaces")
      .col-xs-12.col-sm-10.offset-sm-1.col-md-8.offset-md-2.col-lg-6.offset-lg-3.bg-e4.q-mt-md
        .relative-position.overflow-hidden.round-borders

          info-button.absolute-top-left.q-mr-sm(v-if="index === 0 && optionSpace === undefined", :size="'md'")
            button-description(:iconName="'play_arrow'")
              | Space auswählen

          q-radio.q-mb-none(v-model="optionSpace", :val="index",
          :class="{'bg-grey-1': optionSpace === index}")
            .row.q-pa-md(@click="handlerRadiobutton(index)",
            :class="[space.length <= 3 ? 'justify-center' : '']")
              .col-3.q-px-md.q-py-sm.round-borders.relative-position(v-for="shape in space")
                shape-icon(:shape="shape", :cols="4", style="max-height: 50px;")

          .absolute-top-right.transition.q-px-sm.q-pt-sm(:class="[optionSpace !== index ? 'leave-right-absolute' : '']")

            info-button.q-mr-sm(v-if="optionSpace === index", :size="'md'")
              button-description(:iconName="'play_arrow'")
                | Zum Tool springen.
              button-description.q-my-xs(:iconName="'edit'")
                | Auswahl bearbeiten.
              button-description(:iconName="'delete'")
                | Auswahl löschen.

            //----- "play"-button
            q-btn.bg-grey-4.text-grey-9(@click="handlerSpaceButtons('play', index)", flat, size="sm", round)
              q-icon(name="play_arrow", size="18px")

            //----- "edit"-button
            q-btn.bg-grey-4.text-grey-9.q-mx-sm(@click="handlerSpaceButtons('edit', index, space)", round, size="sm", flat)
              q-icon(name="edit", size="16px")

            //----- "delete"-button
            q-btn.bg-grey-4.text-grey-9(@click="handlerSpaceButtons('delete', index)", round, size="sm", flat)
              q-icon(name="delete", size="16px")

    // --------------------------------------------------------------------------------------------------- buttons below
    template

      div.row.items-center.height-empty.relative-position(v-if="tempSpaces.length <= 0")

        .absolute-top-right
          <!--info-button.q-mt-sm(:size="'md'", :nr="'1'")-->
          info-button.q-mt-sm.q-mr-sm(:size="'md'")
            div Hier steht beschrieben was das Tool macht.
            //
              .q-mt-sm
                | Zur Zeit sind noch keine Einträge vorhanden. Mit dem Button bei
                info-number(:number="'2'")
                | kannst du Einträge hinzufügen.

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

            q-item-tile.q-mt-xs
              // info-button(:size="'md'", :nr="'2'")
              info-button(:size="'md'")
                button-description(:iconName="'add'")
                  | Füge hier einen Eintrag hinzu.

      q-item.q-pa-none.row.items-center.q-mt-md.q-mr-md(v-else)
        q-item-main.text-right
          q-btn.bg-grey-9.text-white(
          @click="handlerSpaceButtons('add')", round, flat)
            q-icon(name="add")
</template>

<script>
  import { mapGetters } from 'vuex'

  import shapeIcon from '../../components/ShapeIcon'
  import infoButton from '../../components/InfoButton'
  import infoNumber from '../../components/InfoNumber'
  import buttonDescription from '../../components/ButtonDescription'

  export default {
    components: {
      shapeIcon,
      infoButton,
      infoNumber,
      buttonDescription
    },
    data () {
      return {
        optionSpace: undefined
      }
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes',
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
          this.$store.commit('spaceTool/setCurrentShapes', '')
          this.$store.commit('spaceTool/setSpaceIndex')
          this.$router.push('/space-tool/create')
          break
        case 'edit':
          this.$store.commit('spaceTool/setCurrentShapes', space)
          this.$store.commit('spaceTool/setSpaceIndex', index)
          this.$router.push('/space-tool/create')
          break
        case 'delete':
          this.tempSpaces.splice(index, 1)
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
