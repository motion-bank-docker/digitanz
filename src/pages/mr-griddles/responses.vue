<template lang="pug">
  q-page.q-px-md
    video-modal(ref="videoModal")
    upload-remix-modal(ref="uploadRemixModal")

    div
      h3.text-center {{ $t('pages.mr-griddle.responses.title') }}

      div.q-mb-md
        | {{ SVG }}

      q-btn.full-width.q-mb-md(
        dark, color="primary", @click="uploadResponse(annotation)")
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
  export default {
    name: 'responses',
    data () {
      return {
        responses: []
      }
    },
    computed: {
      videoPlayerStyle () {
        // if (this.annotationMetadata) {
        //   const ratio = this.annotationMetadata.width / this.annotationMetadata.height
        //   if (this.annotationMetadata.width > this.annotationMetadata.height) {
        //     return {
        //       width: '100%',
        //       height: 'auto'
        //     }
        //   }
        //   else {
        //     return {
        //       width: `calc(80vw*${ratio})`,
        //       height: 'auto',
        //       'margin-left': `calc(40vw*${ratio})`
        //     }
        //   }
        // }
        return {
          width: '100vw',
          height: '50vh',
          'background-color': 'hotpink'
        }
      }
    },
    methods: {
      async loadResponses () {
        this.$q.loading.show({ message: this.$t('messages.loading_responses') })
        // this.annotation = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        //
        // const headers = {
        //   Authorization: `Bearer ${localStorage.getItem('access_token')}`
        // }
        // const metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(this.annotation.body.source.id)}`
        // let result = await this.$axios.get(metadataURL, { headers })
        // this.annotationMetadata = result.data
        // console.log('metadata', this.annotationMetadata)
        //
        // if (this.annotation) {
        //   const responsesQuery = {
        //     'target.id': `${process.env.ANNOTATION_BASE_URI}${this.annotation.uuid}`,
        //     'body.purpose': 'commenting'
        //   }
        //   this.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        //   console.debug(this.responses)
        // }
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped lang="stylus">

</style>
