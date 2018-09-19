<template lang="pug">
  q-page.row
    mr-griddle#mr-griddle-container(ref="mrGriddleContainer"
      :play="playing"  @stateChanged="handleStateChanged")
    mr-griddle-handler.fixed-bottom(:states="storedStates"
      @clickPlay="handleClickPlay" @clickAdd="handleClickAdd" @deleteItem="handleDeleteItem")
</template>

<script>
  import MrGriddle from '../components/MrGriddle'
  import MrGriddleHandler from '../components/MrGriddleHandler'
  export default {
    components: {
      MrGriddle,
      MrGriddleHandler
    },
    data () {
      return {
        playing: false,
        storedStates: []
      }
    },
    methods: {
      handleClickPlay () {
        this.playing = !this.playing
      },
      handleClickAdd () {
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.handleStoreState()
        this.storedStates = _griddle.storedStates
      },
      handleStateChanged () {
        this.playing = false
      },
      handleDeleteItem (item) {
        console.log('remove item', item)
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.handleRemoveStoredState(item.index)
      }
    }
  }
</script>

<style lang="stylus">
  #mr-griddle-container
    width 100vw
    height calc(100vh - 120px)
</style>
