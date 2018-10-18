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
      div(v-if="displayType === 'type' || displayType === 'time'")
        content-block(v-if="grouped && headlines", v-for="headline in headlines")
          template(slot="title") {{ headline }}
          template(slot="content")
            div.row.justify-between
              div.inline(v-if="grouped[headline]", v-for="item in grouped[headline]", :style="{width: '46%'}")
                user-mr-griddles(v-if="item.body && item.body.type === 'MrGriddleSkeleton'", :sequences="[item]")
                user-sequences(v-else-if="item.annotation && item.type === 'Sequence'", :sequences="[item]")
                user-uploads(v-else-if="item.annotation && item.type !== 'Sequence'", :uploads="[item]")

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
  import UsersPublicSequences from '../components/profil/UsersPublicSequences'
  import UsersPublicPortrait from '../components/profil/UsersPublicPortrait'
  import UsersPublicMrGriddles from '../components/profil/UsersPublicMrGriddles'
  import UserUploads from '../components/profil/UserUploads'
  import UserSequences from '../components/profil/UserSequences'
  import UserMrGriddles from '../components/profil/UserMrGriddles'
  import FileUploaderMicro from '../components/FileUploaderMicro'
  import ContentBlock from '../components/ContentBlock'
  import VideoItem from '../components/VideoItem'
  import MrGriddleListView from '../components/MrGriddleListView'

  export default {
    components: {
      'dashboard-portraits': Portraits,
      'dashboard-portraits-plus-plus': PortraitsPlusPlus,
      'dashboard-group-video-sequences': GroupVideoSequences,
      LoadingSpinner,
      VideoListView,
      VideoItem,
      UsersPublicSequences,
      UsersPublicPortrait,
      UsersPublicMrGriddles,
      FileUploaderMicro,
      ContentBlock,
      MrGriddleListView,
      UserUploads,
      UserSequences,
      UserMrGriddles
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        await this.loadAllTheThings()
      },
      griddles () {
        if (this.displayType === 'type') this.groupByType()
        else if (this.displayType === 'time') this.groupByDate()
      },
      sequences () {
        if (this.displayType === 'type') this.groupByType()
        else if (this.displayType === 'time') this.groupByDate()
      },
      uploads () {
        if (this.displayType === 'type') this.groupByType()
        else if (this.displayType === 'time') this.groupByDate()
      }
    },
    data () {
      return {
        displayType: 'type',
        portrait: [],
        dates: undefined,
        nickname: undefined,
        portraitLoading: false,
        grouped: undefined,
        headlines: undefined,
        griddles: undefined,
        uploads: undefined,
        sequences: undefined
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadUploadsData)
      this.$root.$on('updateSequences', this.loadSequencesData)
      this.dates = this.$dates()
      if (this.user) {
        this.nickname = this.user.nickname
        await this.fetchPortrait()
        await this.loadAllTheThings()
      }
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadUploadsData)
      this.$root.$off('updateSequences', this.loadSequencesData)
    },
    methods: {
      async loadAllTheThings () {
        if (!this.user) return
        await this.loadGriddleData()
        await this.loadSequencesData()
        await this.loadUploadsData()
      },
      async loadGriddleData () {
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const maps = await this.$store.dispatch('maps/find', query)
        const griddleSequences = maps.items.filter(m => {
          return m.title.indexOf('GriddleSequence ') === 0
        })
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        this.griddles = sequenceAnnotations
        console.debug('griddles: ', this.griddles)
      },
      async loadSequencesData () {
        console.log('loading sequences from component')
        if (!this.user) return
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        console.log('result:', result)
        this.sequences = result.items.filter(map => {
          return map.title.indexOf(prefix) === 0
        }).sort(this.$sort.onCreatedDesc).map(map => {
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
            created: map.created,
            updated: map.updated,
            body: {
              type: 'Video',
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`,
                type: 'video/mp4'
              }
            }
          }
          return {
            type: 'Sequence',
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
        console.debug('sequences: ', this.sequences)
      },
      async loadUploadsData () {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items && results.items.length) {
          const map = results.items[0]
          query = {
            'author.id': this.user.uuid,
            'body.type': 'Video',
            'body.source.type': 'video/mp4',
            'target.id': {
              $eq: `${process.env.TIMELINE_BASE_URI}${map.uuid}`
            }
          }
          const uploads = await VideoHelper.fetchVideoItems(this, query)
          this.uploads = uploads
        }
        else this.uploads = []
        console.debug('uploads: ', this.uploads)
      },
      iconColor (btn) {
        if (this.displayType === btn) {
          return 'primary'
        }
        else return 'grey-9'
      },
      groupByDate () {
        const grouped = {}
        let allItems = []
        if (this.griddles) allItems = allItems.concat(this.griddles)
        if (this.uploads) allItems = allItems.concat(this.uploads)
        if (this.sequences) allItems = allItems.concat(this.sequences)
        console.log(allItems)
        allItems = allItems.sort((a, b) => {
          const
            ac = a.annotation ? a.annotation.created : a.created,
            bc = b.annotation ? b.annotation.created : b.created
          if (ac < bc) return 1
          if (ac > bc) return -1
          return 0
        })
        for (let item of allItems) {
          let day
          if (item.created || item.annotation.created) {
            day = DateTime.fromISO(item.created || item.annotation.created).startOf('day').toLocaleString()
          }
          if (day) {
            if (Array.isArray(grouped[day])) grouped[day].push(item)
            else grouped[day] = [item]
          }
        }
        this.headlines = Object.keys(grouped)
        this.grouped = grouped
      },
      groupByType () {
        const grouped = {
          'Meine Griddles': this.griddles,
          'Meine Sequenzen': this.sequences,
          'Meine Uploads': this.uploads
        }
        this.headlines = Object.keys(grouped)
        this.grouped = grouped
        console.log('grouped: ', this.grouped['Meine Uploads'])
      },
      orderByTime () {
        this.displayType = 'time'
        this.groupByDate()
        console.log('by time')
      },
      orderByType () {
        this.displayType = 'type'
        this.groupByType()
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
</style>
