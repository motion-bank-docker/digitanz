<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'" ref="mega")
      mr-griddle-preview(v-for="item in items"
      :item="item"
      :previewSkeleton="item.body.value"
      :requestedWidth="167"
      :requestedHeight="167"
      :hideButtons="hideButtons"
      :buttons="buttons",
      style="width: 46%")
        template(slot="customButtons" slot-scope="{ item }")
          slot(name="customButtons" :item="item")

    q-window-resize-observable(@resize="setPreviewWidth()")
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
      items: undefined
    },
    data () {
      return {
        previewWidth: 167
      }
    },
    mounted () {
      this.setPreviewWidth()
    },
    watch: {
      previewWidth () {
      }
    },
    methods: {
      changed () {
        this.$emit('changed')
      },
      setKey (video) {
        return video.annotation ? video.annotation.uuid : '001'
      },
      setPreviewWidth () {
        if (typeof this.$refs.mega !== 'undefined') {
          this.previewWidth = this.$refs.mega.offsetWidth / 2.1
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
