<template lang="pug">
  video-list-view(:videos="portraits",
  layoutStyle="sm",
  :buttons="['delete', 'download']",
  :showDuration="true",
  @changed="changed")
    template(slot="customButtons" slot-scope="{ video }")
</template>

<script>
  import VideoListView from '../VideoListView'
  import ConfirmModal from '../ConfirmModal'

  export default {
    components: {
      VideoListView,
      ConfirmModal
    },
    props: {
      portraits: Array
    },
    data () {
      return {
      }
    },
    methods: {
      changed () {
        this.$emit('changed')
      }
    }
  }
</script>

<style scoped>

</style>
