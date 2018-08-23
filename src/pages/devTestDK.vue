<template lang="pug">
  q-page
    list-view.q-ma-lg(:videos="videos", size="sm", :buttons="['delete', 'star']")
      template(slot="customButtons" slot-scope="{ video }")
        q-btn(round, flat, size="sm" color="primary", icon="delete", @click="customAction(video)")
</template>

<script>
  import ListView from '../components/VideoListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ListView
    },
    async mounted () {
      if (this.user) await this.fetchVideos()
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
      customAction (video) {
        console.log('custom action triggerd for: ' + video.annotation.uuid)
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
            'target.id': { $ne: `${process.env.TIMELINE_BASE_URI}${process.env.PORTRAITS_TIMELINE_UUID}` }
          }
          results = await this.$store.dispatch('annotations/find', query)
          const items = results.items.sort(this.$sort.onCreatedDesc)
          const videos = []
          for (let annotation of items) {
            let metadata = {}
            try {
              metadata = await this.$store.dispatch('metadata/get', annotation.uuid)
            }
            catch (e) { console.error(`Failed to fetch metadata: ${e.message}`) }
            const preview = {
              high: annotation.body.source.id.replace(/\.mp4$/, '.jpg'),
              medium: annotation.body.source.id.replace(/\.mp4$/, '-m.jpg'),
              small: annotation.body.source.id.replace(/\.mp4$/, '-s.jpg')
            }
            console.debug('fetched metadata', metadata)
            videos.push({ annotation, metadata, preview })
          }
          this.videos = videos
        }
        this.$q.loading.hide()
      }
    },
    watch: {
      async user (val) {
        if (val) await this.fetchVideos()
      }
    }
  }
</script>

<style scoped>

</style>
