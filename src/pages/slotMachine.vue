<template lang="pug">

  // THIS PAGE IS NOT FINISHED YET
  q-page
    q-modal(v-model="opened")
      div.q-px-xl
        h1.q-title Ausgewählte Symbole
        div
          q-list.row.no-border
            q-item.col-3(
            v-for="(symbol,index) in symbolList"
            :key="symbol.id")
              q-checkbox(v-model="checkArray" :val="index" style="margin-left: 10px") {{ symbol.title }}
        h1.q-title Anzahl der Felder
        q-slider(v-model="marker" :min="1" :max="8" :step="1" label snap markers)
        q-btn(
          color="primary"
          @click="opened = false"
          label="Close")

    div.row
      q-list.col-sm-3.items-center(separator)
          q-item.outline.border(v-for="n in marker") {{ checkArray[newQuoteIndex] }}
    q-btn.q-ma-xl.self-center(@click="newQuoteIndex = Math.floor(Math.random() * checkArray.length)" color="primary") Random
    p {{ newQuoteIndex }}
    q-btn.fixed-bottom.full-width(icon="settings" @click="opened = true" outline)
    p {{ checkArray }}
</template>

<script>
  import {QInput, QBtn, QList, QItem, QPage, QItemMain, QItemSide, QSlider, QChip, QCheckbox, QModal, QModalLayout, QToolbar, QToolbarTitle, QSearch, QCard, QCardTitle, QCardMain, QCardMedia, QCardSeparator, QCardActions} from 'quasar'
  export default {
    name: 'slotMachine',
    components: {
      QInput,
      QBtn,
      QList,
      QItem,
      QPage,
      QItemMain,
      QItemSide,
      QSlider,
      QChip,
      QCheckbox,
      QModal,
      QModalLayout,
      QToolbar,
      QToolbarTitle,
      QSearch,
      QCard,
      QCardTitle,
      QCardMain,
      QCardMedia,
      QCardSeparator,
      QCardActions
    },
    data () {
      return {
        search: '',
        opened: true,
        checkArray: [],
        availableSymbols: [],
        chosenSymbols: [],
        oldQuoteIndex: -1,
        newQuoteIndex: '',
        symbolList: [
          {title: 'one'
          },
          {title: 'two'
          },
          {title: 'three'
          },
          {title: 'four'
          },
          {title: 'five'
          },
          {title: 'six'
          },
          {title: 'seven'
          },
          {title: 'eight'
          },
          {title: 'nine'
          },
          {title: 'ten'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
