<template lang="pug">
  q-page.q-pb-sm.min-height-auto

    q-tabs(v-model="selectedTab", animated, color="transparent", text-color="grey-1", align="justify",
    style="padding-bottom: 52px;")

      // ---------------------------------------------------------------------------------------------------------- tabs

      q-tab.capitalize.q-caption.text-weight-medium.q-mb-md.text-center.q-pa-none.text-grey-9.q-pr-sm.relative-position(
      name="tab-2", slot="title", :class="[selectedTab === 'tab-2' ? 'bg-grey-1' : '']",
      label="Aktionen", default)
        .absolute-top-right.q-caption.q-ma-sm.q-px-xs.round-borders.inactive(v-if="countAktionen > 0",
        :class="[selectedTab === 'tab-2' ? '' : '']")
          | {{ countAktionen }}

      q-tab.capitalize.q-caption.text-weight-medium.q-mb-md.text-center.q-pa-none.text-grey-9.q-pr-sm.relative-position(
      name="tab-3", slot="title", :class="[selectedTab === 'tab-3' ? 'bg-grey-1' : '']",
      label="Gestaltung")
        .absolute-top-right.q-caption.q-ma-sm.q-px-xs.round-borders.inactive(v-if="countGestaltung > 0",
        :class="[selectedTab === 'tab-3' ? '' : '']")
          | {{ countGestaltung }}

      q-tab.capitalize.q-caption.text-weight-medium.q-mb-md.text-center.q-pa-none.text-grey-9(
      name="tab-1", slot="title", :class="[selectedTab === 'tab-1' ? 'bg-grey-1' : '']",
      label="Eigene")
        .absolute-top-right.q-caption.q-ma-sm.q-px-xs.round-borders.inactive(v-if="countAdjektive > 0",
        :class="[selectedTab === 'tab-1' ? '' : '']")
          | {{ countAdjektive }}

      // --------------------------------------------------------------------------------------------- Adjektive (tab 3)
      q-tab-pane.q-px-sm.q-pt-none(keep alive, name="tab-1")

        //----- list
        q-list.q-pa-none.no-border.row
          .col-6.q-px-sm(v-for="(term, index) in tempTerms")

            q-item.q-px-sm.q-mb-md.round-borders.q-caption.bg-e4.relative-position.overflow-hidden(
            :class="[checkIfSelected(term) ? 'bg-grey-1 text-grey-9' : 'text-grey-8']")

              input.hidden(@click="countWords('adjektive', term)", v-model="selectedWords", type="checkbox", :id="term", :value="term")
              label.full-width(:for="term")
                | {{ term }}

              .absolute-right.q-pt-xs.q-pr-xs.transition(:class="[checkIfSelected(term) ? '' : 'leave-right']")

                template(v-if="countCustomTermUsages(term) <= 0")
                  q-btn.bg-grey-3.text-grey-9.shadow-1(@click="deleteCustomTerm(term, index)", size="sm", flat, round)
                    q-icon(name="delete", size="16px")

                template(v-else)
                  q-btn.bg-grey-3.text-grey-9.shadow-1.inactive(@click="", size="sm", flat, round)
                    q-icon(name="delete", size="16px")
                    q-popover.q-pa-md.q-caption.full-width.custom-term-usage(
                    anchor="bottom middle", self="top middle")
                      | Dieser Begriff kann nicht gelöscht werden, da er in einer anderen Wolke in Verwendung ist.

        //----- "add term"-block
        .q-mb-md.q-px-sm
          q-item.q-pa-none.round-borders.overflow-hidden.min-height-auto.q-py-sm(
          :class="[showIcon && !inputNewWord ? 'bg-e4' : 'bg-grey-1']", multiline)

            //----- input-field
            q-item-main(style="max-width: 100%;")
              q-input.q-px-sm.q-py-xs(v-model="inputNewWord", hide-underline,
              placeholder="neuer Begriff",
              type="textarea",
              @focus="showIcon = false",
              @blur="showIcon = true",
              :after="[{icon: 'edit', condition: showIcon && !inputNewWord}]")

            //----- buttons
            q-item-side.min-width-auto.transition.q-mr-sm(:class="[!inputNewWord ? 'leave-right' : '']")
              q-btn.text-grey-9.bg-grey-3.shadow-1(@click="addWord(inputNewWord)", round, size="sm", flat)
                q-icon(name="add", size="16px")
              q-btn.text-grey-9.bg-grey-3.shadow-1.q-ml-sm(@click="inputNewWord = ''", round, size="sm", flat)
                q-icon(name="clear", size="16px")

      // ---------------------------------------------------------------------------------------------- Aktionen (tab 1)
      q-tab-pane.q-px-sm.q-pt-none(keep alive, name="tab-2")
        q-list.q-pa-none.no-border.row

          .col-6.q-px-sm(v-for="(mJ, index) in myJson")
            q-item.q-px-sm.round-borders.q-caption.bg-e4(
            :class="[checkIfSelected(mJ.label) ? 'bg-grey-1 text-grey-9' : 'text-grey-8', {'q-mb-md': index < myJson.length - 1}]")

              input.hidden(@click="countWords('aktionen', mJ.label)", v-model="selectedWords", type="checkbox",
              :id="mJ.label", :value="mJ.label")
              label.full-width(:for="mJ.label")
                | {{ mJ.label }}

      // -------------------------------------------------------------------------------------------- Gestaltung (tab 2)
      q-tab-pane.q-px-sm.q-pt-none(keep alive, name="tab-3")
        q-list.q-pa-none.no-border.row

          .col-6.q-px-sm(v-for="(cT, index) in cloudThree")
            q-item.q-px-sm.round-borders.q-caption.bg-e4(
            :class="[checkIfSelected(cT.label) ? 'bg-grey-1 text-grey-9' : 'text-grey-8', {'q-mb-md': index < cloudThree.length - 2}]")

              input.hidden(@click="countWords('gestaltung', cT.label)", v-model="selectedWords", type="checkbox", :id="cT.label", :value="cT.label")
              label.full-width(:for="cT.label")
                | {{ cT.label }}

      // ------------------------------------------------------------------------------------------------------- buttons

      //----- cancel
      .fixed-bottom-left.q-pa-md
        q-btn.bg-grey-9.text-grey-1(
        @click="$router.push('/clouds/overview')", flat, no-caps, icon="clear", round)

      //----- add/save
      .fixed-bottom-right.q-pb-md
        .relative-position
          .absolute-position.transition.q-mr-md(:class="[selectedWords.length < 1 || inputNewWord ? 'leave-right' : '']")
            q-btn.bg-grey-9.text-grey-2(
            @click="handlerCreateButton()",
            :disabled="selectedWords.length < 1", flat, no-caps, round)
              q-icon(v-if="editMode === 'edit'", name="check")
              q-icon(v-if="editMode === 'new'", name="add")

