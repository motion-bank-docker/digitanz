<template lang="pug">
  q-page
    div(style="overflow: hidden; height: calc(100vh - 52px);")
      lost-in-space#lostinspace
</template>

<script>
  import LostInSpace from '../components/LostInSpace'
  export default {
    components: {
      LostInSpace
    },
    mounted () {
      this.window.scrollTo(52, 0)
    }
  }
</script>

<style lang="stylus" scoped>
  #lostinspace
    background white
</style>
