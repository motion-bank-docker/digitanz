<template lang="pug">
  q-page.q-pb-sm.min-height-auto

    q-tabs(animated, color="transparent", text-color="grey-1", align="justify" v-model="selectedTab",
    style="padding-bottom: 52px;")

      q-tab.text-center.round-borders-5.q-pl-md.q-pl-md.q-pr-sm(name="tab-2", slot="title", default)
        q-btn.shadow-1.text-grey-8.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        label="Aktionen", flat, no-ripple,
        :class="[selectedTab === 'tab-2' ? 'bg-grey-1' : '']",)
          q-chip.bg-grey-8.text-grey-2.q-mt-xs(v-if="countAktionen > 0", floating, color="grey-1")
            | {{ countAktionen }}

      q-tab.text-center.round-borders-5.q-px-xs.q-py-md(name="tab-3", slot="title")
        q-btn.shadow-1.text-grey-8.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        label="Gestaltung", flat, no-ripple,
        :class="[selectedTab === 'tab-3' ? 'bg-grey-1' : '']",)
          q-chip.bg-grey-8.text-grey-2.q-mt-xs(v-if="countGestaltung > 0", floating, color="grey-1")
            | {{ countGestaltung }}

      q-tab.text-center.round-borders-5.q-pr-md.q-pl-sm(name="tab-1", slot="title")
        q-btn.shadow-1.text-grey-8.q-caption.text-weight-medium.q-px-none.capitalize.full-width.q-py-md(
        label="Adjektive", flat, no-ripple,
        :class="[selectedTab === 'tab-1' ? 'bg-grey-1' : '']",)
          q-chip.bg-grey-8.text-grey-2.q-mt-xs(v-if="countAdjektive > 0", floating, color="grey-1")
            | {{ countAdjektive }}

      // --------------------------------------------------------------------------------------------- Adjektive (tab 1)
      q-tab-pane.q-px-sm.q-pt-none(keep alive, name="tab-1")

        //----- list
        q-list.q-pa-none.no-border.row
          .col-6.q-px-sm(v-for="term in tempTerms")

            q-item.q-mb-md.shadow-1.round-borders.q-caption.bg-e4(
            :class="[checkIfSelected(term) ? 'bg-grey-1 text-grey-9' : 'text-grey-8']")

              input.hidden(@click="countWords('adjektive', term)", v-model="selectedWords", type="checkbox", :id="term", :value="term")
              label.full-width(:for="term")
                | {{ term }}

        //----- "add term"-block
        .q-mb-md.q-px-sm
          q-item.q-pa-none.items-center
            q-item-main(style="max-width: 100%;")
              q-input.border-bottom.border-color-grey-4.q-px-sm.q-py-xs(v-model="inputNewWord", hide-underline,
              placeholder="neues Adjektiv",
              @focus="showIcon = false",
              @blur="showIcon = true",
              :after="[{icon: 'edit', condition: showIcon && !inputNewWord}]")
            q-item-side.min-width-auto.transition.row.self-stretch(:class="[!inputNewWord ? 'leave-right' : '']")
              .transition.q-pl-sm.items-center.row
                q-btn.bg-grey-9.text-grey-2.rotate-90(@click="addWord(inputNewWord)", icon="add", round, size="sm", flat)
                q-btn.bg-grey-9.text-grey-2.q-ml-sm(@click="inputNewWord = ''", round, icon="clear", size="sm", flat)

      // ---------------------------------------------------------------------------------------------- Aktionen (tab 2)
      q-tab-pane.q-px-sm.q-pt-none(keep alive, name="tab-2")
        q-list.q-pa-none.no-border.row

          .col-6.q-px-sm(v-for="(mJ, index) in myJson")
            q-item.shadow-1.round-borders.q-caption.bg-e4(
            :class="[checkIfSelected(mJ.label) ? 'bg-grey-1 text-grey-9' : 'text-grey-8', {'q-mb-md': index < myJson.length - 1}]")

              input.hidden(@click="countWords('aktionen', mJ.label)", v-model="selectedWords", type="checkbox",
              :id="mJ.label", :value="mJ.label")
              label.full-width(:for="mJ.label")
                | {{ mJ.label }}

      // -------------------------------------------------------------------------------------------- Gestaltung (tab 3)
      q-tab-pane.q-px-sm.q-pt-none(keep alive, name="tab-3")
        q-list.q-pa-none.no-border.row

          .col-6.q-px-sm(v-for="(cT, index) in cloudThree")
            q-item.shadow-1.round-borders.q-caption.bg-e4(
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
      .fixed-bottom-right.q-pa-md
        q-btn(
        @click="handlerCreateButton()",
        :class="[selectedWords.length < 1 ? '' : 'bg-grey-9 text-grey-2']",
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
      }
      else {
        this.editMode = 'new'
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
        editMode: undefined
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
        console.log('selectedWords', this.selectedWords)
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
