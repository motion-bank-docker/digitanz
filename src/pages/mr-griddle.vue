<template lang="pug">
  q-page
    h3.text-center
      | {{ $t('pages.mr_griddle.title') }}
    .q-px-md.q-mb-xl.text-grey-8
      | {{ $t('pages.mr_griddle.description') }}

    .row.q-ma-md
      mr-griddle-list-view(layout-style='sm', :items="griddlePreviews")
        template(slot="customButtons" slot-scope="{ item }")

          q-btn(round, flat, size="sm", icon="chat", @click="showResponses(item)")
            q-chip(floating, color="red") {{ getResponseCount(item) }}

</template>

<script>
  import MrGriddleListView from '../components/MrGriddleListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      MrGriddleListView
    },
    data () {
      return {
        griddleSequences: [],
        griddlePreviews: [],
        responses: {}
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
      showResponses (item) {
        this.$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/responses`)
      },
      getResponseCount (item) {
        return this.responses[item.target.id]
      },
      async loadData () {
        if (!this.user) return
        const map = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        const annotations = await this.$store.dispatch('annotations/find', {
          'target.id': map.id,
          'body.purpose': 'linking'
        })
        const sequenceIds = annotations.items.map(a => {
          return a.body.source.id.split('/').pop()
        })
        let sequences = []
        let sequenceAnnotations = []
        let sequenceResponses = {}
        for (let seqId of sequenceIds) {
          try {
            const seqMap = await this.$store.dispatch('maps/get', seqId)
            sequences.push(seqMap)
            const seqAnnot = await this.$store.dispatch('annotations/find', {
              'target.id': seqMap.id
            })
            const seqPreview = seqAnnot.items[0]
            sequenceAnnotations.push(seqPreview)
            const seqAnnotResp = await this.$store.dispatch('annotations/find', {
              'target.id': seqMap.id,
              'target.type': 'Timeline',
              'body.purpose': 'commenting'
            })
            sequenceResponses[seqMap.id] = seqAnnotResp.items.length
          }
          catch (e) {
            // TODO fix orphaned annotations
          }
        }
        this.griddleSequences = sequences
        this.griddlePreviews = sequenceAnnotations
        this.responses = sequenceResponses
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
