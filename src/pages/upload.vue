<template lang="pug">
  q-page
    video-modal(ref="videoModal")

    h3.text-center
      | {{ $t('upload.title') }}
    file-uploader.full-width.self-center(:query="query")
    .row.q-pt-xs(v-if="map")
      job-list
      .col-12.q-px-md.q-pt-xs
        // h4.text-center {{ map.title }}
        // h4.text-center {{ $t('upload.my_videos') }}
        //
        // Meine Videos Liste
        video-list-view(:videos="videos",
                        layoutStyle="sm",
                        :buttons="['delete', 'download']",
                        @changed="fetchVideos")
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import { VideoHelper } from '../lib'
  import JobList from '../components/JobList'
  import { mapGetters } from 'vuex'
  import FileUploader from '../components/FileUploader'
  import VideoModal from '../components/VideoModal'
  import VideoListView from '../components/VideoListView'

  export default {
    components: {
      FileUploader,
      VideoModal,
      JobList,
      VideoListView
    },
    async mounted () {
      this.$root.$on('updateVideos', this.fetchVideos)
      this.$root.$on('updateSequences', this.fetchVideos)
      if (this.user) await this.fetchVideos()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.fetchVideos)
      this.$root.$off('updateSequences', this.fetchVideos)
    },
    data () {
      return {
        map: undefined,
        query: {
          'title': 'Meine Videos'
        },
        videos: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      openPreview (preview) {
        if (preview.body.source.type === 'video/mp4') this.$refs.videoModal.show(preview)
      },
      async fetchVideos () {
        this.$q.loading.show({ message: this.$t('messages.loading_videos') })
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items && results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'author.id': this.user.uuid,
            'body.type': 'Video',
            'body.source.type': 'video/mp4',
            'target.id': {
              $eq: `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`
            }
          }
          this.videos = await VideoHelper.fetchVideoItems(this, query)
        }
        this.$q.loading.hide()
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      }
    },
    watch: {
      async user (val) {
        if (val) await this.fetchVideos()
      }
    }
  }
</script>

<style>

</style>
