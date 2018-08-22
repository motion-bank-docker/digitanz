<template lang="pug">
  q-page
    div.row.justify-between
      q-card.q-mb-lg(v-for="video in videos" style="width: 46%")
        q-card-media.no-padding
          video-preview(:video="video")
        q-card-title
          div {{  }}
        q-card-actions(v-if="video.annotation.uuid")
          q-btn(round, size="sm" color="white", icon="arrow_upward", flat)
          q-btn(round, size="sm" color="white", icon="arrow_downward", flat)
</template>

<script>
  import VideoPreview from './videoPreview'

  export default {
    components: {
      VideoPreview
    },
    props: {
      videos: Array,
      // sm, md, l, xl ?
      size: String
    },
    data () {
      return {
        foo: undefined
      }
    }
  }
</script>

<style scoped>

</style>
