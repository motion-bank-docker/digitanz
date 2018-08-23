<template lang="pug">
  q-page
    video-modal(ref="videoModal")
    <!--upload-remix-modal(ref="uploadRemixModal")-->
    <!--confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")-->

    // HEAD
    //
    h3.text-center
      | {{ $t('pages.portraitplusplus.title') }}
    .q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('pages.portraitplusplus.description') }}

    //job-list

    // SHOW RESULTS
    //
    .row.q-ma-md
      video-list-view(
        v-if="favouriteSequences && favouriteSequences.length > 0",
        :videos="favouriteSequences", layoutStyle="sm")
          template(slot="customButtons" slot-scope="{ video }")
            q-btn(flat, size="sm" round, icon="delete")
            q-btn(flat, size="sm" round, icon="cloud_download")

    <!--q-list.no-border(separator)-->
      <!--q-item.q-pt-xl(v-for="item in favouriteSequences")-->
        <!--q-item-main.text-center-->
          <!--img.cursor-pointer.q-mt-sm.portrait-image(-->
            <!--@click="openPreview(item)",-->
            <!--:src="item.preview.medium")-->
          <!--q-btn.full-width.q-my-md(-->
            <!--v-if="item.annotation.author.id !== user.uuid"-->
            <!--dark, color="primary",-->
            <!--@click="uploadResponse(item.annotation)")-->
            <!--| {{ $t('buttons.upload_remix') }}-->

          <!--q-collapsible.full-width.no-padding.q-my-sm(-->
            <!--v-if="item.responses.length > 0",-->
            <!--:label="getResponseLabel(item.responses.length)")-->
            <!--q-card(v-for="(responseItem, i) in item.responses", inline, square)-->
              <!--q-card-media.bg-dark.items-center.row.justify-center.text-left(-->
                <!--overlay-position="bottom",-->
                <!--style="width: 19vw; height: 19vw; margin: .5vw;")-->
                <!--img.card-image.no-margin(-->
                  <!--@click="openPreview(responseItem)",-->
                  <!--:src="responseItem.preview.medium")-->
              <!--q-btn.q-py-md(-->
                <!--v-if="responseItem.annotation.author.id === user.uuid", color="white",-->
                <!--@click="deleteItem(responseItem)", icon="delete", flat)-->

          <!--.q-pa-md.text-grey-8(v-else)-->
            <!--| {{ $t('pages.portraitplusplus.no_remix') }}-->
</template>

<script>
  import { mapGetters } from 'vuex'
  import VideoListView from '../components/VideoListView'
  import VideoModal from '../components/VideoModal'

  export default {
    name: 'portraitplusplus',
    components: {
      VideoModal,
      VideoListView
    },
    data () {
      return {
        sequencesFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        favouriteSequences: []
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadFavouriteSequences()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        sequenceJobIds: 'sequences/getJobIds',
        sequenceJobDetails: 'sequences/getJobDetails'
      })
    },
    watch: {
      async user () {
        if (!this.sequences) {
          await this.loadFavouriteSequences()
        }
      }
    },
    methods: {
      openPreview (item) {
        this.preview = item.annotation
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item)
        else if (item.annotation.body.source.type === 'image/jpeg') this.showImageModal = true
      },
      async loadFavouriteSequences () {
        const query = {
          'target.id': this.sequencesFavouritesMapUUID
        }
        const result = await this.$store.dispatch('annotations/find', query)
        this.favouriteSequences = result.items.map(annotation => {
          const media = annotation.body.source.id
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
          }
          return {
            media,
            preview,
            annotation
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
