<template lang="pug">
  q-layout(view='lHh Lpr lFf')

    // ---------------------------------------------------------------------------------------------------------- drawer
    q-layout-drawer.text-grey-9(v-model="showToolDescription", side="right", no-swipe-open)

      q-item.q-pa-none.items-stretch.border-bottom

        // app title
        q-item-main.q-title.text-weight-bold.q-pr-md
          q-btn.q-title.capitalize.q-pl-md(no-ripple, flat) {{ currentAppName }}

        // close-button
        q-item-side.text-center.q-py-sm(style="width: 55px;")
          q-btn.border-right.no-round-borders.text-dark.rotate-180.full-height(@click="handlerToolDescription()",
          icon="clear", flat, no-ripple)

      // content (dummy)
      div.q-pa-md
        | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      div.q-pa-md
        | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

    // ---------------------------------------------------------------------------------------------------------- header
    q-layout-header.bg-grey-3.text-grey-9(style="box-shadow: 0 0 5px 0 rgba(0, 0, 0, .1)")
      q-item.q-pa-none

        // back-button
        q-item-side.text-center.min-width-auto.full-height.overflow-hidden(:class="{'offset': !usingTool}",
        style="transition: all ease 200ms; width: 50px;")
          //
            q-btn.bg-grey-2.text-grey-9(@click="$router.push('/tools')",
            icon="keyboard_backspace", flat, no-ripple, round, size="sm")
          q-btn.bg-transparent.full-width.full-height.no-round-borders.text-grey-9(@click="$router.push('/tools')",
          icon="keyboard_backspace", flat, no-ripple, style="height: 53px!important;")

        // title
        q-item-main.text-weight-bold

          // digitanz light
          q-btn.q-title.lowercase.full-width(v-if="!usingTool",
          @click="$router.push('/')", flat, align="left") #digitanz
            span.text-weight-light &nbsp;light

          // app name
          q-btn.q-title.capitalize.full-width.q-pl-none(v-else, flat, no-ripple, align="left")
            .ellipsis {{ currentAppName }}

        // info-button
        //
          q-item-side.q-pr-md(v-if="usingTool")
            q-btn.border.text-white(@click="handlerToolDescription", round, flat, size="sm") ?

    // ---------------------------------------------------------------------------------------------------------- footer
    //
      q-layout-footer.text-center.bg-dark.q-py-xs(v-if="userState && !$route.meta.hideFooter")

        template(v-if="hideBackButton")
          q-btn.q-ml-md.q-mr-md(
          v-for="button in buttons", round, flat, size="lg",
          // :class="{ 'text-white bg-grey-9': currentApp === button.action }",
          @click="executeApp(button.action)")
            q-icon(:name="button.icon")

          span.q-py-md
            file-uploader-micro(:query="uploaderQuery")

        template(v-else)
          q-btn.q-mx-md(round, flat, size="lg",
          @click="$router.go(-1)")
            q-icon(name="arrow_back_ios")

    // ---------------------------------------------------------------------------------------------------------- others
    q-page-container
      router-view
    conversion-jobs
    sequence-jobs
    mb-notification-service
</template>

<script>
  import { mapGetters } from 'vuex'
  import ConversionJobs from '../components/ConversionJobs'
  import SequenceJobs from '../components/SequenceJobs'
  import QUploaderExtendedSimpleMicro from '../components/QUploaderExtendedSimpleMicro'
  import FileUploaderMicro from '../components/FileUploaderMicro'

  export default {
    components: {
      ConversionJobs,
      SequenceJobs,
      QUploaderExtendedSimpleMicro,
      FileUploaderMicro
    },
    data () {
      return {
        showToolDescription: false,
        buttons: [{
          action: 'profile',
          icon: 'person',
          status: true
        }, {
          action: 'dashboard-new',
          icon: 'people',
          status: true
        }, {
          action: 'tools',
          icon: 'build',
          status: true
        }],
        rootPaths: ['', 'profile', 'dashboard-new', 'tools'],
        // hideBackButton: true,
        currentApp: null,
        currentAppName: '',
        env: process.env,
        uploaderQuery: {
          'title': 'Meine Videos'
        }
      }
    },
    computed: {
      ...mapGetters({
        userState: 'auth/getUserState'
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
        // this.hideBackButton = this.rootPaths.indexOf(to.fullPath.substr(1)) > -1
      }
    },
    methods: {
      handlerToolDescription () {
        this.showToolDescription = !this.showToolDescription
      },
      actions (val) {
        switch (val) {
        case 'profile':
          this.executeApp('profile')
          break
        case 'dashboard-new':
          this.executeApp('dashboard-new')
          break
        case 'tools':
          this.executeApp('tools')
          break
        case 'unset':
          console.log('unset')
          break
        }
      },
      clickTitle () {
        this.$router.push('/')
      },
      executeApp (appName) {
        this.currentApp = appName
        this.$router.push({path: '/' + appName})
      },
      login () {
        // this.$auth.authenticate()
      },
      async logout () {
        // await this.$store.dispatch('logging/log', { action: 'logout', message: this.userState.uuid })
        // this.$store.commit('auth/setUser', undefined)
        // this.$auth.logout()
      }
    }
  }
</script>

<style scoped lang="styl">
  .offset
    margin-left -50px
</style>
