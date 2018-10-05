<template lang="pug">
  div
    p hi

</template>

<script>
  import VideoListView from '../VideoListView'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  // import { DateTime } from 'luxon'
  // import { ObjectUtil } from 'mbjs-utils'

  export default {
    components: {
      VideoListView
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    data () {
      return {
        uploads: undefined,
        sequences: undefined
      }
    },
    async mounted () {
      if (this.user) {
        await this.fetchUploads()
        await this.fetchSequences()
        console.log('uploads: ', this.uploads)
        console.log('sequences: ', this.sequences)
      }
    },
    watch: {
      async user (val) {
        if (val) {
          await this.fetchUploads()
          await this.fetchSequences()
        }
      }
    },
    methods: {
      async fetchUploads () {
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
          this.uploads = await VideoHelper.fetchVideoItems(this, query)
        }
      },
      async fetchSequences () {
        this.sequences = []
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        console.log('result:', result)
        this.sequences = result.items.filter(map => {
          return map.title.indexOf(prefix) === 0
        }).sort(this.$sort.onCreatedDesc).map(map => {
          const media = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
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
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
