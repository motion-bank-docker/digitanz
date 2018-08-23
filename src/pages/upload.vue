<template lang="pug">
  q-page
    video-modal(ref="videoModal")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    h4.q-mx-none.text-center {{ $t('upload.title') }}
    file-uploader.full-width.self-center(:query="query")
    .row.q-mt-xl(v-if="map")
      job-list
      .col-12.q-px-md
        // h4.text-center {{ map.title }}
        h4.text-center {{ $t('upload.my_videos') }}
        //
        // Meine Videos Liste
        video-list-view(:videos="videos", layoutStyle="sm")
          template(slot="customButtons" slot-scope="{ video }")
            q-btn(flat, size="sm" round, icon="delete", @click="openDeleteModal(video)")
            q-btn(flat, size="sm" round, icon="cloud_download", @click="download(video.annotation.body.source.id)")
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import { VideoHelper } from '../lib'
  import JobList from '../components/JobList'
  import { mapGetters } from 'vuex'
  import FileUploader from '../components/FileUploader'
  import ConfirmModal from '../components/ConfirmModal'
  import VideoModal from '../components/VideoModal'
  import VideoListView from '../components/VideoListView'

  export default {
    components: {
      FileUploader,
      ConfirmModal,
      VideoModal,
      JobList,
      VideoListView
    },
    async mounted () {
      this.$root.$on('updateVideos', this.fetchVideos)
      this.$root.$on('updateSequences', this.fetchVideos)
      if (this.user) await this.fetchVideos()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.fetchVideos)
      this.$root.$off('updateSequences', this.fetchVideos)
    },
    data () {
      return {
        map: undefined,
        query: {
          'title': 'Meine Videos'
        },
        videos: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      openPreview (preview) {
        if (preview.body.source.type === 'video/mp4') this.$refs.videoModal.show(preview)
      },
      async fetchVideos () {
        this.$q.loading.show({ message: this.$t('messages.loading_videos') })
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items && results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'author.id': this.user.uuid,
            'body.type': 'Video',
            'body.source.type': 'video/mp4',
            'target.id': { $ne: `${process.env.TIMELINE_BASE_URI}${process.env.PORTRAITS_TIMELINE_UUID}` }
          }
          this.videos = await VideoHelper.fetchVideoItems(this, query)
        }
        this.$q.loading.hide()
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
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
        await this.fetchVideos()
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      }
    },
    watch: {
      async user (val) {
        if (val) await this.fetchVideos()
      }
    }
  }
</script>

<style>
  .bgsuper {
    width: 100%;
    height: 200px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
