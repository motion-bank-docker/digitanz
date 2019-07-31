<template lang="pug">
  q-layout(view='lHh Lpr lFf')

    // ---------------------------------------------------------------------------------------------------------- header
    q-layout-header.bg-grey-3.text-grey-9(style="box-shadow: 0 0 5px 0 rgba(0, 0, 0, .1)")
      q-item.q-pa-none

        //----- back-button
        q-item-side.text-center.min-width-auto.full-height.overflow-hidden(:class="{'offset': !usingTool}",
        style="transition: all ease 200ms; width: 50px;")
          q-btn.bg-transparent.full-width.full-height.no-round-borders.text-grey-9(@click="$router.push('/tools')",
          icon="keyboard_backspace", flat, no-ripple, style="height: 53px!important;")

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
          q-btn.absolute-top-right.bg-grey-3.text-grey-9.transition.q-mt-sm.q-mr-md(@click="handlerToolDescription", round,
          size="sm", :class="[showInfoBox ? 'leave-right' : '']")
            | ?

    // ---------------------------------------------------------------------------------------------------------- others
    q-page-container

      .relative-position
        q-btn.absolute-top-right.shadow-2.bg-grey-3.text-grey-9.q-mr-md.q-mt-sm.transition(@click="handlerToolDescription", round, flat,
        size="sm", :class="[showInfoBox ? '' : 'leave-right']")
          q-icon(name="clear")

        div.bg-grey-1.text-grey-9.transition.overflow-hidden(:class="[showInfoBox ? 'height-auto' : 'height-0']")
          .q-pa-md
            | Info-Box

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
        currentAppName: ''
      }
    },
    computed: {
      ...mapGetters({
      }),
      usingTool () {
        if (this.$route.path === '/' || this.$route.path === '/tools') return false
        else return true
      }
    },
    watch: {
      $route (to, from) {
        console.log(to, from)
        let routeSplit = to.path.split('/')
        switch (routeSplit[1]) {
        case 'mr-griddle':
          this.currentAppName = 'Mr. Griddle'
          break
        case 'clouds':
          this.currentAppName = 'Wortwolke'
          break
        case 'recipes':
          this.currentAppName = 'Rezepte'
          break
        case 'space-tool':
          this.currentAppName = 'Raum'
          break
        case 'inspiration':
          this.currentAppName = 'Inspiration'
          break
        }
      }
    },
    methods: {
      handlerToolDescription () {
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
