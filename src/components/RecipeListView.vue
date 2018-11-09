<template lang="pug">
  .row.justify-between
    recipe-item(
    v-for="item in items",
    :buttonsX="buttonsX",
    :buttonsY="buttonsY",
    :class="[size === 'sm' ? 'width-sm' : 'full-width']",
    :showContentFlag="showContentFlag",
    :item="item",
    :color="color"
    )
</template>

<script>
  import RecipeItem from './RecipeItem'

  export default {
    components: {
      RecipeItem
    },
    props: {
      buttonsX: Array,
      buttonsY: Array,
      items: Array,
      size: String,
      showContentFlag: Boolean,
      color: String
    }
  }
</script>

<style lang="stylus" scoped>
  .width-sm
    width: 46%
</style>
