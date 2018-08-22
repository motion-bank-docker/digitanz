<template lang="pug">

  q-page.relative-position

    q-btn.q-ma-md(@click="$router.push({path: '../videosequencer'})", :label="$t('buttons.back')",
    icon="keyboard_backspace", o-caps)

    h4.text-center {{ $t('pages.new_sequence.title') }}
    file-uploader(:url="url", :query="uploadQuery")

    // BUTTONS -- FILTER ORIENTATION
    //
    .text-center
      q-btn.q-mx-sm.text-white(@click="orientation = 'portrait'", :class="{'bg-primary' : orientation === 'portrait'}",
      icon="stay_current_portrait", :label="$t('buttons.orientation.portrait')", no-caps)
      q-btn.q-mx-sm.text-white(@click="orientation = 'landscape'", :class="{'bg-primary' : orientation === 'landscape'}",
      icon="stay_current_landscape", :label="$t('buttons.orientation.landscape')", no-caps)

    // DISPLAY FILTERED VIDEOS
    //
      div {{ checkedVideos.length }}
    q-list.no-padding.no-border.q-mt-lg
      q-item.q-ma-md.no-padding.q-caption.relative-position(
      v-for="video in uploadedVideos", tag="label", v-if="video.orientation === orientation")
        q-checkbox.hidden(v-model="checkedVideos", :val="video")
        img.fit(:src="video.preview.high", :class="{'moba-highlight-image': checkedVideos.includes(video)}")
        q-btn.absolute-top-right.bg-white.q-ma-sm.text-dark(round, size="sm") {{ video.duration }}

    .fixed-bottom.full-with.q-ma-md.text-center(v-if="checkedVideos.length > 1")
      q-btn.bg-primary.text-white(icon-right="arrow_forward", :label="$t('buttons.next')")

</template>

<script>
  import {ObjectUtil} from 'mbjs-utils'
  import { VideoHelper } from '../lib'
  import FileUploader from '../components/FileUploader'

  export default {
    components: {
      FileUploader
    },
    data () {
      return {
        checkedVideos: [],
        orientation: 'portrait',
        uploadQuery: {
          'title': 'Meine Videos'
        },
        uploadedVideos: []
      }
    },
    computed: {
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
      this.loadUploadedVideos()
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
        if (val) await this.loadUploadedVideos()
      }
    },
    methods: {
      checkOrientation () {
        alert('bla')
      },
      async loadUploadedVideos () {
        if (this.$store.state.auth.user) {
          let query = ObjectUtil.merge({
            'author.id': this.$store.state.auth.user.uuid
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
      },
      async saveSequence () {
        const detail = {
          title: 'Meine Sequenz',
          timeline: this.timeline ? this.timeline.uuid : undefined
        }
        const sequence = {
          map: {
            title: 'Meine Sequenz'
          },
          sources: this.checkedVideos.map(entry => {
            return entry.annotation
          })
        }
        // await this.$store.dispatch('sequences/post', { sequence, detail })
        console.debug('dummy save sequence', detail, sequence)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .moba-highlight-image
    border 2px solid $primary
</style>
