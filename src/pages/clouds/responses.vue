<template lang="pug">
  q-page.q-ma-md
    upload-remix-modal(ref="uploadRemixModal")

    q-card.bg-dark.q-pa-md.text-center
      | noch kein Video
      div(:style="videoPlayerStyle").q-mb-md
        video-player(v-if="annotation", :annotation="annotation", :autoplay="true")
      | xxx

    // q-btn.full-width.q-my-md(
      dark, color="primary", @click="uploadResponse")
        | {{ $t('buttons.upload_remix') }}

    file-uploader.full-width.no-padding.no-margin.self-center(
    :target="target", :purpose="purpose", :public="public", @convert="onConvert")
    //
      file-uploader.no-padding.no-margin.self-center(v-if="!jobIds.length && target",
      // :target="target", :purpose="purpose", :public="public", @convert="onConvert")

    q-card.bg-dark
      q-list.no-border(v-for="association in myAssociations")
        q-item(
        v-for="word in association.value") {{ word }}
        // q-btn(@click="removeAssociation(association.uuid)") REMOVE
    q-btn.q-mt-md.full-width.bg-primary.text-white(@click="$router.push('/')", label="fertig")
    // div(v-for="association in myAssociations")
      p
        span(v-for="word in association.value") {{ word }}

      // h3.text-center {{ $t('pages.cloud.responses.title') }}
      //
        q-list.no-border.flex.gutter-xs.q-px-xs

          q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm(
          v-for="word in words", :class="[checkIfSelected(word.value) ? 'bg-grey-9 text-white' : 'bg-dark']")

</template>

<script>
  import { mapGetters } from 'vuex'
  import { VideoPlayer } from 'mbjs-quasar/src/components'

  import FileUploader from '../../components//FileUploader'
  import UploadRemixModal from '../../components/UploadRemixModal'

  export default {
    components: {
      FileUploader,
      UploadRemixModal,
      VideoPlayer
    },
    data () {
      return {
        annotation: undefined,
        associations: [],
        myAssociations: [],
        responses: [],
        target: undefined
      }
    },
    async mounted () {
      await this.loadData()
      await this.loadResponses()
      this.getVideo()
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
      }
    },
    methods: {
      getVideo () {
        console.log('äää', this.myAssociations[0])
      },
      async loadData () { // loads text
        if (!this.user) return
        // this.target = await this.$store.dispatch('maps/get', this.$route.params._id)
        console.log('this.$route.params._id', this.$route.params._id)
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.associations = await this.$store.dispatch('cloud/listAssociations')
        this.associations.map(a => {
          if (a._id === this.$route.params._id) {
            this.myAssociations.push(a)
          }
        })
        console.debug('loaded associations', this.associations)
        this.$q.loading.hide()
      },
      async loadResponses () {
        // this.$q.loading.show({ message: this.$t('messages.loading_responses') })
        // this.target = await this.$store.dispatch('cloud/listAssociations', this.$route.params._id)
        this.target = this.myAssociations[0]
        console.log('loadResponses', this.target)
        if (this.target) {
          const states = await this.$store.dispatch('annotations/find', {
            'target.id': this.target.uuid,
            'body.purpose': {
              $ne: 'commenting'
            }
          })
          console.log('++++++', states)
        }
        /*
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
        this.$q.loading.hide() */
      },
      async uploadResponse () {
        console.log('uploadResponse')
        console.log('uploadResponse', this.myAssociations[0].uuid)

        this.$refs.uploadRemixModal.show({
          id: `${process.env.ANNOTATION_BASE_URI}${this.myAssociations[0].uuid}`,
          type: 'Annotation'
        })
        // FIXME: copied code below, not working here
        /*
        this.$refs.uploadRemixModal.show({
          id: this.target.id,
          type: 'Timeline'
        })
        const message = {
          portrait: this.target.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
        */
      },
      async removeAssociation (uuid) {
        await this.$store.dispatch('cloud/removeAssociation', uuid)
        await this.loadData()
      }
    }
  }
</script>

<style scoped>
</style>
