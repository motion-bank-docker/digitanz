<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-scroll-observable(@scroll="scrollingHandler")
    q-window-resize-observable(@resize="onResize")

    // ---------------------------------------------------------------------------------------------------------- header
      q-layout-header.bg-grey-3.text-grey-9.z-max.transition(
      // :class="{'leave-top': currentAppName === 'Startscreen' && scrollPosition <= deviceDimensions.height - 16}",
      style="box-shadow: 0 0 3px 0 rgba(0, 0, 0, .3)")

    // q-layout-header.bg-grey-1.text-grey-9.z-max.transition.no-shadow(
    // :class="{'leave-top': currentAppName === 'Startscreen' && scrollPosition <= (this.deviceDimensions.height * 0.34 + 48)}")

    // q-layout-header.bg-grey-3.text-grey-9.z-max.shadow-2(v-if="currentAppName !== 'Startscreen'")
    q-layout-header.bg-grey-3.text-grey-9.z-max.soft-shadow
      q-item.q-pa-none

        //----- back-button
        q-item-side.min-width-auto.overflow-hidden.row(:class="{'offset': !usingTool}",
        style="transition: all ease 200ms; width: 54px; min-height: 50px;")
          q-btn.self-center.text-grey-9.q-ml-md(@click="$router.push('/tools')", no-ripple, round, size="sm", flat)
            .q-subheading.text-weight-medium.text-weight-regular
              q-icon(name="keyboard_backspace")

        //----- title
        q-item-main.text-weight-bold

          //----- digitanz light
          q-btn.q-title.lowercase(v-if="!usingTool",
          @click="$router.push('/')", flat, align="left", no-ripple) #digitanz
            span.text-weight-light &nbsp;lite

          //----- app name
          q-btn.q-title.capitalize.full-width.q-pl-sm(v-else, flat, no-ripple, align="left")
            .ellipsis {{ currentAppName }}

        //----- info-button
        q-item-side.q-pr-md.absolute-top-right.q-pt-sm.q-mt-xs
          q-btn.absolute-top-right.text-grey-9.transition.q-mt-sm.q-mr-md(
          v-if="currentAppName !== 'Startscreen'",
          @click="handlerInfoBox", round,
          size="sm", flat, :class="[showInfoBox || currentAppName === 'Tools' ? 'leave-right' : '']")
            .q-subheading.text-weight-medium.text-weight-regular ?

    // -----------------------------------------------------------------------------------------------------------------
    q-page-container

      .relative-position(v-if="currentAppName !== 'Startscreen'")

        //----- invisible space placeholder
        div.bg-grey-3.text-grey-9.transition.overflow-hidden(:class="[showInfoBox ? 'height-auto' : 'height-0']",
        :style="{height: infoBoxHeight + 'px', 'max-height': infoBoxHeightMax + 'px'}")

        //----- visible info-box
        .fixed-top.bg-grey-1.text-grey-9.transition.overflow-hidden(
        style="z-index: 10; top: 52px",
        position="top",
        :class="[showInfoBox ? 'height-auto' : 'height-0']",
        :style="{height: infoBoxHeight + 'px', 'max-height': infoBoxHeightMax + 'px'}")

          //----- play-button
            .fit.row.items-center.justify-between(v-if="!usingTool")
              .text-center.full-width
                q-btn.bg-grey-1.text-grey-9(flat, round, size="lg")
                  q-icon(name="play_arrow")

          //----- title
          template(v-if="!usingTool && currentAppName !== undefined")

            // video-player(:options="playerOptions", :key="video.key")
            video-player(:src="video.src", :ratio="'16:9'", :key="video.key")

            q-btn.bg-grey-1.tetx-grey-9.absolute-top-left.q-mt-sm.q-ml-md.q-px-md.q-py-xs(
            v-for="t in tools", v-if="t.name === tool", flat, no-caps, round, size="sm")
              .q-subheading.text-weight-medium.text-weight-regular ?
              q-popover.bg-grey-9.q-px-md.q-py-md.text-grey-1.q-caption.text-weight-medium.q-mx-sm.q-mb-sm.shadow-6(
              touch-position, anchor="bottom middle", self="top middle")
                div(style="width: 66vw;") {{ t.text }}

          //----- info-modus
          .q-px-md.q-py-sm.row.full-width.bg-grey-9(v-else, style="height: 46px;")
            span.q-mr-sm.self-center.text-grey-1 Hilfe-Modus

          //----- close-button
          q-btn.absolute-top-right.text-grey-1.q-mr-md.q-mt-sm.transition(@click="handlerInfoBox",
          round, flat, size="sm", no-ripple,
          :class="[(showInfoBox ? '' : 'leave-right'), (currentAppName === 'Tools' ? 'leave-right' : '')]")
            .q-subheading.text-weight-medium.text-weight-regular
              q-icon(name="clear")

      router-view

