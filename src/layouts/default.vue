<template lang="pug">
  q-layout(view='lHh Lpr lFf')

    // ---------------------------------------------------------------------------------------------------------- header
    q-layout-header.bg-grey-3.text-grey-9(style="box-shadow: 0 0 3px 0 rgba(0, 0, 0, .3)")
      q-item.q-pa-none

        //----- back-button
        q-item-side.min-width-auto.overflow-hidden.row.items-center.justify-center(:class="{'offset': !usingTool}",
        style="transition: all ease 200ms; width: 50px; min-height: 50px;")
          q-btn.self-center.bg-grey-1.text-grey-9(@click="$router.push('/tools')", no-ripple, round, size="sm")
            q-icon(name="keyboard_backspace", size="16px")

        //----- title
        q-item-main.text-weight-bold

          //----- digitanz light
          q-btn.q-title.lowercase.full-width(v-if="!usingTool",
          @click="$router.push('/')", flat, align="left") #digitanz
            span.text-weight-light &nbsp;lite

          //----- app name
          q-btn.q-title.capitalize.full-width(v-else, flat, no-ripple, align="left")
            .ellipsis(style="margin-left: -16px;") {{ currentAppName }}

        //----- info-button
        q-item-side.q-pr-md.absolute-top-right.q-pt-sm.q-mt-xs
          q-btn.absolute-top-right.bg-grey-3.text-grey-9.transition.q-mt-sm.q-mr-md(
          v-if="currentAppName !== 'Startscreen'",
          @click="handlerInfoBox", round,
          size="sm", :class="[showInfoBox || currentAppName === 'Tools' ? 'leave-right' : '']")
            .q-subheading ?

    // ---------------------------------------------------------------------------------------------------------- others
    q-page-container

      .relative-position

        //----- invisible space placeholder
        div.bg-grey-3.text-grey-9.transition.overflow-hidden(:class="[showInfoBox ? 'height-auto' : 'height-0']")

        //----- visible info-box
        .fixed-top.bg-grey-1.text-grey-9.transition.overflow-hidden(
        style="box-shadow: 0 0 3px 0 rgba(0, 0, 0, .3); z-index: 10; top: 52px",
        position="top",
        :class="[showInfoBox ? 'height-auto' : 'height-0']")

          //----- content
          .q-pa-md
            p Info-Box
            //
              p {{ currentAppName }}
              p {{ tool }}
              p usingTool: {{ usingTool }}
              p showInfoBox: {{ showInfoBox }}

          //----- close-button
          q-btn.absolute-top-right.shadow-2.bg-grey-3.text-grey-9.q-mr-md.q-mt-sm.transition(@click="handlerInfoBox",
          round, flat, size="sm",
          :class="[(showInfoBox ? '' : 'leave-right'), (currentAppName === 'Tools' ? 'leave-right' : '')]")
            q-icon(name="clear")

      router-view

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {
    },
    data () {
      return {
        showInfoBox: false,
        currentAppName: undefined
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
      statusInfoBox () {
        // if (!this.showInfoBox) this.handlerInfoBox()
        this.showInfoBox = this.statusInfoBox
      },
      $route (to, from) {
        console.log(to, from)
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
      handlerInfoBox () {
        this.showInfoBox = !this.showInfoBox
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
    margin-left -50px

  .height-0
    height 0

  .height-auto
    height calc(100vw * 0.5625)
</style>
