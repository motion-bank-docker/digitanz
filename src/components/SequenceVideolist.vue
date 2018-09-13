<template lang="pug">
  div
    // DISPLAY FILTERED VIDEOS
    //
    q-list.no-border
      div(
      v-for="video in videos",
      v-if="video.orientation === orientation",
      @click="selectedUuid = video.annotation.uuid",
      :class="[orientation === 'landscape' ? 'moba-landscape' : 'moba-portrait']")
        q-item.no-padding.q-caption.relative-position(tag="label")
          q-item-main
            q-item-tile
              q-checkbox.hidden(v-model="selection", :val="video")
              img.fit(:src="video.preview.medium",
              :class="{'moba-gray-image': !selection.includes(video)}")
              span.absolute-top-left.bg-body-background.text-white.q-ma-sm.q-pa-xs.round-borders(
              :class="{'moba-highlight-image': selection.includes(video)}")
                | {{ formatDuration(video.metadata.duration) }}

    .full-width.bg-body-background.row.justify-around.fixed-bottom.q-mb-xl.q-pb-md.q-pt-sm
      q-btn.bg-primary.text-white(
      @click="submit", :label="$t('buttons.add_to_sequence')",
      :class="{'disabled bg-grey-8': selection.length <= 0}"
      )

</template>

<script>
  export default {
    components: {
      // FileUploader
    },
    props: ['orientation', 'videos'],
    data () {
      return {
        selection: [],
        selectedUuid: undefined,
        uploadQuery: {
          'title': 'Meine Videos'
        }
      }
    },
    watch: {
      selection (val) {
        console.debug('selection updated', val)
      },
      orientation (val) {
        console.debug('orientation changed', val)
        this.selection = []
      }
    },
    methods: {
      submit () {
        if (this.selection.length > 0) this.$emit('submit', this.selection)
      },
      formatDuration (duration) {
        let minutes = Math.floor(duration / 60).toString()
        let seconds = (duration - minutes * 60).toString().split('.')[0]
        if (seconds.length < 2) seconds = '0' + seconds
        return minutes.toString() + ':' + seconds.toString()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .bg-body-background
    background-color $body-background

  .moba-highlight-image
    // border 2px solid $primary
    background-color $primary

  .moba-inline
    max-width 20%
  // float left

  .moba-image
    max-width 50%

  .moba-landscape
    width 50%
    display inline-block
    margin-top -4px

  .moba-portrait
    width 33.3333%
    display inline-block
    margin-top -4px

  .moba-gray-image
    filter grayscale(1)

</style>
