<template lang="pug">
  q-page
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    // HEAD
    //
    h3.text-center
      | {{ $t('dates.date_1.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('dates.date_1.description') }}

    job-list

    // SHOW RESULTS
    //
    q-list.no-border(separator)
      q-item.q-pt-xl(v-for="item in portraits.items")
        q-item-main.text-center
          img.cursor-pointer.q-mt-sm.portrait-image(@click="openPreview(item)", :src="getPNG(item.portrait.body.source.id)")
          q-btn.full-width.q-my-md(
          v-if="item.portrait.author.id !== user.uuid"
          dark, color="primary", @click="uploadResponse(item.portrait)") {{ $t('buttons.upload_remix') }}
          q-btn.full-width.q-mt-sm(v-else, disabled, dark, color="primary") {{ $t('buttons.upload_remix') }}

          q-collapsible.full-width.no-padding.q-my-sm(
          v-if="item.responses.length > 0", :label="getResponseLabel(item.responses.length)")
            q-card(v-for="(response, i) in item.responses", inline, square)
              q-card-media.bg-dark.items-center.row.justify-center.text-left(overlay-position="bottom",
              style="width: 19vw; height: 19vw; margin: .5vw;", :class="{'moba-border' : response.author.id === user.uuid}")
                q-context-menu(v-if="response.author.id === user.uuid")
                  q-btn.full-width.bg-red(color="white", @click="deleteItem(response)", icon="delete", flat) {{ $t('buttons.delete') }}?
                img.card-image.no-margin(@click="openPreview(response)", :src="getPNG(response.body.source.id)")
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
          div.q-pa-md.text-grey-8(v-else) {{ $t('portrait.no_remix') }}
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
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
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadPortraits)
    },
    methods: {
      getResponseLabel (val) {
        let strng
        if (val === 1) strng = this.$t('portrait.remix_singular')
        else strng = this.$t('portrait.remix_plural')
        return val + ' ' + strng
      },
      getPNG (url) {
        return url.replace(/\.mp4$/, '-m.jpg')
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      openPreview (item) {
        const preview = item.portrait || item
        if (preview.body.source.type === 'video/mp4') this.$refs.videoModal.show(preview)
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
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          this.portraits.map = portraitsMapResult
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
          }
          const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
          const portraits = portraitsResult.items.sort(this.$sort.onCreatedDesc)
          const items = []
          for (let portrait of portraits) {
            const item = {
              portrait,
              responses: []
            }
            const responsesQuery = {
              'target.id': `${process.env.ANNOTATION_BASE_URI}${portrait.uuid}`,
              'body.purpose': 'commenting'
            }
            const responsesResult = await this.$store.dispatch('annotations/find', responsesQuery)
            item.responses = responsesResult.items.sort(this.$sort.onCreatedDesc)
            items.push(item)
          }
          this.portraits.items = items
        }
        this.$q.loading.hide()
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        console.log(item)
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
        try {
          await this.$store.dispatch('annotations/delete', item.uuid)
        }
        catch (e) { console.error('Failed to remove annotation', e.message) }
        const previewKeys = Object.keys(item.preview)
        for (let key of previewKeys) {
          try {
            await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.preview[key])}`, { headers })
          }
          catch (e) { console.error('Failed to remove preview', e.message) }
        }
        try {
          await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.body.source.id)}`, { headers })
        }
        catch (e) { console.error('Failed to remove video', e.message) }
        this.$q.loading.hide()
        await this.loadPortraits()
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadPortraits)
      await this.loadPortraits()
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
