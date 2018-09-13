<template lang="pug">
  q-page.q-ma-md
    q-btn-group(push)
      q-btn(push label="Datum" flat icon="watch_later" @click="orderByTime")
      q-btn(push label="Art" flat icon="timeline" @click="orderByType")
      q-btn(push label="Geteilt" flat icon="visibility" @click="orderByVisibility")
    // ORDER BY TIME
    div(v-if="displayType =='type'")
      <!--section-->
        <!--h4 Bewegungsportrait-->
        <!--video-list-view(:videos="videos",-->
        <!--layoutStyle="sm",-->
        <!--:buttons="['delete', 'download']",-->
        <!--:jobIds="jobIds",-->
        <!--:showDuration="true",-->
        <!--@changed="fetchVideos")-->
      //
      // Meine Videos Liste
      section
        h4 Sequenzen
        video-list-view(:videos="sequences",
                        layoutStyle="sm",
                        :buttons="['delete', 'download']",
                        :jobIds="jobIds",
                        :showDuration="false",
                        @changed="fetchVideos")
      //
      // Meine Videos Liste
      section
        h4 Andere Uploads
        video-list-view(:videos="videos",
        layoutStyle="sm",
        :buttons="['delete', 'download']",
        :jobIds="jobIds",
        :showDuration="true",
        @changed="fetchVideos")
      //
      // ORDER BY TYPE
    div(v-else-if="displayType =='time'")
      h4 2. Woche
      h4 1. Woche
    div(v-else-if="displayType == 'visibility'")
      h4 Öffentlich Beiträge
</template>

<script>
  import VideoListView from '../components/VideoListView'
  import { VideoHelper } from '../lib'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      VideoListView
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    data () {
      return {
        videos: [],
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        sequences: [],
        favouriteSequences: [],
        displayType: 'time'
      }
    },
    async mounted () {
      if (this.user) {
        await this.fetchVideos()
        await this.fetchSequences()
      }
    },
    methods: {
      orderByTime () {
        this.displayType = 'time'
        console.log('by time')
      },
      orderByType () {
        this.displayType = 'type'
        console.log('by type')
      },
      orderByVisibility () {
        this.displayType = 'visibility'
        console.log('by visibility')
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
      async fetchSequences () {
        console.log('fetching sequences')
        if (!this.user) return
        this.sequences = []
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        this.sequences = result.items.filter(map => {
          return map.title.indexOf(prefix) === 0
        }).sort(this.$sort.onCreatedDesc).map(map => {
          const media = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
          }
          let processing = false
          for (let jobId of this.sequenceJobIds) {
            if (this.sequenceJobDetails[jobId].uuid === map.uuid) processing = true
          }
          const annotation = {
            author: {
              id: this.user.uuid
            },
            uuid: map.uuid,
            body: {
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`,
                type: 'video/mp4'
              }
            }
          }
          return {
            processing,
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
      }
    },
    watch: {
      async user (val) {
        if (val) await this.fetchVideos()
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
