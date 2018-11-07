<template lang="pug">
  div
    recipe-list-view(v-if="publicRecipes",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="publicRecipes")
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
        publicRecipes: [
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
              value: '{"title":"moritz rezept","entries":["In die Hände klatschen","Die Luft umarmen","wie wild im Kreis laufen"]}',
              purpose: 'personal'
            },
            created: '2018-11-07T13:07:47.951+00:00',
            _path: 'annotations/'
          }
        ],
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
        // const query = {
        //   'target.id': this.publicRecipesMapUUID,
        //   'author.id': this.user.uuid
        // }
        // const result = await this.$store.dispatch('annotations/find', query)

        // let recipes = result.items.map(foo => {
        //   return {
        //     foo: foo,
        //     author: {
        //       id: this.user.uuid
        //     },
        //     body: {
        //       type: 'Recipe',
        //       bla: foo
        //     }
        //   }
        // })

        // this.publicRecipes = recipes
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
