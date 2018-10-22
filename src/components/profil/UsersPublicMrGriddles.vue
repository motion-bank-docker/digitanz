<template lang="pug">

  div
    mr-griddle-list-view(
    v-if="sequences.length > 0",
    layout-style='sm',
    :buttons="['more-delete']",
    :buttonsNew="buttonsNew",
    :buttonsNewDropdown="buttonsNewDropdown",
    :items="sequences",
    @emitLoadData="emitLoadData")
      template(slot="customButtons" slot-scope="{ video }")
      template(slot="customMoreButtons" slot-scope="{ video }")

    .text-center(v-else)
      loading-spinner

</template>

<script>
  import LoadingSpinner from '../LoadingSpinner'
  import { mapGetters } from 'vuex'
  import MrGriddleListView from '../MrGriddleListView'

  export default {
    components: {
      LoadingSpinner,
      MrGriddleListView
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
    data () {
      return {
        sequences: [],
        favoriteSequences: [],
        buttonsNew: [{
          icon: 'people',
          label: 'visibility'
        }],
        buttonsNewDropdown: [{
          icon: 'edit',
          label: 'edit'
        }, {
          icon: 'delete',
          label: 'delete'
        }]
      }
    },
    methods: {
      emitLoadData () {
        this.loadData()
      },
      async loadData () {
        const map = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        const annotations = await this.$store.dispatch('annotations/find', {
          'target.id': map.id,
          'body.purpose': 'linking',
          'author.id': this.user.uuid
        })
        const sequenceIds = annotations.items.map(a => {
          return a.body.source.id.split('/').pop()
        })
        let sequences = []
        for (let seqId of sequenceIds) {
          try {
            const seqMap = await this.$store.dispatch('maps/get', seqId)
            sequences.push(seqMap)
          }
          catch (e) {
            // TODO fix orphaned annotations
          }
        }
        this.sequences = sequences
      }
    }
  }
</script>

<style scoped>
</style>
