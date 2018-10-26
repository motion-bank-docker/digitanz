<template lang="pug">
  div
    cloud-list-view(
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :items="associations",
    :showContentFlag="true",
    size="sm", @emitLoadData="loadData()")

</template>

<script>
  import { mapGetters } from 'vuex'

  import CloudListView from '../CloudListView'

  export default {
    components: {
      // MrGriddleModal
      // ConfirmModal
      // VideoListView
      CloudListView
    },
    data () {
      return {
        associations: [],
        buttonsX: [{
          icon: 'chat',
          label: 'response'
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
      async loadData () {
        // this.myAssociations = []
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.associations = await this.$store.dispatch('cloud/listPublicAssociations')
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped>
</style>
