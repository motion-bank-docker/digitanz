<template lang="pug">
  q-card.relative-position(v-if="hasStandardStyle",
        :style="{'width':cardWidth}",
        :class="{'bg-dark': !roundImage, 'no-shadow': roundImage}").q-mb-lg.relative-position
    span.my-flag(v-if="showOwnContentFlag && isOwnContent")
      q-icon(name="how_to_reg")
    confirm-modal(v-if="isSequence" ref="confirmDeleteModal", @confirm="deleteSequence")
    confirm-modal(v-else ref="confirmDeleteModal", @confirm="deleteItem")
    // card media
    q-card-media.no-padding(:class="{'round-image shadow-2': roundImage}")
      <!--div.more-btn-->
        <!--q-btn.q-px-none(flat size="md" round icon="settings" @click="showActionButton = !showActionButton")-->
      <!--q-slide-transition-->
        <!--div.action-buttons.row.justify-around(v-if="displayMoreButton && showActionButton")-->
          <!--slot(name="customMoreButtons" :video="video")-->
          <!--q-btn(round, flat, size="sm", icon="group", v-close-overlay, @click="toggleVisibility(video)")-->
          <!--q-btn(round, flat, size="sm", icon="cloud_download", v-close-overlay, @click="downloadItem(video)")-->
          <!--q-btn(round, flat, size="sm", icon="delete", v-close-overlay, @click="openDeleteModal(video)")-->

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
          q-chip(v-if="video.responses.length > 0", floating, color="red") {{ video.responses.length }}
      slot(v-if="displayMoreButton" name="moreButton" :video="video")
        q-btn.q-px-none(flat, size="sm" round, icon="more_horiz" @click="showActionButton = !showActionButton")
          q-popover.bg-dark(:offset="[10, 0]")
            q-list
              slot(name="customMoreButtons" :video="video")
              q-item(v-if="displayMoreVisibility").q-px-sm
                q-btn(round, flat, size="sm", icon="group", v-close-overlay, @click="toggleVisibility(video)")
              q-item(v-if="displayMoreDownload").q-px-sm
                q-btn(round, flat, size="sm", icon="cloud_download", v-close-overlay, @click="downloadItem(video)")
              q-item(v-if="displayMoreDelete").q-px-sm
                q-btn(round, flat, size="sm", icon="delete", v-close-overlay, @click="openDeleteModal(video)")
</template>

<script>
  import VideoModal from '../components/VideoModal'
  import ConfirmModal from '../components/ConfirmModal'
  import path from 'path'
  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import { SequenceHelper, VideoHelper } from '../lib/video-helper'

  export default {
    components: {
      VideoModal,
      ConfirmModal
    },
    data () {
      return {
        previewHeight: undefined,
        showing: false,
        showActionButton: false
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
      layoutStyle: {
        type: String,
        default: 'sm'
      },
      showOwnContentFlag: Boolean,
      cardWidth: String,
      isSequence: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.setPreviewHeight()
    },
    methods: {
      setShowing () {
        this.showing = !this.showing
        console.log(this.showing)
      },
      downloadItem (video) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(video.annotation.body.source.id)}`)
      },
      getPreviewWidth () {
        if (typeof this.$refs.previewImage !== 'undefined') {
          return this.$refs.previewImage.offsetWidth + 'px'
        }
        // means width = 0px
        else return 0
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
      async deleteSequence (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        await SequenceHelper.deleteSequence(this, item.map.uuid)
        this.$q.loading.hide()
        this.$emit('changed')
      },
      async toggleVisibility (item) {
        // to be done
        console.log('toggled private/public', item)
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
      isOwnContent () {
        return (this.video.annotation.author.id === this.user.uuid)
      },
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
      displayMoreButton () {
        if (typeof this.buttons !== 'undefined') {
          for (let btn of this.buttons) {
            if (btn.includes('more')) {
              return true
            }
          }
          return false
        }
        else return false
      },
      displayMoreVisibility () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-visibility') > -1)
        else return false
      },
      displayMoreDelete () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-delete') > -1)
        else return false
      },
      displayMoreDownload () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-download') > -1)
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
        else {
          console.log('no style')
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
  .my-flag
    z-index 1000
    position absolute
    top 0
    right 0
    width: 1.5em
    height: 1.5em
    // margin-top -3px
    // margin-right -5px
    // background-color $secondary
    background-color rgba(0,0,0,.4)
    // border 1px solid white
    color white
    /*padding 2px*/
    margin 5px
    border-radius 50%
    display: flex
    align-items center
    justify-content center
  .superduba
    position absolute
    top 0
    bottom 0
    left 0
    right 0
  .more-btn
    position absolute
    top 0
    right 0
    color $grey-9
  .action-buttons
    z-index 9000
    background-color $grey-10
    position absolute
    bottom 0
    left 0
    right 0
</style>
