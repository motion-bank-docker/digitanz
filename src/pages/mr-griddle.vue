<template lang="pug">
  q-page.row.justify-end
    mr-griddle(style="height: 90vh; width: 100vw")
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
