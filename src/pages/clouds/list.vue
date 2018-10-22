<template lang="pug">
  q-page
    q-modal(v-model="addWordModal", minimized)
      .text-center.q-pa-md
        | {{ $t('labels.add_word') }}
        q-input(v-model="inputNewWord")
        q-btn.q-mx-xs.q-mt-sm.bg-primary.text-white(@click="addWord", label="speichern")
        q-btn.q-mx-xs.q-mt-sm.bg-dark.text-white(@click="addWordModal = false", label="abbrechen")
    // h3 {{ $t('pages.clouds.title') }}
    q-tabs(animated, swipeable, color="transparent", text-color="primary", align="justify", v-model="selectedTab")
      q-tab(default, name="tab-1", slot="title", label="Begriffe")
      q-tab(:disable="selectedWords.length <= 0", name="tab-2", slot="title", label="Videos")

      q-tab-pane.q-mx-md.q-px-none(name="tab-1")
        q-list.no-border.flex.gutter-xs.q-px-xs

          q-item.q-mr-sm.q-mb-sm.shadow-2.q-caption.q-pr-sm(
          v-for="word in words", :class="[checkIfSelected(word.term) ? 'bg-primary text-white' : 'bg-dark']")

            input.hidden(type="checkbox", :id="word.term", :value="word.term", v-model="selectedWords")
            label(:for="word.term")
              | {{ word.term }}
              q-btn.q-ml-md.bg-dark(
              v-if="word.author === user.uuid",
              @click="removeWord(word.id)",
              :disable="checkIfSelected(word.term)",
              icon="delete", round, size="sm")
          q-item
            q-btn.bg-primary.text-white(@click="addWord, addWordModal = true", icon="add", round, size="sm")

      q-tab-pane.q-mx-md.q-px-none(name="tab-2")
        q-list.no-border.flex.gutter-xs.q-px-xs

          q-item.q-mr-sm.q-mb-sm.shadow-2.q-caption.q-pr-sm(
          v-for="word in selectedWords",
          :class="[checkIfSelected(word) ? 'bg-primary text-white' : 'bg-dark']")

            input.hidden(type="checkbox", :id="word.term", :value="word.term", v-model="selectedWords")
            label(:for="word.term")
              | {{ word }}
              q-btn.q-ml-md.bg-dark(
              v-if="word.author === user.uuid",
              @click="removeWord(word.id)",
              icon="delete", round, size="sm")
        div
          video-list-view(:videos="publicUploads.items", layoutStyle="sm")

    .fixed-bottom.q-mb-xl.q-mx-md.q-pb-md(v-if="selectedWords.length > 0 && selectedVideos.length > 0")
      q-btn.q-mb-lg.bg-primary.text-white.full-width(label="speichern")
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { VideoHelper } from '../../lib'
  import VideoListView from '../../components/VideoListView'

  export default {
    components: {
      VideoListView
    },
    // name: 'list'
    mounted () {
      this.loadPublicUploads()
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
