<template lang="pug">
  q-page.q-px-md
    h3.text-center
      | {{ $t('pages.mr_griddle.title') }}
    .q-mb-xl.text-grey-8
      | {{ $t('pages.mr_griddle.description') }}

    .row.q-ma-md
      mr-griddle-list-view(layout-style='sm')

    // TESTING
    ul
      li(v-for="sequence in griddleSequences")
        // router-link(:to="{path: 'mr-griddle/' + sequence.uuid + '/edit'}") {{sequence.title}}
        | {{sequence.title}}

</template>

<script>
  import MrGriddleListView from '../components/MrGriddleListView'
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
        this.griddleSequences = griddleSequences
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        // console.log(sequenceAnnotations)
      }
    },
    data () {
      return {
        griddleSequences: []
        // date: this.$dates()[4]
      }
    },
    name: 'mr-griddle'
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
