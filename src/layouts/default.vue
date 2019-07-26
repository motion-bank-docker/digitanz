<template lang="pug">
  q-layout(view='lHh Lpr lFf')

    // ---------------------------------------------------------------------------------------------------------- drawer
    q-layout-drawer.text-grey-9(v-model="showToolDescription", side="right", no-swipe-open)

      q-item.q-pa-none.items-stretch.border-bottom

        //----- app title
        q-item-main.q-title.text-weight-bold.q-pr-md
          q-btn.q-title.capitalize.q-pl-md(no-ripple, flat) {{ currentAppName }}

        //----- close-button
        q-item-side.text-center.q-py-sm(style="width: 55px;")
          q-btn.border-right.no-round-borders.text-dark.rotate-180.full-height(@click="handlerToolDescription()",
          icon="clear", flat, no-ripple)

      //----- content (dummy)
      div.q-pa-md
        | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      div.q-pa-md
        | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

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
            span.text-weight-light &nbsp;light

          //----- app name
          q-btn.q-title.capitalize.full-width(v-else, flat, no-ripple, align="left")
            .ellipsis(style="margin-left: -16px;") {{ currentAppName }}

        // info-button
        // todo: embed info drawer?
        //
          q-item-side.q-pr-md(v-if="usingTool")
            q-btn.border.text-white(@click="handlerToolDescription", round, flat, size="sm") ?

    // ---------------------------------------------------------------------------------------------------------- others
    q-page-container
      router-view

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {
    },
    data () {
      return {
        showToolDescription: false,
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
          this.currentAppName = 'Mr. Griddle Sequenz'
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
        this.showToolDescription = !this.showToolDescription
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
