<template lang="pug">
  div
    .bg-green.q-mb-lg(v-for="item in archiveItems")
      img.full-width(:src="item.metadata.preview.medium")
    // FIXME: query works for Archive
      video-list-view(:videos="archiveItems",
      layoutStyle="sm",
      // :buttons="['more-delete', 'more-download']",
      // :showDuration="false",
      @changed="loadData")

</template>

<script>
  import { VideoHelper } from '../../lib/video-helper'

  export default {
    data () {
      return {
        archiveItems: undefined
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      async loadData () {
        // console.log('this.user.id', this.user.uuid)
        const archiveMapResult = await this.$store.dispatch('maps/get', process.env.ARCHIVE_TIMELINE_UUID)
        // console.log('archiveMapResult: ', archiveMapResult)
        if (archiveMapResult) {
          const archiveQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${archiveMapResult.uuid}`
          }
          let archive = await VideoHelper.fetchVideoItems(this, archiveQuery)
          console.log('archive', archive)
          // this.archiveItems = archive[0]
          this.archiveItems = archive
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
