<template lang="pug">
  q-card.q-mt-md.no-shadow
    q-card-title.q-px-none.q-pt-sm
      .float-left.q-pt-sm(style="line-height: 1.4rem;")
        slot(name="title")
      .float-right
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
