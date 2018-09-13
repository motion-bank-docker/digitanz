<template lang="pug">
  div
    .row.q-mx-md
      video-list-view(
      v-if="portraits && portraits.items.length > 0",
      :videos="portraits.items", layoutStyle="sm",
      :buttons="['download']")
      // q-btn.full-width.bg-dark(@click="$router.push('dashboard-new')", label="portrait hinzufügen")

</template>

<script>
  import { PortraitsPlusPlus } from './'

  export default {
    name: 'dashboard-group-video-sequences',
    extends: PortraitsPlusPlus
  }
</script>

<style lang="stylus">
</style>
