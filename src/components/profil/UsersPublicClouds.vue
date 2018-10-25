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
  // import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  // import { ObjectUtil } from 'mbjs-utils'
  // import { VideoHelper } from '../../lib/video-helper'

  import CloudListView from '../CloudListView'
  // import ConfirmModal from '../components/ConfirmModal'
  // import VideoListView from '../VideoListView'

  // const UI_RESIZER_FACTOR = 2

  export default {
    components: {
      // MrGriddleModal
      // ConfirmModal
      // VideoListView
      CloudListView
    },
    data () {
      return {
        // archiveItems: undefined,
        associations: [],
        // FIXME:
        associationsFavouritesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.SEQUENCES_TIMELINE_UUID}`,
        buttonsX: [{
          icon: 'people',
          label: 'visibility'
        }, {
          icon: 'chat',
          label: 'response'
        }],
        buttonsY: [{
          icon: 'edit',
          label: 'edit'
        }, {
          icon: 'cloud_download',
          label: 'download'
        }, {
          icon: 'delete',
          label: 'delete'
        }],
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
        this.associations = await this.$store.dispatch('cloud/listPublicAssociations', this.user.uuid)
        console.log('++++++*******WWWWWWWWW', this.associations)
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped>
</style>
