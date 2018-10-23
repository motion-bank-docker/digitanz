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
        q-btn.q-ml-xs(v-for="n in 3", @click="setActiveStation(n)",
        :class="{'bg-primary text-white': activeStation === n}", round, size="sm") {{ n }}
      template(slot="content")
        // | {{ option }}
        // | {{ activeImpulse }}
        div(v-if="activeStation === 1")
          q-btn.full-width(@click="setImpulse('a1')", label="Öffnen und schließen",
          :class="{'bg-primary text-white': activeImpulse === 'a1'}", no-caps)
          q-btn.full-width(@click="setImpulse('a2')", label="Schwingen und fallen",
          :class="{'bg-primary text-white': activeImpulse === 'a2'}", no-caps)
          q-btn.full-width(@click="setImpulse('a3')", label="Kreisen und rollen",
          :class="{'bg-primary text-white': activeImpulse === 'a3'}", no-caps)
          //
            q-radio(v-model="option", val="opt1", label="Öffnen und schließen")
            q-radio(v-model="option", val="opt2", label="Schwingen und fallen")
            q-radio(v-model="option", val="opt3", label="Kreisen und rollen")
        div(v-if="activeStation === 2")
          q-btn.full-width(@click="setImpulse('b1')", label="Spuren nachziehen",
          :class="{'bg-primary text-white': activeImpulse === 'b1'}", no-caps)
          q-btn.full-width(@click="setImpulse('b2')", label="Malende Körperteile durch den Raum",
          :class="{'bg-primary text-white': activeImpulse === 'b2'}", no-caps)
          q-btn.full-width(@click="setImpulse('b3')", label="Bewegte/bewegende Wachsfigur",
          :class="{'bg-primary text-white': activeImpulse === 'b3'}", no-caps)
          //
            q-radio(v-model="option", val="opt4", label="Spuren nachziehen")
            q-radio(v-model="option", val="opt5", label="Malende Körperteile durch den Raum")
            q-radio(v-model="option", val="opt6", label="Bewegte/bewegende Wachsfigur")
        div(v-if="activeStation === 3")
          q-btn.full-width(@click="setImpulse('c1')", label="Wehrhaft",
          :class="{'bg-primary text-white': activeImpulse === 'c1'}", no-caps)
          q-btn.full-width(@click="setImpulse('c2')", label="Grenzsituation",
          :class="{'bg-primary text-white': activeImpulse === 'c2'}", no-caps)
          q-btn.full-width(@click="setImpulse('c3')", label="Unter Riesen",
          :class="{'bg-primary text-white': activeImpulse === 'c3'}", no-caps)
          q-btn.full-width(@click="setImpulse('c4')", label="Ausufern",
          :class="{'bg-primary text-white': activeImpulse === 'c4'}", no-caps)

          //
            q-radio(v-model="option", val="opt7", label="Wehrhaft")
            q-radio(v-model="option", val="opt8", label="Grenzsituation")
            q-radio(v-model="option", val="opt9", label="Unter Riesen")
            q-radio(v-model="option", val="opt10", label="Ausufern")

        // q-tabs
          q-tab.bg-dark(name="tab-1", slot="title", label="A", default)
          q-tab.bg-dark(name="tab-2", slot="title", label="B")
          q-tab.bg-dark(name="tab-3", slot="title", label="C")

          q-tab-pane(name="tab-1")
            q-radio(v-model="option", val="opt1", label="Öffnen und schließen")
            q-radio(v-model="option", val="opt2", label="Schwingen und fallen")
            q-radio(v-model="option", val="opt3", label="Kreisen und rollen")
          q-tab-pane(name="tab-2")
            q-radio(v-model="option", val="opt4", label="Spuren nachziehen")
            q-radio(v-model="option", val="opt5", label="Malende Körperteile durch den Raum")
            q-radio(v-model="option", val="opt6", label="Bewegte/bewegende Wachsfigur")
          q-tab-pane(name="tab-3")
            q-radio(v-model="option", val="opt7", label="Wehrhaft")
            q-radio(v-model="option", val="opt8", label="Grenzsituatiion")
            q-radio(v-model="option", val="opt9", label="Unter Riesen")
            q-radio(v-model="option", val="opt10", label="Ausufern")

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
      template(slot="title") Geteilte Videos
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
            q-btn.q-px-none(flat, size="sm" round, icon="check", color="white", @click="")

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
        activeImpulse: '',
        activeStation: 1,
        addWordModal: false,
        dummyId: 0,
        inputNewWord: '',
        option: '',
        publicUploads: [],
        publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
        selectedVideos: [],
        selectedWords: [],
        showOverlay: false,
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
