<template lang="pug">

  q-page.relative-position.q-pb-lg

    q-collapsible.no-padding(group="seq", :label="$t('labels.video_selection')", opened)

      //
      template(slot="header")
        q-item-side
        q-item-main.text-center
          | {{ $t('labels.video_selection') }}

      // FILE UPLOADER
      //
      file-uploader(:url="url", :query="uploadQuery", @finish="")

      // BUTTONS -- FILTER ORIENTATION
      //
      .text-left.q-mt-md
        .row(@click="toggleOrientation")
          .col-2.q-pt-xs
            q-btn.text-white.bg-primary(no-caps,
            icon="stay_current_landscape",
            :class="{'disabled bg-grey-8': this.sequencedVideos.length > 0, 'rotate-90': orientation === 'portrait'}",
            round, size="sm")
          .col-5.q-pt-sm
            p(v-if="orientation === 'portrait'", :class="{'text-grey-8': this.sequencedVideos.length > 0}") {{ $t('buttons.orientation.portrait') }}
            p(v-else, :class="{'text-grey-8': this.sequencedVideos.length > 0}") {{ $t('buttons.orientation.landscape') }}

      // DISPLAY FILTERED VIDEOS
      //
      sequence-videolist(:imgorientation="orientation", @checkedVideos="vids")

    q-collapsible.q-mb-mb(group="seq", :label="$t('labels.edit_sequence')")
      //
      template(slot="header")
        q-item-side
        q-item-main.text-center
          | {{ $t('labels.edit_sequence') }}
          // q-chip(color="primary", small) {{ $t('labels.edit_sequence') }}

      div(v-if="sequencedVideos.length > 0")
        //
          video-player.full-width.self-center(
          v-show="sequencedVideos.length > 0",
          // :class="orientationClass",
          // :src="sourceVideo",
          ref="videoPlayer",
          autoplay="true",
          @ended="playNext",
          @play="setPlayerStatePlay()",
          @pause="setPlayerStatePause()")

        video-player.full-width.self-center.q-mb-sm(
        :class="orientationClass",
        :src="sourceVideo",
        ref="videoPlayer",
        autoplay="true",
        @ended="playNext",
        @play="setPlayerStatePlay()",
        @pause="setPlayerStatePause()")

        // DISPLAY VIDEOS
        //
        q-list.no-border
          div.shadow-6.q-mb-md(v-for="(video, i) in sequencedVideos")
            q-item.no-padding(style="overflow: hidden;")
              q-item-main.relative-position(style="margin-bottom: -10px; overflow: hidden;")
                img(:src="video.preview.medium", style="max-height: 160px; max-width: 50vw; margin-bottom: -4px;")
                span.absolute-top-left.bg-body-background.text-white.q-ma-sm.q-pa-xs.round-borders.q-caption
                  | {{ formatDuration(video.metadata.duration) }}

              q-item-side.column
                q-item-tile
                  q-btn.q-ma-xs.bg-dark(@click="editIndex = index, moveUp(sequencedVideos, editIndex)", round, icon="arrow_upward", dark)
                  q-btn.q-ma-xs.bg-dark(@click="editIndex = index, moveDown(sequencedVideos, editIndex)", round, icon="arrow_downward", dark)
                q-item-tile
                  q-btn.q-ma-xs.bg-dark(@click="editIndex = index, duplicateVideo(editIndex)", round, icon="filter_none", dark)
                  q-btn.q-ma-xs.bg-dark(@click="editIndex = index, deleteItem(editIndex)", round, icon="delete", dark)

          .text-center(v-if="sequencedVideos.length > 0")
            q-btn.q-mt-lg.bg-green.text-white(@click="$router.push({path: '../sequences'})", icon="check", :label="$t('buttons.save')", flat)

      .text-center.text-grey-8.q-caption.q-pa-lg.bg-grey-10(v-else) {{ $t('messages.empty') }}

    // .fixed-bottom-left.q-ma-md
      q-btn.bg-white(@click="$router.push({path: '../sequences'})", icon="keyboard_backspace", flat, round)

    // q-btn.fixed-bottom.bg-black(@click="toggleHasUuid") dev switch

</template>

