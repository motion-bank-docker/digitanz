<template lang="pug">
  q-page.relative-position
    //
    // DELETE MODAL
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteRecipe")

    q-tabs.q-px-md.q-pt-md(animated, color="transparent", text-color="white", align="justify", v-model="selectedTab")

      q-tab.text-center.round-borders(name="tab-1", slot="title", default, no-ripple,
      :class="[selectedTab === 'tab-1' ? 'bg-dark text-white border-white-1' : 'border-transparent']")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Meine Rezepte", flat, no-ripple)

      q-tab.text-center.round-borders(name="tab-2", slot="title",
      :class="[selectedTab === 'tab-2' ? 'bg-dark text-white border-white-1' : 'border-transparent']")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Gemixte Rezepte", flat, no-ripple)

      // ---------------------------------------------------------------------------------------------------- recipes list
      // div.border-bottom.q-pb-xl
      q-tab-pane.q-px-none.q-mb-sm(keep alive, name="tab-1")

        div.q-py-md.text-center.shadow-3.bg-dark.round-borders.border-white-1.q-mb-md.q-mt-lg(@click="$router.push('/recipes/create')")
          q-icon(name="add")

        template(v-if="tempRecipes.length")

          //
            div.q-mt-md.q-px-md.shadow-3.border.round-borders(v-for="(recipe, index) in tempRecipes",
            // :class="{'border-bottom q-pb-md': index < tempRecipes.length - 1}", style="overflow-x: hidden;")
          div.q-mt-md.shadow-3.round-borders.border-white-1(v-for="(recipe, index) in tempRecipes",
          style="overflow: hidden;",
          :class="[option !== index ? 'text-white bg-dark' : 'bg-body-background text-grey-8']")
            div.relative-position(:class="{'bg-transparent': option === index}")
              q-radio.full-width.q-mb-none.word-break.q-pb-md(v-model="option", :val="index")

                div.full-width(@click="handlerRadiobutton(index)")
                  q-list.q-pa-none.no-border.full-width
                    q-list-header.q-title.q-pa-none.q-py-md.min-height-auto.q-px-sm(
                    :class="[option !== index ? 'text-white' : 'text-grey-8']")
                      | {{ recipe.title }}
                    q-item-separator.q-ma-none.bg-grey-9
                    q-item.items-baseline.q-px-sm.q-py-none.min-height-auto(v-for="(entry, i) in recipe.entries")
                      q-item-side.q-pa-none.q-mt-md.min-height-auto.min-width-auto.text-grey-8(style="width: 30px;") {{ i + 1 }}.
                      q-item-main.q-pa-none.q-mt-md.min-height-auto {{ entry }}

              // .absolute-top-right.transition.full-height.items-center.row.q-mb-md.bg-body-background.border-left(
              .absolute-top-right.transition.full-height.items-center.row.q-mb-md(
              :class="[option !== index ? 'leave-right-absolute' : '']",
              style="border-color: #ffffff11!important;")
                // .q-mb-md.full-height.items-start.row.q-px-sm.q-pt-sm
                .q-mb-md.full-height.items-start.row.q-ma-sm
                  div
                    q-btn.bg-grey-4.text-grey-10.q-mr-sm(icon="edit", @click="editRecipe(index)", round, size="sm", flat)
                    // .full-width.q-mb-sm
                      q-btn.border.bg-body-background.text-white(icon="edit", @click="", round, size="sm", flat)
                    q-btn.bg-grey-4.text-grey-10(icon="delete", @click="removeFromTempRecipe(index)", round, size="sm", flat)

        // template(v-else)
          .q-mt-md empty

        //
          q-list.no-padding.no-border
            q-item.items-baseline.q-px-none(v-for="recipe in personal", :key="recipe.uuid")
              q-item-main(dark)
                q-item-tile
                  q-btn.full-width.bg-grey-10(@click="$router.push(`/recipes/edit/${recipe.uuid}`)", align="left")
                    | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
              q-item-side
                q-item-tile
                  q-btn(icon="delete", @click="openDeleteModal(recipe)")
      //
        content-block.no-margin
          // template(slot="title") Meine Rezepte
          template(slot="content")
            q-list.no-padding.no-border
              q-item.items-baseline.q-px-none(v-for="recipe in personal", :key="recipe.uuid")
                q-item-main(dark)
                  q-item-tile
                    // hier alle Titel meiner Rezepte anzeigen
                    q-btn.full-width.bg-grey-10(@click="$router.push(`/recipes/edit/${recipe.uuid}`)", align="left")
                      | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
                q-item-side
                  q-item-tile
                    q-btn(icon="delete", @click="openDeleteModal(recipe)")
              //
                q-item.q-px-none
                  q-item-main(dark)
                    q-btn.full-width.text-white(@click="$router.push('/recipes/create')", color="primary", align="left")
                      | Neues Rezept
                  q-item-side
                    q-btn.display-none(icon="delete")
      // --------------------------------------------------------------------------------------------------- mixed recipes
      // div.q-mt-md
      q-tab-pane.q-px-none.q-py-md(keep alive, name="tab-2")
        // .q-mb-md Gemixte Rezepte

        q-list.q-pa-none.no-border.no-padding
          q-item.items-baseline.q-px-none(v-for="recipe in remixed", :key="recipe.uuid")
            q-item-main(dark)
              q-item-tile
                q-btn.full-width.bg-grey-10(@click="$router.push('/recipes/edit/' + recipe.uuid)", align="left")
                  | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
            q-item-side
              q-item-tile
                q-btn(@click="openDeleteModal(recipe)", icon="delete")
        q-btn.full-width.text-white.border(@click="doRemix", align="left", no-caps, flat)
          | Neuer Remix

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
        option: undefined
      }
    },
    async mounted () {
      await this.loadRecipes()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        tempRecipes: 'recipes/getTempRecipes'
      })
    },
    watch: {
      async user () {
        await this.loadRecipes()
      }
    },
    methods: {
      editRecipe (val) {
        console.log(val)
        // this.$router.push('/recipes/create/' + this.tempRecipes[val])
        this.$router.push({name: 'recipes.edit', params: {index: val, recipe: this.tempRecipes[val]}})
      },
      removeFromTempRecipe (val) {
        this.$store.commit('recipes/removeFromTempRecipes', val)
        this.option = undefined
      },
      handlerRadiobutton (val) {
        if (val === this.option) this.option = undefined
      },
      async loadRecipes () {
        if (!this.user) return
        this.personal = await this.$store.dispatch('recipes/getPersonal', this.user.uuid)
        this.remixed = await this.$store.dispatch('recipes/getRemixed', this.user.uuid)
      },
      async doRemix () {
        const query = {'body.type': 'Recipe'}
        const recipes = await this.$store.dispatch('annotations/find', query)
        const ingredients = chance.shuffle(recipes.items.reduce((all, val) => {
          if (!val.body.value) return all
          const {entries} = JSON.parse(val.body.value)
          entries.forEach(entry => {
            if (all.indexOf(entry) === -1) all.push(entry.trim())
          })
          return all
        }, [])).splice(0, chance.integer({min: 3, max: 4}))
        console.debug(ingredients)
        const anno = {
          body: {
            type: 'Recipe',
            purpose: 'remix',
            value: JSON.stringify({
              title: `${chance.name()}`,
              entries: ingredients
            })
          }
        }
        await this.$store.dispatch('annotations/post', anno)
        await this.loadRecipes()
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
  .q-tabs-position-top .q-tabs-bar
    border-color transparent
</style>
