<template lang="pug">
  q-page.q-px-md
    div(v-for="association in myAssociations")
      p
        span(v-for="word in association.value") {{ word }}
      // h3.text-center {{ $t('pages.cloud.responses.title') }}
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        associations: [],
        myAssociations: [],
        target: undefined
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
        // this.target = await this.$store.dispatch('maps/get', this.$route.params._id)
        console.log('this.$route.params._id', this.$route.params._id)
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        // this.associations = await this.$store.dispatch('cloud/listAssociations')
        // console.log(query)
        this.associations = await this.$store.dispatch('cloud/listAssociations')
        this.associations.map(a => {
          if (a._id === this.$route.params._id) {
            this.myAssociations.push(a)
          }
        })
        console.debug('loaded associations', this.associations)
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped>
</style>
