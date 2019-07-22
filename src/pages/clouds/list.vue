<template lang="pug">
  q-page

    q-tabs.q-px-md.q-pt-md(animated, color="transparent", text-color="white", align="justify" v-model="selectedTab",
    style="padding-bottom: 52px;")

      q-tab.text-center.q-mb-md.round-borders-5(name="tab-2", slot="title", default,
      :class="[selectedTab === 'tab-2' ? 'bg-white text-grey-9' : 'text-grey-9']")
        q-btn.text-grey-8.q-caption.text-weight-medium.q-px-none.capitalize(label="Aktionen", flat, no-ripple)
          q-chip.bg-grey-9.text-grey-2.q-mt-sm(v-if="countAktionen > 0", floating, color="white")
            | {{ countAktionen }}

      q-tab.text-center.q-mb-md.round-borders-5(name="tab-3", slot="title",
      :class="[selectedTab === 'tab-3' ? 'bg-white text-grey-9' : 'text-grey-9']")
        q-btn.text-grey-8.q-caption.text-weight-medium.q-px-none.capitalize(label="Gestaltung", flat, no-ripple)
          q-chip.bg-grey-9.text-grey-2.q-mt-sm(v-if="countGestaltung > 0", floating, color="white")
            | {{ countGestaltung }}

      q-tab.text-center.q-mb-md.round-borders-5(name="tab-1", slot="title",
      :class="[selectedTab === 'tab-1' ? 'bg-white text-grey-9' : 'text-grey-9']")
        q-btn.text-grey-8.q-caption.text-weight-medium.q-px-none.capitalize(label="Adjektive", flat, no-ripple)
          q-chip.bg-grey-9.text-grey-2.q-mt-sm(v-if="countAdjektive > 0", floating, color="white")
            | {{ countAdjektive }}

      // --------------------------------------------------------------------------------------------- Adjektive (tab 1)
      q-tab-pane.q-px-none(keep alive, name="tab-1")

        // "add term"-block
        //
          .q-mb-md(v-if="addWordBubble")
        .q-mb-md
          q-item.q-pa-none.items-center
            q-item-main(style="max-width: 100%;")
              q-input.border-bottom.border-color-grey-4.q-px-sm.q-py-xs(v-model="inputNewWord", hide-underline,
              placeholder="neues Adjektiv",
              @focus="showIcon = false",
              @blur="showIcon = true",
              :after="[{icon: 'edit', condition: showIcon && !inputNewWord}]")
            //
              q-item-side.min-width-auto
                q-btn(@click="addWord", icon="check",
                // :disabled="!inputNewWord.length", no-caps, round, size="sm",
                // :class="[inputNewWord.length ? 'bg-white text-grey-10' : 'text-white']")

            q-item-side.min-width-auto.transition.row.self-stretch(:class="[!inputNewWord ? 'leave-right' : '']")
              .transition.q-pl-sm.items-center.row
                q-btn.bg-grey-9.text-grey-2.rotate-90(@click="addWord", icon="add", round, size="sm", flat)
                q-btn.bg-grey-9.text-grey-2.q-ml-sm(@click="inputNewWord = ''", round, icon="clear", size="sm", flat)

        q-list.q-pa-none.no-border.row.justify-between

          // show-/hide-button for "add term"-block
          //
            q-item.q-mb-md.no-padding.min-height-auto(
            style="width: 46%;")
              q-btn.full-width.bg-white.text-grey-10(@click="handlerAddWord", no-ripple)
                q-icon(v-if="addWordBubble", name="clear")
                q-icon(v-else, name="add")

          q-item.q-mb-md.shadow-2.q-pr-sm.round-borders(
          v-for="word in words", :class="[checkIfSelected(word.value) ? 'bg-grey-9 text-white' : 'bg-grey-4 text-grey-8']",
          style="width: 46%;")

            input.hidden(@click="countWords('adjektive', word.value)", v-model="selectedWords", type="checkbox", :id="word.uuid", :value="word.value")
            label.full-width(:for="word.uuid")
              | {{ word.value }}

      // ---------------------------------------------------------------------------------------------- Aktionen (tab 2)
      q-tab-pane.q-px-none(keep alive, name="tab-2")
        q-list.q-pa-none.no-border.row.justify-between

          q-item.shadow-1.round-borders(
          v-for="(mJ, index) in myJson",
          :class="[checkIfSelected(mJ.label) ? 'bg-white text-grey-8' : 'bg-grey-4 text-grey-8', {'q-mb-md': index < myJson.length - 1}]",
          style="width: 46%;")

            input.hidden(@click="countWords('aktionen', mJ.label)", v-model="selectedWords", type="checkbox",
            :id="mJ.label", :value="mJ.label")
            label.full-width(:for="mJ.label")
              | {{ mJ.label }}

      // -------------------------------------------------------------------------------------------- Gestaltung (tab 3)
      q-tab-pane.q-px-none(keep alive, name="tab-3")
        q-list.q-pa-none.no-border.row.justify-between

          q-item.shadow-1.q-pr-sm.round-borders(
          v-for="(cT, index) in cloudThree",
          :class="[checkIfSelected(cT.label) ? 'bg-white text-grey-8' : 'bg-grey-4 text-grey-8', {'q-mb-md': index < cloudThree.length - 2}]",
          style="width: 46%;")

            input.hidden(@click="countWords('gestaltung', cT.label)", v-model="selectedWords", type="checkbox", :id="cT.label", :value="cT.label")
            label.full-width(:for="cT.label")
              | {{ cT.label }}

          // q-item.q-mr-sm.q-mb-sm.shadow-2.q-pr-sm.q-mx-sm(v-for="cT in cloudThree")
            | {{ cT.label }}

      .fixed-bottom-right.q-px-md(style="height: 52px;",
      :class="[selectedWords.length < 1 ? '' : '']")

        q-btn.bg-grey-9.text-white-2(
        @click="$router.push('/clouds/overview')", flat, no-caps, icon="clear", round)

        q-btn.bg-grey-9.text-white-2.q-ml-md(
        @click="addAssociation",
        :class="[selectedWords.length < 1 ? '' : '']",
        :disabled="selectedWords.length < 1", flat, no-caps, icon="check", round)

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
        inputNewWord: undefined,
        myJson: json,
        cloudThree: wolkeDrei,
        option: '',
        publicUploads: [],
        publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
        selectedVideos: [],
        selectedWords: [],
        showOverlay: false,
        words: [],
        selectedTab: undefined,
        showIcon: false
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
