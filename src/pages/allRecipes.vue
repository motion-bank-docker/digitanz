<template lang="pug">
  q-page
    // LISTE DER REZEPTE
    h1.q-display-1.no-margin Meine Rezepte
    q-list(no-border)
      q-item.items-baseline(v-for="recipe in personal", :key="recipe.uuid")
        q-item-main(dark)
          q-item-tile
            // hier alle Titel meiner Rezepte anzeigen
            q-btn.full-width(@click="$router.push('/newrecipe/' + recipe.uuid)", align="left", outline)
              | {{ JSON.parse(recipe.body.source).title }}
        q-item-side
          q-item-tile
            q-btn(icon="delete", @click="deleteRecipe(recipe.uuid)")
            // q-btn(icon="delete" @click="openPopupDelete = true")
            // q-btn(icon="share" @click="openPopupShare = true")
      q-btn.q-ml-md.q-mt-sm.q-mb-md(@click="$router.push('/newrecipe/create')", align="left", color="primary", icon="add circle")

    h1.q-display-1.no-margin Gemixte Rezepte
    q-list(no-border)
      q-item.items-baseline(v-for="recipe in remixed", :key="recipe.uuid")
        q-item-main(dark)
          q-item-tile
            // Loop durch array aller Rezepte, Titel anzeigen
            q-btn.full-width(align="left", outline, @click="$router.push('/newrecipe/' + recipe.uuid)")
              | {{ JSON.parse(recipe.body.source).title }}
        q-item-side
          q-item-tile
            q-btn(icon="delete", @click="deleteRecipe(recipe.uuid)")
            // q-btn(icon="delete")
            // q-btn(icon="share")
    q-btn.fixed-bottom.full-width(size="lg" color="primary" @click="doRemix") Neuer Remix

    // POP UP FIELD "DELETE"
    q-modal.row(v-model="openPopupDelete", minimized)
      div.q-ma-md.justify-center
        h1.q-title Möchtest du dieses Rezept löschen?
        div.row.justify-around
          q-btn.q-ma-xs(
          color="negative"
          @click="deleteItem"
          label="Löschen")
          q-btn.q-ma-xs(
          outline
          color="negative"
          @click="openPopupDelete = false"
          label="Abbrechen")

    // POP UP FIELD "SHARE"
    q-modal.row(v-model="openPopupShare", minimized)
      div.q-ma-md.justify-center
        h1.q-title Mit wem möchtest du dieses Rezept teilen?
        q-search(
          v-model="searchModel"
          icon="person"
          Label="User"
          helper="Tippe einen Namen ein"
          v-on:keyup.enter="addSharedUser")
          //q-autocomplete(@search="search" @selected="selected")
          q-btn.no-outline.no-border(icon="send", @click="addSharedUser")
        q-list.q-ml-md(no-border)
          q-item.items-baseline(
          v-for="(user, index) in sharedUser",
          :key="index",
          :title="user.title")
            q-item-main
              p.q-title {{ user.title }}
            q-item-side
              q-btn(@click="deleteSharedUser(index)", icon="delete")
        div.row.justify-around
          q-btn.q-ma-xs(
          color="primary"
          @click="shareItem"
          label="Teilen")
          q-btn.q-ma-xs(
          outline
          color="primary"
          @click="openPopupShare = false"
          label="Abbrechen")
</template>

<script>
  import Chance from 'chance'
  import {QInput, QBtn, QList, QItem, QPage, QItemMain, QItemSide, QItemTile, QModal, QModalLayout, QSearch, QAutocomplete, QChipsInput} from 'quasar'
  const chance = new Chance()
  export default {
    components: {
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
      QChipsInput
    },
    data () {
      return {
        openPopupDelete: false,
        openPopupShare: false,
        sharedUser: [],
        searchModel: '',
        recipes: [],
        personal: [],
        remixed: []
      }
    },
    async mounted () {
      await this.loadRecipes()
    },
    methods: {
      async loadRecipes () {
        const query = {
          query: { 'body.type': 'Recipe' }
        }
        const
          _this = this,
          recipes = await this.$store.dispatch('annotations/find', query)
        this.personal = recipes.filter(recipe => {
          return recipe.author === _this.$store.state.auth.payload.userId && recipe.body.purpose === 'personal'
        })
        this.remixed = recipes.filter(recipe => {
          return recipe.author === _this.$store.state.auth.payload.userId && recipe.body.purpose === 'remix'
        })
      },
      async doRemix () {
        const query = {
          query: { 'body.type': 'Recipe' }
        }
        const recipes = await this.$store.dispatch('annotations/find', query)
        const ingredients = chance.shuffle(recipes.reduce((all, val) => {
          const { entries } = JSON.parse(val.body.source)
          entries.forEach(entry => {
            if (all.indexOf(entry) === -1) all.push(entry.trim())
          })
          return all
        }, [])).splice(0, chance.integer({min: 3, max: 4}))
        const anno = {
          author: this.$store.state.auth.payload.userId,
          body: {
            type: 'Recipe',
            purpose: 'remix',
            source: JSON.stringify({
              title: `${chance.name()}`,
              entries: ingredients
            })
          }
        }
        await this.$store.dispatch('annotations/create', anno)
        await this.loadRecipes()
      },
      async deleteRecipe (uuid) {
        await this.$store.dispatch('annotations/remove', uuid)
        await this.loadRecipes()
      },
      deleteItem: function () {
        // Delete selected recipe from Recipe-array
        this.openPopupDelete = false
      },
      search: function (terms, done) {
        // is for Autocomplete: do something with terms, like an Ajax call for example
        // then call done(Array results)

        // DO NOT forget to call done! When no results or an error occured,
        // just call with empty array as param. Example: done([])
        done([])
      },
      addSharedUser: function () {
        this.sharedUser.push({
          title: this.searchModel
        })
        this.searchModel = ''
      },
      deleteSharedUser: function (index) {
        this.sharedUser.splice(index, 1)
      },
      shareItem: function () {
        // send this somewhere
        // close Popup afterwards
        this.openPopupShare = false
      }
    }
  }
</script>
