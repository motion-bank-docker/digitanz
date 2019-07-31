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
        //----- todo: embed info drawer?
        q-item-side.q-pr-md(v-if="usingTool")
          q-btn.bg-grey-9.text-grey-1(@click="handlerToolDescription", round, flat, size="md") ?

    // ---------------------------------------------------------------------------------------------------------- others
    q-page-container
      .bg-white(v-if="showInfoBox").q-pa-md blablabla
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
</style>
