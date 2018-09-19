<template lang="pug">
  div
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteSequence")

    video-list-view(:videos="publishedSequences",
    layoutStyle="sm",
    :buttons="['download']",
    :showDuration="false",
    @changed="loadData")
      template(slot="customButtons" slot-scope="{ video }")
        q-btn(flat, size="sm", round, icon="delete", @click="openDeleteModal(video)")
        q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")

</template>

<script>
  import VideoListView from '../VideoListView'
  import { mapGetters } from 'vuex'
  import { SequenceHelper } from '../../lib'
  import ConfirmModal from '../ConfirmModal'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'

  export default {
    components: {
      VideoListView,
      ConfirmModal
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    data () {
      return {

      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {

      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteSequence (sequence) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, sequence.map.uuid)
        this.$q.loading.hide()
        await this.loadData()
      },
      getItemStyle (item) {
        if (this.favouriteSequences.items && this.favouriteSequences.items.filter(seq => {
          return seq.body.source.id === item.annotation.body.source.id
        }).length > 0) {
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
      async loadFavouriteSequences () {
        const query = {
          'target.id': this.sequencesFavouritesMapUUID,
          'author.id': this.user.uuid
        }
        this.favouriteSequences = await this.$store.dispatch('annotations/find', query)
      },
      async toggleItemFavorite (item, silent = true) {
        if (!silent) this.$q.loading.show({ message: this.$t('messages.setting_sequence') })
        const query = {
          'target.id': this.sequencesFavouritesMapUUID,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)

        let isCurrentItem = false
        for (let favouredItem of result.items) {
          // remove only this current item
          if (favouredItem.body.source.id === item.annotation.body.source.id) {
            isCurrentItem = true
            await this.$store.dispatch('annotations/delete', favouredItem.uuid)
            await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
          }
        }
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
        await this.loadFavouriteSequences()
        console.log('sequence was made public')
      }
    }
  }
</script>

<style scoped>

</style>
