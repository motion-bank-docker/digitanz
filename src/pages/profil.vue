<template lang="pug">
  q-page.q-ma-md.relative-position

    // login screeen
    div(v-if="!user")
      q-btn.q-pa-none.absolute-top-right(v-if="!user", round, color="grey-9", icon="arrow_forward",
        @click.prevent="login")
      griddle-moves(:enclosed="true", :time="1000")

    // if logged in show profile screen
    div(v-else)
      div
        span.q-title.text-white #digitanz
        .float-right
          q-btn.q-pa-sm.bg-dark.q-mr-sm(color="white", icon="email",
          v-if="user", @click.prevent="$router.push(`/team`)", rounded)
          q-btn.q-pa-sm.bg-dark(color="white", icon="eject",
          v-if="user", @click.prevent="logout", rounded)
          <!--q-btn.q-pa-sm.absolute-top-right(color="white", flat, icon="arrow_forward",-->
          <!--v-if="!user", @click.prevent="login", rounded)-->

      .text-center.q-mb-md.q-py-xl(v-if="portrait.length <= 0 && !portraitLoading")
        q-icon(name="person", size="35vw", color="grey-9")
        p.q-mb-none.text-grey-8 Kein Portrait
      .text-center.q-mb-md.q-py-xl(v-else-if="portraitLoading")
        // q-spinner(:size="30")
        loading-spinner

      section.q-pt-lg
        video-list-view(:videos="portrait",
                        layoutStyle="singleCenter",
                        :roundImage="true",
                        cardWidth="65%",
                        :showDuration="false")
        h3.q-my-none.text-center Hallo <br> {{ user ?  user.nickname : '' }}!

      div.row.justify-center
        q-btn-group(push).q-mt-xl
          // q-btn(push, flat, label="Art", :color="iconColor('type')", icon="build", @click="orderByType")
          q-btn.q-pt-sm(push, flat, :color="iconColor('type')", @click="orderByType")
            q-icon(name="build")
            span.q-mx-sm.q-mt-xs.q-mb-sm Art
          // q-btn(push, flat, label="Datum", :color="iconColor('time')", icon="today", @click="orderByTime")
          q-btn.q-pt-sm(push, flat, :color="iconColor('time')", @click="orderByTime")
            q-icon(name="today")
            span.q-mx-sm.q-mt-xs.q-mb-sm Datum
          // q-btn(push, flat, label="Geteilt", :color="iconColor('visibility')", icon="people", @click="orderByVisibility")
          q-btn.q-pt-sm(push, flat, :color="iconColor('visibility')", @click="orderByVisibility")
            q-icon(name="people")
            span.q-mx-sm.q-mt-xs.q-mb-sm Geteilt
          //
            q-btn.q-pt-sm(push, flat, :color="iconColor('solution')", @click="orderBySolution")
              q-icon(name="people")
              span.q-mx-sm.q-mt-xs.q-mb-sm Lösungen

      //
      // ORDER BY TYPE
      div(v-if="displayType === 'type'")

        //
        // Meine Mr. Griddles
        content-block
          template(slot="title") Mr. Griddles
          template(slot="buttons")
            q-btn.bg-grey-10(@click="$router.push(`/mr-griddle/create`)", icon="accessibility", round)
          template(slot="content")
            user-mr-griddles

        //
        // Meine Sequenzen Liste
        content-block
          template(slot="title") Sequenzen
          template(slot="buttons")
            q-btn.bg-grey-10(@click="$router.push(`/sequences/create`)", icon="extension", round)
          template(slot="content")
            user-sequences

        //
        // Meine Uploads Liste
        content-block
          template(slot="title") Uploads
          template(slot="buttons")
            file-uploader-micro.bg-grey-10
          template(slot="content")
            user-uploads(@changed="fetchPortrait")

      //
      // ORDER BY TIME
      div(v-else-if="displayType === 'time'")
        // h4.q-mb-sm Chronik
        user-all

      //
      // LIST PUBLIC
      div(v-else-if="displayType === 'visibility'")

        //
        // Public Mr. Griddles
        content-block
          template(slot="title") Öffentliche Mr. Griddles
          template(slot="buttons")
          template(slot="content")
            users-public-mr-griddles

        //
        // Public Sequences
        content-block
          template(slot="title") Öffentliche Sequenzen
          template(slot="buttons")
          template(slot="content")
            users-public-sequences

        //
        // Public Portrait
        content-block(v-if="portrait.length > 0")
          template(slot="title") Öffentliches Portrait
          template(slot="buttons")
          template(slot="content")
            users-public-portrait(:portraits="portrait", @changed="fetchPortrait")

      //
      // LIST SOLUTIONS
      div(v-else-if="displayType === 'solution'")
        content-block
          template(slot="title") Meine Lösungen
          template(slot="buttons")
          template(slot="content")
            | bla

