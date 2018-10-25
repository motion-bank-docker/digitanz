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

  import CloudListView from '../CloudListView'

  export default {
    components: {
      CloudListView
    },
    data () {
      return {
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
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.associations = await this.$store.dispatch('cloud/listPublicAssociations', this.user.uuid)
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped>
</style>
