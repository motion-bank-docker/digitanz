<template lang="pug">
  div
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    mr-griddle-list-view(
    v-if="sequences.length > 0",
    layout-style='sm',
    :items="sequences")

      template(slot="customButtons", slot-scope="{ item }")
      //
        q-btn(flat, size="sm" round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color",
        @click="toggleItemFavorite(item)")

        q-btn(flat, size="sm", round, icon="edit",
        @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm", round, icon="delete",
        @click="openDeleteModal(item)")

    // .text-center.q-pb-md(v-else)
      loading-spinner

</template>

<script>
  import ConfirmModal from './ConfirmModal'
  import LoadingSpinner from './LoadingSpinner'
  import MrGriddleListView from './MrGriddleListView'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ConfirmModal,
      LoadingSpinner,
      MrGriddleListView
    },
    data () {
      return {
        sequences: [],
        favoriteSequences: [],
        favItems: []
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
        // console.log('mmmmmm load favorites ', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        const target = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_TIMELINE_UUID)
        console.log('ooooooo target:', target)
        if (target) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': target.id,
            'author.id': this.user.uuid
          })
          this.favoriteSequences = favAnnotations.items
        }
        console.log('###### favorite sequences', this.favoriteSequences)
      },
      async toggleItemFavorite (item, silent = true) {
        if (!silent) this.$q.loading.show({ message: this.$t('messages.setting_sequence') })
        const query = {
          'target.id': item.target.id,
          'author.id': this.user.uuid
        }
        // console.log(item.target.id)
        // console.log(this.user.uuid)
        let result = await this.$store.dispatch('annotations/find', query)
        // console.log('result: ', result)
        this.favItems = result
        // let isCurrentItem = false
        for (let favouredItem of result.items) {
          // remove only this current item
          console.log('favouredItem: ', favouredItem)
          // if (favouredItem.body.source.id === item.annotation.body.source.id) {
            // isCurrentItem = true
            // await this.$store.dispatch('annotations/delete', favouredItem.uuid)
            // await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
          // }
        }
        /*
        const message = {
          video: item.annotation.body.source.id,
          user: this.user.uuid
        }
        if (!isCurrentItem) {
          const annotation = {
            author: {
              id: this.user.uuid
            },
            body: ObjectUtil.merge({}, item.annotation.body),
            target: {
              id: this.sequencesFavouritesMapUUID,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
          }
          const favouredItem = await this.$store.dispatch('annotations/post', annotation)
          if (favouredItem) {
            await this.$store.dispatch('acl/set', {uuid: favouredItem.uuid, role: 'public', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'sequence_favourite_set', message })
          if (!silent) this.$q.loading.hide()
        }
        else if (!silent) {
          await this.$store.dispatch('logging/log', { action: 'sequence_favourite_unset', message })
          this.$q.loading.hide()
        }

        // dk: neccessary to load content again?
        await this.loadData()
        console.log('mr. griddle was made public') */
      },
      /* async toggleItemFavorite (item) {
        console.log('ääääääää item:', item)
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        console.log('ffffffff favorite:', favorite)
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
      }, */
      getItemStyle (item) {
        // console.log('qqqqqqqqqqq', this.favItems)
        // console.log(item, 'qqqqqqqqqqq')
        // const favorite = this.favoriteSequences.find(a => {
        const favorite = this.favItems.find(a => {
          // console.log(a.id, item.id)
          console.log(a, item)
          // return a.body.source && a.body.source.id === item.target.id
          /* console.log('aaaaa a', a)
          console.log('iiiii item', item) */
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
        // console.log('::::: griddles', this.sequences)
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
