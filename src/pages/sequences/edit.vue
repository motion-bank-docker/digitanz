<template lang="pug">
  q-page.relative-position
    q-tabs(animated, swipeable, color="transparent", text-color="secondary", align="justify" v-model="selectedTab")
      q-tab(default name="tab-1" slot="title" icon="add")
      q-tab(name="tab-2" slot="title" icon="edit")

      // ADD VIDEOS
      //
      q-tab-pane(keep alive, name="tab-1")
        //
        template(slot="header")
          q-item-side
          q-item-main.text-center
            | {{ $t('labels.video_selection') }}
        // FILE UPLOADER
        //
        file-uploader(:url="url", :query="uploadQuery")

        job-list

        // BUTTONS -- FILTER ORIENTATION
        //
        .text-left.q-mt-md
          .row(@click="toggleOrientation")
            .col-2.q-pt-xs
              q-btn.text-white.bg-primary(no-caps,
              icon="stay_current_landscape",
              :class="{'disabled bg-grey-8': this.videos.length > 0, 'rotate-90': orientation === 'portrait'}",
              round, size="sm")
            .col-5.q-pt-sm
              p(v-if="orientation === 'portrait'", :class="{'text-grey-8': this.videos.length > 0}") {{ $t('buttons.orientation.portrait') }}
              p(v-else, :class="{'text-grey-8': this.videos.length > 0}") {{ $t('buttons.orientation.landscape') }}

        // DISPLAY FILTERED VIDEOS
        //
        sequence-videolist(:orientation="orientation", @submit="addVideos", :videos="uploadedVideos")

      // .fixed-bottom-left.q-ma-md
        q-btn.bg-white(@click="$router.push({path: '../sequences'})", icon="keyboard_backspace", flat, round)

      // q-btn.fixed-bottom.bg-black(@click="toggleHasUuid") dev switch
      //
      // SEQUENCER
      //
      q-tab-pane(keep alive, name="tab-2")
        div(v-if="videos.length")

          video-player.self-center.q-mb-sm(
          v-if="currentVideo",
          :class="orientationClass",
          :annotation="currentVideo",
          ref="videoPlayer",
          autoplay="true",
          @ended="playNext",
          @play="setPlayerStatePlay()",
          @pause="setPlayerStatePause()",
          style="height: 50vh; overflow: hidden")

          // DISPLAY VIDEOS
          //
          q-list.no-border.scroll(style="height: 30vh")
            div.shadow-6.q-mb-md(v-for="(video, index) in videos")
              q-item.no-margin.no-padding.overflow-hidden(:style="{border: currentVideo === video.annotation ? '1px solid grey' : '1px solid transparent'}")
                q-item-main.relative-position(@click.native="openPreview(index)")
                  video-item(
                  :key="video.annotation.uuid"
                  :video="video"
                  :allowSelfResponse="allowSelfResponse",
                  :hideButtons="true"
                  style="height: 50px")
                //
                  img(:src="video.preview.medium", style="max-height: 160px; max-width: 50vw; margin-bottom: -4px;")
                  span.absolute-top-left.bg-body-background.text-white.q-ma-sm.q-pa-xs.round-borders.q-caption
                    | {{ formatDuration(video.metadata.duration) }}

                q-item-side.row
                  q-item-tile
                    q-btn.q-ma-xs(@click="moveUp(index)", round, icon="arrow_upward", dark, flat, size="sm")
                    q-btn.q-ma-xs(@click="moveDown(index)", round, icon="arrow_downward", dark, flat, size="sm")
                    q-btn.q-ma-xs(@click="duplicateVideo(index)", round, icon="filter_none", dark, flat, size="sm")
                    q-btn.q-ma-xs(@click="deleteItem(index)", round, icon="delete", dark, flat, size="sm")

            .text-center(v-if="videos.length > 0")
              q-btn.q-mt-lg.bg-primary.text-white(@click="saveSequence", icon="check", :label="$t('buttons.save')", flat)
            .text-center.text-grey-8.q-caption.q-pa-lg.bg-grey-10(v-else) {{ $t('messages.empty') }}

</template>

