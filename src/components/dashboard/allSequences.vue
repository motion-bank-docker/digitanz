<template lang="pug">
  div
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteVideo")
    video-modal(ref="videoModal")

    .row.q-mx-md
      video-list-view(
      v-if="favouriteSequences && favouriteSequences.length > 0", :allowSelfResponse="true",
      :videos="favouriteSequences", layoutStyle="sm", :buttons="['download']")
        template(slot="customButtons" slot-scope="{ video }")
          q-btn(flat, size="sm" round, icon="delete" @click="openDeleteModal(video)")

</template>

<script>
  import { mapGetters } from 'vuex'
  import VideoListView from '../VideoListView'
  import VideoModal from '../VideoModal'
  import { SequenceHelper, VideoHelper } from '../../lib'
  import ConfirmModal from '../ConfirmModal'

  export default {
    components: {
      VideoModal,
      VideoListView,
      ConfirmModal
    },
    data () {
      return {
        favouriteSequences: [],
        date: this.$dates()[1]
      }
    },
    async mounted () {
      this.$root.$on('updateSequences', this.loadFavouriteSequences)
      if (this.user) {
        await this.loadFavouriteSequences()
      }
    },
    beforeDestroy () {
      this.$root.$off('updateSequences', this.loadFavouriteSequences)
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    watch: {
      async user () {
        if (!this.sequences) {
          await this.loadFavouriteSequences()
        }
      }
    },
    methods: {
      openPreview (item) {
        this.preview = item.annotation
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteVideo (video) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, video.map.uuid)
        this.$q.loading.hide()
        await this.loadFavouriteSequences()
      },
      async loadFavouriteSequences () {
        this.$q.loading.show({ message: this.$t('messages.loading_sequences') })
        const query = {
          'created': { $gte: this.date.start, $lte: this.date.end },
          'target.id': `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`
        }
        const sequences = await VideoHelper.fetchVideoItems(this, query)
        for (let sequence of sequences) {
          const responsesQuery = {
            'target.id': `${process.env.ANNOTATION_BASE_URI}${sequence.annotation.uuid}`,
            'body.purpose': 'commenting'
          }
          sequence.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        }
        this.favouriteSequences = sequences
        this.$q.loading.hide()
      }
    }
  }
</script>
