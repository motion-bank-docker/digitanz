<template lang="pug">
  .column(v-if="timeline || target")
    <!--.q-pa-md-->
      <!--q-input(:placeholder="$t('placeholder.file_uploader')", v-model="title", dark)-->
    .q-py-md
      uploader(:url="url", @finish="onFinish", ref="uploader")
</template>

<script>
  import Uploader from '../components/Uploader'
  import { mapGetters } from 'vuex'
  import { ObjectUtil } from 'mbjs-utils'
  export default {
    components: {
      Uploader
    },
    props: ['query', 'target', 'purpose', 'public'],
    data () {
      return {
        url: `${process.env.TRANSCODER_HOST}/uploads`,
        title: undefined,
        timeline: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    async mounted () {
      if (this.query) await this.getRenderTimeline()
    },
    watch: {
      async user () {
        if (this.query) this.getRenderTimeline()
      }
    },
    methods: {
      async getRenderTimeline () {
        if (this.user && !this.timeline) {
          const query = ObjectUtil.merge({
            'author.id': this.$store.state.auth.user.uuid,
            title: 'Meine Videos'
          }, this.query)
          const results = await this.$store.dispatch('maps/find', query)
          if (!results.items.length) {
            this.timeline = await this.$store.dispatch('maps/post', {title: 'Meine Videos'})
          }
          else {
            this.timeline = results.items[0]
          }
        }
      },
      async onFinish (responses) {
        console.debug('uploader finished', responses)
        const keys = Object.keys(responses)
        for (let key of keys) {
          const source = responses[key].file
          const headers = {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
          const metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(source)}`
          let result = await this.$axios.get(metadataURL, { headers })
          const metadata = result.data
          console.log('metadata', metadata)
          const detail = {
            title: this.title,
            timeline: this.timeline ? this.timeline.uuid : undefined,
            target: this.target,
            purpose: this.purpose,
            isPublic: this.public,
            source
          }
          let size = {
            width: 1280,
            height: 720
          }
          if (metadata.width < metadata.height || metadata.rotation === -90 || metadata.rotation === 90) {
            size = {
              width: 720,
              height: 1280
            }
          }
          const conversion = {
            source,
            rotate: metadata.rotation || 0,
            scale: {
              width: size.width,
              height: size.height
            },
            metadata: {
              title: this.title
            }
          }
          this.$emit('convert', { conversion, detail })
          result = await this.$store.dispatch('conversions/post', { conversion, detail })
          console.debug('created conversion', result)
          const message = {
            source,
            metadata,
            user: this.user.uuid
          }
          await this.$store.dispatch('logging/log', { action: 'upload', message })
        }
        this.title = undefined
      }
    }
  }
</script>
