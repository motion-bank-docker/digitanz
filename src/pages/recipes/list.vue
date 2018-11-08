<template lang="pug">
  q-page.q-pa-lg.relative-position
    //
    // DELETE MODAL
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteRecipe")

    //
    // LISTE DER REZEPTE
    content-block.no-margin
      template(slot="title") Meine Rezepte
      template(slot="content")
        q-list.no-padding.no-border
          q-item.items-baseline(v-for="recipe in personal", :key="recipe.uuid")
            q-item-main(dark)
              q-item-tile
                // hier alle Titel meiner Rezepte anzeigen
                // q-btn.full-width(@click="$router.push('/newrecipe/' + recipe.uuid)", align="left", outline)
                q-btn.full-width(@click="$router.push(`/recipes/edit/${recipe.uuid}`)", align="left", outline)
                  | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
            q-item-side
              q-item-tile
                q-btn(icon="delete", @click="openDeleteModal(recipe)")
                // q-btn(icon="delete" @click="openPopupDelete = true")
                // q-btn(icon="share" @click="openPopupShare = true")
          q-item
            q-item-main(dark)
              q-btn.full-width.dashed(@click="$router.push('/recipes/create')", color="primary", align="left", outline)
                | Neues Rezept
            q-item-side
              q-btn.display-none(icon="delete")
          // q-item.q-pa-none
            // q-btn.q-ml-md.q-mt-sm.q-mb-md(@click="$router.push('/newrecipe/create')", align="left", color="primary", icon="add circle")
            q-btn(@click="$router.push('/recipes/' + recipe.uuid + '/create')", align="left", color="primary", icon="add circle")

    //
    // GEMIXTE REZEPTE
    content-block
      template(slot="title") Gemixte Rezepte
      template(slot="buttons")
      template(slot="content")
        q-list.q-pa-none.no-border
          q-item.items-baseline(v-for="recipe in remixed", :key="recipe.uuid")
            q-item-main(dark)
              q-item-tile
                // Loop durch array aller Rezepte, Titel anzeigen
                q-btn.full-width(@click="$router.push('/recipes/edit/' + recipe.uuid)", align="left", outline)
                  | {{ recipe.body.value ? JSON.parse(recipe.body.value).title : 'no title' }}
            q-item-side
              q-item-tile
                q-btn(@click="openDeleteModal(recipe)", icon="delete")
                // q-btn(icon="delete")
                // q-btn(icon="share")
          q-item
            q-item-main(dark)
              q-btn.full-width.dashed(@click="doRemix", color="primary", align="left", outline)
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
        remixed: []
      }
    },
    async mounted () {
      await this.loadRecipes()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        await this.loadRecipes()
      }
    },
    methods: {
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

<style lang="stylus">
  .display-none
    opacity: 0
  .dashed
    border-style: dashed
</style>
