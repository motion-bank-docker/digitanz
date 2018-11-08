<template lang="pug">
  div
    .text-center.q-mb-md(v-if="isLoading")
      loading-spinner
    .q-mb-md.no-content(v-else-if="publicRecipes.length <= 0 && !isLoading")
      span.text-grey-8 {{ $t('pages.profile.no_content') }}
    recipe-list-view(v-if="publicRecipes",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="publicRecipes",
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
        publicRecipesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_RECIPES_TIMELINE_UUID}`,
        publicRecipes: [],
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
        }],
        isLoading: false
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
        const publicRecipes = await this.$store.dispatch('recipes/getPublic')
        this.publicRecipes = publicRecipes.filter(r => r.author.id === this.user.uuid)
        this.isLoading = false
        console.debug('publicRecipes', this.publicRecipes)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .no-content
    margin-top -1em
</style>
