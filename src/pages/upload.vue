<template lang="pug">
  q-page
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    h4.q-mx-none.text-center {{ $t('upload.title') }}
    file-uploader.full-width.self-center(v-if="!jobIds.length", :query="query")
    .row.q-mt-xl(v-if="map")
      .col-12(v-if="jobIds.length")
        div.text-center
          q-spinner(size="40px")
          | {{ $t('upload.loading_up') }}
        //
          ul
            li(v-for="jobId in jobIds", :key="jobId") {{ $store.state.conversions.jobDetails[jobId].title }}
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
                img(:src="item.preview", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")
              q-item-tile
                q-btn(flat, round, icon="edit")
                q-btn(flat, round, icon="delete", @click="openDeleteModal(item)")
                q-btn(flat, round, icon="cloud_download", @click="download(item.annotation.body.source.id)")
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import FileUploader from '../components/FileUploader'
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      FileUploader,
      ConfirmModal
    },
    mounted () {
      this.$root.$on('updateVideos', this.fetchVideos)
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
        user: 'auth/getUserState',
        jobIds: 'conversions/getJobIds'
      })
    },
    methods: {
      async fetchVideos () {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`
          }
          results = await this.$store.dispatch('annotations/find', query)
          const videos = []
          for (let annotation of results.items) {
            const metadata = await this.$store.dispatch('metadata/get', annotation.uuid)
            const preview = annotation.body.source.id.replace(/mp4$/, 'png')
            console.debug('fetched metadata', metadata)
            videos.push({ annotation, metadata, preview })
          }
          this.videos = videos
        }
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
      },
      async deleteItem (item) {
        console.log(item)
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
        try {
          await this.$store.dispatch('annotations/delete', item.annotation.uuid)
        }
        catch (e) { console.error('Failed to remove annotation', e.message) }
        try {
          await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.preview)}`, {headers})
        }
        catch (e) { console.error('Failed to remove preview', e.message) }
        try {
          await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.annotation.body.source.id)}`, { headers })
        }
        catch (e) { console.error('Failed to remove video', e.message) }
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