</template>

<script>
  require('videojs-youtube')
  // import { videoPlayer } from 'vue-video-player'
  import VideoPlayer from '../components/VideoPlayer'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      // videoPlayer
      VideoPlayer
    },
    data () {
      return {
        deviceDimensions: {height: undefined, width: undefined},
        scrollPosition: 0,
        video: {key: 'mr-griddle', src: 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'},
        showInfoBox: false,
        currentAppName: undefined,
        infoBoxHeight: undefined,
        infoBoxHeightMax: undefined,
        tools: [{
          label: 'Mr. Griddle',
          name: 'mr-griddle',
          text: 'Mr. Griddle... Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
        }, {
          label: 'Wortwolke',
          name: 'clouds',
          text: 'Wortwolke...'
        }, {
          label: 'Rezepte',
          name: 'recipes',
          text: 'Rezepte...'
        }, {
          label: 'Raum',
          name: 'space-tool',
          text: 'Raum...'
        }]
      }
    },
    computed: {
      ...mapGetters({
        statusInfoBox: 'globalSettings/getStatusInfoBox',
        tool: 'globalSettings/getTool'
      }),
      usingTool () {
        if (this.$route.path === '/' || this.$route.path === '/tools') return false
        else return true
      }
    },
    mounted () {
      this.currentAppName = 'Startscreen'
    },
    watch: {
      tool (val) {
        switch (val) {
        case 'mr-griddle':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'
          break
        case 'clouds':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/wordcloud.mp4'
          break
        case 'recipes':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/recipes.mp4'
          break
        case 'space-tool':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/space.mp4'
          break
        }
        this.video.key = val
      },
      usingTool (val) {
        if (val) this.infoBoxHeight = 46
        else this.infoBoxHeight = window.innerWidth * 0.5625
      },
      statusInfoBox () {
        // if (!this.showInfoBox) this.handlerInfoBox()
        this.showInfoBox = this.statusInfoBox
      },
      $route (to) {
        let routeSplit = to.path.split('/')
        switch (routeSplit[1]) {
        case 'mr-griddle':
          this.currentAppName = 'Mr. Griddle'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
          break
        case 'clouds':
          this.currentAppName = 'Wortwolke'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
          break
        case 'recipes':
          this.currentAppName = 'Rezepte'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
          break
        case 'space-tool':
          this.currentAppName = 'Raum'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
          break
        case 'inspiration':
          this.currentAppName = 'Inspiration'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
          break
        case 'tools':
          this.currentAppName = 'Tools'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'open')
          break
        case '':
          this.currentAppName = 'Startscreen'
          this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
          break
        }
      }
    },
    methods: {
      scrollingHandler (scroll) {
        this.scrollPosition = scroll.position
        this.$store.commit('globalSettings/handlerScrollPosition', {y: this.scrollPosition})
      },
      onResize (size) {
        this.$store.commit('globalSettings/handlerDeviceDimensions', size)
        this.deviceDimensions.height = size.height
        this.deviceDimensions.width = size.width
        let headerHeight = 52
        this.infoBoxHeightMax = size.height - headerHeight - 50
      },
      handlerInfoBox () {
        // this.showInfoBox = !this.showInfoBox
        if (this.showInfoBox) this.$store.commit('globalSettings/handlerStatusInfoBox', 'close')
        else this.$store.commit('globalSettings/handlerStatusInfoBox', 'open')
      },
      executeApp (appName) {
        // this.currentApp = appName
        this.$router.push({path: '/' + appName})
      }
    }
  }
</script>

<style scoped lang="styl">
  .offset
    margin-left -54px

  .height-0
    height 0!important

  .height-auto
    height calc(100vw * 0.5625)

  .leave-top
    transform translateY(-52px)
</style>
