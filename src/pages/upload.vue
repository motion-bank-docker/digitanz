<template lang="pug">
  q-page(padding, v-if="timeline")
    .row
      .col-12
        h3 Upload video
    file-uploader.full-width.self-center(dark, :url="url", :timeline="timeline")
</template>

<script>
  import Uploader from '../components/Uploader'
  import FileUploader from '../components/FileUploader'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Uploader,
      FileUploader
    },
    data () {
      return {
        timeline: undefined,
        url: undefined,
        responses: {},
        title: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        const query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        const results = await this.$store.dispatch('maps/find', query)
        if (!results.items.length) {
          this.timeline = await this.$store.dispatch('maps/post', { title: 'Meine Videos' })
        }
        else {
          this.timeline = results.items[0]
        }
      }
    }
  }
</script>
