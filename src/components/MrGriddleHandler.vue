<template lang="pug">
  .bg-dark.row.items-center.q-pa-xs.justify-between(style="width: 100vw; height: 10vh")
    .col-xs-2.col-sm-1
      q-btn.q-ma-xs(icon="play_arrow", size="lg")
    q-list.no-border.col-xs-8.col-sm-15
      q-radio.q-mx-xs(v-for="(pose, index) in storedStates", v-model="selectedState", val="'opt' + {{index}}", size="xl")
      q-btn.q-ma-xs(icon="add", size="sm", round, style="border-style: dashed", color="grey-6", text-color="dark")
    .col-xs-2.col-sm-1
      q-btn.q-ma-xs(icon="save", size="lg")
</template>

<script>
  export default {
    data () {
      return {
        storedStates: [
          'state1', 'state2', 'state3', 'state1', 'state2'
        ]
      }
    }
  }
</script>

<style scoped>

</style>
