<template lang="pug">
  div.row
    video-list-view(
    v-if="items && items.length > 0",
    :allowSelfResponse="true",
    :videos="items",
    layoutStyle="sm",
    :buttons="[]",
    :showContentFlag="false",
    :isArchive="true",
    card-width="100%")
      template(slot="customButtons" slot-scope="{ video }")
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoadingSpinner from '../LoadingSpinner'
  import VideoListView from '../VideoListView'
  import VideoModal from '../VideoModal'
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
            'author.name': 'David Rittershaus'
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
