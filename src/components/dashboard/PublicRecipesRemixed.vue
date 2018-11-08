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
      if (this.user) {
        await this.loadData()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {
        this.isLoading = true
        // TODO Anton
        // load public recipes here and keep smiling
        this.recipes = [{
          _id: '5be2e3a378fa4017cbb12e3e',
          uuid: '214369ed-3475-41db-9e46-e05b7b801148',
          id: 'http://id.motionbank.org/annotations/214369ed-3475-41db-9e46-e05b7b801148',
          type: 'Annotation',
          author: {
            id: 'bc47bf32-156b-5bde-831e-efcf6a70e5aa',
            name: 'denis.klein'
          },
          body: {
            type: 'Recipe',
            value: '{"title":"Gemixtes Rezept aus der Hölle","entries":["Erst einmal Senf essen","Die Luft umarmen","wie wild im Kreis laufen"]}',
            purpose: 'remix'
          },
          created: '2018-11-07T13:07:47.951+00:00',
          _path: 'annotations/'
        },
        {
          _id: '5be2e3a378fa4017cbb12e3e',
          uuid: '214369ed-3475-41db-9e46-e05b7b801148',
          id: 'http://id.motionbank.org/annotations/214369ed-3475-41db-9e46-e05b7b801148',
          type: 'Annotation',
          author: {
            id: '10df2080-a184-55df-a074-dfe74068761f',
            name: 'denis.klein'
          },
          body: {
            type: 'Recipe',
            value: '{"title":"Unsere tolle Rezept Aufgabe","entries":["Nie wieder lügen","Die Luft umarmen","wie wild im Kreis laufen"]}',
            purpose: 'remix'
          },
          created: '2018-11-07T13:07:47.951+00:00',
          _path: 'annotations/'
        }]
        this.isLoading = false
      }
    }
  }
</script>
