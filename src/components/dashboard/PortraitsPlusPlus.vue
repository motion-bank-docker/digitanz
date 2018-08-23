<template lang="pug">

  .row
    | {{ sequences }}
    video-list-view(
      v-if="sequences && sequences.length > 0",
      :videos="sequences", layoutStyle="sm")
        template(slot="customButtons" slot-scope="{ video }")
          q-btn(flat, size="sm" round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color")
          q-btn(flat, size="sm" round, icon="delete")
          q-btn(flat, size="sm" round, icon="cloud_download")
    template(v-else)
      | {{ $t('messages.no_videos') }}

</template>

<script>
  import VideoListView from '../../components/VideoListView'
  import { mapGetters } from 'vuex'

  export default {
    name: 'dashboard-portraits-plus-plus',
    components: {
      VideoListView
    },
    props: [
      'date'
    ],
    data () {
      return {
        sequences: []
      }
    },
    computed: {
      iconStyleIcon () {
        return 'favorite'
      },
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    watch: {
      async user () {
        if (!this.sequences) await this.loadVideoSequences()
      }
    },
    async mounted () {
      if (this.user) this.loadVideoSequences()
    },
    methods: {
      getItemStyle () {
        return {
          color: 'primary',
          icon: 'favorite'
        }
      },
      async loadVideoSequences () {
        if (!this.user) return
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
    }
  }
</script>

<style lang="stylus">

</style>
