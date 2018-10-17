<template lang="pug">

  div

    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    mr-griddle-list-view(
    v-if="sequences.length > 0",
    layout-style='sm',
    :buttons="['more-delete']",
    :items="sequences")
      template(slot="customButtons" slot-scope="{ video }")
        q-btn(flat, size="sm", round, icon="people", color="grey-5", @click="toggleItemFavorite(video)")

      template(slot="customMoreButtons" slot-scope="{ video }")
        q-item.q-px-sm
          q-btn(round, flat, size="sm", icon="edit", @click="$router.push(`/sequences/${video.map.uuid}/edit`)")

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
