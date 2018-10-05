<template lang="pug">
  q-page.q-ma-md.relative-position

    // login screeen
    div(v-if="!user")
      q-btn.q-pa-none.absolute-top-right(v-if="!user", round, color="grey-9", icon="arrow_forward",
        @click.prevent="login")
      griddle-moves(:enclosed="true", :time="1000")

    // if logged in show profile screen
    div(v-else)
      q-btn.q-pa-sm.absolute-top-right.bg-grey-9(color="white", flat, icon="eject",
      v-if="user", @click.prevent="logout", rounded)
      <!--q-btn.q-pa-sm.absolute-top-right(color="white", flat, icon="arrow_forward",-->
      <!--v-if="!user", @click.prevent="login", rounded)-->

      .text-center.q-mb-md.q-py-xl(v-if="portrait.length <= 0")
        q-spinner(:size="30")

      section.column.items-center
        video-list-view(:videos="portrait",
                        layoutStyle="singleCenter",
                        :roundImage="true",
                        cardWidth="65%",
                        :showDuration="false")
        h3.q-my-none.text-center Hallo <br> {{ user ?  user.nickname : '' }}!
      div.row.justify-center
        q-btn-group(push).q-mt-xl
          q-btn(push label="Art" :color="iconColor('type')" icon="timeline" @click="orderByType")
          q-btn(push label="Datum" :color="iconColor('time')" icon="watch_later" @click="orderByTime")
          q-btn(push label="Geteilt" :color="iconColor('visibility')" icon="visibility" @click="orderByVisibility")
      // ORDER BY TYPE
      div(v-if="displayType === 'type'")
        //
        // Meine Sequenzen Liste
        section
          h4.q-mb-sm Sequenzen
          user-sequences

        //
        // Meine Uploads Liste
        section
          h4.q-mb-sm Uploads
          user-uploads

        //
        // ORDER BY TIME
      div(v-else-if="displayType === 'time'")
        h4.q-mb-sm Termin 1
        user-uploads

      //
      div(v-else-if="displayType === 'visibility'")
        h4.q-mb-sm Öffentliche Sequenzen
        users-public-sequences
</template>

<script>
  import { DateTime } from 'luxon'
  import { Portraits, PortraitsPlusPlus, GroupVideoSequences } from '../components/dashboard'
  import VideoListView from '../components/VideoListView'
  import { VideoHelper } from '../lib'
  import { mapGetters } from 'vuex'
  import UserSequences from '../components/profil/UserSequences'
  import UserUploads from '../components/profil/UserUploads'
  import UsersPublicSequences from '../components/profil/UsersPublicSequences'

  export default {
    components: {
      UsersPublicSequences,
      UserUploads,
      'dashboard-portraits': Portraits,
      'dashboard-portraits-plus-plus': PortraitsPlusPlus,
      'dashboard-group-video-sequences': GroupVideoSequences,
      VideoListView,
      UserSequences
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
        nickname: undefined
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
      async fetchPortrait () {
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
            'author.id': this.user.uuid
          }
          this.portrait = await VideoHelper.fetchVideoItems(this, portraitsQuery)
          console.log('portrait video loaded: ', this.portrait)
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
