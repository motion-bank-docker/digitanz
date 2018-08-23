<template lang="pug">
  q-card.q-mb-lg.bg-dark(style="width: 46%")
    // card media
    q-card-media.no-padding
      // show video preview
      video-modal(ref="videoModal")
      div.previewImage(v-if="video.annotation.uuid" ref="previewImage" :style="{ 'background-image': 'url(' + video.preview.medium + ')', 'height':previewHeight }", @click="openPreview(video)")
      // or show spinner
      div.item(v-else)
        q-inner-loading.bg-dark(:visible="true")
          q-spinner-mat(color="primary" size="3em")
      q-window-resize-observable(@resize="setPreviewHeight()")
    // card actions
    q-card-actions(v-if="video.annotation.uuid")
      slot(v-if="displayStartButton" name="starButton" :video="video")
        q-btn(round, flat, size="sm" color="white", icon="star", @click="starItem(video)")
      slot(v-if="displayDeleteButton" name="deleteButton" :video="video")
        q-btn(round, flat, size="sm" color="white", icon="delete", @click="deleteItem(video)")
      slot(v-if="displayDownloadButton" name="downloadButton" :video="video")
        q-btn(round, flat, size="sm" color="white", icon="cloud_download", @click="downloadItem(video)")
      slot(name="customButtons" :video="video")
</template>

<script>
  import VideoModal from '../components/VideoModal'
  import path from 'path'
  import { openURL } from 'quasar'

  export default {
    components: {
      VideoModal
    },
    data () {
      return {
        previewHeight: undefined
      }
    },
    props: {
      uuid: undefined,
      jobId: undefined,
      video: undefined,
      buttons: Array
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
      openPreview (item) {
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item)
      },
      deleteItem (video) {
        console.log('delete video: ' + video.annotation.uuid)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      starItem (video) {
        console.log('high five to item: ' + video.annotation.uuid)
      },
      downloadItem (video) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(video.annotation.body.source.id)}`)
      }
    },
    computed: {
      displayDeleteButton () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('delete') > -1)
        else return false
      },
      displayStartButton () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('star') > -1)
        else return false
      },
      displayDownloadButton () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('download') > -1)
        else return false
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
  .previewImage
    width: 100%
    height: 200px
    background-position: center
    background-repeat: no-repeat
    background-size: cover
</style>
