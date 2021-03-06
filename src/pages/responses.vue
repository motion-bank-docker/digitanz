<template lang="pug">
  q-page.q-px-md
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")

    div
      h3.text-center {{ $t('pages.responses.title') }}

      div(:style="videoPlayerStyle").q-mb-md
        video-player(v-if="annotation", :annotation="annotation", :autoplay="true")

      q-btn.full-width.q-mb-md(v-if="$route.meta.allowSelfResponse || annotation && annotation.author.id !== user.uuid",
        dark, color="primary", @click="uploadResponse(annotation)") {{ $t('buttons.upload_remix') }}
      <!--q-uploader-extended-simple(v-if="$route.meta.allowSelfResponse || annotation && annotation.author.id !== user.uuid",)-->
      q-card.q-pa-md.q-mb-md.text-grey-8(v-else) {{ $t('messages.rejected_selfresponse') }}

      job-list

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
  import VideoModal from '../components/VideoModal'
  import UploadRemixModal from '../components/UploadRemixModal'
  import VideoListView from '../components/VideoListView'
  import QUploaderExtendedSimple from '../components/QUploaderExtendedSimple'
  import { VideoHelper } from '../lib'
  import { mapGetters } from 'vuex'
  import { VideoPlayer } from 'mbjs-quasar/src/components'
  import JobList from '../components/JobList'

  export default {
    components: {
      VideoModal,
      UploadRemixModal,
      VideoListView,
      VideoPlayer,
      JobList,
      QUploaderExtendedSimple
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
    data () {
      return {
        annotation: undefined,
        annotationMetadata: undefined,
        responses: [],
        hideButtons: true
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
        // this.$q.loading.show({ message: this.$t('messages.loading_responses') })
        try {
          this.annotation = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        }
        catch (e) {
          // OH NO! we have no annotation... it's a private sequence!
          this.annotation = {
            uuid: this.$route.params.uuid,
            id: `${process.env.ANNOTATION_BASE_URI}${this.$route.params.uuid}`,
            body: {
              source: {
                id: `${process.env.ASSETS_BASE_PATH}${this.$route.params.uuid}.mp4`,
                type: 'video/mp4'
              },
              type: 'Video'
            }
          }
        }
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
        const metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(this.annotation.body.source.id)}`
        let result = await this.$axios.get(metadataURL, { headers })
        this.annotationMetadata = result.data
        if (this.annotation) {
          const responsesQuery = {
            'target.id': `${process.env.ANNOTATION_BASE_URI}${this.annotation.uuid}`,
            'body.purpose': 'commenting'
          }
          this.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
          console.debug('responses', this.responses)
        }
        // this.$q.loading.hide()
      },
      async uploadResponse (annotation) {
        this.$refs.uploadRemixModal.show({
          id: `${process.env.ANNOTATION_BASE_URI}${this.annotation.uuid}`,
          type: 'Annotation'
        })
        const message = {
          portrait: annotation.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      }
    }
  }
</script>
