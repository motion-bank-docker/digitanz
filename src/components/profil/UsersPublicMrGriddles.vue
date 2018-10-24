<template lang="pug">

  div
    .text-center.q-mb-md(v-if="isLoading")
      loading-spinner
    .q-mb-md.no-content(v-else-if="sequences.length <= 0 && !isLoading")
      span.text-grey-8 {{ $t('pages.profile.no_content') }}
    mr-griddle-list-view(
    v-else-if="sequences.length > 0",
    layout-style='sm',
    :buttons="['more-delete']",
    :buttonsNew="buttonsNew",
    :buttonsNewDropdown="buttonsNewDropdown",
    :items="sequences",
    @emitLoadData="emitLoadData")
      template(slot="customButtons" slot-scope="{ video }")
      template(slot="customMoreButtons" slot-scope="{ video }")

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
        isLoading: false,
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
        this.isLoading = true
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
        this.isLoading = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .no-content
    margin-top -1em
</style>
