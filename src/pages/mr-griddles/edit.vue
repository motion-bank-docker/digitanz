<template lang="pug">
  q-page.bg-grey-3.relative-position.overflow-hidden.min-height-auto
    mr-griddle#mr-griddle-container(
    ref="mrGriddleContainer",
    :play="playing",
    :states="storedStates",
    @clickPlay="handleClickPlay",
    @stateChanged="handleStateChanged",
    @editModeChanged="handleEditChange")

    .fixed-bottom.transition(:class="{'leave-bottom' : editMode}")
      mr-griddle-handler(
      :play="playing",
      :states="storedStates",
      :currentState="currentState",
      @clickPlay="handleClickPlay",
      @clickAdd="handleClickAdd",
      @clickState="handleClickState",
      @deleteItem="handleDeleteItem",
      @saveSequence="handeSaveSequence")
</template>

<script>
  import MrGriddle from '../../components/MrGriddle'
  import MrGriddleHandler from '../../components/MrGriddleHandler'
  export default {
    components: {
      MrGriddle,
      MrGriddleHandler
    },
    data () {
      return {
        playing: false,
        editMode: false,
        storedStates: [],
        currentState: -1
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
        if (state === -1) this.playing = false
        const _griddle = this.$refs.mrGriddleContainer
        this.storedStates = _griddle.storedStates
        this.currentState = state
      },
      handleEditChange (val) {
        this.editMode = val
      },
      handleDeleteItem (item) {
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.handleRemoveStoredState(item.index)
      },
      handleClickState (item) {
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.setCurrentState(item.index)
      },
      handeSaveSequence () {
        const _griddle = this.$refs.mrGriddleContainer
        _griddle.saveSequence()
      }
    }
  }
</script>

<style lang="stylus">
  #mr-griddle-container
    width 100vw
    height calc(100vh - 52px - 50px)
    max-height calc(100vh - 52px - 50px)
</style>
