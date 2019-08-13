<template lang="pug">
  span.relative-position.text-center.q-px-xs(style="width: 2em;")
    | &nbsp;
    | {{ number }}
    | &nbsp;
    .absolute-top-left.full-width.full-height(style="width: 2em; margin-top: -5px;")
      q-spinner-puff(color="grey-1", :size="24")
</template>

<script>
  export default {
    name: 'info-number',
    props: ['number']
  }
</script>

<style scoped>
</style>
