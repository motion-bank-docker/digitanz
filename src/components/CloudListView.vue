<template lang="pug">
  .row.justify-between
    cloud-item(
    v-for="item in items",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :class="[size === 'sm' ? 'width-sm' : 'full-width']",
    :showContentFlag="showContentFlag",
    :item="item",
    @updateClouds="$emit('updateClouds')")
</template>

<script>
  import CloudItem from './CloudItem'

  export default {
    components: {
      CloudItem
    },
    props: {
      buttonsX: Array,
      buttonsY: Array,
      items: Array,
      size: undefined,
      showContentFlag: Boolean
    }
  }
</script>

<style lang="stylus" scoped>
  .width-sm
    width: 46%
</style>
