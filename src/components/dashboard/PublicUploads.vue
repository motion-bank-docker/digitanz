<template lang="pug">
  div
    video-modal(ref="videoModal")

    .text-center.q-mb-md(v-if="publicUploads.length <= 0 && isLoading")
      loading-spinner

    .row
      video-list-view(
      v-if="publicUploads && publicUploads.length > 0",
      :allowSelfResponse="true",
      :videos="publicUploads",
      layoutStyle="sm",
      :buttons="['download']",
      :showContentFlag ="true")
        template(slot="customButtons" slot-scope="{ video }")
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoadingSpinner from '../LoadingSpinner'
  import VideoListView from '../VideoListView'
  import VideoModal from '../VideoModal'
  import { VideoHelper } from '../../lib'

  export default {
    components: {
      LoadingSpinner,
      VideoModal,
      VideoListView
    },
    data () {
      return {
        publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
        publicUploads: [],
        isLoading: false
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {
        this.isLoading = true
        this.$q.loading.show({ message: this.$t('messages.loading_sequences') })
        const query = {
          'target.id': this.publicUploadsMapUUID
        }
        const publicUploads = await VideoHelper.fetchVideoItems(this, query)

        for (let upload of publicUploads) {
          const responsesQuery = {
            'target.id': `${process.env.ANNOTATION_BASE_URI}${upload.annotation.uuid}`,
            'body.purpose': 'commenting'
          }
          upload.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        }
        this.publicUploads = publicUploads
        this.$q.loading.hide()
        this.isLoading = false
      }
    }
  }
</script>
