<template lang="pug">
  div
    recipe-list-view(v-if="items",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="items")

</template>

<script>
  import RecipeListView from '../RecipeListView'

  export default {
    components: {
      RecipeListView
    },
    props: ['items'],
    data () {
      return {
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
    }
  }
</script>

<style scoped>
</style>
