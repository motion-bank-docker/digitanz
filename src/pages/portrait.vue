<template lang="pug">
  q-page
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")
    upload-remix-modal(ref="uploadRemixModal")

    // HEADLINE
    //
    h3.text-center
      | {{ $t('portrait.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('portrait.description') }}

    job-list

    q-list.no-border(v-for="item in portraits.items")
      q-item.q-py-none
        q-item-main.text-center
          img.cursor-pointer.portrait-image(@click="openPreview(item.portrait)", :src="getPNG(item.portrait.body.source.id)")
          q-btn.cursor-pointer(dark, color="primary", @click="uploadResponse(item.portrait)") {{ $t('buttons.upload_remix') }}
          q-list.no-border
            q-item {{ item.responses.length }}
            q-item.no-padding(v-for="response in item.responses")
              q-item-main
                q-item-tile {{ response }}
                q-item-tile {{ response.body.source.id }}
                q-item-tile
                  img(:src="getPNG(response.body.source.id)", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")
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
      getPNG (url) {
        return url.replace(/\.mp4$/, '.png')
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      openPreview (item) {
        this.preview = item.portrait
        if (item.portrait.body.source.type === 'video/mp4') this.showVideoModal = true
      },
      uploadResponse (item) {
        this.$refs.uploadRemixModal.show(item)
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
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
        console.log(this.portraits)
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
