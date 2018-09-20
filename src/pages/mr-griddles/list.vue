<template lang="pug">
  q-page.q-ma-lg
    h3 Deine Mr. Griddles
    mr-griddle-list-view(layout-style='sm',
                        :items="griddlePreviews")
      template(slot="customButtons" slot-scope="{ video }")
        q-btn(flat, size="sm" round, icon="edit" @click="openDeleteModal(video)")

    ul
      li(v-for="sequence in griddleSequences")
        router-link(:to="{path: 'mr-griddle/' + sequence.uuid + '/edit'}") {{sequence.title}}
</template>

<script>
  import MrGriddleListView from '../../components/MrGriddleListView'
  import { mapGetters } from 'vuex'
  import Default from '../../layouts/default'

  export default {
    components: {
      Default,
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
        this.griddlePreviews = sequenceAnnotations
        console.log(this.griddlePreviews)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
