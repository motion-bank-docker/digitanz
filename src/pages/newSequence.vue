<template lang="pug">

  q-page.relative-position.q-mb-xl
    q-modal() preview

    h4.text-center.q-mb-none
      span(v-if="!hasUuid") {{ $t('pages.new_sequence.title') }}
      span(v-else) {{ $t('pages.edit_sequence.title') }}
    q-input.q-mx-md(:float-label="$t('labels.insert_title')", dark)
    // file-uploader(:url="url", :query="uploadQuery", @finish="addUploadedVideo")
    file-uploader(:url="url", :query="uploadQuery", @finish="")

    // BUTTONS -- FILTER ORIENTATION
    //
    .text-center(v-if="!hasUuid")
      q-btn.q-mx-sm.text-white(@click="orientation = 'portrait'", :class="{'bg-primary' : orientation === 'portrait'}",
      icon="stay_current_portrait", :label="$t('buttons.orientation.portrait')", no-caps)
      q-btn.q-mx-sm.text-white(@click="orientation = 'landscape'", :class="{'bg-primary' : orientation === 'landscape'}",
      icon="stay_current_landscape", :label="$t('buttons.orientation.landscape')", no-caps)

    // DISPLAY FILTERED VIDEOS
    //
    q-list.no-border.q-mt-lg.q-mb-xl
      q-item.q-ma-md.no-padding.q-caption.relative-position(
      :class="{'moba-inline' : !hasUuid, 'bg-green': checkedVideos.includes(video)}"
      v-for="video in uploadedVideos", tag="label", v-if="video.orientation === orientation")
        q-checkbox.hidden(v-model="checkedVideos", :val="video")
        // img.fit(:src="video.preview.high", :class="{'moba-highlight-image': checkedVideos.includes(video)}")
        img.fit(:src="video.preview.high", :class="{'moba-image' : hasUuid, 'moba-highlight-image': checkedVideos.includes(video)}")
        q-btn.absolute-top-left.bg-body-background.q-ma-sm(round, size="sm") {{ video.duration }}

    .fixed-bottom-left
      q-btn.q-mb-md.bg-body-background(@click="$router.push({path: '../videosequencer'})", icon="keyboard_backspace", flat)
      // q-btn.q-mb-md.bg-dark(@click="$router.push({path: '../videosequencer'})", :label="$t('buttons.back')",
        icon="keyboard_backspace", flat)

    .fixed-bottom-right.q-mb-md(v-if="checkedVideos.length > 0")
      q-btn.bg-primary.text-white(@click="$router.push({path: 'editsequence'})", icon-right="arrow_forward", :label="$t('buttons.next')", flat)

    q-btn.fixed-bottom.bg-black(@click="toggleHasUuid") dev switch

</template>

<script>
  import {ObjectUtil} from 'mbjs-utils'
  import Vue from 'vue'

  import FileUploader from '../components/FileUploader'
  import url from 'url'

  export default {
    components: {
      FileUploader
    },
    data () {
      return {
        checkedVideos: [],
        hasUuid: false,
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
      this.$root.$on('updateVideos', this.fetchData)
      this.fetchData()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.fetchData)
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
        if (val) await this.fetchData()
      }
    },
    methods: {
      toggleHasUuid () {
        this.hasUuid = !this.hasUuid
      },
      checkOrientation () {
        alert('bla')
      },
      async fetchData () {
        // const _this = this
        // const $drake = this.$dragula.$service
        // $service.options('checkedVideos', { direction: 'horizontal' })

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
            const results2 = await this.$store.dispatch('annotations/find', query)
            let newUploadedVideos = []
            for (let i in results2.items) {
              const annotation = results2.items[i]
              const meta = await this.$store.dispatch('metadata/get', annotation.uuid)
              const newVideo = Object.assign({}, {
                weight: parseInt(i),
                title: '', // annotation.body.value, // meta.title
                uuid: annotation.uuid,
                created: annotation.created,
                source: {id: annotation.body.source.id, type: 'video/mp4'},
                preview: this.getPreviewLinks(annotation.body.source.id),
                duration: meta ? this.formatDuration(meta.duration) : 1,
                orientation: (meta.height === 720) ? 'landscape' : 'portrait'
              })
              newUploadedVideos.push(newVideo)
              // this.listOfThings.push(annotation.uuid)
            }
            this.uploadedVideos = newUploadedVideos
            this.fetchedUserVideos = true
          }
        }
      },
      async addUploadedVideo (video) {
        const meta = await this.$store.dispatch('metadata/get', video.uuid)
        const newVideo = Object.assign({}, {
          weight: 0,
          title: video.body.value,
          uuid: video.uuid,
          created: video.created,
          source: {id: video.body.source.id, type: 'video/mp4'},
          preview: this.getPreviewLinks(video.body.source.id),
          duration: meta ? meta.duration : 1
        })
        Vue.set(this.uploadedVideos, this.uploadedVideos.length, newVideo)
      },
      getPreviewLinks (videoURL) {
        if (typeof videoURL !== 'string') return {}
        return {
          high: videoURL.replace(/\.mp4$/, '.jpg'),
          medium: videoURL.replace(/\.mp4$/, '-m.jpg'),
          small: videoURL.replace(/\.mp4$/, '-s.jpg')
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
      // LOADING PROCESS BUTTON
      startComputing () {
        this.loading = true
        const payload = {
          sources: this.checkedVideos.map(entry => {
            const parsed = url.parse(entry.source.id)
            return parsed.pathname
          })
        }
        const _this = this
        this.$params().then(params => {
          console.log('payload', payload, params)
          _this.$axios.post(`${params.urls[0].transcoder}/concat`, payload).then(response => {
            console.log(response.data)
            const composite = {
              author: _this.$store.state.auth.payload.userId,
              body: {
                type: 'Composite',
                purpose: 'personal',
                source: JSON.stringify({
                  type: 'video/mp4',
                  id: params.urls[0].streamer + '/' + response.data.uuid + '.mp4',
                  preview: _this.getPreviewLinks(params.urls[0].streamer + '/' + response.data.uuid + '.mp4')
                })
              }
            }
            return _this.$store.dispatch('annotations/create', composite)
              .then(composite => {
                console.log('added composite', composite)
                _this.loading = false
                _this.$router.push('/')
              })
          })
        })
      }
    },
    name: 'new-sequence'
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .bg-body-background
    background-color $body-background

  .moba-highlight-image
    border 2px solid $primary

  .moba-inline
    max-width 40%
    float left

  .moba-image
    max-width 50%

</style>
