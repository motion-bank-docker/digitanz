<template lang="pug">
  q-page

    q-tabs(animated, color="transparent", text-color="white", align="justify" v-model="selectedTab",
    style="padding-bottom: 52px;")

      q-tab.text-center.border-bottom(name="tab-1", slot="title", default)
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Adjektive", flat, no-ripple)
          q-chip.text-grey-10.q-mt-sm(v-if="countAdjektive > 0", floating, color="white")
            | {{ countAdjektive }}

      q-tab.text-center.border-bottom(name="tab-2", slot="title")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Aktionen", flat, no-ripple)
          q-chip.text-grey-10.q-mt-sm(v-if="countAktionen > 0", floating, color="white")
            | {{ countAktionen }}

      q-tab.text-center.border-bottom(name="tab-3", slot="title")
        q-btn.q-caption.text-weight-medium.q-px-none.capitalize(label="Gestaltung", flat, no-ripple)
          q-chip.text-grey-10.q-mt-sm(v-if="countGestaltung > 0", floating, color="white")
            | {{ countGestaltung }}

      // --------------------------------------------------------------------------------------------- Adjektive (tab 1)
      q-tab-pane.q-pa-md(keep alive, name="tab-1")

        // "add term"-block
        //
          .q-mb-md(v-if="addWordBubble")
        .q-mb-md
          .q-caption.q-mb-xs Begriff hinzufügen:
          q-item.q-pa-none.items-center
            q-item-main.q-pr-sm
              q-input.bg-grey-9.round-borders.q-px-sm.q-py-xs(v-model="inputNewWord", dark, hide-underline)
            q-item-side.min-width-auto
              q-btn.bg-white.text-grey-10(@click="addWord", icon="check",
              :disabled="!inputNewWord.length", no-caps, round, size="sm")

        q-list.q-pa-none.no-border.row.justify-between

          // show-/hide-button for "add term"-block
          //
            q-item.q-mb-md.no-padding.min-height-auto(
            style="width: 46%;")
              q-btn.full-width.bg-white.text-grey-10(@click="handlerAddWord", no-ripple)
                q-icon(v-if="addWordBubble", name="clear")
                q-icon(v-else, name="add")

          q-item.q-mb-md.shadow-2.q-pr-sm.round-borders(
          v-for="word in words", :class="[checkIfSelected(word.value) ? 'bg-grey-9 text-white' : 'bg-dark']",
          style="width: 46%;")

            input.hidden(@click="countWords('adjektive', word.value)", v-model="selectedWords", type="checkbox", :id="word.uuid", :value="word.value")
            label.full-width(:for="word.uuid")
              | {{ word.value }}

      // ---------------------------------------------------------------------------------------------- Aktionen (tab 2)
      q-tab-pane.q-pa-md(keep alive, name="tab-2")
        q-list.q-pa-none.no-border.row.justify-between

          q-item.shadow-2.round-borders(
          v-for="(mJ, index) in myJson",
          :class="[checkIfSelected(mJ.label) ? 'bg-grey-9 text-white' : 'bg-dark', {'q-mb-md': index < myJson.length - 1}]",
          style="width: 46%;")

            input.hidden(@click="countWords('aktionen', mJ.label)", v-model="selectedWords", type="checkbox",
            :id="mJ.label", :value="mJ.label")
            label.full-width(:for="mJ.label")
              | {{ mJ.label }}

      // -------------------------------------------------------------------------------------------- Gestaltung (tab 3)
      q-tab-pane.q-pa-md(keep alive, name="tab-3")
        q-list.q-pa-none.no-border.row.justify-between

          q-item.shadow-2.q-pr-sm.round-borders(
          v-for="(cT, index) in cloudThree",
          :class="[checkIfSelected(cT.label) ? 'bg-grey-9 text-white' : 'bg-dark', {'q-mb-md': index < cloudThree.length - 2}]",
          style="width: 46%;")

            input.hidden(@click="countWords('gestaltung', cT.label)", v-model="selectedWords", type="checkbox", :id="cT.label", :value="cT.label")
            label.full-width(:for="cT.label")
              | {{ cT.label }}

          // q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm.q-mx-sm(v-for="cT in cloudThree")
            | {{ cT.label }}

      .fixed-bottom.bg-dark.border-top.items-center.row.q-px-md(style="height: 52px;",
      :class="[selectedWords.length < 1 ? 'border-top' : 'bg-white text-grey-10']")
        .row.full-width.items-center
          .col-6.border-right.q-pr-md
            q-btn.text-white.full-width(
            @click="$router.push('/clouds/overview')", flat, no-caps, label="Cancel")

          .col-6.q-pl-md
            q-btn.text-white.bg-white.full-width(
            @click="addAssociation",
            :class="[selectedWords.length < 1 ? 'bg-transparent' : 'bg-white text-grey-10']",
            :disabled="selectedWords.length < 1", flat, no-caps, label="Speichern")

</template>

<script>
  import { mapGetters } from 'vuex'
  import ConfirmModal from '../../components/ConfirmModal'
  import VideoListView from '../../components/VideoListView'
  import json from '../../components/json/aktionsbegriffe.json'
  import wolkeDrei from '../../components/json/wolkeDrei.json'

  export default {
    components: {
      ConfirmModal,
      VideoListView
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
      this.myJson.sort(function (a, b) {
        var nameA = a.label.toUpperCase()
        var nameB = b.label.toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
      this.cloudThree.sort(function (a, b) {
        var nameA = a.label.toUpperCase()
        var nameB = b.label.toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
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
      clearSelection () {
        this.selectedWords = []
      },
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
        this.words.sort(function (a, b) {
          var nameA = a.value.toUpperCase()
          var nameB = b.value.toUpperCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          return 0
        })
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
