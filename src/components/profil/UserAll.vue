<template lang="pug">
  div
    content-block(v-if="days && items", v-for="day in days")
      template(slot="title") {{ getDayLabel(day) }}
      template(slot="content")
        div(v-for="item in items[day]")
          p(v-if="item.annotation && item.annotation.body.type === 'Video'") I am VIDEO.
          p(v-if="item.body && item.body.type === 'MrGriddleSkeleton'") I am GRIDDLE.

</template>

<script>
  import VideoListView from '../VideoListView'
  import LoadingSpinner from '../LoadingSpinner'
  import ContentBlock from '../ContentBlock'

  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  import { DateTime } from 'luxon'
  // import { ObjectUtil } from 'mbjs-utils'

  export default {
    components: {
      VideoListView,
      LoadingSpinner,
      ContentBlock
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    data () {
      return {
        items: undefined,
        days: undefined,
        uploads: [],
        sequences: undefined
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
        console.log('uploads: ', this.uploads)
        console.log('sequences: ', this.sequences)
      }
    },
    watch: {
      async user (val) {
        if (val) {
          await this.loadData()
        }
      }
    },
    methods: {
      getDayLabel (day) {
        if (!day) return ''
        return DateTime.fromISO(day).toLocaleString()
      },
      async loadData () {
        let allItems = []
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'body.type': 'MrGriddleSkeleton'
        }
        let results = await this.$store.dispatch('annotations/find', query)
        console.log('griddle results', results)
        allItems = allItems.concat(results.items)
        query = {
          'author.id': this.user.uuid,
          'body.type': 'Video',
          'body.source.type': 'video/mp4'
        }
        results = await VideoHelper.fetchVideoItems(this, query)
        console.log('video results', results)
        allItems = allItems.concat(results)
        allItems = allItems.sort((a, b) => {
          const
            ac = a.annotation ? a.annotation.created : a.created,
            bc = b.annotation ? b.annotation.created : b.created
          if (ac < bc) return 1
          if (ac > bc) return -1
          return 0
        })
        console.log('all items', allItems)
        const groupedByDay = {}
        for (let item of allItems) {
          let day
          if (item.created || item.annotation.created) {
            day = DateTime.fromISO(item.created || item.annotation.created).startOf('day').toISO()
          }
          if (day) {
            if (Array.isArray(groupedByDay[day])) groupedByDay[day].push(item)
            else groupedByDay[day] = [item]
          }
        }
        this.items = groupedByDay
        this.days = Object.keys(groupedByDay)
        console.log('items', this.items, this.days)
      }
    }
  }
</script>
