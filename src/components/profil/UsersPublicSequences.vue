<template lang="pug">
  div
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteSequence")

    video-list-view(:videos="publishedSequences",
    layoutStyle="sm",
    :buttons="['more-delete', 'more-download']",
    :showDuration="false",
    @changed="loadData")
      template(slot="customButtons" slot-scope="{ video }")
        q-btn(flat, size="sm", round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="toggleItemFavorite(video)")
      template(slot="customMoreButtons" slot-scope="{ video }")
        q-item.q-px-sm
          q-btn(round, flat, size="sm", icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")

</template>

<script>
  import VideoListView from '../VideoListView'
  import { mapGetters } from 'vuex'
  import { SequenceHelper } from '../../lib'
  import ConfirmModal from '../ConfirmModal'
  // import { ObjectUtil } from 'mbjs-utils'
  // import { DateTime } from 'luxon'

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
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        sequences: [],
        publishedSequences: [],
        favouriteSequences: []
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
        console.log('loading sequences from component')
        if (!this.user) return
        this.sequences = []
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        console.log('result:', result)
        this.sequences = result.items.filter(map => {
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
            annotation,
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
        await this.loadFavouriteSequences()
        this.findPublishedSequences()
      },
      findPublishedSequences () {
        for (let item of this.sequences) {
          if (this.favouriteSequences.items && this.favouriteSequences.items.filter(seq => {
            return seq.body.source.id === item.annotation.body.source.id
          }).length > 0) {
            this.publishedSequences.push(item)
          }
        }
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
            icon: 'people'
          }
        }
        return {
          color: 'grey-5',
          icon: 'people'
        }
      },
      async loadFavouriteSequences () {
        const query = {
          'target.id': this.sequencesFavouritesMapUUID,
          'author.id': this.user.uuid
        }
        this.favouriteSequences = await this.$store.dispatch('annotations/find', query)
      },
      async toggleItemFavorite (item) {
        const query = {
          'target.id': this.sequencesFavouritesMapUUID,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)

        for (let favouredItem of result.items) {
          // remove only this current item
          if (favouredItem.body.source.id === item.annotation.body.source.id) {
            await this.$store.dispatch('annotations/delete', favouredItem.uuid)
            await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
          }
        }
        await this.loadData()
      }
    }
  }
</script>

<style scoped>

</style>
