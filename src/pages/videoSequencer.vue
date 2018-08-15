<template lang="pug">
  q-page.row.flex.no-margin.no-scroll

    // POP UP MODAL TO ADD VIDEOS TO SEQUENCER-TIMELINE
    q-modal.row.maximized(v-model="opened", content-classes="bg-dark")
      .q-ma-md
        h1.q-title Format wählen
        q-btn-toggle(v-model="orientation" :options="[{label: 'Landscape', value: 'landscape'}, {label: 'Portrait', value: 'portrait'}]")
      .q-ma-md
        h1.q-title Video hochladen
        file-uploader.no-padding.no-margin.self-center(:url="url", style="width: 100%", @finish="addUploadedVideo")
        template(v-if="jobIds.length")
          h1.q-title(v-if="jobIds") Videos being processed
          q-item(v-for="(jobId, index) in jobIds")
            span {{jobId}}
        h1.full-width.q-title Wähle deine Videos

        q-list.row.no-border.relative-position(style="min-height:100px")
          q-item.q-mb-md.full-width(v-for="video in reverseVideos", :key="video.uuid", :title="video.title",
          :class="[{ 'moba-active-image': checkedVideos.includes(video)}, moba-inactive-image]", v-show="fetchedUserVideos")
            q-checkbox(v-model="checkedVideos" :val="video")
              q-item-side(:class="{'moba-inactive-image': !checkedVideos.includes(video)}")
                img(:src="video.preview", style="width: 150px", alt="video.title")
              q-item-main
                p.no-margin.text-weight-medium {{ video.title }}
                q-chip.text-weight-light(small color="black") {{ video.duration }}
          q-inner-loading.inner-loading(:visible="!fetchedUserVideos" dark)
            q-spinner-mat(color="white" size="3em")
        q-btn.full-width.fixed-bottom(v-if="checkedVideos.length > 0" color="primary" @click="closeModal" icon="add" label="Hinzufügen")
        q-btn.full-width.fixed-bottom(v-else color="primary" @click="closeModal" icon="arrow_back" label="Zurück")

    // BIG VIDEO PREVIEW
    video-player.full-width.self-center(
    v-if="sourceVideo != undefined",
    :class="orientationClass",
    :src="sourceVideo",
    ref="videoPlayer",
    @ended="playNext")

    // EDIT BUTTONS
    //.row.bg-red
      q-list.q-ml-lg(v-if="sequencedVideos.length > 0", no-border, style="touch-action:none")
        q-item.items-baseline.bg-primary(style="width: relativeSize + '%'" v-for="(video, index) in sequencedVideos", :key="video.uuid")
    //.row.q-pa-xs.full-width.justify-center
      q-btn.q-ma-xs(round, color="primary", icon="add", @click="checkedVideos=[], opened = true")
      q-btn.q-ma-xs(round, color="primary", icon="arrow_back", outline, @click="moveUp(sequencedVideos, editIndex)")
      q-btn.q-ma-xs(round, color="primary", icon="arrow_forward", outline, @click="moveDown(sequencedVideos, editIndex)")
      // q-btn.q-ma-xs(round, color="primary", icon="timer", outline)
      // q-btn.q-ma-xs(round, color="primary", icon="fast_rewind", outline)
      // q-btn.q-ma-xs(round, color="primary", icon="filter_none", outline, @click="duplicateVideo(editIndex)")
      //q-btn.q-ma-xs(round, color="primary", icon="delete", outline, @click="deleteItem(editIndex)")

    // Player controls
    .q-ma-md.full-width.row.justify-center(v-if="sequencedVideos.length > 0")
      // q-btn.q-ma-xs(round, size="sm" color="white", icon="play_arrow", outline, @click="editIndex = index, moveUp(sequencedVideos, editIndex)")
      // q-btn.q-ma-xs(round, size="sm" color="white", icon="pause", outline, @click="editIndex = index, moveUp(sequencedVideos, editIndex)")
      .q-mr-sm
        q-btn(round, size="sm" color="white", icon="skip_previous", outline, @click="playPrev")
      .q-ml-sm
        q-btn(round, size="sm" color="white", icon="skip_next", outline, @click="playNext")

    // SENQUENCED VIDEOS
    q-list.no-padding.no-border(style="width: 100%")
      q-item.items-baseline
        q-item-main.vertical-center
          .q-mb-md.row.justify-between.items-center(v-if="sequencedVideos.length > 0")
            h3.q-title.no-margin(v-if="sequencedVideos.length > 0") Videos
            q-btn.no-margin(round, color="primary", icon="add", @click="checkedVideos=[], opened = true")
          .q-mb-md(v-else, style="text-align:center")
            .q-ma-md.q-body-2 Füge deine ersten Videos hinzu
            q-btn.q-ma-md(round, color="primary", icon="add", @click="checkedVideos=[], opened = true")

          q-list.q-mb-xl.no-border
            q-item.no-padding.mega(v-for="(video, index) in sequencedVideos")
              .col
                img.videoPreviewImg(:src="video.preview", style="width: 150px", alt="video.title", @click="openPreview(index), editIndex = index")

                //q-btn.no-wrap.full-width(align="left", dark, color="primary", :class="{ 'bg-red': editIndex == index }", :key="index", @click="openPreview(video.source), editIndex = index") {{ video.title || video.uuid }}
              .col
                h2.q-subheading.videoTitel.no-margin.vertical-top(@click="openPreview(index), editIndex = index") {{ video.title || video.uuid }}
                .row
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="arrow_upward", outline, @click="editIndex = index, moveUp(sequencedVideos, editIndex)")
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="arrow_downward", outline, @click="editIndex = index, moveDown(sequencedVideos, editIndex)")
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="filter_none", outline, @click="editIndex = index, duplicateVideo(editIndex)")
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="delete", outline, @click="editIndex = index, deleteItem(editIndex)")

    // BUTTONS BOTTOM
    .row.q-ma-md.full-width.justify-center.items-end
      // q-btn.justify-center(icon="save", color="primary", label="Speichern", :loading="loading", :percentage="percentage2", @click="startComputing")
      q-btn.full-width.fixed-bottom(v-if="sequencedVideos.length > 0" icon="save"
      color="primary" label="Speichern"
      :loadinv="loading", :percentage="percentage2",
      @click="startComputing")
      // span(slot="loading")
         // q-spinner-gears(class="on-left") Laden ...

    modal-preview(:show="showPreviewModal", :preview="preview", @canceled="closePreview")
