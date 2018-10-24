<template lang="pug">
  div
    // confirm-modal(ref="confirmDeleteModal", @confirm="deleteSequence")

    video-list-view(:videos="sequences",
                    layoutStyle="profile",
                    card-width="100%",
                    v-if="sequences.length > 0",
                    :buttons="['more-delete', 'more-download']",
                    :showDuration="false",
                    :isSequence="true",
                    @changed="changed")
      template(slot="customButtons" slot-scope="{ video }")
        // q-btn(flat, size="sm", round, icon="delete", @click="openDeleteModal(video)")
        q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")
        // q-btn(flat, size="sm", round, icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")
      template(slot="customMoreButtons" slot-scope="{ video }")
        q-item.q-px-sm
          q-btn(round, flat, size="sm", icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")

    .text-center(v-else)
      loading-spinner

</template>

<script>
  import LoadingSpinner from '../LoadingSpinner'
  import VideoListView from '../VideoListView'
  import { mapGetters } from 'vuex'
  import { SequenceHelper } from '../../lib'
  import ConfirmModal from '../ConfirmModal'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'

  export default {
    components: {
      LoadingSpinner,
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
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        favouriteSequences: []
      }
    },
    props: {
      sequences: Array
    },
    async mounted () {
      if (this.user) {
        await this.loadFavouriteSequences()
      }
    },
    watch: {
      async user (val) {
        if (val) await this.loadFavouriteSequences()
      }
    },
    methods: {
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      changed () {
        this.$emit('changed')
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
            icon: 'people'
          }
        }
        return {
          color: 'grey-5',
          icon: 'people'
        }
      },
      async loadFavouriteSequences () {
        if (!this.user) return
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
        console.log('sequence was made public')
      }
    }
  }
</script>

<style scoped>

</style>
