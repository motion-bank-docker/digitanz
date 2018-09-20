<template lang="pug">
  q-page.q-ma-lg
    h3 Deine Mr. Griddles
    mr-griddle-list-view(layout-style='sm')
</template>

<script>
  import MrGriddleListView from '../components/MrGriddleListView'

  export default {
    components: {
      MrGriddleListView
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