</template>

<script>
  import { DateTime } from 'luxon'
  import { Portraits, PortraitsPlusPlus, GroupVideoSequences } from '../components/dashboard'
  import VideoListView from '../components/VideoListView'
  import LoadingSpinner from '../components/LoadingSpinner'
  import { VideoHelper } from '../lib'
  import { mapGetters } from 'vuex'
  import UserMrGriddles from '../components/profil/UserMrGriddles'
  import UserSequences from '../components/profil/UserSequences'
  import UserUploads from '../components/profil/UserUploads'
  import UsersPublicSequences from '../components/profil/UsersPublicSequences'
  import UsersPublicPortrait from '../components/profil/UsersPublicPortrait'
  import UsersPublicMrGriddles from '../components/profil/UsersPublicMrGriddles'
  import UserAll from '../components/profil/UserAll'
  import FileUploaderMicro from '../components/FileUploaderMicro'
  import ContentBlock from '../components/ContentBlock'

  export default {
    components: {
      'dashboard-portraits': Portraits,
      'dashboard-portraits-plus-plus': PortraitsPlusPlus,
      'dashboard-group-video-sequences': GroupVideoSequences,
      LoadingSpinner,
      VideoListView,
      UserMrGriddles,
      UserSequences,
      UsersPublicSequences,
      UsersPublicPortrait,
      UsersPublicMrGriddles,
      UserUploads,
      UserAll,
      FileUploaderMicro,
      ContentBlock
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    data () {
      return {
        displayType: 'type',
        portrait: [],
        dates: undefined,
        nickname: undefined,
        portraitLoading: false
      }
    },
    async mounted () {
      this.dates = this.$dates()
      if (this.user) {
        this.nickname = this.user.nickname
        await this.fetchPortrait()
      }
    },
    methods: {
      iconColor (btn) {
        if (this.displayType === btn) {
          return 'primary'
        }
        else return 'grey-9'
      },
      orderByTime () {
        this.displayType = 'time'
        console.log('by time')
      },
      orderByType () {
        this.displayType = 'type'
        console.log('by type')
      },
      orderByVisibility () {
        this.displayType = 'visibility'
        console.log('by visibility')
      },
      orderBySolution () {
        this.displayType = 'solution'
        console.log('by solution')
      },
      async fetchPortrait () {
        this.portraitLoading = true
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
            'author.id': this.user.uuid
          }
          this.portrait = await VideoHelper.fetchVideoItems(this, portraitsQuery)
          this.portraitLoading = false
        }
      },
      login () {
        this.$auth.authenticate()
      },
      async logout () {
        await this.$store.dispatch('logging/log', { action: 'logout', message: this.user.uuid })
        this.$store.commit('auth/setUser', undefined)
        this.$auth.logout()
      },
      getDateLabel (date) {
        const dt = DateTime.fromISO(date.start)
        return `${dt.day}.${dt.month}.${dt.year}`
      }
    }
  }
</script>

<style scoped lang="stylus">
  .portrait
    display block
    width 50vw
    height 50vw
    background-position center
    background-repeat no-repeat
    background-size cover
    border-radius 50%
  h3
    line-height 1.3em
  .singleCenter div
    margin-bottom 0!important
    .q-card-actions
      padding 0!important
    .q-card.q-mb-lg
      margin-bottom 0!important
  .mega
    display block
    width 20px
    height 20px
    background-color red
</style>
