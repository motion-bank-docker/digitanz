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

  export default {
    components: {
      MrGriddleListView
    },
    data () {
      return {
        griddleSequences: [],
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
        if (!this.user) return
        const map = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        const annotations = await this.$store.dispatch('annotations/find', {
          'target.id': map.id
        })
        console.log(annotations)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
