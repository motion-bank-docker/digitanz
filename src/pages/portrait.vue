<template lang="pug">
  q-page
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    // HEAD
    //
    h3.text-center
      | {{ $t('pages.portrait.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('pages.portrait.description') }}

    job-list

    // SHOW RESULTS
    //
    q-list.no-border(separator)
      // q-item {{ portraits }}
      q-item.q-pt-xl(v-for="item in portraits.items")
        q-item-main.text-center
          //
            .bg-red {{ item.portrait }}
            .bg-red {{ item.responses[0] }}
          img.cursor-pointer.q-mt-sm.portrait-image(@click="openPreview(item)", :src="item.preview.medium")
          q-btn.full-width.q-my-md(
          v-if="item.annotation.author.id !== user.uuid"
          dark, color="primary", @click="uploadResponse(item.annotation)") {{ $t('buttons.upload_remix') }}
          // q-btn.full-width.q-mt-sm(v-else, disabled, dark, color="primary") {{ $t('buttons.upload_remix') }}

          q-collapsible.full-width.no-padding.q-my-sm(
          v-if="item.responses.length > 0", :label="getResponseLabel(item.responses.length)")
            // q-card(v-for="(responseItem, i) in item.responses", inline, square, :class="{'moba-border' : responseItem.response.author.id === user.uuid}")
            q-card(v-for="(responseItem, i) in item.responses", inline, square)
              q-card-media.bg-dark.items-center.row.justify-center.text-left(overlay-position="bottom",
              style="width: 19vw; height: 19vw; margin: .5vw;")
                //
                  q-context-menu(v-if="responseItem.response.author.id === user.uuid")
                    q-btn.full-width.bg-red(color="white", @click="deleteItem(responseItem.response)", icon="delete", flat) {{ $t('buttons.delete') }}?
                // img.card-image.no-margin(@click="openPreview(responseItem.response)", :src="getPNG(responseItem.response.body.source.id)")
                img.card-image.no-margin(@click="openPreview(responseItem)", :src="responseItem.preview.medium")
              q-btn.q-py-md(v-if="responseItem.annotation.author.id === user.uuid", color="white", @click="deleteItem(responseItem)", icon="delete", flat)
              // div bhjbxsa
                //
                  q-btn.absolute-top-right(
                  color="primary",
                  @click="deleteItem(response)", v-if="response.author.id === user.uuid", icon="delete", flat
                  )
              // q-card-actions.no-padding.no-margin
                .text-center.full-width
                  q-btn(@click="openDeleteModal(response)", v-if="response.author.id === user.uuid", icon="delete", flat)
            //
              q-list.no-border
                q-item.no-padding(v-for="(response, i) in item.responses")
                  q-item-side.relative-position(style="width: 30vw;")
                    img.response-image(@click="openPreview(response)", :src="getPNG(response.body.source.id)")
                  q-item-main
                    | vdshcsdkj
                  q-item-side
                    q-btn.q-my-sm(@click="deleteItem(response)", v-if="response.author.id === user.uuid", icon="delete")

            //
              div.full-width.q-mb-lg(style="white-space: nowrap; overflow-x: scroll;")
                img.q-mr-xl(v-for="(response, i) in item.responses", @click="openPreview(response)",
                // :src="getPNG(response.body.source.id)", style="height: 20vh;")

            //
              div(v-for="response in item.responses")
                img.portrait-image.q-mt-md(@click="openPreview(response)", :src="getPNG(response.body.source.id)")
                .full-width.text-center
                  q-btn.q-my-sm(@click="deleteItem(response)", v-if="response.author.id === user.uuid", icon="delete")
          div.q-pa-md.text-grey-8(v-else) {{ $t('pages.portrait.no_remix') }}
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../lib'
  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import UploadRemixModal from '../components/UploadRemixModal'
  import JobList from '../components/JobList'
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      VideoModal,
      ImageModal,
      UploadRemixModal,
      JobList,
      ConfirmModal
    },
    data () {
      return {
        portraits: {
          map: undefined,
          items: []
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadPortraits)
      await this.loadPortraits()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadPortraits)
    },
    methods: {
      getResponseLabel (val) {
        let strng
        if (val === 1) strng = this.$t('pages.portrait.remix_singular')
        else strng = this.$t('pages.portrait.remix_plural')
        return val + ' ' + strng
      },
      getPNG (url) {
        return url.replace(/\.mp4$/, '-m.jpg')
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      openPreview (item) {
        // const preview = item.portrait || item
        const preview = item
        // console.log(item.response.body.source.type)
        this.$refs.videoModal.show(preview)
        // if (preview.portrait.body.source.type === 'video/mp4') this.$refs.videoModal.show(preview)
      },
      async uploadResponse (item) {
        this.$refs.uploadRemixModal.show(item)
        const message = {
          portrait: item.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
        this.$q.loading.show({ message: this.$t('messages.loading_portraits') })
        const items = []
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          this.portraits.map = portraitsMapResult
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
          }
          const portraits = await VideoHelper.fetchVideoItems(this, portraitsQuery)
          for (let portrait of portraits) {
            const responsesQuery = {
              'target.id': `${process.env.ANNOTATION_BASE_URI}${portrait.uuid}`,
              'body.purpose': 'commenting'
            }
            portrait.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
            items.push(portrait)
          }
          this.portraits.items = items
        }
        this.$q.loading.hide()
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        await VideoHelper.deleteVideoItem(this, item)
        this.$q.loading.hide()
        await this.loadPortraits()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
  .portrait-image
    height auto
    max-height 50vh
    width auto
    max-width 100%
  .response-image
    height auto
    max-height 15vh
    width auto
    max-width 30vw
  .card-image
    height auto
    max-height 19vw
    width auto
    max-width 100%
  .moba-border
    border 1px solid $primary
</style>
