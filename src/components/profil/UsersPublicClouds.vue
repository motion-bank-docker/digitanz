<template lang="pug">
  div
    .text-center.q-mb-md(v-if="isLoading")
      loading-spinner
    .q-mb-md.no-content(v-else-if="associations.length <= 0 && !isLoading")
      span.text-grey-8 {{ $t('pages.profile.no_content') }}
    cloud-list-view(
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="associations",
    :size="`sm`",
    @emitLoadData="loadData()"
    )

</template>

<script>
  import { mapGetters } from 'vuex'

  import CloudListView from '../CloudListView'
  import LoadingSpinner from '../LoadingSpinner'

  export default {
    components: {
      CloudListView,
      LoadingSpinner
    },
    data () {
      return {
        isLoading: false,
        associations: [],
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
        }]
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
        if (!this.user) return
        this.isLoading = true
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.associations = await this.$store.dispatch('cloud/listPublicAssociations', this.user.uuid)
        console.log('this.associations---', this.associations)
        this.$q.loading.hide()
        this.isLoading = false
      }
    }
  }
</script>

<style scoped>
</style>
