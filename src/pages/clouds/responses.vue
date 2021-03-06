<template lang="pug">
  q-page.q-ma-md
    upload-remix-modal(ref="uploadRemixModal")

    cloud-item(:item="association")

    q-btn.full-width.q-mb-md(dark, color="primary", @click="uploadResponse") {{ $t('buttons.upload_response') }}

    div
      video-list-view(
      v-if="responses.length > 0"
      :videos="responses"
      layoutStyle="sm"
      :buttons="['delete']"
      :allowSelfResponse="$route.meta.allowSelfResponse")

      q-card.q-pa-md.q-mb-md.text-grey-8.text-center(v-else)
        | {{ $t('messages.no_videos') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  import { VideoPlayer } from 'mbjs-quasar/src/components'
  import VideoListView from '../../components/VideoListView'
  import CloudItem from '../../components/CloudItem'
  import UploadRemixModal from '../../components/UploadRemixModal'

  export default {
    components: {
      UploadRemixModal,
      VideoPlayer,
      CloudItem,
      VideoListView
    },
    data () {
      return {
        association: undefined,
        responses: []
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadResponses)
      await this.loadData()
    },
    async beforeDestroy () {
      this.$root.$off('updateVideos', this.loadResponses)
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      videoPlayerStyle () {
        if (this.annotationMetadata) {
          const ratio = this.annotationMetadata.width / this.annotationMetadata.height
          if (this.annotationMetadata.width > this.annotationMetadata.height) {
            return {
              width: '100%',
              height: 'auto'
            }
          }
          else {
            return {
              width: `calc(80vw*${ratio})`,
              height: 'auto',
              'margin-left': `calc(40vw*${ratio})`
            }
          }
        }
      }
    },
    watch: {
      async user () {
        await this.loadData()
      },
      async association () {
        await this.loadResponses()
      }
    },
    methods: {
      async loadData () { // loads text
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.association = await this.$store.dispatch('cloud/getAssociation', this.$route.params.uuid)
        this.$q.loading.hide()
      },
      async loadResponses () {
        if (this.association) {
          this.$q.loading.show({ message: this.$t('messages.loading_responses') })
          const query = {
            'target.id': `${process.env.ASSOCIATION_BASE_URI}${this.association.uuid}`,
            'target.type': 'WordAssociation',
            'body.purpose': 'commenting',
            'body.type': 'Video'
          }
          this.responses = await VideoHelper.fetchVideoItems(this, query)
          this.$q.loading.hide()
        }
      },
      async uploadResponse () {
        this.$refs.uploadRemixModal.show({
          id: `${process.env.ASSOCIATION_BASE_URI}${this.association.uuid}`,
          type: 'WordAssociation'
        })
        const message = {
          association: this.association.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      }
    }
  }
</script>
