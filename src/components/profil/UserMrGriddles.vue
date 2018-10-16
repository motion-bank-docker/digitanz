<template lang="pug">

  div

    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    mr-griddle-list-view(
    v-if="sequences.length > 0",
    layout-style='sm',
    :items="sequences")

    .text-center(v-else)
      loading-spinner

</template>

<script>
  import LoadingSpinner from '../LoadingSpinner'
  import MrGriddles from '../MrGriddles'

  export default {
    extends: MrGriddles,
    components: {
      LoadingSpinner
    }
  }
</script>

<style scoped>
</style>
