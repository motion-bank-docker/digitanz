<template lang="pug">
  // .column(v-if="timeline || target")
  uploader-micro(:url="url", @finish="onFinish", ref="uploader")
  // uploader(:url="url", @finish="onFinish", ref="uploader")
</template>

<script>
  import FileUploader from './FileUploader'
  import Uploader from './Uploader'
  import UploaderMicro from './UploaderMicro'

  export default {
    components: {
      Uploader,
      UploaderMicro
    },
    extends: FileUploader,
    props: {
      size: undefined
    },
    mounted () {
    },
    methods: {
    }
  }
</script>
