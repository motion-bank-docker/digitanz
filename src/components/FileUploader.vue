<template lang="pug">
  .column(v-if="url")
    .q-pa-md
      q-input(placeholder="Video title", v-model="title", dark)
    .q-pa-md
      uploader(:url="url", @finish="onFinish")
  .row(v-for="key in Object.keys(responses)", :key="key")
    div
      h4 {{ responses[key].doc.uuid }}
      p
        | Duration: {{ responses[key].doc.ffprobe.format.duration }}s -
        | Created: {{ responses[key].doc.stats.ctime }}
      p
        a(:href="getVideoURL(responses[key])") {{ getVideoURL(responses[key]) }}
</template>

<script>
  import Uploader from '../components/Uploader'
  import { DateTime } from 'luxon'
  export default {
    components: {
      Uploader
    },
    data () {
      return {
        url: undefined,
        responses: {},
        title: undefined
      }
    },
    async mounted () {
      const params = await this.$params()
      if (Array.isArray(params.urls) && params.urls.length) {
        this.url = params.urls[0].streamer
      }
    },
    methods: {
      getVideoURL (response) {
        return `${this.url}/${response.doc.uuid}.mp4`
      },
      async onFinish (responses) {
        this.responses = responses
        console.debug('uploader finished', this.responses)
        const _this = this
        Object.keys(responses).forEach(async key => {
          const response = responses[key]
          const payload = {
            body: {
              source: _this.getVideoURL(response),
              type: 'Video',
              purpose: 'linking',
              value: _this.title
            },
            author: _this.$store.state.auth.payload.userId,
            target: {
              id: localStorage.localTimeline,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.fromISO(response.doc.created).toISO()
              }
            }
          }
          console.log('create video', payload)
          const data = await _this.$store.dispatch('annotations/create', payload)
          this.$emit('finish', data)
          // not working
          // this.$refs.uploader.reset() //execute the method belong to child
        })
      }
    }
  }
</script>

<style scoped>

</style>
