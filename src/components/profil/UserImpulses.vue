<template lang="pug">
  div
    | User-Impulse
    video-list-view(:videos="archiveItems",
    layoutStyle="sm",
    :buttons="['more-delete', 'more-download']",
    :showDuration="false",
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
        archiveItems: undefined
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
    methods: {
      async loadData () {
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
