<template lang="pug">
  q-page
    h4.q-mx-none.text-center {{ $t('upload.title') }}
    file-uploader.full-width.self-center(v-if="!jobIds.length", :query="query")
    .row.q-mt-xl(v-if="map")
      job-list
      .col-12.q-px-md
        // h4.text-center {{ map.title }}
        h4.text-center {{ $t('upload.my_videos') }}
        q-list.no-border.q-pb-md
          q-item.no-padding.q-mt-md.text-center(v-for="video in videos", :key="video.uuid")
            //
              p {{ video.metadata.title }}
              p {{ video.metadata.width }}x{{ video.metadata.height }}
              p {{ video.annotation.body.source.id }}
            q-item-main.text-center
              img(:src="video.preview", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")
</template>

<script>
  import FileUploader from '../components/FileUploader'
  import JobList from '../components/JobList'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      FileUploader,
      JobList
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
