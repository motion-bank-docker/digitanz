<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'" ref="mega")
      mr-griddle-preview(v-for="(video, i) in items",
                                      :previewSkeleton="video.body.value",
                                      :requestedWidth="120",
                                      :requestedHeight="120",
                                      :hideButtons="hideButtons",
                                      :buttons="buttons",
                                      style="width: 46%")
        template(slot="customButtons", slot-scope="{ video }")
          q-btn(flat, size="sm", round, icon="edit", @click="$router.push('mr-griddle/' + sequences[i].uuid + '/edit')")
          // slot(name="customButtons", :video="video")

</template>

<script>
  import MrGriddlePreview from './MrGriddlePreview'

  export default {
    components: {
      MrGriddlePreview
    },
    props: {
      // sm, md, l, xl ?
      layoutStyle: String,
      buttons: Array,
      hideButtons: undefined,
      items: undefined,
      sequences: undefined
    },
    data () {
      return {
        previewWidth: 167,
        mrGriddles: [1, 1, 3, 4, 5]
      }
    },
    mounted () {
      this.setPreviewWidth()
    },
    methods: {
      changed () {
        this.$emit('changed')
      },
      setKey (video) {
        return video.annotation ? video.annotation.uuid : '001'
      },
      setPreviewWidth () {
        this.previewWidth = this.$refs.mega.offsetWidth / 2
        console.log('22 ' + this.$refs.mega.offsetWidth)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
