<template lang="pug">
  q-page.q-px-md
    h4.text-center {{ $t('pages.video_sequencer.title') }}
    div.q-mb-xl.text-grey-8 {{ $t('pages.video_sequencer.description') }}

    q-btn.full-width(@click="$router.push('/sequences/create')", :label="$t('buttons.add_sequence')", color="primary")
    // div {{ sequences.length }}
    .q-mt-md
      video-list-view(:videos="sequences", layoutStyle="sm")
        // template(slot="customButtons")
        template(slot="customButtons" slot-scope="{ video }")
          // q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="setAsPortrait(video)")
          //
            q-btn(flat, size="sm", round, icon="edit",
            @click="$router.push(`/sequences/${sequence.map.uuid}/edit`)", v-if="!sequence.processing")
          q-btn(v-if="!video.processing", flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")
          q-btn(v-if="!video.processing", flat, size="sm", round, icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")
          q-btn(v-if="!video.processing", flat, size="sm", round, icon="delete", @click="deleteVideo(video)")
          // span(v-if="video.processing") Rendering...
          q-spinner-mat(v-if="video.processing", color="primary", size="1.5em")

    // q-list.no-border
      q-item.no-margin(v-for="sequence in sequences")
        .q-caption {{ sequence }}
        //
          q-btn(@click="$router.push(`/sequences/${sequence.map.uuid}/edit`)", v-if="!sequence.processing") {{ sequence.title }}
          span(v-if="sequence.processing") {{ sequence.title }} Rendering..........
          span(v-if="!sequence.processing") {{ getVideoURL(sequence) }}
          img(v-if="!sequence.processing", :src="sequence.preview.medium")
</template>

<script>
  import ModalPreview from '../../components/VideoModal'
  import VideoListView from '../../components/VideoListView'
  // import { VideoPlayer } from 'mbjs-quasar/src/components'
  import { SequenceHelper } from '../../lib'
  import { mapGetters } from 'vuex'
  import VideoPlayer from '../../components/VideoPlayer'
  import FileUploader from '../../components/FileUploader'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'

  export default {
    components: {
      ModalPreview,
      VideoPlayer,
      FileUploader,
      VideoListView
    },
    data () {
      return {
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        sequences: [],
        favouriteSequences: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    async mounted () {
      this.$root.$on('updateSequences', this.loadData)
      await this.loadData()
    },
    beforeDestroy () {
      this.$root.$off('updateSequences', this.loadData)
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      },
      async sequenceJobIds (val) {
        console.debug('sequence jobs updated', val)
        this.updateProcessingStatus()
      }
    },
    methods: {
      async loadData () {
        if (!this.user) return
        this.sequences = []
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
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
            created: map.created,
            updated: map.updated,
            uuid: map.uuid,
            body: {
              type: 'Video',
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
        await this.loadFavouriteSequences()
        this.$q.loading.hide()
      },
      updateProcessingStatus () {
        for (let sequence of this.sequences) {
          let processing = false
          for (let jobId of this.sequenceJobIds) {
            if (this.sequenceJobDetails[jobId].uuid === sequence.map.uuid) processing = true
          }
          sequence.processing = processing
        }
      },
      getItemStyle (item) {
        if (this.favouriteSequences.items && this.favouriteSequences.items.filter(seq => {
          return seq.body.source.id === item.annotation.body.source.id
        }).length > 0) {
          return {
            color: 'primary',
            icon: 'favorite'
          }
        }
        return {
          color: 'grey-5',
          icon: 'favorite_outline'
        }
      },
      async loadFavouriteSequences () {
        const query = {
          'target.id': this.sequencesFavouritesMapUUID,
          'author.id': this.user.uuid
        }
        this.favouriteSequences = await this.$store.dispatch('annotations/find', query)
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

        await this.loadData()
        await this.loadFavouriteSequences()
      },
      async deleteVideo (video) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, video.map.uuid)
        this.$q.loading.hide()
        await this.loadData()
      }
    }
  }
</script>

<style>
  .q-checkbox-icon {
    display: none !important;
  }

  .disabled .moba-inactive-image {
    filter: grayscale(100%);
    opacity: .6;
  }

  .moba-active-image {
    outline: solid cornflowerblue 1px;
    outline: solid white 1px;
    color: white;
  }

  .videoPreviewImg, .videoTitel {
    cursor: pointer;
  }

  .mega:not(:last-child),
  .moba-listItem {
    padding-bottom: 1em !important;
    margin-bottom: 1em;
    border-bottom: 1px solid grey;
  }

  .inner-loading {
    background-color: transparent !important;
  }

  .vjs-big-play-button {
    display: none !important;
  }

  .seq-video-player {
    padding: 0 25%;
  }

  .duration-video {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
</style>
