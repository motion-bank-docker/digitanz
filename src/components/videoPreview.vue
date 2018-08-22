<template lang="pug">
  div
    video-modal(ref="videoModal")
    div.previewImage(v-if="video.annotation.uuid" ref="previewImage" :style="{ 'background-image': 'url(' + video.preview.medium + ')', 'height':previewHeight }", @click="openPreview(video.annotation)")
    div.item(v-else)
      q-inner-loading(:visible="true")
        q-spinner-mat(color="primary" size="3em")
    q-window-resize-observable(@resize="setPreviewHeight()")
</template>

<script>
  import VideoModal from '../components/VideoModal'

  export default {
    components: {
      VideoModal
    },
    data () {
      return {
        foo: undefined,
        previewHeight: undefined
      }
    },
    props: {
      title: undefined,
      uuid: undefined,
      jobId: undefined,
      video: undefined
    },
    mounted () {
      this.setPreviewHeight()
    },
    methods: {
      getPreviewWidth () {
        return this.$refs.previewImage.offsetWidth + 'px'
      },
      setPreviewHeight () {
        this.previewHeight = this.getPreviewWidth()
      },
      openPreview (preview) {
        if (preview.body.source.type === 'video/mp4') this.$refs.videoModal.show(preview)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  /* for dev purpose */
  .item
    width 100%
  div.item
    height 150px
    position relative
  .q-inner-loading
      background-color: transparent !important;
  .previewImage
    width: 100%
    height: 200px
    background-position: center
    background-repeat: no-repeat
    background-size: cover
</style>
