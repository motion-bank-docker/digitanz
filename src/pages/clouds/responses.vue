<template lang="pug">
  q-page.q-ma-md
    q-card.bg-dark.q-pa-md.text-center
      | noch kein Video
    q-btn.full-width.q-my-md(
    dark, color="primary", @click="uploadResponse")
      | {{ $t('buttons.upload_remix') }}
    q-card.bg-dark
      q-list.no-border(v-for="association in myAssociations")
        q-item(
        v-for="word in association.value") {{ word }}
        // q-btn(@click="removeAssociation(association.uuid)") REMOVE
    // div(v-for="association in myAssociations")
      p
        span(v-for="word in association.value") {{ word }}

      // h3.text-center {{ $t('pages.cloud.responses.title') }}
      //
        q-list.no-border.flex.gutter-xs.q-px-xs

          q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm(
          v-for="word in words", :class="[checkIfSelected(word.value) ? 'bg-grey-9 text-white' : 'bg-dark']")

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
      },
      async uploadResponse () {
        console.log('uploadResponse')
        // FIXME: copied code, not working here
        /*
        this.$refs.uploadRemixModal.show({
          id: this.target.id,
          type: 'Timeline'
        })
        const message = {
          portrait: this.target.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
        */
      },
      async removeAssociation (uuid) {
        await this.$store.dispatch('cloud/removeAssociation', uuid)
        await this.loadData()
      }
    }
  }
</script>

<style scoped>
</style>