<script>
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import { VideoHelper, SequenceHelper } from '../../lib'
  import FileUploader from '../../components/FileUploader'
  import SequenceVideolist from '../../components/SequenceVideolist'
  import VideoPlayer from '../../components/VideoPlayer'
  import { mapGetters } from 'vuex'
  import JobList from '../../components/JobList'
  import VideoItem from '../../components/VideoItem'

  export default {
    components: {
      FileUploader,
      SequenceVideolist,
      VideoPlayer,
      JobList,
      VideoItem
    },
    data () {
      return {
        hasUuid: false,
        orientation: 'portrait',
        selectedUuid: 'hallo',
        uploadQuery: {
          'title': 'Meine Videos'
        },
        uploadedVideos: [],
        videos: [],
        targetTimeline: undefined,
        timeline: {
          title: undefined,
          type: ['Timeline']
        },
        currentVideo: undefined,
        selectedTab: 'tab-1'
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
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
      this.$root.$on('updateVideos', this.loadUploadedVideos)
      this.loadData()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadUploadedVideos)
    },
    watch: {
      orientation (val) {
        console.debug('orientation change', val)
      },
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      addVideos (selectedVideos) {
        this.videos = this.updateWeights(this.videos.concat(selectedVideos))
        console.debug('added videos', selectedVideos, this.videos)
        //if (this.videos.length) this.$refs.sequenceGroup.show()
        this.openPreview(0)
        this.selectedTab = 'tab-2'
      },
      toggleOrientation () {
        if (this.videos.length <= 0) {
          if (this.orientation === 'portrait') this.orientation = 'landscape'
          else this.orientation = 'portrait'
        }
      },
      async initTimeline () {
        const results = await this.$store.dispatch('maps/find', {
          'title': 'Meine Sequenzen',
          'author.id': this.user.uuid
        })
        if (results.items.length) {
          this.targetTimeline = results.items[0]
        }
        else {
          const map = {
            title: 'Meine Sequenzen',
            type: ['Timeline']
          }
          this.targetTimeline = await this.$store.dispatch('maps/post', map)
        }
      },
      async loadData () {
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        await this.initTimeline()
        if (this.$route.params.uuid && !this.timeline.uuid) {
          const prefix = 'Sequenz: '
          const timeline = await this.$store.dispatch('maps/get', this.$route.params.uuid)
          timeline.title = timeline.title.substr(prefix.length)
          this.timeline = timeline
          const query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.$route.params.uuid}`
          }
          const items = await VideoHelper.fetchVideoItems(this, query, this.$sort.onRef)
          this.videos = this.updateWeights(items.map((item) => {
            item.title = ''
            item.orientation = item.metadata.height < item.metadata.width ? 'landscape' : 'portrait'
            return item
          }))
          if (this.videos.length) this.orientation = this.videos[0].orientation
        }
        console.debug('loaded map data', this.timeline, this.videos)
        await this.loadUploadedVideos()
        if (this.videos.length) {
          this.$refs.sequenceGroup.show()
          this.currentPlay = 0
          this.openPreview(this.currentPlay)
        }
        this.$q.loading.hide()
      },
      updateWeights (items) {
        for (let i in items) {
          items[i].weight = parseInt(i)
        }
        return items
      },
      async saveSequence () {
        this.$q.loading.show({ message: this.$t('messages.saving_sequence') })
        const prefix = 'Sequenz: '
        let payload = this.timeline
        let initial = false
        payload.title = `${prefix}${payload.title}`
        if (payload.uuid) {
          await this.$store.dispatch('maps/patch', [payload.uuid, payload])
        }
        else {
          payload = await this.$store.dispatch('maps/post', payload)
          initial = true
        }
        const query = {
          'target.id': `${process.env.TIMELINE_BASE_URI}${payload.uuid}`
        }
        let results = await this.$store.dispatch('annotations/find', query)
        for (let item of results.items) {
          await this.$store.dispatch('annotations/delete', item.uuid)
        }
        const baseTime = DateTime.local().minus(this.videos.length * 1000)
        for (let i in this.videos) {
          const video = this.videos[i]
          const annotation = {
            target: {
              id: `${process.env.TIMELINE_BASE_URI}${payload.uuid}`,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: baseTime.plus(parseInt(i) * 1000).toISO()
              }
            },
            body: ObjectUtil.merge({}, video.annotation.body)
          }
          results = await this.$store.dispatch('annotations/post', annotation)
          console.debug('added video annotation', results)
        }
        await SequenceHelper.renderSequence(this, payload, initial ? this.targetTimeline : undefined, this.videos)
        this.$q.loading.hide()
        this.$router.push('/sequences')
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
      closePreview () {
        this.preview = undefined
      },
      setPreview (annotation) {
        this.preview = annotation.source.source
      },
      openPreview (index) {
        this.currentVideo = this.videos[index].annotation
        this.currentPlay = index
      },
      setSequence () {
        this.preview = this.uploadedVideos
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
        if (typeof this.currentPlay !== 'undefined' && this.videos.length > 0) {
          if (this.currentPlay < this.videos.length - 1) {
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
            this.currentPlay = this.videos.length - 1
            this.openPreview(this.currentPlay)
          }
        }
      },
      // METHODS TO EDIT SELECTED VIDEO
      deleteItem: function (index) {
        let nextCurrentVideo
        if (this.videos[index] === this.currentVideo && index > 0) {
          nextCurrentVideo = index - 1
        }
        else if (index === 0 && this.videos.length > 1) {
          nextCurrentVideo = 0
        }
        const copy = [].concat(this.videos)
        copy.splice(index, 1)
        this.videos = this.updateWeights(copy)
        this.openPreview(nextCurrentVideo)
      },
      moveUp: function (index) {
        if (index === 0) return
        const copy = [].concat(this.videos)
        const moved = copy.splice(index, 1)
        copy.splice(index - 1, 0, moved[0])
        this.videos = this.updateWeights(copy)
        this.openPreview(index)
      },
      moveDown: function (index) {
        if (index === this.videos.length - 1) return
        const copy = [].concat(this.videos)
        const moved = copy.splice(index, 1)
        copy.splice(index + 1, 0, moved[0])
        this.videos = this.updateWeights(copy)
        this.openPreview(index)
      },
      duplicateVideo: function (index) {
        const newObject = ObjectUtil.merge({}, this.videos[index])
        newObject.weight = this.videos.length
        this.videos.push(newObject)
      },
      loadFirstVideo: function () {
        if (typeof this.videos !== 'undefined' && this.videos.length > 0) {
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
