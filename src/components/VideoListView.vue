<template lang="pug">
  q-page
    // size s
    div.row.justify-between(v-if="size === 's'")
      q-card.q-mb-lg(v-for="video in videos" :key="video.annotation.uuid" style="width: 46%")
        q-card-media.no-padding
          video-preview(:video="video")
        q-card-actions(v-if="video.annotation.uuid")
          slot(v-if="displayStartButton" name="starButton" :video="video")
            q-btn(round, flat, size="sm" color="white", icon="star", @click="starItem(video)")
          slot(v-if="displayDeleteButton" name="deleteButton" :video="video")
            q-btn(round, flat, size="sm" color="white", icon="delete", @click="deleteItem(video)")
          slot(name="customButtons" :video="video")

    // size m
    div(v-else-if="size === 'm'")
      p size m not defined yet
</template>

<script>
  import VideoPreview from './VideoPreview'

  export default {
    components: {
      VideoPreview
    },
    props: {
      videos: Array,
      // sm, md, l, xl ?
      size: String,
      buttons: Array
    },
    data () {
      return {
        foo: undefined
      }
    },
    methods: {
      deleteItem (video) {
        console.log('delete video: ' + video.annotation.uuid)
      },
      starItem (video) {
        console.log('high five to item: ' + video.annotation.uuid)
      }
    },
    computed: {
      displayDeleteButton () {
        return (this.buttons.indexOf('delete') > -1)
      },
      displayStartButton () {
        return (this.buttons.indexOf('star') > -1)
      }
    }
  }
</script>

<style scoped>

</style>
