<template lang="pug">
  .row.justify-between
    cloud-item(
    v-for="item in items",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :item="item",
    @emitLoadData="emitLoadData",
    style="width: 46%"
    )
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
      items: []
    },
    methods: {
      emitLoadData () {
        this.$emit('emitLoadData')
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
