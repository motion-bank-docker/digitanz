<template lang="pug">
  q-page
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")

    .row
      h3 Responsen

      q-btn.full-width.q-my-md(v-if="annotation && annotation.author.id !== user.uuid",
        dark, color="primary", @click="uploadResponse(item)") {{ $t('buttons.upload_remix') }}

    .row
      video-list-view(v-if="responses.length > 0", :videos="responses", layoutStyle="sm")
        template(slot="customButtons" slot-scope="{ video }")
          q-btn(flat, size="sm" round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="setAsPortrait(video)")
          q-btn(flat, size="sm" round, icon="cloud_download")
      template(v-else)
        | {{ $t('messages.no_videos') }}
</template>

<script>
  import VideoModal from '../components/VideoModal'
  import UploadRemixModal from '../components/UploadRemixModal'
  import VideoListView from '../components/VideoListView'
  import { VideoHelper } from '../lib'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      VideoModal,
      UploadRemixModal,
      VideoListView
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    data () {
      return {
        annotation: undefined,
        responses: []
      }
    },
    async mounted () {
      this.$q.loading.show({ message: this.$t('messages.loading_responses') })
      this.annotation = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
      if (this.annotation) {
        const responsesQuery = {
          'target.id': `${process.env.ANNOTATION_BASE_URI}${this.annotation.uuid}`,
          'body.purpose': 'commenting'
        }
        this.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
      }
      this.$q.loading.hide()
    },
    methods: {
      async uploadResponse (item) {
        this.$refs.uploadRemixModal.show(item)
        const message = {
          portrait: item.annotation.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      }
    }
  }
</script>
