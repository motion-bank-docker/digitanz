<template lang="pug">
  q-page.relative-position.min-height-auto

    // -------------------------------------------------------------------------------------------------------- zoom-box
    q-modal.bg-grey-1(v-model="zoom", minimized)
      //----- title
      .col.q-title.row.text-weight-bold.full-width.border-bottom(style="border-color: #e0e0e0; height: 60px;")
        .col-12
          q-btn.q-px-md.self-center.q-title.full-width.full-height.q-pr-md.overflow-hidden(flat, no-caps, no-ripple,
          align="center",
          @click="showLongTitle = true")
            .ellipsis.text-weight-bold {{ selectedRecipe.title }}
            q-popover#zoom-title(v-model="showLongTitle", anchor="center left", :offset="[-16, 0]")
              div.q-pa-md.q-title(@click="showLongTitle = false") {{ selectedRecipe.title }}

      //----- ingredients
      div(@click="handlerZoom(selectedRecipe.ingredients, selectedRecipe.index)",
      style="min-height: calc(100vh - 60px - 16px);")

        template(v-for="(ingredient, index) in selectedRecipe.ingredients")
          q-item.q-px-md.q-py-md.q-title.min-height-auto(style="font-weight: normal; line-height: 1.35;", multiline)
            q-item-side
              //
                q-btn.bg-grey-3.text-grey-9.q-mt-xs(round, flat, size="sm")
                  span(style="font-size: 12px;") {{ index + 1 }}
              .inactive {{ index + 1 }}
            q-item-main.text-grey-9.q-pl-sm {{ ingredient }}
          q-item-separator.q-ma-none

    // ------------------------------------------------------------------------------------------------------------ tabs
    q-tabs(animated, color="transparent", text-color="white", align="justify", v-model="selectedTab")

      q-tab.capitalize.q-caption.text-weight-medium.q-mb-md.text-center.q-pa-none.text-grey-9(name="tab-1", slot="title",
      :class="[selectedTab === 'tab-1' ? 'bg-grey-1' : '']", default) Eigene

      q-tab.capitalize.q-caption.text-weight-medium.q-mb-md.text-center.q-pa-none.text-grey-9(name="tab-2", slot="title",
      :class="[selectedTab === 'tab-2' ? 'bg-grey-1' : '']") Remixed

      // ----------------------------------------------------------------------------------------------- "meine rezepte"
      q-tab-pane.q-px-md.q-mb-sm.q-pt-none(keep alive, name="tab-1")

        //----- recipes list
        template(v-if="tempRecipes.length")
          .row
            div.col-xs-12.col-md-8.offset-md-2.col-lg-6.offset-lg-3.q-mb-md.round-borders.transition(v-for="(recipe, index) in tempRecipes",
            style="overflow: hidden;",
            :class="[option !== index ? 'bg-e4 text-grey-8' : 'text-grey-9 bg-grey-1']")
              div.relative-position(:class="{'bg-transparent': option === index}")
                q-radio.full-width.q-mb-none.word-break(v-model="option", :val="index")

                  div.full-width(@click="handlerRadiobutton(index)")
                    q-list.q-pa-none.no-border.full-width

                      //----- title
                      q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm(
                      :class="[option !== index ? 'text-grey-8' : 'text-grey-9']")
                        | {{ recipe.title }}

                      template(v-if="option === index")
                        q-item-separator.q-ma-none.bg-grey-5.opacity-4

                        //----- ingredient
                        template(v-for="(entry, i) in recipe.entries")
                          q-item.items-baseline.q-px-sm.q-py-sm.q-my-xs.min-height-auto
                            q-item-side.inactive {{ i + 1 }}
                            q-item-main {{ entry }}

                          q-item-separator.q-ma-none

                .absolute-top-right.transition.q-px-sm.q-pt-sm.q-mt-xs(:class="[option !== index ? 'leave-right-absolute' : '']")
                  info-button.q-mr-sm(:size="'sm'")
                    button-description(:iconName="'fullscreen'")
                      | Betrachte das Rezept auf ganzer Bildschirmfläche.
                    button-description.q-my-sm(:iconName="'edit'")
                      | Bearbeite das Rezept.
                    button-description(:iconName="'delete'")
                      | Lösche das Rezept.

                  //----- "zoom"-button
                  q-btn.bg-grey-4.text-grey-9(@click="handlerZoom(recipe, index)", round, size="sm", flat)
                    q-icon(name="fullscreen", size="18px")

                  //----- "edit"-button
                  q-btn.bg-grey-4.text-grey-9.q-mx-sm(@click="editRecipe(index)", round, size="sm", flat)
                    q-icon(name="edit", size="16px")

                  //----- "remove"-button
                  q-btn.bg-grey-4.text-grey-9(@click="removeFromTempRecipe(index)", round, size="sm", flat)
                    q-icon(name="delete", size="16px")

                info-button.absolute-top-right(v-if="option === undefined && index === 0", :size="'sm'")
                  | Dies ist ein Rezept. Durch antippen lässt es sich aus- und wieder abwählen.

        // ------------------------------------------------------------------------------- buttons below, "empty"-screen
        template
          //----- "empty"-screen
          div.row.items-center.height-empty(v-if="tempRecipes.length <= 0")
            q-item.text-center.q-ma-none.full-width
              q-item-main.q-mb-xl
                q-item-tile.inactive.q-title.text-weight-light
                  | Noch keine eigenen Rezepte vorhanden,
                  | füge eins hinzu.
                q-item-tile.q-pt-sm.q-mt-xs
                  q-btn.bg-grey-9.text-white(
                  @click="$router.push('/recipes/create')", round, flat)
                    q-icon(name="add")
                q-item-tile.q-mt-xs
                  info-button(:size="'md'")
                    | Rezepte sind eine Sammlung von Vorgaben, den Zutaten.
                    button-description.q-mt-xs(:iconName="'add'")
                      | Füge hier ein Rezept hinzu.

          //----- "add"-button
          q-item.q-pa-none.row.items-center(v-else)
            q-item-main.text-right
              q-btn.bg-grey-9.text-white(
              @click="$router.push('/recipes/create')", round, flat)
                q-icon(name="add")

      // --------------------------------------------------------------------------------------------- "gemixte rezepte"
      q-tab-pane.q-px-md.q-mb-sm.q-pt-none(keep alive, name="tab-2")

        //----- remixes
        .row
          div.col-xs-12.col-md-8.offset-md-2.col-lg-6.offset-lg-3.q-mb-md.q-mb-md.round-borders.transition(v-for="(remix, index) in tempRemixes",
          style="overflow: hidden;",
          :class="[optionRemix !== index ? 'bg-e4 text-grey-8' : 'text-grey-9 bg-grey-1', {'hidden': optionRemix !== index && remixStandalone}]")
            div.relative-position(:class="{'bg-transparent': optionRemix === index}")
              q-radio.full-width.q-mb-none.word-break(v-model="optionRemix", :val="index")

                div.full-width(@click="handlerRadiobuttonRemix(index)")
                  q-list.q-pa-none.no-border.full-width

                    //----- title
                    q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm(
                    :class="[optionRemix !== index ? 'text-grey-8' : 'text-grey-9']")
                      | {{ remix.title }}

                    template(v-if="optionRemix === index")
                      q-item-separator.q-ma-none.bg-grey-5.opacity-4

                      //----- ingredient
                      template(v-for="(entry, i) in remix.entries")
                        q-item.items-baseline.q-px-sm.q-py-sm.q-my-xs.min-height-auto
                          q-item-side.inactive {{ i + 1 }}
                          q-item-main {{ entry }}

                        q-item-separator.q-ma-none

              .absolute-top-right.transition.q-mr-sm.q-mt-sm.q-pt-xs(:class="[optionRemix !== index ? 'leave-right-absolute' : '']")
                info-button.q-mr-sm(:size="'sm'")
                  button-description(:iconName="'fullscreen'")
                    | Betrachte den Remix auf ganzer Bildschirmfläche.
                  button-description.q-my-sm(:iconName="'edit'")
                    | Bearbeite den Remix.
                  button-description(:iconName="'delete'")
                    | Lösche den Remix.

                //----- "zoom"-button
                q-btn.bg-grey-4.text-grey-9(@click="handlerZoom(remix, index)", round, size="sm", flat)
                  q-icon(name="fullscreen", size="18px")

                //----- "edit"-button
                q-btn.bg-grey-4.text-grey-9.q-mx-sm(@click="editRemix(index)", round, size="sm", flat)
                  q-icon(name="edit", size="16px")

                //----- "remove"-button
                q-btn.bg-grey-4.text-grey-9(@click="removeTempRemix(index)", round, size="sm", flat)
                  q-icon(name="delete", size="16px")

              info-button.absolute-top-right(v-if="optionRemix === undefined && index === 0", :size="'sm'")
                | Dies ist ein Remix. Durch antippen lässt es sich aus- und wieder abwählen.

        // ------------------------------------------------------------------------------- buttons below, "empty"-screen
        template

          //----- empty screen
          div.row.items-center.height-empty(v-if="tempRemixes.length <= 0")
            q-item.text-center.q-ma-none.full-width
              q-item-main.q-mb-lg(v-if="tempRecipes.length <= 0")
                q-item-tile.inactive.q-title.text-weight-light
                  | Du brauchst mindestens ein Rezept für einen Remix.

              q-item-main.q-mb-lg(v-else)
                q-item-tile.inactive.q-title.text-weight-light
                  | Noch keine Einträge,
                  br
                  | füge einen hinzu.
                q-item-tile.q-pt-sm.q-mt-xs
                  q-btn.bg-grey-9.text-white(v-if="allIngredients.length >= 4", @click="doRemix", round, flat)
                    q-icon(name="add")
                  q-btn.bg-grey-9.text-white(v-else, round, flat)
                    q-icon(name="add")
                    q-popover.bg-grey-9.q-px-md.q-py-sm.text-grey-1.q-caption.q-mx-sm.q-mb-sm(touch-position,
                    anchor="bottom middle", self="top middle")
                      | In deinen erstellten Rezepten müssen zusammen mindestens vier Zutaten verwendet worden sein um einen Remix erstellen zu können.
                q-item-tile.q-mt-xs
                  info-button(:size="'md'")
                    | Remixe sind Rezepte, die aus den Zutaten der bisher von dir erstellten Rezepte zufallsgeneriert werden.
                    button-description.q-mt-xs(:iconName="'add'")
                      | Lass hier einen neuen Remix erstellen.

          //----- "add"-button
          q-item.q-pa-none.row.items-center(v-else)
            q-item-main.text-right
              q-btn.bg-grey-9.text-white(v-if="allIngredients.length >= 4", @click="doRemix", round, flat)
                q-icon(name="add")
              q-btn.bg-grey-9.text-white(v-else, round, flat)
                q-icon(name="add")
                q-tooltip.bg-transparent.text-grey-9.q-px-md(anchor="bottom middle", self="top middle")
                  .bg-white.q-px-sm.q-py-sm.round-borders.shadow-1 In deinen erstellten Rezepten müssen zusammen mindestens vier Zutaten verwendet worden sein um einen Remix erstellen zu können.

