<template lang="pug">
  div(:class="{'full-width': layoutStyle !== 'profile', 'profile': layoutStyle === 'profile'}")

    //
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'")
      video-item.placeholder(v-if="showVideoPlaceholder", :video="{}")
      video-item(v-for="video in videos",
      :allowSelfResponse="allowSelfResponse",
      :buttons="buttons",
      :cardWidth="cardWidth",
      :contentType="`video`",
      :hideButtons="hideButtons",
      :isSequence="isSequence",
      :key="setKey(video)",
      :layoutStyle="layoutStyle",
      :roundImage="roundImage",
      :showContentFlag="showContentFlag",
      :showDuration="showDuration",
      :showOverlay="showOverlay",
      :video="video",
      :isArchive="isArchive",
      @changed="changed")

        template(slot="customButtons", slot-scope="{ video }")
          slot(name="customButtons", :video="video")
        template(slot="customMoreButtons", slot-scope="{ video }")
          slot(name="customMoreButtons", :video="video")
    //
    // special view for profile page
    div(v-else-if="layoutStyle === 'profile'")
      // video-item.placeholder(v-if="showVideoPlaceholder", :video="{}")
      video-item(v-for="video in videos",
        :allowSelfResponse="allowSelfResponse",
        :buttons="buttons",
        :cardWidth="cardWidth",
        :contentType="`video`",
        :hideButtons="hideButtons",
        :isSequence="isSequence",
        :key="setKey(video)",
        :layoutStyle="layoutStyle",
        :roundImage="roundImage",
        :showDuration="showDuration",
        :showContentFlag="showContentFlag",
        :video="video",
        :isArchive="isArchive",
        @changed="changed")

        template(slot="customButtons", slot-scope="{ video }")
          slot(name="customButtons", :video="video")
        template(slot="customMoreButtons", slot-scope="{ video }")
          slot(name="customMoreButtons", :video="video")

    //
    // singleCenter
    div.row.singleCenter.justify-center(v-else-if="layoutStyle === 'singleCenter'")
      video-item.placeholder(v-if="showVideoPlaceholder", :video="{}")
      video-item(v-for="video in videos",
      :allowSelfResponse="allowSelfResponse",
      :buttons="buttons",
      :cardWidth="cardWidth",
      :hideButtons="hideButtons",
      :isSequence="isSequence",
      :key="setKey(video)",
      :layoutStyle="layoutStyle",
      :roundImage="roundImage",
      :showDuration="showDuration",
      :video="video",
      :isArchive="isArchive",
      @changed="changed")

        template(slot="customButtons", slot-scope="{ video }")
          slot(name="customButtons", :video="video")
        template(slot="customMoreButtons", slot-scope="{ video }")
          slot(name="customMoreButtons", :video="video")
</template>

<script>
  import VideoItem from './VideoItem'

  export default {
    components: {
      VideoItem
    },
    props: {
      // sm, md, l, xl ?
      allowSelfResponse: Boolean,
      isArchive: Boolean,
      buttons: Array,
      cardWidth: {
        type: String,
        default: '46%'
      },
      hideButtons: undefined,
      isSequence: Boolean,
      jobIds: undefined,
      layoutStyle: String,
      roundImage: undefined,
      showContentFlag: {
        type: Boolean,
        default: false
      },
      showDuration: Boolean,
      showOverlay: Boolean,
      videos: Array
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
        if (video.hasOwnProperty('annotation')) return video.annotation ? video.annotation.uuid : '001'
        else return video.uuid
        // return video.annotation ? video.annotation.uuid : '001'
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
  .profile
    width: 100%;
</style>
