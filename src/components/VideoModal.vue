<template lang="pug">
  q-modal(v-model="showModal", maximized)
    q-window-resize-observable(@resize="onResize")
    q-modal-layout.relative-position(dark, :content-class="{'bg-dark': true}")
      // .layout-padding(v-if="preview")
      // span(v-if="preview")
      .bg-red {{ video.annotation.width }}
      .gr-green {{ video.annotation.height }}
      div(:style="{width: playerWidth + 'px'}")
        video-player(v-if="video", :annotation="video.annotation", @ended="onEnded", :autoplay="true")
      // q-btn.full-width.bg-dark.q-pa-lg(slot="footer", @click="closePreview", label="Close", flat, style="border-radius: 0;")
      .full-width.q-pa-md.absolute-top.text-right
        q-btn.bg-dark(@click="closePreview", icon="clear", flat, round)
      //
        q-toolbar.bg-dark(slot="footer", dark)
          .col-12.layout-padding
            q-btn.full-width.bg-dark(@click="closePreview", label="Close", flat)
</template>

<script>
  import { VideoPlayer } from 'mbjs-quasar/src/components'

  export default {
    components: {
      VideoPlayer
    },
    props: ['source', 'dimensions'],
    methods: {
      onResize (size) {
        // alert(this.dimensions.width)
        console.log(this.video.metadata.width, this.video.metadata.height)
        let videoX = this.video.metadata.width
        let videoY = this.video.metadata.height
        if (size.width > size.height) { // DEVICE LANDSCAPE
          if (videoX > videoY) { // video quer
            this.playerWidth = size.width
          }
          else if (videoX < videoY) { // video hoch
            let ratio = videoY / size.height
            // alert(ratio)
            this.playerWidth = size.width / ratio
          }
        }
        else if (size.width < size.height) { // DEVICE PORTRAIT
          if (videoX > videoY) { // video quer
            this.playerWidth = size.width
          }
          else if (videoX < videoY) { // video hoch
            // let ratio = videoY / size.height
            this.playerWidth = size.width
          }
        }
      },
      show (preview) {
        this.preview = preview
        this.showModal = true
      },
      closePreview () {
        this.showModal = false
        this.preview = undefined
      },
      onEnded () {
        if (Array.isArray(this.preview)) {
          this.index++
          if (this.index >= this.preview.length) this.index = 0
          this.video = this.preview[this.index]
        }
      }
    },
    data () {
      return {
        playerWidth: '',
        index: -1,
        video: undefined,
        showModal: false,
        preview: undefined
      }
    },
    watch: {
      preview () {
        if (Array.isArray(this.preview) && this.preview.length) {
          this.index = 0
          this.video = this.preview[this.index]
        }
        else if (this.preview) {
          this.video = this.preview
        }
      }
    }
  }
</script>
