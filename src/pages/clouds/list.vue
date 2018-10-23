<template lang="pug">
  q-page.q-mx-md
    // confirm-modal(v-if="", ref="confirmDeleteModal", @confirm="deleteItem")

    q-modal(v-model="addWordModal", minimized)
      .text-center.q-pa-md.bg-dark
        | {{ $t('labels.add_word') }}
        q-input(v-model="inputNewWord", color="white")
        q-btn.q-mx-xs.q-mt-sm.bg-primary.text-white(@click="addWord", label="speichern")
        q-btn.q-mx-xs.q-mt-sm.bg-dark.text-white(@click="addWordModal = false, inputNewWord = ''", label="abbrechen")

    content-block.q-pt-none
      template(slot="title") Station
      template(slot="buttons")
      template(slot="content")
        q-tabs
          q-tab.bg-dark(name="tab-1", slot="title", label="A", default)
          q-tab.bg-dark(name="tab-2", slot="title", label="B")
          q-tab.bg-dark(name="tab-3", slot="title", label="C")

          q-tab-pane(name="tab-1")
            q-list.no-border.no-padding
              q-radio(v-model="option", val="opt1", label="Option 1")
              q-radio(v-model="option", val="opt2", label="Option 2")
              q-radio(v-model="option", val="opt3", label="Option 3")
          q-tab-pane(name="tab-2")
            q-list.no-border.no-padding
              q-item.bg-red(v-for="n in 3") bbbb{{ n }}
          q-tab-pane(name="tab-3")
            q-list.no-border.no-padding
              q-item.bg-red(v-for="n in 3") cccccccccc{{ n }}

    content-block.q-pt-none
      template(slot="title") Adjektive
      template(slot="buttons")
        q-btn.bg-primary.text-white.q-mt-sm(@click="addWord, addWordModal = true", icon="add", round, size="sm")
      template(slot="content")
        q-list.no-border.flex.gutter-xs.q-px-xs

          q-item.q-mr-sm.q-mb-sm.shadow-2.q-caption.q-pr-sm(
          v-for="word in words", :class="[checkIfSelected(word.term) ? 'bg-primary text-white' : 'bg-dark']")

            input.hidden(type="checkbox", :id="word.term", :value="word.term", v-model="selectedWords")
            label(:for="word.term")
              | {{ word.term }}
              //
                q-btn.q-ml-md.bg-dark(
                v-if="word.author === user.uuid",
                @click="removeWord(word.id)",
                // :disable="checkIfSelected(word.term)",
                icon="delete", round, size="sm")

    content-block
      template(slot="title") Videos
      template(slot="buttons")
      template(slot="content")
        video-list-view(
        v-if="publicUploads && publicUploads.length > 0",
        :allowSelfResponse="true",
        :buttons="['more-download', 'more-delete']",
        :showOverlay="showOverlay",
        :videos="publicUploads",
        layoutStyle="sm")
          template(slot="customButtons" slot-scope="{ video }")
            // q-btn.q-px-none(flat, size="sm" round, icon="group", color="primary", @click="togglePublic(video)")
            // q-btn.q-px-none(flat, size="sm" round, icon="group", color="primary", @click="")

    .fixed-bottom.q-mb-xl.q-mx-md.q-pb-md(v-if="selectedWords.length > 0")
      q-btn.q-mb-lg.bg-primary.text-white.full-width(label="speichern")
</template>

<script>
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
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
        addWordModal: false,
        dummyId: 0,
        inputNewWord: '',
        publicUploads: [],
        publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
        selectedVideos: [],
        selectedWords: [],
        showOverlay: true,
        words: [{
          term: 'kreativ'
        }, {
          term: 'spontan'
        }, {
          term: 'schön'
        }, {
          term: 'faszinierend'
        }, {
          term: 'gestaltend'
        }, {
          term: 'skurril'
        }, {
          term: 'inspirierend'
        }, {
          term: 'bewegungsreich'
        }, {
          term: 'infividuell'
        }, {
          term: 'abstrakt'
        }, {
          term: 'anders'
        }, {
          term: 'bunt'
        }, {
          term: 'ungewiss'
        }, {
          term: 'unkontrolliert'
        }, {
          term: 'interessant'
        }, {
          term: 'besonders'
        }, {
          term: 'einzigartig'
        }, {
          term: 'spontan'
        }, {
          term: 'außergewöhnlich'
        }, {
          term: 'geheimnisvoll'
        }, {
          term: 'verrückt'
        }, {
          term: 'spannend'
        }, {
          term: 'cool'
        }]
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      addWord () {
        // FIXME: this is just dummy code
        this.addWordModal = false
        this.dummyId++
        this.words.push({term: this.inputNewWord, author: this.user.uuid, id: this.dummyId})
        this.inputNewWord = ''
      },
      checkIfSelected (val) {
        return this.selectedWords.includes(val)
      },
      async loadData () {
        this.isLoading = true
        this.$q.loading.show({ message: this.$t('messages.loading_sequences') })
        const query = {
          'target.id': this.publicUploadsMapUUID,
          'author.id': this.user.uuid
        }
        this.publicUploads = await VideoHelper.fetchVideoItems(this, query)

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
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
