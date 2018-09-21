<template lang="pug">
  q-modal.row.maximized(v-model="showModal", content-classes="bg-dark")
    .q-ma-md
      h3.text-center(style="line-height: 2rem;") {{ $t('pages.portrait.upload_remix') }}
      file-uploader.no-padding.no-margin.self-center(v-if="!jobIds.length && target",
        :target="target", :purpose="purpose", :public="public", @convert="onConvert")
      job-list
      .full-width.fixed-bottom.q-pa-md
        q-btn.full-width(color="primary" @click="close" icon="arrow_back" :label="$t('buttons.close')")
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
        this.target = target
        this.purpose = purpose
        this.showModal = true
        console.debug('response config', this.target, this.purpose)
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
