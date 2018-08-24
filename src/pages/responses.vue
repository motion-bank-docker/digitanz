<template lang="pug">
  q-page.q-px-md
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")

    div
      h3.text-center {{ $t('pages.responses.title') }}

      div(:style="videoPlayerStyle")
        video-player(v-if="annotation", :annotation="annotation", :autoplay="true")

      q-btn.full-width.q-my-md(v-if="annotation && annotation.author.id !== user.uuid",
        dark, color="primary", @click="uploadResponse(annotation)") {{ $t('buttons.upload_remix') }}

    .row
      video-list-view(v-if="responses.length > 0", :videos="responses", layoutStyle="sm", :hideButtons="hideButtons")
      template(v-else)
        | {{ $t('messages.no_videos') }}
</template>

<script>
  import VideoModal from '../components/VideoModal'
  import UploadRemixModal from '../components/UploadRemixModal'
  import VideoListView from '../components/VideoListView'
  import { VideoHelper } from '../lib'
  import { mapGetters } from 'vuex'
  import { VideoPlayer } from 'mbjs-quasar/src/components'

  export default {
    components: {
      VideoModal,
      UploadRemixModal,
      VideoListView,
      VideoPlayer
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      videoPlayerStyle () {
        if (this.annotationMetadata) {
          if (this.annotationMetadata.width > this.annotationMetadata.height) {
            return {
              width: '100%',
              height: 'auto'
            }
          }
          else {
            return {
              width: 'auto',
              height: '300px'
            }
          }
        }
        return {
          width: '100%',
          height: '300px'
        }
      }
    },
    data () {
      return {
        annotation: undefined,
        annotationMetadata: undefined,
        responses: []
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadResponses)
      await this.loadResponses()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadResponses)
    },
    methods: {
      async loadResponses () {
        this.$q.loading.show({ message: this.$t('messages.loading_responses') })
        this.annotation = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        if (this.annotation) {
          const responsesQuery = {
            'target.id': `${process.env.ANNOTATION_BASE_URI}${this.annotation.uuid}`,
            'body.purpose': 'commenting'
          }
          this.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
          console.debug(this.responses)
        }
        this.$q.loading.hide()
      },
      async uploadResponse (annotation) {
        this.$refs.uploadRemixModal.show({ annotation })
        const message = {
          portrait: annotation.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      }
    }
  }
</script>
