<template lang="pug">
  q-card.q-mb-lg.bg-dark(style="width: 46%")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")
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
        q-btn(round, flat, size="sm" color="white", icon="delete", @click="openDeleteModal(video)")
      slot(v-if="displayDownloadButton" name="downloadButton" :video="video")
        q-btn(round, flat, size="sm" color="white", icon="cloud_download", @click="downloadItem(video)")
      slot(name="customButtons" :video="video")
</template>

<script>
  import VideoModal from '../components/VideoModal'
  import ConfirmModal from '../components/ConfirmModal'
  import path from 'path'
  import { openURL } from 'quasar'

  import { mapGetters } from 'vuex'

  import { VideoHelper } from '../lib'

  export default {
    components: {
      VideoModal,
      ConfirmModal
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
      starItem (video) {
        console.log('high five to item: ' + video.annotation.uuid)
      },
      downloadItem (video) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(video.annotation.body.source.id)}`)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        // remove portrait annotation (if any)
        const query = {
          'target.id': `${process.env.TIMELINE_BASE_URI}${process.env.PORTRAITS_TIMELINE_UUID}`,
          'author.id': this.user.uuid,
          'body.source.id': item.annotation.body.source.id
        }
        let result = await this.$store.dispatch('annotations/find', query)
        if (result.items) {
          for (const portrait of result.items) {
            await this.$store.dispatch('annotations/delete', portrait.uuid)
            await this.$store.dispatch('acl/remove', {uuid: result.uuid, role: 'public', permission: 'get'})
          }
          const message = {
            video: item.annotation.body.source.id,
            user: this.user.uuid
          }
          await this.$store.dispatch('logging/log', { action: 'portrait_unset', message })
        }
        // remove item / annotation
        await VideoHelper.deleteVideoItem(this, item)
        this.$q.loading.hide()
        // await this.fetchVideos()
        this.$emit('changed')
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
      },
      ...mapGetters({
        user: 'auth/getUserState'
      })
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
