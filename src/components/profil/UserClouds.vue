<template lang="pug">
  div
    cloud-list-view(v-if="items",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="items")

</template>

<script>
  import CloudListView from '../CloudListView'

  export default {
    components: {
      CloudListView
    },
    props: ['items'],
    mounted () {
      console.debug('ffff', this.items)
    },
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
