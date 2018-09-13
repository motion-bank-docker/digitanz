<template lang="pug">
  q-card.q-mb-md.q-mx-md
    .row.q-mx-md
      q-item.full-width.no-padding
        q-item-main.no-padding
          q-item-tile
            slot(name="title")
          q-item-tile
            slot(name="description")
        // q-item-side.no-padding.q-caption.text-right
          slot(name="date")
      slot(name="sublabel")
    slot(name="content").bg-grey-4
    // .row.q-ma-md
      slot(name="buttons")
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
