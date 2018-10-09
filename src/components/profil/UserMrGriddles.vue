<template lang="pug">
  div
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    mr-griddle-list-view(
    v-if="sequences.length > 0",
    layout-style='sm',
    :items="sequences")

      template(slot="customButtons" slot-scope="{ item }")
        q-btn(flat, size="sm" round,
        :icon="getItemStyle(item).icon", :color="getItemStyle(item).color",
        @click="toggleItemFavorite(item)")

        q-btn(flat, size="sm" round, icon="edit",
        @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm" round, icon="delete",
        @click="openDeleteModal(item)")

    .text-center(v-else)
      q-spinner(:size="30")
</template>

<script>
  import allMrGriddles from '../dashboard/allMrGriddles'

  export default {
    extends: allMrGriddles
  }
</script>

<style scoped>
</style>
