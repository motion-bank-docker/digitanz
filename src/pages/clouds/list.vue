<template lang="pug">
  q-page.q-mx-md
    // confirm-modal(v-if="", ref="confirmDeleteModal", @confirm="deleteItem")

    q-modal(v-model="addWordModal", minimized)
      // .text-center.q-pa-md.bg-dark
        | {{ $t('labels.add_word') }}
        q-input(v-model="inputNewWord", color="white")
        q-btn.q-mx-xs.q-mt-sm.bg-primary.text-white(@click="addWord", label="hinzufügen")
        q-btn.q-mx-xs.q-mt-sm.bg-dark.text-white(@click="addWordModal = false, inputNewWord = ''", label="abbrechen")

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

            input.hidden(v-model="selectedWords", type="checkbox", :id="word._id", :value="word.value")
            label(:for="word._id")
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
    // name: 'list'
    /* mounted () {
      this.loadPublicUploads()
    }, */
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    data () {
      return {
        activeImpulse: '',
        // activeStation: 1,
        // addWordModal: false,
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
        // this.addWordModal = false
        // this.dummyId++
        // this.words.push({term: this.inputNewWord, author: this.user.uuid, id: this.dummyId})
        this.$q.loading.show({ message: this.$t('messages.saving') })
        const result = await this.$store.dispatch('cloud/addWord', this.inputNewWord)
        console.debug('added word', result)
        this.$q.loading.hide()
        this.inputNewWord = ''
        await this.loadData()
      },
      async addAssociation () {
        this.$q.loading.show({ message: this.$t('messages.saving') })
        const result = await this.$store.dispatch('cloud/addAssociation', this.selectedWords)
        console.debug('added association', result)
        console.log('added association -----> ', result)
        this.$q.loading.hide()
        this.$router.push('/clouds/' + result._id + '/responses')
      },
      checkIfSelected (val) {
        return this.selectedWords.includes(val)
      },
      handlerAddWord () {
        this.inputNewWord = ''
        this.addWordBubble = !this.addWordBubble
      },
      async loadData () {
        this.isLoading = true
        this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.words = await this.$store.dispatch('cloud/listWords')
        console.debug('loaded words', this.words)
        this.$q.loading.hide()
        this.isLoading = false
      },
      async loadPublicUploads () {
        const query = {
          'target.id': this.publicUploadsMapUUID,
          'author.id': this.user.uuid
        }
        this.publicUploads = await this.$store.dispatch('annotations/find', query)
        console.log('this.publicUploads.items', this.publicUploads.items)
      },
      removeWord (val) {
        console.log(val)
        for (let i = 0; i < this.words.length; i++) {
          if (this.words[i].id === val) {
            this.words.splice(i, 1)
            break
          }
        }
      },
      setActiveStation (val) {
        // console.log(val)
        this.activeStation = val
        this.activeImpulse = ''
      },
      setImpulse (val) {
        // console.log(val)
        this.activeImpulse = val
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
