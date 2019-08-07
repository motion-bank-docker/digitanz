<template lang="pug">
  q-page.bg-grey-3(style="margin-top: -1px;")
    .overflow-hidden(style="height: calc(100vh - 52px);")
      lost-in-space

    .absolute-top-right.q-ma-md
      q-btn.text-grey-9.bg-grey-3.shadow-1.q-mr-sm(@click="$router.push('/space-tool/create')", round, flat, size="sm")
        q-icon(name="edit", size="16px")
      q-btn.text-grey-9.bg-grey-3.shadow-1(@click="$router.push('/space-tool/list')", round, flat, size="sm")
        q-icon(name="clear", size="16px")
</template>

<script>
  import LostInSpace from '../../components/LostInSpace'
  export default {
    components: {
      LostInSpace
    }
  }
</script>

<style lang="stylus" scoped>
</style>
