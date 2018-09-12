<template lang="pug">
  q-card.q-my-xl
    .row.q-ma-md.q-mt-lg
      slot(name="date")
      slot(name="label")
      slot(name="sublabel")
    slot(name="content")
    .row.q-ma-md
      slot(name="buttons")
</template>

<script>
  export default {
    props: {
      comp: undefined,
      date: undefined,
      label: undefined,
      sublabel: undefined,
      buttons: undefined
    }
  }
</script>

<style scoped>
</style>