<script>
  import {ObjectUtil} from 'mbjs-utils'
  import { VideoHelper } from '../../lib'
  import FileUploader from '../../components/FileUploader'
  import SequenceVideolist from '../../components/SequenceVideolist'
  import VideoPlayer from '../../components/VideoPlayer'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      FileUploader,
      SequenceVideolist,
      VideoPlayer
    },
    data () {
      return {
        checkedVideos: [],
        hasUuid: false,
        orientation: 'portrait',
        selectedUuid: 'hallo',
        sequencedVideos: [],
        uploadQuery: {
          'title': 'Meine Videos'
        },
        uploadedVideos: [],
        videos: [],
        timeline: {
          title: undefined,
          type: ['Timeline']
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      reverseVideos () {
        return this.uploadedVideos.slice().reverse()
        // return this.uploadedVideos
      },
      sortedByOrientation () {
        let direction = ''
        this.orientation === 'portrait' ? direction = '-' : direction = ''
        return this.uploadedVideos.slice().sort(this.dynamicSortMultiple(direction + 'orientation', '-weight'))
      },
      user () {
        return this.$store.getters['auth/getUserState']
      },
      jobIds () {
        return this.$store.getters['conversions/getJobIds']
      },
      orientationClass () {
        if (this.orientation === 'portrait') return 'seq-video-player'
      },
      controlIcon () {
        if (this.$refs.videoPlayer.paused) return 'play_arrow'
        return 'pause'
      }
    },
    mounted () {
      this.$root.$on('updateVideos', this.loadUploadedVideos)
      this.loadData()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadUploadedVideos)
    },
    watch: {
      orientation (val) {
        console.log(val)
        this.checkedVideos = []
      },
      checkedVideos (val) {
        console.log(val)
      },
      preview (val) {
        this.showPreviewModal = typeof val !== 'undefined'
      },
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      vids (val) {
        // this.checkedVideos = val
        this.sequencedVideos = val
      },
      toggleOrientation () {
        if (this.checkedVideos.length <= 0) {
          if (this.orientation === 'portrait') this.orientation = 'landscape'
          else this.orientation = 'portrait'
        }
      },
      async loadData () {
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        if (this.$route.params.uuid && !this.timeline.uuid) {
          const prefix = 'Sequenz: '
          const timeline = await this.$store.dispatch('maps/get', this.$route.params.uuid)
          timeline.title = timeline.title.substr(prefix.length)
          this.timeline = timeline
          const query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.$route.params.uuid}`
          }
          const items = await VideoHelper.fetchVideoItems(this, query, this.$sort.onRef)
          this.videos = items.map((item, i) => {
            item.weight = parseInt(i)
            item.title = ''
            item.orientation = item.metadata.height < item.metadata.width ? 'landscape' : 'portrait'
            return item
          })
        }
        await this.loadUploadedVideos()
        this.$q.loading.hide()
      },
      async saveSequence () {
        const prefix = 'Sequenz: '
        let payload = this.timeline
        payload.title = `${prefix}${payload.title}`
        if (payload.uuid) {
          await this.$store.dispatch('maps/patch', [payload.uuid, payload])
        }
        else {
          payload = await this.$store.dispatch('maps/post', payload)
        }
        const detail = {
          title: this.timeline.title,
          timeline: payload.uuid
        }
        const sequence = {
          uuid: payload.uuid,
          map: {
            title: this.timeline.title
          },
          sources: this.videos.map(entry => {
            return entry.annotation
          })
        }
        // await this.$store.dispatch('sequences/post', { sequence, detail })
        console.debug('dummy render sequence', detail, sequence)
      },
      toggleHasUuid () {
        this.hasUuid = !this.hasUuid
      },
      checkOrientation () {
        alert('bla')
      },
      async loadUploadedVideos () {
        if (!this.user) return
        let query = ObjectUtil.merge({
          'author.id': this.user.uuid
        }, this.uploadQuery)
        const results = await this.$store.dispatch('maps/find', query)
        if (results.items && results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`
          }
          const videos = await VideoHelper.fetchVideoItems(this, query)
          for (let i in videos) {
            videos[i].weight = parseInt(i)
            videos[i].title = ''
            videos[i].orientation = videos[i].metadata.height < videos[i].metadata.width ? 'landscape' : 'portrait'
          }
          this.uploadedVideos = videos
        }
      },
      openModal () {
        this.checkedVideos = []
        this.opened = true
        // restart sequencer if no videos are selected
        if (this.sequencedVideos.length === 0) {
          this.orientation = undefined
        }
      },
      formatDuration (duration) {
        let minutes = Math.floor(duration / 60).toString()
        let seconds = (duration - minutes * 60).toString().split('.')[0]
        if (seconds.length < 2) seconds = '0' + seconds
        return minutes.toString() + ':' + seconds.toString()
      },
      setPlayerStatePlay () {
        this.playing = true
      },
      setPlayerStatePause () {
        this.playing = false
      },
      closeModal () {
        this.opened = false
        this.sequencedVideos = this.sequencedVideos.concat(this.checkedVideos)
        this.loadFirstVideo()
      },
      closePreview () {
        this.preview = undefined
      },
      setPreview (annotation) {
        this.preview = annotation.source.source
      },
      setSequence () {
        this.preview = this.uploadedVideos
      },
      openPreview (index) {
        this.setVideoSource(this.sequencedVideos[index].source.id)
        this.currentPlay = index
      },
      setVideoSource (source) {
        this.$refs.videoPlayer.setSources({type: 'video/mp4', src: source})
      },
      togglePlay () {
        let player = this.$refs.videoPlayer
        if (player.isPaused() !== true) player.pause()
        else player.play()
      },
      isPaused () {
        return this.$refs.videoPlayer.isPaused()
      },
      playNext () {
        if (typeof this.currentPlay !== 'undefined' && this.sequencedVideos.length > 0) {
          if (this.currentPlay < this.sequencedVideos.length - 1) {
            this.openPreview(this.currentPlay += 1)
          }
          else {
            this.openPreview(0)
          }
        }
      },
      playPrev () {
        if (typeof this.currentPlay !== 'undefined') {
          if (this.currentPlay > 0) {
            this.openPreview(this.currentPlay -= 1)
          }
          else {
            this.currentPlay = this.sequencedVideos.length - 1
            this.openPreview(this.currentPlay)
          }
        }
      },
      // METHODS TO EDIT SELECTED VIDEO
      deleteItem: function (item) {
        this.$refs.videoPlayer.reset()
        this.sequencedVideos.splice(item, 1)
        this.editIndex = -1
        // this.playNext()
        this.loadFirstVideo()
        // this.sourceVideo = undefined
      },
      // MOVING ITEMS THROUGH ARROWS (REPLACE THIS WITH DRAGNDROP AS SOON AS IT WORKS)
      moveItem: function (array, element, delta) {
        this.newIndex = this.editIndex + delta
        // moving a playing video requires to update currentPlay..
        if (element === this.currentPlay) this.currentPlay = this.newIndex
        if (this.newIndex < 0 || this.newIndex === array.length) return // Already at the top or bottom.
        this.indexes = [this.editIndex, this.newIndex].sort((a, b) => a - b) // Sort the indexes
        array.splice(this.indexes[0], 2, array[this.indexes[1]], array[this.indexes[0]]) // Replace from lowest index, two elements, reverting the order
      },
      moveUp: function (array, element) {
        this.moveItem(array, element, -1)
        if (this.editIndex > 0) {
          this.editIndex -= 1
        }
      },
      moveDown: function (array, element) {
        this.moveItem(array, element, 1)
        if (this.editIndex < this.sequencedVideos.length - 1) {
          this.editIndex += 1
        }
      },
      duplicateVideo: function (video) {
        const newObject = Object.assign({}, this.sequencedVideos[video])
        this.sequencedVideos.splice(this.editIndex + 1, 0, newObject)
      },
      loadFirstVideo: function () {
        if (typeof this.sequencedVideos !== 'undefined' && this.sequencedVideos.length > 0) {
          this.openPreview(0)
        }
      },
      dynamicSort (property) {
        let sortOrder = 1
        if (property[0] === '-') {
          sortOrder = -1
          property = property.substr(1)
        }
        return function (a, b) {
          let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
          return result * sortOrder
        }
      },
      dynamicSortMultiple () {
        const _this = this
        let props = arguments
        return function (obj1, obj2) {
          let i = 0, result = 0, numberOfProperties = props.length
          while (result === 0 && i < numberOfProperties) {
            result = _this.dynamicSort(props[i])(obj1, obj2)
            i++
          }
          return result
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .bg-body-background
    background-color $body-background

  .moba-highlight-image
    // border 2px solid $primary
    background-color $primary

  .moba-inline
    max-width 20%
    // float left

  .moba-image
    max-width 50%

  .moba-landscape
    width 50%
    display inline-block
    margin-top -4px

  .moba-portrait
    width 33.3333%
    display inline-block
    margin-top -4px
</style>
