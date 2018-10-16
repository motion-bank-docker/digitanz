<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'" ref="mega")
      mr-griddle-preview(v-for="(item, i) in items"
        :item="item"
        :play="true"
        :states="itemStates[i]"
        :requestedWidth="167"
        :requestedHeight="167"
        :hideButtons="hideButtons"
        :buttons="buttons",
        style="width: 46%")
        template(slot="customButtons" slot-scope="{ item }")
          slot(name="customButtons" :item="item")

    q-window-resize-observable(@resize="setPreviewWidth()")
</template>

<script>
  import MrGriddlePreview from './MrGriddlePreview'

  export default {
    components: {
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
        itemStates: []
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
      async loadItemStates () {
        let allStates = []
        for (let item of this.items) {
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
