<template lang="pug">
  video-list-view(:videos="uploads",
                  layoutStyle="sm",
                  :buttons="['delete', 'download']",
                  :showDuration="true",
                  @changed="loadData")
</template>

<script>
  import VideoListView from '../VideoListView'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'

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
        uploads: []
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {
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
      }
    }
  }
</script>

<style scoped>

</style>
