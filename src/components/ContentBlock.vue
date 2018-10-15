<template lang="pug">
  q-card.q-mb-md.q-mx-md
    q-card-title.q-px-none.q-pt-sm
      .float-left.q-pt-sm.q-pl-md
        slot(name="title")
      .float-right.q-pr-md
        slot(name="buttons")

    // q-card-separator.bg-grey-10

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
