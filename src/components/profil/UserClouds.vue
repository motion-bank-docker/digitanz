<template lang="pug">
  div
    div.bg-dark.q-mb-sm(v-for="association in myAssociations")
      p
        span.q-mr-md(v-for="word in association.value") {{ word }}

    // FIXME: query works for Archive
      video-list-view(:videos="archiveItems",
      layoutStyle="sm",
      // :buttons="['more-delete', 'more-download']",
      // :showDuration="false",
      @changed="loadData")
</template>

<script>
  // import ConfirmModal from '../components/ConfirmModal'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib/video-helper'
  import VideoListView from '../VideoListView'

  // const UI_RESIZER_FACTOR = 2

  export default {
    components: {
      // MrGriddleModal
      // ConfirmModal
      VideoListView
    },
    data () {
      return {
        // archiveItems: undefined,
        associations: [],
        myAssociations: []
      }
    },
    props: {
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    mounted () {
      this.loadData()
    },
    watch: {
      async user () {
        await this.loadData()
      }
    },
    methods: {
      async loadData () {
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        const query = {
          'author.id': this.user.uuid
        }
        this.associations = await this.$store.dispatch('cloud/listAssociations', query)
        console.log('loaded associations:::::::', this.associations)
        this.associations.map(a => {
          if (a.author.id === this.user.uuid) {
            this.myAssociations.push(a)
          }
        })
        // console.log(this.myAssociations)
        console.debug('loaded associations', this.associations)
        this.$q.loading.hide()
      },
      async loadDataARCHIVE () {
        // console.log('this.user.id', this.user.uuid)
        const archiveMapResult = await this.$store.dispatch('maps/get', process.env.ARCHIVE_TIMELINE_UUID)
        // console.log('archiveMapResult: ', archiveMapResult)
        if (archiveMapResult) {
          const archiveQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${archiveMapResult.uuid}`
          }
          let archive = await VideoHelper.fetchVideoItems(this, archiveQuery)
          console.log('archive', archive)
          this.archiveItems = archive[0]
        }
      }
    }
  }
</script>

<style scoped>
</style>
