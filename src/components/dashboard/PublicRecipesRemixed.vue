<template lang="pug">
  div
    .text-center.q-mb-md(v-if="recipes.length <= 0 && isLoading")
      loading-spinner
    .q-mb-md.no-content(v-else-if="recipes.length <= 0 && !isLoading")
      span.text-grey-8 {{ $t('pages.profile.no_content') }}
    .row
      recipe-list-view(v-if="recipes",
        :buttonsX="buttonsX",
        :buttonsY="buttonsY",
        :items="recipes",
        :showContentFlag="true",
        size="sm")
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoadingSpinner from '../LoadingSpinner'
  import RecipeListView from '../RecipeListView'

  export default {
    components: {
      LoadingSpinner,
      RecipeListView
    },
    data () {
      return {
        recipes: [],
        isLoading: false,
        buttonsX: [{
          icon: 'people',
          label: 'visibility'
        }, {
          icon: 'chat',
          label: 'response'
        }],
        buttonsY: [{
          icon: 'edit',
          label: 'edit'
        }, {
          icon: 'delete',
          label: 'delete'
        }]
      }
    },
    async mounted () {
      this.$root.$on('updateRecipes', this.loadData)
      await this.loadData()
    },
    beforeDestroy () {
      this.$root.$off('updateRecipes', this.loadData)
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        await this.loadData()
      }
    },
    methods: {
      async loadData () {
        if (!this.user) return
        this.isLoading = true
        this.recipes = await this.$store.dispatch('recipes/getPublicRemixed')
        this.isLoading = false
      }
    }
  }
</script>
