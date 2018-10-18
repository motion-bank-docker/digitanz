<template lang="pug">
  q-page.q-px-md
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")

    div
      h3.text-center {{ $t('pages.mr-griddle.responses.title') }}

      div.q-mb-md
        mr-griddle-item(v-if="states.length > 0",
        :states="states",
        :requestedWidth="250",
        :requestedHeight="250",
        :play="true")

      q-btn.full-width.q-mb-md(
      dark, color="primary", @click="uploadResponse")
        | {{ $t('buttons.upload_remix') }}

      job-list

    div
      video-list-view(
        v-if="responses.length > 0", :videos="responses", layoutStyle="sm", :hideButtons="hideButtons",
        :allowSelfResponse="$route.meta.allowSelfResponse")

      q-card.q-pa-md.q-mb-md.text-grey-8.text-center(v-else)
        | {{ $t('messages.no_videos') }}

</template>

<script>
  import MrGriddleItem from '../../components/MrGriddleItem'
  import MrGriddlePreview from '../../components/MrGriddlePreview'
  import JobList from '../../components/JobList'
  import UploadRemixModal from '../../components/UploadRemixModal'
  import VideoListView from '../../components/VideoListView'
  import VideoModal from '../../components/VideoModal'
  import { VideoHelper } from '../../lib'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      MrGriddleItem,
      MrGriddlePreview,
      JobList,
      UploadRemixModal,
      VideoListView,
      VideoModal
    },
    data () {
      return {
        target: undefined,
        states: [],
        responses: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      videoPlayerStyle () {
        return {
          width: '100vw',
          height: '50vh',
          'background-color': 'hotpink'
        }
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadResponses)
      await this.loadResponses()
    },
    methods: {
      async loadResponses () {
        console.log('X X X X X', this.$route.params.uuid)
        this.$q.loading.show({ message: this.$t('messages.loading_responses') })
        this.target = await this.$store.dispatch('maps/get', this.$route.params.uuid)

        if (this.target) {
          const states = await this.$store.dispatch('annotations/find', {
            'target.id': this.target.id,
            'body.purpose': {
              $ne: 'commenting'
            }
          })
          this.states = states.items.map(s => {
            return JSON.parse(s.body.value)
          })

          const responsesQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.target.uuid}`,
            'target.type': 'Timeline',
            'body.purpose': 'commenting'
          }
          this.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        }
        this.$q.loading.hide()
      },
      async uploadResponse () {
        this.$refs.uploadRemixModal.show({
          id: this.target.id,
          type: 'Timeline'
        })
        const message = {
          portrait: this.target.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      }
    }
  }
</script>
