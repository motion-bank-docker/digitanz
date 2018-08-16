<template lang="pug">
  q-page
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    h4.q-mx-none.text-center {{ $t('upload.title') }}
    file-uploader.full-width.self-center(:query="query")
    .row.q-mt-xl(v-if="map")
      job-list
      .col-12.q-px-md
        // h4.text-center {{ map.title }}
        h4.text-center {{ $t('upload.my_videos') }}
        q-list.no-border.q-pb-md
          q-item.no-padding.q-mt-md.text-center(v-for="item in videos", :key="item.uuid")
            //
              p {{ item.metadata.title }}
              p {{ item.metadata.width }}x{{ item.metadata.height }}
              p {{ item.annotation.body.source.id }}
            q-item-main.text-center
              q-item-tile
                img(:src="item.preview.medium", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")
              q-item-tile
                // q-btn(flat, round, icon="edit")
                q-btn(flat, round, icon="delete", @click="openDeleteModal(item)")
                q-btn(flat, round, icon="cloud_download", @click="download(item.annotation.body.source.id)")
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import JobList from '../components/JobList'
  import { mapGetters } from 'vuex'
  import FileUploader from '../components/FileUploader'
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      FileUploader,
      ConfirmModal,
      JobList
    },
    async mounted () {
      this.$root.$on('updateVideos', this.fetchVideos)
      if (this.user) await this.fetchVideos()
    },
    beforeDestroy () {
      this.$root.$off('updateVideos', this.fetchVideos)
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
            'body.source.type': 'video/mp4'
            // FIXME: portraits map id is undefined
            // 'target.id': { $ne: `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}` }
          }
          results = await this.$store.dispatch('annotations/find', query)
          const items = results.items.sort(this.$sort.onCreatedDesc)
          const videos = []
          for (let annotation of items) {
            let metadata = {}
            try {
              metadata = await this.$store.dispatch('metadata/get', annotation.uuid)
            }
            catch (e) { console.error(`Failed to fetch metadata: ${e.message}`) }
            const preview = {
              high: annotation.body.source.id.replace(/\.mp4$/, '.jpg'),
              medium: annotation.body.source.id.replace(/\.mp4$/, '-m.jpg'),
              small: annotation.body.source.id.replace(/\.mp4$/, '-s.jpg')
            }
            console.debug('fetched metadata', metadata)
            videos.push({ annotation, metadata, preview })
          }
          this.videos = videos
        }
        this.$q.loading.hide()
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
        try {
          await this.$store.dispatch('annotations/delete', item.annotation.uuid)
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
          await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.annotation.body.source.id)}`, { headers })
        }
        catch (e) { console.error('Failed to remove video', e.message) }
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
