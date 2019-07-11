<template lang="pug">
  q-layout(view='lHh Lpr lFf')

    q-layout-drawer(v-model="showToolDescription", side="right")
      q-btn.bg-dark.text-white.q-ma-sm(@click="handlerToolDescription()", size="sm", icon="clear", round)

    q-layout-header.no-shadow.bg-dark
      q-item.q-pa-none(style="border-bottom: 1px solid #666;")

        // back-button
        q-item-side.text-center(:class="{'offset': !usingTool}",
        style="border-right: 1px solid #666; transition: all ease 200ms; width: 50px;")
          q-btn.text-white(@click="$router.push('/tools')", icon="keyboard_backspace", round, flat)

        // title
        q-item-main

          // digitanz light
          q-btn.q-title.text-white.text-weight-bold.lowercase.full-width(v-if="!usingTool",
          @click="$router.push('/')", flat, align="left") #digitanz
            span.text-weight-light &nbsp;light

          // app name
          q-btn.q-title.text-white.text-weight-bold.capitalize(v-else, flat, no-ripple) {{ currentAppName }}

        // info-button
        q-item-side.q-pr-md(v-if="usingTool")
          q-btn.border.text-white(@click="handlerToolDescription", round, flat, size="sm") ?

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
        hideBackButton: true,
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
        this.currentAppName = to.path.split('/')[1]
        this.hideBackButton = this.rootPaths.indexOf(to.fullPath.substr(1)) > -1
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
