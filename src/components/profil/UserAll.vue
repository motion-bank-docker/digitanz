<template lang="pug">
  div
    content-block(v-for="day in Object.keys(items)")
      template(slot="title") {{ DateTime.fromISO(day).toLocaleString() }}
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
      async loadData () {
        let allItems = []
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'body.type': 'MrGriddleSkeleton'
        }
        let results = await this.$store.dispatch('annotations/find', query)
        allItems = allItems.concat(results.items)
        query = {
          'author.id': this.user.uuid,
          'body.type': 'Video',
          'body.source.type': 'video/mp4'
        }
        results = await VideoHelper.fetchVideoItems(this, query)
        allItems = allItems.concat(results)
        allItems = allItems.sort((a, b) => {
          const
            ac = a.annotation ? a.annotation.created : a.created,
            bc = b.annotation ? b.annotation.created : b.created
          if (ac < bc) return 1
          if (ac > bc) return -1
          return 0
        })
        const groupedByDay = {}
        for (let item of allItems) {
          const day = DateTime.fromISO(item.created).startOf('day').toISO()
          if (Array.isArray(groupedByDay[day])) groupedByDay[day].push(item)
          else groupedByDay[day] = [item]
        }
        this.items = groupedByDay
      }
    }
  }
</script>
