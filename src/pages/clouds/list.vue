<template lang="pug">
  q-page
    q-tabs(animated, swipeable, color="transparent", text-color="primary", align="justify" v-model="selectedTab")
      q-tab.text-center(default name="tab-1", slot="title")
        q-btn.q-caption.text-weight-medium.q-px-none(label="Adjektive", flat, no-ripple)
          q-chip.q-mt-sm(v-if="countAdjektive > 0", floating, color="red")
            | {{ countAdjektive }}
      q-tab.text-center(name="tab-2", slot="title")
        q-btn.q-caption.text-weight-medium.q-px-none(label="Aktionen", flat, no-ripple)
          q-chip.q-mt-sm(v-if="countAktionen > 0", floating, color="red")
            | {{ countAktionen }}
      q-tab.text-center(name="tab-3", slot="title")
        q-btn.q-caption.text-weight-medium.q-px-none(label="Gestaltung", flat, no-ripple)
          q-chip.q-mt-sm(v-if="countGestaltung > 0", floating, color="red")
            | {{ countGestaltung }}

      // GESTALTUNGSWOLKE
      //
      q-tab-pane(keep alive, name="tab-1")

        content-block.q-mx-sm.q-pt-none.q-mt-none.q-mb-xl
          // template(slot="title")
            // | Gestaltungswolke
          // template(slot="buttons")

          template(slot="content")
            q-card.bg-dark.q-mb-md.q-mt-none(v-if="addWordBubble")
              q-card-main.q-pa-sm
                q-input(v-model="inputNewWord", dark, float-label="Begriff hinzufügen")
              q-card-actions
                q-btn.q-mx-xs.q-mt-sm.bg-primary.text-white.full-width(@click="addWord", label="Wort hinzufügen")
                // q-btn.q-mx-xs.q-mt-sm.bg-dark.text-white(@click="addWordBubble = false, inputNewWord = ''", label="abbrechen")

            q-list.no-border.flex.gutter-xs.q-px-xs

              q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm
                q-btn.bg-primary.text-white(
                :class="{'rotate-45': addWordBubble}",
                @click="handlerAddWord",
                icon="add", round, size="sm")

              q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm(
              v-for="word in words", :class="[checkIfSelected(word.value) ? 'bg-grey-9 text-white' : 'bg-dark']")

                input.hidden(@click="countWords('adjektive', word.value)", v-model="selectedWords", type="checkbox", :id="word.uuid", :value="word.value")
                label(:for="word.uuid")
                  | {{ word.value }}

      // AKTIONSWOLKE
      //
      q-tab-pane(keep alive, name="tab-2")
        content-block.q-pt-none
          // template(slot="title")
            // | Aktionswolke
          // template(slot="buttons")
          template(slot="content")
            q-list.no-border.flex.gutter-xs.q-px-xs
              q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm(
              v-for="mJ in myJson", :class="[checkIfSelected(mJ.label) ? 'bg-grey-9 text-white' : 'bg-dark']")

                input.hidden(@click="countWords('aktionen', mJ.label)", v-model="selectedWords", type="checkbox", :id="mJ.label", :value="mJ.label")
                label(:for="mJ.label")
                  | {{ mJ.label }}

              // q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm.q-mx-sm(v-for="mJ in myJson")
                | {{ mJ.label }}

      // WOLKE DREI
      //
      q-tab-pane(keep alive, name="tab-3")
        content-block.q-pt-none
          // template(slot="title")
            // | Aktionswolke
          // template(slot="buttons")
          template(slot="content")
            // | > {{ countGestaltung }}
            q-list.no-border.flex.gutter-xs.q-px-xs

              q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm(
              v-for="cT in cloudThree", :class="[checkIfSelected(cT.label) ? 'bg-grey-9 text-white' : 'bg-dark']")

                input.hidden(@click="countWords('gestaltung', cT.label)", v-model="selectedWords", type="checkbox", :id="cT.label", :value="cT.label")
                label(:for="cT.label")
                  | {{ cT.label }}

              // q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm.q-mx-sm(v-for="cT in cloudThree")
                | {{ cT.label }}

      q-page-sticky.bg-dark.q-pt-md(position="bottom")
        q-btn.full-width.q-mb-md.text-white(
        @click="addAssociation",
        :class="[selectedWords.length < 2 ? 'bg-grey-9' : 'bg-primary']",
        :disabled="selectedWords.length < 2",
        expand,
        :label="$t('buttons.save_selection')")

</template>

<script>
  import { mapGetters } from 'vuex'
  import ConfirmModal from '../../components/ConfirmModal'
  import ContentBlock from '../../components/ContentBlock'
  import VideoListView from '../../components/VideoListView'
  import json from '../../components/json/aktionsbegriffe.json'
  import wolkeDrei from '../../components/json/wolkeDrei.json'

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
        countAdjektive: 0,
        countAktionen: 0,
        countGestaltung: 0,
        activeImpulse: '',
        addWordBubble: false,
        dummyId: 0,
        inputNewWord: '',
        myJson: json,
        cloudThree: wolkeDrei,
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
      countWords (target, val) {
        switch (target) {
        case 'adjektive':
          let checkAdjektive = this.selectedWords.includes(val)
          if (!checkAdjektive) this.countAdjektive++
          else this.countAdjektive--
          break
        case 'aktionen':
          let checkAktionen = this.selectedWords.includes(val)
          if (!checkAktionen) this.countAktionen++
          else this.countAktionen--
          break
        case 'gestaltung':
          let check = this.selectedWords.includes(val)
          if (!check) this.countGestaltung++
          else this.countGestaltung--
          break
        }
      },
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