</template>

<script>
  import { mapGetters } from 'vuex'
  import Chance from 'chance'
  import Sentencer from 'sentencer'
  import infoButton from '../../components/InfoButton'
  import buttonDescription from '../../components/ButtonDescription'

  const chance = new Chance()
  export default {
    components: {
      infoButton,
      buttonDescription
    },
    data () {
      return {
        selectedTab: undefined,
        option: undefined,
        optionRemix: undefined,
        zoom: false,
        selectedRecipe: {index: undefined, ingredients: undefined, title: undefined},
        showLongTitle: false
      }
    },
    computed: {
      ...mapGetters({
        tempRecipes: 'recipes/getTempRecipes',
        allIngredients: 'recipes/getAllIngredients',
        tempRemixes: 'recipes/getTempRemixes'
      })
    },
    mounted () {
      if (this.$route.params.target === 'remix') this.selectedTab = 'tab-2'
    },
    methods: {
      handlerZoom (recipe, index) {
        console.log(recipe)
        this.selectedRecipe.ingredients = recipe.entries
        this.selectedRecipe.title = recipe.title
        this.selectedRecipe.index = index
        this.zoom = !this.zoom
      },
      removeTempRemix (val) {
        this.$store.commit('recipes/removeFromTempRemixes', val)
      },
      editRemix (val) {
        this.$router.push({name: 'recipes.edit', params: {index: val, recipe: this.tempRemixes[val], type: 'remix'}})
      },
      editRecipe (val) {
        console.log(val)
        this.$router.push({name: 'recipes.edit', params: {index: val, recipe: this.tempRecipes[val], type: 'recipe'}})
      },
      removeFromTempRecipe (val) {
        this.$store.commit('recipes/removeFromTempRecipes', val)
        this.option = undefined
      },
      handlerRadiobutton (val) {
        if (val === this.option) this.option = undefined
      },
      handlerRadiobuttonRemix (val) {
        if (val === this.optionRemix) this.optionRemix = undefined
      },
      doRemix () {
        const remix = {
          entries: chance.shuffle(this.allIngredients).splice(0, chance.integer({min: 3, max: 4})),
          title: Sentencer.make('{{ adjective }} {{ noun }}')
        }
        this.$store.commit('recipes/addToTempRemixes', remix)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~variables'

  .leave-right-absolute
    right -50vw
  .height-empty
    height calc(100vh - 78px - 52px - 16px - 8px)
</style>

<style lang="stylus">
  .q-popover#zoom-title
    max-width calc(100vw - 16px - 16px)!important
</style>
