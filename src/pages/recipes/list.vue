<template lang="pug">
  q-page.relative-position

    //----- "delete"-modal
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteRecipe")

    q-tabs.q-px-md.q-pt-md(animated, color="transparent", text-color="white", align="justify", v-model="selectedTab",
    swipeable)

      // ---------------------------------------------------------------------------------------------------------- tabs
      q-tab.text-center.round-borders-5(v-if="!recipeStandalone", name="tab-1", slot="title", default,
      :class="[selectedTab === 'tab-1' ? 'bg-white text-grey-9' : 'text-grey-9']")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Meine Rezepte", flat, no-ripple)

      q-tab.text-center.round-borders-5(v-if="!recipeStandalone", name="tab-2", slot="title",
      :class="[selectedTab === 'tab-2' ? 'bg-white text-grey-9' : 'text-grey-9']")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Gemixte Rezepte", flat, no-ripple)

      // ----------------------------------------------------------------------------------------------- "meine rezepte"
      q-tab-pane.q-px-none.q-mb-sm(keep alive, name="tab-1")

        //----- recipes list
        template(v-if="tempRecipes.length")

          div.q-mt-md.shadow-1.round-borders.transition(v-for="(recipe, index) in tempRecipes",
          style="overflow: hidden;",
          :class="[option !== index ? 'bg-grey-4 text-grey-8' : 'text-grey-10 bg-white', {'hidden': option !== index && recipeStandalone}]")
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

              //----- "standalone"-button
                .absolute-bottom-right.transition.q-mb-sm.q-pr-sm(:class="[option !== index ? 'leave-right-absolute' : '']")
                  q-btn(icon="remove_red_eye", @click="handlerStandalone", round, size="sm", flat,
                  // :class="[recipeStandalone ? 'bg-grey-4 text-grey-10' : 'bg-dark border text-grey-4']")

            //
              template(v-if="option === index")
                q-item-separator.q-ma-none.bg-grey-9
                q-item.q-pa-none.min-height-auto.q-pa-sm(:class="[option !== index ? '' : '']")
                  q-item-side
                    q-btn(icon="remove_red_eye", @click="handlerStandalone", round, size="sm", flat,
                    // :class="[recipeStandalone ? 'bg-grey-4 text-grey-10' : 'bg-dark border text-grey-4 q-mr-md']")
                  q-item-main.text-right(v-if="!recipeStandalone")
                    q-btn.bg-grey-4.text-grey-10.q-mr-sm(icon="edit", @click="editRecipe(index)", round, size="sm", flat)
                    q-btn.bg-grey-4.text-grey-10(icon="delete", @click="removeFromTempRecipe(index)", round, size="sm", flat)

        //----- "add"-button
        .q-mt-md.text-right(v-if="!recipeStandalone")
          q-btn.bg-grey-9.text-white.q-mt-md(
          @click="$router.push('/recipes/create')", round)
            q-icon(name="add")

      // --------------------------------------------------------------------------------------------- "gemixte rezepte"
      // div.q-mt-md
      q-tab-pane.q-px-none.q-py-md(keep alive, name="tab-2")
        // .q-mb-md Gemixte Rezepte

        //----- remixes
        div.q-mt-md.shadow-3.round-borders.border-white-1.transition(v-for="(remix, index) in tempRemixes",
        style="overflow: hidden;",
        :class="[optionRemix !== index ? 'bg-body-background text-grey-8' : 'text-white bg-dark', {'hidden': optionRemix !== index && remixStandalone}]")
          div.relative-position(:class="{'bg-transparent': optionRemix === index}")
            q-radio.full-width.q-mb-none.word-break(v-model="optionRemix", :val="index",
            :class="{'q-pb-md': optionRemix === index}")

              div.full-width(@click="handlerRadiobuttonRemix(index)")
                q-list.q-pa-none.no-border.full-width

                  //----- title
                  q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm(
                  :class="[optionRemix !== index ? 'text-grey-8' : 'text-white']")
                    | {{ remix.title }}

                  template(v-if="optionRemix === index")
                    q-item-separator.q-ma-none.bg-grey-9

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
                q-btn.bg-grey-4.text-grey-10.q-mr-sm(icon="edit", @click="editRemix(index)", round, size="sm", flat)
                q-btn.bg-grey-4.text-grey-10(icon="delete", @click="removeFromTempRecipe(index)", round, size="sm", flat)

        //----- "add"-button
        div.text-center.bg-grey-4.text-grey-10.round-borders.q-mt-md.q-py-md(@click="doRemix")
          q-icon(name="add")

        //----- mixed recipes
        q-list.q-pa-none.no-border.no-padding
          q-item.items-baseline.q-px-none(v-for="recipe in remixed", :key="recipe.uuid")
            q-item-main(dark)
              q-item-tile
                q-btn.full-width.bg-grey-10(@click="$router.push('/recipes/edit/' + recipe.uuid)", align="left")
                  | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
            q-item-side
              q-item-tile
                q-btn(@click="openDeleteModal(recipe)", icon="delete")

    //
      content-block
        template(slot="title") Gemixte Rezepte
        template(slot="buttons")
        template(slot="content")
          q-list.q-pa-none.no-border.no-padding
            q-item.items-baseline.q-px-none(v-for="recipe in remixed", :key="recipe.uuid")
              q-item-main(dark)
                q-item-tile
                  // Loop durch array aller Rezepte, Titel anzeigen
                  q-btn.full-width.bg-grey-10(@click="$router.push('/recipes/edit/' + recipe.uuid)", align="left")
                    | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
              q-item-side
                q-item-tile
                  q-btn(@click="openDeleteModal(recipe)", icon="delete")
                  // q-btn(icon="delete")
                  // q-btn(icon="share")
            q-item.q-px-none
              q-item-main(dark)
                q-btn.full-width.text-white(@click="doRemix", color="primary", align="left")
                  | Neuer Remix
              q-item-side
                q-btn.display-none(icon="delete")
</template>

<script>
  import { mapGetters } from 'vuex'
  import Chance from 'chance'
  import ContentBlock from '../../components/ContentBlock'
  import ConfirmModal from '../../components/ConfirmModal'

  import {QInput, QBtn, QList, QItem, QPage, QItemMain, QItemSide, QItemTile, QModal, QModalLayout, QSearch, QAutocomplete, QChipsInput} from 'quasar'
  const chance = new Chance()
  export default {
    components: {
      ContentBlock,
      QInput,
      QBtn,
      QList,
      QItem,
      QPage,
      QItemMain,
      QItemSide,
      QItemTile,
      QModal,
      QModalLayout,
      QSearch,
      QAutocomplete,
      QChipsInput,
      ConfirmModal
    },
    data () {
      return {
        recipes: [],
        personal: [],
        remixed: [],
        selectedTab: undefined,
        option: undefined,
        optionRemix: undefined,
        recipeStandalone: false
      }
    },
    async mounted () {
      await this.loadRecipes()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        tempRecipes: 'recipes/getTempRecipes',
        allIngredients: 'recipes/getAllIngredients',
        tempRemixes: 'recipes/getTempRemixes'
      })
    },
    watch: {
      async user () {
        await this.loadRecipes()
      }
    },
    methods: {
      handlerStandalone () {
        console.log('bla')
        this.recipeStandalone = !this.recipeStandalone
      },
      editRemix (val) {
        this.$router.push({name: 'recipes.edit', params: {index: val, recipe: this.tempRemixes[val], type: 'remix'}})
      },
      editRecipe (val) {
        console.log(val)
        // this.$router.push('/recipes/create/' + this.tempRecipes[val])
        this.$router.push({name: 'recipes.edit', params: {index: val, recipe: this.tempRecipes[val], type: 'recipe'}})
      },
      removeFromTempRecipe (val) {
        this.$store.commit('recipes/removeFromTempRecipes', val)
        this.option = undefined
      },
      handlerRadiobutton (val) {
        if (val === this.option) {
          this.option = undefined
          // this.recipeStandalone = false
        }
        else {
          // this.recipeStandalone = true
        }
      },
      handlerRadiobuttonRemix (val) {
        if (val === this.optionRemix) this.optionRemix = undefined
      },
      async loadRecipes () {
        if (!this.user) return
        this.personal = await this.$store.dispatch('recipes/getPersonal', this.user.uuid)
        this.remixed = await this.$store.dispatch('recipes/getRemixed', this.user.uuid)
      },
      doRemix () {
        const remix = {
          entries: chance.shuffle(this.allIngredients).splice(0, chance.integer({min: 3, max: 4})),
          title: chance.name()
        }
        this.$store.commit('recipes/addToTempRemixes', remix)
      },
      openDeleteModal (uuid) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', uuid, 'buttons.delete')
      },
      async deleteRecipe (recipe) {
        console.log(recipe)
        await this.$store.dispatch('annotations/delete', recipe.uuid)
        await this.loadRecipes()
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
  /* .dashed
    border-style: dashed */
</style>
