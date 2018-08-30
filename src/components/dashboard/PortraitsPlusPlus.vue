<template lang="pug">

  .row
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteVideo")
    template(v-if="")
      video-list-view(
        v-if="sequences && sequences.length > 0",
        :videos="sequences",
        layoutStyle="sm",
        :allowSelfResponse="true",
        @changed="loadVideoSequences",
        :buttons="['download']")
          template(slot="customButtons" slot-scope="{ video }")
            q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")
            q-btn(flat, size="sm", round, icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")
            q-btn(flat, size="sm", round, icon="delete" @click="openDeleteModal(video)")
      p
        router-link(:to="{path: 'portraitplusplus'}") {{ $t('dates.date_2.page_link') }}
    template(v-else)
      | {{ $t('messages.no_videos') }}

</template>

<script>
  import VideoListView from '../../components/VideoListView'
  import { mapGetters } from 'vuex'
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import { SequenceHelper } from '../../lib'
  import ConfirmModal from '../../components/ConfirmModal'

  export default {
    name: 'dashboard-portraits-plus-plus',
    components: {
      VideoListView,
      ConfirmModal
    },
    props: [
      'date'
    ],
    data () {
      return {
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        sequences: [],
        favouriteSequences: []
      }
    },
    computed: {
      iconStyleIcon () {
        return 'favorite'
      },
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    watch: {
      async user () {
        if (!this.sequences) {
          await this.loadVideoSequences()
          await this.loadFavouriteSequences()
        }
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadVideoSequences()
        await this.loadFavouriteSequences()
      }
    },
    methods: {
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
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
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

        await this.loadVideoSequences()
        await this.loadFavouriteSequences()
      },
      async deleteVideo (video) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, video.map.uuid)
        this.$q.loading.hide()
        await this.loadVideoSequences()
      },
      async loadVideoSequences () {
        if (!this.user) return
        const prefix = 'Sequenz: '
        const query = {
          created: { $gte: this.$props.date.start, $lte: this.$props.date.end },
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        this.sequences = result.items.filter(map => {
          return map.title.indexOf(prefix) === 0
        }).sort(this.$sort.onCreatedDesc).map(map => {
          const media = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
          }
          let processing = false
          for (let jobId of this.sequenceJobIds) {
            if (this.sequenceJobDetails[jobId].uuid === map.uuid) processing = true
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
          return {
            processing,
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
      }
    }
  }
</script>

<style lang="stylus">

</style>
