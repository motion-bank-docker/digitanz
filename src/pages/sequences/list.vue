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
          q-btn(v-if="!video.processing", flat, size="sm", round, icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")
          q-btn(v-if="!video.processing", flat, size="sm", round, icon="delete", @click="deleteVideo(video)")
          q-btn(v-if="!video.processing", flat, size="sm", round, icon="cloud_download", @click="download(video)")
          span(v-if="video.processing") Rendering...

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
  import { openURL } from 'quasar'
  import path from 'path'
  import VideoPlayer from '../../components/VideoPlayer'
  import FileUploader from '../../components/FileUploader'

  export default {
    components: {
      ModalPreview,
      VideoPlayer,
      FileUploader,
      VideoListView
    },
    data () {
      return {
        sequences: []
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
      async deleteVideo (video) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, video.map.uuid)
        this.$q.loading.hide()
        await this.loadData()
      },
      download (video) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(video.media)}`)
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
