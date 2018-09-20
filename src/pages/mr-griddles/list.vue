<template lang="pug">
  q-page.q-ma-lg
    q-btn.q-mb-lg.full-width(@click="$router.push('/mr-griddle/create')", :label="$t('Mr. Griddle hinzufügen')", color="primary")
    h3 Deine Mr. Griddles
    mr-griddle-list-view(layout-style='sm',
                        :items="sequences")
      template(slot="customButtons" slot-scope="{ item }")
        q-btn(flat, size="sm" round,
          :icon="getItemStyle(item).icon", :color="getItemStyle(item).color"
          @click="toggleItemFavorite(item)")
        q-btn(flat, size="sm" round, icon="edit"
          @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm" round, icon="delete"
          @click="openDeleteModal(item)")
</template>

<script>
  import MrGriddleListView from '../../components/MrGriddleListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      MrGriddleListView
    },
    data () {
      return {
        sequences: [],
        favoriteSequences: []
      }
    },
    mounted () {
      this.loadData()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      user (val) {
        if (val) this.loadData()
      }
    },
    methods: {
      async loadFavorites () {
        // fetch favorite sequences
        const target = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        if (target) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': target.id,
            'author.id': this.user.uuid
          })
          if (favAnnotations && favAnnotations.items.length > 0) this.favoriteSequences = favAnnotations.items
        }
      },
      async toggleItemFavorite (item) {
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        if (favorite) {
          await this.$store.dispatch('annotations/delete', favorite.uuid)
        }
        else {
          const payload = {
            type: 'MrGriddleFavourite',
            target: {
              type: 'Timeline',
              id: `${process.env.TIMELINE_BASE_URI}${process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID}`
            },
            body: {
              source: {
                id: item.target.id
              },
              type: 'Timeline',
              purpose: 'linking'
            }
          }
          await this.$store.dispatch('annotations/post', payload)
        }
        await this.loadFavorites()
      },
      getItemStyle (item) {
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        if (favorite) {
          return {
            color: 'primary',
            icon: 'favorite'
          }
        }
        return {
          color: 'grey-5',
          icon: 'favorite_outline'
        }
      },
      async loadData () {
        if (!this.user) return
        // get (private) griddles for this user
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const maps = await this.$store.dispatch('maps/find', query)
        const griddleSequences = maps.items.filter(m => {
          return m.title.indexOf('GriddleSequence ') === 0
        })
        // console.log(griddleSequences)
        this.griddleSequences = griddleSequences
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        this.sequences = sequenceAnnotations
        await this.loadFavorites()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
