<template lang="pug">
  q-layout(view='lHh Lpr lFf')

    q-layout-footer.text-center.bg-dark.q-py-xs(v-if="userState")

      template(v-if="hideBackButton")
        q-btn.q-ml-md.q-mr-md(
        v-for="button in buttons", round, flat, size="lg",
        :class="{ 'text-white bg-grey-9': currentApp === button.action }",
        @click="executeApp(button.action)")
          q-icon(:name="button.icon")

        span.q-py-md
          file-uploader-micro(:query="uploaderQuery")

      template(v-else)
        q-btn.q-mx-md(round, flat, size="lg",
        @click="$router.go(-1)")
          q-icon.rotate-270(name="navigation")

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
        buttons: [{
          action: 'profil',
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
        rootPaths: ['', 'profil', 'dashboard-new', 'tools'],
        hideBackButton: true,
        currentApp: null,
        env: process.env,
        uploaderQuery: {
          'title': 'Meine Videos'
        }
      }
    },
    computed: {
      ...mapGetters({
        userState: 'auth/getUserState'
      })
    },
    watch: {
      $route (to, from) {
        console.log(to, from)
        this.hideBackButton = this.rootPaths.indexOf(to.fullPath.substr(1)) > -1
      }
    },
    methods: {
      actions (val) {
        switch (val) {
        case 'profil':
          this.executeApp('profil')
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
        this.$auth.authenticate()
      },
      async logout () {
        await this.$store.dispatch('logging/log', { action: 'logout', message: this.userState.uuid })
        this.$store.commit('auth/setUser', undefined)
        this.$auth.logout()
      }
    }
  }
</script>
