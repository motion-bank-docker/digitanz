<template lang="pug">
  q-modal(v-model="showModal", maximized)
    q-window-resize-observable.text-center(@resize="onResize")
    q-modal-layout.relative-position.bg-red(dark, :content-class="{'bg-dark': true}")
      // .layout-padding(v-if="preview")
      // span(v-if="preview")
      //
        .bg-red {{ video.annotation.width }}
        .gr-green {{ video.annotation.height }}
      div.text-center(:style="{width: playerWidth + 'px'}")
        // video-player(v-if="video", :annotation="video.annotation", @ended="onEnded", :autoplay="true")
        // video-player(v-if="video", :annotation="video", @ended="onEnded", :autoplay="true")
        video-player(v-if="video", :annotation="src", @ended="onEnded", :autoplay="true")
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
        let videoX = this.preview.metadata.width
        let videoY = this.preview.metadata.height
        console.log(size.width, size.height)
        console.log(videoX, videoY)
        if (size.width > size.height) { // DEVICE LANDSCAPE
          this.playerWidth = size.height / (videoY / videoX)
          /*
          if (videoX > videoY) { // video querformat
            this.playerWidth = size.width
          }
          else if (videoX < videoY) { // video hochformat
            this.playerWidth = size.width / 2
          }
          */
        }
        else if (size.width < size.height) { // DEVICE PORTRAIT
          this.playerWidth = size.width
          /*
          if (videoX > videoY) { // video querformat
            this.playerWidth = size.width / 2
          }
          else if (videoX < videoY) { // video hochformat
            if (videoY > size.height) this.playerWidth = size.width
            else this.playerWidth = size.width
          }
          */
        }
      },
      show (preview) {
        // console.log(preview, '-----')
        if (preview.annotation !== undefined) this.src = preview.annotation
        else this.src = preview.portrait
        // console.log(this.src)
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
        src: '',
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
