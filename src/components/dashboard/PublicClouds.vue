<template lang="pug">
  div
    cloud-list-view(
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="associations",
    @emitLoadData="loadData()"
    )
</template>

<script>
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib/video-helper'
  import CloudListView from '../CloudListView'

  export default {
    components: {
      CloudListView
    },
    data () {
      return {
        associations: [],
        buttonsX: [{
          icon: 'cloud_download',
          label: 'download'
        }],
        /* buttonsY: [{
          icon: 'edit',
          label: 'edit'
        }, {
          icon: 'delete',
          label: 'delete'
        }], */
        myAssociations: []
      }
    },
    props: {
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    mounted () {
      this.loadData()
    },
    watch: {
      async user () {
        await this.loadData()
      }
    },
    methods: {
      async deleteItem (uuid) {
        await this.$store.dispatch('cloud/removeAssociation', uuid)
        this.loadData()
      },
      async loadData () {
        this.myAssociations = []
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        const query = {
          'author.id': this.user.uuid
        }
        this.associations = await this.$store.dispatch('cloud/listAssociations', query)
        /*
        this.associations.map(a => {
          if (a.author.id === this.user.uuid) {
            this.myAssociations.push(a)
          }
        })
         */
        console.log('loaded associations', this.associations)
        console.debug('loaded associations', this.associations)
        this.$q.loading.hide()
      },
      async loadDataARCHIVE () {
        // console.log('this.user.id', this.user.uuid)
        const archiveMapResult = await this.$store.dispatch('maps/get', process.env.ARCHIVE_TIMELINE_UUID)
        // console.log('archiveMapResult: ', archiveMapResult)
        if (archiveMapResult) {
          const archiveQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${archiveMapResult.uuid}`
          }
          let archive = await VideoHelper.fetchVideoItems(this, archiveQuery)
          console.log('archive', archive)
          this.archiveItems = archive[0]
        }
      },
      togglePublicity (val) {
        console.log(val)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
