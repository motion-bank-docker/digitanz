<template lang="pug">
  .col-12(v-if="jobIds.length")
    div.text-center.q-pb-md
      q-spinner(size="40px") {{ $t('upload.loading_up') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        jobIds: 'conversions/getJobIds'
      })
    }
  }
</script>
