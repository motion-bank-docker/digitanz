<template lang="pug">
  .column(v-if="timeline")
    .q-pa-md
      q-input(placeholder="Video title", v-model="title", dark)
    .q-pa-md
      uploader(:url="url", @finish="onFinish", ref="uploader")
</template>

<script>
  import Uploader from '../components/Uploader'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Uploader
    },
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
      await this.getTimeline()
    },
    watch: {
      async user () {
        this.getTimeline()
      }
    },
    methods: {
      async getTimeline () {
        if (this.user && !this.timeline) {
          const query = {
            'author.id': this.$store.state.auth.user.uuid,
            'title': 'Meine Videos'
          }
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
          const detail = {
            title: this.title,
            timeline: this.timeline.uuid
          }
          const conversion = {
            source,
            scale: {
              width: 1280,
              height: 720
            },
            metadata: {
              title: this.title
            }
          }
          const result = await this.$store.dispatch('conversions/post', { conversion, detail })
          console.debug('created conversion', result)
        }
        this.title = undefined
      }
    }
  }
</script>
