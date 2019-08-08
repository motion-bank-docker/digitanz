<template lang="pug">
  q-page.relative-position.min-height-auto

    // -------------------------------------------------------------------------------------------------------- zoom-box
    q-modal.bg-grey-3(v-model="zoom", minimized)
      div.modal-inner.shadow-1

        //----- title
        .col.q-title.row.text-weight-bold.full-width.border-bottom(style="border-color: #e0e0e0; height: 60px;")
          .col-12
            q-btn.q-px-md.self-center.q-title.full-width.full-height.q-pr-md.overflow-hidden(flat, no-caps, no-ripple,
            align="left",
            @click="showLongTitle = true")
              .ellipsis.text-weight-bold {{ selectedRecipe.title }}
              q-popover#zoom-title(v-model="showLongTitle", anchor="center left", :offset="[-16, 0]")
                div.q-pa-md.q-title(@click="showLongTitle = false") {{ selectedRecipe.title }}

        //----- ingredients
        .column.items-center.row.q-pa-md(
        @click="handlerZoom(selectedRecipe.ingredients, selectedRecipe.index)",
        style="height: calc(100vh - 30px - 60px);")

          .col.q-title.row.full-width(v-for="(ingredient, index) in selectedRecipe.ingredients", style="font-weight: normal;")
            .self-start.text-grey-9 {{ ingredient }}

    // ------------------------------------------------------------------------------------------------------------ tabs
    q-tabs(animated, color="transparent", text-color="white", align="justify", v-model="selectedTab",
    swipeable)

      q-tab.text-center.round-borders-5.q-pl-md.q-pr-sm.q-py-md(v-if="!recipeStandalone", name="tab-1", slot="title", default,
      :class="[selectedTab === 'tab-1' ? 'text-grey-9' : 'text-grey-9']")
        q-btn.shadow-1.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        :class="[selectedTab === 'tab-1' ? 'bg-grey-1' : '']",
        label="Eigene", flat, no-ripple)

      q-tab.text-center.round-borders-5.q-pl-sm.q-pr-md.q-py-md(v-if="!recipeStandalone", name="tab-2", slot="title",
      :class="[selectedTab === 'tab-2' ? 'text-grey-9' : 'text-grey-9']")
        q-btn.shadow-1.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        :class="[selectedTab === 'tab-2' ? 'bg-grey-1' : '']",
        label="Remixed", flat, no-ripple)

      // ----------------------------------------------------------------------------------------------- "meine rezepte"
      q-tab-pane.q-px-md.q-mb-sm.q-pt-none(keep alive, name="tab-1")

        //----- recipes list
        template(v-if="tempRecipes.length")

          div.q-mb-md.shadow-1.round-borders.transition(v-for="(recipe, index) in tempRecipes",
          style="overflow: hidden;",
          :class="[option !== index ? 'bg-e4 text-grey-8' : 'text-grey-9 bg-grey-1', {'hidden': option !== index && recipeStandalone}]")
            div.relative-position(:class="{'bg-transparent': option === index}")
              q-radio.full-width.q-mb-none.word-break(v-model="option", :val="index",
              :class="{'q-pb-md': option === index}")

                div.full-width(@click="handlerRadiobutton(index)")
                  q-list.q-pa-none.no-border.full-width

                    //----- title
                    q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm.capitalize(
                    :class="[option !== index ? 'text-grey-8' : 'text-grey-9']")
                      | {{ recipe.title }}

                    template(v-if="option === index")
                      q-item-separator.q-ma-none.bg-grey-5.opacity-4

                      q-item.items-baseline.q-px-sm.q-py-sm.min-height-auto(v-for="(entry, i) in recipe.entries")

                        //----- ingredient position
                        //
                          q-item-side.q-pa-none.q-mt-md.min-height-auto.min-width-auto.text-grey-8(style="width: 30px;")
                            | {{ i + 1 }}.

                        //----- ingredient
                        q-item-main.q-pa-none.q-mt-md.min-height-auto {{ entry }}

              //----- "edit"-button
              //----- "remove"-button
              //----- "zoom"-button
              .absolute-top-right.transition.q-px-sm.q-pt-sm.q-mt-xs(:class="[option !== index ? 'leave-right-absolute' : '']")
                template(v-if="!recipeStandalone")
                  q-btn.bg-grey-3.text-grey-9.shadow-1.q-mr-sm(@click="editRecipe(index)", round, size="sm", flat)
                    q-icon(name="edit", size="16px")
                  q-btn.bg-grey-3.text-grey-9.shadow-1(@click="removeFromTempRecipe(index)", round, size="sm", flat)
                    q-icon(name="delete", size="16px")
              .absolute-bottom-right.transition(:class="[option !== index ? 'leave-right-absolute' : '']")
                  q-btn.text-grey-9.q-pr-sm.q-pb-none(icon="fullscreen", @click="handlerZoom(recipe, index)", size="lg", flat)

        //----- "add"-button
        template(v-if="!recipeStandalone")
          div.row.items-center.height-empty(v-if="tempRecipes.length <= 0")
            q-item.text-center.q-ma-none.full-width
              q-item-main.q-mb-xl
                q-item-tile.inactive.q-title.text-weight-light
                  | Noch keine Einträge,
                  br
                  | füge einen hinzu.
                q-item-tile.q-pt-sm.q-mt-xs
                  q-btn.bg-grey-9.text-white(
                  @click="$router.push('/recipes/create')", round, flat)
                    q-icon(name="add")
          q-item.q-pa-none.row.items-center(v-else)
            q-item-side.inactive(v-if="tempRecipes.length <= 0") Leer

            q-item-main.text-right
              q-btn.bg-grey-9.text-white(
              @click="$router.push('/recipes/create')", round, flat)
                q-icon(name="add")

      // --------------------------------------------------------------------------------------------- "gemixte rezepte"
      // div.q-mt-md
      q-tab-pane.q-px-md.q-mb-sm.q-pt-none(keep alive, name="tab-2")

        //----- remixes
        div.q-mb-md.shadow-1.round-borders.transition(v-for="(remix, index) in tempRemixes",
        style="overflow: hidden;",
        :class="[optionRemix !== index ? 'bg-e4 text-grey-8' : 'text-grey-9 bg-grey-1', {'hidden': optionRemix !== index && remixStandalone}]")
          div.relative-position(:class="{'bg-transparent': optionRemix === index}")
            q-radio.full-width.q-mb-none.word-break(v-model="optionRemix", :val="index",
            :class="{'q-pb-md': optionRemix === index}")

              div.full-width(@click="handlerRadiobuttonRemix(index)")
                q-list.q-pa-none.no-border.full-width

                  //----- title
                  q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm.capitalize(
                  :class="[optionRemix !== index ? 'text-grey-8' : 'text-grey-9']")
                    | {{ remix.title }}

                  template(v-if="optionRemix === index")
                    q-item-separator.q-ma-none.bg-grey-5.opacity-4

                    q-item.items-baseline.q-px-sm.q-py-sm.min-height-auto(v-for="(entry, i) in remix.entries")

                      //----- ingredient position
                      //
                        q-item-side.q-pa-none.q-mt-md.min-height-auto.min-width-auto.text-grey-8(style="width: 30px;")
                          | {{ i + 1 }}.

                      //----- ingredient
                      q-item-main.q-pa-none.q-mt-md.min-height-auto {{ entry }}

            //----- "edit"-button
            //----- "remove"-button
            .absolute-top-right.transition.q-mr-sm.q-mt-sm.q-pt-xs(:class="[optionRemix !== index ? 'leave-right-absolute' : '']")
              template(v-if="!recipeStandalone")
                q-btn.bg-grey-3.text-grey-9.shadow-1.q-mr-sm(@click="editRemix(index)", round, size="sm", flat)
                  q-icon(name="edit", size="16px")
                q-btn.bg-grey-3.text-grey-9.shadow-1(@click="removeTempRemix(index)", round, size="sm", flat)
                  q-icon(name="delete", size="16px")
            .absolute-bottom-right.transition(:class="[optionRemix !== index ? 'leave-right-absolute' : '']")
              q-btn.text-grey-9.q-pr-sm.q-pb-none(icon="fullscreen", @click="handlerZoom(remix, index)", size="lg", flat)

        //----- "add"-button
        template
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
                    q-tooltip.bg-transparent.text-grey-9.q-px-md(anchor="bottom middle", self="top middle")
                      .bg-white.q-px-sm.q-py-sm.round-borders.shadow-1 In deinen erstellten Rezepten müssen zusammen mindestens vier Zutaten verwendet worden sein um einen Remix erstellen zu können.

          q-item.q-pa-none.row.items-center(v-else)
            q-item-side.inactive(v-if="tempRemixes.length <= 0") Leer

            q-item-main.text-right
              q-btn.bg-grey-9.text-white(v-if="allIngredients.length >= 4", @click="doRemix", round, flat)
                q-icon(name="add")
              q-btn.bg-grey-9.text-white(v-else, round, flat)
                q-icon(name="add")
                q-tooltip.bg-transparent.text-grey-9.q-px-md(anchor="bottom middle", self="top middle")
                  .bg-white.q-px-sm.q-py-sm.round-borders.shadow-1 In deinen erstellten Rezepten müssen zusammen mindestens vier Zutaten verwendet worden sein um einen Remix erstellen zu können.

          //
            .text-center.border-bottom.border-color-grey-4.q-pb-md(v-if="tempRemixes.length <= 0") Leer

            .text-right(v-if="allIngredients.length >= 4")
              q-btn.bg-grey-9.text-white.q-mt-md(
              @click="doRemix", round, flat, :disabled="allIngredients.length < 4")
                q-icon(name="add")
            .text-center.q-mt-md.q-mt-md(v-else) Nicht genügend Zutaten vorhanden.

</template>

<script>
  import { mapGetters } from 'vuex'
  import Chance from 'chance'
  import Sentencer from 'sentencer'

  const chance = new Chance()
  export default {
    data () {
      return {
        selectedTab: undefined,
        option: undefined,
        optionRemix: undefined,
        recipeStandalone: false,
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
      handlerStandalone () {
        this.recipeStandalone = !this.recipeStandalone
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
    max-width calc(100vw - 16px - 16px - 16px - 16px)!important
</style>
