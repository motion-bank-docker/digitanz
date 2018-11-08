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

      .text-center.q-mb-md.q-py-xl(v-if="!portrait || portrait.length <= 0 && !portraitLoading")
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

      //
      // EVALUATION BTN
      .row.justify-center.q-mt-md(v-if="hasVoted === false")
        q-btn.full-width(label="Bewerte den Kurs" icon="thumb_up" color="primary" @click="$router.push('/survey')")

      div.row.justify-center
        q-btn-group(push).q-mt-lg.bg-dark
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
              div(v-if="grouped[headline].length <= 0")
                span.text-grey-8 {{ $t('pages.profile.no_content') }}
              div.inline(v-if="grouped[headline]", v-for="item in grouped[headline]", :style="{width: '46%'}")
                div(v-if="item")
                  user-mr-griddles(@emitLoadData="loadGriddleData", v-if="item.body && item.body.type === 'MrGriddleSkeleton'", :sequences="[item]")
                  user-sequences(v-else-if="item.annotation && item.type === 'Sequence'", :sequences="[item]")
                  user-uploads(@changed="fetchPortrait", v-else-if="item.annotation && item.type !== 'Sequence'", :uploads="[item]")
                  user-clouds(v-else-if="item.type === 'word-association'", :items="[item]")
                  user-recipes(
                  v-else-if="item.body && item.body.type === 'Recipe'",
                  :items="[item]",
                  :color="(item.body.purpose === 'personal' ? 'grey-9' : 'grey-9')")

      //
      // LIST PUBLIC
      div(v-else-if="displayType === 'visibility'")

        //
        // Public Recipes
        content-block
          template(slot="title") Geteilte Rezepte
          template(slot="content")
            users-public-recipes

        // Public Recipes
        content-block
          template(slot="title") Geteilte gemixte Rezepte
          template(slot="content")
            users-public-recipes-remixed

        //
        // Public Clouds
        content-block
          template(slot="title") Geteilte Wortwolken
          template(slot="content")
            users-public-clouds

        //
        // Public Mr. Griddles
        content-block
          template(slot="title") Geteilte Mr. Griddle Sequenzen
          template(slot="buttons")
          template(slot="content")
            users-public-mr-griddles

        //
        // Public Sequences
        content-block
          template(slot="title") Geteilte Sequenzen
          template(slot="buttons")
          template(slot="content")
            users-public-sequences

        //
        // Public Uploads
        content-block
          template(slot="title") Geteilte Uploads
          template(slot="buttons")
          template(slot="content")
            users-public-uploads
        //
        // Public Portrait
        <!--content-block(v-if="portrait.length > 0")-->
          <!--template(slot="title") Öffentliches Portrait-->
          <!--template(slot="buttons")-->
          <!--template(slot="content")-->
            <!--users-public-portrait(:portraits="portrait", @changed="fetchPortrait")-->

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
  import { mapGetters } from 'vuex'
  import { Portraits, PortraitsPlusPlus, GroupVideoSequences } from '../components/dashboard'
  import { VideoHelper } from '../lib'

  import ContentBlock from '../components/ContentBlock'
  import FileUploaderMicro from '../components/FileUploaderMicro'
  import LoadingSpinner from '../components/LoadingSpinner'
  import MrGriddleListView from '../components/MrGriddleListView'
  import UserClouds from '../components/profil/UserClouds'
  import UserRecipes from '../components/profil/UserRecipes'
  import UserMrGriddles from '../components/profil/UserMrGriddles'
  import UserSequences from '../components/profil/UserSequences'
  import UserUploads from '../components/profil/UserUploads'
  import UsersPublicClouds from '../components/profil/UsersPublicClouds'
  import UsersPublicRecipes from '../components/profil/UsersPublicRecipes'
  import UsersPublicRecipesRemixed from '../components/profil/UsersPublicRecipesRemixed'
  import UsersPublicSequences from '../components/profil/UsersPublicSequences'
  import UsersPublicPortrait from '../components/profil/UsersPublicPortrait'
  import UsersPublicMrGriddles from '../components/profil/UsersPublicMrGriddles'
  import UsersPublicUploads from '../components/profil/UsersPublicUploads'
  import VideoItem from '../components/VideoItem'
  import VideoListView from '../components/VideoListView'

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
      UsersPublicUploads,
      UsersPublicClouds,
      UsersPublicRecipes,
      UsersPublicRecipesRemixed,
      FileUploaderMicro,
      ContentBlock,
      MrGriddleListView,
      UserUploads,
      UserSequences,
      UserMrGriddles,
      UserClouds,
      UserRecipes
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
      },
      associations () {
        if (this.displayType === 'type') this.groupByType()
        else if (this.displayType === 'time') this.groupByDate()
      },
      recipesPersonal () {
        if (this.displayType === 'type') this.groupByType()
        else if (this.displayType === 'time') this.groupByDate()
      },
      recipesRemixed () {
        if (this.displayType === 'type') this.groupByType()
        else if (this.displayType === 'time') this.groupByDate()
      }
    },
    data () {
      return {
        associations: undefined,
        hasVoted: undefined,
        dates: undefined,
        displayType: 'type',
        griddles: undefined,
        grouped: undefined,
        headlines: undefined,
        nickname: undefined,
        portrait: [],
        portraitLoading: false,
        sequences: undefined,
        uploads: undefined,
        recipesPersonal: undefined,
        recipesRemixed: undefined
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadUploadsData)
      this.$root.$on('updateSequences', this.loadSequencesData)
      this.$root.$on('updateGriddles', this.loadGriddleData)
      this.$root.$on('updateClouds', this.loadCloudsData)
      this.$root.$on('updateRecipes', this.loadRecipesData)
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
      this.$root.$off('updateGriddles', this.loadGriddleData)
      this.$root.$off('updateClouds', this.loadCloudsData)
      this.$root.$off('updateRecipes', this.loadRecipesData)
    },
    methods: {
      emitLoadData () {
        // console.log('profil', 'emitLoadData', 'unsichtbar gesetzt')
      },
      async loadAllTheThings () {
        if (!this.user) return
        this.hasVoted = await this.$store.dispatch('survey/hasVoted', this.user.uuid)
        await this.loadRecipesData()
        await this.loadGriddleData()
        await this.loadSequencesData()
        await this.loadUploadsData()
        await this.loadCloudsData()
      },
      async loadRecipesData () {
        if (!this.user) return
        const query = {
          'body.type': 'Recipe',
          'author.id': this.user.uuid
        }
        const
          _this = this,
          recipes = await this.$store.dispatch('annotations/find', query)
        this.recipesPersonal = recipes.items.filter(recipe => {
          return recipe.author.id === _this.user.uuid && recipe.body.purpose === 'personal' && !recipe.target
        })
        this.recipesRemixed = recipes.items.filter(recipe => {
          return recipe.author.id === _this.user.uuid && recipe.body.purpose === 'remix' && !recipe.target
        })
        console.debug('personal recipes:', this.recipesPersonal)
        console.debug('remixed recipes:', this.recipesRemixed)
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
        this.griddles = sequenceAnnotations.filter(item => {
          return item && item.created !== undefined
        })
        console.debug('griddles: ', this.griddles)
      },
      async loadSequencesData () {
        if (!this.user) return
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        // console.log('result:', result)
        let sequences = result.items.filter(map => {
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
        }).filter(item => {
          return item.annotation && item.annotation.created
        })
        for (let sequence of sequences) {
          const responsesQuery = {
            'target.id': `${process.env.ANNOTATION_BASE_URI}${sequence.annotation.uuid}`,
            'body.purpose': 'commenting'
          }
          sequence.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        }
        this.sequences = sequences
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
          // load responses
          for (let upload of uploads) {
            const responsesQuery = {
              'target.id': `${process.env.ANNOTATION_BASE_URI}${upload.annotation.uuid}`,
              'body.purpose': 'commenting'
            }
            upload.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
          }
          this.uploads = uploads.filter(seq => {
            return seq.annotation && seq.annotation.created
          })
        }
        else this.uploads = []
        console.debug('uploads: ', this.uploads)
      },
      async loadCloudsData () {
        this.associations = await this.$store.dispatch('cloud/listAssociations', this.user.uuid)
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
        if (this.associations) allItems = allItems.concat(this.associations)
        if (this.recipesPersonal) allItems = allItems.concat(this.recipesPersonal)
        if (this.recipesRemixed) allItems = allItems.concat(this.recipesRemixed)
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
          'Meine Rezepte': [].concat(this.recipesPersonal),
          'Meine gemixten Rezepte': [].concat(this.recipesRemixed),
          'Meine Clouds': [].concat(this.associations),
          'Meine Mr. Griddle Sequenzen ': [].concat(this.griddles),
          'Meine Sequenzen': [].concat(this.sequences),
          'Meine Uploads': [].concat(this.uploads)
        }
        this.headlines = Object.keys(grouped)
        this.grouped = grouped
        console.debug('grouped:', this.grouped)
      },
      orderByTime () {
        this.displayType = 'time'
        this.groupByDate()
      },
      orderByType () {
        this.displayType = 'type'
        this.groupByType()
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
