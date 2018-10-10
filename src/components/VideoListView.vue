<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'")
      video-item.placeholder(v-if="showVideoPlaceholder" :video="{}")
      video-item(v-for="video in videos",
                :key="setKey(video)",
                :video="video",
                :buttons="buttons",
                :allowSelfResponse="allowSelfResponse",
                :hideButtons="hideButtons",
                :roundImage="roundImage",
                :showDuration="showDuration",
                :isSequence="isSequence",
                :layoutStyle="layoutStyle",
                :cardWidth="cardWidth",
                @changed="changed")
        template(slot="customButtons" slot-scope="{ video }")
          slot(name="customButtons" :video="video")
        template(slot="customMoreButtons" slot-scope="{ video }")
          slot(name="customMoreButtons" :video="video")
    // singleCenter
    div.row.singleCenter.justify-center(v-else-if="layoutStyle === 'singleCenter'")
      video-item.placeholder(v-if="showVideoPlaceholder" :video="{}")
      video-item(v-for="video in videos",
      :key="setKey(video)",
      :video="video",
      :buttons="buttons",
      :allowSelfResponse="allowSelfResponse",
      :hideButtons="hideButtons",
      :roundImage="roundImage",
      :showDuration="showDuration",
      :isSequence="isSequence",
      :layoutStyle="layoutStyle",
      :cardWidth="cardWidth",
      @changed="changed")
        template(slot="customButtons" slot-scope="{ video }")
          slot(name="customButtons" :video="video")
        template(slot="customMoreButtons" slot-scope="{ video }")
          slot(name="customMoreButtons" :video="video")
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
      roundImage: undefined,
      jobIds: undefined,
      showDuration: Boolean,
      isSequence: Boolean,
      cardWidth: {
        type: String,
        default: '46%'
      }
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