</template>

<script>
  import Vue from 'vue'
  import ModalPreview from '../components/VideoModal'
  import { VideoPlayer } from 'mbjs-quasar/src/components'
  // import VideoPlayer from '../components/VideoPlayer'
  import FileUploader from '../components/FileUploader'
  import url from 'url'

  export default {
    components: {
      ModalPreview,
      VideoPlayer,
      FileUploader
    },
    data () {
      return {
        loading: false,
        fetchedUserVideos: false,
        percentage2: 0,
        sourceVideo: undefined,
        preview: undefined,
        showPreviewModal: false,
        opened: false,
        checkedVideos: [],
        chosenVideos: [],
        listOfThings: [],
        oldQuoteIndex: -1,
        newQuoteIndex: '',
        relativeSize: 50,
        percentage: '',
        sequencedVideosAllDurations: 0,
        sequencedVideosTimeline: 0,
        uploadedVideos: [],
        sequencedVideos: [],
        editIndex: -1,
        newIndex: '',
        indexes: '',
        currentPlay: undefined,
        orientation: undefined
      }
    },
    computed: {
      reverseVideos () {
        return this.uploadedVideos.slice().reverse()
        // return this.uploadedVideos
      },
      user () {
        return this.$store.getters['auth/getUserState']
      },
      jobIds () {
        return this.$store.getters['conversions/getJobIds']
      },
      orientationClass () {
        if (this.orientation === 'portrait') return 'seq-video-player'
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
      preview (val) {
        this.showPreviewModal = typeof val !== 'undefined'
      },
      async user (val) {
        if (val) await this.fetchData()
      }
    },
    methods: {
      async fetchData () {
        // const _this = this
        // const $drake = this.$dragula.$service
        // $service.options('checkedVideos', { direction: 'horizontal' })

        if (this.$store.state.auth.user) {
          let query = {
            'author.id': this.$store.state.auth.user.uuid,
            'title': 'Meine Videos'
          }
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
              console.log('meta data', meta)
              const newVideo = Object.assign({}, {
                weight: parseInt(i),
                title: annotation.body.value, // meta.title
                uuid: annotation.uuid,
                created: annotation.created,
                source: {id: annotation.body.source.id, type: 'video/mp4'},
                preview: annotation.body.source.id.replace(/\.mp4$/, '.png'),
                duration: meta ? meta.duration : 1,
                orientation: (meta.height === 720) ? 'landscape' : 'portrait'
              })
              newUploadedVideos.push(newVideo)
              // this.listOfThings.push(annotation.uuid)
              console.log('new', newVideo)
            }
            this.uploadedVideos = newUploadedVideos
            console.log(this.uploadedVideos)

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
          source: { id: video.body.source.id, type: 'video/mp4' },
          preview: video.body.source.id.replace(/\.mp4$/, '.png'),
          duration: meta ? meta.duration : 1
        })
        Vue.set(this.uploadedVideos, this.uploadedVideos.length, newVideo)
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
        this.$refs.videoPlayer.setSources({ type: 'video/mp4', src: source })
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
        //  this.sourceVideo = undefined
      },
      // MOVING ITEMS THORUGH ARROWS (REPLACE THIS WITH DRAGNDROP AS SOON AS IT WORKS)
      moveItem: function (array, element, delta) {
        this.newIndex = this.editIndex + delta
        // moving a playing video requires to update currentPlay..
        if (element === this.currentPlay) this.currentPlay = this.newIndex
        if (this.newIndex < 0 || this.newIndex === array.length) return // Already at the top or bottom.
        this.indexes = [this.editIndex, this.newIndex].sort((a, b) => a - b) // Sort the indexes
        array.splice(this.indexes[0], 2, array[this.indexes[1]], array[this.indexes[0]]) // Replace from lowest index, two elements, reverting the order
        console.log('old position: ' + element + ' new position: ' + this.newIndex)
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
                  preview: params.urls[0].streamer + '/' + response.data.uuid + '.png'
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
    }
  }
</script>

<style>
  .q-checkbox-icon {
    display: none!important;
  }
  .moba-inactive-image {
    filter: grayscale(100%);
    opacity: .6;
  }
  .moba-active-image {
    outline: solid cornflowerblue 1px;
    outline: solid white 1px;
    border-radius: 50%;
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
    padding: 0 20%;
  }
</style>
