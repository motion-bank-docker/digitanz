<template lang="pug">
  div.q-pt-md(style="overflow-x: scroll;")
    video-modal(ref="videoModal")
    // upload-remix-modal(ref="uploadRemixModal")
    // confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    .row.q-mx-md(style="width: auto;")
      // .bg-blue
        .bg-black.q-mb-sm(v-for="portrait in portraits.items")
          // backgroundImage: portrait.preview.small,
      // TODO: Use QTabs instead (temporary solution)
      div(style="overflow-y: scroll;")
        div(style="white-space: nowrap;")
          template(v-for="(portrait, i) in portraits.items")
            div.q-mr-md(
            :style="{backgroundImage: 'url(' + portrait.preview.small + ')', backgroundSize: 'cover', width: '4rem', height: '4rem', borderRadius: '100%', display: 'inline-block'}",
            @click="openPreview(portrait)"
            )
      // q-tabs(color="transparent")
        q-tab.q-px-none.q-pt-none.q-pb-md.q-mr-md(v-for="(portrait, i) in portraits.items", slot="title", color="black",
        underline-color="red")
          div(:style="{backgroundImage: 'url(' + portrait.preview.small + ')', backgroundSize: 'cover', width: '50px', height: '50px', borderRadius: '100%'}",
          @click="openPreview(portrait)"
          )
        video-list-view(
        v-if="portraits && portraits.items.length > 0",
        // :videos="portraits.items", layoutStyle="sm",
        // :buttons="['download']",
        // :hideButtons="true",
        // :roundImage="true",
        cardWidth="15%")

</template>

<script>
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  import VideoModal from '../VideoModal'
  import VideoListView from '../VideoListView'
  import VideoItem from '../VideoItem'
  // import ImageModal from '../ImageModal'
  // import UploadRemixModal from '../UploadRemixModal'
  // import JobList from '../JobList'
  // import ConfirmModal from '../ConfirmModal'

  export default {
    components: {
      VideoModal,
      // ImageModal,
      // UploadRemixModal,
      // JobList,
      // ConfirmModal,
      VideoListView,
      VideoItem
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
      console.log('+++++', this.portraits)
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.loadPortraits)
    },
    methods: {
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
          portrait: item.annotation.uuid,
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
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`,
            'body.type': 'Video'
          }
          const portraits = await VideoHelper.fetchVideoItems(this, portraitsQuery)
          for (let portrait of portraits) {
            const responsesQuery = {
              'target.id': `${process.env.ANNOTATION_BASE_URI}${portrait.annotation.uuid}`,
              'body.purpose': 'commenting'
            }
            portrait.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
            console.debug('portrait', portrait)
            items.push(portrait)
          }
          this.portraits.items = items
        }
        this.$q.loading.hide()
      }/* ,
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        await VideoHelper.deleteVideoItem(this, item)
        this.$q.loading.hide()
        await this.loadPortraits()
      } */
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
  /* .portrait-image
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
    border 1px solid $primary */
</style>
