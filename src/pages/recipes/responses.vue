<template lang="pug">
  q-page.q-ma-md
    upload-remix-modal(ref="uploadRemixModal")

    recipe-item(v-if="recipe", :item="recipe", :displayIngr="true")

    q-btn.full-width.q-mb-md(dark, color="primary", @click="uploadResponse") {{ $t('buttons.upload_response') }}

    div
      video-list-view(
      v-if="responses.length > 0"
      :videos="responses"
      layoutStyle="sm"
      :buttons="['delete']"
      :allowSelfResponse="$route.meta.allowSelfResponse")

      q-card.q-pa-md.q-mb-md.text-grey-8.text-center(v-else)
        | {{ $t('messages.no_videos') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  import { VideoPlayer } from 'mbjs-quasar/src/components'
  import VideoListView from '../../components/VideoListView'
  import RecipeItem from '../../components/RecipeItem'
  import UploadRemixModal from '../../components/UploadRemixModal'

  export default {
    components: {
      UploadRemixModal,
      VideoPlayer,
      RecipeItem,
      VideoListView
    },
    data () {
      return {
        recipe: undefined,
        responses: []
      }
    },
    async mounted () {
      this.$root.$on('updateVideos', this.loadResponses)
      await this.loadData()
    },
    async beforeDestroy () {
      this.$root.$off('updateVideos', this.loadResponses)
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      videoPlayerStyle () {
        if (this.annotationMetadata) {
          const ratio = this.annotationMetadata.width / this.annotationMetadata.height
          if (this.annotationMetadata.width > this.annotationMetadata.height) {
            return {
              width: '100%',
              height: 'auto'
            }
          }
          else {
            return {
              width: `calc(80vw*${ratio})`,
              height: 'auto',
              'margin-left': `calc(40vw*${ratio})`
            }
          }
        }
      }
    },
    watch: {
      async user () {
        await this.loadData()
      },
      async recipe () {
        await this.loadResponses()
      }
    },
    methods: {
      async loadData () { // loads text
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.recipe = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.$q.loading.hide()
      },
      async loadResponses () {
        if (this.recipe) {
          const id = this.recipe.body.source && this.recipe.body.source.id ? this.recipe.body.source.id : this.recipe.id
          this.$q.loading.show({ message: this.$t('messages.loading_responses') })
          const query = {
            'target.id': id,
            'target.type': 'Recipe',
            'body.purpose': 'commenting',
            'body.type': 'Video'
          }
          this.responses = await VideoHelper.fetchVideoItems(this, query)
          this.$q.loading.hide()
        }
      },
      async uploadResponse () {
        const id = this.recipe.body.source && this.recipe.body.source.id ? this.recipe.body.source.id : this.recipe.id
        this.$refs.uploadRemixModal.show({ id, type: 'Recipe' })
        const message = {
          recipe: this.recipe.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      }
    }
  }
</script>
