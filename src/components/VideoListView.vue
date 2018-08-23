<template lang="pug">
  div.full-width
    // size s
    div.row.justify-between(v-if="layoutStyle === 'sm'")
      video-item(v-for="video in videos"
                :key="video.annotation.uuid"
                :video="video"
                :buttons="buttons"
                @changed="changed")
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
      buttons: Array
    },
    data () {
      return {
        foo: undefined
      }
    },
    methods: {
      changed () {
        this.$emit('changed')
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
