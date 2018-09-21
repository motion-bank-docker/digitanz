<template lang="pug">
  .row
    // confirm-modal(ref="confirmDeleteModal", @confirm="deleteVideo")

    mr-griddle-list-view(layout-style='sm',
      :items="sequences")
      template(slot="customButtons" slot-scope="{ item }")
        q-btn(flat, size="sm" round,
        :icon="getItemStyle(item).icon", :color="getItemStyle(item).color"
        @click="toggleItemFavorite(item)")

        q-btn(flat, size="sm" round, icon="edit"
        @click="$router.push(`/mr-griddle/${item.target.id.split('/').pop()}/edit`)")

        q-btn(flat, size="sm" round, icon="delete"
        @click="openDeleteModal(item)")

    p
      router-link.page-link(:to="{path: path || 'mr-griddle'}") {{ $t('dates.' + date.id + '.page_link') }}

</template>

<script>
  import MrGriddleList from '../../pages/mr-griddles/list'

  export default {
    extends: MrGriddleList,
    props: [
      'date'
    ]
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
</style>
