<template lang="pug">
  div
    q-btn(@click="$router.push('/sequences/create')") create sequence
    ul
      li(v-for="sequence in sequences") {{ sequence.title }}
</template>

<script>
  import ModalPreview from '../../components/VideoModal'
  // import { VideoPlayer } from 'mbjs-quasar/src/components'
  import { mapGetters } from 'vuex'
  import VideoPlayer from '../../components/VideoPlayer'
  import FileUploader from '../../components/FileUploader'

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
