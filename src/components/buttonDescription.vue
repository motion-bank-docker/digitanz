<template lang="pug">
  .row.full-width
    .col-1.text-center
      q-icon(:name="iconName", :size="iconSize")
    .col-11.q-pl-sm
      slot
</template>

<script>
  export default {
    name: 'button-description',
    props: ['iconName', 'iconSize'],
    mounted () {
      if (this.iconSize === undefined) this.iconSize = '14px'
    }
  }
</script>

<style scoped>

</style>
