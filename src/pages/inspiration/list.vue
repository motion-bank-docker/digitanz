<template lang="pug">
  .q-mx-md.q-pt-md
    video-list-view(
    v-if="items && items.length > 0",
    :allowSelfResponse="true",
    :videos="items",
    layoutStyle="sm",
    :buttons="[]",
    :showContentFlag="false",
    :isArchive="true",
    :hideButtons="true",
    card-width="100%")
      template(slot="customButtons", slot-scope="{ video }")
    q-page-sticky.text-center.full-width(v-else, position="left")
        loading-spinner
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoadingSpinner from '../../components/LoadingSpinner'
  import VideoListView from '../../components/VideoListView'
  import VideoModal from '../../components/VideoModal'
  import { VideoHelper } from '../../lib'

  export default {
    components: {
      LoadingSpinner,
      VideoModal,
      VideoListView
    },
    data () {
      return {
        items: [],
        isLoading: false
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {
        const archiveMapResult = await this.$store.dispatch('maps/get', process.env.ARCHIVE_TIMELINE_UUID)
        if (archiveMapResult) {
          const archiveQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${archiveMapResult.uuid}`,
            'author.name': 'Christian Hansen'
          }
          let items = await VideoHelper.fetchVideoItems(this, archiveQuery)
          // this.archiveItems = archive[0]
          for (let item of items) {
            const responsesQuery = {
              'target.id': `${process.env.ANNOTATION_BASE_URI}${item.annotation.uuid}`,
              'body.purpose': 'commenting'
            }
            item.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
          }
          this.items = items
        }
      }
    }
  }
</script>
