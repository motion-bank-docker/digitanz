<template lang="pug">
  .full-width
    q-window-resize-observable(@resize="onResize")

    // size sm
    .row.justify-between.q-px-md(v-if="layoutStyle === 'sm'", ref="mega")
      mr-griddle-preview(
      v-for="(item, i) in items",
      :item="item",
      :play="true",
      :states="itemStates[i]",
      :requestedWidth="itemWidth",
      :requestedHeight="itemWidth",
      :hideButtons="hideButtons",
      :buttons="buttons",
      style="width: 46%")
        template(slot="customButtons", slot-scope="{ item }")
          slot(name="customButtons", :item="item")
          mr-griddle-modal(ref="mrGriddleModal", :item="mrGriddle")

    q-window-resize-observable(@resize="setPreviewWidth()")
</template>

<script>
  import MrGriddleModal from './MrGriddleModal'
  import MrGriddlePreview from './MrGriddlePreview'

  export default {
    components: {
      MrGriddleModal,
      MrGriddlePreview
    },
    props: {
      // sm, md, l, xl ?
      layoutStyle: String,
      buttons: Array,
      hideButtons: undefined,
      items: undefined
    },
    data () {
      return {
        previewWidth: 167,
        itemStates: [],
        itemWidth: undefined
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
      // openModal () {
      //   console.log('bla')
      //   this.$refs.mrGriddleModal.show()
      // },
      onResize () {
        this.itemWidth = (window.innerWidth > 0) ? ((window.innerWidth - 16 * 4) / 100 * 46) : (screen.width / 100 * 46)
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

<style lang="stylus" scoped>

</style>
