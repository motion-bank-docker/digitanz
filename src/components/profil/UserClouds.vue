<template lang="pug">
  div
    //
      video-list-view(:videos="myAssociations",
      layoutStyle="associations",
      card-width="100%",
      v-if="sequences.length > 0",
      // :buttons="['more-delete', 'more-download']",
      // :showDuration="false",
      // :isSequence="true",
      @changed="loadData")

    div.row.justify-between
      // q-card.bg-dark.q-mb-sm.q-mb-lg(v-for="association in myAssociations", style="width: 46%;")
      q-card.bg-dark.q-mb-sm.q-mb-lg(v-for="association in associations", style="width: 46%;")
        // p.q-pa-md.text-center(@click="$router.push('/clouds/' + association._id + '/responses')")
          span.q-mr-md
        q-card-main
          div(@click="$router.push('/clouds/' + association._id + '/responses')")
            p(v-for="word in association.value") {{ word }}
        q-card-actions
          q-btn(@click="togglePublicity(association._id)", icon="people", size="sm")
          q-btn(@click="$router.push('/clouds/' + association._id + '/responses')", icon="chat", size="sm")
            q-chip(floating, color="blue") 0
          q-btn(@click="deleteItem(association._id)", icon="delete", size="sm")

    // FIXME: query works for Archive
      video-list-view(:videos="archiveItems",
      layoutStyle="sm",
      // :buttons="['more-delete', 'more-download']",
      // :showDuration="false",
      @changed="loadData")
</template>

<script>
  // import ConfirmModal from '../components/ConfirmModal'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib/video-helper'
  import VideoListView from '../VideoListView'

  // const UI_RESIZER_FACTOR = 2

  export default {
    components: {
      // MrGriddleModal
      // ConfirmModal
      VideoListView
    },
    data () {
      return {
        // archiveItems: undefined,
        associations: [],
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
      async deleteItem (val) {
        console.log('deleteItem', val)
        await this.$store.dispatch('cloud/delete', val)
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

<style scoped>
</style>