</template>

<script>
  import { mapGetters } from 'vuex'
  import VideoListView from '../../components/VideoListView'
  import json from '../../components/json/aktionsbegriffe.json'
  import wolkeDrei from '../../components/json/wolkeDrei.json'

  export default {
    components: {
      VideoListView
    },
    async mounted () {
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

      if (this.cloudIndex !== undefined) {
        this.editMode = 'edit'

        let arrMyJson = this.myJson.map(item => { return item.label })
        let arrCloudThree = this.cloudThree.map(item => { return item.label })
        let arrTempTerms = this.tempTerms.map(item => { return item })

        let cloud = this.tempClouds[this.cloudIndex]
        cloud.forEach(item => {
          this.selectedWords.push(item)
          if (arrMyJson.includes(item)) this.countAktionen++
          if (arrCloudThree.includes(item)) this.countGestaltung++
          if (arrTempTerms.includes(item)) this.countAdjektive++
        })

        this.tempClouds.forEach((item, index) => {
          if (index !== this.cloudIndex) this.otherClouds.push(item)
        })
      }
      else {
        this.editMode = 'new'
        this.otherClouds = this.tempClouds
      }
    },
    data () {
      return {
        countAdjektive: 0,
        countAktionen: 0,
        countGestaltung: 0,
        inputNewWord: undefined,
        myJson: json,
        cloudThree: wolkeDrei,
        option: '',
        selectedVideos: [],
        selectedWords: [],
        selectedTab: undefined,
        showIcon: true,
        editMode: undefined,
        otherClouds: []
      }
    },
    computed: {
      ...mapGetters({
        tempTerms: 'cloud/getTempTerms',
        tempClouds: 'cloud/getTempClouds',
        cloudIndex: 'cloud/getCloudIndex'
      })
    },
    methods: {
      countCustomTermUsages (term) {
        let counter = 0
        this.otherClouds.map(cloud => {
          if (cloud.includes(term)) counter++
        })
        return counter
      },
      deleteCustomTerm (term, index) {
        let termIndex = this.selectedWords.findIndex(item => item === term)
        this.selectedWords.splice(termIndex, 1)
        this.tempTerms.splice(index, 1)
        this.countAdjektive--
      },
      handlerCreateButton () {
        if (this.editMode === 'new') this.addTempCloud()
        else this.saveEditedWord()
      },
      saveEditedWord () {
        this.tempClouds.splice(this.cloudIndex, 1, this.selectedWords)
        this.$router.push('/clouds/overview')
      },
      addTempCloud () {
        this.$store.commit('cloud/addToTempClouds', this.selectedWords)
        this.selectedWords = []
        this.countAdjektive = this.countAktionen = this.countGestaltung = 0
        this.$router.push('/clouds/overview')
      },
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
      addWord (val) {
        this.$store.commit('cloud/addToTempTerms', val)
        this.inputNewWord = ''
      },
      checkIfSelected (val) {
        return this.selectedWords.includes(val)
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>

<style lang="stylus">
  .q-popover.custom-term-usage
    max-width calc(100vw - 16px - 16px)!important
    margin-left 16px
    left 16px!important
</style>
