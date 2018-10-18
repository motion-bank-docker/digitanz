<template lang="pug">
  .full-width
    q-window-resize-observable(@resize="onResize")

    // size sm
    .row.justify-between(v-if="layoutStyle === 'sm'", ref="mega")
      mr-griddle-item(
      v-for="(item, i) in items",
      :buttons="buttons",
      :hideButtons="hideButtons",
      :item="item",
      :buttonVisibility="buttonVisibility",
      :play="true",
      :requestedHeight="itemWidth",
      :requestedWidth="itemWidth",
      :states="itemStates[i]",
      style="width: 46%")
        template(slot="customButtons", slot-scope="{ item }")
          slot(name="customButtons", :item="item")
        template(slot="customMoreButtons", slot-scope="{ item }")
          slot(name="customMoreButtons", :item="item")

    .row.justify-between(v-if="layoutStyle === 'profile'", ref="mega")
      mr-griddle-item(
      v-for="(item, i) in items",
      :buttons="buttons",
      :hideButtons="hideButtons",
      :item="item",
      :buttonVisibility="buttonVisibility",
      :play="true",
      :requestedHeight="itemWidth",
      :requestedWidth="itemWidth",
      :states="itemStates[i]",
      style="width: 100%")
        template(slot="customButtons", slot-scope="{ item }")
          slot(name="customButtons", :item="item")
        template(slot="customMoreButtons", slot-scope="{ item }")
          slot(name="customMoreButtons", :item="item")

    q-window-resize-observable(@resize="setPreviewWidth()")
</template>

<script>
  import MrGriddleModal from './MrGriddleModal'
  import MrGriddleItem from './MrGriddleItem'

  export default {
    components: {
      MrGriddleModal,
      MrGriddleItem
    },
    props: {
      // sm, md, l, xl ?
      buttons: Array,
      buttonVisibility: undefined,
      hideButtons: undefined,
      items: undefined,
      layoutStyle: String
    },
    data () {
      return {
        itemStates: [],
        itemWidth: undefined,
        previewWidth: 167
      }
    },
    mounted () {
      this.loadItemStates()
      this.setPreviewWidth()
    },
    watch: {
      previewWidth () {},
      items () {
        this.loadItemStates()
      }
    },
    methods: {
      onResize () {
        this.itemWidth = (window.innerWidth > 0) ? ((window.innerWidth - 16 * 2) / 100 * 46) : (screen.width / 100 * 46)
      },
      async loadItemStates () {
        let allStates = []
        let targetId
        console.log('this.items', typeof this.items, this.items)
        for (let item of this.items) {
          if (item) {
            if (item.hasOwnProperty('target')) targetId = item.target.id
            else targetId = item.id
            const stateAnnot = await this.$store.dispatch('annotations/find', {
              'target.id': targetId,
              'body.purpose': {
                $ne: 'commenting'
              }
            })
            const states = stateAnnot.items.map(a => {
              return JSON.parse(a.body.value)
            })
            allStates.push(states)
          }
          else {
            console.log('öööööö')
          }
        }
        this.itemStates = allStates
      },
      changed () {
        this.$emit('changed')
      },
      setKey (video) {
        return video.annotation ? video.annotation.uuid : '001'
      },
      setPreviewWidth () {
        if (typeof this.$refs.mega !== 'undefined') {
          this.previewWidth = this.$refs.mega.offsetWidth / 2.1
        }
      }
    }
  }
</script>
