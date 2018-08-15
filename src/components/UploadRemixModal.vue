<template lang="pug">
  q-modal.row.maximized(v-model="showModal", content-classes="bg-dark")
    .q-ma-md
      h1.q-title {{ $t('portrait.upload_remix') }}
      file-uploader.no-padding.no-margin.self-center(v-if="!jobIds.length && target",
        :target="target", :purpose="purpose", :public="public", @convert="onConvert")
      job-list
      q-btn.full-width.fixed-bottom(color="primary" @click="close" icon="arrow_back" :label="$t('buttons.close')")
</template>

<script>
  import JobList from './JobList'
  import FileUploader from './FileUploader'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        showModal: false,
        target: undefined,
        purpose: undefined,
        public: true
      }
    },
    components: {
      JobList,
      FileUploader
    },
    computed: {
      ...mapGetters({
        jobIds: 'conversions/getJobIds'
      })
    },
    methods: {
      show (target, purpose = 'commenting') {
        this.target = {
          id: `${process.env.ANNOTATION_BASE_URI}${target.uuid}`,
          type: 'Annotation'
        }
        this.purpose = purpose
        this.showModal = true
      },
      close () {
        this.target = undefined
        this.purpose = undefined
        this.showModal = false
      },
      onConvert (job) {
        console.debug('remix converting', job)
        this.close()
      }
    }
  }
</script>
