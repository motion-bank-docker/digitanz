<template lang="pug">
  q-page.row
    mr-griddle#mr-griddle-container
    mr-griddle-handler.fixed-bottom
</template>

<script>
  import MrGriddle from '../components/MrGriddle'
  import MrGriddleHandler from '../components/MrGriddleHandler'
  export default {
    components: {
      MrGriddle,
      MrGriddleHandler
    }
  }
</script>

<style lang="stylus">
  #mr-griddle-container
    width 100vw
    height calc(100vh - 120px)
</style>
