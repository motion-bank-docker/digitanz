<template lang="pug">
  div
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    mr-griddle-list-view(
    v-if="sequences",
    layout-style='sm',
    :items="sequences")

      template(slot="customButtons" slot-scope="{ item }")
        q-btn(flat, size="sm" round,
        :icon="getItemStyle(item).icon", :color="getItemStyle(item).color",
        @click="toggleItemFavorite(item)")

        q-btn(flat, size="sm" round, icon="edit",
        @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm" round, icon="delete",
        @click="openDeleteModal(item)")
</template>

<script>
  import ConfirmModal from '../../components/ConfirmModal'
  import MrGriddleListView from '../../components/MrGriddleListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ConfirmModal,
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
    // TODO dis-fav last item (list returns empty)
    methods: {
      async loadFavorites () {
        // fetch favorite sequences
        const target = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        if (target) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': target.id,
            'author.id': this.user.uuid
          })
          this.favoriteSequences = favAnnotations.items
        }
      },
      async toggleItemFavorite (item) {
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        const message = {
          timeline: item.target.id,
          user: this.user.uuid
        }
        if (favorite) {
          await this.$store.dispatch('annotations/delete', favorite.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favorite.uuid, role: 'digitanz', permission: 'get'})
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
          const fav = await this.$store.dispatch('annotations/post', payload)
          if (fav) {
            await this.$store.dispatch('acl/set', {uuid: fav.uuid, role: 'digitanz', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'griddle_sequence_favourite_set', message })
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
        let sequenceAnnotations = []
        for (let seq of griddleSequences) {
          const annotations = await this.$store.dispatch('annotations/find', {
            'target.id': seq.id
          })
          sequenceAnnotations.push(annotations.items[0])
        }
        this.sequences = sequenceAnnotations
        await this.loadFavorites()
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        if (favorite) {
          await this.$store.dispatch('annotations/delete', favorite.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favorite.uuid, role: 'digitanz', permission: 'get'})
        }
        await this.$store.dispatch('maps/delete', item.target.id.split('/').pop())
        this.$q.loading.hide()
        await this.loadData()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
