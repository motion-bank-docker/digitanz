<template lang="pug">
  q-page
      h3.text-center {{ $t('pages.team.headline') }}

      .row
        q-list.full-width
          q-item
            .col
              | Florian Jenett
            .col
              | florian@motionbank.org
              | 06131-628-2259

          q-item(separator)
            .col
              | Tim Bindel
            .col
              | tbindel@uni-mainz.de
              | 06131-39-23744

</template>

<script>
  export default {
  }
</script>

<style scoped lang="stylus">

</style>
