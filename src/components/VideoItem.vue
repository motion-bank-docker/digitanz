<template lang="pug">
  q-card(v-if="hasStandardStyle",
        :style="{'width':cardWidth}",
        :class="{'bg-dark': !roundImage, 'no-shadow': roundImage}").q-mb-lg
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")
    // card media
    q-card-media.no-padding(:class="{'round-image shadow-2': roundImage}")
      // show video preview
      video-modal(ref="videoModal")
      div.previewImage(v-if="isReady",
      ref="previewImage",
      :style="{ 'background-image': 'url(' + video.preview.medium + ')', 'height':previewHeight }",
      @click="openPreview(video)")
        span(v-if="showDuration").absolute-bottom-right.bg-body-background.text-white.q-ma-sm.q-pa-xs.round-borders.q-caption
          | {{ formatDuration(video.metadata.duration) }}
      // or show spinner
      div.item(v-else)
        q-inner-loading.bg-dark(:visible="true")
          q-spinner-mat(color="primary" size="3em")
      q-window-resize-observable(@resize="setPreviewHeight()")
    // card actions
    q-card-actions.row.justify-around(v-if="video.annotation",
    :class="{'q-py-none hidden' : hideButtons}")
      slot(name="customButtons" :video="video")
      slot(v-if="displayStartButton" name="starButton" :video="video")
        q-btn(round, flat, size="sm", icon="star", @click="starItem(video)")
      slot(v-if="displayDeleteButton" name="deleteButton" :video="video")
        q-btn(round, flat, size="sm", icon="delete", @click="openDeleteModal(video)")
      slot(v-if="displayDownloadButton" name="downloadButton" :video="video")
        q-btn(round, flat, size="sm", icon="cloud_download", @click="downloadItem(video)")
      slot(v-if="video.responses" name="responsesButton" :video="video")
        q-btn(round, flat, size="sm", icon="chat", @click="showResponses(video)")
          q-chip(floating, color="red") {{ video.responses.length }}
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
      buttons: Array,
      allowSelfResponse: Boolean,
      hideButtons: undefined,
      roundImage: true,
      showDuration: Boolean,
      layoutStyle: undefined,
      cardWidth: String
    },
    mounted () {
      this.setPreviewHeight()
    },
    methods: {
      downloadItem (video) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(video.annotation.body.source.id)}`)
      },
      getPreviewWidth () {
        return this.$refs.previewImage.offsetWidth + 'px'
      },
      setPreviewHeight () {
        if (this.isReady) {
          this.previewHeight = this.getPreviewWidth()
        }
      },
      openPreview (item) {
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item)
      },
      starItem (video) {
        console.log('high five to item: ' + video.annotation.uuid)
      },
      formatDuration (duration) {
        let minutes = Math.floor(duration / 60).toString()
        let seconds = (duration - minutes * 60).toString().split('.')[0]
        if (seconds.length < 2) seconds = '0' + seconds
        return minutes.toString() + ':' + seconds.toString()
      },
      showResponses (video) {
        // FIXME: this needs to be implemented propery!!!
        if (this.allowSelfResponse) this.$router.push(`/portraitplusplus/responses/${video.annotation.uuid}`)
        else this.$router.push(`/portrait/responses/${video.annotation.uuid}`)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        console.log('item should get deleted')
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
            await this.$store.dispatch('acl/remove', {uuid: portrait.uuid, role: 'public', permission: 'get'})
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
        if (!this.user || (this.video && this.video.annotation && this.user.uuid !== this.video.annotation.author.id)) return false
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('download') > -1)
        else return false
      },
      isReady () {
        if (typeof this.video.annotation !== 'undefined' && typeof this.video.preview !== 'undefined') {
          return true
        }
        else return false
      },
      hasStandardStyle () {
        if (this.layoutStyle === 'sm' || this.layoutStyle === 'singleCenter') {
          return true
        }
      },
      ...mapGetters({
        user: 'auth/getUserState'
      })
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~variables'
  .bg-body-background
    background-color $body-background
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
  .q-card-actions
    padding-left 0
    padding-right 0
  .round-image
    border-radius 100%
</style>
