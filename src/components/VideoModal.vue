<template lang="pug">
  q-modal(v-model="showVideoModal")
    q-modal-layout(dark, :content-class="{'bg-dark': true}")
      .layout-padding(v-if="preview")
        video-player(v-if="video", :src="video.source", @ended="onEnded")
      q-toolbar.bg-dark(slot="footer", dark)
        .col-12.layout-padding
          q-btn.on-right.float-right(color="primary", @click="closePreview", label="Close")
</template>

<script>
import { VideoPlayer } from 'mbjs-quasar/src/components'

export default {
  components: {
    VideoPlayer
  },
  props: ['show', 'preview', 'source'],
  methods: {
    closePreview () {
      this.$emit('canceled')
    },
    onEnded () {
      if (Array.isArray(this.preview)) {
        this.index++
        if (this.index >= this.preview.length) this.index = 0
        this.video = { source: { type: 'video/mp4', id: this.preview[this.index].source.source } }
      }
    }
  },
  data () {
    return {
      index: -1,
      video: undefined
    }
  },
  watch: {
    preview () {
      if (Array.isArray(this.preview) && this.preview.length) {
        this.index = 0
        this.video = { source: { type: 'video/mp4', id: this.preview[this.index].source.source } }
      }
      else if (this.preview) {
        this.video = this.preview
      }
    }
  },
  computed: {
    showModal () {
      return (this.show === true)
    }
  }
}
</script>
