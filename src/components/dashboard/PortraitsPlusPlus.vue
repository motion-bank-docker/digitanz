<template lang="pug">

  .row
    video-list-view(
      v-if="sequences && sequences.length > 0",
      :videos="sequences", layoutStyle="sm")
        template(slot="customButtons" slot-scope="{ video }")
          q-btn(flat, size="sm" round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")
          q-btn(flat, size="sm" round, icon="delete")
          q-btn(flat, size="sm" round, icon="cloud_download")
    template(v-else)
      | {{ $t('messages.no_videos') }}

</template>

<script>
  import VideoListView from '../../components/VideoListView'
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'

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
      if (this.user) {
        await this.loadVideoSequences()
      }
    },
    methods: {
      getItemStyle () {
        return {
          color: 'primary',
          icon: 'favorite'
        }
      },
      async toggleItemFavorite (item, silent = true) {
        if (!silent) this.$q.loading.show({ message: this.$t('messages.setting_sequence') })
        const publicSequencesMapUUID = `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`
        const query = {
          'target.id': publicSequencesMapUUID,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)

        let isCurrentItem = false
        for (let favouredItem of result.items) {
          if (favouredItem.body.source.id === item.annotation.body.source.id) isCurrentItem = true
          await this.$store.dispatch('annotations/delete', favouredItem.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
        }
        const message = {
          video: item.annotation.body.source.id,
          user: this.user.uuid
        }
        if (!isCurrentItem) {
          const annotation = {
            body: ObjectUtil.merge({}, item.annotation.body),
            target: {
              id: publicSequencesMapUUID,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
          }
          const favouredItem = await this.$store.dispatch('annotations/post', annotation)
          if (favouredItem) {
            await this.$store.dispatch('acl/set', {uuid: favouredItem.uuid, role: 'public', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'sequence_favourite_set', message })
          if (!silent) this.$q.loading.hide()
        }
        else if (!silent) {
          await this.$store.dispatch('logging/log', { action: 'sequence_favourite_unset', message })
          this.$q.loading.hide()
        }

        await this.loadVideoSequences()
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
