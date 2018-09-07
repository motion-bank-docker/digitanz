<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'")
      video-item.placeholder(v-if="showVideoPlaceholder" :video="{}")
      video-item(v-for="video in videos"
                :key="setKey(video)"
                :video="video"
                :buttons="buttons",
                :allowSelfResponse="allowSelfResponse",
                @changed="changed",
                :hideButtons="hideButtons")
        template(slot="customButtons" slot-scope="{ video }")
          slot(name="customButtons" :video="video")

    // size m
    div(v-else-if="size === 'm'")
      p size m not defined yet
</template>

<script>
  import VideoItem from './VideoItem'

  export default {
    components: {
      VideoItem
    },
    props: {
      videos: Array,
      // sm, md, l, xl ?
      layoutStyle: String,
      buttons: Array,
      allowSelfResponse: Boolean,
      hideButtons: undefined,
      jobIds: undefined
    },
    data () {
      return {
        showVideoPlaceholder: false
      }
    },
    methods: {
      changed () {
        this.$emit('changed')
      },
      setKey (video) {
        return video.annotation ? video.annotation.uuid : '001'
      }
    },
    watch: {
      jobIds () {
        if (this.jobIds.length > 0) {
          this.showVideoPlaceholder = true
        }
      },
      videos () {
        this.showVideoPlaceholder = false
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
