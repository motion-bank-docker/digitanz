<template lang="pug">
  q-page(padding)
    .row
      .col-12
        h3 Upload video
    file-uploader.full-width.self-center(dark, :url="url")
</template>

<script>
  import Uploader from '../components/Uploader'
  import FileUploader from '../components/FileUploader'
  export default {
    components: {
      Uploader,
      FileUploader
    },
    data () {
      return {
        url: undefined,
        responses: {},
        title: undefined
      }
    }
  }
</script>
