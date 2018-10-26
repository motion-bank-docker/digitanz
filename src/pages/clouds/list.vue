<template lang="pug">
  q-page.q-mx-md
    content-block.q-pt-none
      template(slot="title") Wortwolke
      template(slot="buttons")
        q-btn.bg-primary.text-white.q-mt-sm(
        :class="{'rotate-45': addWordBubble}",
        @click="handlerAddWord",
        icon="add", round, size="sm")

      template(slot="content")
        q-card.bg-dark.q-mb-md(v-if="addWordBubble")
          q-card-main.q-pa-sm
            q-input(v-model="inputNewWord", dark, float-label="Begriff hinzufügen")
          q-card-actions
            q-btn.q-mx-xs.q-mt-sm.bg-primary.text-white.full-width(@click="addWord", label="Wort hinzufügen")
            // q-btn.q-mx-xs.q-mt-sm.bg-dark.text-white(@click="addWordBubble = false, inputNewWord = ''", label="abbrechen")

        q-list.no-border.flex.gutter-xs.q-px-xs

          q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm(
          v-for="word in words", :class="[checkIfSelected(word.value) ? 'bg-grey-9 text-white' : 'bg-dark']")

            input.hidden(v-model="selectedWords", type="checkbox", :id="word.uuid", :value="word.value")
            label(:for="word.uuid")
              | {{ word.value }}

    q-btn.full-width.q-mb-md.text-white(
    @click="addAssociation",
    :class="[selectedWords.length < 2 ? 'bg-grey-9' : 'bg-primary']",
    :disabled="selectedWords.length < 2",
    label="Wortwolke erstellen")

</template>

<script>
  import { mapGetters } from 'vuex'
  import ConfirmModal from '../../components/ConfirmModal'
  import ContentBlock from '../../components/ContentBlock'
  import VideoListView from '../../components/VideoListView'

  export default {
    components: {
      ConfirmModal,
      ContentBlock,
      VideoListView
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    data () {
      return {
        activeImpulse: '',
        addWordBubble: false,
        dummyId: 0,
        inputNewWord: '',
        option: '',
        publicUploads: [],
        publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
        selectedVideos: [],
        selectedWords: [],
        showOverlay: false,
        words: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      async addWord () {
        this.$q.loading.show({ message: this.$t('messages.saving') })
        await this.$store.dispatch('cloud/addWord', this.inputNewWord)
        this.$q.loading.hide()
        this.inputNewWord = ''
        await this.loadData()
      },
      async addAssociation () {
        this.$q.loading.show({ message: this.$t('messages.saving') })
        const result = await this.$store.dispatch('cloud/addAssociation', this.selectedWords)
        this.$q.loading.hide()
        this.$router.push('/clouds/' + result.uuid + '/responses')
      },
      checkIfSelected (val) {
        return this.selectedWords.includes(val)
      },
      handlerAddWord () {
        this.inputNewWord = ''
        this.addWordBubble = !this.addWordBubble
      },
      async loadData () {
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.words = await this.$store.dispatch('cloud/listWords')
        this.$q.loading.hide()
      },
      async loadPublicUploads () {
        const query = {
          'target.id': this.publicUploadsMapUUID,
          'author.id': this.user.uuid
        }
        this.publicUploads = await this.$store.dispatch('annotations/find', query)
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
