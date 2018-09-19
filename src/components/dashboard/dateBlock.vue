<template lang="pug">
  q-card.q-mb-md.q-mx-md
    q-card-title.q-pa-none
      slot(name="title")

    q-card-separator

    q-card-main.q-pt-md.q-px-none.q-pb-none
      slot(name="content")
</template>

<script>
  export default {
    props: {
      comp: undefined,
      date: undefined,
      description: undefined,
      title: undefined,
      sublabel: undefined,
      buttons: undefined
    }
  }
</script>

<style scoped>
</style>
