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
          // mr-griddle-modal(ref="mrGriddleModal", :item="mrGriddle")

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
        for (let item of this.items) {
          if (item) {
            const stateAnnot = await this.$store.dispatch('annotations/find', {
              'target.id': item.target.id,
              'body.purpose': {
                $ne: 'commenting'
              }
            })
            const states = stateAnnot.items.map(a => {
              return JSON.parse(a.body.value)
            })
            allStates.push(states)
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
