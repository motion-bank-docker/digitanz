<template lang="pug">
  q-page.row
    mr-griddle#mr-griddle-container(ref="mrGriddleContainer"
      :play="playing"  @stateChanged="handleStateChanged")
    mr-griddle-handler.fixed-bottom(
      :play="playing" :states="storedStates"
      :currentState="currentState"
      @clickPlay="handleClickPlay"
      @clickAdd="handleClickAdd"
      @clickState="handleClickState"
      @deleteItem="handleDeleteItem")
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
        storedStates: [],
        currentState: -1
      }
    },
    watch: {
      storedStates () {
        console.log(this.storedStates)
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
      handleStateChanged (state) {
        this.playing = false
        this.currentState = state
      },
      handleDeleteItem (item) {
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.handleRemoveStoredState(item.index)
      },
      handleClickState (item) {
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.setCurrentState(item.index)
      }
    }
  }
</script>

<style lang="stylus">
  #mr-griddle-container
    width 100vw
    height calc(100vh - 120px)
</style>
