<template lang="pug">
  q-page
    h3.text-center
      | {{ $t('pages.mr_griddle.title') }}
    .q-px-md.q-mb-xl.text-grey-8
      | {{ $t('pages.mr_griddle.description') }}

    .row.q-ma-md
      mr-griddle-list-view(layout-style='sm', :items="griddlePreviews")

</template>

<script>
  import MrGriddleListView from '../components/MrGriddleListView'
  import { mapGetters } from 'vuex'
  // import Default from '../layouts/default'

  export default {
    components: {
      // Default,
      MrGriddleListView
    },
    data () {
      return {
        griddleSequences: [],
        mrGriddles: undefined,
        griddlePreviews: []
      }
    },
    mounted () {
      this.loadData()
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
        console.log('asdasd')
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const maps = await this.$store.dispatch('maps/find', query)
        const griddleSequences = maps.items.filter(m => {
          return m.title.indexOf('GriddleSequence ') === 0
        })
        // console.log(griddleSequences)
        this.griddleSequences = griddleSequences
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        console.log(sequenceAnnotations)
        this.griddlePreviews = sequenceAnnotations
        console.log('skeleton: ', this.griddlePreviews[0].body.value)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
