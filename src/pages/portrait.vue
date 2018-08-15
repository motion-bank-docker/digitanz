<template lang="pug">
  q-page
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")

    // HEADLINE
    //
    h3.text-center
      | {{ $t('portrait.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('portrait.description') }}

    q-list.no-border(v-for="portrait in portraits.annotations")
      q-item.q-py-none
        q-item-main.text-center
          img.cursor-pointer(@click="openPreview(portrait)", :src="getPNG(portrait.body.source.id)", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'

  export default {
    components: {
      VideoModal,
      ImageModal
    },
    data () {
      return {
        showVideoModal: false,
        portraits: {
          map: undefined,
          annotations: []
        }
      }
    },
    methods: {
      getPNG (url) {
        return url.replace(/\.mp4$/, '.png')
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      openPreview (item) {
        this.preview = item
        if (item.body.source.type === 'video/mp4') this.showVideoModal = true
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
          this.portraits.annotations = portraitsResult.items
        }
        console.log(this.portraits)
      }
    },
    async mounted () {
      await this.loadPortraits()
    }
  }
</script>
