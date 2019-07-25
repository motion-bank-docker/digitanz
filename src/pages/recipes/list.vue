<template lang="pug">
  q-page.relative-position

    q-tabs(animated, color="transparent", text-color="white", align="justify", v-model="selectedTab",
    swipeable)

      // ---------------------------------------------------------------------------------------------------------- tabs
      q-tab.text-center.round-borders-5.q-pl-md.q-pr-sm.q-py-md(v-if="!recipeStandalone", name="tab-1", slot="title", default,
      :class="[selectedTab === 'tab-1' ? 'text-grey-9' : 'text-grey-9']")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        :class="[selectedTab === 'tab-1' ? 'bg-grey-1' : '']",
        label="Meine Rezepte", flat, no-ripple)

      q-tab.text-center.round-borders-5.q-pl-sm.q-pr-md.q-py-md(v-if="!recipeStandalone", name="tab-2", slot="title",
      :class="[selectedTab === 'tab-2' ? 'text-grey-9' : 'text-grey-9']")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        :class="[selectedTab === 'tab-2' ? 'bg-grey-1' : '']",
        label="Gemixte Rezepte", flat, no-ripple)

      // ----------------------------------------------------------------------------------------------- "meine rezepte"
      q-tab-pane.q-px-md.q-mb-sm(keep alive, name="tab-1")

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
                    q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm(
                    :class="[option !== index ? 'text-grey-6' : 'text-grey-8']")
                      | {{ recipe.title }}

                    template(v-if="option === index")
                      q-item-separator.q-ma-none.bg-grey-2

                      q-item.items-baseline.q-px-sm.q-py-none.min-height-auto(v-for="(entry, i) in recipe.entries")

                        //----- ingredient position
                        q-item-side.q-pa-none.q-mt-md.min-height-auto.min-width-auto.text-grey-8(style="width: 30px;")
                          | {{ i + 1 }}.

                        //----- ingredient
                        q-item-main.q-pa-none.q-mt-md.min-height-auto {{ entry }}

              //----- "edit"-button
              //----- "remove"-button
              .absolute-top-right.transition.q-px-sm.q-pt-sm.q-mt-xs(:class="[option !== index ? 'leave-right-absolute' : '']")
                template(v-if="!recipeStandalone")
                  q-btn.bg-grey-9.text-grey-2.q-mr-sm(icon="edit", @click="editRecipe(index)", round, size="sm", flat)
                  q-btn.bg-grey-9.text-grey-2(icon="delete", @click="removeFromTempRecipe(index)", round, size="sm", flat)

        //----- "add"-button
        template(v-if="!recipeStandalone")
          q-item.q-pa-none.row.items-center
            q-item-side.inactive(v-if="tempRecipes.length <= 0") Leer

            q-item-main.text-right
              q-btn.bg-grey-9.text-white(
              @click="$router.push('/recipes/create')", round, flat)
                q-icon(name="add")

      // --------------------------------------------------------------------------------------------- "gemixte rezepte"
      // div.q-mt-md
      q-tab-pane.q-px-md.q-mb-sm(keep alive, name="tab-2")

        //----- remixes
        div.q-mb-md.shadow-1.round-borders.transition(v-for="(remix, index) in tempRemixes",
        style="overflow: hidden;",
        :class="[optionRemix !== index ? 'bg-grey-4 text-grey-8' : 'bg-white text-grey-8', {'hidden': optionRemix !== index && remixStandalone}]")
          div.relative-position(:class="{'bg-transparent': optionRemix === index}")
            q-radio.full-width.q-mb-none.word-break(v-model="optionRemix", :val="index",
            :class="{'q-pb-md': optionRemix === index}")

              div.full-width(@click="handlerRadiobuttonRemix(index)")
                q-list.q-pa-none.no-border.full-width

                  //----- title
                  q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm(
                  :class="[optionRemix !== index ? '' : '']")
                    | {{ remix.title }}

                  template(v-if="optionRemix === index")
                    q-item-separator.q-ma-none.bg-grey-2

                    q-item.items-baseline.q-px-sm.q-py-none.min-height-auto(v-for="(entry, i) in remix.entries")

                      //----- ingredient position
                      q-item-side.q-pa-none.q-mt-md.min-height-auto.min-width-auto.text-grey-8(style="width: 30px;")
                        | {{ i + 1 }}.

                      //----- ingredient
                      q-item-main.q-pa-none.q-mt-md.min-height-auto {{ entry }}

            //----- "edit"-button
            //----- "remove"-button
            .absolute-top-right.transition.q-mr-sm.q-mt-sm.q-pt-xs(:class="[optionRemix !== index ? 'leave-right-absolute' : '']")
              template(v-if="!recipeStandalone")
                q-btn.bg-grey-9.text-grey-2.q-mr-sm(icon="edit", @click="editRemix(index)", round, size="sm", flat)
                q-btn.bg-grey-9.text-grey-2(icon="delete", @click="removeTempRemix(index)", round, size="sm", flat)

        //----- "add"-button
        template
          q-item.q-pa-none.row.items-center
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

  const chance = new Chance()
  export default {
    data () {
      return {
        selectedTab: undefined,
        option: undefined,
        optionRemix: undefined,
        recipeStandalone: false
      }
    },
    computed: {
      ...mapGetters({
        tempRecipes: 'recipes/getTempRecipes',
        allIngredients: 'recipes/getAllIngredients',
        tempRemixes: 'recipes/getTempRemixes'
      })
    },
    methods: {
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
          title: chance.name()
        }
        this.$store.commit('recipes/addToTempRemixes', remix)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .leave-right-absolute
    right -50vw
  .leave-left-absolute
    left -50vw
  .border-transparent
    border 1px solid transparent
  .border-transparent
    border 1px solid rgba(255, 255, 255, 0)
  .border-white-1
    border 1px solid rgba(255, 255, 255, .1)
  .border-white-3
    border 1px solid rgba(255, 255, 255, .3)
</style>

<style lang="stylus">
  .display-none
    opacity: 0
</style>
