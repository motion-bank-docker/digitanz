<template lang="pug">
  q-page
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteVideo")
    video-modal(ref="videoModal")
    .q-ma-md
      h3.text-center Abgabe
      content-block
        template(slot="title") Hier kannst du festlegen, welche Sequenzen du für die Aufgabe „erste Choreo“ abgeben willst
        template(slot="content")

          h4 Deine abgegebenen Sequenzen

          video-list-view(
            v-if="favouriteSequences && favouriteSequences.length > 0"
            :videos="favouriteSequences"
            layoutStyle="sm"
            :buttons="[]"
            :showDuration="false"
            :isSequence="true")

              template(slot="customButtons" slot-scope="{ video }")
                q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")

          h4 Alle deine Sequenzen

          video-list-view(
            v-if="sequences && sequences.length > 0"
            :videos="sequences"
            layoutStyle="sm"
            :buttons="[]"
            :showDuration="false"
            :isSequence="true")

              template(slot="customButtons" slot-scope="{ video }")
                q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")

          //
              template(slot="customMoreButtons" slot-scope="{ video }")
                q-item.q-px-sm
                  q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")

          //
            video-list-view(:videos="sequences",
                    layoutStyle="profile",
                    card-width="100%",
                    v-if="sequences.length > 0",
                    :buttons="['more-delete', 'more-download']",
                      :showDuration="false",
                      :isSequence="true",
                      @changed="loadData")
          //
                    template(slot="customButtons" slot-scope="{ video }")
                      // q-btn(flat, size="sm", round, icon="delete", @click="openDeleteModal(video)")
                      q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")
                      // q-btn(flat, size="sm", round, icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")
                    template(slot="customMoreButtons" slot-scope="{ video }")
                      q-item.q-px-sm
                        q-btn(round, flat, size="sm", icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")

</template>

<script>
  import ContentBlock from '../components/ContentBlock'
  import { mapGetters } from 'vuex'
  import VideoListView from '../components/VideoListView'
  import VideoModal from '../components/VideoModal'
  import { SequenceHelper, VideoHelper } from '../lib'
  import ConfirmModal from '../components/ConfirmModal'
  import LoadingSpinner from '../components/LoadingSpinner'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'

  export default {
    components: {
      ContentBlock,
      VideoListView,
      VideoModal,
      ConfirmModal,
      LoadingSpinner
    },
    name: 'presentation',
    data () {
      return {
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        favouriteSequences: [],
        date: this.$dates()[1],
        sequences: []
      }
    },
    async mounted () {
      this.$root.$on('updateSequences', this.loadSequences)
      if (this.user) {
        await this.loadSequences()
      }
    },
    beforeDestroy () {
      this.$root.$off('updateSequences', this.loadSequences)
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    watch: {
      async user () {
        if (!this.sequences) {
          await this.loadSequences()
        }
      }
    },
    methods: {
      getItemStyle (item) {
        if (this.favouriteSequences && this.favouriteSequences.filter(seq => {
          return seq.annotation.body.source.id === item.annotation.body.source.id
        }).length > 0) {
          return {
            color: 'primary',
            icon: 'people'
          }
        }
        return {
          color: 'grey-5',
          icon: 'people'
        }
      },
      async loadSequences () {
        if (!this.user) return
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        this.$q.loading.show({ message: this.$t('messages.loading_sequences') })
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
          const annotation = {
            author: {
              id: this.user.uuid
            },
            uuid: map.uuid,
            created: map.created,
            updated: map.updated,
            body: {
              type: 'Video',
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`,
                type: 'video/mp4'
              }
            }
          }
          return {
            type: 'Sequence',
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        }).filter(item => {
          return item.annotation && item.annotation.created
        })
        this.$q.loading.hide()
        this.loadFavouriteSequences()
      },
      openPreview (item) {
        this.preview = item.annotation
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteVideo (video) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, video.map.uuid)
        this.$q.loading.hide()
        await this.loadSequences()
      },
      async loadFavouriteSequences () {
        this.$q.loading.show({ message: this.$t('messages.loading_sequences') })
        const query = {
          'created': { $gte: this.date.start, $lte: this.date.end },
          'target.id': `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
          'body.type': 'Video',
          'author.id': this.user.uuid
        }
        const sequences = await VideoHelper.fetchVideoItems(this, query)
        // for (let sequence of sequences) {
        //   const responsesQuery = {
        //     'target.id': `${process.env.ANNOTATION_BASE_URI}${sequence.annotation.uuid}`,
        //     'body.purpose': 'commenting'
        //   }
        //   sequence.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        // }
        this.favouriteSequences = sequences
        this.$q.loading.hide()
      },
      async toggleItemFavorite (item, silent = true) {
        if (!silent) this.$q.loading.show({ message: this.$t('messages.setting_sequence') })
        const query = {
          'target.id': this.sequencesFavouritesMapUUID,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)

        let isCurrentItem = false
        for (let favouredItem of result.items) {
          // remove only this current item
          if (favouredItem.body.source.id === item.annotation.body.source.id) {
            isCurrentItem = true
            await this.$store.dispatch('annotations/delete', favouredItem.uuid)
            await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
          }
        }
        const message = {
          video: item.annotation.body.source.id,
          user: this.user.uuid
        }
        if (!isCurrentItem) {
          const annotation = {
            author: {
              id: this.user.uuid
            },
            body: ObjectUtil.merge({}, item.annotation.body),
            target: {
              id: this.sequencesFavouritesMapUUID,
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

        // dk: neccessary to load content again?
        await this.loadSequences()
        console.log('sequence was made public')
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
