<template lang="pug">

  q-page.row.flex.no-margin.no-scroll

    // POP UP MODAL TO ADD VIDEOS TO SEQUENCER-TIMELINE
    q-modal(v-model="opened", content-classes="bg-dark", minimized)
      .q-ma-md(v-if="!orientation")
        h1.q-title Format wählen
        q-btn-toggle(v-model="orientation" :options="[{label: 'Querformat', value: 'landscape'}, {label: 'Hochformat', value: 'portrait'}]")

      // UPLOAD
      //
      .q-ma-md(v-if="orientation")
        h1.q-title Video hochladen
        file-uploader.no-padding.no-margin.self-center(:url="url", :query="uploadQuery", style="width: 100%", @finish="addUploadedVideo")
        template(v-if="jobIds.length")
          h1.q-title(v-if="jobIds") Videos being processed
          q-item(v-for="(jobId, index) in jobIds")
            span {{jobId}}

        // MEDIATHEK
        //
        div(v-if="orientation")
          h1.full-width.q-title Wähle deine Videos
          q-list.row.no-border.relative-position(style="min-height:100px")
            q-item.q-mb-md.full-width(v-for="video in sortedByOrientation", :key="video.uuid", :title="video.title",
            :class="[{ 'moba-active-image': checkedVideos.includes(video)}, moba-inactive-image]", v-show="fetchedUserVideos")
              q-checkbox(v-model="checkedVideos" :val="video" :disable="video.orientation != orientation")
                q-item-side(:class="{'moba-inactive-image': !checkedVideos.includes(video)}")
                  img(:src="video.preview.small", style="width: 150px", alt="video.title")
                q-item-main
                  p.no-margin.text-weight-medium {{ video.title }}
                  q-chip.text-weight-light(small color="black") {{ video.duration }}
            q-inner-loading.inner-loading(:visible="!fetchedUserVideos" dark)
              q-spinner-mat(color="white" size="3em")

        // BUTTONS
        //
        q-btn.full-width.fixed-bottom(v-if="checkedVideos.length > 0", color="primary", @click="closeModal", icon="add", label="Hinzufügen")
        q-btn.full-width.fixed-bottom(v-else color="primary", @click="closeModal", icon="arrow_back", label="Zurück")

    // MAIN VIEW
    //
    //

    // BIG VIDEO PREVIEW
    //
    video-player.full-width.self-center(
    v-show="sequencedVideos.length > 0",
    :class="orientationClass",
    :src="sourceVideo",
    ref="videoPlayer",
    autoplay="true",
    @ended="playNext",
    @play="setPlayerStatePlay()",
    @pause="setPlayerStatePause()")

    // PLAYER CONTROLS
    //
    .q-ma-md.full-width.row.justify-center(v-if="sequencedVideos.length > 0")
      // q-btn.q-ma-xs(round, size="sm" color="white", icon="play_arrow", outline, @click="editIndex = index, moveUp(sequencedVideos, editIndex)")
      // q-btn.q-ma-xs(round, size="sm" color="white", icon="pause", outline, @click="editIndex = index, moveUp(sequencedVideos, editIndex)")
      .q-mr-xl
        q-btn(:icon="playing ? 'play_arrow' : 'pause'", round, size="sm" color="white", outline, @click="togglePlay")
      .q-mr-sm
        q-btn(round, size="sm" color="white", icon="skip_previous", outline, @click="playPrev")
      .q-ml-sm
        q-btn(round, size="sm" color="white", icon="skip_next", outline, @click="playNext")

    q-list.no-padding.no-border(style="width: 100%")
      q-item.items-baseline
        q-item-main.vertical-center

          // NEW SEQUENCE
          //
          .q-mb-md(v-if="sequencedVideos.length == 0")
            q-btn.q-ma-md.q-mb-xl(color="primary", icon="add_box", @click="openModal" label="Neue Sequenz")
            q-btn.q-ma-md.q-mb-xl(color="primary", icon="add_box", @click="$router.push({path: 'videosequencer/newsequence'})" label="Neue Sequenz neu")

            // TIMELINE LIST
            //
            .q-ma-md.q-title.text-left Gespeicherte Sequenzen
            q-list.q-mb-xl.no-border
              q-item.row.q-mb-md(v-for="n in 3")
                div.col-6.q-pr-md.relative-position
                  img(src="../assets/dancing.png" style="width: 100%")
                  q-chip.duration-video.text-weight-light(dense color="black") 3:06
                div.col-6.q-py-xs.self-stretch.column.justify-around(style="border-top: 1px solid grey")
                  .q-body-2.q-mb-sm.q-mt-xs.uppercase My sequence
                  div
                    q-btn(round, icon="edit", size="md")
                    q-btn(round, icon="account_box" size="md")
                    q-btn(round, icon="delete" size="md")

          // SENQUENCED VIDEOS
          //
          .q-mb-md.row.justify-between.items-center(v-if="sequencedVideos.length > 0")
            h3.q-title.no-margin Videos
            q-btn.no-margin(round, color="primary", icon="add", @click="checkedVideos=[], opened = true")

          //
          //
          q-list.q-mb-xl.no-border
            q-item.no-padding.mega(v-for="(video, index) in sequencedVideos")
              .col
                img.videoPreviewImg(:src="video.preview.small", style="width: 150px", alt="video.title", @click="openPreview(index), editIndex = index")

                //q-btn.no-wrap.full-width(align="left", dark, color="primary", :class="{ 'bg-red': editIndex == index }", :key="index", @click="openPreview(video.source), editIndex = index") {{ video.title || video.uuid }}
              .col
                //h2.q-subheading.videoTitel.no-margin.vertical-top(@click="openPreview(index), editIndex = index") {{ video.title || video.uuid }}
                q-input(v-model="video.title" float-label="Titel" dark)
                .row
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="arrow_upward", outline, @click="editIndex = index, moveUp(sequencedVideos, editIndex)")
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="arrow_downward", outline, @click="editIndex = index, moveDown(sequencedVideos, editIndex)")
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="filter_none", outline, @click="editIndex = index, duplicateVideo(editIndex)")
                  q-btn.q-ma-xs(round, size="sm" color="white", icon="delete", outline, @click="editIndex = index, deleteItem(editIndex)")

    modal-preview(:show="showPreviewModal", :preview="preview", @canceled="closePreview")

