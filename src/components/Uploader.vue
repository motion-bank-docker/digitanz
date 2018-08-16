<template lang="pug">

  q-uploader(
        ref="uploader",
        :prefix="$t('buttons.uploader')",
        auto-expand,
        clearable,
        color="primary",
        align="center",
        inverted,
        :extensions="ext",
        :multiple="false",
        :url="url",
        hide-upload-button,
        @add="onSelect",
        @uploaded="onUploaded",
        @fail="onFail",
        @start="onStart",
        @finish="onFinish",
        @click.native="handleUploaderClick()")

</template>

<script>
  import { ObjectUtil } from 'mbjs-utils'
  export default {
    data () {
      return {
        ext: 'video/*',
        responses: {}
      }
    },
    props: ['url'],
    methods: {
      handleUploaderClick () {
        this.$refs.uploader.pick()
      },
      onSelect (files) {
        this.$emit('select', files)
        this.$refs.uploader.upload()
      },
      onUploaded (file, xhr) {
        let response
        try {
          response = JSON.parse(xhr.responseText)
        }
        catch (e) { /* ignored */ }
        this.responses[ObjectUtil.slug(file.name)] = response
      },
      onFail (file, xhr) {
        let response
        console.debug('uploader failed file', file, xhr)
        try {
          response = JSON.parse(xhr.responseText)
        }
        catch (e) { /* ignored */ }
        this.responses[ObjectUtil.slug(file.name)] = response
      },
      onStart () {
        this.responses = []
        this.$emit('start')
      },
      onFinish () {
        this.$emit('finish', this.responses)
        this.$refs.uploader.reset()
      },
      reset () {
        this.$refs.uploader.reset()
      }
    }
  }
</script>

<style lang="stylus">
  .q-uploader
    span.q-if-addon
      width 100%
      text-align center
      text-transform uppercase
      font-weight 500
      font-size 14px
    .q-uploader-pick-button
      display none
    .q-spinner
      display none
    .row:first-child
      .q-icon
        display none
  .q-uploader:not(.q-uploader-expanded)
      .q-input-target
        display none
  .q-uploader.q-uploader-expanded > .row
    display none
  .q-uploader-files-no-border .q-uploader-files
    border-top-width: 1px !important;
    border-top-style: solid !important;
    border-top-color: inherit !important;
</style>
