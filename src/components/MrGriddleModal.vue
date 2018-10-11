<template lang="pug">
  q-modal.bg-dark(v-model="showModal", maximized)
    q-modal-layout(dark, :content-class="{'bg-dark': true}")
      | empty
      | -------
      | {{ modalContent }}
      | -------
    q-btn.bg-dark.fixed-top-right.q-ma-md.shadow-4(@click="closePreview", icon="clear", flat, round, size="sm")
    //
      q-window-resize-observable(@resize="onResize")
      q-modal-layout(dark, :content-class="{'bg-dark': true}")
        div(v-if="preview", :style="{width: playerWidth + 'px', marginLeft: distance.left + 'px', marginTop: distance.top + 'px'}")
          video-player(v-if="video", :annotation="src", @ended="onEnded", :autoplay="true")
      q-btn.bg-dark.fixed-top-right.q-ma-md(@click="closePreview", icon="clear", flat, round, size="sm")
</template>

<script>
  // import { VideoPlayer } from 'mbjs-quasar/src/components'

  export default {
    components: {
      // VideoPlayer
    },
    props: [],
    // props: ['source', 'dimensions'],
    methods: {
      /* openModal () {
        console.log('bla')
        this.$refs.mrGriddleModal.show()
      }, */
      onResize (size) {
        if (this.preview !== undefined) {
          this.device.width = size.width
          this.device.height = size.height
          let videoX = this.preview.metadata.width
          let videoY = this.preview.metadata.height
          if (this.device.width > this.device.height) { // DEVICE LANDSCAPE
            if (videoX < videoY) {
              this.playerWidth = this.device.height / (videoY / videoX)
              // this.playerHeight = this.playerWidth * (videoY / videoX)
            } // video hochformat
            if (videoX > videoY) this.playerWidth = this.device.width // video querformat
          }
          else if (size.width < size.height) { // DEVICE PORTRAIT
            if (videoX < videoY) this.playerWidth = this.device.width // video hochformat
            if (videoX > videoY) this.playerWidth = this.device.width // video querformat
            this.playerHeight = this.device.height * (videoY / videoX)
          }
          this.distance.left = (this.device.width - this.playerWidth) / 2
          // this.distance.top = (size.width - this.playerHeight) / 2
        }
      },
      show (val) {
        this.showModal = true
        this.modalContent = val
        console.log(val)
        // console.log(preview, '-----')
        /* if (preview.annotation !== undefined) this.src = preview.annotation
        else if (preview.portrait !== undefined) this.src = preview.portrait
        else this.src = preview.response
        // console.log(this.src)
        this.preview = preview
        this.showModal = true */
      },
      closePreview () {
        this.showModal = false
        // this.preview = undefined
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
        device: {
          width: '',
          height: ''
        },
        distance: {
          left: '',
          top: ''
        },
        modalContent: undefined,
        src: '',
        playerWidth: '',
        playerHeight: '',
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
