<template lang="pug">
  q-page.q-ma-lg
    // h3 {{ $t('pages.clouds.title') }}
    q-tabs(animated, swipeable, color="transparent", text-color="primary", align="justify", v-model="selectedTab")
      q-tab(default, name="tab-1", slot="title", label="Begriffe")
      q-tab(name="tab-2", slot="title", label="Videos")

      q-tab-pane(name="tab-1")
        q-list.no-border.flex.gutter-xs
          q-item.q-mr-sm.q-mb-sm.shadow-2.q-caption(v-for="word in words", :class="[checkIfSelected(word.term) ? 'bg-primary text-white' : 'bg-dark']")
            input.hidden(type="checkbox", :id="word.term", :value="word.term", v-model="selectedWords")
            label(:for="word.term")
              | {{ word.term }}
              q-btn.q-ml-md.bg-dark(v-if="word.author === user.uuid", @click="removeWord(word.id)", icon="delete", round, size="sm")
          q-item
            q-btn.bg-primary.text-white(@click="addWord", icon="add", round, size="sm")

      q-tab-pane(name="tab-2")
        q-list.no-border.flex.gutter-xs
          q-item.q-mr-sm.q-mb-sm.shadow-2.q-caption(v-for="word in selectedWords", :class="[checkIfSelected(word) ? 'bg-primary text-white' : 'bg-dark']")
            input.hidden(type="checkbox", :id="word.term", :value="word.term", v-model="selectedWords")
            label(:for="word.term")
              | {{ word }}
              q-btn.q-ml-md.bg-dark(v-if="word.author === user.uuid", @click="removeWord(word.id)", icon="delete", round, size="sm")

    .fixed-bottom.q-mb-xl.q-mx-md.q-pb-md
      q-btn.q-mb-lg.bg-primary.text-white.full-width(label="speichern")
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    // name: 'list'
    data () {
      return {
        dummyId: 0,
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
        this.dummyId++
        this.words.push({term: 'test' + this.dummyId, author: this.user.uuid, id: this.dummyId})
      },
      checkIfSelected (val) {
        return this.selectedWords.includes(val)
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
