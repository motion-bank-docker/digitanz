<template lang="pug">
  q-page.q-px-md
    div(v-for="association in associations")
      p
        span(v-for="word in association.value") {{ word }}
      // h3.text-center {{ $t('pages.cloud.responses.title') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        associations: []
      }
    },
    async mounted () {
      await this.loadData()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        await this.loadData()
      }
    },
    methods: {
      async loadData () {
        if (!this.user) return
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.associations = await this.$store.dispatch('cloud/listAssociations')
        console.debug('loaded associations', this.associations)
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped>
</style>
