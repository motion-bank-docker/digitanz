<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-scroll-observable(@scroll="scrollingHandler")
    q-window-resize-observable(@resize="onResize")

    // ---------------------------------------------------------------------------------------------------------- header
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
        .fixed-top.bg-transparent.text-grey-9.transition.overflow-hidden(
        style="z-index: 10; top: 52px",
        position="top",
        :class="[showInfoBox ? 'height-auto' : 'height-0']",
        :style="{height: infoBoxHeight + 'px', 'max-height': infoBoxHeightMax + 'px', width: infoBoxWidth + 'px', maxWidth: infoBoxWidthMax + 'px', left: infoBoxLeft + 'px'}")

          //----- video-info-box in tool overview
          template(v-if="!usingTool && currentAppName !== undefined")

            //----- video-player
            q-carousel.text-white(v-model="slide", style="background-color: #303030;")

              template(v-if="slides")
                q-carousel-slide.q-pa-none.relative-position.custom-font-size(v-for="s in slides")

                  template(v-if="s.startscreen")
                    .absolute-center.text-center
                      p.q-ma-none(v-for="(screen, n) in s.startscreen", :class="{'q-mt-xs': n > 0}") {{ screen }}
                      q-btn.q-mt-md.text-dark.bg-white.custom-font-size(@click="executeApp()", rounded, no-caps)
                        // q-icon.rotate-180(name="keyboard_backspace", size="20px")
                        | Verwenden

                  .absolute-center(v-if="s.text")
                    p.q-ma-none.text-center(v-for="(t, n) in s.text", :class="{'q-mt-xs': n > 0}") {{ t }}

                  video-player(v-if="s.src", :src="video.src", :ratio="'16:9'", :key="video.key", :autoplay="autoplay")

              template(v-else)
                q-carousel-slide.q-pa-none
                  video-player(:src="video.src", :ratio="'16:9'", :key="video.key")
                  // video-player(:src="video.src", :ratio="'16:9'", :key="video.key", :autoplay="autoplay")

            //----- help-button
            // q-btn.bg-grey-1.tetx-grey-9.absolute-top-left.q-mt-sm.q-ml-md.q-px-md.q-py-xs(v-for="t in tools", v-if="t.name === tool", flat, no-caps, round, size="sm")

              // .q-subheading.text-weight-medium.text-weight-regular ?

              // q-popover.bg-grey-9.q-px-md.q-py-md.text-grey-1.q-caption.text-weight-medium.q-mx-sm.q-mb-sm.shadow-6(touch-position, anchor="bottom middle", self="top middle")
                // div(style="width: 66vw;") {{ t.text }}

          //----- info-modus bar when inside an app
          .q-px-md.q-py-sm.row.full-width.bg-grey-9(v-else, style="height: 46px;")
            span.q-mr-sm.self-center.text-grey-1 Hilfe-Modus

          //----- close-button when inside an app
          q-btn.absolute-top-right.text-grey-1.q-mr-md.q-mt-sm.transition(@click="handlerInfoBox",
          round, flat, size="sm", no-ripple,
          :class="[(showInfoBox ? '' : 'leave-right'), (currentAppName === 'Tools' ? 'leave-right' : '')]")
            .q-subheading.text-weight-medium.text-weight-regular
              q-icon(name="clear")

      router-view

</template>

