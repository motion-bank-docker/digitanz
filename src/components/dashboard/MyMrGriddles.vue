<template lang="pug">
  .row
    // confirm-modal(ref="confirmDeleteModal", @confirm="deleteVideo")
    // hier component einfügen
    p
      router-link.page-link(:to="{path: path || 'mr-griddles'}") {{ $t('dates.' + date.id + '.page_link') }}

</template>

<script>
  import ConfirmModal from '../../components/ConfirmModal'
  export default {
    components: {
      ConfirmModal
    },
    methods: {
      // openDeleteModal (item) {
      //   this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      // }
    },
    props: [
      'date',
      'path'
    ],
    name: 'my-mr-griddles'
  }
</script>

<style scoped lang="stylus">
</style>
