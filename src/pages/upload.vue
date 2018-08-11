<template lang="pug">
  q-page(padding)
    .row
      .col-12
        h3 Upload video
    file-uploader.full-width.self-center
    .row(v-if="map")
      .col-12(v-if="jobIds.length")
        h3 Uploading...
        ul
          li(v-for="jobId in jobIds", :key="jobId") {{ $store.state.conversions.jobDetails[jobId].title }}
      .col-12
        h3 {{ map.title }}
        ul
          li(v-for="video in videos", :key="video.uuid")
            p {{ video.metadata.title }}
            p {{ video.metadata.width }}x{{ video.metadata.height }}
            p {{ video.annotation.body.source.id }}
            p {{ video.preview }}
</template>

<script>
  import FileUploader from '../components/FileUploader'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      FileUploader
    },
    mounted () {
      this.$root.$on('updateVideos', this.fetchVideos)
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.fetchVideos)
    },
    data () {
      return {
        map: undefined,
        videos: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        jobIds: 'conversions/getJobIds'
      })
    },
    methods: {
      async fetchVideos () {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`
          }
          results = await this.$store.dispatch('annotations/find', query)
          const videos = []
          for (let annotation of results.items) {
            const metadata = await this.$store.dispatch('metadata/get', annotation.uuid)
            const preview = annotation.body.source.id.replace(/mp4$/, 'png')
            console.debug('fetched metadata', metadata)
            videos.push({ annotation, metadata, preview })
          }
          this.videos = videos
        }
      }
    },
    watch: {
      async user (val) {
        if (val) await this.fetchVideos()
      }
    }
  }
</script>
