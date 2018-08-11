<template lang="pug">
  .row
    q-uploader.col-10( auto-expand,
    clearable,
    :extensions="ext",
    :multiple="false",
    :url="url",
    hide-upload-button,
    @add="onSelect",
    @uploaded="onUploaded",
    @fail="onFail",
    @start="onStart",
    @finish="onFinish",
    dark,
    ref="uploader")
    q-btn.col-2(@click="() => {$refs.uploader.pick()}") 'Upload'
</template>

<script>
  import { ObjectUtil } from 'mbjs-utils'
  export default {
    data () {
      return {
        ext: '.mp4,.mov,.mpg,.3pg',
        responses: {}
      }
    },
    props: ['url'],
    methods: {
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
    .q-uploader-pick-button
      display none
</style>
