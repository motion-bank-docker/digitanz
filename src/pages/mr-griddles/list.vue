<template lang="pug">
  q-page.q-ma-lg
    h3 Deine Mr. Griddles
    mr-griddle-list-view(layout-style='sm')
</template>

<script>
  import MrGriddleListView from '../../components/MrGriddleListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      MrGriddleListView
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      user (val) {
        if (val) this.loadData()
      }
    },
    methods: {
      async loadData () {
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const maps = await this.$store.dispatch('maps/find', query)
        const griddleSequences = maps.items.filter(m => {
          return m.title.indexOf('GriddleSequence ') === 0
        })
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        console.log(sequenceAnnotations)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