<script>
  require('videojs-youtube')
  import VideoPlayer from '../components/VideoPlayer'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      VideoPlayer
    },
    data () {
      return {
        slide: undefined,
        slides: undefined,
        // autoplay: undefined,
        scrollPosition: 0,
        video: {key: 'mr-griddle', src: 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'},
        showInfoBox: false,
        currentAppName: undefined,
        infoBoxHeight: undefined,
        infoBoxHeightMax: undefined,
        tools: [{
          label: 'Mr. Griddle',
          name: 'mr-griddle',
          text: '»Mr. Griddle« ist ein Posen-Generator, der per Zufall immer neue Körperkonfigurationen erfindet.'
        }, {
          label: 'Wortwolke',
          name: 'clouds',
          text: 'Mit der »Wortwolke« lassen sich unterschiedliche Begriffe zu einer Liste kombinieren.'
        }, {
          label: 'Rezepte',
          name: 'recipes',
          text: 'Mit dem »Rezepte« Werkzeug kann man die Schritte eines Tanz-Ablaufs erfassen.'
        }, {
          label: 'Raum',
          name: 'space-tool',
          text: 'Das »Raum« Werkzeug ermöglicht die Arbeit mit unterschiedlichen Raum-Konstellationen.'
        }]
      }
    },
    computed: {
      ...mapGetters({
        statusInfoBox: 'globalSettings/getStatusInfoBox',
        tool: 'globalSettings/getTool',
        deviceDimensions: 'globalSettings/getDeviceDimensions'
      }),
      usingTool () {
        if (this.$route.path === '/' || this.$route.path === '/tools') return false
        else return true
      }
    },
    mounted () {
      this.currentAppName = 'Startscreen'
      this.setInfoBoxHeight()
      this.tool = 'mr-griddle'
      // this.$q.platform.is.mobile ? this.autoplay = false : this.autoplay = true
    },
    watch: {
      tool (val) {
        switch (val) {
        case 'mr-griddle':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'
          this.slides = [{
            startscreen: ['Tool:', 'Mr. Griddle']
          }, {
            text: ['Einführung']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'
          }, {
            text: ['1. Anwendungsbeispiel:', 'Posen adaptieren']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'
          }, {
            text: ['2. Anwendungsbeispiel:', 'Improvisieren zwischen Start- und Endpose']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'
          }, {
            text: ['3. Anwendungsbeispiel', 'Posen selbst auswählen, improvisieren, filmen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/mrgriddle.mp4'
          }]
          break
        case 'clouds':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/wordcloud.mp4'
          this.slides = [{
            startscreen: ['Tool:', 'Wortwolke']
          }, {
            text: ['Einführung']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/wordcloud.mp4'
          }, {
            text: ['1. Anwendungsbeispiel:', 'Wörter sammeln, "Tanz ist für mich..."']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/wordcloud.mp4'
          }, {
            text: ['2. Anwendungsbeispiel:', 'Improvisation mit Wortwolke und Raumebenen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/wordcloud.mp4'
          }, {
            text: ['3. Anwendungsbeispiel', 'Eigene Wolke erstellen, improvisieren, filmen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/wordcloud.mp4'
          }]
          break
        case 'recipes':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/recipes.mp4'
          this.slides = [{
            startscreen: ['Tool:', 'Rezepte']
          }, {
            text: ['Einführung']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/recipes.mp4'
          }, {
            text: ['1. Anwendungsbeispiel:', 'Verschiedene Bewegungsanwendungen eintragen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/recipes.mp4'
          }, {
            text: ['2. Anwendungsbeispiel:', 'Zufälliges Rezept generieren, Anweisungen in Improvisation umsetzen, filmen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/recipes.mp4'
          }]
          break
        case 'space-tool':
          this.video.src = 'https://assets.motionbank.org/digitanz/videos-lite-app/space.mp4'
          this.slides = [{
            startscreen: ['Tool:', 'Raum/Formation']
          }, {
            text: ['Einführung']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/space.mp4'
          }, {
            text: ['1. Anwendungsbeispiel:', 'Formationen einnehmen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/space.mp4'
          }, {
            text: ['2. Anwendungsbeispiel:', 'Übergänge tänzerisch füllen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/space.mp4'
          }, {
            text: ['3. Anwendungsbeispiel:', 'Raumebenen hinzufügen']
          }, {
            src: 'https://assets.motionbank.org/digitanz/videos-lite-app/space.mp4'
          }]
          break
        }
        this.video.key = val
      },
      usingTool (val) {
        if (val) this.infoBoxHeight = 46
        // else this.infoBoxHeight = window.innerWidth * 0.5625
        else this.setInfoBoxHeight()
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
      setInfoBoxHeight () {
        let headerHeight = 52
        let buttonBarHeight = 52
        this.infoBoxWidthMax = this.deviceDimensions.width

        // define video player width
        if (this.deviceDimensions.height > this.deviceDimensions.width) {
          this.infoBoxHeight = this.deviceDimensions.width * 0.5625
          this.infoBoxWidth = this.deviceDimensions.width
          this.infoBoxHeightMax = this.deviceDimensions.width * 0.5625
        }
        else {
          this.infoBoxHeight = this.deviceDimensions.height - headerHeight - buttonBarHeight
          this.infoBoxWidth = (this.deviceDimensions.height - headerHeight - buttonBarHeight) / 9 * 16
          this.infoBoxHeightMax = this.deviceDimensions.width * 0.5625
        }

        // define video player offset left
        if (this.deviceDimensions.width > this.infoBoxWidth) {
          this.infoBoxLeft = (this.deviceDimensions.width - this.infoBoxWidth) / 2
        }
        else {
          this.infoBoxLeft = 0
        }
      },
      scrollingHandler (scroll) {
        this.scrollPosition = scroll.position
        this.$store.commit('globalSettings/handlerScrollPosition', {y: this.scrollPosition})
      },
      onResize (size) {
        this.$store.commit('globalSettings/handlerDeviceDimensions', size)
        this.setInfoBoxHeight()
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

<style scoped lang="stylus">
  .custom-font-size
    font-size 4vw
  .offset
    margin-left -54px

  .height-0
    height 0!important

  .height-auto
    height calc(100vw * 0.5625)

  .leave-top
    transform translateY(-52px)
</style>
