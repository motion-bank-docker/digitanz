<template lang="pug">
  q-page
    | TEST
    file-uploader(:url="url", :query="uploadQuery", @finish="addUploadedVideo")
</template>

<script>
  import FileUploader from '../components/FileUploader'
  // import url from 'url'

  export default {
    components: {
      FileUploader
    },
    data () {
      return {
        uploadQuery: {
          'title': 'Meine Videos'
        }
      }
    },
    name: 'new-sequence'
  }
</script>

<style scoped>

</style>
