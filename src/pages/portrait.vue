<template lang="pug">
  q-page
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")
    upload-remix-modal(ref="uploadRemixModal")

    // HEAD
    //
    h3.text-center
      | {{ $t('portrait.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('portrait.description') }}

    job-list

    // SHOW RESULTS
    //
    q-list.no-border(separator)
      q-item.q-py-none.q-pt-md(v-for="item in portraits.items")
        q-item-main.text-center
          img.cursor-pointer.q-mt-sm.portrait-image(@click="openPreview(item)", :src="getPNG(item.portrait.body.source.id)")
          q-btn.full-width.q-mt-sm(
          v-if="item.portrait.author.id != user"
          dark, color="primary", @click="uploadResponse(item.portrait)") {{ $t('buttons.upload_remix') }}
          q-btn.full-width.q-mt-sm(
          v-else, disabled,
          dark, color="primary", @click="uploadResponse(item.portrait)") {{ $t('buttons.upload_remix') }}
          q-collapsible.full-width.no-padding.q-my-sm(v-if="item.responses.length > 0", :label="getResponseLabel(item.responses.length)")
            img.portrait-image.q-mt-md(v-for="response in item.responses", @click="openPreview(response)", :src="getPNG(response.body.source.id)")
          div.q-pa-md.text-grey-8(v-else) {{ $t('portrait.no_remix') }}
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import UploadRemixModal from '../components/UploadRemixModal'
  import JobList from '../components/JobList'

  export default {
    components: {
      VideoModal,
      ImageModal,
      UploadRemixModal,
      JobList
    },
    data () {
      return {
        user: this.$store.state.auth.user.uuid,
        showVideoModal: false,
        preview: undefined,
        portraits: {
          map: undefined,
          items: []
        }
      }
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadPortraits)
    },
    methods: {
      getResponseLabel (val) {
        let strng
        if (val === 1) strng = this.$t('portrait.remix_singular')
        else strng = this.$t('portrait.remix_plural')
        return val + ' ' + strng
      },
      getPNG (url) {
        return url.replace(/\.mp4$/, '.png')
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      openPreview (item) {
        if (item.portrait) this.preview = item.portrait
        else this.preview = item
        if (this.preview.body.source.type === 'video/mp4') this.showVideoModal = true
      },
      uploadResponse (item) {
        this.$refs.uploadRemixModal.show(item)
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
        this.$q.loading.show({ message: this.$t('messages.loading_portraits') })
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          this.portraits.map = portraitsMapResult
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
          }
          const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
          const items = []
          for (let portrait of portraitsResult.items) {
            const item = {
              portrait,
              responses: []
            }
            const responsesQuery = {
              'target.id': `${process.env.ANNOTATION_BASE_URI}${portrait.uuid}`,
              'body.purpose': 'commenting'
            }
            const responsesResult = await this.$store.dispatch('annotations/find', responsesQuery)
            item.responses = responsesResult.items
            items.push(item)
          }
          this.portraits.items = items
        }
        this.$q.loading.hide()
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadPortraits)
      await this.loadPortraits()
    }
  }
</script>

<style scoped lang="stylus">
  .portrait-image
    height auto
    max-height 50vh
    width auto
    max-width 100%
</style>
