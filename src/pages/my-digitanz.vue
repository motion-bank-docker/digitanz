<template lang="pug">
  q-page.q-ma-md.relative-position
    q-btn.q-pa-sm.absolute-top-right.bg-grey-9(color="white", flat, icon="eject",
    v-if="user", @click.prevent="logout", rounded)
    q-btn.q-pa-sm.absolute-top-right(color="white", flat, icon="arrow_forward",
    v-if="!user", @click.prevent="login", rounded)

    .text-center.q-mb-md.q-py-xl(v-if="portrait.length <= 0")
      q-spinner(:size="30")

    section.column.items-center
      video-list-view(:videos="portrait",
                      layoutStyle="singleCenter",
                      :roundImage="true",
                      cardWidth="65%",
                      :showDuration="false",
                      @changed="fetchVideos")
      h3.q-my-none.text-center Hallo <br> {{ user ?  user.nickname : '' }}!
    div.row.justify-center
      q-btn-group(push).q-mt-xl
        q-btn(push label="Art" :color="iconColor('type')" icon="timeline" @click="orderByType")
        q-btn(push label="Datum" :color="iconColor('time')" icon="watch_later" @click="orderByTime")
        q-btn(push label="Geteilt" :color="iconColor('visibility')" icon="visibility" @click="orderByVisibility")
    // ORDER BY TYPE
    div(v-if="displayType =='type'")
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
    div(v-else-if="displayType =='time'")
      h4.q-mb-sm Termin 1
      user-uploads

    //
    div(v-else-if="displayType == 'visibility'")
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
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    data () {
      return {
        videos: [],
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        sequences: [],
        favouriteSequences: [],
        displayType: 'type',
        portrait: [],
        dates: undefined,
        allVideos: [],
        nickname: undefined
      }
    },
    async mounted () {
      this.dates = this.$dates()
      if (this.user) {
        this.nickname = this.user.nickname
        await this.lala()
        await this.fetchVideos()
        await this.fetchSequences()
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
      async fetchVideos () {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items && results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'author.id': this.user.uuid,
            'body.type': 'Video',
            'body.source.type': 'video/mp4',
            'target.id': {
              $eq: `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`
            }
          }
          this.videos = await VideoHelper.fetchVideoItems(this, query)
        }
        // for dev purpose
        if (this.portrait.length === 0) {
          this.portrait.push(this.videos[0])
        }
      },
      async lala () {
        console.log('running lala function')
        const ids = this.$dates().map(date => date.map_uuid)
          .filter(id => id !== undefined)
          .map(id => { return { 'target.id': `http://id.motionbank.org/maps/${id}` } })
        const query = { $or: ids }
        const result = await this.$store.dispatch('annotations/find', query)
        this.allVideos = result.items.sort(this.$sort.onCreatedDesc).map(map => {
          const media = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
          }
          const annotation = {
            author: {
              id: this.user.uuid
            },
            uuid: map.uuid,
            body: {
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`,
                type: 'video/mp4'
              }
            }
          }
          return {
            annotation,
            preview,
            media,
            map
          }
        })
      },
      async fetchSequences () {
        console.log('fetching sequences')
        if (!this.user) return
        this.sequences = []
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        console.log(result)
        this.sequences = result.items.filter(map => {
          return map.title.indexOf(prefix) === 0
        }).sort(this.$sort.onCreatedDesc).map(map => {
          const media = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
          }
          let processing = false
          for (let jobId of this.sequenceJobIds) {
            if (this.sequenceJobDetails[jobId].uuid === map.uuid) processing = true
          }
          const annotation = {
            author: {
              id: this.user.uuid
            },
            uuid: map.uuid,
            body: {
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`,
                type: 'video/mp4'
              }
            }
          }
          return {
            processing,
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
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
    },
    watch: {
      async user (val) {
        if (val) await this.fetchVideos()
        if (val) await this.fetchSequences()
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
