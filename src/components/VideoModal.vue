<template lang="pug">
  q-modal(v-model="showModal")
    q-modal-layout.relative-position(dark, :content-class="{'bg-dark': true}")
      // .layout-padding(v-if="preview")
      span(v-if="preview")
        video-player(v-if="video", :annotation="video", @ended="onEnded", :autoplay="true")
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
    props: ['source'],
    methods: {
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
