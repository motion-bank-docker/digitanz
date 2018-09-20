<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'" ref="mega")
        mr-griddle-preview(v-for="video in mrGriddles"
                                        :requestedWidth="167"
                                        :requestedHeight="167"
                                        style="width: 46%")
        template(slot="customButtons" slot-scope="{ video }")
          slot(name="customButtons" :video="video")

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
      hideButtons: undefined
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