</template>

<script>
  import ModalPreview from '../components/VideoModal'
  // import { VideoPlayer } from 'mbjs-quasar/src/components'
  import { mapGetters } from 'vuex'
  import VideoPlayer from '../components/VideoPlayer'
  import FileUploader from '../components/FileUploader'

  export default {
    components: {
      ModalPreview,
      VideoPlayer,
      FileUploader
    },
    data () {
      return {
        sequences: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    async mounted () {
      await this.loadData()
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {
        if (!this.user) return
        const prefix = 'Sequenz: '
        const query = {
          type: 'Timeline',
          'author.id': this.user.uuid
        }
        const result = await this.$store.dispatch('maps/find', query)
        this.sequences = result.items.filter(map => {
          return map.title.indexOf(prefix) === 0
        }).sort(this.$sort.onCreatedDesc).map(map => {
          const media = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`
          const preview = {
            high: media.replace(/\.mp4$/, '.jpg'),
            medium: media.replace(/\.mp4$/, '-m.jpg'),
            small: media.replace(/\.mp4$/, '-s.jpg')
          }
          return {
            title: map.title.substr(prefix.length),
            preview,
            media,
            map
          }
        })
      }
    }
  }
</script>

<style>
  .q-checkbox-icon {
    display: none !important;
  }

  .disabled .moba-inactive-image {
    filter: grayscale(100%);
    opacity: .6;
  }

  .moba-active-image {
    outline: solid cornflowerblue 1px;
    outline: solid white 1px;
    color: white;
  }

  .videoPreviewImg, .videoTitel {
    cursor: pointer;
  }

  .mega:not(:last-child),
  .moba-listItem {
    padding-bottom: 1em !important;
    margin-bottom: 1em;
    border-bottom: 1px solid grey;
  }

  .inner-loading {
    background-color: transparent !important;
  }

  .vjs-big-play-button {
    display: none !important;
  }

  .seq-video-player {
    padding: 0 25%;
  }

  .duration-video {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }
</style>
