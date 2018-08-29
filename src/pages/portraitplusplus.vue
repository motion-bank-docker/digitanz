<template lang="pug">
  q-page
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteVideo")
    video-modal(ref="videoModal")

    // HEAD
    //
    h3.text-center
      | {{ $t('pages.portraitplusplus.title') }}
    .q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('pages.portraitplusplus.description') }}

    //job-list

    // SHOW RESULTS
    //
    .row.q-ma-md
      video-list-view(
        v-if="favouriteSequences && favouriteSequences.length > 0", :allowSelfResponse="true",
        :videos="favouriteSequences", layoutStyle="sm", :buttons="['download']")
          template(slot="customButtons" slot-scope="{ video }")
            q-btn(flat, size="sm" round, icon="delete" @click="openDeleteModal(video)")

</template>

<script>
  import { mapGetters } from 'vuex'
  import VideoListView from '../components/VideoListView'
  import VideoModal from '../components/VideoModal'
  import { SequenceHelper, VideoHelper } from '../lib'
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    name: 'portraitplusplus',
    components: {
      VideoModal,
      VideoListView,
      ConfirmModal
    },
    data () {
      return {
        favouriteSequences: []
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
