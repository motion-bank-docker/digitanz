<template lang="pug">
  div.full-width
    // size sm
    div.row.justify-between(v-if="layoutStyle === 'sm'")
      mr-griddle#mr-griddle-container(ref="mrGriddleContainer"
                                      :play="playing"
                                      :requestedWidth="300"
                                      :requestedHeight="300")
        template(slot="customButtons" slot-scope="{ video }")
          slot(name="customButtons" :video="video")

</template>

<script>
  import MrGriddle from './MrGriddle'

  export default {
    components: {
      VideoItem,
      MrGriddle
    },
    props: {
      // sm, md, l, xl ?
      layoutStyle: String,
      buttons: Array,
      hideButtons: undefined
    },
    data () {
      return {
        foo: false
      }
    },
    methods: {
      changed () {
        this.$emit('changed')
      },
      setKey (video) {
        return video.annotation ? video.annotation.uuid : '001'
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
