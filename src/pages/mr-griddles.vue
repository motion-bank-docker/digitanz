<template lang="pug">
  q-page.q-ma-lg
    h3 Deine Mr. Griddles
    mr-griddle-list-view(layout-style='sm')
</template>

<script>
  import MrGriddleListView from '../components/MrGriddleListView'
  import { mapGetters } from 'vuex'
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      MrGriddleListView,
      ConfirmModal
    },
    data () {
      return {
        // myMrGriddlesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        myMrGriddles: [],
        favouriteMrGriddles: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    async mounted () {
      await this.loadMyMrGriddles()
    },
    watch: {
      async user () {
        await this.loadMyMrGriddles()
      }
    },
    methods: {
      // openDeleteModal (item) {
      //   this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      // }
      async loadMyMrGriddles () {
        if (!this.user) return
        const prefix = 'GriddleSequence '
        const query = {
          created: {$gte: this.$dates()[2].start, $lte: this.$dates()[6].end}, // TESTING: wrong date at the moment!
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        console.log('### ', result)
        this.myMrGriddles = result.items.filter(map => {
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
            body: {
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`,
                type: 'video/mp4'
              }
            }
          }
          // console.log(`${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`)
          return {
            annotation,
            media,
            preview
          }
        })
        console.log(this.myMrGriddles)
        // this.myMrGriddles = result
      }
    },
    props: [
      'date',
      'path'
    ],
    name: 'my-mr-griddles'
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
