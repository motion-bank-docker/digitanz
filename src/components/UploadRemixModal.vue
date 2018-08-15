<template lang="pug">
  q-modal.row.maximized(v-model="opened", content-classes="bg-dark")
    .q-ma-md
      h1.q-title {{ $t('portrait.upload_remix') }}
      file-uploader.no-padding.no-margin.self-center(v-if="!jobIds.length", :target="target",
        style="width: 100%", @finish="addUploadedVideo")
      job-list
</template>

<script>
  import JobList from './JobList'
  import FileUploader from './FileUploader'
  import { mapGetters } from 'vuex'
  export default {
    props: ['target'],
    data () {
      return {
        showModal: false
      }
    },
    components: {
      JobList,
      FileUploader
    },
    computed: {
      opened () {
        return this.showModal
      },
      ...mapGetters({
        jobIds: 'conversions/getJobIds'
      })
    },
    methods: {
      show () {
        this.showModal = true
      },
      addUploadedVideo (video) {
        console.debug('remix uploaded', video)
        this.$emit('uploaded', video)
      }
    }
  }
</script>
